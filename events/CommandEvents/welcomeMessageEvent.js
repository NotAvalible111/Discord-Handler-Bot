const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const MensajeBienvenida = require("../../schemas/welcomeMessageSchema");
const Canvas = require("canvas");

var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024, 500);
welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
welcomeCanvas.context.font = "72px sans-serif";
welcomeCanvas.context.fillStyle = "#ffffff";
welcomeCanvas.context.textAlign = "center";

Canvas.loadImage(
  "https://images6.alphacoders.com/519/thumb-1920-519732.jpg"
).then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
    welcomeCanvas.context.fillText("Bienvenido", 512, 360);
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    welcomeCanvas.context.stroke();
    welcomeCanvas.context.fill();
  });
  
  module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
      try {
        let canvas = welcomeCanvas;
        canvas.context.font = "42px sans-serif";
        canvas.context.textAlign = "center";
        canvas.context.fillText(member.user.username.toUpperCase(), 512, 410);
        canvas.context.font = "32px sans-serif";
        canvas.context.fillText(
          `Eres el miembro número ${member.guild.memberCount}`,
          512,
          455
        );
        canvas.context.beginPath();
        canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
        canvas.context.closePath();
        canvas.context.clip();
  
        const avatar = await Canvas.loadImage(
          member.user.displayAvatarURL({ extension: "png", size: 1024 })
        );
        canvas.context.drawImage(avatar, 393, 47, 238, 238);
  
        let attachment = new AttachmentBuilder(
          canvas.create.toBuffer(),
          `bienvenida-${member.id}.png`
        );
  
        const mensajeBienvenida = await MensajeBienvenida.findOne({
          guildId: member.guild.id,
        });
  
        if (mensajeBienvenida) {
          const channel = member.guild.channels.cache.get(mensajeBienvenida.channelId);
          const mensajeContenido = mensajeBienvenida.message.replace(
            "{user}",
            member.user.toString()
          );
  
          await channel.send({ content: mensajeContenido });
          await channel.send({ files: [attachment] });
        }
      } catch (error) {
        console.error("Error en el evento de bienvenida:", error);
      }
    },
  };
  
  