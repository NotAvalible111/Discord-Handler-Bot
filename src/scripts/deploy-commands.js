require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { CommandDeployer } = require('../events/SlashAndPrefixCreateEvents/deployCommands.js');
const { color, getTimestamp } = require('../utils/loggingEffects.js');

async function deployCommands() {
    const client = new Client({ intents: [] });
    client.slashCommands = new Collection();

    try {
        const deployer = new CommandDeployer(client);
        
        if (process.argv.includes('--clear')) {
            await deployer.clearCommands();
            return;
        }

        const loadedCount = await deployer.loadCommands();
        console.log(`${color.blue}[${getTimestamp()}] ${loadedCount} comandos cargados`);

        const deployedCount = await deployer.deployCommands();
        console.log(`${color.green}[${getTimestamp()}] ${deployedCount} comandos desplegados`);

    } catch (error) {
        console.error(`${color.red}[${getTimestamp()}] Error al desplegar comandos:`, error);
    }

    process.exit(0);
}

deployCommands();