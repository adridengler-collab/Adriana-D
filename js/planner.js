/**
 * Motor de Búsqueda y Planificador de Viajes para Puerto Iguazú
 */

class TripPlanner {
  constructor() {
    this.popularLocations = [
      { id: "terminal", name: "Terminal de Ómnibus Central", keywords: ["terminal", "omnibus", "rodoviaria", "centro de trasbordo", "plataforma"], lineIds: ["line-cataratas", "line-hito", "line-aeropuerto", "line-600", "line-u1", "line-u2", "line-internacional-br", "line-internacional-py"] },
      { id: "centro", name: "Centro / Plaza San Martín / Av. Victoria Aguirre", keywords: ["centro", "downtown", "plaza", "san martin", "aguirre", "brasil", "bares", "feirinha"], lineIds: ["line-cataratas", "line-hito", "line-aeropuerto", "line-600", "line-u1", "line-u2", "line-internacional-br", "line-internacional-py"] },
      { id: "cataratas", name: "Parque Nacional Iguazú (Cataratas)", keywords: ["cataratas", "falls", "parque nacional", "garganta del diablo", "waterfalls", "portal"], lineIds: ["line-cataratas"] },
      { id: "hito", name: "Hito Tres Fronteras & Costanera", keywords: ["hito", "tres fronteras", "three borders", "marco", "costanera", "rio iguazu", "rio parana"], lineIds: ["line-hito"] },
      { id: "aeropuerto", name: "Aeropuerto Internacional Cataratas (IGR)", keywords: ["aeropuerto", "airport", "aeroporto", "vuelos", "krause", "avion", "igr"], lineIds: ["line-aeropuerto"] },
      { id: "hoteles600", name: "Selva Yriapú (600 Hectáreas Hoteles)", keywords: ["600", "hectareas", "yriapu", "selva", "loi suites", "mercure", "jungle", "resort", "aldea", "guarani", "mborore"], lineIds: ["line-600"] },
      { id: "aripuca", name: "La Aripuca & Refugio Güirá Oga", keywords: ["aripuca", "guira oga", "refugio de aves", "biocentro", "animales"], lineIds: ["line-cataratas"] },
      { id: "samic", name: "Hospital SAMIC Dra. Marta Schwarz", keywords: ["hospital", "samic", "marta schwarz", "salud", "guardia"], lineIds: ["line-u1"] },
      { id: "b1demayo", name: "Barrio 1° de Mayo / B° Belén / B° Bicentenario", keywords: ["1 de mayo", "belen", "bicentenario", "papa francisco", "epet 4"], lineIds: ["line-u1"] },
      { id: "b2000", name: "Barrio 2000 / Barrio Santa Rosa / Rivera", keywords: ["2000", "dos mil", "santa rosa", "rivera", "kirchner", "escuela 875"], lineIds: ["line-u2"] },
      { id: "dutyfree", name: "Duty Free Shop & Aduana Argentina", keywords: ["duty free", "aduana", "shopping", "frontera", "migraciones", "puente"], lineIds: ["line-internacional-br", "line-internacional-py", "line-cataratas"] },
      { id: "foz", name: "Foz do Iguaçu (Brasil / Terminal TTU)", keywords: ["foz", "brasil", "brazil", "ttu", "terminal foz", "tancredo neves", "catuai"], lineIds: ["line-internacional-br"] },
      { id: "cde", name: "Ciudad del Este (Paraguay / Microcentro & Terminal)", keywords: ["ciudad del este", "cde", "paraguay", "puente de la amistad", "ponte da amizade", "monalisa", "shopping del este"], lineIds: ["line-internacional-py"] }
    ];
  }

  findLocationMatch(queryText) {
    if (!queryText || queryText.trim() === "") return null;
    const clean = queryText.toLowerCase().trim();

    // Coincidencia directa por id
    const exact = this.popularLocations.find(loc => loc.id === clean);
    if (exact) return exact;

    // Coincidencia por nombre o keywords
    for (const loc of this.popularLocations) {
      if (loc.name.toLowerCase().includes(clean)) return loc;
      for (const kw of loc.keywords) {
        if (clean.includes(kw) || kw.includes(clean)) {
          return loc;
        }
      }
    }
    return null;
  }

  planJourney(originText, destinationText) {
    const originLoc = this.findLocationMatch(originText);
    const destLoc = this.findLocationMatch(destinationText);

    if (!originLoc || !destLoc) {
      return {
        success: false,
        message: "No encontramos una coincidencia exacta para los puntos ingresados. Prueba seleccionando un destino popular de la lista."
      };
    }

    if (originLoc.id === destLoc.id) {
      return {
        success: false,
        message: "El punto de partida y el destino son el mismo lugar."
      };
    }

    // Buscar si comparten una línea directa
    const sharedLines = originLoc.lineIds.filter(id => destLoc.lineIds.includes(id));

    if (sharedLines.length > 0) {
      const bestLineId = sharedLines[0];
      const lineData = TRANSPORT_DATA.lines.find(l => l.id === bestLineId);

      // Determinar sentido aproximado
      const isGoingFromTerminal = originLoc.id === "terminal" || originLoc.id === "centro";
      const travelTimes = {
        "line-cataratas": "35-40 min",
        "line-hito": "12-15 min",
        "line-aeropuerto": "25-30 min",
        "line-600": "20-25 min",
        "line-u1": "15-20 min",
        "line-u2": "15-20 min",
        "line-internacional-br": "35-50 min (según trámite aduanero)",
        "line-internacional-py": "50-70 min (incluye paso por Foz y Ponte da Amizade)"
      };

      return {
        success: true,
        isDirect: true,
        line: lineData,
        originName: originLoc.name,
        destName: destLoc.name,
        estimatedTime: travelTimes[bestLineId] || "20-30 min",
        boardingPoint: isGoingFromTerminal ? "Terminal de Ómnibus (o paradas sobre Av. Victoria Aguirre)" : originLoc.name,
        dropoffPoint: destLoc.name,
        frequency: lineData.frequency.weekday,
        priceARS: lineData.price.tourist,
        priceResidentARS: lineData.price.resident
      };
    } else {
      // Viaje con transbordo en la Terminal de Ómnibus
      const firstLegLineId = originLoc.lineIds[0];
      const secondLegLineId = destLoc.lineIds[0];
      const firstLine = TRANSPORT_DATA.lines.find(l => l.id === firstLegLineId);
      const secondLine = TRANSPORT_DATA.lines.find(l => l.id === secondLegLineId);

      return {
        success: true,
        isDirect: false,
        originName: originLoc.name,
        destName: destLoc.name,
        firstLine: firstLine,
        secondLine: secondLine,
        transferPoint: "Terminal de Ómnibus Central de Puerto Iguazú",
        estimatedTime: "45-60 min (incluye transbordo)",
        boardingPoint: originLoc.name,
        dropoffPoint: destLoc.name
      };
    }
  }
}

window.TripPlanner = new TripPlanner();
