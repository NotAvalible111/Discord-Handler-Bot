const fs = require('fs');
const path = require('path');

function loadFolder(folderPath, folderName, client) {
    client.logs.info(`[${folderName.toUpperCase()}] Started loading ${folderName} files...`);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            client.logs.error(`[ERROR] Error reading ${folderName} folder:`, err);
            return;
        }
        client.logs.success(`[${folderName.toUpperCase()}] Loaded ${files.length} ${folderName} files.`);
    });
}

function folderLoader(client) {

    const folders = [
        { path: path.join(__dirname, '../scripts'), name: 'scripts' },
        { path: path.join(__dirname, '../client'), name: 'client' }
    ];

    folders.forEach(folder => loadFolder(folder.path, folder.name, client));
}

module.exports = folderLoader;