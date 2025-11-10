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
export function mapRow(row) {
    // Función auxiliar para manejar el precio de forma limpia
    const getPrecio = (r) => {
        const precioValue = r.MaquinaPrecio != null ? r.MaquinaPrecio : r.maquinaPrecio;
        return precioValue != null ? Number(precioValue) : null;
    };
    
    // Función auxiliar para obtener y transformar las URLs
    const getAndTransformUrl = (r, keyCapital, keyCamel) => {
        const path = r[keyCapital] ?? r[keyCamel];
        return transformPathToUrl(path);
    };

    return {
        // Normalización de campos y valores
        maquinaId: row.MaquinaId ?? row.maquinaId,
        maquinaNombre: row.MaquinaNombre ?? row.maquinaNombre,
        maquinaPrecio: getPrecio(row), // Utiliza la función auxiliar
        maquinaDescripcion: row.MaquinaDescripcion ?? row.maquinaDescripcion ?? null,
        maquinaArticulo: row.MaquinaArticulo ?? row.maquinaArticulo ?? null,
        // Convierte a booleano de forma segura
        maquinaWebEstado: !!(row.MaquinaWebEstado ?? row.maquinaWebEstado), 
        
        // Aplica la transformación de URL
        imagenUrlChica: getAndTransformUrl(row, 'ImagenUrlChica', 'imagenUrlChica'),
        imagenUrl: getAndTransformUrl(row, 'ImagenUrl', 'imagenUrl'),
    };
}