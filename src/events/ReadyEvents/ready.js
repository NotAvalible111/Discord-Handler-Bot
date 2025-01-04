const folderLoader = require('../../utils/folderLoader.js');
const { color } = require('../../utils/loggingEffects.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${color.torquise}\n╔═══════════════════════════════════════╗`);
        console.log(`${color.torquise}║ Bot conectado como${client.user.tag} ║`);
        console.log(`${color.torquise}╚═══════════════════════════════════════╝\n`);
        
        folderLoader(client);
    }
    
};