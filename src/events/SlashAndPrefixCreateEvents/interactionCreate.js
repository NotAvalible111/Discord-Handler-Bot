const { EmbedBuilder } = require("discord.js");
const { color, getTimestamp } = require('../../utils/loggingEffects.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.slashCommands.get(interaction.commandName);
                
                if (!command) {
                    console.log(`${color.yellow}[${getTimestamp()}] Comando no encontrado: ${interaction.commandName}`);
                    return;
                }

                try {
                    await command.execute(interaction, client);
                } catch (error) {
                    console.error(`${color.red}[${getTimestamp()}] [COMMAND_ERROR]`, error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Ha ocurrido un error al ejecutar el comando.\nError: ${error.message || 'Desconocido'}`);

                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
                    } else {
                        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                    }
                }
            } 
            
            else if (interaction.isButton()) {
                const button = interaction.client.buttons.get(interaction.customId);
                
                if (!button) {
                    console.log(`${color.yellow}[${getTimestamp()}] Botón no encontrado: ${interaction.customId}`);
                    return;
                }

                try {
                    await button.execute(interaction);
                } catch (error) {
                    console.error(`${color.red}[${getTimestamp()}] [BUTTON_ERROR]`, error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Ha ocurrido un error al procesar el botón.\nError: ${error.message || 'Desconocido'}`);

                    if (interaction.replied || interaction.deferred) {
                        await interaction.editReply({ embeds: [errorEmbed], flags: 64 });
                    } else {
                        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                    }
                }
            }
        } catch (error) {
            console.error(`${color.red}[${getTimestamp()}] [INTERACTION_ERROR]`, error);
        }
    }
};