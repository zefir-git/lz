#!/usr/bin/env node
import fs from "node:fs/promises";

if (process.argv.includes("--help")) {
    const help = `Usage: parse.js [options]
Parse questions from standard input and output to standard output or file

Options:
    -c        attempt to detect, separate, and parse multiple questions
    -o <file> write to file instead of stdout.
                Use {number} in the path to get the question number
    --md      output as markdown
    --json    output as JSON
    --help    display this help and exit

This is designed to work with questions from the PDF files from CRC. Some
questions might be badly formatted and may require to be parsed by hand.
`;
    process.stdout.write(help);
    process.exit(0);
}

function parseInput(input) {
    const number = input.split(".")[0].trim();
    const q = input.slice(number.length + 2, input.indexOf("\nА. "));
    const answers = input.slice(q.length + number.length + 3).replaceAll("\n", " ").split(/\s?[А-Г]\.\s/).filter(l => l).map(l => l.replace(/(;|.)$/, "").trim());
    let correct;
    try {
        correct = ["А", "Б", "В", "Г"].indexOf(q.match(/\s\([А-Г]\)$/)[0].trim().replace(/[()]/g, ""));
    }
    catch (e) {
        try {
            correct = ["A", "--", "B", "--"].indexOf(q.match(/\s\(([AB])\)$/)[0].trim().replace(/[()]/g, ""));
        }
        catch (e2) {
            console.error(e);
            throw e2;
        }
    }
    const question = q.replaceAll("\n", " ").replace(/\s\([А-Г]\)$/, "");

    return {
        number,
        question,
        answers,
        correct
    }
}

function outJSON(data) {
    return JSON.stringify(data);
}

function outMD(data) {
    return `## ${data.question}

<!-- Верният отговор е отбелязан с [X] -->

${data.answers.map((a, i) => `- [${i === data.correct ? "X" : " "}] ${a}`).join("\n")}`
}

async function out(data, meta) {
    const outIndex = process.argv.indexOf("-o");
    let location = (outIndex !== -1 && process.argv.length > outIndex + 1) ? process.argv[outIndex + 1] : null;
    if (location == null) process.stdout.write(data + "\n");
    else {
        const path = location.replace("{number}", meta.number);
        process.stdout.write("Saving to " + path + "\n");
        await fs.writeFile(path, data + "\n", "utf8");
    }
}

// read input from stdin
process.stdin.setEncoding('utf8');
process.stdin.on('readable', async () => {
    let input = process.stdin.read()?.trim();
    if (input) {
        const output = {
            "--md": outMD,
            "--json": outJSON
        }
        if (process.argv.includes("-c")) input = input.replace(/(\n\d+\.\s)/gm, "\n$1");
        const parsed = input.split("\n\n").map(l => parseInput(l.trim()));
        for (const [flag, fn] of Object.entries(output)) {
            if (process.argv.includes(flag)) {
                for (const line of parsed) await out(fn(line), line);
                return;
            }
        }
        for (const line of parsed) await out(outJSON(line), line);
    }
})
