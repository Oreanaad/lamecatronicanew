import { getPool, sql } from "../config/db.js";
import { mapRow } from "../utils/mapMaquina.js";

/** GET /api/maquinas  (solo publicadas) */
export async function getMaquinas(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        m.MaquinaId,
        m.MaquinaNombre,
        CAST(p.MaquinaPrecioPrecio AS decimal(18,2)) AS MaquinaPrecio,
        m.MaquinaDescripcion,
        m.MaquinaArticulo,
        m.MaquinaWebEstado,
        m.MaquinaImagenChiquita_GXI AS ImagenUrlChica,
        m.MaquinaImage_GXI          AS ImagenUrl
      FROM Maquina AS m
      OUTER APPLY (
        SELECT TOP 1 
          mp.MaquinaPrecioPrecio
        FROM MaquinaPrecio AS mp
        WHERE mp.MaquinaId = m.MaquinaId
        ORDER BY mp.MaquinaPrecioFecha DESC
      ) AS p
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
          CAST(p.MaquinaPrecioPrecio AS decimal(18,2)) AS MaquinaPrecio,
          m.MaquinaDescripcion,
          m.MaquinaArticulo,
          m.MaquinaWebEstado,
          m.MaquinaImagenChiquita_GXI AS ImagenUrlChica,
          m.MaquinaImage_GXI          AS ImagenUrl
        FROM Maquina AS m
        OUTER APPLY (
          SELECT TOP 1 
            mp.MaquinaPrecioPrecio
          FROM MaquinaPrecio AS mp
          WHERE mp.MaquinaId = m.MaquinaId
          ORDER BY mp.MaquinaPrecioFecha DESC
        ) AS p
        WHERE m.MaquinaId = @id;
      `);
    const row = result.recordset[0];
    if (!row) return res.status(404).json({ error: "No encontrada" });
    res.json(mapRow(row));
  } catch (err) {
    console.error("getMaquinaById error:", err);
    res.status(500).json({ error: "Error obteniendo máquina" });
  }
}
