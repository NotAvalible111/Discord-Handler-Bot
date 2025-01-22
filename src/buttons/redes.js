const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: 'social-buttons',
    execute(interaction) {
        try {
            const tiktok = new ButtonBuilder()
                .setLabel('Tik tok')
                .setURL('https://www.tiktok.com/@estefani_yss')
                .setStyle(ButtonStyle.Link);
            
            const twitch = new ButtonBuilder()
                .setLabel('Twitch')
                .setURL('https://www.twitch.tv/estefaniyss')
                .setStyle(ButtonStyle.Link);
            
            const youtube = new ButtonBuilder()
                .setLabel('Youtube')
                .setURL('https://www.youtube.com/@estefani_yss')
                .setStyle(ButtonStyle.Link);
                
            const kick = new ButtonBuilder()
                .setLabel('Kick')
                .setURL('https://kick.com/estefani-yss')
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder()
                .addComponents(tiktok, twitch, youtube, kick);

            interaction.reply({
                components: [row],
                flags: 64
            });
        } catch (error) {
            console.error('Error en los botones sociales:', error);
            interaction.reply({
                content: 'Hubo un error al mostrar los botones.',
                flags: 64
            });
        }
    }
};