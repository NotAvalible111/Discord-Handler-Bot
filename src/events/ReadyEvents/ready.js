const folderLoader = require('../../utils/folderLoader.js');
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(chalk.green('\n╔════════════════════════════════════╗'));
        console.log(chalk.green(`║ Bot conectado como ${client.user.tag} ║`));
        console.log(chalk.green('╚════════════════════════════════════╝\n'));
        
        folderLoader(client);
    }
    
};