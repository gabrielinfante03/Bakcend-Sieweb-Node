import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "back_basededatos",
    password: "75140560",
    port:5432,
});

export const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS estado (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL
    );
  `;
  await pool.query(query);
  console.log("Tabla 'estado'");
};
 
export {pool};