import Joi from "joi";
import mongoose from "mongoose";
import Regex from "../../config/regex";


const objectId = (Joi: Joi.Root) => ({
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


const objectIdList = (Joi: Joi.Root) => ({
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

const object = (Joi: Joi.Root) => ({
    type: 'object',
    base: Joi.object().unknown(true).empty(["", {}]),
    messages: {
        'object.base': '"{{#label}}" deben ser un objeto.',
        'any.required': '"{{#label}}" son obligatorias.'
    }
});


const string = (Joi: Joi.Root) => ({
    type: 'string',
    base: Joi.string().empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const positiveNumber = (Joi: Joi.Root) => ({
    type: 'positiveNumber',
    base: Joi.number().min(0).positive().empty(""),
    messages: {
        'number.base': '"{{#label}}" debe ser un numero.',
        'number.positive': '"{{#label}}" debe ser un numero positivo.',
        'number.min': '"{{#label}}" debe ser mayor o igul a {#limit}.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const email = (Joi: Joi.Root) => ({
    type: 'email',
    base: Joi.string().email().empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.email': '"{{#label}}" debe ser una direccion de Correo Electronico valida',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});



const password = (Joi: Joi.Root) => ({
    type: 'password',
    base: Joi.string().pattern(Regex.password).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.pattern.base': '"{{#label}}" debe contener al mnenos 8 caracteres, 1 mayus, 1 numero y 1 caracter especial',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const boolean = (Joi: Joi.Root) => ({
    type: 'boolean',
    base: Joi.boolean().empty(""),
    messages: {
        'boolean.base': '"{{#label}}" debe ser solo Verdadero o Falso',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const rfc = (Joi: Joi.Root) => ({
    type: 'rfc',
    base: Joi.string().pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}?$/).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de caracteres.',
        'string.pattern.base': '"{{#label}}" no tiene un formato valido.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const phoneNumber = (Joi: Joi.Root) => ({
    type: 'phoneNumber',
    base: Joi.string().min(5).pattern(/^\d{10}$/).empty(""),
    messages: {
        'string.base': '"{{#label}}" debe ser una cadena de texto.',
        'string.pattern.base': '"{{#label}}" debe ser un número de 10 dígitos.',
        'any.required': '"{{#label}}" es obligatorio.'
    }
});


const array = (Joi: Joi.Root) => ({
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


const ExtendedJoi = Joi
    .extend(rfc)
    .extend(email)
    .extend(array)
    .extend(object)
    .extend(string)
    .extend(boolean)
    .extend(password)
    .extend(objectId)
    .extend(phoneNumber)
    .extend(objectIdList)
    .extend(positiveNumber);


export default ExtendedJoi;