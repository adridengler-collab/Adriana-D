/**
 * Módulo del Mapa Interactivo - Leaflet.js
 * Visualización moderna, accesible e integrada de transporte
 *
 * Características:
 * - Vista adaptativa centrada en Puerto Iguazú y extensiones internacionales (Brasil / Paraguay)
 * - En la vista general (todas las líneas): las paradas y terminales son puntos de referencia destacados sin la etiqueta "INICIO"
 * - En la vista de línea individual:
 *   🟢 Primera parada de routeIda -> INICIO
 *   🟠 Paradas intermedias -> PARADAS (numeradas 1..N)
 *   🔴 Última parada de routeIda -> DESTINO
 * - Marcador 🔵 de ubicación GPS del usuario con pulso sutil
 * - Trazado de recorridos con doble capa (halo de contraste + color representativo)
 * - Auto-ajuste de encuadre (fitBounds) con márgenes dinámicos según pantalla
 */

class IguazuMap {
  constructor() {
    this.map = null;
    this.allLinesGroup = null;
    this.allStopsGroup = null;
    this.activeRouteGroup = null;
    this.userLayerGroup = null;
    this.userMarker = null;
    this.activeLineFilter = "all";
    this.resizeTimeout = null;
  }

  init() {
    const mapElement = document.getElementById("leaflet-map");
    if (!mapElement || this.map) return;

    // Inicializar mapa
    this.map = L.map("leaflet-map", {
      center: TRANSPORT_DATA.mapConfig.center,
      zoom: TRANSPORT_DATA.mapConfig.zoom,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false
    });

    // Permitir zoom con rueda al interactuar directamente con el mapa
    this.map.on("focus", () => { this.map.scrollWheelZoom.enable(); });
    this.map.on("blur", () => { this.map.scrollWheelZoom.disable(); });

    // Mosaicos CartoDB Voyager: limpios, modernos y con excelente contraste
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(this.map);

    // Inicializar grupos de capas
    this.allLinesGroup = L.layerGroup().addTo(this.map);
    this.allStopsGroup = L.layerGroup().addTo(this.map);
    this.activeRouteGroup = L.layerGroup().addTo(this.map);
    this.userLayerGroup = L.layerGroup().addTo(this.map);

    // Cargar visualización inicial
    this.renderAllLinesOverview();
    this.renderAllStopsOverview();
    this.setupEventListeners();

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  }

  /* ==========================================================================
     CREACIÓN DE MARCADORES LIMPIOS Y CONSISTENTES
     ========================================================================== */

  /**
   * Marcador Azul: Ubicación actual del usuario (GPS)
   */
  createUserIcon() {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-marker-user" title="Tu Ubicación Actual">
          <div class="gmap-user-pulse"></div>
          <div class="gmap-user-dot"></div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -13]
    });
  }

  /**
   * Marcador Verde: Punto de partida / origen del recorrido (Solo en vista de línea individual)
   */
  createOriginIcon(name) {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin gmap-pin-origin" title="${name}">
          <div class="gmap-pin-head">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div class="gmap-pin-badge">INICIO</div>
          <div class="gmap-pin-tip"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 40],
      popupAnchor: [0, -38]
    });
  }

  /**
   * Marcador Naranja: Parada intermedia de colectivo (compacto y numerado)
   */
  createIntermediateStopIcon(name, index) {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin-stop-circle" title="${name}">
          <span class="gmap-stop-icon-box">${index ? index : '<i class="bi bi-bus-front"></i>'}</span>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });
  }

  /**
   * Marcador Rojo: Destino final del recorrido (Solo en vista de línea individual)
   */
  createDestinationIcon(name) {
    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-pin gmap-pin-dest" title="${name}">
          <div class="gmap-pin-head">
            <i class="bi bi-flag-fill"></i>
          </div>
          <div class="gmap-pin-badge">DESTINO</div>
          <div class="gmap-pin-tip"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 40],
      popupAnchor: [0, -38]
    });
  }

  /**
   * Marcador para la Vista General: Punto de parada / terminal destacada (sin etiqueta INICIO)
   */
  createOverviewStopIcon(name, isTerminal, isMajor) {
    if (isTerminal) {
      return L.divIcon({
        className: "gmap-marker-wrapper",
        html: `
          <div class="gmap-hub-stop-marker terminal" title="${name}">
            <i class="bi bi-building"></i>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });
    }

    if (isMajor) {
      return L.divIcon({
        className: "gmap-marker-wrapper",
        html: `
          <div class="gmap-hub-stop-marker major" title="${name}">
            <i class="bi bi-bus-front-fill"></i>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12]
      });
    }

    return L.divIcon({
      className: "gmap-marker-wrapper",
      html: `
        <div class="gmap-stop-overview-dot" title="${name}"></div>
      `,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      popupAnchor: [0, -8]
    });
  }

  /* ==========================================================================
     VISTA GENERAL: TODAS LAS LÍNEAS
     ========================================================================== */

  renderAllLinesOverview() {
    this.allLinesGroup.clearLayers();

    TRANSPORT_DATA.lines.forEach(line => {
      const latlngs = line.routeIda.map(stop => [stop.lat, stop.lng]);

      // Línea base blanca para contraste
      const polylineBg = L.polyline(latlngs, {
        color: "#ffffff",
        weight: 6,
        opacity: 0.8,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round"
      });

      // Línea de color de la línea
      const polyline = L.polyline(latlngs, {
        color: line.badgeColor,
        weight: 3.8,
        opacity: 0.9,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round"
      });

      const tooltipContent = `<b>${line.number}</b>: ${line.name}`;
      polyline.bindTooltip(tooltipContent, {
        sticky: true,
        className: "custom-map-tooltip"
      });

      polyline.on("click", () => {
        this.filterByLine(line.id);
        const lineSelect = document.getElementById("map-line-select");
        if (lineSelect) lineSelect.value = line.id;
      });

      this.allLinesGroup.addLayer(polylineBg);
      this.allLinesGroup.addLayer(polyline);
    });
  }

  renderAllStopsOverview() {
    this.allStopsGroup.clearLayers();

    const stopsMap = new Map();
    TRANSPORT_DATA.lines.forEach(line => {
      line.routeIda.forEach((stop, idx) => {
        const key = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
        if (!stopsMap.has(key)) {
          stopsMap.set(key, {
            name: stop.name,
            lat: stop.lat,
            lng: stop.lng,
            isMajor: stop.isMajor,
            isTerminal: stop.name.toLowerCase().includes("terminal"),
            lines: [line]
          });
        } else {
          const existing = stopsMap.get(key);
          if (!existing.lines.some(l => l.id === line.id)) {
            existing.lines.push(line);
          }
        }
      });
    });

    stopsMap.forEach(stopInfo => {
      // En la vista general, se muestran como paradas destacadas sin etiqueta de INICIO
      const icon = this.createOverviewStopIcon(stopInfo.name, stopInfo.isTerminal, stopInfo.isMajor);
      const marker = L.marker([stopInfo.lat, stopInfo.lng], { icon: icon });

      const lineBadges = stopInfo.lines.map(l =>
        `<span class="map-badge" style="background-color: ${l.badgeColor}">${l.number}</span>`
      ).join(" ");

      const roleBadge = stopInfo.isTerminal
        ? `<span class="popup-type-tag terminal"><i class="bi bi-building"></i> Terminal / Centro de Trasbordo</span>`
        : `<span class="popup-type-tag"><i class="bi bi-geo-alt"></i> Parada de Colectivo</span>`;

      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header-row">
            ${roleBadge}
          </div>
          <h4 class="popup-title">${stopInfo.name}</h4>
          <p class="popup-subtitle">Líneas con parada en este punto:</p>
          <div class="popup-badges">${lineBadges}</div>
          <div class="popup-actions mt-2">
            <button class="popup-btn" onclick="window.IguazuApp.openLineDetail('${stopInfo.lines[0].id}')">
              ${window.I18n.getText("line_view_details")}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.allStopsGroup.addLayer(marker);
    });
  }

  /* ==========================================================================
     FILTRADO Y VISUALIZACIÓN DE LÍNEA SELECCIONADA
     ========================================================================== */

  filterByLine(lineId) {
    this.activeLineFilter = lineId;

    // Limpiar capa de recorrido activo previo
    this.activeRouteGroup.clearLayers();

    if (lineId === "all") {
      // Mostrar todas las líneas y paradas generales
      if (!this.map.hasLayer(this.allLinesGroup)) this.allLinesGroup.addTo(this.map);
      if (!this.map.hasLayer(this.allStopsGroup)) this.allStopsGroup.addTo(this.map);

      // Centrar en Puerto Iguazú
      this.map.setView(TRANSPORT_DATA.mapConfig.center, TRANSPORT_DATA.mapConfig.zoom, { animate: true });
      return;
    }

    // Ocultar capas generales para no solapar marcadores
    if (this.map.hasLayer(this.allLinesGroup)) this.map.removeLayer(this.allLinesGroup);
    if (this.map.hasLayer(this.allStopsGroup)) this.map.removeLayer(this.allStopsGroup);

    // Buscar datos de la línea
    const line = TRANSPORT_DATA.lines.find(l => l.id === lineId);
    if (!line) return;

    const stops = line.routeIda;
    if (!stops || stops.length === 0) return;

    const totalStops = stops.length;
    const latlngs = stops.map(s => [s.lat, s.lng]);

    // 1. Trazar la polilínea del recorrido (Doble trazo)
    const polylineShadow = L.polyline(latlngs, {
      color: "#ffffff",
      weight: 8,
      opacity: 0.9,
      smoothFactor: 1,
      lineCap: "round",
      lineJoin: "round"
    });

    const polylineMain = L.polyline(latlngs, {
      color: line.badgeColor,
      weight: 5,
      opacity: 0.95,
      smoothFactor: 1,
      lineCap: "round",
      lineJoin: "round"
    });

    polylineMain.bindTooltip(`<b>${line.number}</b>: ${line.name}`, { sticky: true });

    this.activeRouteGroup.addLayer(polylineShadow);
    this.activeRouteGroup.addLayer(polylineMain);

    // 2. Colocar los marcadores semánticos en estricto orden de routeIda (origen -> destino)
    stops.forEach((stop, index) => {
      let markerIcon;
      let stopRole = "stop"; // origin | stop | dest

      if (index === 0) {
        // 🟢 Marcador Verde: Punto de partida / origen real de la línea
        markerIcon = this.createOriginIcon(stop.name);
        stopRole = "origin";
      } else if (index === totalStops - 1) {
        // 🔴 Marcador Rojo: Destino final de la línea
        markerIcon = this.createDestinationIcon(stop.name);
        stopRole = "dest";
      } else {
        // 🟠 Marcador Naranja: Paradas intermedias numeradas
        markerIcon = this.createIntermediateStopIcon(stop.name, index + 1);
        stopRole = "stop";
      }

      const marker = L.marker([stop.lat, stop.lng], { icon: markerIcon });

      let roleBadgeHtml = "";
      if (stopRole === "origin") {
        roleBadgeHtml = `<span class="popup-role-badge origin"><i class="bi bi-geo-alt-fill"></i> Punto de Partida</span>`;
      } else if (stopRole === "dest") {
        roleBadgeHtml = `<span class="popup-role-badge dest"><i class="bi bi-flag-fill"></i> Destino Final</span>`;
      } else {
        roleBadgeHtml = `<span class="popup-role-badge stop"><i class="bi bi-bus-front"></i> Parada ${index + 1} de ${totalStops}</span>`;
      }

      const popupHtml = `
        <div class="map-popup-card">
          <div class="popup-header-row">
            ${roleBadgeHtml}
          </div>
          <h4 class="popup-title">${stop.name}</h4>
          <p class="popup-line-info">
            <span class="map-badge" style="background-color: ${line.badgeColor}">${line.number}</span>
            <small>${line.name}</small>
          </p>
          <div class="popup-actions mt-2">
            <button class="popup-btn" onclick="window.IguazuApp.openLineDetail('${line.id}')">
              ${window.I18n.getText("line_view_details")}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      this.activeRouteGroup.addLayer(marker);
    });

    // 3. Ajuste Automático del Mapa (fitBounds)
    const boundsCoords = [...latlngs];
    if (this.userMarker) {
      const userLatLng = this.userMarker.getLatLng();
      boundsCoords.push([userLatLng.lat, userLatLng.lng]);
    }

    const bounds = L.latLngBounds(boundsCoords);
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? [24, 24] : [48, 48];

    this.map.fitBounds(bounds, {
      padding: padding,
      maxZoom: 15,
      animate: true
    });
  }

  /* ==========================================================================
     GEOLOCALIZACIÓN Y CONTROLES
     ========================================================================== */

  centerOnIguazu() {
    if (this.activeLineFilter !== "all") {
      this.filterByLine(this.activeLineFilter);
      return;
    }
    this.map.setView(TRANSPORT_DATA.mapConfig.center, 13.5, { animate: true });
  }

  locateUser() {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }

    const btn = document.getElementById("btn-gps-location");
    if (btn) btn.classList.add("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (btn) btn.classList.remove("loading");
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.userLayerGroup.clearLayers();

        // 🔵 Marcador Azul de Ubicación Actual
        const userIcon = this.createUserIcon();
        this.userMarker = L.marker([lat, lng], {
          icon: userIcon,
          zIndexOffset: 1000
        });

        const userPopup = `
          <div class="map-popup-card user-popup">
            <div class="popup-header-row">
              <span class="popup-role-badge user"><i class="bi bi-person-fill"></i> ${window.I18n.getText("map_marker_user")}</span>
            </div>
            <p style="font-size: 0.85rem; margin-top: 4px; color: var(--text-muted);">
              Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </p>
          </div>
        `;

        this.userMarker.bindPopup(userPopup);
        this.userLayerGroup.addLayer(this.userMarker);
        this.userMarker.openPopup();

        if (this.activeLineFilter !== "all") {
          this.filterByLine(this.activeLineFilter);
        } else {
          this.map.setView([lat, lng], 15, { animate: true });
        }
      },
      (err) => {
        if (btn) btn.classList.remove("loading");
        console.warn("GPS error or permission denied:", err.message);
        alert("No se pudo obtener tu ubicación precisa. Mostrando vista general de Puerto Iguazú.");
        this.centerOnIguazu();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  setupEventListeners() {
    const lineSelect = document.getElementById("map-line-select");
    if (lineSelect) {
      lineSelect.addEventListener("change", (e) => {
        this.filterByLine(e.target.value);
      });
    }

    const btnTerminal = document.getElementById("btn-center-terminal");
    if (btnTerminal) {
      btnTerminal.addEventListener("click", () => this.centerOnIguazu());
    }

    const btnGps = document.getElementById("btn-gps-location");
    if (btnGps) {
      btnGps.addEventListener("click", () => this.locateUser());
    }

    const btnReset = document.getElementById("btn-reset-map");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (lineSelect) lineSelect.value = "all";
        this.filterByLine("all");
      });
    }

    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          if (this.activeLineFilter !== "all") {
            const line = TRANSPORT_DATA.lines.find(l => l.id === this.activeLineFilter);
            if (line && line.routeIda) {
              const bounds = L.latLngBounds(line.routeIda.map(s => [s.lat, s.lng]));
              const isMobile = window.innerWidth <= 768;
              this.map.fitBounds(bounds, { padding: isMobile ? [24, 24] : [48, 48], maxZoom: 15 });
            }
          }
        }
      }, 250);
    });
  }
}

// Instancia global
window.IguazuMap = new IguazuMap();
