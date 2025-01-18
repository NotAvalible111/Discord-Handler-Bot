// events/messageCreate.js
const { PermissionFlagsBits } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            if (message.author.bot) return;
            
            if (message.content.startsWith(config.prefix)) {
                const args = message.content.slice(config.prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = message.client.prefixCommands.get(commandName);

                if (!command) return;

                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !command.permissions.every(perm => authorPerms.has(perm))) {
                        return message.reply({ 
                            content: '❌ No tienes permisos para usar este comando.',
                            flags: 64 
                        });
                    }
                }

                try {
                    await command.execute(message, args);
                } catch (error) {
                    message.client.handlers.command.logError('Command Execution Error', error, {
                        command: commandName,
                        args: args.join(' '),
                        user: message.author.tag,
                        channel: message.channel.name
                    });

                    message.reply({ 
                        content: '❌ Hubo un error al ejecutar el comando.',
                        flags: 64 
                    });
                }
            }
        } catch (error) {
            message.client.handlers.command.logError('Message Handler Error', error);
        }
    }
};