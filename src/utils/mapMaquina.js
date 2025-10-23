export function mapRow(row) {
  return {
    maquinaId: row.MaquinaId ?? row.maquinaId,
    maquinaNombre: row.MaquinaNombre ?? row.maquinaNombre,
    // 👇 lee cualquiera de las 2 y lo normaliza a camelCase
    maquinaPrecio:
      row.MaquinaPrecio != null
        ? Number(row.MaquinaPrecio)
        : (row.maquinaPrecio != null ? Number(row.maquinaPrecio) : null),
    maquinaDescripcion: row.MaquinaDescripcion ?? row.maquinaDescripcion ?? null,
    maquinaArticulo: row.MaquinaArticulo ?? row.maquinaArticulo ?? null,
    maquinaWebEstado: (row.MaquinaWebEstado ?? row.maquinaWebEstado) ? true : false,
    imagenUrlChica: row.ImagenUrlChica ?? row.imagenUrlChica ?? null,
    imagenUrl: row.ImagenUrl ?? row.imagenUrl ?? null,
  };
}
