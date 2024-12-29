const fs = require('fs');
const path = require('path');
const { REST, Routes, Collection } = require('discord.js');
const chalk = require('chalk');

async function loadCommands(client) {
    
    client.commands = client.commands || new Collection();
    const commands = [];
    
    const commandsPath = path.join(__dirname, '../commands');
    
    try {
        if (!fs.existsSync(commandsPath)) {
            console.error(chalk.red(`El directorio ${commandsPath} no existe`));
            return;
        }

        console.log(chalk.yellow('Cargando comandos...'));
        
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        client.commands.clear();

        for (const file of commandFiles) {
            try {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                    console.log(chalk.green(`✓ Comando cargado: ${command.data.name}`));
                } else {
                    console.log(chalk.red(`✗ El comando ${file} no tiene las propiedades requeridas`));
                }
            } catch (error) {
                console.error(chalk.red(`Error al cargar el comando ${file}:`), error);
            }
        }

        const rest = new REST().setToken(process.env.token);
        
        console.log(chalk.yellow('Registrando comandos en Discord...'));

        await rest.put(
            Routes.applicationGuildCommands(process.env.clientid, process.env.guildid),
            { body: commands }
        );

        console.log(chalk.green(`¡${commands.length} comandos registrados exitosamente!`));

        fs.watch(commandsPath, async (eventType, filename) => {
            if (filename && filename.endsWith('.js')) {
                console.log(chalk.yellow(`\nDetectado cambio en ${filename}, recargando comandos...`));
                await loadCommands(client);
            }
        });

    } catch (error) {
        console.error(chalk.red('Error al procesar comandos:'), error);
        throw error; 
    }
}

async function checkCommands(client) {
    try {
        const rest = new REST().setToken(process.env.token);
        const registeredCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.clientid, process.env.guildid)
        );
        
        console.log(chalk.blue(`Estado actual: ${registeredCommands.length} comandos registrados`));
        return registeredCommands;
    } catch (error) {
        console.error(chalk.red('Error al verificar comandos:'), error);
        return [];
    }
}

module.exports = { loadCommands, checkCommands };
