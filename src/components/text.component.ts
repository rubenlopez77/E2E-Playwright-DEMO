import { BaseComponent } from './base.component';
import { expect } from '@playwright/test';

export class TextComponent extends BaseComponent {
    async expectText(text: string) {
        await expect(this.locator).toHaveText(text);
    }

    async expectCount(count: number) {
        await expect(this.locator).toHaveCount(count);
    }

    getLocator() {
        return this.locator;
    }
}
