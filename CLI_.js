#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");

const command = process.argv[2];
const featureName = process.argv[3];

const sign = 'CLI by https://github.com/Dmn117';

const exit = (message) => {
    console.log(message);
    process.exit(1);
};


const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📂 Carpeta creada: ${folderPath}`);
    }
};



const generateFeature =(name) => {
    name ?? exit("❌ Debes proporcionar un nombre para la feature.");

    const singularName = toSingular(name);
    const baseDir = path.join(__dirname, "src", "features", name);

    const structure = {
        controllers: `${singularName}.controller.ts`,
        interfaces: `${singularName}.interfaces.ts`,
        models: `${singularName}.model.ts`,
        routes: `${singularName}.routes.ts`,
        schemas: `${singularName}.schema.ts`,
        validators: `${singularName}.validators.ts`,
    };

    try {
        createFolder(baseDir);

        Object.entries(structure).forEach(([folder, file]) => {
            const folderPath = path.join(baseDir, folder);
            createFolder(folderPath);
            fs.writeFileSync(path.join(folderPath, file), `// ${file} - ${sign}`);
            console.log(`📄 Archivo creado: ${path.join(folderPath, file)}`);
        });

        console.log(`✅ Feature generada: ${name}`);
    }
    catch (error) {
        exit(`❌ Error al crear la feature: ${error.message}`);
    }
};





switch (command) {
    case "feature:generate":
        generateFeature(featureName);
        break;

    case "feature:delete":
        deleteFeature(featureName);
        break;

    default:
        console.error(`❌ Comando desconocido: ${command}`);
        process.exit(1);
}






command ?? exit("❌ Debes proporcionar un comando. Ejemplo: node cli.js feature:generate users");