export const calcularAnoServicioActual = (): number => {
  const hoy = new Date();
  return hoy.getMonth() >= 8 ? hoy.getFullYear() : hoy.getFullYear() - 1;
};

export const generarOpcionesAno = (): { valor: number; etiqueta: string }[] => {
  const anoActual = calcularAnoServicioActual();
  return Array.from({ length: 5 }, (_, i) => {
    const ano = anoActual - i;
    return { valor: ano, etiqueta: `${ano} - ${ano + 1}` };
  });
};
