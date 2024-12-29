module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Hubo un error al ejecutar este comando.',
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Hubo un error al procesar el botón.',
                    ephemeral: true
                });
            }
        }
    }
};