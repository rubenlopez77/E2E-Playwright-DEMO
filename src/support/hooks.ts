/**
 * Hooks wire the custom fixture lifecycle to each scenario.
 *
 * Before: initializes browser/context/page (scenario isolation => parallel-safe).
 * After: performs deterministic cleanup and attaches evidence on failure.
 * This keeps step definitions declarative and avoids ad-hoc setup in tests.
 */
import { Before, After, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import * as fs from 'node:fs';
import * as path from 'node:path';

setDefaultTimeout(60 * 1000); //

After({ tags: '@cleanup' }, async function (this: CustomWorld) {
    try {
        await this.page?.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    } catch { }
});


Before(async function (this: CustomWorld) {
    await this.init();
});

After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status === Status.FAILED) {
        const screenshotPath = path.resolve('test-results', 'screenshots');
        if (!fs.existsSync(screenshotPath)) {
            fs.mkdirSync(screenshotPath, { recursive: true });
        }

        const screenshotName = `${scenario.pickle.name.replace(/\W/g, '_')}_${process.pid}_${Date.now()}.png`;
        const screenshotFile = path.join(screenshotPath, screenshotName);

        try {
            const image = await this.page?.screenshot({ path: screenshotFile, fullPage: true });
            if (image) this.attach(image, 'image/png');
        } catch { }
    }
    /**
     * Despite not explicitly requested, I considered it essential that every test produces traceable artifacts.
     * For that reason, I implemented a basic tracing and logging capability as a foundational quality practice.
     */
    const status = scenario.result?.status;
    const shouldSaveTrace = process.env.TRACE === 'true' || status === Status.FAILED;

    try {
        if (shouldSaveTrace) {
            const traceDir = path.resolve('test-results', 'traces');
            await fs.promises.mkdir(traceDir, { recursive: true });

            const traceName = `${scenario.pickle.name.replace(/\W/g, '_')}_${process.pid}_${Date.now()}.zip`;
            const traceFile = path.join(traceDir, traceName);

            await this.context?.tracing.stop({ path: traceFile });

            try {
                const buf = await fs.promises.readFile(traceFile);
                this.attach(buf, 'application/zip');
            } catch (e) {
                this.attach(`Trace saved but not be attached: ${String(e)}`, 'text/plain');
            }
        } else {
            await this.context?.tracing.stop();
        }

        if (status === Status.FAILED && this.consoleLogs.length > 0) {
            this.attach(this.consoleLogs.join('\n'), 'text/plain');
        }
    } catch (e) {
        this.attach(`Teardown/tracing failed: ${String(e)}`, 'text/plain');
    } finally {
        await this.close();
    }
});

AfterAll(async function () {
    await CustomWorld.closeBrowser();
});
