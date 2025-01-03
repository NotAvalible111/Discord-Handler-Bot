const anime = require("anime-actions");
const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  name: "pat",

  /**
   * @param {Message} message
   */

  async execute(message) {
    const user = message.author.toString();
    const target = message.mentions.users.first();

    if (!target || target.id === message.author.id) {
      return message.channel.send("¡No te puedes acariciar a ti mismo! 😥 ");
    }

    const url = await anime.pat();

    const embed = new EmbedBuilder()
      .setDescription(`**${user}** acarició a **${target.username}** 🥰`)
      .setColor("DarkButNotBlack")
      .setImage(url);

    await message.channel.send({ embeds: [embed] });
  },
};
