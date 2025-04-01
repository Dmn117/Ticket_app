#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");

const command = process.argv[2];
const featureName = process.argv[3];

const sign = 'CLI by https://github.com/Dmn117';

if (!command) {
  console.error("❌ Debes proporcionar un comando. Ejemplo: node cli.js feature:generate users");
  process.exit(1);
}

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

// Función para generar una nueva feature
function generateFeature(name) {
  if (!name) {
    console.error("❌ Debes proporcionar un nombre para la feature.");
    process.exit(1);
  }

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
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log(`📁 Carpeta creada: ${baseDir}`);
    }

    Object.entries(structure).forEach(([folder, file]) => {
      const folderPath = path.join(baseDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`📂 Carpeta creada: ${folderPath}`);
      }

      const filePath = path.join(folderPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `//! ${sign}`, "utf8");
        console.log(`📄 Archivo creado: ${filePath}`);
      }
    });

    console.log("✅ Feature generada con éxito.");
  } catch (error) {
    console.error("❌ Error al generar la feature:", error);
  }
}

// Función para eliminar una feature
function deleteFeature(name) {
  if (!name) {
    console.error("❌ Debes proporcionar un nombre para la feature.");
    process.exit(1);
  }

  const baseDir = path.join(__dirname, "src", "features", name);

  try {
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
      console.log(`🗑️ Feature eliminada: ${baseDir}`);
    } else {
      console.log("⚠️ La feature no existe.");
    }
  } catch (error) {
    console.error("❌ Error al eliminar la feature:", error);
  }
}

// Función para convertir a singular correctamente
function toSingular(str) {
  return capitalize(pluralize.singular(str));
}

// Función para capitalizar la primera letra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
