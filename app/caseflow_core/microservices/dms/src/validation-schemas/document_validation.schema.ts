import * as Joi from "joi";

export const createDocumentSchema = Joi.object({
  file: Joi.string().allow(''),
  referenceId: Joi.string().required(),
  desc: Joi.string().required(),
  dmsprovider: Joi.number().required(),
  metaData: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
});

export const updateDocumentSchema = Joi.object({
  file: Joi.string().allow(''),
  id: Joi.number().required(),
  desc: Joi.string().required(),
  dmsprovider: Joi.number().required(),
  metaData: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
});


export const deleteDocumentSchema = Joi.object({
  id: Joi.number().required(),
});

export const downloadDocumentSchema = Joi.object({
  id: Joi.number().required(),
});