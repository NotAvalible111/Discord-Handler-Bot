const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const { color, getTimestamp } = require('../utils/loggingEffects.js');

async function loadEvents(client) {
    try {
        const table = new AsciiTable('Events');
        table.setHeading('Event', 'Status');

        const eventsPath = path.join(__dirname, '../events');
        let success = 0;
        let total = 0;

        if (!client.slashCommands) client.slashCommands = new Map();
        if (!client.buttons) client.buttons = new Map();

        const loadEvent = (filePath) => {
            try {
                const event = require(filePath);
                
                if (event.once) {
                    client.once(event.name, (...args) => {
                        try {
                            event.execute(...args, client);
                        } catch (error) {
                            console.error(`${color.red}[${getTimestamp()}] Error en evento ${event.name}:`, error);
                        }
                    });
                } else {
                    client.on(event.name, (...args) => {
                        try {
                            event.execute(...args, client);
                        } catch (error) {
                            console.error(`${color.red}[${getTimestamp()}] Error en evento ${event.name}:`, error);
                        }
                    });
                }

                table.addRow(path.basename(filePath), `${color.green} ✅ LOADED`);
                success++;
            } catch (error) {
                table.addRow(path.basename(filePath), `${color.red} ❌ ERROR`);
                console.error(`${color.red}[${getTimestamp()}] Error al cargar evento ${path.basename(filePath)}:`, error);
            }
        };

        const loadDirectory = (directory) => {
            const files = fs.readdirSync(directory);
            
            for (const file of files) {
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    loadDirectory(filePath);
                } else if (file.endsWith('.js')) {
                    total++;
                    loadEvent(filePath);
                }
            }
        };

        loadDirectory(eventsPath);

        console.log(table.toString());
        console.log(`${color.pink}[${getTimestamp()}] [EVENTS] Se han cargado ${success} Eventos`);
        console.log(`${color.pink}[${getTimestamp()}] Total de eventos cargados: ${success}/${total}\n`);

        return { success, total };
    } catch (error) {
        console.error(`${color.red}[${getTimestamp()}] Error general al cargar eventos:`, error);
        return { success: 0, total: 0 };
    }
}

module.exports = { loadEvents };