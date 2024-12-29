const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const status = process.env.BOT_STATUS;

        try {
            await client.user.setStatus(status);
            console.log(`[STATUS] Estado del bot establecido a: ${status}`);
        } catch (error) {
            console.error(`[STATUS] Error al establecer el estado: ${error}`);
        }
    }
};