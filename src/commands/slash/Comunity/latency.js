const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latencia')
        .setDescription('Ver la velocidad del bot\'s respuesta'),
    
    category: "comunidad",
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Latencia del Bot` })
            .setTitle(`Prueba de latencia`)
            .setDescription(`**\`🍯 LATENCIA: ${interaction.client.ws.ping} ms\`**`)
            .setColor("Aqua")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setTimestamp();

        const btn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('refresh-latency')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Refresh')
            );

        const response = await interaction.reply({ 
            embeds: [embed], 
            components: [btn],
            fetchReply: true 
        });

        const collector = response.createMessageComponentCollector({ 
            time: 60000 // El collector durará 60 segundos
        });

        collector.on('collect', async i => {
            if (i.customId === 'refresh-latency') {
                const newEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Latencia del Bot` })
                    .setTitle(`Prueba de latencia`)
                    .setDescription(`**\`🍯 LATENCIA: ${i.client.ws.ping} ms\`**`)
                    .setColor("Blue")
                    .setThumbnail(i.client.user.displayAvatarURL())
                    .setFooter({ text: `Solicitado por ${i.user.tag}`, iconURL: i.user.displayAvatarURL({ dynamic: true })})
                    .setTimestamp();

                await i.update({ 
                    embeds: [newEmbed], 
                    components: [btn] 
                });
            }
        });

        collector.on('end', () => {
            if (!response.deleted) {
                const disabledBtn = new ActionRowBuilder()
                    .addComponents(
                        ButtonBuilder.from(btn.components[0])
                            .setDisabled(true)
                    );
                response.edit({ components: [disabledBtn] }).catch(() => {});
            }
        });
    }
};