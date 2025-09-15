import express from "express";
import { createTable, pool } from "./database.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
app.use(express.json());

createTable();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de prueba",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Servidor local"
            }
        ]
    },
    apis: ["./index.js"],
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

/**
 * @swagger
 * /api/listar:
 *   get:
 *     summary: Listar todos los estados
 *     responses:
 *       200:
 *         description: Lista de estados
 */
app.get("/api/listar", async (req, res) =>{
    try{
        const result = await pool.query("SELECT * FROM estado");
        res.json(result.rows);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/registrar:
 *   post:
 *     summary: Registrar un nuevo estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado registrado
 */
app.post("/api/registrar", async (req, res) =>{
    try {
        const { nombre } = req.body;
        const result = await pool.query (
            "INSERT INTO estado (nombre) VALUES ($1) RETURNING *", 
            [nombre]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un estado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 */
app.delete("/api/eliminar/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const result = await pool.query("DELETE FROM estado WHERE id = $1", [id]);
        if(result.rowCount >0) {
            res.json({message: "Se elimino el registro"});
        } else {
            res.status(404).json({message: "No se encontro el registro"});
        }
    } catch (err) { 
        res.status(500).json({ error: err.message});
    }
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Index corriendo en :${PORT}`);
    console.log(`Swagger UI ya disponible: http://localhost:${PORT}/api-docs`)
});



