const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');

async function connectDatabase() {
    try {
        console.log(chalk.yellow('Conectando a MongoDB...'));
        await mongoose.connect(process.env.mongodb, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        });
        console.log(chalk.green('¡Conexión a MongoDB establecida!\n'));

        const schemasPath = path.join(__dirname, '../schemas');
        const schemaFiles = fs.readdirSync(schemasPath).filter(file => file.endsWith('.js'));

        console.log(chalk.yellow('Cargando schemas...'));
        
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

        // Mostrar la tabla
        console.log(schemaTable.toString());
        console.log(chalk.green(`\n¡${schemaFiles.length} schemas procesados!\n`));

    } catch (error) {
        const errorTable = new AsciiTable('Error de Conexión')
            .setHeading('Tipo', 'Mensaje');
        
        errorTable.addRow(
            'Error MongoDB',
            error.message
        );

        console.log(errorTable.toString());
        process.exit(1);
    }
}

module.exports = { connectDatabase };