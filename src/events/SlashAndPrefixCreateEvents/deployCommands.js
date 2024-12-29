const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            console.log(chalk.yellow('Registrando comandos slash...'));
            
            const rest = new REST().setToken(process.env.token);
            const commands = [];
            
            // Leer comandos slash
            const commandsPath = path.join(__dirname, '../../commands/slash');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            // Primero borra los comandos existentes
            await rest.put(
                Routes.applicationCommands(process.env.clientid),
                { body: [] }
            );
            await rest.put(
                Routes.applicationGuildCommands(process.env.clientid, process.env.guildid),
                { body: [] }
            );

            // Cargar nuevos comandos
            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
            }

            // Registrar comandos
            await rest.put(
                Routes.applicationGuildCommands(process.env.clientid, process.env.guildid),
                { body: commands }
            );

            //console.log(chalk.green(`¡${commands.length} comandos slash registrados exitosamente!`));
        } catch (error) {
            console.error(chalk.red('Error al registrar comandos:'), error);
        }
    }
};