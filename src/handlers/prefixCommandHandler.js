const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');
const { color, getTimestamp } = require('../utils/loggingEffects.js');

async function loadPrefixCommands(client) {
    const table = new AsciiTable('Prefix Commands');
    table.setHeading('Category', 'Command', 'Status');

    let total = 0;
    let success = 0;

    try {
        const commandsPath = path.join(__dirname, '../commands/prefix');
        
        function readCommands(dir, category = '') {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    readCommands(filePath, file);
                } else if (file.endsWith('.js')) {
                    total++;
                    try {
                        const command = require(filePath);
                        if ('name' in command && 'execute' in command) {
                            client.prefixCommands.set(command.name, command);
                            success++;
                            table.addRow(
                                category || 'General',
                                file,
                                `${color.green}✓ LOADED`
                            );
                        } else {
                            table.addRow(
                                category || 'General',
                                file,
                                `${color.red}✗ MISSING PROPERTIES`
                            );
                        }
                    } catch (error) {
                        table.addRow(
                            category || 'General',
                            file,
                            `${color.red}✗ ERROR`
                        );
                        console.error(`${color.red}[${getTimestamp()}] Error al cargar el comando ${file}:`, error);
                    }
                }
            }
        }

        readCommands(commandsPath);

        console.log(table.toString());
        console.log(`${color.green}[${getTimestamp()}] [COMMANDS] Loaded ${success} PrefixCommands`);
        console.log(`${color.blue}Total de comandos prefix cargados: ${success}/${total}\n`);
        
    } catch (error) {
        console.error(`${color.red}[${getTimestamp()}] Error al cargar los comandos prefix:`, error);
    }

    return { success, total };
}

module.exports = { loadPrefixCommands };