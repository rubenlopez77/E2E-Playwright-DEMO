/**
 * Custom Cucumber World
 *
 * Key design decision: each scenario gets a fresh BrowserContext (and Page),
 * which isolates cookies/localStorage and makes the suite parallel-safe.
 * Environment is configurable via env vars (browser/headless/baseUrl) so tests
 * run the same locally and in CI.
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit, BrowserType } from '@playwright/test';
import 'dotenv/config';
import './types';

export class CustomWorld extends World {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    consoleLogs: string[] = [];


    private readonly pageCache = new Map<string, any>();
    private static browserPromise: Promise<Browser> | undefined;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async init() {
        if (!CustomWorld.browserPromise) {
            const browserName = process.env.BROWSERS || 'chromium';
            const headless = process.env.HEADLESS === 'true';

            let browserType: BrowserType;
            switch (browserName) {
                case 'firefox':
                    browserType = firefox;
                    break;
                case 'webkit':
                    browserType = webkit;
                    break;
                default:
                    browserType = chromium;
                    break;
            }
            CustomWorld.browserPromise = browserType.launch({ headless });
        }

        this.browser = await CustomWorld.browserPromise;

        const baseURL = process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/';
        this.context = await this.browser.newContext({ baseURL });
        await this.context.tracing.start({ screenshots: true, snapshots: true });
        this.page = await this.context.newPage();
        this.page.on('console', msg => this.consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

    }

    async close() {
        try { await this.page?.close(); } catch { }
        try { await this.context?.close(); } catch { }
        this.pageCache.clear();
    }


    static async closeBrowser() {
        if (CustomWorld.browserPromise) {
            const browser = await CustomWorld.browserPromise;
            await browser.close();
            CustomWorld.browserPromise = undefined;
        }
    }

    on<T>(type: new (page: Page, world: CustomWorld) => T): T {
        const typeName = type.name;
        if (!this.pageCache.has(typeName)) {
            this.pageCache.set(typeName, new type(this.page!, this));
        }
        return this.pageCache.get(typeName);
    }
}


setWorldConstructor(CustomWorld);
