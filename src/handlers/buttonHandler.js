const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const { color, getTimestamp } = require('../utils/loggingEffects.js');

async function loadButtons(client) {
    const table = new AsciiTable('Buttons');
    table.setHeading('Button', 'Status');

    let total = 0;
    let success = 0;

    try {
        const buttonsPath = path.join(__dirname, '../buttons');
        const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
        total = buttonFiles.length;

        for (const file of buttonFiles) {
            try {
                const button = require(path.join(buttonsPath, file));
                if ('id' in button && 'execute' in button) {
                    client.buttons.set(button.id, button);
                    success++;
                    table.addRow(file, '✓ LOADED');
                } else {
                    table.addRow(file, '✗ MISSING PROPERTIES');
                }
            } catch (error) {
                table.addRow(file, '✗ ERROR');
                console.error(`${color.red}[${getTimestamp()}] Error al cargar el botón ${file}:`, error);
            }
        }

        console.log(table.toString());
        console.log(`${color.green}[${getTimestamp()}] [BUTTONS] Loaded ${success} Buttons`);
        console.log(`${color.blue}Total de botones cargados: ${success}/${total}\n`);

    } catch (error) {
        console.error(`${color.red}[${getTimestamp()}] Error al cargar los botones:`, error);
    }

    return { success, total };
}

module.exports = { loadButtons };