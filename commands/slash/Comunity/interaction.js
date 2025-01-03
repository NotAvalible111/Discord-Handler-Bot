const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('anime').setDescription('Comandos relacionados con anime')
    .addSubcommand(subcommand => subcommand.setName('waifu').setDescription('¡Responde con una waifu!'))
    .addSubcommand(subcommand => subcommand.setName('neko').setDescription('¡Responde con una neko!'))
    .addSubcommand(subcommand => subcommand.setName('shinobu').setDescription('¡Responde con Shinobu!'))
    .addSubcommand(subcommand => subcommand.setName('megumin').setDescription('¡Responde con Megumin!'))
    .addSubcommand(subcommand => subcommand.setName('cuddle').setDescription('¡Responde con un abrazo suave!'))
    .addSubcommand(subcommand => subcommand.setName('hug').setDescription('¡Responde con un abrazo!'))
    .addSubcommand(subcommand => subcommand.setName('kiss').setDescription('¡Responde con un beso!'))
    .addSubcommand(subcommand => subcommand.setName('lick').setDescription('¡Responde con una lamida!'))
    .addSubcommand(subcommand => subcommand.setName('pat').setDescription('¡Responde con una palmadita!'))
    .addSubcommand(subcommand => subcommand.setName('smug').setDescription('¡Responde con un personaje presumido!'))
    .addSubcommand(subcommand => subcommand.setName('blush').setDescription('¡Responde con un personaje sonrojado!'))
    .addSubcommand(subcommand => subcommand.setName('smile').setDescription('¡Responde con un personaje sonriendo!'))
    .addSubcommand(subcommand => subcommand.setName('wave').setDescription('¡Responde con un saludo!'))
    .addSubcommand(subcommand => subcommand.setName('highfive').setDescription('¡Responde con un choca esos cinco!'))
    .addSubcommand(subcommand => subcommand.setName('handhold').setDescription('¡Responde con un agarre de manos!'))
    .addSubcommand(subcommand => subcommand.setName('nom').setDescription('¡Responde con un nom!'))
    .addSubcommand(subcommand => subcommand.setName('bite').setDescription('¡Responde con un mordisco!'))
    .addSubcommand(subcommand => subcommand.setName('glomp').setDescription('¡Responde con un abrazo efusivo!'))
    .addSubcommand(subcommand => subcommand.setName('happy').setDescription('¡Responde con un personaje feliz!'))
    .addSubcommand(subcommand => subcommand.setName('wink').setDescription('¡Responde con un guiño!'))
    .addSubcommand(subcommand => subcommand.setName('poke').setDescription('¡Responde con un toque!'))
    .addSubcommand(subcommand => subcommand.setName('dance').setDescription('¡Responde con un baile!'))
    .addSubcommand(subcommand => subcommand.setName('cringe').setDescription('¡Responde con algo vergonzoso!')),
    
    async execute(interaction) {
        const type = interaction.options.getSubcommand();
        const waifuFetch = await fetch(`https://api.waifu.pics/sfw/${type}`, { headers: { Accept: 'application/json' } });
        if (!waifuFetch.ok) {
          return interaction.reply(`La solicitud a la API falló con estado **${waifuFetch.status}**.`);
        }
        const waifuData = await waifuFetch.json();
        const waifuEmbed = new EmbedBuilder().setImage(waifuData.url).setColor("Red").setTimestamp();
        await interaction.reply({
          content: `**❤️ ${type.charAt(0).toUpperCase() + type.slice(1)}:**`,
          embeds: [waifuEmbed],
        });
      },
    };