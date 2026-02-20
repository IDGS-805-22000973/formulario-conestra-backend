// Clave de respuestas correctas basada en tu código Java
const MOSS_KEY: Record<string, string> = {
  q1: "C", q2: "B", q3: "D", q4: "B", q5: "B", q6: "B", q7: "B", q8: "B", q9: "C", q10: "C",
  q11: "A", q12: "C", q13: "D", q14: "D", q15: "D", q16: "D", q17: "B", q18: "D", q19: "C", q20: "B",
  q21: "A", q22: "A", q23: "A", q24: "D", q25: "B", q26: "C", q27: "A", q28: "C", q29: "C", q30: "A"
};

// Tablas de baremos (Percentiles) de tu código Java
const BAREMOS = {
  supervision: { p: [1, 2, 3, 4, 5, 6], per: [17, 34, 50, 67, 84, 100] },
  decision: { p: [1, 2, 3, 4, 5], per: [20, 40, 60, 80, 100] },
  evaluacion: { p: [1, 2, 3, 4, 5, 6, 7, 8], per: [13, 25, 38, 50, 63, 75, 88, 100] },
  relaciones: { p: [1, 2, 3, 4, 5], per: [20, 40, 60, 80, 100] },
  sentidoComun: { p: [1, 2, 3, 4, 5, 6], per: [17, 34, 50, 67, 84, 100] }
};

export const calculateMoss = (answers: Record<string, string>) => {
  // 1. Determinar cuáles son aciertos (1) y cuáles no (0)
  // Creamos un array de 31 posiciones para que coincida con tus índices de Java (1-30)
  const valoresRespuestas = new Array(31).fill(0);
  
  for (let i = 1; i <= 30; i++) {
    const key = `q${i}`;
    if (answers[key] === MOSS_KEY[key]) {
      valoresRespuestas[i] = 1;
    }
  }

  // 2. Cálculo de resultados por área (Mapeo exacto de tu lógica Java)
  const habilidadesSupervision = valoresRespuestas[2] + valoresRespuestas[3] + valoresRespuestas[16] + valoresRespuestas[18] + valoresRespuestas[24] + valoresRespuestas[30];
  const capacidadDecision = valoresRespuestas[4] + valoresRespuestas[6] + valoresRespuestas[29];
  const evaluacionProblemas = valoresRespuestas[7] + valoresRespuestas[9] + valoresRespuestas[12] + valoresRespuestas[14] + valoresRespuestas[19] + valoresRespuestas[21] + valoresRespuestas[26] + valoresRespuestas[27];
  const establecerRelaciones = valoresRespuestas[3] + valoresRespuestas[12] + valoresRespuestas[13] + valoresRespuestas[15] + valoresRespuestas[27];
  const sentidoComun = valoresRespuestas[5] + valoresRespuestas[8] + valoresRespuestas[15] + valoresRespuestas[17] + valoresRespuestas[22] + valoresRespuestas[28];

  // 3. Cálculo de percentiles usando las tablas
  const hsPercentil = calcularPercentil(habilidadesSupervision, BAREMOS.supervision.p, BAREMOS.supervision.per);
  const cdPercentil = calcularPercentil(capacidadDecision, BAREMOS.decision.p, BAREMOS.decision.per);
  const epPercentil = calcularPercentil(evaluacionProblemas, BAREMOS.evaluacion.p, BAREMOS.evaluacion.per);
  const erPercentil = calcularPercentil(establecerRelaciones, BAREMOS.relaciones.p, BAREMOS.relaciones.per);
  const scPercentil = calcularPercentil(sentidoComun, BAREMOS.sentidoComun.p, BAREMOS.sentidoComun.per);

  return {
    areas: {
      supervision: { puntaje: habilidadesSupervision, percentil: hsPercentil, rango: obtenerDiagnostico(hsPercentil) },
      decision: { puntaje: capacidadDecision, percentil: cdPercentil, rango: obtenerDiagnostico(cdPercentil) },
      evaluacion: { puntaje: evaluacionProblemas, percentil: epPercentil, rango: obtenerDiagnostico(epPercentil) },
      relaciones: { puntaje: establecerRelaciones, percentil: erPercentil, rango: obtenerDiagnostico(erPercentil) },
      sentidoComun: { puntaje: sentidoComun, percentil: scPercentil, rango: obtenerDiagnostico(scPercentil) }
    },
    totalAciertos: valoresRespuestas.reduce((a, b) => a + b, 0)
  };
};

// Helper: Buscar percentil (Adaptado de tu método privado en Java)
function calcularPercentil(puntaje: number, puntajes: number[], percentiles: number[]): number {
  for (let i = 0; i < puntajes.length; i++) {
    if (puntaje === puntajes[i]) {
      return percentiles[i];
    }
  }
  return 0;
}

// Helper: Obtener diagnóstico (Adaptado de tu método privado en Java)
function obtenerDiagnostico(percentil: number): string {
  if (percentil >= 90) return "Muy Superior";
  if (percentil >= 75) return "Medio Superior";
  if (percentil >= 50) return "Medio";
  if (percentil >= 25) return "Medio Inferior";
  return "Inferior";
}