import { BaseComponent } from './base.component';

export class ButtonComponent extends BaseComponent {
    async click() {
        await this.locator.click();
    }

    async hover() {
        await this.locator.hover();
    }
}
