const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'redes',
    description: 'Envia un mensaje con las redes!',
    execute(message, args) {
        try {
            const userTag = message.author.username;
            const userIcon = message.author.displayAvatarURL();
            const clientIcon = message.client.user.displayAvatarURL();

            const red = new EmbedBuilder()
                .setThumbnail(userIcon)
                .setDescription(`Te dejare las redes aqui! Pero tambien puedes utilizar los botones de abajo  \n
                    <:tiktok:1330596203448238151> Tik tok:\r
                    https://www.tiktok.com/@estefani_yss
                    Kick:\r
                    https://kick.com/estefani-yss
                    <:twich:1330595852149981216> Twich:\r
                    https://www.twitch.tv/estefaniyss
                    <:youtube:1330596342266986586> Yotube:\r
                    https://www.youtube.com/@estefani_yss`)
                .setTitle(`Claro! aqui tienes las redes ${userTag} <:catlove:1330596418422968411>`)
                .addFields(
                    {
                        name: `<:tiktok:1330596203448238151> Tik tok`,
                        value: `estefani_yss`,
                        inline: true
                    },
                    {
                        name: ` Kick`,
                        value: `estefani-yss`,
                        inline: true
                    },
                    {
                        name: `\u180b`,
                        value: `\u180b`,
                        inline: true
                    },
                    {
                        name: `<:twich:1330595852149981216> Twich`,
                        value: `estefaniyss`,
                        inline: true
                    },
                    {
                        name: `<:youtube:1330596342266986586> Youtube`,
                        value: `estefani_yss`,
                        inline: true
                    },
                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ text: `Comando ejecutado a las : `, iconURL: clientIcon })
                .setImage(`https://cdn.discordapp.com/attachments/862196488000110612/1324678229881262121/IMG_0625.jpg?ex=678d757d&is=678c23fd&hm=6db1c312327f89b4a06f896abeab0bd9e36fc7380c6e0272b083e547271ded6f&`)
                .setColor(`f20c5d`);

            // Creamos los botones
            const tiktokButton = new ButtonBuilder()
                .setLabel('Tik tok')
                .setURL('https://www.tiktok.com/@estefani_yss')
                .setStyle(ButtonStyle.Link);
            
            const kickButton = new ButtonBuilder()
                .setLabel('Kick')
                .setURL('https://kick.com/estefani-yss')
                .setStyle(ButtonStyle.Link);
            
            const twitchButton = new ButtonBuilder()
                .setLabel('Twitch')
                .setURL('https://www.twitch.tv/estefaniyss')
                .setStyle(ButtonStyle.Link);
            
            const youtubeButton = new ButtonBuilder()
                .setLabel('Youtube')
                .setURL('https://www.youtube.com/@estefani_yss')
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder()
                .addComponents(tiktokButton, kickButton, twitchButton, youtubeButton);

            message.reply({
                content: 'Aqui tienes todo lo de Tefi!',
                embeds: [red],
                components: [row]
            });
        } catch (error) {
            console.error('Error en el comando redes:', error);
            message.reply('Hubo un error al ejecutar el comando.');
        }
    }
};