const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1)
        .setDescription('Responde con Pong!'),
    
    async execute(interaction, client) {
        const sent = await interaction.reply({ 
            content: 'Calculando ping...', 
            fetchReply: true 
        });
        
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply({
            content: `Pong! 🏓\nLatencia del bot: ${ping}ms\nLatencia de la API: ${Math.round(client.ws.ping)}ms`
        });
    }
};