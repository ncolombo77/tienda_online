import { Router } from "express";
import { ProductsMongo } from "../dao/managers/mongo/productsMongo.js";

const productService = new ProductsMongo('products.json');

const router = Router();

router.get("/", async (req, res) => {
    res.render("home");
});


router.get("/products", async (req, res) => {

    try {
        const products = await productService.get();
        res.render("products", { products});
    }
    catch (error) {
        res.render("error", error);
    }

});


router.get("/realtimeproducts", async (req, res) => {

    try {
        const products = await productService.get();

        res.render("realTimeProducts", { products });
    }
    catch (error) {
        res.render("error", error);
    }

});


router.get("/chat", async (req, res) => {

    res.render("chat");

});



export { router as viewsRouter };