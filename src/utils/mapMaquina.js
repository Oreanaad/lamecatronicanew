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
        return ''; 
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
    //    Busca 'MaquinaPrecio' (alias SQL) o 'maquinaPrecio' (posiblemente directo)
    const rawPrice = row.MaquinaPrecio ?? row.maquinaPrecio;
    
    // 2. CONSOLE.LOG FINAL: Verifica qué llega a este punto (verás el log en la consola de Node.js)
    console.log("DEBUG MAPPER: Precio crudo recibido:", rawPrice); 

    // 3. Mapeo y transformación de tipos
    return {
        maquinaId: row.MaquinaId ?? row.maquinaId,
        maquinaNombre: row.MaquinaNombre ?? row.maquinaNombre,
        
        // 🚨 CLAVE: Mapeamos el precio asegurando que es un número o null 🚨
        maquinaPrecio: (rawPrice != null && rawPrice !== '') ? Number(rawPrice) : null,
        
        maquinaDescripcion: row.MaquinaDescripcion ?? row.maquinaDescripcion,
        maquinaArticulo: row.MaquinaArticulo ?? row.maquinaArticulo,
        maquinaWebEstado: !!(row.MaquinaWebEstado ?? row.maquinaWebEstado),
        
        // Asumiendo que tienes la función transformPathToUrl en este archivo
        imagenUrlChica: transformPathToUrl(row.ImagenUrlChica ?? row.imagenUrlChica),
        imagenUrl: transformPathToUrl(row.MaquinaImage_GXI ?? row.imagenUrl),
    };
}