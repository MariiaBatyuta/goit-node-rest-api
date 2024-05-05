import Contact from "../models/contact.js";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res, next) => {
    try {
        const contacts = await Contact.find();
        res.status(200).send(contacts)
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findById(id);

        if (!contact) return res.status(404).send({ "message": "Not found" });

        res.status(200).send(contact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {

    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite,
    }

    try {
        const { error } = createContactSchema.validate(contact);
        if (error) return res.status(400).send({ "message": error.message });

        const createContact = await Contact.create(contact);

        res.status(201).send(createContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;

    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite,
    }

    try {
        if (Object.keys(contact).length === 0) return res.status(400).send({ "message": "Body must have at least one field" });
    
        const { error } = updateContactSchema.validate(contact);
        if (error) return res.status(400).send({ "message": error.message });

        const updateContact = await Contact.findByIdAndUpdate(id, contact, { new: true });
        
        if (!updateContact) return res.status(404).send({ "message": "Not found" });

        res.status(200).send(updateContact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleteContact = await Contact.findByIdAndDelete(id);
        
        if (!deleteContact) return res.status(404).send({ "message": "Not found" });

        res.status(200).send(deleteContact);
    } catch (error) {
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
        const updateStatusContact = await Contact.findByIdAndUpdate(id, { favorite: favorite }, { new: true });
        
        if (!updateStatusContact) return res.status(404).send({ "message": "Not found" });
        
        res.status(200).send(updateStatusContact);
    } catch (error) {
        next(error);
    }
}