#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import {JSDOM} from "jsdom";
import {marked} from "marked";

if (process.argv.includes("--help")) {
    const help = `Usage: tree.js [options]
Index categories of questions and create a JSON tree

Options:
    --dir <path>  directory with questions
    --pretty      format JSON before printing
    -o            output "tree.json" in questions directory
    --help        display this help and exit

Categories must have an index.md file with name/title (# Title) and optionally a
subtitle (## Subtitle). The questions in a category must have consecutive
numbers. A category must either have questions or subcategories with questions.
`;
    process.stdout.write(help);
    process.exit(0);
}

/**
 * Markdown to DOM
 */
async function mdToDom(md) {
    return new JSDOM(await marked(md)).window.document;
}

/**
 * Get question categories (folders)
 */
async function getQuestions(dir) {
    const tree = {};

    async function getTree(location) {
        const result = {};
        const doc = await mdToDom(await fs.readFile(path.join(location, "index.md"), "utf8"));
        result.name = doc.querySelector("h1").textContent;
        result.subtitle = doc.querySelector("h2")?.textContent ?? null;
        const entries = await fs.readdir(location, {withFileTypes: true});
        const files = entries
            .filter(file => !file.isDirectory())
            .map(file => path.join(location, file.name));
        if (files.filter(f => f !== "index.md").length > 1) {
            result.questions = files.length - 1;
            return result;
        }
        else {
            const dirs = entries
                .filter(file => file.isDirectory())
                .map(file => path.join(location, file.name));
            result.categories = {};
            for (const dir of dirs)
                result.categories[path.basename(dir)] = await getTree(dir);
            return result;
        }
    }

    const dirs = (await fs.readdir(dir, {withFileTypes: true}))
        .filter(file => file.isDirectory())
        .map(file => path.join(dir, file.name));
    for (const dir of dirs)
        tree[path.basename(dir)] = await getTree(dir);
    return tree;
}

// get "--dir <path>" argument
let dir = "questions";
const dirArgIndex = process.argv.indexOf("--dir");
if (dirArgIndex >= 0 && process.argv.length > dirArgIndex + 1)
    dir = process.argv[dirArgIndex + 1];

const d = await getQuestions(dir);
const data = (process.argv.includes("--pretty") ? JSON.stringify(d, null, 2) : JSON.stringify(d)) + "\n";
if (process.argv.includes("-o")) await fs.writeFile(path.join(dir, "tree.json"), data, "utf8");
else process.stdout.write(data);
