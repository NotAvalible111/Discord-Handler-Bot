const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { color, getTimestamp } = require('../../utils/loggingEffects.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Error al ejecutar el comando. \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Por favor, verifica que estés usando el método execute correcto: "async execute(interaction, client)": \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE]`, error);

                const channelID = interaction.client.config.commandErrorChannel;
                if (!channelID) {
                    console.error(`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] No se proporcionó un ID de canal para errores. Por favor, proporciona un ID válido en el archivo config.js`);
                    return;
                }

                const channel = interaction.client.channels.cache.get(interaction.client.config.commandErrorChannel);

                // Error embed
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTimestamp()
                    .setAuthor({ name: `${interaction.client.user.username} Command Error`, iconURL: interaction.client.user.avatarURL() })
                    .setTitle('__Error en ejecución de un comando__')
                    .setDescription('ASe produjo un error al ejecutar este comando.')
                    .addFields(
                        { name: '> Comando', value: `\`\`\`${interaction.commandName}\`\`\`` },
                        { name: '> Ejecutado por', value: `\`\`\`${interaction.user.username}\`\`\`` },
                        { name: '> Servidor', value: `\`\`\`${interaction.guild.name}\`\`\`` },
                        { name: '> Error', value: `\`\`\`${error}\`\`\`` }
                    );

                // Status buttons
                const yellowButton = new ButtonBuilder()
                    .setCustomId('change_color_yellow_slash')
                    .setLabel('Marcar como Pendiente')
                    .setStyle('1');
                
                const greenButton = new ButtonBuilder()
                    .setCustomId('change_color_green_slash')
                    .setLabel('Marcar como Resuelto')
                    .setStyle('3');
                
                const redButton = new ButtonBuilder()
                    .setCustomId('change_color_red_slash')
                    .setLabel('Marcar como no Resuelto')
                    .setStyle('4');
                
                const row = new ActionRowBuilder()
                    .addComponents(yellowButton, greenButton, redButton);

                if (channel) {
                    const message = await channel.send({ embeds: [embed], components: [row] });
                    interaction.client.errorMessageInteraction = message;
                    interaction.client.errorEmbedInteraction = embed;
                    interaction.client.errorRowInteraction = row;
                }

                const errorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Hubo un error al ejecutar este comando!\n\`\`\`${error}\`\`\``)

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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