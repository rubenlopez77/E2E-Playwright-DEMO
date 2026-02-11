import { Given, When, Then } from '@cucumber/cucumber';
import { TodoPage } from '../pages/todo.page';
import { HomePage } from '../pages/home.page';

Given('I am on the TodoMVC page', async function () {
    await this.on(HomePage).open();
});

When('I add a task {string}', async function (taskName: string) {
    await this.on(TodoPage).addTask(taskName);
});

When('I mark the task {string} as completed', async function (taskName: string) {
    await this.on(TodoPage).completeTask(taskName);
});

Then('the active task text should be {string}', async function (expectedText: string) {
    await this.on(TodoPage).verifyExpectedText(expectedText);
});

Then('the task {string} should be completed', async function (taskName: string) {
    await this.on(TodoPage).verifyTaskCompleted(taskName);
});

When('I reload the page', async function () {
    await this.on(TodoPage).reload();
});

When('I delete all tasks', async function () {
    await this.on(TodoPage).deleteAllTasks();
});

Then('the task list should be empty', async function () {
    await this.on(TodoPage).shouldBeEmpty();
});
