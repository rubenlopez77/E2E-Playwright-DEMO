import { Page, Browser, BrowserContext } from '@playwright/test';
import { CustomWorld } from './world';

declare module '@cucumber/cucumber' {
    interface World {
        browser?: Browser;
        context?: BrowserContext;
        page?: Page;
        on<T>(type: new (page: Page, world: CustomWorld) => T): T;
    }
}
