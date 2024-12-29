const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Comando de prueba con botón'),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setCustomId('test-button')
            .setLabel('¡Púlsame!')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({
            content: '¡Hola! Este es un comando de prueba. Prueba el botón:',
            components: [row]
        });
    }
};