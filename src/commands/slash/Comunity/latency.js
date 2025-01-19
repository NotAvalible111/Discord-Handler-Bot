const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latencia')
        .setDescription('Ver la velocidad del bot\'s respuesta'),
    
    category: "comunidad",
    
    async execute(interaction, client) {
        try {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Latencia del Bot ${interaction.client.config.devBy}`})
                .setTitle(`Prueba de latencia ${interaction.client.config.arrowEmoji}`)
                .setDescription(`**\`🍯 LATENCIA: ${interaction.client.ws.ping} ms\`**`)
                .setColor("Aqua")
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setTimestamp();

            const refreshButton = new ButtonBuilder()
                .setCustomId('refresh-latency')
                .setLabel('Actualizar')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(refreshButton);

            if (!interaction.client.buttons) {
                interaction.client.buttons = new Map();
            }
            
            interaction.client.buttons.set('refresh-latency', {
                execute: async (btnInteraction) => {
                    const newEmbed = new EmbedBuilder()
                        .setAuthor({ name: `Latencia del Bot ${interaction.client.config.devBy}` })
                        .setTitle(`Prueba de latencia ${interaction.client.config.arrowEmoji}`)
                        .setDescription(`**\`🍯 LATENCIA: ${btnInteraction.client.ws.ping} ms\`**`)
                        .setColor("Blue")
                        .setThumbnail(btnInteraction.client.user.displayAvatarURL())
                        .setFooter({ text: `Solicitado por ${btnInteraction.user.tag}`, iconURL: btnInteraction.user.displayAvatarURL({ dynamic: true })})
                        .setTimestamp();

                    await btnInteraction.update({
                        embeds: [newEmbed],
                        components: [row]
                    });
                }
            });

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            console.error('Error en el comando de latencia:', error);
            await interaction.reply({
                content: 'Hubo un error al ejecutar el comando.',
                ephemeral: true
            });
        }
    }
};