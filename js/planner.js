/**
 * Motor de Planificación de Viajes y Ruteo de Transporte Público
 * Transporte Urbano e Internacional de Puerto Iguazú - Empresa Río Uruguay
 */

class TripPlanner {
  constructor() {
    // Destinos populares y puntos de interés de Puerto Iguazú y frontera
    this.popularLocations = [
      {
        id: "terminal",
        name: "Terminal de Ómnibus Central",
        lat: -25.5991,
        lng: -54.5732,
        keywords: ["terminal", "omnibus", "rodoviaria", "centro de trasbordo", "plataforma", "plataforma 7", "boleteria"],
        lineIds: ["line-cataratas", "line-hito", "line-aeropuerto", "line-600", "line-u1", "line-u2", "line-internacional-br", "line-internacional-py"]
      },
      {
        id: "centro",
        name: "Centro / Plaza San Martín",
        lat: -25.5970,
        lng: -54.5735,
        keywords: ["centro", "downtown", "plaza", "san martin", "aguirre", "brasil", "feirinha", "gastronomica"],
        lineIds: ["line-cataratas", "line-hito", "line-aeropuerto", "line-600", "line-u1", "line-u2", "line-internacional-br", "line-internacional-py"]
      },
      {
        id: "cataratas",
        name: "Parque Nacional Iguazú (Cataratas)",
        lat: -25.6705,
        lng: -54.4502,
        keywords: ["cataratas", "falls", "parque nacional", "garganta del diablo", "waterfalls", "portal", "chutes", "iguazu falls"],
        lineIds: ["line-cataratas"]
      },
      {
        id: "hito",
        name: "Hito Tres Fronteras & Costanera",
        lat: -25.5898,
        lng: -54.5935,
        keywords: ["hito", "tres fronteras", "three borders", "marco", "costanera", "rio iguazu", "rio parana", "plaza de las aguas"],
        lineIds: ["line-hito"]
      },
      {
        id: "aeropuerto",
        name: "Aeropuerto Internacional Cataratas (IGR)",
        lat: -25.7380,
        lng: -54.4735,
        keywords: ["aeropuerto", "airport", "aeroporto", "vuelos", "krause", "avion", "igr", "aeroport"],
        lineIds: ["line-aeropuerto"]
      },
      {
        id: "hoteles600",
        name: "Selva Yriapú (600 Hectáreas Hoteles)",
        lat: -25.6185,
        lng: -54.5610,
        keywords: ["600", "hectareas", "yriapu", "selva", "loi suites", "mercure", "jungle", "resort", "aldea", "guarani", "mborore"],
        lineIds: ["line-600"]
      },
      {
        id: "aripuca",
        name: "La Aripuca & Refugio Güirá Oga",
        lat: -25.6190,
        lng: -54.5420,
        keywords: ["aripuca", "guira oga", "refugio de aves", "biocentro", "animales"],
        lineIds: ["line-cataratas"]
      },
      {
        id: "samic",
        name: "Hospital SAMIC Dra. Marta Schwarz",
        lat: -25.6080,
        lng: -54.5780,
        keywords: ["hospital", "samic", "marta schwarz", "salud", "guardia", "emergencias"],
        lineIds: ["line-u1"]
      },
      {
        id: "b1demayo",
        name: "Barrio 1° de Mayo / B° Belén",
        lat: -25.6210,
        lng: -54.5820,
        keywords: ["1 de mayo", "belen", "bicentenario", "papa francisco", "epet 4"],
        lineIds: ["line-u1"]
      },
      {
        id: "b2000",
        name: "Barrio 2000 / Barrio Santa Rosa",
        lat: -25.6090,
        lng: -54.5710,
        keywords: ["2000", "dos mil", "santa rosa", "rivera", "kirchner", "escuela 875"],
        lineIds: ["line-u2"]
      },
      {
        id: "dutyfree",
        name: "Duty Free Shop & Aduana Argentina",
        lat: -25.6085,
        lng: -54.5490,
        keywords: ["duty free", "aduana", "shopping", "frontera", "migraciones", "puente"],
        lineIds: ["line-internacional-br", "line-internacional-py", "line-cataratas"]
      },
      {
        id: "foz",
        name: "Foz do Iguaçu (Brasil / Terminal TTU)",
        lat: -25.5410,
        lng: -54.5860,
        keywords: ["foz", "brasil", "brazil", "bresil", "ttu", "terminal foz", "tancredo neves", "catuai"],
        lineIds: ["line-internacional-br"]
      },
      {
        id: "cde",
        name: "Ciudad del Este (Paraguay / Microcentro & Terminal)",
        lat: -25.5120,
        lng: -54.6130,
        keywords: ["ciudad del este", "cde", "paraguay", "puente de la amistad", "ponte da amizade", "monalisa", "shopping del este"],
        lineIds: ["line-internacional-py"]
      }
    ];

    this._cachedStops = null;
  }

  /**
   * Obtiene todas las paradas únicas del sistema de transporte
   */
  getAllStops() {
    if (this._cachedStops) return this._cachedStops;

    const stopsMap = new Map();
    if (window.TRANSPORT_DATA && window.TRANSPORT_DATA.lines) {
      window.TRANSPORT_DATA.lines.forEach(line => {
        const checkStops = (stopsList, dir) => {
          stopsList.forEach((stop, idx) => {
            const key = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
            if (!stopsMap.has(key)) {
              stopsMap.set(key, {
                id: `stop-${stop.lat.toFixed(4)}-${stop.lng.toFixed(4)}`,
                name: stop.name,
                lat: stop.lat,
                lng: stop.lng,
                isMajor: stop.isMajor || false,
                isTerminal: stop.name.toLowerCase().includes("terminal"),
                lines: [line],
                direction: dir
              });
            } else {
              const existing = stopsMap.get(key);
              if (!existing.lines.some(l => l.id === line.id)) {
                existing.lines.push(line);
              }
            }
          });
        };

        if (line.routeIda) checkStops(line.routeIda, "ida");
        if (line.routeVuelta) checkStops(line.routeVuelta, "vuelta");
      });
    }

    this._cachedStops = Array.from(stopsMap.values());
    return this._cachedStops;
  }

  /**
   * Calcula la distancia ortodrómica (Haversine) en kilómetros entre dos coordenadas
   */
  haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Resuelve una entrada a un punto geográfico (nombre, lat, lng)
   */
  resolveLocation(input) {
    if (!input) return null;

    // Si ya es un objeto con coordenadas
    if (typeof input === "object" && typeof input.lat === "number" && typeof input.lng === "number") {
      return {
        name: input.name || "Ubicación seleccionada",
        lat: input.lat,
        lng: input.lng,
        isGps: !!input.isGps
      };
    }

    if (typeof input !== "string") return null;
    const clean = input.trim().toLowerCase();
    if (clean === "") return null;

    // 1. Verificar si es la ubicación GPS del usuario
    const isUserGpsQuery = [
      "mi ubicación", "mi ubicacion", "mi posicion", "mi posición", "gps",
      "my location", "minha localização", "minha localizacao", "ma position", "current location"
    ].some(term => clean.includes(term));

    if (isUserGpsQuery && window.IguazuMap && window.IguazuMap.userMarker) {
      const userPos = window.IguazuMap.userMarker.getLatLng();
      return {
        name: window.I18n ? window.I18n.getText("map_legend_user") : "Tu Ubicación Actual",
        lat: userPos.lat,
        lng: userPos.lng,
        isGps: true
      };
    }

    // 2. Coincidencia exacta o por id en destinos populares
    const exactPop = this.popularLocations.find(l => l.id === clean);
    if (exactPop) {
      return {
        name: exactPop.name,
        lat: exactPop.lat,
        lng: exactPop.lng,
        id: exactPop.id,
        lineIds: exactPop.lineIds
      };
    }

    // 3. Coincidencia por palabra clave o nombre en destinos populares
    for (const loc of this.popularLocations) {
      if (loc.name.toLowerCase().includes(clean)) {
        return {
          name: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          id: loc.id,
          lineIds: loc.lineIds
        };
      }
      for (const kw of loc.keywords) {
        if (clean.includes(kw) || kw.includes(clean)) {
          return {
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            id: loc.id,
            lineIds: loc.lineIds
          };
        }
      }
    }

    // 4. Coincidencia en paradas autorizadas
    const allStops = this.getAllStops();
    for (const stop of allStops) {
      if (stop.name.toLowerCase().includes(clean)) {
        return {
          name: stop.name,
          lat: stop.lat,
          lng: stop.lng,
          isStop: true,
          stopData: stop
        };
      }
    }

    return null;
  }

  /**
   * Encuentra la mejor parada de una línea para una coordenada dada
   */
  findBestStopOnRoute(coord, routeStops) {
    let bestStop = null;
    let bestIndex = -1;
    let minDistance = Infinity;

    routeStops.forEach((stop, idx) => {
      const dist = this.haversineKm(coord.lat, coord.lng, stop.lat, stop.lng);
      if (dist < minDistance) {
        minDistance = dist;
        bestStop = stop;
        bestIndex = idx;
      }
    });

    return { stop: bestStop, index: bestIndex, distanceKm: minDistance };
  }

  /**
   * Planifica un viaje de transporte público entre dos puntos
   */
  planJourney(originInput, destInput) {
    const origin = this.resolveLocation(originInput);
    const dest = this.resolveLocation(destInput);

    if (!origin || !dest) {
      return {
        success: false,
        messageKey: "planner_no_match",
        message: "No encontramos una coincidencia exacta para los puntos ingresados. Prueba seleccionando un destino de la lista."
      };
    }

    // Verificar si origen y destino son prácticamente el mismo punto
    const directDistanceKm = this.haversineKm(origin.lat, origin.lng, dest.lat, dest.lng);
    if (directDistanceKm < 0.08) {
      return {
        success: false,
        messageKey: "map_same_location",
        message: "El punto de partida y el destino son el mismo lugar."
      };
    }

    // Si la distancia es muy corta (< 350 metros), se puede hacer a pie directamente
    if (directDistanceKm <= 0.35) {
      const walkMins = Math.max(2, Math.round(directDistanceKm * 13));
      return {
        success: true,
        isWalkingOnly: true,
        origin: origin,
        dest: dest,
        totalDistanceKm: directDistanceKm,
        totalDurationMin: walkMins,
        estimatedTime: `${walkMins} min`,
        walkLeg: {
          from: origin.name,
          to: dest.name,
          distanceKm: directDistanceKm,
          durationMin: walkMins
        }
      };
    }

    const lines = window.TRANSPORT_DATA ? window.TRANSPORT_DATA.lines : [];
    let bestDirectOption = null;
    let minDirectCost = Infinity;

    // 1. Evaluar todas las líneas directas en sentido ida y vuelta
    lines.forEach(line => {
      // Evaluar sentido IDA
      if (line.routeIda && line.routeIda.length > 0) {
        const boardInfo = this.findBestStopOnRoute(origin, line.routeIda);
        const dropInfo = this.findBestStopOnRoute(dest, line.routeIda);

        // Para ser una ruta directa válida en ida, la parada de subida debe estar antes de la de bajada
        if (boardInfo.index < dropInfo.index) {
          const transitStops = line.routeIda.slice(boardInfo.index, dropInfo.index + 1);
          let transitDistKm = 0;
          for (let i = 0; i < transitStops.length - 1; i++) {
            transitDistKm += this.haversineKm(transitStops[i].lat, transitStops[i].lng, transitStops[i + 1].lat, transitStops[i + 1].lng);
          }

          // Costo heurístico ponderando la caminata
          const walkStartKm = boardInfo.distanceKm;
          const walkEndKm = dropInfo.distanceKm;
          const totalCost = (walkStartKm * 2.0) + transitDistKm + (walkEndKm * 2.0);

          if (totalCost < minDirectCost) {
            minDirectCost = totalCost;
            bestDirectOption = {
              line: line,
              direction: "ida",
              boardingStop: boardInfo.stop,
              boardingIndex: boardInfo.index,
              dropoffStop: dropInfo.stop,
              dropoffIndex: dropInfo.index,
              transitStops: transitStops,
              walkStartKm: walkStartKm,
              walkEndKm: walkEndKm,
              transitDistKm: transitDistKm,
              totalDistKm: walkStartKm + transitDistKm + walkEndKm
            };
          }
        }
      }

      // Evaluar sentido VUELTA
      if (line.routeVuelta && line.routeVuelta.length > 0) {
        const boardInfo = this.findBestStopOnRoute(origin, line.routeVuelta);
        const dropInfo = this.findBestStopOnRoute(dest, line.routeVuelta);

        if (boardInfo.index < dropInfo.index) {
          const transitStops = line.routeVuelta.slice(boardInfo.index, dropInfo.index + 1);
          let transitDistKm = 0;
          for (let i = 0; i < transitStops.length - 1; i++) {
            transitDistKm += this.haversineKm(transitStops[i].lat, transitStops[i].lng, transitStops[i + 1].lat, transitStops[i + 1].lng);
          }

          const walkStartKm = boardInfo.distanceKm;
          const walkEndKm = dropInfo.distanceKm;
          const totalCost = (walkStartKm * 2.0) + transitDistKm + (walkEndKm * 2.0);

          if (totalCost < minDirectCost) {
            minDirectCost = totalCost;
            bestDirectOption = {
              line: line,
              direction: "vuelta",
              boardingStop: boardInfo.stop,
              boardingIndex: boardInfo.index,
              dropoffStop: dropInfo.stop,
              dropoffIndex: dropInfo.index,
              transitStops: transitStops,
              walkStartKm: walkStartKm,
              walkEndKm: walkEndKm,
              transitDistKm: transitDistKm,
              totalDistKm: walkStartKm + transitDistKm + walkEndKm
            };
          }
        }
      }
    });

    // 2. Si se encontró una opción directa razonable
    if (bestDirectOption && bestDirectOption.walkStartKm < 2.5 && bestDirectOption.walkEndKm < 2.5) {
      const opt = bestDirectOption;
      const walkStartMins = Math.round(opt.walkStartKm * 13);
      const walkEndMins = Math.round(opt.walkEndKm * 13);
      const stopCount = opt.transitStops.length - 1;

      // Estimación de tiempo en colectivo basada en paradas y distancia
      const transitMins = Math.max(5, Math.round((opt.transitDistKm * 2.2) + (stopCount * 1.5)));
      const totalMins = walkStartMins + transitMins + walkEndMins;

      const isInternational = opt.line.type === "international" || opt.line.type === "internacionales";

      return {
        success: true,
        isDirect: true,
        isInternational: isInternational,
        origin: origin,
        dest: dest,
        line: opt.line,
        direction: opt.direction,
        boardingStop: opt.boardingStop,
        dropoffStop: opt.dropoffStop,
        transitStops: opt.transitStops,
        stopCount: stopCount,
        walkStart: {
          distanceKm: opt.walkStartKm,
          durationMin: walkStartMins,
          from: origin.name,
          to: opt.boardingStop.name,
          fromCoord: [origin.lat, origin.lng],
          toCoord: [opt.boardingStop.lat, opt.boardingStop.lng]
        },
        transit: {
          distanceKm: opt.transitDistKm,
          durationMin: transitMins,
          line: opt.line,
          stopCount: stopCount,
          stops: opt.transitStops
        },
        walkEnd: {
          distanceKm: opt.walkEndKm,
          durationMin: walkEndMins,
          from: opt.dropoffStop.name,
          to: dest.name,
          fromCoord: [opt.dropoffStop.lat, opt.dropoffStop.lng],
          toCoord: [dest.lat, dest.lng]
        },
        totalDistanceKm: opt.totalDistKm,
        totalDurationMin: totalMins,
        estimatedTime: `~${totalMins} min (estimado a pie/ruta)`,
        priceARS: null,
        priceResidentARS: null,
        frequency: null,
        firstBus: null,
        lastBus: null
      };
    }

    // 3. Si no hay línea directa, planificar con Transbordo en la Terminal Central
    const terminalCoord = { lat: -25.5991, lng: -54.5732, name: "Terminal de Ómnibus Central de Puerto Iguazú" };

    // Buscar primera etapa: de Origen a Terminal
    let leg1Opt = null;
    let minLeg1Cost = Infinity;

    lines.forEach(line => {
      const routesToCheck = [
        { route: line.routeIda, dir: "ida" },
        { route: line.routeVuelta, dir: "vuelta" }
      ];

      routesToCheck.forEach(r => {
        if (!r.route || r.route.length === 0) return;
        const bInfo = this.findBestStopOnRoute(origin, r.route);
        const dInfo = this.findBestStopOnRoute(terminalCoord, r.route);

        if (bInfo.index < dInfo.index) {
          const tStops = r.route.slice(bInfo.index, dInfo.index + 1);
          let dist = 0;
          for (let i = 0; i < tStops.length - 1; i++) {
            dist += this.haversineKm(tStops[i].lat, tStops[i].lng, tStops[i + 1].lat, tStops[i + 1].lng);
          }
          const cost = (bInfo.distanceKm * 2) + dist + (dInfo.distanceKm * 2);
          if (cost < minLeg1Cost) {
            minLeg1Cost = cost;
            leg1Opt = {
              line: line,
              direction: r.dir,
              boardingStop: bInfo.stop,
              dropoffStop: dInfo.stop,
              transitStops: tStops,
              walkStartKm: bInfo.distanceKm,
              transitDistKm: dist
            };
          }
        }
      });
    });

    // Buscar segunda etapa: de Terminal a Destino
    let leg2Opt = null;
    let minLeg2Cost = Infinity;

    lines.forEach(line => {
      const routesToCheck = [
        { route: line.routeIda, dir: "ida" },
        { route: line.routeVuelta, dir: "vuelta" }
      ];

      routesToCheck.forEach(r => {
        if (!r.route || r.route.length === 0) return;
        const bInfo = this.findBestStopOnRoute(terminalCoord, r.route);
        const dInfo = this.findBestStopOnRoute(dest, r.route);

        if (bInfo.index < dInfo.index) {
          const tStops = r.route.slice(bInfo.index, dInfo.index + 1);
          let dist = 0;
          for (let i = 0; i < tStops.length - 1; i++) {
            dist += this.haversineKm(tStops[i].lat, tStops[i].lng, tStops[i + 1].lat, tStops[i + 1].lng);
          }
          const cost = (bInfo.distanceKm * 2) + dist + (dInfo.distanceKm * 2);
          if (cost < minLeg2Cost) {
            minLeg2Cost = cost;
            leg2Opt = {
              line: line,
              direction: r.dir,
              boardingStop: bInfo.stop,
              dropoffStop: dInfo.stop,
              transitStops: tStops,
              walkEndKm: dInfo.distanceKm,
              transitDistKm: dist
            };
          }
        }
      });
    });

    if (leg1Opt && leg2Opt) {
      const leg1WalkMins = Math.round(leg1Opt.walkStartKm * 13);
      const leg1TransitMins = Math.max(5, Math.round((leg1Opt.transitDistKm * 2.2) + ((leg1Opt.transitStops.length - 1) * 1.5)));
      const transferWaitMins = 10; // Tiempo estimado de espera en Terminal
      const leg2TransitMins = Math.max(5, Math.round((leg2Opt.transitDistKm * 2.2) + ((leg2Opt.transitStops.length - 1) * 1.5)));
      const leg2WalkMins = Math.round(leg2Opt.walkEndKm * 13);

      const totalMins = leg1WalkMins + leg1TransitMins + transferWaitMins + leg2TransitMins + leg2WalkMins;
      const totalDistKm = leg1Opt.walkStartKm + leg1Opt.transitDistKm + leg2Opt.transitDistKm + leg2Opt.walkEndKm;

      return {
        success: true,
        isDirect: false,
        origin: origin,
        dest: dest,
        transferPoint: "Terminal de Ómnibus Central de Puerto Iguazú",
        transferCoord: terminalCoord,
        firstLeg: {
          line: leg1Opt.line,
          direction: leg1Opt.direction,
          boardingStop: leg1Opt.boardingStop,
          dropoffStop: leg1Opt.dropoffStop,
          transitStops: leg1Opt.transitStops,
          stopCount: leg1Opt.transitStops.length - 1,
          distanceKm: leg1Opt.transitDistKm,
          durationMin: leg1TransitMins,
          walkStart: {
            distanceKm: leg1Opt.walkStartKm,
            durationMin: leg1WalkMins,
            from: origin.name,
            to: leg1Opt.boardingStop.name,
            fromCoord: [origin.lat, origin.lng],
            toCoord: [leg1Opt.boardingStop.lat, leg1Opt.boardingStop.lng]
          }
        },
        secondLeg: {
          line: leg2Opt.line,
          direction: leg2Opt.direction,
          boardingStop: leg2Opt.boardingStop,
          dropoffStop: leg2Opt.dropoffStop,
          transitStops: leg2Opt.transitStops,
          stopCount: leg2Opt.transitStops.length - 1,
          distanceKm: leg2Opt.transitDistKm,
          durationMin: leg2TransitMins,
          walkEnd: {
            distanceKm: leg2Opt.walkEndKm,
            durationMin: leg2WalkMins,
            from: leg2Opt.dropoffStop.name,
            to: dest.name,
            fromCoord: [leg2Opt.dropoffStop.lat, leg2Opt.dropoffStop.lng],
            toCoord: [dest.lat, dest.lng]
          }
        },
        totalDistanceKm: totalDistKm,
        totalDurationMin: totalMins,
        estimatedTime: `~${totalMins} min (estimado a pie/ruta)`,
        priceARS: null
      };
    }

    return {
      success: false,
      messageKey: "map_error_no_route",
      message: "No encontramos una ruta de colectivo directa para los puntos seleccionados. Te recomendamos consultar las líneas en el mapa."
    };
  }
}

// Instancia global
window.TripPlanner = new TripPlanner();
