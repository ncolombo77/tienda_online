import mongoose from "mongoose";
import { productsCollection } from "../../constants/index.js";


// Esquema de los productos.
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Alfajores", "Conitos", "Regionales"]
    }
});

export const productsModel = mongoose.model(productsCollection, productSchema);