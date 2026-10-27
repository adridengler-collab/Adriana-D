/**
 * Base de Datos Integral del Transporte Urbano de Puerto Iguazú - Empresa Río Uruguay
 *
 * NOTA DE GESTIÓN DE DATOS:
 * - Recorridos, paradas, coordenadas y líneas están confirmados según la red existente.
 * - Tarifas, frecuencias, horarios fijos y medios de pago están en estado PENDIENTE DE CONFIRMACIÓN OFICIAL
 *   hasta realizar la entrevista presencial en la sucursal de Río Uruguay Iguazú.
 * - La fecha de actualización se centraliza en TRANSPORT_DATA.meta.lastUpdated.
 */

const TRANSPORT_DATA = {
  // Metadatos y control de actualización centralizada
  meta: {
    // Si es null, el sistema mostrará automáticamente "Datos oficiales: pendientes de confirmación".
    // Cuando obtengas los datos oficiales tras la entrevista, asignar la fecha (ej: "septiembre de 2026"),
    // y el sistema mostrará automáticamente "Última actualización de datos: septiembre de 2026".
    lastUpdated: null,
    status: "pending_confirmation",
    pendingStatusText: {
      es: "Datos oficiales: pendientes de confirmación",
      en: "Official data: pending confirmation",
      pt: "Dados oficiais: pendentes de confirmação",
      fr: "Données officielles : en attente de confirmation"
    },
    lastUpdatedPrefix: {
      es: "Última actualización de datos:",
      en: "Data last updated:",
      pt: "Última atualização de dados:",
      fr: "Dernière mise à jour des données :"
    },
    noticePendingOfficial: {
      es: "Información de tarifas y horarios pendiente de confirmación oficial.",
      en: "Fares and timetables information pending official confirmation.",
      pt: "Informações de tarifas e horários pendentes de confirmação oficial.",
      fr: "Informations sur les tarifs et horaires en attente de confirmation officielle."
    }
  },

  company: {
    name: "Río Uruguay - Transporte Urbano Iguazú",
    shortName: "Río Uruguay",
    phone: "+54 3757 420045",
    whatsapp: "+54 9 3757 54-8921",
    email: "consultas@riouruguaybus.com.ar",
    address: "Terminal de Ómnibus, Av. Córdoba y Av. Misiones, Local 4, Puerto Iguazú",
    operationalStatus: "NORMAL", // NORMAL | DELAY | DETOUR
    statusMessage: {
      es: "Servicios urbanos y turísticos en circulación. Tarifas y horarios en proceso de actualización oficial.",
      en: "Urban and tourist bus services operating. Fares and timetables under official update.",
      pt: "Serviços urbanos e turísticos em operação. Tarifas e horários em processo de atualização oficial.",
      fr: "Services urbains et touristiques en circulation. Tarifs et horaires en cours de mise à jour officielle."
    }
  },

  // Centros geográficos de referencia para el mapa
  mapConfig: {
    center: [-25.6030, -54.5680],
    zoom: 13,
    minZoom: 11,
    maxZoom: 18
  },

  // Categorías de Filtro
  categories: [
    { id: "all", labelKey: "cat_all", icon: "bi-grid-fill" },
    { id: "tourist", labelKey: "cat_tourist", icon: "bi-camera-fill" },
    { id: "international", labelKey: "cat_international", icon: "bi-globe-americas" }
  ],

  // Destinos turísticos clave para búsqueda rápida (Coordenadas y paradas reales)
  touristSpots: [
    { id: "cataratas", name: "Cataratas Argentinas (Parque Nacional)", lineId: "line-cataratas", icon: "water", lat: -25.6705, lng: -54.4502 },
    { id: "hito", name: "Hito Tres Fronteras & Costanera", lineId: "line-hito", icon: "compass", lat: -25.5898, lng: -54.5935 },
    { id: "aeropuerto", name: "Aeropuerto Int. Cataratas (IGR)", lineId: "line-aeropuerto", icon: "airplane", lat: -25.7380, lng: -54.4735 },
    { id: "hoteles600", name: "Selva Yriapú (600 Hectáreas Hoteles)", lineId: "line-600", icon: "tree", lat: -25.6185, lng: -54.5610 },
    { id: "aripuca", name: "La Aripuca & Güirá Oga", lineId: "line-cataratas", icon: "binoculars", lat: -25.6190, lng: -54.5420 },
    { id: "dutyfree", name: "Duty Free Shop / Aduana Argentina", lineId: "line-internacional-br", icon: "bag", lat: -25.6085, lng: -54.5490 },
    { id: "foz", name: "Foz do Iguaçu (Brasil / TTU)", lineId: "line-internacional-br", icon: "globe", lat: -25.5410, lng: -54.5860 },
    { id: "cde", name: "Ciudad del Este (Paraguay / CDE)", lineId: "line-internacional-py", icon: "shop", lat: -25.5120, lng: -54.6130 }
  ],

  // Líneas de Colectivos (Recorridos y paradas reales preservados; tarifas/horarios/frecuencias pendientes)
  lines: [
    {
      id: "line-cataratas",
      number: "L-CAT",
      name: "Línea Cataratas (Parque Nacional)",
      badgeColor: "#059669", // Emerald Green
      type: "tourist",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Servicio directo al Parque Nacional Iguazú (Portal de acceso a Cataratas) pasando por atractivos sobre RN 12.",
        en: "Direct service to Iguazú National Park (Falls entrance) stopping at RN 12 attractions.",
        pt: "Serviço direto ao Parque Nacional do Iguaçu (entrada das Cataratas) passando por atrações na RN 12.",
        fr: "Service direct vers le Parc National d'Iguazú (Entrée des Chutes) avec arrêts sur la RN 12."
      },
      routeIda: [
        { name: "Terminal de Ómnibus (Plataforma 7)", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. Victoria Aguirre y Av. Brasil (Zona Gastronómica)", lat: -25.5977, lng: -54.5746, isMajor: true },
        { name: "Av. Victoria Aguirre y Av. Córdoba (Centro)", lat: -25.6006, lng: -54.5714, isMajor: true },
        { name: "Rotonda Acceso / Hotel Casino Iguazú", lat: -25.6075, lng: -54.5582, isMajor: true },
        { name: "RN 12 - Complejo La Aripuca", lat: -25.6190, lng: -54.5420, isMajor: true },
        { name: "RN 12 - Refugio de Aves Güirá Oga", lat: -25.6235, lng: -54.5360, isMajor: true },
        { name: "RN 12 - Hotel Gran Meliá / Acceso", lat: -25.6450, lng: -54.4980, isMajor: false },
        { name: "Parque Nacional Iguazú (Portal Cataratas)", lat: -25.6705, lng: -54.4502, isMajor: true }
      ],
      routeVuelta: [
        { name: "Parque Nacional Iguazú (Portal Cataratas)", lat: -25.6705, lng: -54.4502, isMajor: true },
        { name: "RN 12 - Refugio Güirá Oga", lat: -25.6235, lng: -54.5360, isMajor: true },
        { name: "RN 12 - La Aripuca", lat: -25.6190, lng: -54.5420, isMajor: true },
        { name: "Hotel Casino / Rotonda RN12", lat: -25.6075, lng: -54.5582, isMajor: true },
        { name: "Av. Victoria Aguirre y Av. Misiones", lat: -25.5998, lng: -54.5725, isMajor: true },
        { name: "Terminal de Ómnibus Puerto Iguazú", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-hito",
      number: "L-HITO",
      name: "Línea Hito Tres Fronteras & Costanera",
      badgeColor: "#0284c7", // Sky Blue
      type: "tourist",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Conecta la Terminal con la zona céntrica, la bella Costanera Eduardo Arrabal y el mirador del Hito Tres Fronteras.",
        en: "Connects the Bus Station with Downtown, the Eduardo Arrabal Waterfront, and the Three Borders Landmark.",
        pt: "Conecta a Rodoviária com o Centro, a Orla Eduardo Arrabal e o Marco das Três Fronteiras.",
        fr: "Relie la Gare Routière au Centre-ville, à la promenade Eduardo Arrabal et au point de vue de la Borne des 3 Frontières."
      },
      routeIda: [
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Plaza San Martín (Centro)", lat: -25.5970, lng: -54.5735, isMajor: true },
        { name: "Av. Tres Fronteras y San Martín", lat: -25.5960, lng: -54.5775, isMajor: false },
        { name: "Mirador Costanera Eduardo Arrabal", lat: -25.5940, lng: -54.5840, isMajor: true },
        { name: "Puerto Local / Paseos Náuticos", lat: -25.5925, lng: -54.5870, isMajor: true },
        { name: "Hito Tres Fronteras (Plaza de las Aguas)", lat: -25.5898, lng: -54.5935, isMajor: true }
      ],
      routeVuelta: [
        { name: "Hito Tres Fronteras", lat: -25.5898, lng: -54.5935, isMajor: true },
        { name: "Av. Río Iguazú / Costanera", lat: -25.5930, lng: -54.5850, isMajor: true },
        { name: "Av. Tres Fronteras y Perito Moreno", lat: -25.5965, lng: -54.5765, isMajor: false },
        { name: "Av. Córdoba y Centro Comercial", lat: -25.5995, lng: -54.5720, isMajor: true },
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-aeropuerto",
      number: "L-AEROPUERTO",
      name: "Línea Aeropuerto Internacional (IGR)",
      badgeColor: "#d97706", // Amber
      type: "tourist",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Enlace entre el Centro / Terminal de Ómnibus y el Aeropuerto Mayor Carlos Krause (IGR).",
        en: "Transit between Bus Terminal / Downtown and Cataratas Int. Airport (IGR).",
        pt: "Transporte entre o Centro / Rodoviária e o Aeroporto Internacional (IGR).",
        fr: "Liaison entre le Centre / Gare Routière et l'Aéroport International Carlos Krause (IGR)."
      },
      routeIda: [
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. Victoria Aguirre / ACA", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Rotonda Acceso RN 12", lat: -25.6075, lng: -54.5582, isMajor: true },
        { name: "RN 12 - Zona Hotelera / Yriapú", lat: -25.6150, lng: -54.5490, isMajor: false },
        { name: "RN 12 - Desvío Acceso Aeropuerto", lat: -25.6560, lng: -54.4820, isMajor: true },
        { name: "Aeropuerto Int. Cataratas del Iguazú (IGR)", lat: -25.7380, lng: -54.4735, isMajor: true }
      ],
      routeVuelta: [
        { name: "Aeropuerto Int. Cataratas (IGR)", lat: -25.7380, lng: -54.4735, isMajor: true },
        { name: "RN 12 - Acceso Parque Nacional", lat: -25.6560, lng: -54.4820, isMajor: true },
        { name: "RN 12 - Rotonda Casino", lat: -25.6075, lng: -54.5582, isMajor: true },
        { name: "Av. Victoria Aguirre", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-600",
      number: "L-600",
      name: "Línea 600 Hectáreas (Selva Yriapú)",
      badgeColor: "#16a34a", // Forest Green
      type: "tourist",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Acceso a la reserva Selva Yriapú, principales eco-lodges, resorts y a las comunidades Guaraníes (Fortín M'Bororé).",
        en: "Access to Yriapú Rainforest Reserve, eco-lodges, resorts, and Guaraní Indigenous communities.",
        pt: "Acesso à reserva Selva Yriapú, eco-lodges, resorts e comunidades indígenas Guaranis.",
        fr: "Accès à la réserve Forêt Yriapú, aux éco-lodges, resorts et communautés autochtones Guaranis."
      },
      routeIda: [
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. Victoria Aguirre", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Rotonda RN 12", lat: -25.6075, lng: -54.5582, isMajor: true },
        { name: "Portal Entrada 600 Hectáreas", lat: -25.6110, lng: -54.5530, isMajor: true },
        { name: "Camino Selva Yriapú - Hoteles Loi Suites / Mercure", lat: -25.6185, lng: -54.5610, isMajor: true },
        { name: "Resort Iguazu Grand / Jungle Lodge", lat: -25.6240, lng: -54.5695, isMajor: true },
        { name: "Comunidad Aldea Fortín M'Bororé", lat: -25.6280, lng: -54.5740, isMajor: true }
      ],
      routeVuelta: [
        { name: "Comunidad Aldea Fortín M'Bororé", lat: -25.6280, lng: -54.5740, isMajor: true },
        { name: "Circuito Hoteles 600 Hectáreas", lat: -25.6185, lng: -54.5610, isMajor: true },
        { name: "Portal Acceso RN 12", lat: -25.6110, lng: -54.5530, isMajor: true },
        { name: "Av. Victoria Aguirre", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-u1",
      number: "Línea 1",
      name: "Urbano 1: Terminal - B° 1° de Mayo - Belén - SAMIC",
      badgeColor: "#7c3aed", // Purple
      type: "urban",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Conecta la Terminal con el Hospital SAMIC, colegios, Barrio 1° de Mayo, B° Belén y B° Bicentenario.",
        en: "Connects Bus Station with SAMIC Public Hospital, schools, and residential neighborhoods.",
        pt: "Liga a Rodoviária ao Hospital SAMIC, escolas e bairros residenciais 1° de Mayo e Belén.",
        fr: "Relie la Gare Routière à l'Hôpital SAMIC, aux écoles et aux quartiers résidentiels 1° de Mayo et Belén."
      },
      routeIda: [
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. República Argentina y Brasil", lat: -25.6040, lng: -54.5760, isMajor: false },
        { name: "Hospital SAMIC Dra. Marta Schwarz", lat: -25.6080, lng: -54.5780, isMajor: true },
        { name: "Av. Papa Francisco (Acceso B° 1° de Mayo)", lat: -25.6140, lng: -54.5795, isMajor: true },
        { name: "Plaza Barrio Belén", lat: -25.6210, lng: -54.5820, isMajor: true },
        { name: "Escuela EPET N° 4 (Barrio Bicentenario)", lat: -25.6270, lng: -54.5850, isMajor: true }
      ],
      routeVuelta: [
        { name: "Escuela EPET N° 4 (B° Bicentenario)", lat: -25.6270, lng: -54.5850, isMajor: true },
        { name: "Barrio Belén / CAPS Salud", lat: -25.6210, lng: -54.5820, isMajor: true },
        { name: "Av. Papa Francisco", lat: -25.6140, lng: -54.5795, isMajor: true },
        { name: "Hospital SAMIC", lat: -25.6080, lng: -54.5780, isMajor: true },
        { name: "Av. Córdoba y Centro", lat: -25.6006, lng: -54.5714, isMajor: true },
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-u2",
      number: "Línea 2",
      name: "Urbano 2: Terminal - B° 2000 - Santa Rosa - Rivera",
      badgeColor: "#ea580c", // Orange
      type: "urban",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Servicio urbano transversal hacia Barrio 2000, Barrio Santa Rosa, zona Rivera del Paraná y complejo educativo.",
        en: "Urban loop serving Barrio 2000, Santa Rosa, Paraná River area, and educational zone.",
        pt: "Serviço urbano transversal aos bairros 2000, Santa Rosa e orla do Rio Paraná.",
        fr: "Ligne urbaine transversale desservant les quartiers 2000, Santa Rosa, les rives du Paraná et la zone éducative."
      },
      routeIda: [
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. Misiones y San Martín", lat: -25.5980, lng: -54.5700, isMajor: false },
        { name: "Av. Néstor Kirchner (B° 2000)", lat: -25.6090, lng: -54.5710, isMajor: true },
        { name: "Plaza Barrio Santa Rosa", lat: -25.6170, lng: -54.5680, isMajor: true },
        { name: "Escuela N° 875 (B° Rivera)", lat: -25.6240, lng: -54.5650, isMajor: true }
      ],
      routeVuelta: [
        { name: "Escuela N° 875 (B° Rivera)", lat: -25.6240, lng: -54.5650, isMajor: true },
        { name: "Plaza Barrio Santa Rosa", lat: -25.6170, lng: -54.5680, isMajor: true },
        { name: "Av. Néstor Kirchner", lat: -25.6090, lng: -54.5710, isMajor: true },
        { name: "Av. Victoria Aguirre y Centro", lat: -25.6006, lng: -54.5714, isMajor: true },
        { name: "Terminal de Ómnibus", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-internacional-br",
      number: "L-INT BR",
      name: "Internacional: Puerto Iguazú ⇆ Foz do Iguaçu (Brasil 🇧🇷)",
      badgeColor: "#2563eb", // Royal Blue
      type: "international",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Cruce internacional por el Puente Tancredo Neves. Pasa por Aduana Argentina, Duty Free Shop, Aduana Brasileña y llega a la Terminal TTU de Foz do Iguaçu.",
        en: "International bus crossing Tancredo Neves Bridge via Argentina Customs, Duty Free Shop, Brazil Customs to TTU Urban Terminal in Foz do Iguaçu.",
        pt: "Linha internacional cruzando a Ponte Tancredo Neves pela Aduana Argentina, Duty Free e Aduana Brasileira até o Terminal TTU em Foz do Iguaçu.",
        fr: "Ligne internationale traversant le Pont Tancredo Neves via les douanes d'Argentine et du Brésil jusqu'au Terminal TTU à Foz do Iguaçu."
      },
      routeIda: [
        { name: "Terminal de Ómnibus Puerto Iguazú (Plat. Internacional)", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Av. Victoria Aguirre / ACA", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Aduana Argentina / Control Migratorio", lat: -25.6080, lng: -54.5520, isMajor: true },
        { name: "Duty Free Shop Puerto Iguazú", lat: -25.6085, lng: -54.5490, isMajor: true },
        { name: "Puente Internacional Tancredo Neves", lat: -25.5940, lng: -54.5380, isMajor: true },
        { name: "Aduana Brasileña (Receita Federal)", lat: -25.5780, lng: -54.5350, isMajor: true },
        { name: "Av. das Cataratas / Shopping Catuaí Palladium", lat: -25.5680, lng: -54.5550, isMajor: true },
        { name: "Terminal Urbano TTU - Foz do Iguaçu (Brasil)", lat: -25.5410, lng: -54.5860, isMajor: true }
      ],
      routeVuelta: [
        { name: "Terminal TTU - Foz do Iguaçu (Brasil)", lat: -25.5410, lng: -54.5860, isMajor: true },
        { name: "Av. das Cataratas / Foz do Iguaçu", lat: -25.5680, lng: -54.5550, isMajor: true },
        { name: "Aduana Brasileña (Saída Brasil)", lat: -25.5780, lng: -54.5350, isMajor: true },
        { name: "Puente Tancredo Neves", lat: -25.5940, lng: -54.5380, isMajor: true },
        { name: "Aduana Argentina (Ingreso)", lat: -25.6080, lng: -54.5520, isMajor: true },
        { name: "Av. Victoria Aguirre", lat: -25.6025, lng: -54.5665, isMajor: true },
        { name: "Terminal Puerto Iguazú", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    },

    {
      id: "line-internacional-py",
      number: "L-INT PY",
      name: "Internacional: Puerto Iguazú ⇆ Ciudad del Este (Paraguay 🇵🇾)",
      badgeColor: "#0284c7", // Sky Blue
      type: "international",
      frequency: null,
      firstBus: null,
      lastBus: null,
      price: null,
      description: {
        es: "Servicio internacional a Paraguay cruzando por Foz do Iguaçu (Brasil) y el Puente de la Amistad hasta Ciudad del Este.",
        en: "International service to Paraguay crossing through Foz do Iguaçu (Brazil) and Friendship Bridge to Ciudad del Este.",
        pt: "Serviço internacional ao Paraguai passando por Foz do Iguaçu e Ponte da Amizade até Ciudad del Este.",
        fr: "Service international vers le Paraguay via Foz do Iguaçu et le Pont de l'Amitié jusqu'à Ciudad del Este."
      },
      routeIda: [
        { name: "Terminal de Ómnibus Puerto Iguazú (Plat. Internacional)", lat: -25.5991, lng: -54.5732, isMajor: true },
        { name: "Aduana Argentina (Paso Tancredo Neves)", lat: -25.6080, lng: -54.5520, isMajor: true },
        { name: "Puente Internacional Tancredo Neves", lat: -25.5940, lng: -54.5380, isMajor: true },
        { name: "Aduana Brasileña / Tránsito Foz do Iguaçu", lat: -25.5780, lng: -54.5350, isMajor: true },
        { name: "Foz do Iguaçu - Conexión Av. JK / Ponte da Amizade", lat: -25.5350, lng: -54.5810, isMajor: true },
        { name: "Puente Internacional de la Amistad (Ponte da Amizade)", lat: -25.5125, lng: -54.5930, isMajor: true },
        { name: "Aduana Paraguaya / Migraciones CDE", lat: -25.5100, lng: -54.6070, isMajor: true },
        { name: "Microcentro Ciudad del Este / Shopping del Este", lat: -25.5120, lng: -54.6130, isMajor: true },
        { name: "Terminal de Ómnibus de Ciudad del Este (Paraguay)", lat: -25.5240, lng: -54.6310, isMajor: true }
      ],
      routeVuelta: [
        { name: "Terminal de Ómnibus de Ciudad del Este (Paraguay)", lat: -25.5240, lng: -54.6310, isMajor: true },
        { name: "Microcentro Ciudad del Este (Av. Monseñor Rodríguez)", lat: -25.5120, lng: -54.6130, isMajor: true },
        { name: "Aduana Paraguaya (Salida)", lat: -25.5100, lng: -54.6070, isMajor: true },
        { name: "Puente Internacional de la Amistad", lat: -25.5125, lng: -54.5930, isMajor: true },
        { name: "Foz do Iguaçu (Tránsito Internacional)", lat: -25.5350, lng: -54.5810, isMajor: true },
        { name: "Puente Tancredo Neves", lat: -25.5940, lng: -54.5380, isMajor: true },
        { name: "Aduana Argentina (Control Ingreso)", lat: -25.6080, lng: -54.5520, isMajor: true },
        { name: "Terminal Puerto Iguazú", lat: -25.5991, lng: -54.5732, isMajor: true }
      ],
      schedule: {
        ida: [],
        vuelta: []
      }
    }
  ],

  // Estructura de Tarifas (Precios sin inventar; marcados como pendientes de confirmación oficial)
  // Estructura de Tarifas (Precios sin inventar; marcados como pendientes de confirmación oficial)
  fares: [
    {
      categoryKey: "fare_cataratas",
      priceARS: 10000, // pendiente de confirmación oficial
      residentPriceARS: 4000, // pendiente de confirmación oficial (requiere DNI)
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_cataratas_desc",
      validFor: ["L-CAT"]
    },
    {
      categoryKey: "fare_airport",
      priceARS: 8000, // pendiente de confirmación oficial
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_airport_desc",
      validFor: ["L-AEROPUERTO"]
    },
    {
      categoryKey: "fare_international",
      priceARS: 12000, // pendiente de confirmación oficial
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_international_desc",
      validFor: ["L-INT BR"]
    },
    {
      categoryKey: "fare_international_py",
      priceARS: 10000, // pendiente de confirmación oficial
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_international_py_desc",
      validFor: ["L-INT PY"]
    },
    {
      categoryKey: "fare_urban_general",
      priceARS: 2800, // pendiente de confirmación oficial
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_urban_general_desc",
      validFor: ["Línea 1", "Línea 2", "L-HITO (Residente)", "L-600 (Residente)"]
    },
    {
      categoryKey: "fare_urban_card",
      priceARS: 2200, // pendiente de confirmación oficial
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_urban_general_desc",
      validFor: ["Línea 1", "Línea 2", "L-HITO (Residente)", "L-600 (Residente)"]
    },
    {
      categoryKey: "fare_student_beeg",
      priceARS: null,
      priceBRL: null,
      priceUSD: null,
      descriptionKey: "fare_student_beeg_desc",
      validFor: ["Línea 1", "Línea 2", "L-HITO", "L-600"]
    }
  ],


  // Medios de Pago (Estructura lista para incorporar los métodos oficiales tras la entrevista)
  paymentMethods: [
    {
      id: "cash",
      icon: "bi-cash",
      titleKey: "pay_cash_title",
      descKey: "pay_cash_desc"
    },
    {
      id: "sube_company",
      icon: "bi-card-checklist",
      titleKey: "pay_sube_company_title",
      descKey: "pay_sube_company_desc"
    },
    {
      id: "pending_notice",
      icon: "bi-clock-history",
      titleKey: "pay_pending_title",
      descKey: "pay_pending_desc"
    }
  ],

  // Puntos de venta / boleterías
  salePoints: [
    {
      name: "Boletería Río Uruguay - Terminal Central",
      address: "Av. Córdoba y Av. Misiones (Local 4)",
      hours: "Todos los días 06:00 a 22:30 hs",
      services: "Venta pasajes, información sobre tarifas y recorridos"
    },
    {
      name: "Puesto de Atención Hito Tres Fronteras",
      address: "Plaza Hito Tres Fronteras (Kiosco Turístico)",
      hours: "Martes a Domingo 09:00 a 20:00 hs",
      services: "Información turística y consultas"
    },
    {
      name: "Boletería Portal Parque Nacional Cataratas",
      address: "Acceso Parque Nacional Iguazú",
      hours: "Todos los días 07:30 a 18:30 hs",
      services: "Consultas de regreso a Terminal y Centro"
    }
  ],

  // Avisos y Noticias
  news: [
    {
      id: 1,
      date: "2026-09-10",
      badge: "INFORMACIÓN OFICIAL",
      badgeType: "warning",
      titleKey: "news_title_1",
      contentKey: "news_body_1"
    },
    {
      id: 2,
      date: "2026-09-08",
      badge: "AVISO OPERATIVO",
      badgeType: "info",
      titleKey: "news_title_2",
      contentKey: "news_body_2"
    },
    {
      id: 3,
      date: "2026-09-05",
      badge: "PASO INTERNACIONAL",
      badgeType: "success",
      titleKey: "news_title_3",
      contentKey: "news_body_3"
    }
  ],

  // Preguntas Frecuentes
  faqs: [
    {
      qKey: "faq_q1",
      aKey: "faq_a1",
      category: "payment"
    },
    {
      qKey: "faq_q2",
      aKey: "faq_a2",
      category: "tourist"
    },
    {
      qKey: "faq_q3",
      aKey: "faq_a3",
      category: "tourist"
    },
    {
      qKey: "faq_q4",
      aKey: "faq_a4",
      category: "international"
    },
    {
      qKey: "faq_q5",
      aKey: "faq_a5",
      category: "payment"
    },
    {
      qKey: "faq_q6",
      aKey: "faq_a6",
      category: "urban"
    }
  ]
};

// Exportar globalmente
window.TRANSPORT_DATA = TRANSPORT_DATA;
