/**
 * Components layer (in addition to Page Objects)
 *
 * Components encapsulate small, reusable UI building blocks (locators + actions + assertions).
 * This reduces duplication, limits the blast radius of UI changes, and keeps Pages focused on
 * higher-level flows. It also creates a clean place to standardize logging/telemetry later.
 * 
 * Each component action can emit a structured JSON event (what action, on which element, 
 * input data, result, duration) and attach evidence (screenshots / DOM snapshots). 
 * With this, it is easy to build consistent reports and quality metrics without adding 
 * logging code inside steps.
 */

import { Locator, Page, expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

export abstract class BaseComponent {
    protected locator: Locator;

    constructor(
        protected page: Page,
        protected world: CustomWorld,
        selector: string | Locator
    ) {
        if (typeof selector === 'string') {
            this.locator = page.locator(selector);
        } else {
            this.locator = selector;
        }
    }

    async isVisible(): Promise<boolean> {
        return await this.locator.isVisible();
    }

    async expectVisible(options?: { timeout?: number }) {
        await expect(this.locator).toBeVisible(options);
    }

    async expectVisibleSoft(options?: { timeout?: number }) {
        await expect.soft(this.locator).toBeVisible(options);
    }

    async waitReady() {
        await this.locator.waitFor({ state: 'visible' });
    }

    async navigate(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
        await this.page.goto(url, options);
        await this.waitForDomReady();
    }

    async reload(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
        await this.page.reload(options);
        await this.waitForDomReady();
    }

    async waitForDomReady() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }
}
