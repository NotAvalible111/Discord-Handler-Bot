require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connectDatabase } = require('./database/conection.js');
const { loadEvents } = require('./handlers/eventHandler.js');
const { loadSlashCommands } = require('./handlers/slashCommandHandler.js');
const { loadPrefixCommands } = require('./handlers/prefixCommandHandler.js');
const { loadButtons } = require('./handlers/buttonHandler.js');
const listenerManager = require('./utils/listenerManager');
const { setupAntiCrash } = require('./handlers/antiCrashHandler.js');
const chalk = require('chalk');

// Intents & Partials //

const { intents, partials } = require('./utils/intents.js');


let client;
try {
    client = new Client({ 
      intents: [ ...intents],
      partials: [ ...partials ],
    }); 
} catch (error) {
    console.error(`${color.red}[${getTimestamp()}]${color.reset} [ERROR] Error en la creación del cliente. \n${color.red}[${getTimestamp()}]${color.reset} [ERROR]`, error);
};

client.logs = require('./utils/logs');
client.config = require('./config');

// Packages //

const auditLogsClient = require('./client/auditLogsClientEvent.js')

require('./handlers/processHandlers')();


client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.prefix = process.env.prefix || '!';

async function initializeBot() {
    console.clear();
    console.log(chalk.cyan('╔════════════════════════════════════╗'));
    console.log(chalk.cyan('║        Iniciando el Bot...         ║'));
    console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

    try {
        setupAntiCrash();
        await connectDatabase();
        
        const eventStats = await loadEvents(client);
        const slashStats = await loadSlashCommands(client);
        const prefixStats = await loadPrefixCommands(client);
        const buttonStats = await loadButtons(client);
        auditLogsClient(client);

        await client.login(process.env.token);

        console.log('\n╔══════════ Estadísticas de Carga ══════════╗\n');
        console.log(`   ✓ Eventos Cargados: ${eventStats.success}/${eventStats.total}`);
        console.log(`   ✓ Comandos Slash: ${slashStats.success}/${slashStats.total}`);
        console.log(`   ✓ Comandos Prefix: ${prefixStats.success}/${prefixStats.total}`);
        console.log(`   ✓ Botones: ${buttonStats.success}/${buttonStats.total}`);
        console.log('\n╚═══════════════════════════════════════════╝');

        client.on('ready', () => {
            listenerManager.initialize(client);
          
          
          client.on('messageCreate', async (message) => {
            
            if (message.channel.type === 'DM' && !message.author) {
              await handleDM(message);
            }
          });
          });

    } catch (error) {
        console.error(chalk.red('Error al inicializar el bot:'), error);
    }
}

initializeBot();
