const chalk = require('chalk');

function setupAntiCrash() {
    process.on('unhandledRejection', (reason, promise) => {
        console.log(chalk.red('═══════════ Unhandled Rejection ═══════════'));
        console.log(reason);
        console.log(chalk.red('═════════════════════════════════════════\n'));
    });

    process.on('uncaughtException', (error, origin) => {
        console.log(chalk.red('═══════════ Uncaught Exception ═══════════'));
        console.log(error);
        console.log(chalk.red('═════════════════════════════════════════\n'));
    });

    process.on('uncaughtExceptionMonitor', (error, origin) => {
        console.log(chalk.red('═══════════ Uncaught Exception Monitor ═══════════'));
        console.log(error);
        console.log(chalk.red('═══════════════════════════════════════════════\n'));
    });
}

module.exports = { setupAntiCrash };
