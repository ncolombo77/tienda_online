import express from "express";
import { config } from "./config/config.js";
import { connectDB } from "./config/dbconnection.js";

import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path from 'path';
import { Server } from "socket.io";
import { ProductsMongo } from "./dao/managers/mongo/productsMongo.js";

import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
//import { cartsRouter } from "./routes/carts.routes.js";

import { chatModel } from "./dao/models/chat.model.js";

const port = config.server.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(port, () => console.log(`Servidor iniciado en el puerto ${ port }.`));

const socketServer = new Server(httpServer);

// Conexión a la base de datos
connectDB();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));


app.use(viewsRouter);

app.use("/api/products", productsRouter);
//app.use("/api/carts", cartsRouter);


socketServer.on("connection", (socketConnected) => {

    console.log(`Nuevo cliente conectado (id: ${ socketConnected.id } ).`);

    socketConnected.on("newProduct", async (data) => {
        try {
            const productService = new ProductManager('products.json');

            const products = await productService.get();

            const productCreated = await productService.save(data);

            products.push(productCreated);

            socketServer.emit("productsUpdate", products);
        }
        catch (error) {
            console.log("Error: ", error.message);
        }

    })


    socketConnected.on("authenticated", async (msg) => {
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
        socketConnected.broadcast.emit("newUser", msg);
    });

    socketConnected.on("message", async (data) => {
        console.log("Datos: ", data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
    });

});