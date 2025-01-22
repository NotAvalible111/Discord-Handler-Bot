const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Comando de prueba con botón'),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
            content: `${client.config.noPerms}`, //ESTO DARÁ EL MENSAJE DE QUE EL USUARIO NO PUEDE USAR EL COMANDO, ESO ESTÁ EN EL ARCHIVO CONFIG.JS
            flags: 64
        });

        const button = new ButtonBuilder()
            .setCustomId('test-button')
            .setLabel('¡Púlsame!')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(butto);

        await interaction.reply({
            content: '¡Hola! Este es un comando de prueba. Prueba el botón:',
            components: [row]
        });
    }
};