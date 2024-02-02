export default abstract class Page extends EventTarget {
    #app: HTMLDivElement | null = null;
    protected get app(): HTMLDivElement {
        if (this.#app === null) throw new Error("app is not set");
        return this.#app;
    }

    protected append(html: string, parent: ParentNode = this.app) {
        const d = document.createElement("div");
        d.innerHTML = html;
        while (d.firstChild) parent.appendChild(d.firstChild);
    }

    private _setApp(app: HTMLDivElement) {
        this.#app = app;
    }

    public abstract matches(location: Location): boolean;

    public abstract open(): Promise<void>;

    public destroy(): void {
        while (this.app.firstChild) this.app.removeChild(this.app.firstChild);
    };

    private static readonly pages: Set<Page> = new Set();
    static #notFoundPage: Page | null = null;

    public static app: HTMLDivElement | null = null;

    public static add(...pages: Page[]) {
        for (const page of pages) {
            page._setApp(this.app!);
            this.pages.add(page);
        }
    }

    public static notFoundPage(page: Page) {
        page._setApp(this.app!);
        this.#notFoundPage = page;
    }

    static #current: Page | null = null;
    public static get current(): Page {
        if (this.#current === null) throw new Error("No page is open");
        return this.#current;
    }

    static #history: [string, string] = [location.href, location.href];
    public static get history(): URL {
        return new URL(this.#history[0]);
    }

    private static destroy() {
        if (this.#current !== null) this.#current.destroy();
    }

    private static getPage() {
        for (const page of this.pages) {
            if (page.matches(location)) {
                return page;
            }
        }
        if (this.#notFoundPage !== null) return this.#notFoundPage;
        else throw new Error("No page matches location; 404 page not defined");
    }

    public static open(updateHistory: boolean = true) {
        const page = this.getPage();
        this.destroy();
        if (updateHistory) this.#history = [this.#history[1], location.href];
        page.open().then();
        this.#current = page;

        // use history pushState on all links
        const links = ([...document.querySelectorAll('a[href]:not([target]), a[href][target="_self"]')] as HTMLAnchorElement[]).filter(link => location.origin === new URL(link.href).origin);

        for (const link of links) link.addEventListener("click", e => {
            if (e.ctrlKey) return;
            e.preventDefault();
            history.pushState(null, "", link.href);
            this.open();
        })
    }

    static {
        window.addEventListener("popstate", () => {
            this.open();
        });
    }
}
