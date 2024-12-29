# 🤖 Discord Bot Multifuncional

Un bot de Discord avanzado creado con Discord.js que incluye manejo de comandos (prefix y slash), botones, eventos y más características.

## ✨ Características

- Sistema de comandos con prefijo
- Comandos slash (/)
- Manejo de botones e interacciones
- Sistema de eventos
- Manejo de errores
- Configuración personalizable
- Base de datos integrada (mongodb)
- Sistema Anti_Crash


## ⚙️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/TheRedactedProfile193/Discord-Handler-Bot.git
cd Discord-Handler-Bot
```

2. Instala las dependencias:
```bash
npm install discord.js
```

## 🚀 Uso

1. Inicia el bot:
```bash
node .
```

2. Comandos de prefijo:
```
!say - Haz que el bot diga algo por ti
```

3. Comandos slash:
```
/ping - Comprueba la latencia del bot
/test - Comando de prueba
```

## 📚 Documentación

### Crear un Nuevo Comando de Prefijo

```javascript
// commands/prefix/ejemplo.js
module.exports = {
    name: 'ejemplo',
    description: 'Un comando de ejemplo',
    execute(message, args) {
        message.reply('¡Este es un comando de ejemplo!');
    }
};
```

### Crear un Nuevo Comando Slash

```javascript
// commands/slash/ejemplo.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ejemplo')
        .setDescription('Un comando slash de ejemplo'),
    async execute(interaction) {
        await interaction.reply('¡Este es un comando slash de ejemplo!');
    }
};
```

### Crear un Nuevo Evento

```javascript
// events/ready.js
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot conectado como ${client.user.tag}`);
    }
};
```