 
import dotenv from "dotenv";
dotenv.config(); // 👈 si tu index.js está dentro de /src

import sql from "mssql";

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable ${name} en .env`);
  return v;
}

// Lee valores
const HOST = must("DB_HOST");             // ej: 127.0.0.1 o tu servidor
const NAME = must("DB_NAME");             // ej: TuBase
const USER = must("DB_USER");             // ej: sa
const PASS = must("DB_PASS");             // ej: ****

const INSTANCE = process.env.DB_INSTANCE || "";     // ej: SQLEXPRESS (opcional)
const PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

// Construye config MSSQL (tedious)
const config = {
  user: USER,
  password: PASS,
  server: HOST,                 // 👈 ESTE es el que te está faltando
  database: NAME,
  options: {
    instanceName: INSTANCE || undefined,   // usa instancia O puerto (no ambos)
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

// Solo setea puerto si NO hay instancia
if (PORT && !INSTANCE) config.port = PORT;

// Log de depuración (sin password)
console.log("🗄️ Config SQL:", {
  server: config.server,
  database: config.database,
  instanceName: config.options.instanceName,
  port: config.port,
  encrypt: config.options.encrypt,
  trustServerCertificate: config.options.trustServerCertificate,
});

let pool;
export async function getPool() {
  if (pool) return pool;
  try{
  pool = await sql.connect(config);
  return pool;

}catch(err){
  console.log("ërror conectando al sql", err.message);
  throw err;
}
}
export { sql };
