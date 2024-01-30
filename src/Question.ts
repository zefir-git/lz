import {marked} from "marked";

class Question {
    public constructor(
        public readonly id: string,
        public readonly task: string,
        public readonly answers: [Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer],
        public readonly category?: string
    ) {}

    public get correctAnswer(): Question.ImageAnswer | Question.TextAnswer {
        return this.answers.find(answer => answer.correct)!;
    }

    public get imageQuestion(): boolean {
        return this.answers.every(answer => answer instanceof Question.ImageAnswer);
    }

    public randomAnswers() {
        return new Question(this.id, this.task, Question.randomSort<Question.ImageAnswer | Question.TextAnswer>(this.answers) as [Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer, Question.ImageAnswer | Question.TextAnswer]);
    }

    public renderFlashCard() {
        const correct = this.correctAnswer;
        return `<div class="group">
        <div class="bg-white p-8 rounded-2xl shadow relative cursor-pointer group-hover:flip transition-transform duration-300 preserve-3d">
          <div class="backface-hidden">
            <div class="absolute top-2 right-2 p-2 rounded-full bg-white/50 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"></path></svg></div>
            <p class="text-base font-semibold leading-6 text-gray-900">${this.task}</p>
            ${this.category !== undefined ? `<p class="text-xs text-gray-400 italic mt-1">${this.category}</p>` : ""}
          </div>
          ${correct instanceof Question.ImageAnswer ?
            `<div class="flex items-center justify-center flip backface-hidden absolute inset-0 w-full h-full bg-white rounded-[inherit] p-6"><img class="h-full" src="${correct.url}""></div>`
            : `<div class="flex gap-3 items-center text-green-600 flip backface-hidden absolute inset-0 w-full justify-center bg-white rounded-[inherit] p-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg><p class="font-medium text-lg">${correct.text}</p></div>`}
        </div>
      </div>`;
    }

    public renderRevise() {
        const correct = this.correctAnswer;
        return `<div class="bg-white p-8 rounded-2xl shadow">
            <h2 class="text-base font-semibold leading-6 text-gray-900">${this.task}</h2>
            ${this.category !== undefined ? `<p class="text-xs text-gray-400 italic mt-1">${this.category}</p>` : ""}
            ${correct instanceof Question.ImageAnswer ?
                `<img class="w-32 mt-8" src="${correct.url}">`
                : `<div class="flex mt-8 gap-3 items-start text-green-600"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"></path></svg><p class="font-medium">${correct.text}</p></div>`}
        </div>`;
    }

    public static async parse(id: string, question: string, tree?: Question.Tree) {
        const html = await marked(question);
        const d = document.createElement("div");
        d.innerHTML = html;
        const task = d.querySelector("h2")!.textContent!;
        const answers = [...d.querySelectorAll("li")];
        const correct = answers.findIndex(a => a.querySelector<HTMLInputElement>("input[type=checkbox]")!.checked);
        if (correct < 0 || correct > 3) throw new Error("No valid correct answer detected");
        const imageAnswers = answers.every(a => a.querySelector("img") !== null);
        const catName = tree ? Question.catName(tree, id) : undefined;
        if (imageAnswers) {
            const [a1, a2, a3, a4] = answers.map((e, i) => new Question.ImageAnswer(e.querySelector("img")!.getAttribute("src")!, i === correct));
            return new Question(id, task, [a1, a2, a3, a4], catName);
        }
        else {
            const [a1, a2, a3, a4] = answers.map((e, i) => new Question.TextAnswer(e.textContent!.trim(), i === correct));
            return new Question(id, task, [a1, a2, a3, a4], catName);
        }
    }

    public static async tree(path: string = "/questions"): Promise<Question.Tree> {
        const res = await fetch(path + "/tree.json");
        return await res.json();
    }

    /**
     * Join names of categories
     */
    public static catName(tree: Question.Tree | Question.TreeCategory, path: string, current: string[] = []): string {
        const parts = path.split("/");
        if (parts.length === 1 && !Number.isNaN(Number.parseInt(parts[0]))) {
            current.push("Въпрос " + parts[0]);
            return current.join(", ");
        }
        const cat: Question.TreeCategory = "categories" in tree ? (tree as any as Question.TreeSubCategory).categories[parts[0]] : (tree as any)[parts[0]] as Question.TreeCategory;
        const name = cat.name;
        current.push(name);
        if (parts.length === 1) return current.join(", ");
        return this.catName(cat, parts.slice(1).join("/"), current);
    }

    /**
     * Get category from tree by path
     */
    public static cat(tree: Question.Tree | Question.TreeCategory, path: string): Question.TreeCategory {
        if ("questions" in tree) throw new Error("Tree is final category");
        const parts = path.split("/");
        const cat: Question.TreeCategory = "categories" in tree ? (tree as any as Question.TreeSubCategory).categories[parts[0]] : (tree as any)[parts[0]] as Question.TreeCategory;
        if (parts.length === 1) return cat;
        return this.cat(cat, parts.slice(1).join("/"));
    }

    public static async getQuestion(number: number, category: string = "", dir: string = "/questions", tree?: Question.Tree) {
        const res = await fetch(dir + "/" + category + "/" + number + ".md");
        return await this.parse(category + "/" + number, await res.text(), tree);
    }

    public static async getCategoryQuestions(id: string, category: Question.TreeFinalCategory, dir: string = "/questions", limit: number | null = null, page: number = 1, tree?: Question.Tree) {
        const questionIds = Array.from({length: category.questions}, (_, i) => i + 1);
        const finalQuestions = limit === null ? questionIds : questionIds.slice(page * limit - limit, page * limit);
        return await Promise.all(finalQuestions.map(q => this.getQuestion(q, id, dir, tree)));
    }

    private static random(min: number, max: number, not: number[] = []): number {
        if (!crypto) {
            const res = Math.floor(Math.random() * (max - min + 1)) + min;
            return not.includes(res) ? this.random(min, max, not) : res;
        }
        const res = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * (max - min + 1)) + min;
        return not.includes(res) ? this.random(min, max, not) : res;
    }

    private static randomSort<T>(arr: T[]) {
        const randomValues = crypto.getRandomValues(new Uint32Array(arr.length));
        return Array.from({ length: arr.length }, (_, index) => index).sort((a, b) => randomValues[a] - randomValues[b]).map(index => arr[index]);
    }

    public static async getRandomQuestions(categories: Record<string, Question.TreeFinalCategory>, dir: string = "/questions", limit: number | null = null, not: string[] = []) {
        if (limit === null) limit = Object.values(categories).reduce((a, b) => a + b.questions, 0);
        let fails = 0;
        const questions: {id: string, cat: Question.TreeFinalCategory, question: number, qid: string}[] = [];
        for (let i = 0; i < limit; ++i) {
            try {
                questions.push(this.randomQuestion(categories, [...not, ...questions.map(q => q.qid)], 5));
            }
            catch (e) {
                ++fails;
                if (fails > Math.min(limit, 20)) break;
            }
        }
        return await Promise.all(questions.map(q => this.getQuestion(q.question, q.id, dir)));
    }

    private static randomQuestion(categories: Record<string, Question.TreeFinalCategory>, not: string[] = [], attempts: number = 5): {id: string, cat: Question.TreeFinalCategory, question: number, qid: string} {
        if (attempts <= 0) throw new Error("Too many attempts");
        const [id, cat] = Object.entries(categories)[this.random(0, Object.keys(categories).length - 1)];
        const question = this.random(1, cat.questions);
        const qid = id + "/" + question;
        return !not.includes(qid) ? {id, cat, question, qid} : this.randomQuestion(categories, not, --attempts);
    }
}

namespace Question {
    export interface TreeCategory {
        name: string;
        subtitle: string;
    }

    export interface TreeSubCategory extends TreeCategory {
        categories: Record<string, TreeSubCategory | TreeFinalCategory>;
    }

    export interface TreeFinalCategory extends TreeCategory {
        questions: number;
    }
    export type Tree = Record<string, TreeSubCategory | TreeFinalCategory> | TreeFinalCategory;

    export abstract class Answer {
        protected constructor(public correct: boolean) {}
    }

    export class TextAnswer extends Answer {
        public constructor(public text: string, correct: boolean) {
            super(correct);
        }
    }

    export class ImageAnswer extends Answer {
        public constructor(public url: string, correct: boolean) {
            super(correct);
        }
    }
}

export default Question;
