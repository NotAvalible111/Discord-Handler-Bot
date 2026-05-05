module.exports = {
    name: 'say',
    description: 'Repite el mensaje del usuario',
    execute(message, args) {
        if (!args.length) {
            return message.reply('¡Necesitas proporcionar primero un mensaje!');
        }
        message.channel.send(args.join(' '));
    }
};
