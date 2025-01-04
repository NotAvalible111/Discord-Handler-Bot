const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const AsciiTable = require('ascii-table');
const { color, getTimestamp } = require('../utils/loggingEffects.js');

async function loadSlashCommands(client) {
    const table = new AsciiTable('Slash Commands');
    table.setHeading('Category', 'Command', 'Status')
    .setAlignCenter(2);

    const commands = [];
    let total = 0;
    let success = 0;
    
    try {
        const commandsPath = path.join(__dirname, '../commands/slash');
        
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
                        if ('data' in command && 'execute' in command) {
                            client.slashCommands.set(command.data.name, command);
                            commands.push(command.data.toJSON());
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

        const rest = new REST().setToken(process.env.token);
        console.log(`${color.green}[${getTimestamp()}]\nRegistrando comandos slash...`);
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.clientid, process.env.guildid),
            { body: commands }
        );

        console.log(table.toString());
        console.log(`${color.blue}[${getTimestamp()}] Total de comandos slash cargados: ${success}/${total}`);
        
        console.log(`${color.green}[${getTimestamp()}] [COMMANDS] Loaded ${success} SlashCommands`);
        console.log(`${color.green}[${getTimestamp()}] ¡Comandos slash registrados exitosamente!\n`);
        
    } catch (error) {
        console.error(`${color.red}[${getTimestamp()}] Error al registrar los comandos slash:`, error);
    }

    return { success, total };
}

module.exports = { loadSlashCommands };