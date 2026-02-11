import { BaseComponent } from './base.component';
import { Page, Locator, expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

import { TodoLocators } from '../ux/todo.ux';

export class TodoItemComponent extends BaseComponent {
    private readonly toggleLocator: Locator;
    private readonly destroyLocator: Locator;
    private readonly labelLocator: Locator;

    constructor(page: Page, world: CustomWorld, locator: Locator) {
        super(page, world, locator);
        this.toggleLocator = this.locator.locator(TodoLocators.TOGGLE);
        this.destroyLocator = this.locator.locator(TodoLocators.DESTROY);
        this.labelLocator = this.locator.locator(TodoLocators.LABEL);
    }

    async toggle() {
        await this.toggleLocator.check();
    }

    async isCompleted(): Promise<boolean> {
        return await this.toggleLocator.isChecked();
    }

    async expectCompleted() {
        await expect(this.toggleLocator).toBeChecked();
    }

    // TodoMVC: the ".destroy" button is revealed only on hover.
    // We hover first to make the element interactable and reduce flakiness.
    async delete() {
        await this.locator.hover();
        await this.destroyLocator.click();
    }

    async getText(): Promise<string> {
        return (await this.labelLocator.textContent()) || '';
    }
}
