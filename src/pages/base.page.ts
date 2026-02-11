import { Page } from '@playwright/test';
import { CustomWorld } from '../support/world';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly world: CustomWorld
  ) { }

  protected async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForNetworkIdle();
  }

  protected async waitForDomReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
