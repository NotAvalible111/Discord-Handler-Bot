module.exports = {
    id: 'test-button',
    async execute(interaction) {
        await interaction.reply({
            content: '¡Has pulsado el botón! 🎉',
            flags: 64
        });
    }
};