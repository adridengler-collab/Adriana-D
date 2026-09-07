/**
 * Sistema de Traducción Multilingüe (i18n)
 * Idiomas: Español (ES), English (EN), Português (PT)
 */

const TRANSLATIONS = {
  es: {
    // Header & Nav
    nav_home: "Inicio",
    nav_lines: "Líneas y Horarios",
    nav_planner: "Planificador",
    nav_map: "Mapa en Vivo",
    nav_fares: "Tarifas",
    nav_news: "Avisos",
    nav_faq: "Preguntas Frecuentes",
    nav_contact: "Contacto",
    status_normal: "Servicio Normal",
    status_alert: "Avisos Activos",

    // Hero
    hero_badge: "TRANSPORTE PÚBLICO PUERTO IGUAZÚ • RÍO URUGUAY",
    hero_title: "Moverte por Iguazú nunca fue tan fácil",
    hero_subtitle: "Consulta en tiempo real recorridos, frecuencias, tarifas y planifica tu viaje a Cataratas, Hito Tres Fronteras, Aeropuerto y todos los barrios.",
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

    // Next Bus Live Simulator
    live_next_bus_title: "Próximo Colectivo en Vivo",
    live_next_bus_hint: "Estimación en base a hora local y frecuencias programadas",
    live_in: "Sale en:",
    live_mins: "minutos",
    live_now: "¡Saliendo ahora de cabecera!",
    live_upcoming: "Próximas salidas:",
    live_frequency: "Frecuencia estimada:",
    live_service_finished: "Servicio finalizado por hoy. Reinicia a las:",

    // Line Card / Details
    line_view_details: "Ver Horarios y Recorrido",
    line_tab_schedule: "Horarios Fijos",
    line_tab_route: "Recorrido y Paradas",
    line_tab_live: "En Vivo",
    line_tab_map: "Ver en Mapa",
    line_direction_ida: "Ida (Hacia Destino)",
    line_direction_vuelta: "Vuelta (Hacia Terminal/Centro)",
    line_stops_count: "paradas principales",
    line_first_bus: "Primer servicio:",
    line_last_bus: "Último servicio:",
    line_day_weekdays: "Lunes a Viernes",
    line_day_saturday: "Sábados",
    line_day_sunday: "Domingos y Feriados",
    line_show_on_map: "Trazar en Mapa",
    line_download_pdf: "Guardar Horario",

    // Trip Planner
    planner_title: "Planificador de Viajes Inteligente",
    planner_subtitle: "Selecciona tu punto de partida y destino para conocer la mejor combinación de colectivos.",
    planner_from_label: "Origen",
    planner_to_label: "Destino",
    planner_swap: "Invertir origen y destino",
    planner_btn_find: "Calcular Mejor Ruta",
    planner_suggested_route: "Ruta Recomendada",
    planner_line_suggested: "Tomar Línea:",
    planner_estimated_time: "Tiempo estimado de viaje:",
    planner_boarding_at: "Subir en:",
    planner_dropoff_at: "Bajar en:",
    planner_estimated_fare: "Tarifa aproximada:",
    planner_no_direct: "Para este trayecto, recomendamos tomar la línea hasta la Terminal de Ómnibus y realizar transbordo.",
    planner_view_map_btn: "Ver recorrido en el mapa",

    // Interactive Map
    map_section_title: "Mapa Interactivo de Recorridos y Paradas",
    map_section_subtitle: "Explora las rutas trazadas, paradas autorizadas y localiza tu posición actual en Puerto Iguazú.",
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
    map_stop_popup_title: "Parada:",
    map_stop_lines_here: "Líneas que pasan por aquí:",
    map_marker_user: "Estás aquí (Tu Ubicación GPS)",

    // Fares Section
    fares_title: "Tarifas Actualizadas y Medios de Pago",
    fares_subtitle: "Precios oficiales del transporte urbano y formas de abono para residentes y visitantes.",
    fare_category_col: "Categoría / Recorrido",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reales (BRL)",
    fare_price_usd_col: "Dólares (USD)",
    fare_validity_col: "Líneas Aplicables",

    fare_cataratas: "Servicio Cataratas (Parque Nacional)",
    fare_cataratas_desc: "Boleto turista directo al Portal de acceso a Cataratas (RN 12)",
    fare_airport: "Servicio Especial Aeropuerto IGR",
    fare_airport_desc: "Desde Terminal/Centro hasta el Aeropuerto Internacional Mayor Carlos Krause",
    fare_international: "Servicio Internacional Foz do Iguaçu (Brasil)",
    fare_international_desc: "Cruce Puente Tancredo Neves hasta Terminal TTU Foz do Iguaçu (Brasil)",
    fare_international_py: "Servicio Internacional Ciudad del Este (Paraguay)",
    fare_international_py_desc: "Directo a Paraguay vía Foz do Iguaçu y Puente de la Amistad hasta CDE",
    fare_tourist_hito: "Servicio Turístico Hito / 600 Ha",
    fare_tourist_hito_desc: "Acceso a Hito Tres Fronteras, Costanera y Reserva Selva Yriapú",
    fare_urban_general: "Boleto Urbano Local / Residente",
    fare_urban_general_desc: "Tarifa general barrial (con DNI / tarjeta local)",
    fare_student_beeg: "Boleto Estudiantil Gratuito (BEEG)",
    fare_student_beeg_desc: "Gratis para estudiantes de Misiones registrados en el ciclo lectivo",

    // Payment Methods
    pay_methods_title: "Formas de Pago Aceptadas",
    pay_cash_title: "Efectivo a Bordo",
    pay_cash_desc: "Aceptamos Pesos Argentinos (ARS), Reales Brasileños (BRL) y Dólares (USD) según tipo de cambio oficial de boletería.",
    pay_card_title: "Tarjeta Río Uruguay / Local",
    pay_card_desc: "Tarjeta magnética recargable con descuento para residentes locales. Se adquiere en boletería central.",
    pay_qr_title: "QR y Billeteras Virtuales",
    pay_qr_desc: "Cobro disponible con MercadoPago, MODO y transferencias en boleterías de Terminal y Parque.",
    pay_sube_title: "Tarjeta SUBE / SUBE Misionera",
    pay_sube_desc: "Válida en unidades urbanas equipadas con validador nacional o provincial.",

    // Points of Sale
    points_title: "Puntos de Venta y Recarga",
    points_subtitle: "Lugares habilitados para adquirir boletos y recargar tu saldo.",

    // News & Alerts
    news_title: "Estado del Servicio y Avisos",
    news_subtitle: "Información operativa en tiempo real, desvíos temporales y refuerzos de temporada.",
    news_title_1: "Refuerzo de frecuencias a Cataratas por Temporada Alta",
    news_body_1: "Se suman unidades adicionales cada 15 minutos entre las 08:00 y 11:30 hs desde la Terminal de Ómnibus.",
    news_title_2: "Horarios especiales para fines de semana largos y feriados",
    news_body_2: "Las líneas turísticas a Cataratas y Hito funcionarán con frecuencia de día hábil durante todo el fin de semana.",
    news_title_3: "Documentación obligatoria para la Línea Internacional a Foz",
    news_body_3: "Recuerde portar DNI o Pasaporte vigente y realizar el trámite migratorio en las cabeceras de ambos países.",

    // FAQ
    faq_title: "Preguntas Frecuentes",
    faq_subtitle: "Respuestas rápidas a las consultas más habituales de usuarios y turistas.",
    faq_search_placeholder: "Buscar una pregunta (ej: equipaje, SUBE, Parque)...",
    faq_q1: "¿Se puede pagar con dinero en efectivo arriba del colectivo?",
    faq_a1: "Sí, los choferes y boleteros de la línea Cataratas, Aeropuerto e Internacional aceptan efectivo en Pesos Argentinos (ARS), Reales (BRL) y Dólares (USD). Para las líneas de barrio locales se recomienda tener cambio justo o tarjeta magnética.",
    faq_q2: "¿Dónde sale el colectivo para ir a las Cataratas y con qué frecuencia?",
    faq_a2: "El colectivo a Cataratas sale de la Plataforma 7 de la Terminal de Ómnibus de Puerto Iguazú (Av. Córdoba y Misiones), con paradas sobre Av. Victoria Aguirre y Ruta Nacional 12. Pasa cada 20 minutos todos los días.",
    faq_q3: "¿Puedo llevar valijas o mochilas grandes en el colectivo?",
    faq_a3: "Sí, las unidades que van al Aeropuerto (IGR), Cataratas y Terminal cuentan con portaequipajes y espacio para valijas sin costo adicional.",
    faq_q4: "¿Cómo funciona el cruce a Foz do Iguaçu (Brasil) en colectivo?",
    faq_a4: "El colectivo internacional sale de la Terminal de Puerto Iguazú. Al llegar a la Aduana Argentina todos los pasajeros descienden para realizar Migraciones. Si continúa en el mismo bus o debe esperar el siguiente con el mismo boleto, conserve su comprobante de pasaje.",
    faq_q5: "¿Dónde puedo comprar o recargar la tarjeta de transporte?",
    faq_a5: "En la Boletería Local 4 de Río Uruguay en la Terminal de Ómnibus, en el Kiosco Central de Plaza San Martín y en los puntos habilitados en la entrada al Parque Nacional.",
    faq_q6: "¿Los residentes de Puerto Iguazú tienen tarifa diferencial?",
    faq_a6: "Sí, presentando DNI con domicilio en Puerto Iguazú o la tarjeta local de residente, acceden a la tarifa bonificada en todas las líneas urbanas y turísticas.",

    // Contact & Footer
    contact_title: "Atención al Pasajero",
    contact_subtitle: "¿Tienes dudas sobre recorridos, objetos perdidos o reclamos? Estamos para ayudarte.",
    contact_phone: "Teléfono Boletería:",
    contact_whatsapp: "WhatsApp de Consultas:",
    contact_email: "Correo Electrónico:",
    contact_address: "Boletería Principal:",
    contact_hours: "Atención todos los días de 06:00 a 22:30 hs",
    contact_btn_whatsapp: "Chatear por WhatsApp",
    footer_rights: "Todos los derechos reservados. Portal informativo no oficial de transporte público para Puerto Iguazú.",
    footer_quick_links: "Accesos Rápidos"
  },

  en: {
    // Header & Nav
    nav_home: "Home",
    nav_lines: "Lines & Timetables",
    nav_planner: "Trip Planner",
    nav_map: "Live Map",
    nav_fares: "Fares",
    nav_news: "Alerts",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    status_normal: "Normal Service",
    status_alert: "Active Alerts",

    // Hero
    hero_badge: "PUERTO IGUAZÚ PUBLIC TRANSPORT • RÍO URUGUAY",
    hero_title: "Getting around Iguazú has never been easier",
    hero_subtitle: "Check routes, timetables, fares in real time and plan your journey to Iguazu Falls, Three Borders Landmark, Airport, and all city neighborhoods.",
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

    // Next Bus Live Simulator
    live_next_bus_title: "Next Bus Live Status",
    live_next_bus_hint: "Estimated based on local time and scheduled frequencies",
    live_in: "Departs in:",
    live_mins: "minutes",
    live_now: "Departing now from terminal!",
    live_upcoming: "Upcoming departures:",
    live_frequency: "Estimated frequency:",
    live_service_finished: "Service ended for today. Resumes at:",

    // Line Card / Details
    line_view_details: "View Timetable & Route",
    line_tab_schedule: "Fixed Timetable",
    line_tab_route: "Route & Stops",
    line_tab_live: "Live Status",
    line_tab_map: "View on Map",
    line_direction_ida: "Outbound (To Destination)",
    line_direction_vuelta: "Inbound (To Bus Station/Downtown)",
    line_stops_count: "major stops",
    line_first_bus: "First bus:",
    line_last_bus: "Last bus:",
    line_day_weekdays: "Monday to Friday",
    line_day_saturday: "Saturdays",
    line_day_sunday: "Sundays & Holidays",
    line_show_on_map: "Show on Map",
    line_download_pdf: "Save Timetable",

    // Trip Planner
    planner_title: "Smart Trip Planner",
    planner_subtitle: "Choose your starting point and destination to find the best bus route.",
    planner_from_label: "Origin",
    planner_to_label: "Destination",
    planner_swap: "Swap origin and destination",
    planner_btn_find: "Calculate Best Route",
    planner_suggested_route: "Recommended Route",
    planner_line_suggested: "Take Bus Line:",
    planner_estimated_time: "Estimated travel time:",
    planner_boarding_at: "Board at:",
    planner_dropoff_at: "Get off at:",
    planner_estimated_fare: "Approximate fare:",
    planner_no_direct: "For this route, we recommend taking the bus to the Central Bus Station and transferring there.",
    planner_view_map_btn: "View route on map",

    // Interactive Map
    map_section_title: "Interactive Route & Stop Map",
    map_section_subtitle: "Explore traced lines, authorized stops, and find your current GPS position in Puerto Iguazú.",
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
    map_stop_popup_title: "Bus Stop:",
    map_stop_lines_here: "Lines passing here:",
    map_marker_user: "You are here (GPS Location)",

    // Fares Section
    fares_title: "Updated Fares & Payment Methods",
    fares_subtitle: "Official public transport prices and accepted payment options for tourists and residents.",
    fare_category_col: "Category / Route",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reais (BRL)",
    fare_price_usd_col: "US Dollars (USD)",
    fare_validity_col: "Applicable Lines",

    fare_cataratas: "Iguazu Falls (National Park) Service",
    fare_cataratas_desc: "Direct tourist bus to the National Park Falls entrance (RN 12)",
    fare_airport: "IGR Airport Special Service",
    fare_airport_desc: "From Bus Station/Downtown to Cataratas Int. Airport (IGR)",
    fare_international: "International Service to Foz do Iguaçu (Brazil)",
    fare_international_desc: "Across Tancredo Neves Bridge to TTU Urban Terminal in Foz do Iguaçu (Brazil)",
    fare_international_py: "International Service to Ciudad del Este (Paraguay)",
    fare_international_py_desc: "Direct bus to Paraguay via Foz do Iguaçu and Friendship Bridge to CDE",
    fare_tourist_hito: "Tourist Service Three Borders / 600 Ha",
    fare_tourist_hito_desc: "Access to Three Borders Landmark, River Promenade, and Yriapú Reserve",
    fare_urban_general: "Local Urban / Resident Bus Ticket",
    fare_urban_general_desc: "General local neighborhood fare (with local ID/card)",
    fare_student_beeg: "Free Student Pass (BEEG)",
    fare_student_beeg_desc: "Free for registered Misiones province students during school terms",

    // Payment Methods
    pay_methods_title: "Accepted Payment Methods",
    pay_cash_title: "Cash on Board",
    pay_cash_desc: "We accept Argentine Pesos (ARS), Brazilian Reais (BRL), and US Dollars (USD) according to official ticket booth exchange rates.",
    pay_card_title: "Río Uruguay / Local Smartcard",
    pay_card_desc: "Rechargeable magnetic smartcard with discounts for local residents. Available at Central Bus Station booth.",
    pay_qr_title: "QR & Digital Wallets",
    pay_qr_desc: "Digital payments available via MercadoPago and bank transfers at ticket booths.",
    pay_sube_title: "SUBE Card / SUBE Misionera",
    pay_sube_desc: "Valid on city urban units equipped with national or provincial validators.",

    // Points of Sale
    points_title: "Ticket Offices & Reload Points",
    points_subtitle: "Authorized spots to purchase tickets and reload your transit card.",

    // News & Alerts
    news_title: "Service Status & Notices",
    news_subtitle: "Real-time service updates, temporary detours, and high-season frequency boosts.",
    news_title_1: "Extra bus frequencies to Iguazu Falls for High Season",
    news_body_1: "Additional buses running every 15 minutes between 08:00 AM and 11:30 AM from the Central Bus Station.",
    news_title_2: "Special holiday and long weekend schedules",
    news_body_2: "Tourist routes to the Falls and Three Borders will operate on weekday frequencies throughout the entire long weekend.",
    news_title_3: "Mandatory travel documents for International Bus to Foz",
    news_body_3: "Please remember to carry a valid ID card or Passport and complete immigration customs procedures on both border sides.",

    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Quick answers to the most common questions for visitors and daily commuters.",
    faq_search_placeholder: "Search questions (e.g. luggage, cash, tickets, Falls)...",
    faq_q1: "Can I pay in cash on board the bus?",
    faq_a1: "Yes, bus drivers and ticket agents on the Falls, Airport, and International routes accept cash in Argentine Pesos (ARS), Brazilian Reais (BRL), and US Dollars (USD). For neighborhood buses, exact change or transit card is recommended.",
    faq_q2: "Where does the bus to Iguazu Falls depart and how often does it run?",
    faq_a2: "The bus to Iguazu Falls departs from Platform 7 at the Puerto Iguazú Central Bus Station (Av. Córdoba and Misiones), with pickup stops along Av. Victoria Aguirre and Route 12. It runs every 20 minutes daily.",
    faq_q3: "Can I bring suitcases or large backpacks on the bus?",
    faq_a3: "Yes, the buses serving the Airport (IGR), Falls, and Terminal have luggage racks and dedicated space for suitcases at no extra charge.",
    faq_q4: "How does the international border crossing to Foz do Iguaçu (Brazil) work?",
    faq_a4: "The international bus departs from the Puerto Iguazú Bus Terminal. At Argentine Customs, all passengers get off for passport control. Keep your ticket receipt if continuing onto the same or following bus.",
    faq_q5: "Where can I buy or reload the bus card?",
    faq_a5: "At Río Uruguay Ticket Booth #4 in the Central Bus Terminal, at the Central Kiosk in Plaza San Martín, and at National Park entrance points.",
    faq_q6: "Do Puerto Iguazú residents get discounted fares?",
    faq_a6: "Yes, showing an Argentine DNI with an address in Puerto Iguazú or the resident smartcard grants reduced fares on all urban and tourist routes.",

    // Contact & Footer
    contact_title: "Customer Support & Inquiries",
    contact_subtitle: "Questions about routes, schedules, lost & found, or assistance? We are here to help.",
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
    nav_lines: "Linhas e Horários",
    nav_planner: "Planejador",
    nav_map: "Mapa ao Vivo",
    nav_fares: "Tarifas",
    nav_news: "Avisos",
    nav_faq: "Perguntas Frequentes",
    nav_contact: "Contato",
    status_normal: "Serviço Normal",
    status_alert: "Avisos Ativos",

    // Hero
    hero_badge: "TRANSPORTE PÚBLICO PUERTO IGUAZÚ • RÍO URUGUAY",
    hero_title: "Circular por Puerto Iguazú nunca foi tão fácil",
    hero_subtitle: "Consulte em tempo real rotas, frequências, tarifas e planeje seu passeio às Cataratas, Marco das Três Fronteiras, Aeroporto e bairros.",
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

    // Next Bus Live Simulator
    live_next_bus_title: "Próximo Ônibus ao Vivo",
    live_next_bus_hint: "Estimativa baseada no horário local e frequências programadas",
    live_in: "Sai em:",
    live_mins: "minutos",
    live_now: "Saindo agora do ponto inicial!",
    live_upcoming: "Próximas saídas:",
    live_frequency: "Frequência estimada:",
    live_service_finished: "Serviço encerrado hoje. Reinicia às:",

    // Line Card / Details
    line_view_details: "Ver Horários e Itinerário",
    line_tab_schedule: "Horários Fixos",
    line_tab_route: "Itinerário e Paradas",
    line_tab_live: "Ao Vivo",
    line_tab_map: "Ver no Mapa",
    line_direction_ida: "Ida (Rumo ao Destino)",
    line_direction_vuelta: "Volta (Rumo à Rodoviária/Centro)",
    line_stops_count: "principais paradas",
    line_first_bus: "Primeiro ônibus:",
    line_last_bus: "Último ônibus:",
    line_day_weekdays: "Segunda a Sexta",
    line_day_saturday: "Sábados",
    line_day_sunday: "Domingos e Feriados",
    line_show_on_map: "Traçar no Mapa",
    line_download_pdf: "Salvar Horário",

    // Trip Planner
    planner_title: "Planejador de Viagens Inteligente",
    planner_subtitle: "Escolha seu ponto de partida e destino para descobrir a melhor rota de ônibus.",
    planner_from_label: "Origem",
    planner_to_label: "Destino",
    planner_swap: "Inverter origem e destino",
    planner_btn_find: "Calcular Melhor Rota",
    planner_suggested_route: "Rota Recomendada",
    planner_line_suggested: "Pegar a Linha:",
    planner_estimated_time: "Tempo estimado de viagem:",
    planner_boarding_at: "Embarque em:",
    planner_dropoff_at: "Desembarque em:",
    planner_estimated_fare: "Tarifa aproximada:",
    planner_no_direct: "Para este trajeto, recomendamos pegar o ônibus até a Rodoviária Central e fazer integração.",
    planner_view_map_btn: "Ver rota no mapa",

    // Interactive Map
    map_section_title: "Mapa Interativo de Rotas e Paradas",
    map_section_subtitle: "Explore os itinerários traçados, pontos de parada e localize sua posição GPS em Puerto Iguazú.",
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
    map_stop_popup_title: "Ponto de Ônibus:",
    map_stop_lines_here: "Linhas que passam aqui:",
    map_marker_user: "Você está aqui (Localização GPS)",

    // Fares Section
    fares_title: "Tarifas Atualizadas e Formas de Pagamento",
    fares_subtitle: "Precios oficiales do transporte urbano e opções de pagamento para moradores e turistas.",
    fare_category_col: "Categoria / Itinerário",
    fare_price_ars_col: "Pesos (ARS)",
    fare_price_brl_col: "Reais (BRL)",
    fare_price_usd_col: "Dólares (USD)",
    fare_validity_col: "Linhas Aplicáveis",

    fare_cataratas: "Serviço Cataratas (Parque Nacional)",
    fare_cataratas_desc: "Ônibus direto ao portal de entrada do Parque Nacional do Iguaçu (RN 12)",
    fare_airport: "Serviço Especial Aeroporto (IGR)",
    fare_airport_desc: "Da Rodoviária/Centro até o Aeroporto Internacional Cataratas",
    fare_international: "Serviço Internacional Foz do Iguaçu (Brasil)",
    fare_international_desc: "Travessia pela Ponte Tancredo Neves até o Terminal TTU em Foz do Iguaçu (Brasil)",
    fare_international_py: "Serviço Internacional Ciudad del Este (Paraguai)",
    fare_international_py_desc: "Direto ao Paraguai via Foz do Iguaçu e Ponte da Amizade até CDE",
    fare_tourist_hito: "Serviço Turístico Marco / 600 Ha",
    fare_tourist_hito_desc: "Acesso ao Marco das Três Fronteiras, Orla e Reserva Selva Yriapú",
    fare_urban_general: "Passagem Urbana Local / Morador",
    fare_urban_general_desc: "Tarifa geral para bairros locais (com RG / cartão local)",
    fare_student_beeg: "Passe Estudantil Gratuito (BEEG)",
    fare_student_beeg_desc: "Gratuito para estudantes cadastrados em Misiones",

    // Payment Methods
    pay_methods_title: "Formas de Pagamento Aceitas",
    pay_cash_title: "Dinheiro a Bordo",
    pay_cash_desc: "Aceitamos Pesos Argentinos (ARS), Reais Brasileiros (BRL) e Dólares (USD) pela cotação oficial da bilheteria.",
    pay_card_title: "Cartão Río Uruguay / Local",
    pay_card_desc: "Cartão magnético recarregável com desconto para moradores. À venda na bilheteria central.",
    pay_qr_title: "QR Code e Carteiras Digitais",
    pay_qr_desc: "Pagamento via MercadoPago e transferências bancárias nos guichês da Rodoviária e Parque.",
    pay_sube_title: "Cartão SUBE / SUBE Misionera",
    pay_sube_desc: "Válido em veículos urbanos equipados com validador oficial.",

    // Points of Sale
    points_title: "Pontos de Venda e Recarga",
    points_subtitle: "Locais autorizados para comprar passagens e recarregar seu saldo.",

    // News & Alerts
    news_title: "Status do Serviço e Avisos",
    news_subtitle: "Informações em tempo real, desvios e reforços de alta temporada.",
    news_title_1: "Reforço de ônibus para as Cataratas na Alta Temporada",
    news_body_1: "Veículos adicionais a cada 15 minutos entre 08h00 e 11h30 saindo da Rodoviária Central.",
    news_title_2: "Horários especiais para feriados prolongados",
    news_body_2: "Linhas turísticas para as Cataratas e Marco operarão com frequência de dia útil.",
    news_title_3: "Documentação obrigatória para a Linha Internacional Foz",
    news_body_3: "Lembre-se de portar RG (com menos de 10 anos) ou Passaporte válido e realizar a imigração nas aduanas.",

    // FAQ
    faq_title: "Perguntas Frequentes",
    faq_subtitle: "Respostas rápidas para as dúvidas mais comuns de visitantes e moradores.",
    faq_search_placeholder: "Pesquisar dúvida (ex: bagagem, dinheiro, Cataratas)...",
    faq_q1: "Posso pagar em dinheiro dentro do ônibus?",
    faq_a1: "Sim, motoristas e cobradores das linhas Cataratas, Aeroporto e Internacional aceitam dinheiro em Pesos Argentinos (ARS), Reais (BRL) e Dólares (USD).",
    faq_q2: "De onde sai o ônibus para as Cataratas e qual a frequência?",
    faq_a2: "O ônibus sai da Plataforma 7 da Rodoviária de Puerto Iguazú (Av. Córdoba e Misiones), com paradas na Av. Victoria Aguirre e Ruta 12. Passa a cada 20 minutos todos os dias.",
    faq_q3: "Posso levar malas ou mochilas grandes no ônibus?",
    faq_a3: "Sim, os veículos para o Aeroporto, Cataratas e Rodoviária contam com espaço apropriado para bagagens sem custo extra.",
    faq_q4: "Como funciona a travessia para Foz do Iguaçu (Brasil)?",
    faq_a4: "O ônibus internacional sai da Rodoviária de Puerto Iguazú. Na Aduana Argentina, todos os passageiros descem para realizar a imigração. Guarde seu bilhete de passagem para continuar a viagem.",
    faq_q5: "Onde posso comprar ou recarregar o cartão de transporte?",
    faq_a5: "No Guichê 4 da Río Uruguay na Rodoviária, no Quiosque Central da Plaza San Martín e na entrada do Parque Nacional.",
    faq_q6: "Moradores de Puerto Iguazú têm desconto na passagem?",
    faq_a6: "Sim, apresentando documento de identidade com residência em Puerto Iguazú ou o cartão do morador.",

    // Contact & Footer
    contact_title: "Atendimento ao Passageiro",
    contact_subtitle: "Dúvidas sobre itinerários, horários, achados e perdidos? Estamos à disposição.",
    contact_phone: "Telefone da Bilheteria:",
    contact_whatsapp: "WhatsApp de Atendimento:",
    contact_email: "E-mail de Suporte:",
    contact_address: "Bilheteria Principal:",
    contact_hours: "Atendimento todos os dias das 06h00 às 22h30",
    contact_btn_whatsapp: "Conversar no WhatsApp",
    footer_rights: "Todos os direitos reservados. Portal informativo de transporte público para Puerto Iguazú.",
    footer_quick_links: "Links Rápidos"
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

    // Actualizar botones de idioma activo
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
