import { BaseComponent } from './base.component';

export class TextboxComponent extends BaseComponent {
    async fill(value: string) {
        await this.locator.fill(value);
    }

    async press(key: string) {
        await this.locator.press(key);
    }
}
