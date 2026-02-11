import { Page } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TodoLocators } from '../ux/todo.ux';
import { TextboxComponent } from '../components/textbox.component';
import { ButtonComponent } from '../components/button.component';
import { TextComponent } from '../components/text.component';
import { TodoListComponent } from '../components/todo-list.component';
import { BaseComponent } from '../components/base.component';

export class TodoPage extends BaseComponent {
    private readonly inputBox: TextboxComponent;
    private readonly todoItems: TodoListComponent;
    private readonly todoCount: TextComponent;
    private readonly clearCompletedButton: ButtonComponent;

    constructor(page: Page, world: CustomWorld) {
        super(page, world, 'html');

        this.inputBox = new TextboxComponent(page, world, TodoLocators.INPUT_BOX);
        this.todoItems = new TodoListComponent(page, world, TodoLocators.TODO_ITEMS);
        this.todoCount = new TextComponent(page, world, TodoLocators.TODO_COUNT);
        this.clearCompletedButton = new ButtonComponent(page, world, TodoLocators.CLEAR_COMPLETED);
    }

    async addTask(text: string) {
        await this.inputBox.fill(text);
        await this.inputBox.press('Enter');
    }

    async completeTask(text: string) {
        const item = await this.todoItems.getItemByText(text);
        await item.toggle();
    }

    async verifyExpectedText(text: string) {
        await this.todoCount.expectText(text);
    }

    async verifyTaskCompleted(text: string) {
        const item = await this.todoItems.getItemByText(text);
        await item.expectCompleted();
    }

    async deleteAllTasks() {
        await this.todoItems.clearAll();
    }

    async shouldBeEmpty() {
        await this.todoItems.expectIsEmpty();
    }
}
