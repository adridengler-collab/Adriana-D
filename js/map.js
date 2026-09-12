/**
 * Módulo del Mapa Interactivo y Planificador de Viajes - Leaflet.js
 * Transporte Urbano e Internacional de Puerto Iguazú - Empresa Río Uruguay
 *
 * Características:
 * - Experiencia tipo Google Maps / Moovit adaptada a Puerto Iguazú y conexiones fronterizas (Brasil 🇧🇷 / Paraguay 🇵🇾)
 * - Ruteo con OSRM público seguro con AbortController (timeout 3.5s) y Fallback local automático
 * - Cero errores de API visibles para el usuario
 * - Trazado multi-modal: 🚶 Caminar ➔ 🚌 Colectivo ➔ 🚶 Caminar
 * - Marcadores semánticos:
 *   🔵 Azul: Ubicación actual GPS con halo pulsante
 *   🟢 Verde: Punto de partida / Origen
 *   🟠 Naranja: Paradas autorizadas / Subida y Bajada
 *   🔴 Rojo: Destino final
 *   🟣 Púrpura: Punto de transbordo (Terminal Central)
 * - LOD (Level of Detail): en zoom lejano muestra líneas limpias, en zoom cercano despliega paradas
 * - Popups interactivos con líneas, frecuencias y botones directos de acción
 */

class IguazuMap {
  constructor() {
    this.map = null;
    this.overviewLinesGroup = null;
    this.overviewStopsGroup = null;
    this.activeRouteGroup = null;
    this.activeWalkGroup = null;
    this.userLayerGroup = null;
    this.userMarker = null;
    this.userCoords = null;
    this.activeLineFilter = "all";
    this.currentTripPlan = null;
  }

  init() {
    const mapElement = document.getElementById("leaflet-map");
    if (!mapElement || this.map) return;

    const defaultCenter = (window.TRANSPORT_DATA && window.TRANSPORT_DATA.mapConfig && window.TRANSPORT_DATA.mapConfig.center) || [-25.6030, -54.5680];
    const defaultZoom = (window.TRANSPORT_DATA && window.TRANSPORT_DATA.mapConfig && window.TRANSPORT_DATA.mapConfig.zoom) || 13;

    // Inicializar mapa centrado en Puerto Iguazú
    this.map = L.map("leaflet-map", {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true
    });

    // Mapa base OpenStreetMap estándar (sin API key, gratuito)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxZoom: 19
    }).addTo(this.map);

    // Grupos de capas ordenadas
    this.overviewLinesGroup = L.layerGroup().addTo(this.map);
    this.overviewStopsGroup = L.layerGroup().addTo(this.map);
    this.activeRouteGroup = L.layerGroup().addTo(this.map);
    this.activeWalkGroup = L.layerGroup().addTo(this.map);
    this.userLayerGroup = L.layerGroup().addTo(this.map);

    // Cargar vista general
    this.renderOverview();
    this.setupEventListeners();
    this.setupZoomLOD();
  }

  /* ==========================================================================
     RUTEO OSRM CON ABORTCONTROLLER Y FALLBACK LOCAL RESILIENTE
     ========================================================================== */

  /**
   * Consulta OSRM de forma segura con timeout estricto. Si falla, devuelve null silenciosamente.
   */
  async fetchOSRMRoute(fromCoord, toCoord, profile = "driving") {
    if (!fromCoord || !toCoord) return null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      // OSRM público con formato: lon,lat;lon,lat
      const url = `https://router.project-osrm.org/route/v1/${profile}/${fromCoord[1]},${fromCoord[0]};${toCoord[1]},${toCoord[0]}?overview=full&geometries=geojson`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        // Convertir GeoJSON [lng, lat] a Leaflet [lat, lng]
        return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      }
      return null;
    } catch (e) {
      clearTimeout(timeoutId);
      // Fallback silencioso: no lanzar error visible al usuario
      return null;
    }
  }

  /* ==========================================================================
     ICONOS Y MARCADORES SEMÁNTICOS
     ========================================================================== */

  /** 🔵 Marcador Azul: Ubicación actual GPS con halo pulsante */
  createUserIcon() {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-marker-user" title="Tu Ubicación Actual">
          <div class="gmap-user-pulse"></div>
          <div class="gmap-user-dot"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  }

  /** 🟢 Marcador Verde: Punto de partida / Origen */
  createOriginIcon(name) {
    const label = window.I18n ? window.I18n.getText("map_legend_origin") : "ORIGEN";
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin gmap-pin-origin" title="${name || label}">
          <div class="gmap-pin-head">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div class="gmap-pin-badge">${label}</div>
          <div class="gmap-pin-tip"></div>
        </div>
      `,
      iconSize: [38, 48],
      iconAnchor: [19, 46],
      popupAnchor: [0, -44]
    });
  }

  /** 🔴 Marcador Rojo: Destino final */
  createDestinationIcon(name) {
    const label = window.I18n ? window.I18n.getText("map_legend_dest") : "DESTINO";
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin gmap-pin-dest" title="${name || label}">
          <div class="gmap-pin-head">
            <i class="bi bi-flag-fill"></i>
          </div>
          <div class="gmap-pin-badge">${label}</div>
          <div class="gmap-pin-tip"></div>
        </div>
      `,
      iconSize: [38, 48],
      iconAnchor: [19, 46],
      popupAnchor: [0, -44]
    });
  }

  /** 🟣 Marcador Púrpura: Transbordo */
  createTransferIcon(name) {
    const label = window.I18n ? window.I18n.getText("map_step_transfer") : "TRANSBORDO";
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin gmap-pin-transfer" title="${name || label}">
          <div class="gmap-pin-head">
            <i class="bi bi-shuffle"></i>
          </div>
          <div class="gmap-pin-badge">${label}</div>
          <div class="gmap-pin-tip"></div>
        </div>
      `,
      iconSize: [38, 48],
      iconAnchor: [19, 46],
      popupAnchor: [0, -44]
    });
  }

  /** 🟠 Marcador de Parada de Colectivo (Subida / Bajada) */
  createBoardingDropoffIcon(type, lineBadge, lineNumber) {
    const isBoarding = type === "board";
    const iconClass = isBoarding ? "bi-box-arrow-in-right" : "bi-box-arrow-right";
    const badgeText = isBoarding ? "SUBIR" : "BAJAR";
    const badgeColor = lineBadge || "#ea580c";

    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin-transit-stop ${isBoarding ? 'boarding' : 'dropoff'}" style="--line-color: ${badgeColor}">
          <div class="transit-stop-icon-box">
            <i class="bi ${iconClass}"></i>
          </div>
          <span class="transit-stop-badge">${badgeText} ${lineNumber ? `(${lineNumber})` : ''}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  /** Parada intermedia compacta */
  createIntermediateStopIcon(name, index, color = "#0284c7") {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin-stop-circle" title="${name}" style="--stop-color: ${color}">
          <div class="gmap-stop-icon-box">
            <i class="bi bi-bus-front-fill"></i>
          </div>
          ${index ? `<span class="gmap-stop-num">${index}</span>` : ''}
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -14]
    });
  }

  /* ==========================================================================
     VISTA GENERAL DEL MAPA
     ========================================================================== */

  renderOverview() {
    this.overviewLinesGroup.clearLayers();
    this.overviewStopsGroup.clearLayers();
    this.activeRouteGroup.clearLayers();
    this.activeWalkGroup.clearLayers();

    if (!window.TRANSPORT_DATA || !window.TRANSPORT_DATA.lines) return;

    // 1. Trazar líneas
    window.TRANSPORT_DATA.lines.forEach(line => {
      const latlngs = line.routeIda.map(s => [s.lat, s.lng]);

      const polyBg = L.polyline(latlngs, {
        color: "#ffffff",
        weight: 6,
        opacity: 0.75,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round"
      });

      const poly = L.polyline(latlngs, {
        color: line.badgeColor,
        weight: 4,
        opacity: 0.85,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round"
      });

      poly.bindTooltip(`<b>${line.number}</b>: ${line.name}`, { sticky: true, className: "custom-map-tooltip" });

      poly.on("click", () => {
        this.filterByLine(line.id);
        const mapSelect = document.getElementById("map-line-select");
        if (mapSelect) mapSelect.value = line.id;
      });

      this.overviewLinesGroup.addLayer(polyBg);
      this.overviewLinesGroup.addLayer(poly);
    });

    // 2. Paradas agregadas
    const allStops = window.TripPlanner ? window.TripPlanner.getAllStops() : [];
    allStops.forEach(stopInfo => {
      const icon = stopInfo.isTerminal ? this.createOriginIcon(stopInfo.name) : this.createIntermediateStopIcon(stopInfo.name);
      const marker = L.marker([stopInfo.lat, stopInfo.lng], { icon: icon });

      marker.bindPopup(this.createStopPopupHtml(stopInfo));
      this.overviewStopsGroup.addLayer(marker);
    });
  }

  /**
   * Genera el contenido HTML del popup de una parada con botones de acción rápida
   */
  createStopPopupHtml(stopInfo) {
    const linesBadges = (stopInfo.lines || []).map(l =>
      `<span class="map-badge" style="background-color: ${l.badgeColor}">${l.number}</span>`
    ).join(" ");

    const lang = window.I18n ? window.I18n.currentLang : "es";
    const stopTitle = window.I18n ? window.I18n.getText("map_stop_popup_title") : "Parada Autorizada";
    const linesText = window.I18n ? window.I18n.getText("map_stop_lines_here") : "Líneas que pasan por aquí:";
    const setOriginText = window.I18n ? window.I18n.getText("map_stop_set_origin") : "📍 Salir desde aquí";
    const setDestText = window.I18n ? window.I18n.getText("map_stop_set_dest") : "🏁 Ir hacia aquí";
    const viewLineText = window.I18n ? window.I18n.getText("line_view_details") : "Ver Detalles";
    const scheduleNotice = window.I18n ? window.I18n.getText("map_schedule_not_available") : "Horario no disponible para esta parada intermedia";

    const firstLineId = stopInfo.lines && stopInfo.lines[0] ? stopInfo.lines[0].id : "";
    const escapedName = stopInfo.name.replace(/'/g, "\\'");

    return `
      <div class="map-popup-card">
        <div class="popup-header-row">
          <span class="popup-type-tag"><i class="bi bi-bus-front"></i> ${stopTitle}</span>
        </div>
        <h4 class="popup-title">${stopInfo.name}</h4>
        <p class="popup-subtitle"><strong>${linesText}</strong></p>
        <div class="popup-badges">${linesBadges}</div>
        <p class="popup-schedule-hint"><i class="bi bi-info-circle"></i> <small>${scheduleNotice}</small></p>
        <div class="popup-actions-grid mt-2">
          <button class="popup-btn-action origin" onclick="window.IguazuMap.setStopAsLocation('${escapedName}', 'origin')">
            ${setOriginText}
          </button>
          <button class="popup-btn-action dest" onclick="window.IguazuMap.setStopAsLocation('${escapedName}', 'dest')">
            ${setDestText}
          </button>
        </div>
        ${firstLineId ? `
          <div class="popup-line-link mt-2">
            <button class="popup-btn" onclick="window.IguazuApp.openLineDetail('${firstLineId}')">
              <i class="bi bi-clock-history"></i> ${viewLineText}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  setStopAsLocation(stopName, type) {
    const mapOriginInput = document.getElementById("map-origin-input");
    const mapDestInput = document.getElementById("map-dest-input");
    const planOriginInput = document.getElementById("planner-origin-input");
    const planDestInput = document.getElementById("planner-dest-input");

    if (type === "origin") {
      if (mapOriginInput) mapOriginInput.value = stopName;
      if (planOriginInput) planOriginInput.value = stopName;
      if (mapDestInput && mapDestInput.value) {
        this.calculateAndRenderTrip();
      } else if (mapDestInput) {
        mapDestInput.focus();
      }
    } else {
      if (mapDestInput) mapDestInput.value = stopName;
      if (planDestInput) planDestInput.value = stopName;
      if (!mapOriginInput || !mapOriginInput.value) {
        if (mapOriginInput) mapOriginInput.value = "Terminal de Ómnibus Central";
        if (planOriginInput) planOriginInput.value = "Terminal de Ómnibus Central";
      }
      this.calculateAndRenderTrip();
    }
    this.map.closePopup();
  }

  /* ==========================================================================
     PLANIFICADOR DE VIAJES: RENDERIZACIÓN EN EL MAPA
     ========================================================================== */

  async renderTripPlan(plan) {
    this.currentTripPlan = plan;

    // Limpiar capas previas
    this.activeRouteGroup.clearLayers();
    this.activeWalkGroup.clearLayers();
    if (this.map.hasLayer(this.overviewLinesGroup)) this.map.removeLayer(this.overviewLinesGroup);
    if (this.map.hasLayer(this.overviewStopsGroup)) this.map.removeLayer(this.overviewStopsGroup);

    const boundsPoints = [];

    // 1. Caso: Sólo Caminar (muy cerca)
    if (plan.isWalkingOnly) {
      const origCoord = [plan.origin.lat, plan.origin.lng];
      const destCoord = [plan.dest.lat, plan.dest.lng];

      // Marcador Origen
      const origMarker = L.marker(origCoord, { icon: this.createOriginIcon(plan.origin.name) });
      origMarker.bindPopup(`<b>${plan.origin.name}</b>`);
      this.activeRouteGroup.addLayer(origMarker);

      // Marcador Destino
      const destMarker = L.marker(destCoord, { icon: this.createDestinationIcon(plan.dest.name) });
      destMarker.bindPopup(`<b>${plan.dest.name}</b>`);
      this.activeRouteGroup.addLayer(destMarker);

      // Línea de caminata (OSRM con fallback directo)
      let walkCoords = await this.fetchOSRMRoute(origCoord, destCoord, "foot");
      if (!walkCoords) {
        walkCoords = [origCoord, destCoord];
      }

      const walkPolyline = L.polyline(walkCoords, {
        color: "#0284c7",
        weight: 4.5,
        dashArray: "8, 8",
        opacity: 0.9,
        lineCap: "round"
      });
      this.activeWalkGroup.addLayer(walkPolyline);

      boundsPoints.push(origCoord, destCoord);
      this.fitMapToBounds(boundsPoints);
      this.renderTripSummaryCard(plan);
      return;
    }

    // 2. Caso: Viaje Directo en Colectivo
    if (plan.isDirect) {
      const origCoord = [plan.origin.lat, plan.origin.lng];
      const destCoord = [plan.dest.lat, plan.dest.lng];
      const boardCoord = [plan.boardingStop.lat, plan.boardingStop.lng];
      const dropCoord = [plan.dropoffStop.lat, plan.dropoffStop.lng];

      boundsPoints.push(origCoord, destCoord, boardCoord, dropCoord);

      // Marcador Origen
      const origMarker = L.marker(origCoord, { icon: this.createOriginIcon(plan.origin.name) });
      origMarker.bindPopup(`<b>${plan.origin.name}</b><br><small>Punto de Partida</small>`);
      this.activeRouteGroup.addLayer(origMarker);

      // Tramo 1 a pie: Origen ➔ Parada de Subida
      let walk1Coords = await this.fetchOSRMRoute(origCoord, boardCoord, "foot");
      if (!walk1Coords) walk1Coords = [origCoord, boardCoord];

      const walk1Polyline = L.polyline(walk1Coords, {
        color: "#64748b",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.85
      });
      walk1Polyline.bindTooltip(`🚶 Caminar ${plan.walkStart.distanceKm.toFixed(2)} km (~${plan.walkStart.durationMin} min)`, { sticky: true });
      this.activeWalkGroup.addLayer(walk1Polyline);

      // Parada de Subida
      const boardMarker = L.marker(boardCoord, {
        icon: this.createBoardingDropoffIcon("board", plan.line.badgeColor, plan.line.number)
      });
      boardMarker.bindPopup(`<b>${plan.boardingStop.name}</b><br><span class="map-badge" style="background-color: ${plan.line.badgeColor}">${plan.line.number}</span> Subir al colectivo`);
      this.activeRouteGroup.addLayer(boardMarker);

      // Tramo de Colectivo: Paradas intermedias y trazado
      const transitLatLngs = plan.transitStops.map(s => [s.lat, s.lng]);
      transitLatLngs.forEach(c => boundsPoints.push(c));

      // Línea de fondo blanca para contraste
      const transitBg = L.polyline(transitLatLngs, {
        color: "#ffffff",
        weight: 9,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round"
      });

      // Línea principal con color oficial de la línea
      const transitPoly = L.polyline(transitLatLngs, {
        color: plan.line.badgeColor,
        weight: 5.5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round"
      });

      transitPoly.bindTooltip(`<b>${plan.line.number}</b>: ${plan.line.name} (${plan.stopCount} paradas, ~${plan.transit.durationMin} min)`, { sticky: true });

      this.activeRouteGroup.addLayer(transitBg);
      this.activeRouteGroup.addLayer(transitPoly);

      // Paradas intermedias de este tramo
      plan.transitStops.forEach((stop, idx) => {
        if (idx > 0 && idx < plan.transitStops.length - 1) {
          const stopMarker = L.marker([stop.lat, stop.lng], {
            icon: this.createIntermediateStopIcon(stop.name, idx + 1, plan.line.badgeColor)
          });
          stopMarker.bindPopup(`<b>${stop.name}</b><br><small>Parada ${idx + 1} de ${plan.transitStops.length}</small>`);
          this.activeRouteGroup.addLayer(stopMarker);
        }
      });

      // Parada de Bajada
      const dropMarker = L.marker(dropCoord, {
        icon: this.createBoardingDropoffIcon("drop", plan.line.badgeColor, plan.line.number)
      });
      dropMarker.bindPopup(`<b>${plan.dropoffStop.name}</b><br><span class="map-badge" style="background-color: ${plan.line.badgeColor}">${plan.line.number}</span> Bajar del colectivo`);
      this.activeRouteGroup.addLayer(dropMarker);

      // Tramo 2 a pie: Parada de Bajada ➔ Destino Final
      let walk2Coords = await this.fetchOSRMRoute(dropCoord, destCoord, "foot");
      if (!walk2Coords) walk2Coords = [dropCoord, destCoord];

      const walk2Polyline = L.polyline(walk2Coords, {
        color: "#64748b",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.85
      });
      walk2Polyline.bindTooltip(`🚶 Caminar ${plan.walkEnd.distanceKm.toFixed(2)} km (~${plan.walkEnd.durationMin} min)`, { sticky: true });
      this.activeWalkGroup.addLayer(walk2Polyline);

      // Marcador Destino Final
      const destMarker = L.marker(destCoord, { icon: this.createDestinationIcon(plan.dest.name) });
      destMarker.bindPopup(`<b>${plan.dest.name}</b><br><small>Destino Final</small>`);
      this.activeRouteGroup.addLayer(destMarker);

      this.fitMapToBounds(boundsPoints);
      this.renderTripSummaryCard(plan);
      return;
    }

    // 3. Caso: Viaje con Transbordo en Terminal Central
    if (!plan.isDirect && plan.firstLeg && plan.secondLeg) {
      const origCoord = [plan.origin.lat, plan.origin.lng];
      const destCoord = [plan.dest.lat, plan.dest.lng];
      const termCoord = [plan.transferCoord.lat, plan.transferCoord.lng];

      boundsPoints.push(origCoord, destCoord, termCoord);

      // Origen
      const origMarker = L.marker(origCoord, { icon: this.createOriginIcon(plan.origin.name) });
      this.activeRouteGroup.addLayer(origMarker);

      // Tramo 1
      const leg1Stops = plan.firstLeg.transitStops.map(s => [s.lat, s.lng]);
      leg1Stops.forEach(c => boundsPoints.push(c));

      const leg1Poly = L.polyline(leg1Stops, {
        color: plan.firstLeg.line.badgeColor,
        weight: 5,
        opacity: 0.9
      });
      this.activeRouteGroup.addLayer(leg1Poly);

      // Transbordo
      const transMarker = L.marker(termCoord, { icon: this.createTransferIcon(plan.transferPoint) });
      transMarker.bindPopup(`<b>${plan.transferPoint}</b><br><small>Cambio de colectivo a ${plan.secondLeg.line.name}</small>`);
      this.activeRouteGroup.addLayer(transMarker);

      // Tramo 2
      const leg2Stops = plan.secondLeg.transitStops.map(s => [s.lat, s.lng]);
      leg2Stops.forEach(c => boundsPoints.push(c));

      const leg2Poly = L.polyline(leg2Stops, {
        color: plan.secondLeg.line.badgeColor,
        weight: 5,
        opacity: 0.9
      });
      this.activeRouteGroup.addLayer(leg2Poly);

      // Destino
      const destMarker = L.marker(destCoord, { icon: this.createDestinationIcon(plan.dest.name) });
      this.activeRouteGroup.addLayer(destMarker);

      this.fitMapToBounds(boundsPoints);
      this.renderTripSummaryCard(plan);
    }
  }

  fitMapToBounds(coords) {
    if (this.userMarker) {
      const uLatLng = this.userMarker.getLatLng();
      coords.push([uLatLng.lat, uLatLng.lng]);
    }
    const bounds = L.latLngBounds(coords);
    this.map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true
    });
  }

  /**
   * Renderiza la tarjeta flotante de resumen del viaje sobre el mapa
   */
  renderTripSummaryCard(plan) {
    const container = document.getElementById("map-trip-summary-card");
    if (!container) return;

    container.classList.remove("hidden");
    container.innerHTML = "";

    const lang = window.I18n ? window.I18n.currentLang : "es";
    const tripTitle = window.I18n ? window.I18n.getText("map_trip_summary") : "Tu Viaje";
    const estTimeText = window.I18n ? window.I18n.getText("map_duration") : "Tiempo estimado";
    const distText = window.I18n ? window.I18n.getText("map_distance") : "Distancia aprox.";
    const fareText = window.I18n ? window.I18n.getText("map_fare") : "Tarifa";
    const walkText = window.I18n ? window.I18n.getText("map_step_walk") : "Caminar";
    const busText = window.I18n ? window.I18n.getText("map_step_bus") : "Colectivo";
    const stopsCountText = window.I18n ? window.I18n.getText("map_stops_count") : "paradas";

    if (plan.isWalkingOnly) {
      container.innerHTML = `
        <div class="trip-card-header">
          <div class="trip-badge-chip walk"><i class="bi bi-person-walking"></i> ${walkText}</div>
          <button class="btn-close-card" onclick="window.IguazuMap.clearTripRoute()"><i class="bi bi-x-lg"></i></button>
        </div>
        <h3 class="trip-route-title">${plan.origin.name} ➔ ${plan.dest.name}</h3>
        <p class="trip-meta-info">
          <span><i class="bi bi-clock-fill text-emerald"></i> ${plan.estimatedTime}</span>
          <span><i class="bi bi-signpost-fill text-blue"></i> ${plan.totalDistanceKm.toFixed(2)} km</span>
        </p>
        <p class="trip-walk-hint"><i class="bi bi-info-circle-fill"></i> Tu destino se encuentra a corta distancia a pie.</p>
      `;
      return;
    }

    if (plan.isDirect) {
      container.innerHTML = `
        <div class="trip-card-header" style="background-color: ${plan.line.badgeColor}">
          <div class="trip-line-badge-top">
            <span class="badge-num">${plan.line.number}</span>
            <span class="badge-name">${plan.line.name}</span>
          </div>
          <button class="btn-close-card" onclick="window.IguazuMap.clearTripRoute()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="trip-card-body">
          <div class="trip-stat-grid">
            <div class="stat-pill">
              <small>${estTimeText}</small>
              <strong>${plan.estimatedTime}</strong>
            </div>
            <div class="stat-pill">
              <small>${distText}</small>
              <strong>${plan.totalDistanceKm.toFixed(1)} km</strong>
            </div>
            <div class="stat-pill">
              <small>${fareText}</small>
              <strong style="font-size:0.8rem; color:var(--text-muted);">${window.I18n ? window.I18n.getText("info_not_available") : "No disponible"}</strong>
            </div>
          </div>

          <div class="trip-timeline-steps">
            <div class="timeline-step">
              <div class="step-icon walk"><i class="bi bi-person-walking"></i></div>
              <div class="step-desc">
                <strong>${walkText} ~${plan.walkStart.durationMin} min (${plan.walkStart.distanceKm.toFixed(2)} km)</strong>
                <small>${plan.origin.name} ➔ ${plan.boardingStop.name}</small>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-icon bus" style="background-color: ${plan.line.badgeColor}"><i class="bi bi-bus-front-fill"></i></div>
              <div class="step-desc">
                <strong>${busText}: ${plan.line.number} (${plan.stopCount} ${stopsCountText})</strong>
                <small>Subir en: <b>${plan.boardingStop.name}</b></small>
                <small>Bajar en: <b>${plan.dropoffStop.name}</b></small>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-icon walk"><i class="bi bi-person-walking"></i></div>
              <div class="step-desc">
                <strong>${walkText} ~${plan.walkEnd.durationMin} min (${plan.walkEnd.distanceKm.toFixed(2)} km)</strong>
                <small>${plan.dropoffStop.name} ➔ ${plan.dest.name}</small>
              </div>
            </div>
          </div>

          <div class="trip-card-actions">
            <button class="btn-trip-detail" onclick="window.IguazuApp.openLineDetail('${plan.line.id}')">
              <i class="bi bi-info-circle-fill"></i> ${window.I18n ? window.I18n.getText("line_view_details") : "Ver Detalles"}
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (!plan.isDirect && plan.firstLeg && plan.secondLeg) {
      container.innerHTML = `
        <div class="trip-card-header bg-slate-800">
          <div class="trip-line-badge-top">
            <span class="badge-num">${plan.firstLeg.line.number} ➔ ${plan.secondLeg.line.number}</span>
            <span class="badge-name">Viaje con Transbordo</span>
          </div>
          <button class="btn-close-card" onclick="window.IguazuMap.clearTripRoute()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="trip-card-body">
          <div class="trip-stat-grid">
            <div class="stat-pill">
              <small>${estTimeText}</small>
              <strong>${plan.estimatedTime}</strong>
            </div>
            <div class="stat-pill">
              <small>${distText}</small>
              <strong>${plan.totalDistanceKm.toFixed(1)} km</strong>
            </div>
            <div class="stat-pill">
              <small>${fareText}</small>
              <strong style="font-size:0.8rem; color:var(--text-muted);">${window.I18n ? window.I18n.getText("info_not_available") : "No disponible"}</strong>
            </div>
          </div>

          <div class="trip-timeline-steps">
            <div class="timeline-step">
              <div class="step-icon bus" style="background-color: ${plan.firstLeg.line.badgeColor}"><i class="bi bi-bus-front-fill"></i></div>
              <div class="step-desc">
                <strong>Tramo 1: ${plan.firstLeg.line.number}</strong>
                <small>Subir en: ${plan.firstLeg.boardingStop.name}</small>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-icon transfer"><i class="bi bi-shuffle"></i></div>
              <div class="step-desc">
                <strong>Transbordo en ${plan.transferPoint}</strong>
                <small>Cambiar a ${plan.secondLeg.line.number} (${plan.secondLeg.line.name})</small>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-icon bus" style="background-color: ${plan.secondLeg.line.badgeColor}"><i class="bi bi-bus-front-fill"></i></div>
              <div class="step-desc">
                <strong>Tramo 2: ${plan.secondLeg.line.number}</strong>
                <small>Llegada a: ${plan.dest.name}</small>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /* ==========================================================================
     FILTRO POR LÍNEA INDIVIDUAL
     ========================================================================== */

  filterByLine(lineId) {
    this.activeLineFilter = lineId;
    this.activeRouteGroup.clearLayers();
    this.activeWalkGroup.clearLayers();
    this.hideTripSummaryCard();

    if (lineId === "all") {
      this.renderOverview();
      this.centerOnIguazu();
      return;
    }

    if (this.map.hasLayer(this.overviewLinesGroup)) this.map.removeLayer(this.overviewLinesGroup);
    if (this.map.hasLayer(this.overviewStopsGroup)) this.map.removeLayer(this.overviewStopsGroup);

    const line = window.TRANSPORT_DATA.lines.find(l => l.id === lineId);
    if (!line) return;

    const stops = line.routeIda;
    if (!stops || stops.length === 0) return;

    const totalStops = stops.length;
    const latlngs = stops.map(s => [s.lat, s.lng]);

    // Trazado doble
    const polyBg = L.polyline(latlngs, {
      color: "#ffffff",
      weight: 9,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round"
    });

    const polyMain = L.polyline(latlngs, {
      color: line.badgeColor,
      weight: 5.5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round"
    });

    polyMain.bindTooltip(`<b>${line.number}</b>: ${line.name}`, { sticky: true });

    this.activeRouteGroup.addLayer(polyBg);
    this.activeRouteGroup.addLayer(polyMain);

    // Marcadores
    stops.forEach((stop, index) => {
      let icon;
      if (index === 0) {
        icon = this.createOriginIcon(stop.name);
      } else if (index === totalStops - 1) {
        icon = this.createDestinationIcon(stop.name);
      } else {
        icon = this.createIntermediateStopIcon(stop.name, index + 1, line.badgeColor);
      }

      const marker = L.marker([stop.lat, stop.lng], { icon: icon });
      marker.bindPopup(this.createStopPopupHtml({ name: stop.name, lines: [line] }));
      this.activeRouteGroup.addLayer(marker);
    });

    this.fitMapToBounds(latlngs);
  }

  /* ==========================================================================
     GEOLOCALIZACIÓN Y CONTROLES
     ========================================================================== */

  centerOnIguazu() {
    if (this.activeLineFilter !== "all") {
      this.filterByLine(this.activeLineFilter);
      return;
    }
    const center = (window.TRANSPORT_DATA && window.TRANSPORT_DATA.mapConfig && window.TRANSPORT_DATA.mapConfig.center) || [-25.6030, -54.5680];
    this.map.setView(center, 13.5, { animate: true });
  }

  locateUser(callback) {
    if (!navigator.geolocation) {
      alert("La geolocalización no está disponible en tu navegador.");
      return;
    }

    const btn = document.getElementById("btn-gps-location");
    const mapGpsBtn = document.getElementById("map-btn-gps-origin");
    if (btn) btn.classList.add("loading");
    if (mapGpsBtn) mapGpsBtn.classList.add("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (btn) btn.classList.remove("loading");
        if (mapGpsBtn) mapGpsBtn.classList.remove("loading");

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.userCoords = { lat, lng };

        this.userLayerGroup.clearLayers();

        const userIcon = this.createUserIcon();
        this.userMarker = L.marker([lat, lng], {
          icon: userIcon,
          zIndexOffset: 1000
        });

        const userPopupHtml = `
          <div class="map-popup-card user-popup">
            <div class="popup-header-row">
              <span class="popup-role-badge user"><i class="bi bi-person-fill"></i> ${window.I18n ? window.I18n.getText("map_marker_user") : "Tu Ubicación GPS"}</span>
            </div>
            <p style="font-size: 0.85rem; margin-top: 4px; color: var(--text-muted);">
              GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </p>
            <div class="mt-2">
              <button class="popup-btn-action origin" onclick="window.IguazuMap.setGpsAsOrigin()">
                <i class="bi bi-geo-alt-fill"></i> Usar como Punto de Partida
              </button>
            </div>
          </div>
        `;

        this.userMarker.bindPopup(userPopupHtml);
        this.userLayerGroup.addLayer(this.userMarker);

        if (typeof callback === "function") {
          callback(this.userCoords);
        } else {
          this.map.setView([lat, lng], 15, { animate: true });
        }
      },
      (err) => {
        if (btn) btn.classList.remove("loading");
        if (mapGpsBtn) mapGpsBtn.classList.remove("loading");
        console.warn("GPS timeout or permission denied:", err.message);
        alert("No se pudo obtener tu ubicación precisa. Mostrando vista de Puerto Iguazú.");
        this.centerOnIguazu();
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
    );
  }

  setGpsAsOrigin() {
    this.locateUser((coords) => {
      const mapOriginInput = document.getElementById("map-origin-input");
      const planOriginInput = document.getElementById("planner-origin-input");
      const gpsLabel = window.I18n ? window.I18n.getText("map_legend_user") : "Mi Ubicación Actual (GPS)";

      if (mapOriginInput) mapOriginInput.value = gpsLabel;
      if (planOriginInput) planOriginInput.value = gpsLabel;

      const mapDestInput = document.getElementById("map-dest-input");
      if (mapDestInput && mapDestInput.value) {
        this.calculateAndRenderTrip();
      } else if (mapDestInput) {
        mapDestInput.focus();
      }
    });
  }

  calculateAndRenderTrip() {
    const originInput = document.getElementById("map-origin-input");
    const destInput = document.getElementById("map-dest-input");

    const originVal = originInput ? originInput.value : "";
    const destVal = destInput ? destInput.value : "";

    if (!originVal || !destVal) {
      alert("Por favor ingresa un origen y un destino.");
      return;
    }

    // Sincronizar con el planificador inferior
    const pOrigin = document.getElementById("planner-origin-input");
    const pDest = document.getElementById("planner-dest-input");
    if (pOrigin) pOrigin.value = originVal;
    if (pDest) pDest.value = destVal;

    const plan = window.TripPlanner.planJourney(originVal, destVal);
    if (!plan.success) {
      alert(plan.message || "No se pudo calcular la ruta para los puntos seleccionados.");
      return;
    }

    this.renderTripPlan(plan);
  }

  clearTripRoute() {
    this.activeRouteGroup.clearLayers();
    this.activeWalkGroup.clearLayers();
    this.currentTripPlan = null;
    this.hideTripSummaryCard();

    const mapOriginInput = document.getElementById("map-origin-input");
    const mapDestInput = document.getElementById("map-dest-input");
    if (mapOriginInput) mapOriginInput.value = "";
    if (mapDestInput) mapDestInput.value = "";

    const lineSelect = document.getElementById("map-line-select");
    if (lineSelect) lineSelect.value = "all";

    this.activeLineFilter = "all";
    this.renderOverview();
    this.centerOnIguazu();
  }

  hideTripSummaryCard() {
    const container = document.getElementById("map-trip-summary-card");
    if (container) {
      container.classList.add("hidden");
      container.innerHTML = "";
    }
  }

  setupZoomLOD() {
    this.map.on("zoomend", () => {
      const zoom = this.map.getZoom();
      // Si estamos en vista general y no en un viaje activo
      if (this.activeLineFilter === "all" && !this.currentTripPlan) {
        if (zoom < 13.5) {
          if (this.map.hasLayer(this.overviewStopsGroup)) {
            this.map.removeLayer(this.overviewStopsGroup);
          }
        } else {
          if (!this.map.hasLayer(this.overviewStopsGroup)) {
            this.map.addLayer(this.overviewStopsGroup);
          }
        }
      }
    });
  }

  setupEventListeners() {
    // Selector de Líneas
    const lineSelect = document.getElementById("map-line-select");
    if (lineSelect) {
      lineSelect.addEventListener("change", (e) => {
        this.filterByLine(e.target.value);
      });
    }

    // Botón GPS
    const btnGps = document.getElementById("btn-gps-location");
    if (btnGps) {
      btnGps.addEventListener("click", () => this.locateUser());
    }

    const btnGpsOrigin = document.getElementById("map-btn-gps-origin");
    if (btnGpsOrigin) {
      btnGpsOrigin.addEventListener("click", () => this.setGpsAsOrigin());
    }

    // Botón Centrar
    const btnTerminal = document.getElementById("btn-center-terminal");
    if (btnTerminal) {
      btnTerminal.addEventListener("click", () => this.centerOnIguazu());
    }

    // Botón Reset
    const btnReset = document.getElementById("btn-reset-map");
    if (btnReset) {
      btnReset.addEventListener("click", () => this.clearTripRoute());
    }

    // Botón Calcular en panel flotante
    const btnMapCalc = document.getElementById("map-btn-calculate-trip");
    if (btnMapCalc) {
      btnMapCalc.addEventListener("click", () => this.calculateAndRenderTrip());
    }

    // Botón Invertir en panel flotante
    const btnMapSwap = document.getElementById("map-btn-swap");
    if (btnMapSwap) {
      btnMapSwap.addEventListener("click", () => {
        const originInput = document.getElementById("map-origin-input");
        const destInput = document.getElementById("map-dest-input");
        if (originInput && destInput) {
          const temp = originInput.value;
          originInput.value = destInput.value;
          destInput.value = temp;
          if (originInput.value && destInput.value) {
            this.calculateAndRenderTrip();
          }
        }
      });
    }

    // Botón Limpiar Ruta
    const btnMapClear = document.getElementById("map-btn-clear-trip");
    if (btnMapClear) {
      btnMapClear.addEventListener("click", () => this.clearTripRoute());
    }
  }
}

// Instancia global
window.IguazuMap = new IguazuMap();
