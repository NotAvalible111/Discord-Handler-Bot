const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina una cantidad de mensajes de un canal')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option.setName('cantidad').setDescription('Cantidad de mensajes a eliminar').setRequired(true),
    )
    .addUserOption((option) =>
      option.setName('usuario').setDescription('Eliminar mensajes de usuario').setRequired(false),
    ),
  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getInteger('cantidad');
    const target = options.getUser('usuario');

    if (amount > 99) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#EC4A48')
        .setDescription(`No se pueden eliminar más de 99 mensajes a la vez`);
      return interaction.reply({ embeds: [errorEmbed] });
    }

    const messages = await channel.messages.fetch({
      limit: amount + 1,
    });

    const res = new EmbedBuilder().setColor('#45B383');

    if (target) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg) => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `Eliminado con exito **${messages.size}** mensajes de **${target}**`,
        );
        interaction.reply({ embeds: [res], flags: 64 });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        res.setDescription(`Eliminado con exito **${messages.size}** mensajes del chat`);
        interaction.reply({ embeds: [res], flags: 64 });
      });
    }
  },
};
