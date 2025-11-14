import { getPool, sql } from "../config/db.js";
import { mapRow } from "../utils/mapMaquina.js";

/** GET /api/maquinas  (solo publicadas) */
/** GET /api/maquinas (solo publicadas) */
export async function getMaquinas(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        m.MaquinaId,
        m.MaquinaNombre,
        -- 🚨 Precio directo de la tabla Maquina 🚨
        CAST(m.MaquinaPrecio AS decimal(11,2)) AS MaquinaPrecio, 
        m.MaquinaDescripcion,
        m.MaquinaArticulo,
        m.MaquinaWebEstado,
       m.MaquinaLink AS MaquinaLink,

        m.MaquinaImagenChiquita_GXI AS ImagenUrlChica,
        m.MaquinaImage_GXI          AS ImagenUrl
      FROM Maquina AS m
      -- Se eliminó el OUTER APPLY (es más rápido)
      WHERE m.MaquinaWebEstado = 1
      ORDER BY m.MaquinaNombre;
    `);
    const data = result.recordset.map(mapRow);
    res.json(data);
  } catch (err) {
    console.error("getMaquinas error:", err);
    res.status(500).json({ error: "Error obteniendo máquinas" });
  }
}
/** GET /api/maquinas/:id */
export async function getMaquinaById(req, res) {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool.request()
      .input("id", sql.Int, id)
    .query(`
        SELECT TOP 1
          m.MaquinaId,
          m.MaquinaNombre,
          CAST(m.MaquinaPrecio AS decimal(18,2)) AS MaquinaPrecio,
          m.MaquinaDescripcion,
          m.MaquinaArticulo,
          m.MaquinaWebEstado,
         m.MaquinaLink AS MaquinaLink,

          m.MaquinaImagenChiquita_GXI AS ImagenUrlChica,
          m.MaquinaImage_GXI AS ImagenUrl
        FROM Maquina AS m
        WHERE m.MaquinaId = @id;
      `);
    
    const row = result.recordset[0];
    
    // 🚨 CONSOLE.LOG CLAVE 🚨
    console.log("Fila de la BD obtenida para ID:", id);
    console.log(row);
    // 🚨 ------------------- 🚨

    if (!row) return res.status(404).json({ error: "No encontrada" });
    res.json(mapRow(row));
  } catch (err) {
    console.error("getMaquinaById error:", err);
    res.status(500).json({ error: "Error obteniendo máquina" });
  }
}

/** GET /api/maquinas/:id/imagenes */
import { transformPathToUrl } from "../utils/mapMaquina.js";

/** GET /api/maquinas/:id/imagenes */
/** GET /api/maquinas/:id/imagenes */
export async function getMaquinaImagenes(req, res) {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
            MaquinasImgId,
            MaquinaId,
            MaquinasImgImagen_GXI AS ImagensUrl
        FROM MaquinasImg
        WHERE MaquinaId = @id
        ORDER BY MaquinasImgId;
      `);
console.log("🟩 RAW SQL ROWS:", result.recordset);
    // 🔥 Aquí está el fix sin cambiar nombres
   const imagenes = result.recordset.map(row => {
  let rawPath = null;

  // tomamos absolutamente todas las variantes
  rawPath = row.ImagensUrl 
        ?? row.imagensUrl
        ?? row.MaquinasImgImagen_GXI
        ?? row.maquinasimgimagen_gxi
        ?? null;

  return {
    maquinasImgId: row.MaquinasImgId,
    maquinaId: row.MaquinaId,
    ImagensUrl: transformPathToUrl(rawPath)
  };
});

    res.json(imagenes);

  } catch (err) {
    console.error("getMaquinaImagenes error:", err);
    res.status(500).json({ error: "Error obteniendo imágenes de la máquina" });
  }
}
