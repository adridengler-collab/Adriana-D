/**
 * Base de Datos Integral del Transporte Urbano de Puerto Iguazú - Empresa Río Uruguay
 */

const TRANSPORT_DATA = {
  company: {
    name: "Río Uruguay - Transporte Urbano Iguazú",
    shortName: "Río Uruguay",
    phone: "+54 3757 420045",
    whatsapp: "+54 9 3757 54-8921",
    email: "consultas@riouruguaybus.com.ar",
    address: "Terminal de Ómnibus, Av. Córdoba y Av. Misiones, Local 4, Puerto Iguazú",
    operationalStatus: "NORMAL", // NORMAL | DELAY | DETOUR
    statusMessage: {
      es: "Todos los servicios urbanos y turísticos operan con frecuencia normal.",
      en: "All urban and tourist bus services are operating on regular schedule.",
      pt: "Todos os serviços urbanos e turísticos estão operando em horário normal."
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
    { id: "urban", labelKey: "cat_urban", icon: "bi-building" },
    { id: "international", labelKey: "cat_international", icon: "bi-globe-americas" }
  ],

  // Destinos turísticos clave para búsqueda rápida
  touristSpots: [
    { id: "cataratas", name: "Cataratas Argentinas (Parque Nacional)", lineId: "line-cataratas", icon: "water" },
    { id: "hito", name: "Hito Tres Fronteras & Costanera", lineId: "line-hito", icon: "compass" },
    { id: "aeropuerto", name: "Aeropuerto Int. Cataratas (IGR)", lineId: "line-aeropuerto", icon: "airplane" },
    { id: "hoteles600", name: "Selva Yriapú (600 Hectáreas Hoteles)", lineId: "line-600", icon: "tree" },
    { id: "aripuca", name: "La Aripuca & Güirá Oga", lineId: "line-cataratas", icon: "binoculars" },
    { id: "dutyfree", name: "Duty Free Shop / Aduana Argentina", lineId: "line-internacional-br", icon: "bag" },
    { id: "foz", name: "Foz do Iguaçu (Brasil / TTU)", lineId: "line-internacional-br", icon: "globe" },
    { id: "cde", name: "Ciudad del Este (Paraguay / CDE)", lineId: "line-internacional-py", icon: "shop" }
  ],

  // Líneas de Colectivos
  lines: [
    {
      id: "line-cataratas",
      number: "L-CAT",
      name: "Línea Cataratas (Parque Nacional)",
      badgeColor: "#059669", // Emerald Green
      type: "tourist",
      frequency: {
        weekday: "Cada 20 min",
        saturday: "Cada 20 min",
        sunday: "Cada 20 min"
      },
      firstBus: "07:00",
      lastBus: "19:40",
      price: {
        tourist: 5000,
        resident: 1500
      },
      description: {
        es: "Servicio directo al Parque Nacional Iguazú (Portal de acceso a Cataratas) pasando por atractivos sobre RN 12.",
        en: "Direct service to Iguazú National Park (Falls entrance) stopping at RN 12 attractions.",
        pt: "Serviço direto ao Parque Nacional do Iguaçu (entrada das Cataratas) passando por atrações na RN 12."
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
        ida: [
          "07:00", "07:20", "07:40", "08:00", "08:20", "08:40", "09:00", "09:20", "09:40",
          "10:00", "10:20", "10:40", "11:00", "11:20", "11:40", "12:00", "12:20", "12:40",
          "13:00", "13:20", "13:40", "14:00", "14:20", "14:40", "15:00", "15:20", "15:40",
          "16:00", "16:20", "16:40", "17:00", "17:20", "17:40", "18:00", "18:30", "19:00"
        ],
        vuelta: [
          "07:50", "08:10", "08:30", "08:50", "09:10", "09:30", "09:50", "10:10", "10:30",
          "10:50", "11:10", "11:30", "11:50", "12:10", "12:30", "12:50", "13:10", "13:30",
          "13:50", "14:10", "14:30", "14:50", "15:10", "15:30", "15:50", "16:10", "16:30",
          "16:50", "17:10", "17:30", "17:50", "18:10", "18:30", "19:00", "19:30", "20:00"
        ]
      }
    },

    {
      id: "line-hito",
      number: "L-HITO",
      name: "Línea Hito Tres Fronteras & Costanera",
      badgeColor: "#0284c7", // Sky Blue
      type: "tourist",
      frequency: {
        weekday: "Cada 30 min",
        saturday: "Cada 30 min",
        sunday: "Cada 40 min"
      },
      firstBus: "06:30",
      lastBus: "22:00",
      price: {
        tourist: 1800,
        resident: 900
      },
      description: {
        es: "Conecta la Terminal con la zona céntrica, la bella Costanera Eduardo Arrabal y el mirador del Hito Tres Fronteras.",
        en: "Connects the Bus Station with Downtown, the Eduardo Arrabal Waterfront, and the Three Borders Landmark.",
        pt: "Conecta a Rodoviária com o Centro, a Orla Eduardo Arrabal e o Marco das Três Fronteiras."
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
        ida: [
          "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00",
          "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
          "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
          "18:30", "19:00", "19:30", "20:00", "20:45", "21:30", "22:15"
        ],
        vuelta: [
          "06:50", "07:20", "07:50", "08:20", "08:50", "09:20", "09:50", "10:20",
          "10:50", "11:20", "11:50", "12:20", "12:50", "13:20", "13:50", "14:20",
          "14:50", "15:20", "15:50", "16:20", "16:50", "17:20", "17:50", "18:20",
          "18:50", "19:20", "19:50", "20:20", "21:05", "21:50", "22:35"
        ]
      }
    },

    {
      id: "line-aeropuerto",
      number: "L-AEROPUERTO",
      name: "Línea Aeropuerto Internacional (IGR)",
      badgeColor: "#d97706", // Amber
      type: "tourist",
      frequency: {
        weekday: "Sincronizado con vuelos (cada 45-60 min)",
        saturday: "Sincronizado con vuelos",
        sunday: "Sincronizado con vuelos"
      },
      firstBus: "06:00",
      lastBus: "21:30",
      price: {
        tourist: 4500,
        resident: 1800
      },
      description: {
        es: "Enlace rápido entre el Centro / Terminal de Ómnibus y el Aeropuerto Mayor Carlos Krause (IGR).",
        en: "Fast transit between Bus Terminal / Downtown and Cataratas Int. Airport (IGR).",
        pt: "Transporte rápido entre o Centro / Rodoviária e o Aeroporto Internacional (IGR)."
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
        ida: [
          "06:00", "07:15", "08:30", "09:45", "11:00", "12:15",
          "13:30", "14:45", "16:00", "17:15", "18:30", "20:00", "21:30"
        ],
        vuelta: [
          "07:00", "08:15", "09:30", "10:45", "12:00", "13:15",
          "14:30", "15:45", "17:00", "18:15", "19:30", "21:00", "22:30"
        ]
      }
    },

    {
      id: "line-600",
      number: "L-600",
      name: "Línea 600 Hectáreas (Selva Yriapú)",
      badgeColor: "#16a34a", // Forest Green
      type: "tourist",
      frequency: {
        weekday: "Cada 40 min",
        saturday: "Cada 45 min",
        sunday: "Cada 60 min"
      },
      firstBus: "06:15",
      lastBus: "21:15",
      price: {
        tourist: 2000,
        resident: 900
      },
      description: {
        es: "Acceso a la reserva Selva Yriapú, principales eco-lodges, resorts y a las comunidades Guaraníes (Fortín M'Bororé).",
        en: "Access to Yriapú Rainforest Reserve, eco-lodges, resorts, and Guaraní Indigenous communities.",
        pt: "Acesso à reserva Selva Yriapú, eco-lodges, resorts e comunidades indígenas Guaranis."
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
        ida: [
          "06:15", "07:00", "07:45", "08:30", "09:15", "10:00", "10:45", "11:30",
          "12:15", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30",
          "18:15", "19:00", "19:45", "20:30", "21:15"
        ],
        vuelta: [
          "06:45", "07:30", "08:15", "09:00", "09:45", "10:30", "11:15", "12:00",
          "12:45", "13:30", "14:15", "15:00", "15:45", "16:30", "17:15", "18:00",
          "18:45", "19:30", "20:15", "21:00", "21:45"
        ]
      }
    },

    {
      id: "line-u1",
      number: "Línea 1",
      name: "Urbano 1: Terminal - B° 1° de Mayo - Belén - SAMIC",
      badgeColor: "#7c3aed", // Purple
      type: "urban",
      frequency: {
        weekday: "Cada 25 min",
        saturday: "Cada 35 min",
        sunday: "Cada 50 min"
      },
      firstBus: "05:30",
      lastBus: "23:00",
      price: {
        tourist: 900,
        resident: 900
      },
      description: {
        es: "Conecta la Terminal con el Hospital SAMIC, colegios, Barrio 1° de Mayo, B° Belén y B° Bicentenario.",
        en: "Connects Bus Station with SAMIC Public Hospital, schools, and residential neighborhoods.",
        pt: "Liga a Rodoviária ao Hospital SAMIC, escolas e bairros residenciais 1° de Mayo e Belén."
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
        ida: [
          "05:30", "06:00", "06:25", "06:50", "07:15", "07:40", "08:05", "08:30",
          "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
          "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
          "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:45",
          "21:30", "22:15", "23:00"
        ],
        vuelta: [
          "05:55", "06:25", "06:50", "07:15", "07:40", "08:05", "08:30", "08:55",
          "09:25", "09:55", "10:25", "10:55", "11:25", "11:55", "12:25", "12:55",
          "13:25", "13:55", "14:25", "14:55", "15:25", "15:55", "16:25", "16:55",
          "17:25", "17:55", "18:25", "18:55", "19:25", "19:55", "20:25", "21:10",
          "21:55", "22:40", "23:25"
        ]
      }
    },

    {
      id: "line-u2",
      number: "Línea 2",
      name: "Urbano 2: Terminal - B° 2000 - Santa Rosa - Rivera",
      badgeColor: "#ea580c", // Orange
      type: "urban",
      frequency: {
        weekday: "Cada 30 min",
        saturday: "Cada 40 min",
        sunday: "Cada 60 min"
      },
      firstBus: "05:45",
      lastBus: "22:30",
      price: {
        tourist: 900,
        resident: 900
      },
      description: {
        es: "Servicio urbano transversal hacia Barrio 2000, Barrio Santa Rosa, zona Rivera del Paraná y complejo educativo.",
        en: "Urban loop serving Barrio 2000, Santa Rosa, Paraná River area, and educational zone.",
        pt: "Serviço urbano transversal aos bairros 2000, Santa Rosa e orla do Rio Paraná."
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
        ida: [
          "05:45", "06:15", "06:45", "07:15", "07:45", "08:15", "08:45", "09:15",
          "10:00", "10:45", "11:30", "12:15", "13:00", "13:45", "14:30", "15:15",
          "16:00", "16:45", "17:30", "18:15", "19:00", "19:45", "20:30", "21:30", "22:30"
        ],
        vuelta: [
          "06:10", "06:40", "07:10", "07:40", "08:10", "08:40", "09:10", "09:40",
          "10:25", "11:10", "11:55", "12:40", "13:25", "14:10", "14:55", "15:40",
          "16:25", "17:10", "17:55", "18:40", "19:25", "20:10", "20:55", "21:55", "22:55"
        ]
      }
    },

    {
      id: "line-internacional-br",
      number: "L-INT BR",
      name: "Internacional: Puerto Iguazú ⇆ Foz do Iguaçu (Brasil 🇧🇷)",
      badgeColor: "#2563eb", // Royal Blue
      type: "international",
      frequency: {
        weekday: "Cada 30-40 min",
        saturday: "Cada 40 min",
        sunday: "Cada 50 min"
      },
      firstBus: "06:30",
      lastBus: "20:00",
      price: {
        tourist: 3000,
        resident: 3000
      },
      description: {
        es: "Cruce internacional por el Puente Tancredo Neves. Pasa por Aduana Argentina, Duty Free Shop, Aduana Brasileña y llega a la Terminal TTU de Foz do Iguaçu.",
        en: "International bus crossing Tancredo Neves Bridge via Argentina Customs, Duty Free Shop, Brazil Customs to TTU Urban Terminal in Foz do Iguaçu.",
        pt: "Linha internacional cruzando a Ponte Tancredo Neves pela Aduana Argentina, Duty Free e Aduana Brasileira até o Terminal TTU em Foz do Iguaçu."
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
        ida: [
          "06:30", "07:10", "07:50", "08:30", "09:10", "09:50", "10:30", "11:10",
          "11:50", "12:30", "13:10", "13:50", "14:30", "15:10", "15:50", "16:30",
          "17:10", "17:50", "18:30", "19:15", "20:00"
        ],
        vuelta: [
          "07:30", "08:10", "08:50", "09:30", "10:10", "10:50", "11:30", "12:10",
          "12:50", "13:30", "14:10", "14:50", "15:30", "16:10", "16:50", "17:30",
          "18:10", "18:50", "19:30", "20:15", "21:00"
        ]
      }
    },

    {
      id: "line-internacional-py",
      number: "L-INT PY",
      name: "Internacional: Puerto Iguazú ⇆ Ciudad del Este (Paraguay 🇵🇾)",
      badgeColor: "#0284c7", // Sky Blue
      type: "international",
      frequency: {
        weekday: "Cada 40-50 min",
        saturday: "Cada 50 min",
        sunday: "Cada 60 min"
      },
      firstBus: "06:00",
      lastBus: "19:00",
      price: {
        tourist: 4000,
        resident: 4000
      },
      description: {
        es: "Servicio internacional directo a Paraguay. Cruza por Foz do Iguaçu (Brasil), atraviesa el Puente de la Amistad (Ponte da Amizade) y llega a Ciudad del Este (Terminal y Microcentro comercial).",
        en: "Direct international service to Paraguay crossing through Foz do Iguaçu (Brazil), over the Friendship Bridge into Ciudad del Este (Downtown & Bus Terminal).",
        pt: "Serviço internacional direto ao Paraguai passando por Foz do Iguaçu, cruzando a Ponte da Amizade até Ciudad del Este."
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
        ida: [
          "06:00", "06:45", "07:30", "08:15", "09:00", "09:45", "10:30", "11:15",
          "12:00", "12:45", "13:30", "14:15", "15:00", "15:45", "16:30", "17:15",
          "18:00", "19:00"
        ],
        vuelta: [
          "07:15", "08:00", "08:45", "09:30", "10:15", "11:00", "11:45", "12:30",
          "13:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30",
          "19:15", "20:15"
        ]
      }
    }
  ],

  // Tarifas Oficiales
  fares: [
    {
      categoryKey: "fare_cataratas",
      priceARS: 5000,
      priceBRL: 25,
      priceUSD: 5,
      descriptionKey: "fare_cataratas_desc",
      validFor: ["L-CAT"]
    },
    {
      categoryKey: "fare_airport",
      priceARS: 4500,
      priceBRL: 22,
      priceUSD: 4.5,
      descriptionKey: "fare_airport_desc",
      validFor: ["L-AEROPUERTO"]
    },
    {
      categoryKey: "fare_international",
      priceARS: 3000,
      priceBRL: 15,
      priceUSD: 3,
      descriptionKey: "fare_international_desc",
      validFor: ["L-INT BR"]
    },
    {
      categoryKey: "fare_international_py",
      priceARS: 4000,
      priceBRL: 20,
      priceUSD: 4,
      descriptionKey: "fare_international_py_desc",
      validFor: ["L-INT PY"]
    },
    {
      categoryKey: "fare_tourist_hito",
      priceARS: 1800,
      priceBRL: 9,
      priceUSD: 2,
      descriptionKey: "fare_tourist_hito_desc",
      validFor: ["L-HITO", "L-600"]
    },
    {
      categoryKey: "fare_urban_general",
      priceARS: 900,
      priceBRL: 5,
      priceUSD: 1,
      descriptionKey: "fare_urban_general_desc",
      validFor: ["Línea 1", "Línea 2", "L-HITO (Residente)", "L-600 (Residente)"]
    },
    {
      categoryKey: "fare_student_beeg",
      priceARS: 0,
      priceBRL: 0,
      priceUSD: 0,
      descriptionKey: "fare_student_beeg_desc",
      validFor: ["Línea 1", "Línea 2", "L-HITO", "L-600"]
    }
  ],

  // Medios de Pago
  paymentMethods: [
    {
      id: "cash",
      icon: "bi-cash-coin",
      titleKey: "pay_cash_title",
      descKey: "pay_cash_desc"
    },
    {
      id: "card_rio",
      icon: "bi-credit-card-2-front-fill",
      titleKey: "pay_card_title",
      descKey: "pay_card_desc"
    },
    {
      id: "qr",
      icon: "bi-qr-code-scan",
      titleKey: "pay_qr_title",
      descKey: "pay_qr_desc"
    },
    {
      id: "sube",
      icon: "bi-credit-card-fill",
      titleKey: "pay_sube_title",
      descKey: "pay_sube_desc"
    }
  ],

  // Puntos de venta / recarga
  salePoints: [
    {
      name: "Boletería Río Uruguay - Terminal Central",
      address: "Av. Córdoba y Av. Misiones (Local 4)",
      hours: "Todos los días 06:00 a 22:30 hs",
      services: "Venta pasajes Cataratas/Aeropuerto, recarga tarjeta, informes"
    },
    {
      name: "Puesto de Atención Hito Tres Fronteras",
      address: "Plaza Hito Tres Fronteras (Kiosco Turístico)",
      hours: "Martes a Domingo 09:00 a 20:00 hs",
      services: "Venta de boletos turísticos y consultas"
    },
    {
      name: "Kiosco Central Plaza San Martín",
      address: "Av. Brasil 120 (Frente a la Plaza)",
      hours: "Lunes a Sábados 07:30 a 21:00 hs",
      services: "Recarga de saldo y compra de tarjeta local"
    },
    {
      name: "Boletería Portal Parque Nacional Cataratas",
      address: "Acceso Parque Nacional Iguazú",
      hours: "Todos los días 07:30 a 18:30 hs",
      services: "Boletos de regreso a la Terminal y Centro"
    }
  ],

  // Avisos y Noticias
  news: [
    {
      id: 1,
      date: "2026-08-25",
      badge: "AVISO IMPORTANTE",
      badgeType: "warning",
      titleKey: "news_title_1",
      contentKey: "news_body_1"
    },
    {
      id: 2,
      date: "2026-08-20",
      badge: "HORARIO ESPECIAL",
      badgeType: "info",
      titleKey: "news_title_2",
      contentKey: "news_body_2"
    },
    {
      id: 3,
      date: "2026-08-15",
      badge: "SERVICIO INTERNACIONAL",
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
