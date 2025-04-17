const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { color, getTimestamp } = require('../utils/loggingEffects.js');
const AsciiTable = require('ascii-table');

async function connectDatabase() {
    if (!process.env.mongodb) {
        console.log(`${color.yellow}[${getTimestamp()}] Variable de entorno MongoDB no configurada. Funcionando sin base de datos.`);
        return false; 
    }

    try {
        console.log(`${color.red}[${getTimestamp()}] Conectando a MongoDB...`);
        await mongoose.connect(process.env.mongodb, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        });
        console.log(`${color.orange}[${getTimestamp()}] ¡Conexión a MongoDB establecida!\n`);

        const schemasPath = path.join(__dirname, '../schemas');
        const schemaFiles = fs.readdirSync(schemasPath).filter(file => file.endsWith('.js'));

        console.log(`${color.green}[${getTimestamp()}] Cargando schemas...`);
        
        const schemaTable = new AsciiTable('Estado de Carga de Schemas')
            .setHeading('Archivo', 'Estado', 'Mensaje');

        for (const file of schemaFiles) {
            try {
                require(path.join(schemasPath, file));
                schemaTable.addRow(
                    file,
                    '✓',
                    'Cargado exitosamente'
                );
            } catch (error) {
                schemaTable.addRow(
                    file,
                    '✗',
                    `Error: ${error.message}`
                );
            }
        }

        console.log(schemaTable.toString());
        console.log(`${color.green}[${getTimestamp()}]\n¡${schemaFiles.length} schemas procesados!\n`);
        
        return true; 

    } catch (error) {
        const errorTable = new AsciiTable('Error de Conexión')
            .setHeading('Tipo', 'Mensaje');
        
        errorTable.addRow(
            'Error MongoDB',
            error.message
        );

        console.log(errorTable.toString());
        console.log(`${color.yellow}[${getTimestamp()}] Continuando sin conexión a MongoDB. Algunas funcionalidades podrían no estar disponibles.`);
        
        return false; 
    }
}

module.exports = { connectDatabase };
