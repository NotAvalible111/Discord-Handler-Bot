module.exports = (db) => {

    // Crtl + C
    process.on('SIGINT', () => {
        console.log();
        error('ONI-CHAN, APAGANDO TODO UWU...');
        process.exit();
    });

    // Standard crash
    process.on('uncaughtException', (err) => {
        error(`UNCAUGHT EXCEPTION: ${err.stack}`);
    });

    // Killed process
    process.on('SIGTERM', () => {
        error('SIGTERM: Closing database and exiting...');
        process.exit();
    });

    // Standard crash
    process.on('unhandledRejection', (err) => {
        error(`UNHANDLED REJECTION: ${err.stack}`);
    });

    // Deprecation warnings
    process.on('warning', (warning) => {
        warn(warning);
    });

    // Reference errors
    process.on('uncaughtReferenceError', (err) => {
        error(err.stack);
    });

};

const client = require('../index')

client.logs = require('../utils/logs')

function error(message) {
    client.logs.error(`[CAUTIION] ${message}`);
}

function warn(message) {
    client.logs.warn(`[WARN] ${message}`);
}

client.logs.success(`[PROCESS] Process handlers loaded.`);