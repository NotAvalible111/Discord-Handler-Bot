const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  const MensajeBienvenida = require("../../../schemas/welcomeMessageSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("sistema-bienvenida")
      .setDescription("Configura el sistema de mensajes de bienvenida")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("establecer")
          .setDescription("Establece el sistema de mensajes de bienvenida en el servidor")
          .addStringOption((option) =>
            option
              .setName("mensaje")
              .setDescription(
                "El mensaje de bienvenida a enviar. `Usa {user} para mencionar al usuario`"
              )
              .setRequired(true)
          )
          .addChannelOption((option) =>
            option
              .setName("canal")
              .setDescription("El canal donde se enviarán los mensajes de bienvenida")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("eliminar")
          .setDescription("Elimina el sistema de mensajes de bienvenida del servidor")
      )
      .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
  
    async execute(interaction) {
      const subcommand = interaction.options.getSubcommand();
      const guildId = interaction.guild.id;
      
      let mensajeBienvenida = await MensajeBienvenida.findOne({ guildId });
      if (!mensajeBienvenida) {
        mensajeBienvenida = new MensajeBienvenida({ guildId });
      }
  
      if (subcommand === "establecer") {
        const canalId = interaction.options.getChannel("canal").id;
        const mensaje = interaction.options.getString("mensaje");
        
        mensajeBienvenida.channelId = canalId;
        mensajeBienvenida.message = mensaje;
        await mensajeBienvenida.save();
  
        const embedExito = new EmbedBuilder()
          .setTitle("Sistema de Mensajes de Bienvenida")
          .setColor("Green")
          .setDescription(
            `Mensaje de bienvenida establecido: ${mensaje}\n\nCanal: <#${canalId}>`
          );
  
        await interaction.reply({
          embeds: [embedExito],
          flags: 64,
        });
      } else if (subcommand === "eliminar") {
        let datosExistentes = await MensajeBienvenida.findOne({ guildId });
        if (!datosExistentes) {
          return await interaction.reply({
            content: "El sistema de mensajes de bienvenida aún no está configurado en este servidor",
            flags: 64,
          });
        }
  
        const embedEliminado = new EmbedBuilder()
          .setTitle("Sistema de Mensajes de Bienvenida")
          .setColor("Red")
          .setDescription("El mensaje de bienvenida ha sido eliminado de este servidor");
        
        await MensajeBienvenida.deleteOne({ guildId });
        await interaction.reply({
          embeds: [embedEliminado],
          flags: 64,
        });
      }
    },
  };