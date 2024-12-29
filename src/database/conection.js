const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

async function connectDatabase() {
    try {
        console.log(chalk.yellow('Conectando a MongoDB...'));
        await mongoose.connect(process.env.mongodb, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        });
        console.log(chalk.green('¡Conexión a MongoDB establecida!\n'));
        
        // Cargar schemas
        const schemasPath = path.join(__dirname, '../schemas');
        const schemaFiles = fs.readdirSync(schemasPath).filter(file => file.endsWith('.js'));
        
        console.log(chalk.yellow('Cargando schemas...'));
        for (const file of schemaFiles) {
            try {
                require(path.join(schemasPath, file));
                console.log(chalk.green(`✓ Schema cargado: ${file}`));
            } catch (error) {
                console.log(chalk.red(`✗ Error al cargar schema ${file}:`, error));
            }
        }
        console.log(chalk.green(`¡${schemaFiles.length} schemas cargados exitosamente!\n`));
        
    } catch (error) {
        console.error(chalk.red('Error al conectar a MongoDB:'), error);
        process.exit(1);
    }
}

module.exports = { connectDatabase };