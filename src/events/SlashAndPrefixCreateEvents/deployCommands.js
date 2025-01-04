const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { color, getTimestamp } = require('../../utils/loggingEffects.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            console.log(`${color.green}[${getTimestamp()}] Registrando comandos slash...`);
            
            const rest = new REST({ version: '10' }).setToken(process.env.token);
            const commands = [];
            
            const commandsPath = path.join(__dirname, '../../commands/slash');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)]; 
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`${color.red}[${getTimestamp()}] [ADVERTENCIA] El comando en ${file} no tiene las propiedades requeridas 'data' o 'execute'`);
                }
            }

            //console.log(`${color.green} Iniciando registro de ${commands.length} comandos...`);
            
            try {
                const data = await rest.put(
                    Routes.applicationCommands(process.env.clientid),
                    { body: commands },
                );
                
                //console.log(`${color.green} ¡${data.length} comandos registrados exitosamente!`);
                
                const commandsHash = JSON.stringify(commands);
                client.commandsHash = commandsHash;
                
            } catch (error) {
                console.error(`${color.red} Error durante el registro de comandos:`);
                if (error.response) {
                    console.error(`${color.red} Estado: ${error.response.status}`);
                    console.error(`${color.red} Mensaje: ${error.response.data?.message || 'No hay mensaje de error'}`);
                } else {
                    console.error(`${color.red}`,error);
                }
            }

        } catch (error) {
            console.error(`${color.green}[${getTimestamp()}] Error al cargar comandos:`, error);
        }
    }
};