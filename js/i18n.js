/**
 * Sistema de Traducción Multilingüe (i18n)
 * Idiomas: Español (ES), English (EN), Português (PT), Français (FR)
 */

const TRANSLATIONS = {
  es: {
    // Header & Nav
    nav_home: "Inicio",
    nav_lines: "Líneas y Recorridos",
    nav_planner: "Planificador",
    nav_map: "Mapa en Vivo",
    nav_fares: "Tarifas",
    nav_news: "Avisos",
    nav_faq: "Preguntas Frecuentes",
    nav_contact: "Contacto",
    status_normal: "Servicio en Circulación",
    status_alert: "Avisos Activos",

    // Indicadores globales de datos
    info_not_available: "Información no disponible",
    pending_confirmation: "Pendiente de confirmación oficial",
    official_data_pending: "Datos oficiales: pendientes de confirmación",
    last_update_label: "Última actualización:",
    last_update_prefix: "Última actualización de datos:",
    last_update_pending: "pendiente de confirmación",
    notice_pending_official: "Información de tarifas y horarios pendiente de confirmación oficial.",
    fare_not_available: "Tarifa: Información no disponible",
    schedule_not_available: "Horario: Información no disponible",
    frequency_not_available: "Frecuencia: Información no disponible",
    modal_schedules_pending: "Horarios y frecuencias pendientes de confirmación oficial en boletería.",

    // Hero
    hero_badge: "TRANSPORTE PÚBLICO PUERTO IGUAZÚ • RÍO URUGUAY",
    hero_title: "Moverte por Iguazú nunca fue tan fácil",
    hero_subtitle: "Consulta recorridos, paradas autorizadas y planifica tu viaje a Cataratas, Hito Tres Fronteras, Aeropuerto y todos los barrios.",
    hero_search_origin: "¿Dónde estás? (Ej: Terminal, Centro)",
    hero_search_dest: "¿A dónde vas? (Ej: Cataratas, Aeropuerto)",
    hero_search_btn: "Buscar Recorrido",
    hero_quick_tags: "Destinos populares:",
    tag_cataratas: "🌊 Cataratas",
    tag_hito: "📍 Hito 3 Fronteras",
    tag_aeropuerto: "✈️ Aeropuerto (IGR)",
    tag_hoteles600: "🌿 Selva Yriapú (600 Ha)",
    tag_foz: "🇧🇷 Foz do Iguaçu",
    tag_cde: "🇵🇾 Ciudad del Este",

    // Categories / Filters
    cat_all: "Todas las Líneas",
    cat_tourist: "Turísticas y Cataratas",
    cat_urban: "Líneas Barriales",
    cat_international: "Internacional",

    // Status / Notice
    live_next_bus_title: "Estado del Servicio",
    live_next_bus_hint: "Información de horarios en proceso de actualización",
    live_frequency: "Frecuencia:",

    // Line Card / Details
    line_view_details: "Ver Recorrido y Paradas",
    line_tab_schedule: "Horarios",
    line_tab_route: "Recorrido y Paradas",
    line_tab_live: "Estado",
    line_tab_map: "Ver en Mapa",
    line_direction_ida: "Ida (Hacia Destino)",
    line_direction_vuelta: "Vuelta (Hacia Terminal/Centro)",
    line_stops_count: "paradas principales",
    line_first_bus: "Primer servicio:",
    line_last_bus: "Último servicio:",
    line_show_on_map: "Trazar en Mapa",
    line_download_pdf: "Guardar Información",

    // Trip Planner
    planner_title: "Planificador de Viajes Inteligente",
    planner_subtitle: "Selecciona tu punto de partida y destino para conocer la combinación de colectivos y paradas óptimas.",
    planner_from_label: "Origen",
    planner_to_label: "Destino",
    planner_swap: "Invertir origen y destino",
    planner_btn_find: "Calcular Mejor Ruta",
    planner_suggested_route: "Ruta Recomendada",
    planner_line_suggested: "Tomar Línea:",
    planner_estimated_time: "Tiempo estimado a pie/ruta:",
    planner_boarding_at: "Subir en:",
    planner_dropoff_at: "Bajar en:",
    planner_estimated_fare: "Tarifa:",
    planner_no_direct: "Para este trayecto, recomendamos tomar la línea hasta la Terminal de Ómnibus y realizar transbordo.",
    planner_view_map_btn: "Ver recorrido en el mapa",

    // Interactive Map
    map_section_title: "Mapa Interactivo y Planificador de Viajes",
    map_section_subtitle: "Explora las rutas trazadas, paradas autorizadas y calcula tu itinerario en colectivo.",
    map_planner_title: "Planificador de Viajes",
    map_input_origin: "Origen (o usar Mi Ubicación)",
    map_input_dest: "Destino (ej. Cataratas, Aeropuerto...)",
    map_btn_use_gps: "🧭 Mi Ubicación",
    map_btn_swap: "Invertir",
    map_btn_calculate: "Calcular Recorrido",
    map_btn_clear: "Limpiar Ruta",
    map_btn_filter_line: "Líneas en Mapa",
    map_step_walk: "Caminar",
    map_step_bus: "Tomar Colectivo",
    map_step_transfer: "Transbordo en",
    map_trip_summary: "Tu Viaje",
    map_stops_count: "paradas",
    map_distance: "Distancia calculada",
    map_duration: "Tiempo estimado",
    map_fare: "Tarifa",
    map_boarding_at: "Subir en",
    map_dropoff_at: "Bajar en",
    map_legend_title: "Líneas en Mapa",
    map_legend_user: "Tu Ubicación",
    map_legend_origin: "Punto de Partida",
    map_legend_stop: "Parada",
    map_legend_dest: "Destino Final",
    map_marker_origin: "Punto de Partida / Inicio",
    map_marker_stop: "Parada de Colectivo",
    map_marker_dest: "Destino Final",
    map_btn_my_location: "Mi Ubicación (GPS)",
    map_btn_center_terminal: "Centrar en Iguazú",
    map_btn_reset: "Ver Recorrido Completo",
    map_stop_popup_title: "Parada Autorizada",
    map_stop_lines_here: "Líneas que pasan por aquí:",
    map_stop_set_origin: "📍 Salir desde aquí (Origen)",
    map_stop_set_dest: "🏁 Ir hacia aquí (Destino)",
    map_stop_view_line: "Ver Línea",
    map_schedule_not_available: "Horario: Información no disponible",
    map_marker_user: "Estás aquí (Tu Ubicación GPS)",
    map_error_no_route: "No se encontró una conexión directa. Te recomendamos seleccionar una línea para ver su recorrido.",
    map_same_location: "El punto de partida y el destino son el mismo lugar.",
    map_walking_only: "Tu destino está muy cerca para ir a pie:",
    map_international_border: "Cruce Fronterizo Internacional",
    map_osrm_fallback: "Ruta trazada sobre la red oficial de paradas",

    // Fares Section
    fares_title: "Tarifas y Medios de Pago",
    fares_subtitle: "Información de tarifas en proceso de confirmación oficial.",
    fare_category_col: "Categoría / Recorrido",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reales (BRL)",
    fare_price_usd_col: "Dólares (USD)",
    fare_validity_col: "Líneas Aplicables",

    fare_cataratas: "Servicio Cataratas (Parque Nacional)",
    fare_cataratas_desc: "Boleto directo al Portal de acceso a Cataratas (RN 12)",
    fare_airport: "Servicio Especial Aeropuerto IGR",
    fare_airport_desc: "Desde Terminal/Centro hasta el Aeropuerto Internacional Mayor Carlos Krause",
    fare_international: "Servicio Internacional Foz do Iguaçu (Brasil)",
    fare_international_desc: "Cruce Puente Tancredo Neves hasta Terminal TTU Foz do Iguaçu (Brasil)",
    fare_international_py: "Servicio Internacional Ciudad del Este (Paraguay)",
    fare_international_py_desc: "Directo a Paraguay vía Foz do Iguaçu y Puente de la Amistad hasta CDE",
    fare_tourist_hito: "Servicio Turístico Hito / 600 Ha",
    fare_tourist_hito_desc: "Acceso a Hito Tres Fronteras, Costanera y Reserva Selva Yriapú",
    fare_urban_general: "Boleto Urbano Local / Residente",
    fare_urban_general_desc: "Tarifa general barrial",
    fare_student_beeg: "Boleto Estudiantil Gratuito (BEEG)",
    fare_student_beeg_desc: "Para estudiantes registrados en el ciclo lectivo",

    // Payment Methods
    pay_methods_title: "Medios de Pago",
    pay_pending_title: "Medios de pago: Pendiente de confirmación oficial",
    pay_pending_desc: "Los medios de pago vigentes, tarjetas locales y opciones electrónicas se encuentran pendientes de confirmación oficial.",

    // Points of Sale
    points_title: "Boleterías y Puntos de Atención",
    points_subtitle: "Puntos de atención para consultas, adquisición de pasajes e información.",

    // News & Alerts
    news_title: "Estado del Servicio y Avisos",
    news_subtitle: "Información operativa y avisos a los pasajeros.",
    news_title_1: "Actualización de datos operativos en curso",
    news_body_1: "Se está coordinando la recopilación de datos oficiales de tarifas y frecuencias en la administración local.",
    news_title_2: "Servicios turísticos y urbanos en funcionamiento",
    news_body_2: "Las unidades realizan sus recorridos habituales conectando la Terminal, Cataratas, Hito y barrios.",
    news_title_3: "Documentación para Cruce Internacional",
    news_body_3: "Recuerde portar DNI o Pasaporte vigente para los controles migratorios en Aduana.",

    // FAQ
    faq_title: "Preguntas Frecuentes",
    faq_subtitle: "Respuestas rápidas a las consultas más habituales de usuarios y turistas.",
    faq_search_placeholder: "Buscar una pregunta (ej: equipaje, Cataratas, Terminal)...",
    faq_q1: "¿Cómo se abonan los pasajes del colectivo?",
    faq_a1: "Los medios de pago aceptados y formas de cobro están pendientes de confirmación oficial. Para mayor precisión, consulte directamente en la boletería central de la Terminal.",
    faq_q2: "¿Dónde sale el colectivo para ir a las Cataratas?",
    faq_a2: "El colectivo a Cataratas sale de la Plataforma 7 de la Terminal de Ómnibus de Puerto Iguazú (Av. Córdoba y Misiones), con paradas sobre Av. Victoria Aguirre y Ruta Nacional 12.",
    faq_q3: "¿Puedo llevar valijas o mochilas grandes en el colectivo?",
    faq_a3: "Sí, las unidades que van al Aeropuerto (IGR), Cataratas y Terminal cuentan con portaequipajes y espacio para valijas.",
    faq_q4: "¿Cómo funciona el cruce a Foz do Iguaçu (Brasil) en colectivo?",
    faq_a4: "El colectivo internacional sale de la Terminal de Puerto Iguazú. Al llegar a la Aduana Argentina todos los pasajeros descienden para realizar Migraciones. Conserve su comprobante de pasaje.",
    faq_q5: "¿Dónde puedo consultar información oficial de tarifas y frecuencias?",
    faq_a5: "En la Boletería Local 4 de Río Uruguay en la Terminal de Ómnibus (Av. Córdoba y Misiones) y en los puestos de atención habilitados.",
    faq_q6: "¿Los residentes de Puerto Iguazú tienen tarifa diferencial?",
    faq_a6: "El servicio urbano prevé modalidades para residentes locales, sujeto a las condiciones y documentación vigentes en la administración.",

    // Contact & Footer
    contact_title: "Atención al Pasajero",
    contact_subtitle: "¿Tienes dudas sobre recorridos, paradas o reclamos? Estamos para ayudarte.",
    contact_phone: "Teléfono Boletería:",
    contact_whatsapp: "WhatsApp de Consultas:",
    contact_email: "Correo Electrónico:",
    contact_address: "Boletería Principal:",
    contact_hours: "Atención todos los días de 06:00 a 22:30 hs",
    contact_btn_whatsapp: "Chatear por WhatsApp",
    footer_rights: "Todos los derechos reservados. Portal informativo de transporte público para Puerto Iguazú.",
    footer_quick_links: "Accesos Rápidos"
  },

  en: {
    // Header & Nav
    nav_home: "Home",
    nav_lines: "Lines & Routes",
    nav_planner: "Trip Planner",
    nav_map: "Live Map",
    nav_fares: "Fares",
    nav_news: "Alerts",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    status_normal: "Service Operating",
    status_alert: "Active Alerts",

    // Global Data Indicators
    info_not_available: "Information not available",
    pending_confirmation: "Pending official confirmation",
    official_data_pending: "Official data: pending confirmation",
    last_update_label: "Last updated:",
    last_update_prefix: "Data last updated:",
    last_update_pending: "pending confirmation",
    notice_pending_official: "Fares and timetables information pending official confirmation.",
    fare_not_available: "Fare: Information not available",
    schedule_not_available: "Timetable: Information not available",
    frequency_not_available: "Frequency: Information not available",
    modal_schedules_pending: "Timetables and frequencies pending official confirmation at the ticket office.",

    // Hero
    hero_badge: "PUERTO IGUAZÚ PUBLIC TRANSPORT • RÍO URUGUAY",
    hero_title: "Getting around Iguazú has never been easier",
    hero_subtitle: "Check routes, authorized bus stops, and plan your journey to Iguazu Falls, Three Borders Landmark, Airport, and city neighborhoods.",
    hero_search_origin: "Where are you? (e.g. Bus Station, Downtown)",
    hero_search_dest: "Where are you going? (e.g. Falls, Airport)",
    hero_search_btn: "Find Route",
    hero_quick_tags: "Popular destinations:",
    tag_cataratas: "🌊 Iguazu Falls",
    tag_hito: "📍 Three Borders Landmark",
    tag_aeropuerto: "✈️ Airport (IGR)",
    tag_hoteles600: "🌿 Yriapú Rainforest (600 Ha)",
    tag_foz: "🇧🇷 Foz do Iguaçu (Brazil)",
    tag_cde: "🇵🇾 Ciudad del Este (Paraguay)",

    // Categories / Filters
    cat_all: "All Bus Lines",
    cat_tourist: "Tourist & Falls",
    cat_urban: "Neighborhood Lines",
    cat_international: "International",

    // Status / Notice
    live_next_bus_title: "Service Status",
    live_next_bus_hint: "Timetable details are under official update",
    live_frequency: "Frequency:",

    // Line Card / Details
    line_view_details: "View Route & Stops",
    line_tab_schedule: "Timetable",
    line_tab_route: "Route & Stops",
    line_tab_live: "Status",
    line_tab_map: "View on Map",
    line_direction_ida: "Outbound (To Destination)",
    line_direction_vuelta: "Inbound (To Bus Station/Downtown)",
    line_stops_count: "major stops",
    line_first_bus: "First bus:",
    line_last_bus: "Last bus:",
    line_show_on_map: "Show on Map",
    line_download_pdf: "Save Information",

    // Trip Planner
    planner_title: "Smart Trip Planner",
    planner_subtitle: "Choose your starting point and destination to find the best bus route and stops.",
    planner_from_label: "Origin",
    planner_to_label: "Destination",
    planner_swap: "Swap origin and destination",
    planner_btn_find: "Calculate Best Route",
    planner_suggested_route: "Recommended Route",
    planner_line_suggested: "Take Bus Line:",
    planner_estimated_time: "Estimated walk/transit time:",
    planner_boarding_at: "Board at:",
    planner_dropoff_at: "Get off at:",
    planner_estimated_fare: "Fare:",
    planner_no_direct: "For this route, we recommend taking the bus to the Central Bus Station and transferring there.",
    planner_view_map_btn: "View route on map",

    // Interactive Map
    map_section_title: "Interactive Map & Trip Planner",
    map_section_subtitle: "Explore bus routes, authorized stops, and calculate your transit journey.",
    map_planner_title: "Trip Planner",
    map_input_origin: "Origin (or use My Location)",
    map_input_dest: "Destination (e.g. Falls, Airport...)",
    map_btn_use_gps: "🧭 My Location",
    map_btn_swap: "Swap",
    map_btn_calculate: "Calculate Route",
    map_btn_clear: "Clear Route",
    map_btn_filter_line: "Lines on Map",
    map_step_walk: "Walk",
    map_step_bus: "Take Bus",
    map_step_transfer: "Transfer at",
    map_trip_summary: "Your Trip",
    map_stops_count: "stops",
    map_distance: "Calculated distance",
    map_duration: "Estimated time",
    map_fare: "Fare",
    map_boarding_at: "Board at",
    map_dropoff_at: "Get off at",
    map_legend_title: "Lines on Map",
    map_legend_user: "Your Location",
    map_legend_origin: "Origin / Start",
    map_legend_stop: "Bus Stop",
    map_legend_dest: "Final Destination",
    map_marker_origin: "Origin / Starting Point",
    map_marker_stop: "Intermediate Bus Stop",
    map_marker_dest: "Final Destination",
    map_btn_my_location: "My Location (GPS)",
    map_btn_center_terminal: "Center on Iguazú",
    map_btn_reset: "View Full Route",
    map_stop_popup_title: "Authorized Bus Stop",
    map_stop_lines_here: "Lines passing here:",
    map_stop_set_origin: "📍 Set as Origin",
    map_stop_set_dest: "🏁 Set as Destination",
    map_stop_view_line: "View Line",
    map_schedule_not_available: "Timetable: Information not available",
    map_marker_user: "You are here (GPS Location)",
    map_error_no_route: "No direct transit route found. We recommend checking individual lines on the map.",
    map_same_location: "Origin and destination are the same point.",
    map_walking_only: "Your destination is within short walking distance:",
    map_international_border: "International Border Crossing",
    map_osrm_fallback: "Route mapped via official bus stop network",

    // Fares Section
    fares_title: "Fares & Payment Methods",
    fares_subtitle: "Fare details are currently pending official confirmation.",
    fare_category_col: "Category / Route",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reais (BRL)",
    fare_price_usd_col: "US Dollars (USD)",
    fare_validity_col: "Applicable Lines",

    fare_cataratas: "Iguazu Falls (National Park) Service",
    fare_cataratas_desc: "Direct bus to the National Park Falls entrance (RN 12)",
    fare_airport: "IGR Airport Special Service",
    fare_airport_desc: "From Bus Station/Downtown to Cataratas Int. Airport (IGR)",
    fare_international: "International Service to Foz do Iguaçu (Brazil)",
    fare_international_desc: "Across Tancredo Neves Bridge to TTU Urban Terminal in Foz do Iguaçu (Brazil)",
    fare_international_py: "International Service to Ciudad del Este (Paraguay)",
    fare_international_py_desc: "Direct bus to Paraguay via Foz do Iguaçu and Friendship Bridge to CDE",
    fare_tourist_hito: "Tourist Service Three Borders / 600 Ha",
    fare_tourist_hito_desc: "Access to Three Borders Landmark, River Promenade, and Yriapú Reserve",
    fare_urban_general: "Local Urban / Resident Bus Ticket",
    fare_urban_general_desc: "General local neighborhood fare",
    fare_student_beeg: "Free Student Pass (BEEG)",
    fare_student_beeg_desc: "For registered students during school terms",

    // Payment Methods
    pay_methods_title: "Payment Methods",
    pay_pending_title: "Payment methods: Pending official confirmation",
    pay_pending_desc: "Accepted payment methods and local smartcard details are pending official confirmation.",

    // Points of Sale
    points_title: "Ticket Offices & Information Points",
    points_subtitle: "Customer assistance points for questions and route details.",

    // News & Alerts
    news_title: "Service Status & Notices",
    news_subtitle: "Operational status and passenger notices.",
    news_title_1: "Operational data update in progress",
    news_body_1: "Official fares and frequency tables are being coordinated with local management.",
    news_title_2: "Tourist and neighborhood services operational",
    news_body_2: "Buses are operating their regular routes connecting the Bus Station, Falls, Landmark, and neighborhoods.",
    news_title_3: "Required Travel Documents for International Crossing",
    news_body_3: "Please carry a valid ID card or Passport for border customs control.",

    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Quick answers to common questions for visitors and residents.",
    faq_search_placeholder: "Search questions (e.g. luggage, Falls, Bus Station)...",
    faq_q1: "How do I pay for bus tickets?",
    faq_a1: "Accepted payment methods are pending official confirmation. Please consult directly at the Central Bus Station ticket office.",
    faq_q2: "Where does the bus to Iguazu Falls depart?",
    faq_a2: "The bus to Iguazu Falls departs from Platform 7 at the Puerto Iguazú Central Bus Station (Av. Córdoba and Misiones), with stops along Av. Victoria Aguirre and Route 12.",
    faq_q3: "Can I bring suitcases or large backpacks on the bus?",
    faq_a3: "Yes, buses serving the Airport (IGR), Falls, and Terminal have luggage racks and dedicated space for suitcases.",
    faq_q4: "How does the international border crossing to Foz do Iguaçu (Brazil) work?",
    faq_a4: "The international bus departs from the Puerto Iguazú Bus Terminal. At Argentine Customs, all passengers alight for immigration procedures. Keep your ticket receipt.",
    faq_q5: "Where can I find official fares and schedules?",
    faq_a5: "At Río Uruguay Ticket Booth #4 in the Central Bus Terminal (Av. Córdoba & Misiones) and official service points.",
    faq_q6: "Do Puerto Iguazú residents get discounted fares?",
    faq_a6: "Local resident terms are subject to current administrative conditions at ticket booths.",

    // Contact & Footer
    contact_title: "Customer Support & Inquiries",
    contact_subtitle: "Questions about routes, stops, or assistance? We are here to help.",
    contact_phone: "Ticket Booth Phone:",
    contact_whatsapp: "WhatsApp Inquiries:",
    contact_email: "Email Support:",
    contact_address: "Main Ticket Office:",
    contact_hours: "Open daily from 06:00 AM to 10:30 PM",
    contact_btn_whatsapp: "Chat on WhatsApp",
    footer_rights: "All rights reserved. Informational public transport guide for Puerto Iguazú.",
    footer_quick_links: "Quick Links"
  },

  pt: {
    // Header & Nav
    nav_home: "Início",
    nav_lines: "Linhas e Itinerários",
    nav_planner: "Planejador",
    nav_map: "Mapa ao Vivo",
    nav_fares: "Tarifas",
    nav_news: "Avisos",
    nav_faq: "Perguntas Frequentes",
    nav_contact: "Contato",
    status_normal: "Serviço em Circulação",
    status_alert: "Avisos Ativos",

    // Indicadores globais de dados
    info_not_available: "Informação não disponível",
    pending_confirmation: "Pendente de confirmação oficial",
    official_data_pending: "Dados oficiais: pendentes de confirmação",
    last_update_label: "Última atualização:",
    last_update_prefix: "Última atualização de dados:",
    last_update_pending: "pendente de confirmação",
    notice_pending_official: "Informações de tarifas e horários pendentes de confirmação oficial.",
    fare_not_available: "Tarifa: Informação não disponível",
    schedule_not_available: "Horário: Informação não disponível",
    frequency_not_available: "Frequência: Informação não disponível",
    modal_schedules_pending: "Horários e frequências pendentes de confirmação oficial na bilheteria.",

    // Hero
    hero_badge: "TRANSPORTE PÚBLICO PUERTO IGUAZÚ • RÍO URUGUAY",
    hero_title: "Circular por Puerto Iguazú nunca foi tão fácil",
    hero_subtitle: "Consulte itinerários, paradas autorizadas e planeje seu passeio às Cataratas, Marco das Três Fronteiras, Aeroporto e bairros.",
    hero_search_origin: "Onde você está? (Ex: Rodoviária, Centro)",
    hero_search_dest: "Para onde vai? (Ex: Cataratas, Aeroporto)",
    hero_search_btn: "Buscar Rota",
    hero_quick_tags: "Destinos populares:",
    tag_cataratas: "🌊 Cataratas Argentinas",
    tag_hito: "📍 Marco das 3 Fronteiras",
    tag_aeropuerto: "✈️ Aeroporto (IGR)",
    tag_hoteles600: "🌿 Selva Yriapú (600 Ha)",
    tag_foz: "🇧🇷 Foz do Iguaçu (Brasil)",
    tag_cde: "🇵🇾 Ciudad del Este (Paraguai)",

    // Categories / Filters
    cat_all: "Todas as Linhas",
    cat_tourist: "Turísticas e Cataratas",
    cat_urban: "Linhas de Bairro",
    cat_international: "Internacional",

    // Status / Notice
    live_next_bus_title: "Status do Serviço",
    live_next_bus_hint: "Horários em processo de atualização oficial",
    live_frequency: "Frequência:",

    // Line Card / Details
    line_view_details: "Ver Itinerário e Paradas",
    line_tab_schedule: "Horários",
    line_tab_route: "Itinerário e Paradas",
    line_tab_live: "Status",
    line_tab_map: "Ver no Mapa",
    line_direction_ida: "Ida (Rumo ao Destino)",
    line_direction_vuelta: "Volta (Rumo à Rodoviária/Centro)",
    line_stops_count: "principais paradas",
    line_first_bus: "Primeiro ônibus:",
    line_last_bus: "Último ônibus:",
    line_show_on_map: "Traçar no Mapa",
    line_download_pdf: "Salvar Informação",

    // Trip Planner
    planner_title: "Planejador de Viagens Inteligente",
    planner_subtitle: "Escolha seu ponto de partida e destino para descobrir a combinação de ônibus e paradas ideais.",
    planner_from_label: "Origem",
    planner_to_label: "Destino",
    planner_swap: "Inverter origem e destino",
    planner_btn_find: "Calcular Melhor Rota",
    planner_suggested_route: "Rota Recomendada",
    planner_line_suggested: "Pegar a Linha:",
    planner_estimated_time: "Tempo estimado a pé/trajeto:",
    planner_boarding_at: "Embarque em:",
    planner_dropoff_at: "Desembarque em:",
    planner_estimated_fare: "Tarifa:",
    planner_no_direct: "Para este trajeto, recomendamos pegar o ônibus até a Rodoviária Central e fazer integração.",
    planner_view_map_btn: "Ver rota no mapa",

    // Interactive Map
    map_section_title: "Mapa Interativo e Planejador de Viagens",
    map_section_subtitle: "Explore as rotas traçadas, pontos de parada e calcule seu itinerário de ônibus.",
    map_planner_title: "Planejador de Viagens",
    map_input_origin: "Origem (ou usar Minha Localização)",
    map_input_dest: "Destino (ex. Cataratas, Aeroporto...)",
    map_btn_use_gps: "🧭 Minha Localização",
    map_btn_swap: "Inverter",
    map_btn_calculate: "Calcular Rota",
    map_btn_clear: "Limpar Rota",
    map_btn_filter_line: "Linhas no Mapa",
    map_step_walk: "Caminhar",
    map_step_bus: "Pegar Ônibus",
    map_step_transfer: "Transbordo em",
    map_trip_summary: "Sua Viagem",
    map_stops_count: "paradas",
    map_distance: "Distância calculada",
    map_duration: "Tempo estimado",
    map_fare: "Tarifa",
    map_boarding_at: "Embarque em",
    map_dropoff_at: "Desembarque em",
    map_legend_title: "Linhas no Mapa",
    map_legend_user: "Sua Localização",
    map_legend_origin: "Ponto de Partida",
    map_legend_stop: "Ponto de Ônibus",
    map_legend_dest: "Destino Final",
    map_marker_origin: "Ponto de Partida / Início",
    map_marker_stop: "Ponto de Ônibus Intermediário",
    map_marker_dest: "Destino Final",
    map_btn_my_location: "Minha Localização (GPS)",
    map_btn_center_terminal: "Centralizar em Iguazú",
    map_btn_reset: "Ver Rota Completa",
    map_stop_popup_title: "Ponto Autorizado",
    map_stop_lines_here: "Linhas que passam aqui:",
    map_stop_set_origin: "📍 Sair daqui (Origem)",
    map_stop_set_dest: "🏁 Ir para cá (Destino)",
    map_stop_view_line: "Ver Linha",
    map_schedule_not_available: "Horário: Informação não disponível",
    map_marker_user: "Você está aqui (Localização GPS)",
    map_error_no_route: "Nenhuma rota direta encontrada. Recomendamos consultar as linhas no mapa.",
    map_same_location: "A origem e o destino são o mesmo ponto.",
    map_walking_only: "Seu destino está muito próximo a pé:",
    map_international_border: "Travessia de Fronteira Internacional",
    map_osrm_fallback: "Rota calculada pela rede oficial de paradas",

    // Fares Section
    fares_title: "Tarifas e Meios de Pagamento",
    fares_subtitle: "Informações de tarifas pendentes de confirmação oficial.",
    fare_category_col: "Categoria / Itinerário",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reais (BRL)",
    fare_price_usd_col: "Dólares (USD)",
    fare_validity_col: "Linhas Aplicáveis",

    fare_cataratas: "Serviço Cataratas (Parque Nacional)",
    fare_cataratas_desc: "Ônibus direto ao portal de entrada do Parque Nacional (RN 12)",
    fare_airport: "Serviço Especial Aeroporto (IGR)",
    fare_airport_desc: "Da Rodoviária/Centro até o Aeroporto Internacional",
    fare_international: "Serviço Internacional Foz do Iguaçu (Brasil)",
    fare_international_desc: "Travessia pela Ponte Tancredo Neves até o Terminal TTU em Foz do Iguaçu",
    fare_international_py: "Serviço Internacional Ciudad del Este (Paraguai)",
    fare_international_py_desc: "Direto ao Paraguai via Foz do Iguaçu e Ponte da Amizade até CDE",
    fare_tourist_hito: "Serviço Turístico Marco / 600 Ha",
    fare_tourist_hito_desc: "Acesso ao Marco das Três Fronteiras, Orla e Reserva Selva Yriapú",
    fare_urban_general: "Passagem Urbana Local / Morador",
    fare_urban_general_desc: "Tarifa geral para bairros",
    fare_student_beeg: "Passe Estudantil Gratuito (BEEG)",
    fare_student_beeg_desc: "Para estudantes cadastrados no período letivo",

    // Payment Methods
    pay_methods_title: "Meios de Pagamento",
    pay_pending_title: "Meios de pagamento: Pendente de confirmação oficial",
    pay_pending_desc: "As formas de pagamento aceitas e detalhes de cartões estão pendentes de confirmação oficial.",

    // Points of Sale
    points_title: "Bilheterias e Pontos de Atendimento",
    points_subtitle: "Locais autorizados para consultas e informações.",

    // News & Alerts
    news_title: "Status do Serviço e Avisos",
    news_subtitle: "Informações operacionais e avisos aos passageiros.",
    news_title_1: "Atualização de dados operacionais em andamento",
    news_body_1: "A verificação presencial de tarifas e frequências oficiais está em processo.",
    news_title_2: "Linhas turísticas e urbanas em circulação",
    news_body_2: "Os ônibus operam nos itinerários habituais ligando Rodoviária, Cataratas, Marco e bairros.",
    news_title_3: "Documentação para Travessia Internacional",
    news_body_3: "Lembre-se de portar documento de identidade válido ou Passaporte para o controle aduaneiro.",

    // FAQ
    faq_title: "Perguntas Frequentes",
    faq_subtitle: "Respostas rápidas para as dúvidas mais comuns de visitantes e moradores.",
    faq_search_placeholder: "Pesquisar dúvida (ex: bagagem, Cataratas, Rodoviária)...",
    faq_q1: "Como são pagas as passagens de ônibus?",
    faq_a1: "As formas de pagamento estão pendentes de confirmação oficial. Para informações precisas, consulte o guichê da Rodoviária.",
    faq_q2: "De onde sai o ônibus para as Cataratas?",
    faq_a2: "O ônibus sai da Plataforma 7 da Rodoviária de Puerto Iguazú (Av. Córdoba e Misiones), com paradas na Av. Victoria Aguirre e Ruta 12.",
    faq_q3: "Posso levar malas ou mochilas grandes no ônibus?",
    faq_a3: "Sim, os veículos para o Aeroporto, Cataratas e Rodoviária contam com espaço apropriado para bagagens.",
    faq_q4: "Como funciona a travessia para Foz do Iguaçu (Brasil)?",
    faq_a4: "O ônibus internacional sai da Rodoviária de Puerto Iguazú. Na Aduana Argentina, todos os passageiros descem para realizar a imigração. Guarde seu bilhete.",
    faq_q5: "Onde posso consultar informações oficiais de tarifas?",
    faq_a5: "No Guichê 4 da Río Uruguay na Rodoviária Central (Av. Córdoba e Misiones).",
    faq_q6: "Moradores de Puerto Iguazú têm tarifa diferenciada?",
    faq_a6: "O transporte urbano prevê condições para moradores locais conforme normas vigentes na administração.",

    // Contact & Footer
    contact_title: "Atendimento ao Passageiro",
    contact_subtitle: "Dúvidas sobre itinerários, paradas ou informações? Estamos à disposição.",
    contact_phone: "Telefone da Bilheteria:",
    contact_whatsapp: "WhatsApp de Atendimento:",
    contact_email: "E-mail de Suporte:",
    contact_address: "Bilheteria Principal:",
    contact_hours: "Atendimento todos os dias das 06h00 às 22h30",
    contact_btn_whatsapp: "Conversar no WhatsApp",
    footer_rights: "Todos os direitos reservados. Portal informativo de transporte público para Puerto Iguazú.",
    footer_quick_links: "Links Rápidos"
  },

  fr: {
    // Header & Nav
    nav_home: "Accueil",
    nav_lines: "Lignes & Itinéraires",
    nav_planner: "Planificateur",
    nav_map: "Carte en Direct",
    nav_fares: "Tarifs",
    nav_news: "Avis & Infos",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    status_normal: "Service en Circulation",
    status_alert: "Avis Actifs",
    lang_select_title: "Choisir la langue",

    // Global Data Indicators
    info_not_available: "Information non disponible",
    pending_confirmation: "En attente de confirmation officielle",
    official_data_pending: "Données officielles : en attente de confirmation",
    last_update_label: "Dernière mise à jour :",
    last_update_prefix: "Dernière mise à jour des données :",
    last_update_pending: "en attente de confirmation",
    notice_pending_official: "Informations sur les tarifs et horaires en attente de confirmation officielle.",
    fare_not_available: "Tarif : Information non disponible",
    schedule_not_available: "Horaire : Information non disponible",
    frequency_not_available: "Fréquence : Information non disponible",
    modal_schedules_pending: "Horaires et fréquences en attente de confirmation officielle au guichet.",

    // Hero
    hero_badge: "TRANSPORTS PUBLICS PUERTO IGUAZÚ • RÍO URUGUAY",
    hero_title: "Se déplacer à Iguazú n'a jamais été aussi simple",
    hero_subtitle: "Consultez les itinéraires, arrêts autorisés et planifiez votre trajet vers les Chutes d'Iguazú, la Borne des 3 Frontières, l'Aéroport et tous les quartiers.",
    hero_search_origin: "Où êtes-vous ? (Ex : Gare Routière, Centre)",
    hero_search_dest: "Où allez-vous ? (Ex : Chutes, Aéroport)",
    hero_search_btn: "Trouver l'Itinéraire",
    hero_quick_tags: "Destinations populaires :",
    tag_cataratas: "🌊 Chutes d'Iguazú",
    tag_hito: "📍 Borne des 3 Frontières",
    tag_aeropuerto: "✈️ Aéroport (IGR)",
    tag_hoteles600: "🌿 Forêt Yriapú (600 Ha)",
    tag_foz: "🇧🇷 Foz do Iguaçu (Brésil)",
    tag_cde: "🇵🇾 Ciudad del Este (Paraguay)",

    // Categories / Filters
    cat_all: "Toutes les Lignes",
    cat_tourist: "Touristiques & Chutes",
    cat_urban: "Lignes de Quartier",
    cat_international: "International",

    // Status / Notice
    live_next_bus_title: "État du Service",
    live_next_bus_hint: "Horaires en cours d'actualisation officielle",
    live_frequency: "Fréquence :",

    // Line Card / Details
    line_view_details: "Voir Itinéraire et Arrêts",
    line_tab_schedule: "Horaires",
    line_tab_route: "Itinéraire & Arrêts",
    line_tab_live: "État",
    line_tab_map: "Voir sur la Carte",
    line_direction_ida: "Aller (Vers la Destination)",
    line_direction_vuelta: "Retour (Vers Gare Routière / Centre)",
    line_stops_count: "arrêts principaux",
    line_first_bus: "Premier départ :",
    line_last_bus: "Dernier départ :",
    line_show_on_map: "Tracer sur la Carte",
    line_download_pdf: "Enregistrer l'Information",

    // Trip Planner
    planner_title: "Planificateur de Trajets Intelligent",
    planner_subtitle: "Sélectionnez votre point de départ et d'arrivée pour découvrir la liaison en bus et les arrêts idéaux.",
    planner_from_label: "Point de départ",
    planner_to_label: "Destination",
    planner_swap: "Inverser départ et destination",
    planner_btn_find: "Calculer le Meilleur Trajet",
    planner_suggested_route: "Itinéraire Recommandé",
    planner_line_suggested: "Prendre la Ligne :",
    planner_estimated_time: "Temps estimé à pied/trajet :",
    planner_boarding_at: "Monter à :",
    planner_dropoff_at: "Descendre à :",
    planner_estimated_fare: "Tarif :",
    planner_no_direct: "Pour ce trajet, nous recommandons de prendre le bus jusqu'au Terminal Central puis d'effectuer une correspondance.",
    planner_view_map_btn: "Voir le trajet sur la carte",

    // Interactive Map
    map_section_title: "Carte Interactive & Planificateur de Trajets",
    map_section_subtitle: "Explorez les trajets, arrêts autorisés et calculez votre itinéraire en bus.",
    map_planner_title: "Planificateur de Trajets",
    map_input_origin: "Départ (ou Ma Position)",
    map_input_dest: "Destination (ex : Chutes, Aéroport...)",
    map_btn_use_gps: "🧭 Ma Position",
    map_btn_swap: "Inverser",
    map_btn_calculate: "Calculer l'Itinéraire",
    map_btn_clear: "Effacer l'Itinéraire",
    map_btn_filter_line: "Lignes sur la Carte",
    map_step_walk: "Marcher",
    map_step_bus: "Prendre le Bus",
    map_step_transfer: "Correspondance à",
    map_trip_summary: "Votre Trajet",
    map_stops_count: "arrêts",
    map_distance: "Distance calculée",
    map_duration: "Temps estimatif",
    map_fare: "Tarif",
    map_boarding_at: "Monter à",
    map_dropoff_at: "Descendre à",
    map_legend_title: "Lignes sur la Carte",
    map_legend_user: "Votre Position",
    map_legend_origin: "Point de Départ",
    map_legend_stop: "Arrêt de Bus",
    map_legend_dest: "Destination Finale",
    map_marker_origin: "Point de Départ",
    map_marker_stop: "Arrêt de Bus Intermédiaire",
    map_marker_dest: "Destination Finale",
    map_btn_my_location: "Ma Position (GPS)",
    map_btn_center_terminal: "Centrer sur Iguazú",
    map_btn_reset: "Voir Tout l'Itinéraire",
    map_stop_popup_title: "Arrêt Autorisé",
    map_stop_lines_here: "Lignes desservant cet arrêt :",
    map_stop_set_origin: "📍 Partir d'ici (Départ)",
    map_stop_set_dest: "🏁 Aller ici (Destination)",
    map_stop_view_line: "Voir la Ligne",
    map_schedule_not_available: "Horaire : Information non disponible",
    map_marker_user: "Vous êtes ici (Position GPS)",
    map_error_no_route: "Aucun itinéraire direct trouvé. Nous vous recommandons de consulter les lignes sur la carte.",
    map_same_location: "Le point de départ et la destination sont identiques.",
    map_walking_only: "Votre destination est accessible à pied :",
    map_international_border: "Passage de Frontière International",
    map_osrm_fallback: "Itinéraire calculé sur le réseau officiel d'arrêts",

    // Fares Section
    fares_title: "Tarifs & Moyens de Paiement",
    fares_subtitle: "Informations tarifaires en attente de confirmation officielle.",
    fare_category_col: "Catégorie / Trajet",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reais (BRL)",
    fare_price_usd_col: "Dollars US (USD)",
    fare_validity_col: "Lignes Concernées",

    fare_cataratas: "Ligne Chutes d'Iguazú (Parc National)",
    fare_cataratas_desc: "Bus direct jusqu'à l'entrée du Parc National (RN 12)",
    fare_airport: "Service Spécial Aéroport IGR",
    fare_airport_desc: "De la Gare Routière/Centre vers l'Aéroport International",
    fare_international: "Ligne Internationale Foz do Iguaçu (Brésil)",
    fare_international_desc: "Traversée du Pont Tancredo Neves jusqu'au Terminal TTU à Foz do Iguaçu",
    fare_international_py: "Ligne Internationale Ciudad del Este (Paraguay)",
    fare_international_py_desc: "Liaison vers le Paraguay via Foz do Iguaçu et le Pont de l'Amitié",
    fare_tourist_hito: "Ligne Touristique 3 Frontières / 600 Ha",
    fare_tourist_hito_desc: "Accès à la Borne des Trois Frontières, la Promenade et la Réserve Yriapú",
    fare_urban_general: "Billet Urbain Local / Résident",
    fare_urban_general_desc: "Tarif général des lignes de quartier",
    fare_student_beeg: "Pass Étudiant Gratuit (BEEG)",
    fare_student_beeg_desc: "Pour les étudiants inscrits pendant l'année scolaire",

    // Payment Methods
    pay_methods_title: "Moyens de Paiement",
    pay_pending_title: "Moyens de paiement : En attente de confirmation officielle",
    pay_pending_desc: "Les moyens de paiement acceptés et détails de cartes sont en attente de confirmation officielle.",

    // Points of Sale
    points_title: "Guichets & Points d'Information",
    points_subtitle: "Points d'assistance pour vos questions et informations.",

    // News & Alerts
    news_title: "État du Service & Informations",
    news_subtitle: "Informations d'exploitation et avis aux voyageurs.",
    news_title_1: "Mise à jour des données en cours",
    news_body_1: "La vérification des tarifs et fréquences officielles est en cours auprès de la direction locale.",
    news_title_2: "Lignes touristiques et urbaines en circulation",
    news_body_2: "Les bus circulent sur leurs itinéraires habituels reliant la Gare, les Chutes, la Borne et les quartiers.",
    news_title_3: "Documents obligatoires pour le passage de frontière",
    news_body_3: "Pensez à vous munir d'un passeport ou d'une pièce d'identité pour les contrôles douaniers.",

    // FAQ
    faq_title: "Foire Aux Questions",
    faq_subtitle: "Réponses rapides aux questions fréquentes des voyageurs et résidents.",
    faq_search_placeholder: "Rechercher une question (ex : bagages, Chutes, Gare)...",
    faq_q1: "Comment payer son trajet en bus ?",
    faq_a1: "Les modes de paiement acceptés sont en attente de confirmation officielle. Renseignez-vous directement au guichet du terminal.",
    faq_q2: "D'où part le bus pour les Chutes d'Iguazú ?",
    faq_a2: "Le bus part du Quai 7 de la Gare Routière de Puerto Iguazú (Av. Córdoba et Misiones), avec des arrêts sur l'Av. Victoria Aguirre et la Route 12.",
    faq_q3: "Puis-je voyager avec des valises ou de grands sacs à dos ?",
    faq_a3: "Oui, les bus desservant l'Aéroport (IGR), les Chutes et le Terminal disposent d'espaces dédiés aux bagages.",
    faq_q4: "Comment se déroule le passage de frontière vers Foz do Iguaçu (Brésil) ?",
    faq_a4: "Le bus international part du Terminal de Puerto Iguazú. Au poste frontière argentin, tous les passagers descendent pour les formalités d'immigration. Conservez votre reçu.",
    faq_q5: "Où puis-je consulter les tarifs et horaires officiels ?",
    faq_a5: "Au Guichet 4 de Río Uruguay à la Gare Routière (Av. Córdoba & Misiones) et aux points de service habilités.",
    faq_q6: "Les résidents de Puerto Iguazú bénéficient-ils d'un tarif préférentiel ?",
    faq_a6: "Le transport urbain prévoit des modalités pour les résidents locaux selon les conditions administratives en vigueur.",

    // Contact & Footer
    contact_title: "Service Voyageurs & Assistance",
    contact_subtitle: "Une question sur les trajets, arrêts ou objets trouvés ? Nous sommes à votre écoute.",
    contact_phone: "Téléphone Billetterie :",
    contact_whatsapp: "WhatsApp Assistance :",
    contact_email: "E-mail de Contact :",
    contact_address: "Guichet Principal :",
    contact_hours: "Ouvert tous les jours de 06h00 à 22h30",
    contact_btn_whatsapp: "Discuter sur WhatsApp",
    footer_rights: "Tous droits réservés. Guide d'information des transports publics de Puerto Iguazú.",
    footer_quick_links: "Accès Rapides"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("iguazu_lang") || "es";
  }

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    localStorage.setItem("iguazu_lang", lang);
    this.updateDOM();
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  }

  getText(key) {
    return (TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) ||
           (TRANSLATIONS.es && TRANSLATIONS.es[key]) || key;
  }

  updateDOM() {
    // Actualizar elementos con atributo data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const text = this.getText(key);
      if (text) {
        el.textContent = text;
      }
    });

    // Actualizar placeholders con atributo data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = this.getText(key);
      if (text) {
        el.setAttribute("placeholder", text);
      }
    });

    // Actualizar texto del botón dropdown de idioma en el header
    const currentLangText = document.getElementById("current-lang-text");
    if (currentLangText) {
      currentLangText.textContent = this.currentLang.toUpperCase();
    }

    // Actualizar opciones activas en el menú dropdown
    document.querySelectorAll(".lang-option").forEach(opt => {
      const lang = opt.getAttribute("data-lang");
      if (lang === this.currentLang) {
        opt.classList.add("active");
        opt.setAttribute("aria-selected", "true");
      } else {
        opt.classList.remove("active");
        opt.setAttribute("aria-selected", "false");
      }
    });

    // Actualizar botones de idioma en el drawer móvil
    document.querySelectorAll(".drawer-lang-btn").forEach(btn => {
      const lang = btn.getAttribute("data-lang");
      if (lang === this.currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Compatibilidad con botones legacy .lang-btn
    document.querySelectorAll(".lang-btn").forEach(btn => {
      const lang = btn.getAttribute("data-lang");
      if (lang === this.currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

window.I18n = new I18nManager();
