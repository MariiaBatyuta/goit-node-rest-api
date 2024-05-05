import { schemaAddContact, schemaUpdateContact } from "../helpers/schema.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (_, res) => {
    const contacts = await contactsService.listContacts();

    return res.status(200).send(contacts);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;

    const getOneContact = await contactsService.getContactById(id);
    
    if (!getOneContact) return res.status(404).send({ "message": "Not found" });

    return res.status(200).send(getOneContact);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;

    const deleteContact = await contactsService.removeContact(id);
    
    if (!deleteContact) return res.status(404).send({ "message": "Not found" });

    return res.status(200).send(deleteContact);
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;

    const { error } = schemaAddContact.validate({ name, email, phone });
    if (error) {
        return res.status(400).send({ "message": error.message });
    }

    const createContact = await contactsService.addContact(name, email, phone);

    return res.status(201).send(createContact);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { ...newData } = req.body;

    if (Object.keys(newData).length === 0) return res.status(400).send({ "message": "Body must have at least one field" });
    
    const { error } = schemaUpdateContact.validate({ ...newData });
    if (error) return res.status(400).send({ "message": error.message });

    const updateContact = await contactsService.updateContact(id, newData);

    return res.status(200).send(updateContact);
};