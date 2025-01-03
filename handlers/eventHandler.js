const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const chalk = require('chalk');

async function loadEvents(client) {
    const table = new AsciiTable('Events');
    table.setHeading('Event', 'Status');

    const eventsPath = path.join(__dirname, '../events');
    let success = 0;
    let total = 0;

    function loadEventsRecursively(directory) {
        const items = fs.readdirSync(directory);
        
        for (const item of items) {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                loadEventsRecursively(fullPath);
            } else if (item.endsWith('.js')) {
                total++;
                try {
                    const event = require(fullPath);
                    
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args));
                    }
                    
                    table.addRow(path.basename(fullPath), '✅ LOADED');
                    success++;
                } catch (error) {
                    table.addRow(path.basename(fullPath), '❌ ERROR');
                    console.error(`Error al cargar el evento ${path.basename(fullPath)}:`, error);
                }
            }
        }
    }

    loadEventsRecursively(eventsPath);

    console.log(table.toString());
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] [EVENTS] Se han cargado ${success} Eventos`);
    console.log(chalk.blue(`Total de eventos cargados: ${success}/${total}\n`));

    return { success, total };
}

module.exports = { loadEvents };