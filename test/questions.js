import fs from "node:fs/promises";
import path from "node:path";
import {strict as assert} from "node:assert";
import {marked} from "marked";
import {JSDOM} from "jsdom";
import child_process from "node:child_process";

/**
 * Get paths of all subdirectories (recursively)
 */
async function getSubdirs(dir) {
    const files = await fs.readdir(dir, {withFileTypes: true});
    const dirs = files
        .filter(file => file.isDirectory())
        .map(file => path.join(dir, file.name));
    const subdirs = await Promise.all(dirs.map(getSubdirs));
    return dirs.concat(subdirs.flat());
}

/**
 * Markdown to DOM
 */
async function mdToDom(md) {
    return new JSDOM(await marked(md)).window.document;
}

async function exec(cmd) {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (err, stdout) => {
            if (err) reject(err);
            else resolve(stdout);
        });
    });
}


const QUESTIONS_DIR = "./public/questions/";

describe("presence of `index.md` file in all question directories", function () {
    it("should check if all directories have an index.md file", async function () {
        const dirs = await getSubdirs(QUESTIONS_DIR);

        for (const dir of dirs) {
            const statResult = await fs.stat(path.join(dir, "index.md"));
            assert.ok(statResult.isFile(), `${path.join(dir, "index.md")}: must exist and be a file`);
        }
    });
    it("index.md should have a h1", async function () {
        const dirs = await getSubdirs(QUESTIONS_DIR);

        for (const dir of dirs) {
            const index = await fs.readFile(path.join(dir, "index.md"), "utf8");
            assert.ok(index.match(/^# /), `${path.join(dir, "index.md")}: must have a h1`);
        }
    });
});

describe("validate questions tree.json", function () {
    it("should be present", async function () {
        await fs.access(path.join(QUESTIONS_DIR, "tree.json"), fs.constants.R_OK);
    });

    it("should be up-to-date", async function () {
        const [tree, existing] = await Promise.all([
            exec("scripts/tree.js --dir " + QUESTIONS_DIR),
            fs.readFile(path.join(QUESTIONS_DIR, "tree.json"), "utf8"),
        ]);
        assert.equal(tree, existing);
    });
});

describe("validate questions", function () {
    it("all files should be `.md`", async function () {
        const dirs = await getSubdirs(QUESTIONS_DIR);

        for (const dir of dirs) {
            const files = await fs.readdir(dir, {withFileTypes: true});
            const badFile = files.find(file => !file.name.endsWith(".md") && !file.isDirectory());
            assert.ok(badFile === undefined, `${path.join(dir, badFile?.name ?? "UNKNOWN")}: must have .md extension`);
        }
    });

    it("question files must be `{number}.md` (or index.md)", async function () {
        const dirs = await getSubdirs(QUESTIONS_DIR);

        for (const dir of dirs) {
            const files = await fs.readdir(dir, {withFileTypes: true});
            const badFile = files.find(file => !file.name.match(/^\d+\.md$/) && file.name !== "index.md" && !file.isDirectory());
            assert.ok(badFile === undefined, `${path.join(dir, badFile?.name ?? "UNKNOWN")}: must be {number}.md (or index.md)`);
        }
    });

    it("questions should have sequential numbers", async function () {
        const dirs = await getSubdirs(QUESTIONS_DIR);

        for (const dir of dirs) {
            const files = (await fs.readdir(dir, {withFileTypes: true}))
                .filter(file => !file.isDirectory() && file.name !== "index.md")
                .map(file => Number(path.parse(file.name).name))
                .sort((a, b) => a - b);
            if (files.length === 0) continue;
            const last = files[files.length - 1];
            assert.ok(last === files.length, `${dir}: mismatch between number of questions and last question number; last: ${last}, length: ${files.length}`);
            for (let i = 0; i < files.length; i++) assert.equal(files[i], i + 1, `${path.join(dir, files[i] + ".md")}: expected to be ${i + 1}`);
        }
    });

    it("question files should not have non-printable characters", async function () {
        const disAllowedChars = /[^ -ϡϰ-ԯ‐-ₜ℀-⏿\n\t]/gm;
        const dirs = await getSubdirs(QUESTIONS_DIR);
        for (const dir of dirs) {
            const files = (await fs.readdir(dir, {withFileTypes: true})).filter(file => !file.isDirectory());
            for (const file of files) {
                const content = (await fs.readFile(path.join(dir, file.name), "utf8")).toLowerCase();
                const unprintable = content.match(disAllowedChars);
                assert.ok(unprintable === null, `${path.join(dir, file.name)}: contains unprintable characters: ${unprintable?.join("")}`);
            }
        }
    });

    it("questions should have h2", async function () {
        this.timeout(6000);
        const dirs = await getSubdirs(QUESTIONS_DIR);
        for (const dir of dirs) {
            const files = (await fs.readdir(dir, {withFileTypes: true})).filter(file => !file.isDirectory());
            for (const file of files) {
                if (file.name === "index.md") continue;
                const dom = await mdToDom(await fs.readFile(path.join(dir, file.name), "utf8"));
                const h2 = dom.querySelector("h2");
                assert.ok(h2 !== null, `${path.join(dir, file.name)}: question task must be in h2`);
                assert.ok(h2.textContent.trim().length >= 1, `${path.join(dir, file.name)}: question task must have text (at least one character)`);
            }
        }
    });

    it("questions should have 4 choices", async function () {
        this.timeout(6000);
        const dirs = await getSubdirs(QUESTIONS_DIR);
        for (const dir of dirs) {
            const files = (await fs.readdir(dir, {withFileTypes: true})).filter(file => !file.isDirectory());
            for (const file of files) {
                if (file.name === "index.md") continue;
                const dom = await mdToDom(await fs.readFile(path.join(dir, file.name), "utf8"));
                const lis = dom.querySelectorAll("li");
                assert.ok(lis.length === 4, `${path.join(dir, file.name)}: must have 4 choices`);
                console.assert([...lis].every(li => li.textContent.trim().length >= 1 || li.querySelector("img") !== null), `${path.join(dir, file.name)}: all choices must have text (at least one character)`);
            }
        }
    });

    it("questions should have exactly 1 correct answer", async function () {
        this.timeout(6000);
        const dirs = await getSubdirs(QUESTIONS_DIR);
        for (const dir of dirs) {
            const files = (await fs.readdir(dir, {withFileTypes: true})).filter(file => !file.isDirectory());
            for (const file of files) {
                if (file.name === "index.md") continue;
                const dom = await mdToDom(await fs.readFile(path.join(dir, file.name), "utf8"));
                console.assert(dom.querySelectorAll("li input[type=checkbox][checked]").length === 1, `${path.join(dir, file.name)}: must have exactly 1 correct answer`);
            }
        }
    });
});
