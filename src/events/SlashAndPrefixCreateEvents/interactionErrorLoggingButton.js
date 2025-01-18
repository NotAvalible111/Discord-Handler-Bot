const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const message = interaction.message;
        if (!message || !message.embeds || message.embeds.length === 0) {
            return;
        }

        const originalEmbed = message.embeds[0];
        
        const embed = new EmbedBuilder()
            .setColor(originalEmbed.color || '#000000') // Color por defecto si no hay color
            .setTitle(originalEmbed.title || 'Error Message')
            .setDescription(originalEmbed.description || 'No description provided');

        if (originalEmbed.timestamp) {
            embed.setTimestamp(originalEmbed.timestamp);
        }

        if (originalEmbed.author) {
            embed.setAuthor(originalEmbed.author);
        }

        if (originalEmbed.fields && originalEmbed.fields.length > 0) {
            embed.addFields(originalEmbed.fields);
        }

        const row = message.components[0];
        const { customId } = interaction;

        if (interaction.replied || interaction.deferred) {
            console.error("Interaction has already been acknowledged.");
            return;
        }

        try {
            if (customId === 'change_color_yellow_slash') {
                embed.setColor('#FFFF00');
                await interaction.reply({
                    content: 'Este error se ha marcado como pendiente.',
                    flags: 64,
                });
            } else if (customId === 'change_color_green_slash') {
                embed.setColor('#00FF00');
                await interaction.reply({
                    content: 'Este error se ha marcado como resuelto.',
                    flags: 64,
                });
            } else if (customId === 'change_color_red_slash') {
                embed.setColor('#FF0000');
                await interaction.reply({
                    content: 'Este error se ha marcado como no resuelto.',
                    flags: 64,
                });
            }

            await message.edit({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error al procesar el botón:', error);
            await interaction.reply({
                content: 'Hubo un error al procesar el botón.',
                flags: 64
            }).catch(console.error);
        }
    }
};