module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(message.client.prefix)) return;

        const args = message.content.slice(message.client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply('Hubo un error al ejecutar el comando.');
        }
    }
};