import { BaseComponent } from './base.component';
import { TodoItemComponent } from './todo-item.component';
import { expect } from '@playwright/test';

import { TodoLocators } from '../ux/todo.ux';

export class TodoListComponent extends BaseComponent {

    getItem(index: number): TodoItemComponent {
        return new TodoItemComponent(this.page, this.world, this.locator.nth(index));
    }

    async getItemByText(text: string): Promise<TodoItemComponent> {
        const normalized = text.trim();
        const candidates = this.locator.filter({
            has: this.page.locator(TodoLocators.LABEL, { hasText: normalized }),
        });

        await expect(candidates, `Todo item "${normalized}" should exist`).toHaveCount(1);
        return new TodoItemComponent(this.page, this.world, candidates.first());
    }

    async count(): Promise<number> {
        return await this.locator.count();
    }

    async isEmpty(): Promise<boolean> {
        return (await this.count()) === 0;
    }

    async clearAll(): Promise<void> {

        const initialTotal = await this.locator.count();
        if (initialTotal === 0) return;

        for (let i = 0; i < initialTotal; i++) {
            const remaining = await this.locator.count();
            if (remaining === 0) return;

            const firstItem = this.locator.first();
            const destroyButton = firstItem.locator(TodoLocators.DESTROY);

            await firstItem.hover();
            await expect(destroyButton).toBeVisible();
            await destroyButton.click();
            await expect(this.locator).toHaveCount(remaining - 1);
        }

        await expect(this.locator).toHaveCount(0);
    }

    async expectIsEmpty(): Promise<void> {
        await expect(this.locator).toHaveCount(0);
    }



}
