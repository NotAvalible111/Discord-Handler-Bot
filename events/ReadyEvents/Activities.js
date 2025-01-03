const { Events, ActivityType } = require('discord.js');
require('dotenv').config();
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        
        try {

                   const activities = [
                {
                    name: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} miembros`,
                    type: ActivityType[process.env.ACTIVITY_1 || 'Watching']
                },
                {
                    name: `${client.slashCommands.size + client.prefixCommands.size} comandos`,
                    type: ActivityType[process.env.ACTIVITY_2 || 'Playing']
                },
                {
                    name: process.env.CUSTOM_STATUS || `${client.guilds.cache.size} servidores`,
                    type: ActivityType[process.env.ACTIVITY_3 || 'Listening']
                }
            ];

            let currentIndex = 0;

            const updateActivity = () => {
                const activity = activities[currentIndex];
                
                try {
                    activities[0].name = `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} miembros`;
                    activities[1].name = `${client.slashCommands.size + client.prefixCommands.size} comandos`;
                    activities[2].name = process.env.CUSTOM_STATUS || `${client.guilds.cache.size} servidores`;

                    client.user.setPresence({
                        activities: [{ name: activity.name, type: activity.type }],
                        status: process.env.BOT_STATUS || 'online'
                    });

                } catch (error) {
                    console.error(chalk.red(`[ACTIVITY] Error al establecer actividad:`, error));
                }

                currentIndex = (currentIndex + 1) % activities.length;
            };

            updateActivity();

            const interval = setInterval(updateActivity, process.env.ACTIVITY_INTERVAL || 10000);

            client.once('disconnect', () => {
                clearInterval(interval);
                console.log(chalk.yellow('[ACTIVITY] Sistema de actividades detenido'));
            });

        } catch (error) {
            console.error(chalk.red(error));
        }
    }
};