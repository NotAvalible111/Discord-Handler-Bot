const { Events, EmbedBuilder, WebhookClient } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const DIAS = 7;
const MILISEG = 24 * 60 * 60 * 1000;

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() || !interaction.guild) return;

        const webhookURL = process.env.webhookSlashLogging;
        if (!webhookURL) {
            console.error('[COMMAND_SLASH_LOGGING_WEBHOOK] No se ha proporcionado la URL del webhook.');
            return;
        }

        const servidor = interaction.guild.name;
        const usuario = interaction.user.username;
        const usuarioID = interaction.user.id;
        const comando = interaction.commandName;

        let subcomando = '';
        let subgrupo = '';
        if (interaction.options.getSubcommand(false)) {
            subcomando = interaction.options.getSubcommand();
            if (interaction.options.getSubcommandGroup(false)) {
                subgrupo = interaction.options.getSubcommandGroup();
            }
        }

        let comandoCompleto = `/${comando}`;
        if (subgrupo) comandoCompleto += ` ${subgrupo}`;
        if (subcomando) comandoCompleto += ` ${subcomando}`;

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ 
                name: `${usuario} ha usado un comando.`, 
                iconURL: interaction.client.user.avatarURL({ dynamic: true })
            })
            .setTitle(`Registrador de Comandos ➡️`)
            .addFields(
                { name: 'Servidor', value: servidor },
                { name: 'Comando', value: `\`\`\`${comandoCompleto}\`\`\`` },
                { name: 'Usuario', value: `${usuario} | ${usuarioID}` }
            )
            .setTimestamp()
            .setFooter({ 
                text: `Registrador de Comandos`, 
                iconURL: interaction.user.avatarURL({ dynamic: true })
            });

        try {
            const webhookClient = new WebhookClient({ url: webhookURL });
            await webhookClient.send({
                embeds: [embed],
                username: `SlashCommand Logger`,
                avatarURL: interaction.client.user.avatarURL(),
            });
        } catch (error) {
            console.error('[COMMAND_SLASH_LOGGING_WEBHOOK] Error al enviar webhook:', error);
        }

        const entradaRegistro = `
## Comando Utilizado
- **Servidor:** ${servidor}
- **Usuario:** ${usuario} (${usuarioID})
- **Comando:** ${comandoCompleto}
${subgrupo ? `- **Grupo de Subcomando:** ${subgrupo}\n` : ''}
${subcomando ? `- **Subcomando:** ${subcomando}\n` : ''}
- **Marca de tiempo:** ${new Date().toISOString()}

---
`;

        try {
            const rutaRegistroActual = await obtenerRutaRegistroActual();
            await fs.appendFile(rutaRegistroActual, entradaRegistro);
        } catch (error) {
            console.error('Error al manejar el archivo de registro:', error);
        }
    }
};

async function obtenerRutaRegistroActual() {
    const dirRegistros = path.join(__dirname, 'registros');
    await fs.mkdir(dirRegistros, { recursive: true });

    const archivos = await fs.readdir(dirRegistros);
    let archivoMasReciente = null;
    let fechaMasReciente = new Date(0);

    for (const archivo of archivos) {
        if (archivo.startsWith('registro_comandos_') && archivo.endsWith('.md')) {
            const rutaCompleta = path.join(dirRegistros, archivo);
            const stats = await fs.stat(rutaCompleta);
            if (stats.mtime > fechaMasReciente) {
                fechaMasReciente = stats.mtime;
                archivoMasReciente = rutaCompleta;
            }
        }
    }

    if (archivoMasReciente) {
        const stats = await fs.stat(archivoMasReciente);
        const tiempoTranscurrido = new Date() - stats.birthtime;
        if (tiempoTranscurrido <= DIAS * MILISEG) {
            return archivoMasReciente;
        }
    }

    const fechaActual = new Date();
    const nombreArchivo = `registro_comandos_${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}.md`;
    return path.join(dirRegistros, nombreArchivo);
}