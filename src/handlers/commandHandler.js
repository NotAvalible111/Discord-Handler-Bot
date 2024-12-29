const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

async function loadCommands(client) {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST().settoken(process.env.token);
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.clientid, process.env.guildid),
            { body: commands }
        );
        console.log('Comandos slash registrados correctamente');
    } catch (error) {
        console.error('Error al registrar los comandos:', error);
    }
}

module.exports = { loadCommands };