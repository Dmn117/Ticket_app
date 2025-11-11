//! CLI by https://github.com/Dmn117

import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";




const description = ExtendedJoi.string().label('La Descripcion').min(10);
const label = ExtendedJoi.positiveInteger().label('La Etiqueta');

const dataTrainingObject = ExtendedJoi.object({ description: description.required(), label: label.required() }).label('El Objeto de entrenamiento')



export const trainScheme = ExtendedJoi.array().items(dataTrainingObject).label('El Arreglo de datos de entranamiento');