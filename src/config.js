module.exports = {

    // BOT INFO //
    prefix: process.env.prefix || '!',
    errorLogChannel: process.env.ERROR_LOG_CHANNEL || '', // ID del canal para logs de errores
    developerMode: process.env.NODE_ENV === 'development',
    ownerID: '752340405688729650', // Tu ID de usuario
    supportServer: 'https://discord.gg/tuservidor',

    // COLORS //
    embedColor: '#2f3136', // Color predeterminado para embeds

    // CHANNEL IDS //
    slashCommandLoggingChannel: "1246682278776799253", // slash command canal para logs

    // Configuración de logs
    logs: {
        errors: true, // Activar logs de errores
        commands: true, // Activar logs de uso de comandos
        autoDelete: true, // Auto-eliminar mensajes de error
        deleteTimeout: 10000 // Tiempo para auto-eliminar (ms)
    },

    // Cooldowns predeterminados
    defaultCooldowns: {
        commands: 3, // segundos
        buttons: 2, // segundos
    }
};