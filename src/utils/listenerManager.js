const { EventEmitter } = require('events');

class ListenerManager {
    constructor() {
        this.defaultMaxListeners = 15; //configurar a su conveniencia (cuanto más es, nas memoria consume)
        EventEmitter.defaultMaxListeners = this.defaultMaxListeners;
    }

    initialize(client) {
        this.client = client;
        this.setupManager();
        console.log('[ListenerManager] Inicializado correctamente');
    }

    setupManager() {
        if (!this.client) return;
        
        this.client.setMaxListeners(this.defaultMaxListeners);
        setInterval(() => this.cleanupListeners(), 1800000); // cada 30 minutos
    }

    cleanupListeners() {
        if (!this.client) return;

        try {
            const listeners = this.client.listeners('interactionCreate');
            const uniqueListeners = new Set();

            listeners.forEach(listener => {
                if (!uniqueListeners.has(listener.toString())) {
                    uniqueListeners.add(listener.toString());
                } else {
                    this.client.removeListener('interactionCreate', listener);
                }
            });

            console.log(`[ListenerManager] Limpieza completada. Listeners actuales: ${this.client.listeners('interactionCreate').length}`);
        } catch (error) {
            console.error('[ListenerManager] Error durante la limpieza:', error);
        }
    }

    addInteractionListener(handler) {
        if (!this.client) return;

        const currentCount = this.client.listeners('interactionCreate').length;
        if (currentCount >= this.defaultMaxListeners - 1) {
            this.cleanupListeners();
        }
        this.client.on('interactionCreate', handler);
    }
}

module.exports = new ListenerManager();