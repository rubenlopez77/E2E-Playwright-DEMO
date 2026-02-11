const isCI = process.env.CI || !process.stdout.isTTY;
const prettyFormatter = isCI ? 'progress' : 'progress-bar';

module.exports = {
    default: {
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
        format: ['summary', prettyFormatter, 'html:cucumber-report.html'],
        parallel: 2
    }
}
