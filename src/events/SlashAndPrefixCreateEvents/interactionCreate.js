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
            console.error(`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Error al ejecutar el comando. \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Compruebe que está utilizando el método de ejecución correcto: "async execute(interaction, client)": \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE]`, error);


            console.error(`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Error al ejecutar el comando. \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Compruebe que está utilizando el método de ejecución correcto: "async execute(interaction, client)":`, error);

            const channelID = `${client.config.commandErrorChannel}`;
            const channel = client.channels.cache.get(channelID); 
                    
            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTimestamp()
            .setAuthor({ name: `${client.user.username} Command Error ${config.devBy}`, iconURL: client.user.avatarURL()})
            .setFooter({ text: 'Error reported at' })
            .setTitle(`__Command Execution Error__ ${config.arrowEmoji}`)
            .setDescription('An error occurred while executing the command.')
            .addFields(
            { name: '> Command', value: `\`\`\`${interaction.commandName}\`\`\`` },
            { name: '> Triggered By', value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\`` },
            { name: '> Guild', value: `\`\`\`${interaction.guild.name}\`\`\`` },
            { name: '> Error', value: `\`\`\`${error}\`\`\`` })
            
            const yellowButton = new ButtonBuilder()
                .setCustomId('change_color_yellow_slash')
                .setLabel('Mark As Pending')
                .setStyle('1');
            
            const greenButton = new ButtonBuilder()
                .setCustomId('change_color_green_slash')
                .setLabel('Mark As Solved')
                .setStyle('3');
            
            const redButton = new ButtonBuilder()
                .setCustomId('cchange_color_red_slash')
                .setLabel('Mark As Unsolved')
                .setStyle('4');
            
            const row = new ActionRowBuilder()
                .addComponents(yellowButton, greenButton, redButton);
            
            client.on('interactionCreate', async (interaction) => {
                try {
                    if (!interaction.isButton()) return;
                    if (interaction.message.id !== message.id) return;
                    
                    const { customId } = interaction;

                    if (customId === 'change_color_yellow') {
                        embed.setColor('#FFFF00');
                        await interaction.reply({
                        content: 'This error has been marked as pending.',
                        flags: 64,
                        });
                    } else if (customId === 'change_color_green') {
                        embed.setColor('#00FF00');
                        await interaction.reply({
                        content: 'This error has been marked as solved.',
                        flags: 64,
                        });
                    } else if (customId === 'change_color_red') {
                        embed.setColor('#FF0000');
                        await interaction.reply({
                        content: 'This error has been marked as unsolved.',
                        flags: 64,
                        });
                    }
                    await message.edit({ embeds: [embed], components: [row] });
                    await interaction.deferUpdate();
                } catch (error) {
                    client.logs.error('[ERROR_LOGGING] Error in button interaction:', error);
                }
            });

            const message = await channel.send({ embeds: [embed], components: [row] });        

            const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`There was an error while executing this command!\n\`\`\`${error}\`\`\``)

            await interaction.reply({ embeds: [errorEmbed], flags: 64});
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