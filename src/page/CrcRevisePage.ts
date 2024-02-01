import Page from "./Page.ts";
import Question from "../Question.ts";

export default class CrcRevisePage extends Page {
    public override matches(location: Location) {
        return location.pathname.replace(/\/*$/, "") === "/crc/revise";
    }

    public override async open() {
        this.app.ownerDocument.title = "Радиолюбителски Преговор";
        this.app.innerHTML = `
<div class="min-h-screen flex flex-col">
  <nav class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between gap-8 w-full">
    <div class="flex gap-8">
      <a href="/" class="text-sm font-display font-semibold leading-6 text-gray-900">Home</a>
    </div>
  </nav>
  <header class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h1 class="text-5xl font-bold">Радиолюбителски Преговор</h1>
    <p class="text-lg text-gray-500 mt-6">Тази страница служи за подготовка за тестовете от КРС за провеждане на изпити за правоспособност на радиолюбители.</p>
    <form id="options">
        <details class="mt-8 border border-gray-200 rounded-2xl group">
          <summary class="marker:content-none p-4 flex items-center gap-2 cursor-pointer select-none">
            <svg class="w-5 h-5 group-open:rotate-90 transition-transform duration-200 ease-in-out" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
            </svg>
            <span class="text-sm font-display font-semibold leading-6 text-gray-900">Опции</span>
          </summary>
          <div class="p-4 pt-0 flex flex-col gap-6">
            <div class="flex flex-col gap-4" id="question-categories"></div>
            <fieldset>
              <div class="flex items-baseline gap-3 justify-between">
                <div class="relative flex items-start">
                  <div class="flex h-6 items-center">
                    <input id="random-order" name="random-order" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600">
                  </div>
                  <div class="ml-3 text-sm leading-6">
                    <label for="random-order">
                      <p class="font-medium text-gray-900">Разбъркай върпросите</p>
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </details>
        <div class="flex justify-center mt-8">
      <fieldset class="flex gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
        <div class="group">
          <label class="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:text-white">
            <input type="radio" name="revise-type" value="flashcards" class="sr-only">
            <span>Флаш карти</span>
          </label>
        </div>
        <div class="group">
          <label class="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:text-white">
            <input type="radio" name="revise-type" value="answers" class="sr-only">
            <span>Отговори</span>
          </label>
        </div>
      </fieldset>
    </div>
    </form>
  </header>
  <main class="relative bg-gray-50 h-full grow">
    <div class="pointer-events-none absolute inset-0 shadow-[inset_0_1px_1px_rgba(0,0,0,0.06)]"></div>
    <div class="max-w-2xl mx-auto p-8"><div class="gap-10 flex flex-col mt-8" id="questions"></div></div>
  </main>
</div>

        `;
        const tree = await Question.tree();
        const questionCategories = this.app.querySelector("#question-categories")!;
        const options = JSON.parse(localStorage.getItem("revise-options") ?? "[]") as string[];
        const reviseType = localStorage.getItem("revise-type");
        if (options.includes("random-order")) document.querySelector<HTMLInputElement>("#random-order")!.checked = true;
        if (reviseType !== null) {
            for (const option of document.querySelectorAll<HTMLInputElement>("[name=revise-type]")) option.checked = false;
            document.querySelector<HTMLInputElement>("[name=revise-type][value=" + reviseType + "]")!.checked = true;
        }
        else document.querySelector<HTMLInputElement>("[name=revise-type][value=answers]")!.checked = true;
        document.querySelector("form#options")!.addEventListener("submit", () => {
            this.resetQuestions();
            this.renderQuestions(tree)
        });

        /**
         * Get all final categories in a sub-category
         */
        function getFinal(cat: Question.TreeSubCategory, id: string): Record<string, Question.TreeFinalCategory> {
            let final: Record<string, Question.TreeFinalCategory> = {};
            for (const [catID, category] of Object.entries(cat.categories) as [string, Question.TreeSubCategory | Question.TreeFinalCategory][]) {
                const localId = id + "/" + catID;
                if ("questions" in category) final[localId] = category;
                else final = {...final, ...getFinal(category, localId)};
            }

            return final;
        }

        if (tree.name !== undefined) questionCategories.remove();
        else for (const [catID, category] of Object.entries(tree) as [string, Question.TreeSubCategory | Question.TreeFinalCategory][]) {
            if ("questions" in category) break;
            const fieldset = document.createElement("fieldset");

            const legend = document.createElement("legend");
            legend.className = "font-medium text-gray-900 text-xs";
            legend.textContent = category.name + " въпроси";
            fieldset.appendChild(legend);

            const div = document.createElement("div");
            div.className = "flex items-baseline gap-6 mt-2";
            fieldset.appendChild(div);


            const final = getFinal(category, catID);
            for (const [finalID, finalCategory] of Object.entries(final) as [string, Question.TreeFinalCategory][]) {
                const normalisedID = finalID.replace(/\W+/g, " ").trim().replace(/\s+/g, "-");
                const t = document.createElement("div");
                t.innerHTML = `<div class="relative flex items-start"><div class="flex h-6 items-center"><input id="${normalisedID}"${category.subtitle !== null ? ` aria-describedby="${normalisedID}-description"` : ""} name="${catID}" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"${options.includes(normalisedID) || !localStorage.getItem("revise-options") ? " checked" : ""}></div><div class="ml-3 text-sm leading-6"><label for="${normalisedID}"><p class="font-medium text-gray-900">${finalCategory.name}</p>${finalCategory.subtitle !== null ? `<p id="${normalisedID}-description" class="text-gray-500">${finalCategory.subtitle}</p>` : ""}</label></div></div>`;
                div.appendChild(t.firstElementChild!);
            }

            questionCategories.appendChild(fieldset);
        }
        this.resetQuestions();
        this.renderQuestions(tree).then();
        this.initInfiniteScroll(tree);

        /**
         * Remember checked boxes in local storage as JSON array in key `revise-options`
         */
        const optionCheckboxes = document.querySelectorAll<HTMLInputElement>("#options input[type=checkbox]");
        for (const option of optionCheckboxes) {
            option.addEventListener("change", () => {
                localStorage.setItem("revise-options", JSON.stringify(Array.from(optionCheckboxes).filter(o => o.checked).map(o => o.id)));
                this.resetQuestions();
                this.renderQuestions(tree);
            });
        }
        const reviseTypeRadios = document.querySelectorAll<HTMLInputElement>("#options input[type=radio][name=revise-type]");
        for (const reviseTypeRadio of reviseTypeRadios) {
            reviseTypeRadio.addEventListener("change", () => {
                localStorage.setItem("revise-type", reviseTypeRadio.value);
                this.resetQuestions();
                this.renderQuestions(tree);
            });
        }
    }

    private page = 0;

    public resetQuestions() {
        this.page = 0;
        const questionsContainer = this.app.querySelector("#questions")!;
        while (questionsContainer.firstChild) questionsContainer.removeChild(questionsContainer.firstChild);
    }

    public async renderQuestions(tree: Question.Tree) {
        // get checked categories
        const checkedCategories = Array.from(document.querySelectorAll<HTMLInputElement>("#question-categories input[type=checkbox]")).filter(c => c.checked).map(c => c.id.replace(/-/g, "/"));
        const questionsContainer = this.app.querySelector("#questions")!;
        for (const catID of checkedCategories) {
            const cat = Question.cat(tree, catID);
            if (!("questions" in cat)) continue;
            const questions = await Question.getCategoryQuestions(catID, cat as Question.TreeFinalCategory, "/questions", 10, ++this.page, tree);
            for (const question of questions)
                this.append(document.querySelector<HTMLInputElement>("#options input[type=radio][name=revise-type]:checked")!.value === "flashcards" ? question.renderFlashCard() : question.renderRevise(), questionsContainer);
        }
    }

    private ifiniteScrollLastActivated: number = 0;

    private initInfiniteScroll(tree: Question.Tree) {
        window.addEventListener("scroll", () => {
            const now = Date.now();
            if (now - this.ifiniteScrollLastActivated < 2000) return;
            if (this.handleInfiniteScroll(tree)) this.ifiniteScrollLastActivated = now;
        })
    }

    private handleInfiniteScroll(tree: Question.Tree): boolean {
        // if scrollbar is near the bottom
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) {
            this.renderQuestions(tree).then();
            return true;
        }
        return false;
    }
}
