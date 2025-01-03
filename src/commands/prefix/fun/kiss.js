const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

const cuentasDeBeso = new Map();

module.exports = {
  name: "kiss",

  /**
   * @param {Message} message
   */
  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No puedes darte un beso a ti mismo!");
    }

    if (target.id === message.client.user.id) {
      return message.channel.send("¡No quiero un beso! 😅");
    }

    if (!cuentasDeBeso.has(user)) {
      cuentasDeBeso.set(user, 0);
    }

    cuentasDeBeso.set(user, cuentasDeBeso.get(user) + 1);

    const descripcion = `**${user}** le dio un beso a **${target.username}** por ${cuentasDeBeso.get(user)} vez(es)! 😘`;

    const url = await anime.kiss();

    const embed = new EmbedBuilder()
      .setTitle("Comando de Beso")
      .setDescription(descripcion)
      .setColor("Fuchsia")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
