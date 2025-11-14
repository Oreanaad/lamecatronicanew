// La URL base que definimos antes
const BASE_URL_GENEXUS = "http://lamecatronicac.myvnc.com/PublicTempStorage/multimedia/";

/**
 * Función que transforma la ruta interna de GeneXus (gxdbfile:...) a una URL pública.
 * @param {string} gxPath La ruta devuelta por la BD, e.g., "gxdbfile:Gemini_...png"
 * @returns {string} La URL absoluta, e.g., "http://.../Gemini_...png"
 */
export const transformPathToUrl = (gxPath) => {
    // Si la ruta no existe o no es una cadena, devuelve una cadena vacía
    if (!gxPath || typeof gxPath !== 'string') {
        return null; 
    }
    
    // Verifica y remueve el prefijo "gxdbfile:"
    if (gxPath.startsWith("gxdbfile:")) {
        const fileName = gxPath.replace("gxdbfile:", "");
        return `${BASE_URL_GENEXUS}${fileName}`;
    }

    // Devuelve la ruta original si no tiene el prefijo
    return gxPath; 
};


/**
 * Mapea la fila de la BD al formato de respuesta deseado (camelCase),
 * aplicando la transformación de URLs a las imágenes.
 * * NOTA: Uso el operador de Coalescencia Nula (??) para priorizar MaquinaX
 * sobre maquinaX (esto asume que el backend SQL devuelve MaquinaX).
 */
// Archivo: mapMaquina.js
// Archivo: mapMaquina.js
export function mapRow(row) {
    // Debug para verificar qué realmente viene
    console.log("DEBUG MAPPER ROW:", row);

    const rawPrice = row.MaquinaPrecio ?? row.maquinaPrecio;

    return {
        maquinaId: row.MaquinaId ?? row.maquinaId,
        maquinaNombre: row.MaquinaNombre ?? row.maquinaNombre,

        maquinaPrecio: (rawPrice != null && rawPrice !== '') 
            ? Number(rawPrice) 
            : null,

        maquinaDescripcion: row.MaquinaDescripcion ?? row.maquinaDescripcion,
        maquinaArticulo: row.MaquinaArticulo ?? row.maquinaArticulo,

        // 👈 EL CAMPO QUE FALTABA REALMENTE
        maquinaLink: row.MaquinaLink ?? row.maquinaLink ?? null,

        maquinaWebEstado: !!(row.MaquinaWebEstado ?? row.maquinaWebEstado),

        imagenUrlChica: transformPathToUrl(row.ImagenUrlChica ?? row.imagenUrlChica),
        imagenUrl: transformPathToUrl(row.ImagenUrl ?? row.imagenUrl)
    };
}
