import { BaseComponent } from './base.component';

export class CheckboxComponent extends BaseComponent {
    async check() {
        await this.locator.check();
    }
}
