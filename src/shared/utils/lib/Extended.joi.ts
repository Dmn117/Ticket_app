import Joi, { AnySchema, Extension, ExtensionFactory, NumberSchema, ObjectSchema, Root, StringSchema } from "joi";
import mongoose from "mongoose";
import Regex from "../../config/regex";


interface ExtendedJoi extends Root {
    rfc: () => StringSchema;
    email: () => StringSchema;
    password: () => StringSchema;
    objectId: () => StringSchema;
    phoneNumber: () => StringSchema;
    objectIdList: () => StringSchema;
    positiveNumber: () => NumberSchema;
    positiveInteger: () => NumberSchema;
 }



const objectId: ExtensionFactory = (Joi: Root) => ({
    type: 'objectId',
    base: Joi.string().empty("").allow(null),
    messages: {
        'objectId.base': '"{{#label}}" no es un ObjectId valido'
    },
    validate(value: any, helpers: Joi.CustomHelpers<string>) {
        if (value && !mongoose.isValidObjectId(value)) {
            return { value, errors: helpers.error('objectId.base')}
        }
        return { value };
    }
});


const objectIdList: ExtensionFactory = (Joi: Root) => ({
    type: 'objectIdList',
    base: Joi.string().empty(""),
    messages: {
        'objectIdList.base': '"{{#label}}" debe ser una cadena de ObjectIds separados por ", ".',
        'objectIdList.invalid': '"{{#label}}" contiene valores que no son del tipo ObjectId.'
    },
    validate(value: any, helpers: Joi.CustomHelpers<string>) {
        const ids = value.split(',').map((id: string) => id.trim());

        for (const id of ids) {
            if (!mongoose.isValidObjectId(id)) {
                return { value, errors: helpers.error('objectIdList.invalid')};
            }
        }

        return { value };
    }
});

const object: ExtensionFactory = (Joi: Root) => ({
    type: 'object',
    base: Joi.object().unknown(true).empty(["", {}]),
    messages: {
        'object.base': '"{{#label}}" deben ser un objeto.',
        'any.required': '"{{#label}}" son obligatorias.'
    }
});


const string: ExtensionFactory = (Joi: Root) => ({
    type: 'string',
    base: Joi.string().empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const positiveNumber: ExtensionFactory = (Joi: Root) => ({
    type: 'positiveNumber',
    base: Joi.number().min(0).empty(""),
    messages: {
        'number.base': '"{{#label}}" debe ser un numero.',
        'number.min': '"{{#label}}" debe ser mayor o igul a {#limit}.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const positiveInteger: ExtensionFactory = (Joi: Root) => ({
    type: 'positiveInteger',
    base: Joi.number().integer().min(0).empty(""),
    messages: {
        'number.base': '"{{#label}}" debe ser un numero.',
        'number.integer': '"{{#label}}" debe ser un número entero.',
        'number.min': '"{{#label}}" debe ser mayor o igul a {#limit}.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const email: ExtensionFactory = (Joi: Root) => ({
    type: 'email',
    base: Joi.string().email().empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.email': '"{{#label}}" debe ser una direccion de Correo Electronico valida',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});



const password: ExtensionFactory = (Joi: Root) => ({
    type: 'password',
    base: Joi.string().pattern(Regex.password).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.pattern.base': '"{{#label}}" debe contener al menos 8 caracteres, 1 mayuscula, 1 numero y 1 caracter especial',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const boolean: ExtensionFactory = (Joi: Root) => ({
    type: 'boolean',
    base: Joi.boolean().empty(""),
    messages: {
        'boolean.base': '"{{#label}}" debe ser solo Verdadero o Falso',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const rfc: ExtensionFactory = (Joi: Root) => ({
    type: 'rfc',
    base: Joi.string().pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}?$/).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.pattern.base': '"{{#label}}" no tiene un formato valido.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const phoneNumber: ExtensionFactory = (Joi: Root) => ({
    type: 'phoneNumber',
    base: Joi.string().min(5).pattern(/^\d{10}$/).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de texto.',
        'string.pattern.base': '"{{#label}}" debe ser un número de 10 dígitos.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const array: ExtensionFactory = (Joi: Root) => ({
    type: 'array',
    base: Joi.array().empty(""),
    messages: {
        'array.base': '"{{#label}}" debe ser un array',
        'array.includes': '"{{#label}}" tiene uno o más elementos que no son válidos',
        'array.includesRequiredUnknowns': '"{{#label}}" debe contener al menos "{{#unknownMisses}}" elementos requeridos',
        'array.length': '"{{#label}}" debe contener exactamente "{{#limit}}" elementos',
        'array.max': '"{{#label}}" debe contener como máximo "{{#limit}}" elementos',
        'array.min': '"{{#label}}" debe contener al menos "{{#limit}}" elementos',
        'array.unique': '"{{#label}}" debe tener solo elementos únicos',
        'any.required': '"{{#label}}" es obligatorio.'
      }
});


const date: ExtensionFactory = (Joi: Root) => ({
    type: 'date',
    base: Joi.date().empty(""),
    messages: {
        'date.base': '{{#label}} debe ser una fecha',
        'any.required': '"{{#label}}" es obligatoria.'
    }
});


const ExtendedJoi: ExtendedJoi = Joi
    .extend(rfc)
    .extend(date)
    .extend(email)
    .extend(array)
    .extend(object)
    .extend(string)
    .extend(boolean)
    .extend(password)
    .extend(objectId)
    .extend(phoneNumber)
    .extend(objectIdList)
    .extend(positiveNumber)
    .extend(positiveInteger);


export default ExtendedJoi;