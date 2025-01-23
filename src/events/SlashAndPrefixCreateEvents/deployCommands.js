const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { color, getTimestamp } = require('../../utils/loggingEffects.js');

class CommandDeployer {
    constructor(client) {
        this.client = client;
        this.commands = [];
        this.rest = new REST({ version: '10' }).setToken(process.env.token);
    }

    async loadCommands() {
        try {
            const foldersPath = path.join(process.cwd(), 'src', 'commands', 'slash');
            const commandFolders = fs.readdirSync(foldersPath);

            for (const folder of commandFolders) {
                const commandsPath = path.join(foldersPath, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    
                    delete require.cache[require.resolve(filePath)];
                    
                    try {
                        const command = require(filePath);
                        
                        if ('data' in command && 'execute' in command) {
                            this.commands.push(command.data.toJSON());
                            this.client.slashCommands.set(command.data.name, command);
                            //console.log(`${color.green}[${getTimestamp()}] Comando cargado: ${command.data.name} (${folder}/${file})`);
                        } else {
                            console.log(`${color.yellow}[${getTimestamp()}] Advertencia: ${file} no tiene las propiedades requeridas 'data' o 'execute'`);
                        }
                    } catch (error) {
                        console.error(`${color.red}[${getTimestamp()}] Error al cargar comando ${file}:`, error);
                    }
                }
            }

            return this.commands.length;
        } catch (error) {
            console.error(`${color.red}[${getTimestamp()}] Error al cargar comandos:`, error);
            return 0;
        }
    }

    async deployCommands() {
        try {
            console.log(`${color.blue}[${getTimestamp()}] Iniciando registro de ${this.commands.length} comandos slash...`);

            const data = await this.rest.put(
                Routes.applicationCommands(process.env.clientid),
                { body: this.commands }
            );

            console.log(`${color.green}[${getTimestamp()}] ¡${data.length} comandos registrados globalmente!`);

            const registeredCommands = await this.rest.get(
                Routes.applicationCommands(process.env.clientid)
            );

            this.client.commandsHash = JSON.stringify(this.commands);

            return registeredCommands.length;
        } catch (error) {
            console.error(`${color.red}[${getTimestamp()}] Error al registrar comandos:`);
            if (error.response) {
                console.error(`${color.red}Estado: ${error.response.status}`);
                console.error(`${color.red}Mensaje: ${error.response.data?.message || 'No hay mensaje de error'}`);
            } else {
                console.error(error);
            }
            return 0;
        }
    }

    async clearCommands() {
        try {
            console.log(`${color.yellow}[${getTimestamp()}] Eliminando todos los comandos slash...`);
            
            await this.rest.put(
                Routes.applicationCommands(process.env.clientid),
                { body: [] }
            );

            console.log(`${color.green}[${getTimestamp()}] ¡Comandos eliminados con éxito!`);
            return true;
        } catch (error) {
            console.error(`${color.red}[${getTimestamp()}] Error al eliminar comandos:`, error);
            return false;
        }
    }
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const deployer = new CommandDeployer(client);
        await deployer.loadCommands();
        await deployer.deployCommands();
    },
    CommandDeployer
};