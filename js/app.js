/**
 * Aplicación Principal - Transporte Urbano Puerto Iguazú (Río Uruguay)
 *
 * Gestión de datos: Todas las tarifas, horarios fijos y frecuencias se muestran
 * en estado "Pendiente de confirmación oficial" / "Información no disponible"
 * hasta obtener los datos oficiales de primera mano en la entrevista.
 */

class IguazuTransportApp {
  constructor() {
    this.selectedLine = null;
    this.activeCategory = "all";
    this.activeDayType = "weekday"; // weekday | saturday | sunday
    this.activeDirection = "ida"; // ida | vuelta
  }

  init() {
    // Inicializar traducción
    window.I18n.updateDOM();

    // Renderizar componentes
    this.renderCategoryPills();
    this.renderTouristQuickTags();
    this.renderLinesGrid();
    this.renderFaresTable();
    this.renderPaymentMethods();
    this.renderSalePoints();
    this.renderNews();
    this.renderFaqs();
    this.renderMapSelectOptions();
    this.updateCompanyStatus();
    this.updateDataMeta();

    // Listeners de UI
    this.setupEventListeners();

    // Inicializar mapa cuando el DOM esté listo
    setTimeout(() => {
      if (window.IguazuMap) {
        window.IguazuMap.init();
      }
    }, 200);
  }

  /**
   * Actualiza el indicador centralizado de fecha de actualización de datos
   */
  updateDataMeta() {
    const meta = TRANSPORT_DATA.meta;
    const lang = window.I18n ? window.I18n.currentLang : "es";
    const updateEls = document.querySelectorAll(".data-last-update-display");
    
    let fullLabel = "";
    if (meta.lastUpdated) {
      const prefix = (meta.lastUpdatedPrefix && meta.lastUpdatedPrefix[lang]) || window.I18n.getText("last_update_prefix") || "Última actualización de datos:";
      fullLabel = `${prefix} ${meta.lastUpdated}`;
    } else {
      fullLabel = (meta.pendingStatusText && meta.pendingStatusText[lang]) || window.I18n.getText("official_data_pending") || "Datos oficiales: pendientes de confirmación";
    }

    updateEls.forEach(el => {
      el.textContent = fullLabel;
    });

    const pendingNotices = document.querySelectorAll(".data-pending-notice-display");
    const noticeText = (meta.noticePendingOfficial && meta.noticePendingOfficial[lang]) || window.I18n.getText("notice_pending_official") || "Información de tarifas y horarios pendiente de confirmación oficial.";
    pendingNotices.forEach(el => {
      el.textContent = noticeText;
    });
  }

  updateCompanyStatus() {
    const statusBadge = document.getElementById("header-company-status");
    const statusText = document.getElementById("hero-status-message");
    const company = TRANSPORT_DATA.company;

    if (statusBadge) {
      if (company.operationalStatus === "NORMAL") {
        statusBadge.innerHTML = `<span class="status-indicator-dot dot-green"></span> ${window.I18n.getText("status_normal")}`;
      } else {
        statusBadge.innerHTML = `<span class="status-indicator-dot dot-yellow"></span> ${window.I18n.getText("status_alert")}`;
      }
    }

    if (statusText) {
      const currentLang = window.I18n ? window.I18n.currentLang : "es";
      statusText.textContent = company.statusMessage[currentLang] || company.statusMessage.es;
    }
  }

  renderTouristQuickTags() {
    const container = document.getElementById("hero-quick-tags-container");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.touristSpots.forEach(spot => {
      const tag = document.createElement("button");
      tag.className = "quick-tag-pill";
      tag.innerHTML = `<span>${spot.name}</span>`;
      tag.addEventListener("click", () => {
        const destInput = document.getElementById("planner-dest-input");
        const originInput = document.getElementById("planner-origin-input");
        if (destInput) destInput.value = spot.name;
        if (originInput && !originInput.value) originInput.value = "Terminal de Ómnibus Central";
        this.executeTripPlan();
        
        // Scroll suave hacia la sección del planificador
        const plannerSec = document.getElementById("planificador");
        if (plannerSec) plannerSec.scrollIntoView({ behavior: "smooth" });
      });
      container.appendChild(tag);
    });
  }

  renderCategoryPills() {
    const container = document.getElementById("category-pills-container");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `cat-pill ${cat.id === this.activeCategory ? "active" : ""}`;
      btn.setAttribute("data-cat", cat.id);
      btn.innerHTML = `<i class="bi ${cat.icon}"></i> <span>${window.I18n.getText(cat.labelKey)}</span>`;
      btn.addEventListener("click", () => {
        this.activeCategory = cat.id;
        document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        this.filterLines();
      });
      container.appendChild(btn);
    });
  }

  renderLinesGrid() {
    const container = document.getElementById("lines-grid-container");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.lines.forEach(line => {
      const lang = window.I18n ? window.I18n.currentLang : "es";
      const desc = line.description[lang] || line.description.es;
      const card = document.createElement("div");
      card.className = "line-card";
      card.setAttribute("data-line-id", line.id);
      card.setAttribute("data-type", line.type);

      const freqText = line.frequency && line.frequency.weekday 
        ? line.frequency.weekday 
        : window.I18n.getText("frequency_not_available");

      const firstBusText = line.firstBus ? `${line.firstBus} hs` : window.I18n.getText("pending_confirmation");
      const lastBusText = line.lastBus ? `${line.lastBus} hs` : window.I18n.getText("pending_confirmation");
      const fareText = (line.price && line.price.tourist) 
        ? `$${line.price.tourist.toLocaleString()}` 
        : window.I18n.getText("info_not_available");

      card.innerHTML = `
        <div class="line-card-header" style="border-left: 6px solid ${line.badgeColor}">
          <div class="line-badge" style="background-color: ${line.badgeColor}">
            ${line.number}
          </div>
          <div class="line-title-group">
            <h3 class="line-name">${line.name}</h3>
            <span class="line-frequency"><i class="bi bi-clock-history"></i> ${freqText}</span>
          </div>
        </div>

        <p class="line-desc">${desc}</p>

        <div class="line-notice-pending">
          <i class="bi bi-info-circle text-blue"></i>
          <span>${window.I18n.getText("notice_pending_official")}</span>
        </div>

        <div class="line-meta-grid">
          <div class="meta-item">
            <i class="bi bi-arrow-up-right-circle"></i>
            <div>
              <small>${window.I18n.getText("line_first_bus")}</small>
              <strong>${firstBusText}</strong>
            </div>
          </div>
          <div class="meta-item">
            <i class="bi bi-arrow-down-left-circle"></i>
            <div>
              <small>${window.I18n.getText("line_last_bus")}</small>
              <strong>${lastBusText}</strong>
            </div>
          </div>
          <div class="meta-item">
            <i class="bi bi-signpost-split"></i>
            <div>
              <small>Paradas</small>
              <strong>${line.routeIda.length} puntos</strong>
            </div>
          </div>
          <div class="meta-item">
            <i class="bi bi-tag-fill"></i>
            <div>
              <small>Tarifa</small>
              <strong style="font-size:0.78rem; color: var(--text-muted);">${fareText}</strong>
            </div>
          </div>
        </div>

        <div class="line-card-actions">
          <button class="btn-primary-outline" onclick="window.IguazuApp.openLineDetail('${line.id}')">
            <i class="bi bi-signpost-2"></i> ${window.I18n.getText("line_view_details")}
          </button>
          <button class="btn-icon-map" title="${window.I18n.getText("line_show_on_map")}" onclick="window.IguazuApp.viewLineOnMap('${line.id}')">
            <i class="bi bi-map-fill"></i>
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  filterLines() {
    const searchInput = document.getElementById("search-line-input");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const cards = document.querySelectorAll(".line-card");

    cards.forEach(card => {
      const type = card.getAttribute("data-type");
      const lineId = card.getAttribute("data-line-id");
      const line = TRANSPORT_DATA.lines.find(l => l.id === lineId);
      const matchesCategory = (this.activeCategory === "all" || type === this.activeCategory);
      
      const lineText = `${line.name} ${line.number} ${line.routeIda.map(r=>r.name).join(" ")}`.toLowerCase();
      const matchesQuery = query === "" || lineText.includes(query);

      if (matchesCategory && matchesQuery) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  openLineDetail(lineId) {
    const line = TRANSPORT_DATA.lines.find(l => l.id === lineId);
    if (!line) return;

    this.selectedLine = line;
    const modal = document.getElementById("line-detail-modal");
    const headerTitle = document.getElementById("modal-line-title");
    const badgeEl = document.getElementById("modal-line-badge");
    const descEl = document.getElementById("modal-line-desc");

    const lang = window.I18n ? window.I18n.currentLang : "es";
    if (headerTitle) headerTitle.textContent = line.name;
    if (badgeEl) {
      badgeEl.textContent = line.number;
      badgeEl.style.backgroundColor = line.badgeColor;
    }
    if (descEl) descEl.textContent = line.description[lang] || line.description.es;

    // Renderizar subsecciones del modal
    this.renderModalSchedules();
    this.renderModalRouteStops();
    this.renderModalLive();

    // Mostrar modal
    if (modal) {
      modal.classList.add("active");
      document.body.classList.add("modal-open");
    }
  }

  closeModal() {
    const modal = document.getElementById("line-detail-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  renderModalSchedules() {
    const tableBodyIda = document.getElementById("modal-schedule-ida");
    const tableBodyVuelta = document.getElementById("modal-schedule-vuelta");
    if (!this.selectedLine || !tableBodyIda || !tableBodyVuelta) return;

    const pendingHtml = `
      <div class="modal-pending-box">
        <i class="bi bi-clock-history"></i>
        <p><strong>${window.I18n.getText("modal_schedules_pending")}</strong></p>
        <small class="text-muted">${window.I18n.getText("notice_pending_official")}</small>
      </div>
    `;

    tableBodyIda.innerHTML = pendingHtml;
    tableBodyVuelta.innerHTML = pendingHtml;
  }

  renderModalRouteStops() {
    const listIda = document.getElementById("modal-stops-ida");
    const listVuelta = document.getElementById("modal-stops-vuelta");
    if (!this.selectedLine || !listIda || !listVuelta) return;

    const renderStopsList = (stops) => {
      return stops.map((stop, idx) => `
        <div class="stop-step-item ${stop.isMajor ? 'major-stop' : ''}">
          <div class="step-marker">
            <span class="step-num">${idx + 1}</span>
            <div class="step-line"></div>
          </div>
          <div class="step-details">
            <h4 class="step-name">${stop.name}</h4>
            ${stop.isMajor ? `<span class="badge-major"><i class="bi bi-star-fill"></i> Parada Principal</span>` : ''}
          </div>
        </div>
      `).join("");
    };

    listIda.innerHTML = renderStopsList(this.selectedLine.routeIda);
    listVuelta.innerHTML = renderStopsList(this.selectedLine.routeVuelta);
  }

  renderModalLive() {
    const liveContainer = document.getElementById("modal-live-content");
    if (!this.selectedLine || !liveContainer) return;

    liveContainer.innerHTML = `
      <div class="modal-pending-box" style="padding: 2rem 1rem;">
        <i class="bi bi-info-circle text-blue" style="font-size: 2.2rem; margin-bottom: 0.5rem; display: inline-block;"></i>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${window.I18n.getText("live_next_bus_title")}</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem;">${window.I18n.getText("notice_pending_official")}</p>
      </div>
    `;
  }

  viewLineOnMap(lineId) {
    this.closeModal();
    const mapSection = document.getElementById("mapa");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }

    const lineSelect = document.getElementById("map-line-select");
    if (lineSelect) {
      lineSelect.value = lineId;
    }
    if (window.IguazuMap) {
      window.IguazuMap.filterByLine(lineId);
    }
  }

  renderFaresTable() {
    const tbody = document.getElementById("fares-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    TRANSPORT_DATA.fares.forEach(fare => {
      const tr = document.createElement("tr");
      const title = window.I18n.getText(fare.categoryKey);
      const desc = window.I18n.getText(fare.descriptionKey);
      const validBadges = fare.validFor.map(l => `<span class="badge-mini">${l}</span>`).join(" ");

      const pendingCell = `<span class="pending-cell-text">${window.I18n.getText("info_not_available")}</span>`;

      const formatPrice = val => (val !== null && val !== undefined) ? `<span class="price-value">${val.toLocaleString('en-AR')}</span>` : pendingCell;

      const arsCell = formatPrice(fare.priceARS);
      const brlCell = formatPrice(fare.priceBRL);
      const usdCell = formatPrice(fare.priceUSD);

      // Resident price for Cataratas (requires DNI copy)
      let extraDesc = "";
      if (fare.categoryKey === "fare_cataratas" && fare.residentPriceARS) {
        extraDesc = `<br/><small class="resident-note">(residente, requiere fotocopia del DNI)</small>`;
      }

      tr.innerHTML = `
        <td>
          <strong>${title}</strong>
          <small class="table-subdesc">${desc}${extraDesc}</small>
        </td>
        <td class="price-cell ars">${arsCell}</td>
        <td class="price-cell brl">${brlCell}</td>
        <td class="price-cell usd">${usdCell}</td>
        <td>${validBadges}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderPaymentMethods() {
    const container = document.getElementById("payment-methods-grid");
    if (!container) return;

    container.innerHTML = `
      <div class="payment-card pending-notice-card">
        <div class="payment-icon-box">
          <i class="bi bi-clock-history"></i>
        </div>
        <h4 class="payment-title">${window.I18n.getText("pay_pending_title")}</h4>
        <p class="payment-desc">${window.I18n.getText("pay_pending_desc")}</p>
      </div>
    `;
  }

  renderSalePoints() {
    const container = document.getElementById("sale-points-grid");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.salePoints.forEach(point => {
      const card = document.createElement("div");
      card.className = "sale-point-card";
      card.innerHTML = `
        <div class="point-header">
          <i class="bi bi-geo-alt-fill text-emerald"></i>
          <h4>${point.name}</h4>
        </div>
        <p class="point-address"><i class="bi bi-pin-map"></i> ${point.address}</p>
        <p class="point-hours"><i class="bi bi-clock"></i> ${point.hours}</p>
        <div class="point-service-tag"><i class="bi bi-check-circle-fill"></i> ${point.services}</div>
      `;
      container.appendChild(card);
    });
  }

  renderNews() {
    const container = document.getElementById("news-feed-container");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.news.forEach(item => {
      const card = document.createElement("div");
      card.className = `news-card badge-${item.badgeType}`;
      card.innerHTML = `
        <div class="news-meta">
          <span class="news-badge ${item.badgeType}">${item.badge}</span>
          <span class="news-date"><i class="bi bi-calendar3"></i> ${item.date}</span>
        </div>
        <h4 class="news-title">${window.I18n.getText(item.titleKey)}</h4>
        <p class="news-content">${window.I18n.getText(item.contentKey)}</p>
      `;
      container.appendChild(card);
    });
  }

  renderFaqs() {
    const container = document.getElementById("faq-accordion-container");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.faqs.forEach((faq, index) => {
      const q = window.I18n.getText(faq.qKey);
      const a = window.I18n.getText(faq.aKey);

      const item = document.createElement("div");
      item.className = "faq-item";
      item.setAttribute("data-category", faq.category);
      item.innerHTML = `
        <button class="faq-question-btn" aria-expanded="false">
          <span class="faq-q-text">${q}</span>
          <i class="bi bi-chevron-down faq-icon"></i>
        </button>
        <div class="faq-answer-panel">
          <p class="faq-a-text">${a}</p>
        </div>
      `;

      item.querySelector(".faq-question-btn").addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });

      container.appendChild(item);
    });
  }

  renderMapSelectOptions() {
    const select = document.getElementById("map-line-select");
    if (!select) return;

    select.innerHTML = `<option value="all">${window.I18n.getText("cat_all")}</option>`;
    TRANSPORT_DATA.lines.forEach(l => {
      const opt = document.createElement("option");
      opt.value = l.id;
      opt.textContent = `${l.number} - ${l.name}`;
      select.appendChild(opt);
    });
  }

  executeTripPlan() {
    const originInput = document.getElementById("planner-origin-input");
    const destInput = document.getElementById("planner-dest-input");
    const resultsContainer = document.getElementById("planner-results-container");

    if (!originInput || !destInput || !resultsContainer) return;

    const origin = originInput.value;
    const dest = destInput.value;

    // Sincronizar inputs del mapa
    const mapOrigin = document.getElementById("map-origin-input");
    const mapDest = document.getElementById("map-dest-input");
    if (mapOrigin) mapOrigin.value = origin;
    if (mapDest) mapDest.value = dest;

    if (!origin || !dest) {
      resultsContainer.innerHTML = `
        <div class="planner-card error">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <p>Por favor ingresa tanto el punto de origen como el de destino.</p>
        </div>
      `;
      return;
    }

    const plan = window.TripPlanner.planJourney(origin, dest);

    if (!plan.success) {
      const msg = window.I18n ? window.I18n.getText(plan.messageKey || "map_error_no_route") : (plan.message || "No se encontró una ruta.");
      resultsContainer.innerHTML = `
        <div class="planner-card not-found">
          <i class="bi bi-search"></i>
          <h4>No se encontró una conexión directa</h4>
          <p>${msg}</p>
        </div>
      `;
      return;
    }

    // Trazar en el mapa Leaflet
    if (window.IguazuMap) {
      window.IguazuMap.renderTripPlan(plan);
    }

    const walkText = window.I18n ? window.I18n.getText("map_step_walk") : "Caminar";
    const busText = window.I18n ? window.I18n.getText("map_step_bus") : "Colectivo";
    const stopsText = window.I18n ? window.I18n.getText("map_stops_count") : "paradas";
    const infoNotAvailable = window.I18n ? window.I18n.getText("info_not_available") : "Información no disponible";

    if (plan.isWalkingOnly) {
      resultsContainer.innerHTML = `
        <div class="planner-result-card animate-fade-in">
          <div class="result-header bg-slate-800">
            <span class="result-badge"><i class="bi bi-person-walking"></i> ${walkText}</span>
            <h3>${plan.origin.name} ➔ ${plan.dest.name}</h3>
          </div>
          <div class="result-body">
            <div class="result-stat-row">
              <div class="stat-box">
                <i class="bi bi-clock-fill text-emerald"></i>
                <small>${window.I18n.getText("planner_estimated_time")}</small>
                <strong>${plan.estimatedTime}</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-signpost-fill text-blue"></i>
                <small>Distancia</small>
                <strong>${plan.totalDistanceKm.toFixed(2)} km</strong>
              </div>
            </div>
            <p class="mt-2 text-muted" style="font-size: 0.9rem;">
              <i class="bi bi-info-circle-fill text-blue"></i> Tu destino se encuentra a corta distancia a pie (${plan.totalDistanceKm.toFixed(2)} km).
            </p>
            <div class="result-actions mt-3">
              <a href="#mapa" class="btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
                <i class="bi bi-geo-alt-fill"></i> ${window.I18n.getText("planner_view_map_btn")}
              </a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (plan.isDirect) {
      resultsContainer.innerHTML = `
        <div class="planner-result-card animate-fade-in">
          <div class="result-header" style="background-color: ${plan.line.badgeColor}">
            <span class="result-badge"><i class="bi bi-check2-circle"></i> ${window.I18n.getText("planner_suggested_route")}</span>
            <h3>${plan.line.number} - ${plan.line.name}</h3>
          </div>
          <div class="result-body">
            <div class="result-stat-row">
              <div class="stat-box">
                <i class="bi bi-clock-fill text-emerald"></i>
                <small>${window.I18n.getText("planner_estimated_time")}</small>
                <strong>${plan.estimatedTime}</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-arrow-repeat text-blue"></i>
                <small>Frecuencia</small>
                <strong style="font-size:0.8rem; color:var(--text-muted);">${infoNotAvailable}</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-ticket-perforated-fill text-amber"></i>
                <small>${window.I18n.getText("planner_estimated_fare")}</small>
                <strong style="font-size:0.8rem; color:var(--text-muted);">${infoNotAvailable}</strong>
              </div>
            </div>

            <div class="journey-timeline">
              <div class="journey-point start">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">${walkText} ~${plan.walkStart.durationMin} min (${plan.walkStart.distanceKm.toFixed(2)} km)</span>
                  <strong>${plan.origin.name} ➔ ${plan.boardingStop.name}</strong>
                </div>
              </div>

              <div class="journey-segment" style="border-left-color: ${plan.line.badgeColor}">
                <span><i class="bi bi-bus-front"></i> ${busText}: ${plan.line.name} (${plan.stopCount} ${stopsText}, ~${plan.transit.durationMin} min aprox.)</span>
                <small style="display:block; color: var(--text-muted); margin-top:2px;">
                  Subir en: <b>${plan.boardingStop.name}</b> • Bajar en: <b>${plan.dropoffStop.name}</b>
                </small>
              </div>

              <div class="journey-point end">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">${walkText} ~${plan.walkEnd.durationMin} min (${plan.walkEnd.distanceKm.toFixed(2)} km)</span>
                  <strong>${plan.dropoffStop.name} ➔ ${plan.dest.name}</strong>
                </div>
              </div>
            </div>

            <div class="result-actions mt-3">
              <a href="#mapa" class="btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
                <i class="bi bi-geo-alt-fill"></i> ${window.I18n.getText("planner_view_map_btn")}
              </a>
              <button class="btn-secondary" onclick="window.IguazuApp.openLineDetail('${plan.line.id}')">
                <i class="bi bi-info-circle"></i> ${window.I18n.getText("line_view_details")}
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (!plan.isDirect && plan.firstLeg && plan.secondLeg) {
      resultsContainer.innerHTML = `
        <div class="planner-result-card animate-fade-in">
          <div class="result-header bg-slate-800">
            <span class="result-badge"><i class="bi bi-shuffle"></i> Viaje con Transbordo Recomendado</span>
            <h3>${plan.firstLeg.line.number} ➔ ${plan.secondLeg.line.number}</h3>
          </div>
          <div class="result-body">
            <div class="result-stat-row">
              <div class="stat-box">
                <i class="bi bi-clock-fill text-amber"></i>
                <small>${window.I18n.getText("planner_estimated_time")}</small>
                <strong>${plan.estimatedTime}</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-signpost-split text-blue"></i>
                <small>Distancia Total</small>
                <strong>${plan.totalDistanceKm.toFixed(1)} km</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-ticket-perforated-fill text-amber"></i>
                <small>Tarifa Total</small>
                <strong style="font-size:0.8rem; color:var(--text-muted);">${infoNotAvailable}</strong>
              </div>
            </div>

            <div class="journey-timeline">
              <div class="journey-point start">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Tramo 1 (${plan.firstLeg.line.number})</span>
                  <strong>Subir en: ${plan.firstLeg.boardingStop.name}</strong> (Tomar ${plan.firstLeg.line.name})
                </div>
              </div>
              <div class="journey-point transfer">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Transbordo</span>
                  <strong>${plan.transferPoint}</strong> (Cambiar a ${plan.secondLeg.line.name})
                </div>
              </div>
              <div class="journey-point end">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Llegada (${plan.secondLeg.line.number})</span>
                  <strong>${plan.dest.name}</strong>
                </div>
              </div>
            </div>

            <div class="result-actions mt-3">
              <a href="#mapa" class="btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
                <i class="bi bi-geo-alt-fill"></i> ${window.I18n.getText("planner_view_map_btn")}
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  toggleDrawer(forceState) {
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("drawer-overlay");
    const hamburger = document.getElementById("hamburger-btn");
    if (!drawer || !overlay) return;

    const isOpen = (typeof forceState === "boolean") ? forceState : !drawer.classList.contains("open");

    if (isOpen) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      if (hamburger) {
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
      }
      document.body.classList.add("drawer-open");
    } else {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      if (hamburger) {
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
      document.body.classList.remove("drawer-open");
    }
  }

  closeDrawer() {
    this.toggleDrawer(false);
  }

  setupEventListeners() {
    // Selector de Idiomas (Dropdown Compacto en Header)
    const langDropdown = document.getElementById("lang-dropdown");
    const langDropdownBtn = document.getElementById("lang-dropdown-btn");

    if (langDropdownBtn && langDropdown) {
      langDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = langDropdown.classList.toggle("open");
        langDropdownBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      });
    }

    // Opciones del Dropdown de Idiomas
    document.querySelectorAll(".lang-option").forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const lang = opt.getAttribute("data-lang");
        window.I18n.setLanguage(lang);
        if (langDropdown) {
          langDropdown.classList.remove("open");
          if (langDropdownBtn) langDropdownBtn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Opciones de Idioma en el Drawer Móvil
    document.querySelectorAll(".drawer-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        window.I18n.setLanguage(lang);
      });
    });

    // Compatibilidad con botones legacy .lang-btn
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        window.I18n.setLanguage(lang);
      });
    });

    // Clic fuera del Dropdown para cerrarlo
    document.addEventListener("click", (e) => {
      if (langDropdown && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove("open");
        if (langDropdownBtn) langDropdownBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Menú Hamburguesa y Drawer Móvil
    const hamburgerBtn = document.getElementById("hamburger-btn");

      // NAVIGATION DROPDOWN (Desktop) – toggle on click
      document.querySelectorAll('.nav-dropdown .dropdown-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', e => {
          e.stopPropagation();
          const parent = toggle.parentElement;
          const isOpen = parent.classList.toggle('open');
          toggle.setAttribute('aria-expanded', isOpen);
        });
      });

      // Close any open dropdown when clicking outside
      document.addEventListener('click', e => {
        document.querySelectorAll('.nav-dropdown.open').forEach(openDropdown => {
          if (!openDropdown.contains(e.target)) {
            openDropdown.classList.remove('open');
            const toggle = openDropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    const drawerCloseBtn = document.getElementById("drawer-close-btn");
    const drawerOverlay = document.getElementById("drawer-overlay");

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleDrawer();
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener("click", () => this.closeDrawer());
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener("click", () => this.closeDrawer());
    }

    // Cerrar drawer al hacer clic en un enlace de navegación
    document.querySelectorAll(".drawer-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".drawer-nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        this.closeDrawer();
      });
    });

    // Cerrar modales y dropdowns con tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (langDropdown) {
          langDropdown.classList.remove("open");
          if (langDropdownBtn) langDropdownBtn.setAttribute("aria-expanded", "false");
        }
        this.closeDrawer();
        this.closeModal();
      }
    });

    window.addEventListener("languageChanged", () => {
      this.renderCategoryPills();
      this.renderLinesGrid();
      this.renderFaresTable();
      this.renderPaymentMethods();
      this.renderNews();
      this.renderFaqs();
      this.renderMapSelectOptions();
      this.updateCompanyStatus();
      this.updateDataMeta();
      if (this.selectedLine) {
        this.openLineDetail(this.selectedLine.id);
      }
    });

    // Buscador de Líneas
    const searchLineInput = document.getElementById("search-line-input");
    if (searchLineInput) {
      searchLineInput.addEventListener("input", () => this.filterLines());
    }

    // Botón Buscar del Planificador
    const planBtn = document.getElementById("btn-plan-trip");
    if (planBtn) {
      planBtn.addEventListener("click", () => this.executeTripPlan());
    }

    // Botón GPS del Planificador
    const planGpsBtn = document.getElementById("btn-planner-gps");
    if (planGpsBtn) {
      planGpsBtn.addEventListener("click", () => {
        if (window.IguazuMap) {
          window.IguazuMap.locateUser((coords) => {
            const originInput = document.getElementById("planner-origin-input");
            const mapOrigin = document.getElementById("map-origin-input");
            const userLabel = window.I18n ? window.I18n.getText("map_legend_user") : "Mi Ubicación Actual (GPS)";
            if (originInput) originInput.value = userLabel;
            if (mapOrigin) mapOrigin.value = userLabel;
          });
        }
      });
    }

    // Invertir origen y destino
    const swapBtn = document.getElementById("btn-swap-locations");
    if (swapBtn) {
      swapBtn.addEventListener("click", () => {
        const originInput = document.getElementById("planner-origin-input");
        const destInput = document.getElementById("planner-dest-input");
        if (originInput && destInput) {
          const temp = originInput.value;
          originInput.value = destInput.value;
          destInput.value = temp;
          this.executeTripPlan();
        }
      });
    }

    // Hero Search Form
    const heroBtn = document.getElementById("btn-hero-search");
    if (heroBtn) {
      heroBtn.addEventListener("click", () => {
        const heroOrigin = document.getElementById("hero-origin-input");
        const heroDest = document.getElementById("hero-dest-input");
        const plannerOrigin = document.getElementById("planner-origin-input");
        const plannerDest = document.getElementById("planner-dest-input");

        if (heroOrigin && plannerOrigin) plannerOrigin.value = heroOrigin.value;
        if (heroDest && plannerDest) plannerDest.value = heroDest.value;

        this.executeTripPlan();
        const plannerSec = document.getElementById("planificador");
        if (plannerSec) plannerSec.scrollIntoView({ behavior: "smooth" });
      });
    }

    // FAQ Search Filter
    const faqSearchInput = document.getElementById("faq-search-input");
    if (faqSearchInput) {
      faqSearchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".faq-item").forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = (term === "" || text.includes(term)) ? "block" : "none";
        });
      });
    }

    // Modal Tabs Switcher
    document.querySelectorAll(".modal-tab-btn").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        const tabTarget = tabBtn.getAttribute("data-tab");
        document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".modal-tab-pane").forEach(p => p.classList.remove("active"));
        tabBtn.classList.add("active");
        const targetPane = document.getElementById(`modal-tab-${tabTarget}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // Cerrar Modal
    const modalCloseBtn = document.getElementById("btn-close-modal");
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => this.closeModal());
    }

    const modalBackdrop = document.getElementById("line-detail-modal");
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) this.closeModal();
      });
    }

    // Mobile Navigation Bar
    document.querySelectorAll(".mobile-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        document.querySelectorAll(".mobile-nav-item").forEach(n => n.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }
}

// Iniciar aplicación
document.addEventListener("DOMContentLoaded", () => {
  window.IguazuApp = new IguazuTransportApp();
  window.IguazuApp.init();
});
