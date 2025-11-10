// La URL base que definimos antes
const BASE_URL_GENEXUS = "http://lamecatronicac.myvnc.com/PublicTempStorage/multimedia/";

/**
 * Función que transforma la ruta interna de GeneXus (gxdbfile:...) a una URL pública.
 * @param {string} gxPath La ruta devuelta por la BD, e.g., "gxdbfile:Gemini_...png"
 * @returns {string} La URL absoluta, e.g., "http://.../Gemini_...png"
 */
const transformPathToUrl = (gxPath) => {
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
export function mapRow(row) {
    // 1. Obtener el precio de forma tolerante:
    const rawPrice = row.MaquinaPrecio ?? row.maquinaPrecio;
    
    // 🚨 DEBUG: Verifica qué llega a este punto (Ahora buscando los ALIAS) 🚨
    console.log("DEBUG MAPPER: Fila completa:", row); 
    
    // 3. Mapeo y transformación de tipos
    return {
        maquinaId: row.MaquinaId ?? row.maquinaId,
        maquinaNombre: row.MaquinaNombre ?? row.maquinaNombre,
        
        // El precio sigue siendo validado como Number()
        maquinaPrecio: (rawPrice != null && rawPrice !== '') ? Number(rawPrice) : null,
        
        maquinaDescripcion: row.MaquinaDescripcion ?? row.maquinaDescripcion,
        maquinaArticulo: row.MaquinaArticulo ?? row.maquinaArticulo,
        maquinaWebEstado: !!(row.MaquinaWebEstado ?? row.maquinaWebEstado),
      imagenUrlChica: transformPathToUrl(row.ImagenUrlChica ?? row.imagenUrlChica),
        imagenUrl: transformPathToUrl(row.ImagenUrl ?? row.imagenUrl),
    };
}