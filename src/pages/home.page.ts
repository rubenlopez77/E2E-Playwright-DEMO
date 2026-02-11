import { Page } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { BasePage } from './base.page';
import { TextboxComponent } from '../components/textbox.component';
import { TodoLocators } from '../ux/todo.ux';

export class HomePage extends BasePage {
    private readonly newTodoInput: TextboxComponent;

    constructor(page: Page, world: CustomWorld) {
        super(page, world);
        this.newTodoInput = new TextboxComponent(page, world, TodoLocators.INPUT_BOX);
    }

    async open(): Promise<void> {
        const baseURL = process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/';
        await this.goto(baseURL);
        await this.newTodoInput.expectVisible();
    }

}