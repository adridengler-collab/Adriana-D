/**
 * Aplicación Principal - Transporte Urbano Puerto Iguazú (Río Uruguay)
 */

class IguazuTransportApp {
  constructor() {
    this.selectedLine = null;
    this.activeCategory = "all";
    this.activeDayType = "weekday"; // weekday | saturday | sunday
    this.activeDirection = "ida"; // ida | vuelta
    this.countdownTimer = null;
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

    // Iniciar reloj y simulador de salidas en vivo
    this.startLiveCountdownEngine();

    // Listeners de UI
    this.setupEventListeners();

    // Inicializar mapa cuando el DOM esté listo
    setTimeout(() => {
      window.IguazuMap.init();
    }, 200);
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
      const currentLang = window.I18n.currentLang;
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
      const lang = window.I18n.currentLang;
      const desc = line.description[lang] || line.description.es;
      const card = document.createElement("div");
      card.className = "line-card";
      card.setAttribute("data-line-id", line.id);
      card.setAttribute("data-type", line.type);

      // Calcular próximo bus en vivo
      const nextBus = this.calculateNextDeparture(line.schedule.ida);

      card.innerHTML = `
        <div class="line-card-header" style="border-left: 6px solid ${line.badgeColor}">
          <div class="line-badge" style="background-color: ${line.badgeColor}">
            ${line.number}
          </div>
          <div class="line-title-group">
            <h3 class="line-name">${line.name}</h3>
            <span class="line-frequency"><i class="bi bi-clock-history"></i> ${line.frequency.weekday}</span>
          </div>
        </div>

        <p class="line-desc">${desc}</p>

        <div class="line-live-badge-widget">
          <div class="live-dot-pulse"></div>
          <div class="live-text-info">
            <span class="live-label">${window.I18n.getText("live_next_bus_title")}:</span>
            <strong class="live-time-val">${nextBus.text}</strong>
          </div>
        </div>

        <div class="line-meta-grid">
          <div class="meta-item">
            <i class="bi bi-arrow-up-right-circle"></i>
            <div>
              <small>${window.I18n.getText("line_first_bus")}</small>
              <strong>${line.firstBus} hs</strong>
            </div>
          </div>
          <div class="meta-item">
            <i class="bi bi-arrow-down-left-circle"></i>
            <div>
              <small>${window.I18n.getText("line_last_bus")}</small>
              <strong>${line.lastBus} hs</strong>
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
              <small>Boleto</small>
              <strong>$${line.price.tourist.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div class="line-card-actions">
          <button class="btn-primary-outline" onclick="window.IguazuApp.openLineDetail('${line.id}')">
            <i class="bi bi-calendar-range"></i> ${window.I18n.getText("line_view_details")}
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

  calculateNextDeparture(scheduleList) {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    for (const timeStr of scheduleList) {
      const [h, m] = timeStr.split(":").map(Number);
      const departureMins = h * 60 + m;

      if (departureMins >= currentMins) {
        const diff = departureMins - currentMins;
        if (diff === 0) {
          return { text: window.I18n.getText("live_now"), time: timeStr, minutes: 0 };
        } else {
          return { text: `${timeStr} hs (en ${diff} min)`, time: timeStr, minutes: diff };
        }
      }
    }

    // Si ya pasaron todas las salidas de hoy
    const firstTomorrow = scheduleList[0];
    return {
      text: `${window.I18n.getText("live_service_finished")} ${firstTomorrow} hs`,
      time: firstTomorrow,
      minutes: -1
    };
  }

  openLineDetail(lineId) {
    const line = TRANSPORT_DATA.lines.find(l => l.id === lineId);
    if (!line) return;

    this.selectedLine = line;
    const modal = document.getElementById("line-detail-modal");
    const headerTitle = document.getElementById("modal-line-title");
    const badgeEl = document.getElementById("modal-line-badge");
    const descEl = document.getElementById("modal-line-desc");

    const lang = window.I18n.currentLang;
    headerTitle.textContent = line.name;
    badgeEl.textContent = line.number;
    badgeEl.style.backgroundColor = line.badgeColor;
    descEl.textContent = line.description[lang] || line.description.es;

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

    const line = this.selectedLine;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const generateScheduleChips = (scheduleArray) => {
      return scheduleArray.map(time => {
        const [h, m] = time.split(":").map(Number);
        const mins = h * 60 + m;
        const isPast = mins < currentMins;
        const isNext = mins >= currentMins && mins <= currentMins + 30;
        const chipClass = isNext ? "time-chip next-chip" : (isPast ? "time-chip past-chip" : "time-chip");
        return `<span class="${chipClass}">${time}</span>`;
      }).join("");
    };

    tableBodyIda.innerHTML = generateScheduleChips(line.schedule.ida);
    tableBodyVuelta.innerHTML = generateScheduleChips(line.schedule.vuelta);
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

    const line = this.selectedLine;
    const nextIda = this.calculateNextDeparture(line.schedule.ida);
    const nextVuelta = this.calculateNextDeparture(line.schedule.vuelta);

    liveContainer.innerHTML = `
      <div class="modal-live-grid">
        <div class="live-direction-card">
          <h4><i class="bi bi-arrow-right-circle-fill text-emerald"></i> ${window.I18n.getText("line_direction_ida")}</h4>
          <div class="live-big-time">${nextIda.text}</div>
          <p class="live-hint">${window.I18n.getText("live_frequency")}: <strong>${line.frequency.weekday}</strong></p>
        </div>
        <div class="live-direction-card">
          <h4><i class="bi bi-arrow-left-circle-fill text-blue"></i> ${window.I18n.getText("line_direction_vuelta")}</h4>
          <div class="live-big-time">${nextVuelta.text}</div>
          <p class="live-hint">${window.I18n.getText("live_frequency")}: <strong>${line.frequency.weekday}</strong></p>
        </div>
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
    window.IguazuMap.filterByLine(lineId);
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

      tr.innerHTML = `
        <td>
          <strong>${title}</strong>
          <small class="table-subdesc">${desc}</small>
        </td>
        <td class="price-cell ars">$${fare.priceARS.toLocaleString("es-AR")}</td>
        <td class="price-cell brl">R$ ${fare.priceBRL}</td>
        <td class="price-cell usd">US$ ${fare.priceUSD}</td>
        <td>${validBadges}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderPaymentMethods() {
    const container = document.getElementById("payment-methods-grid");
    if (!container) return;

    container.innerHTML = "";
    TRANSPORT_DATA.paymentMethods.forEach(method => {
      const card = document.createElement("div");
      card.className = "payment-card";
      card.innerHTML = `
        <div class="payment-icon-box">
          <i class="bi ${method.icon}"></i>
        </div>
        <h4 class="payment-title">${window.I18n.getText(method.titleKey)}</h4>
        <p class="payment-desc">${window.I18n.getText(method.descKey)}</p>
      `;
      container.appendChild(card);
    });
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
      resultsContainer.innerHTML = `
        <div class="planner-card not-found">
          <i class="bi bi-search"></i>
          <h4>No se encontró una ruta exacta</h4>
          <p>${plan.message}</p>
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
                <strong>${plan.frequency}</strong>
              </div>
              <div class="stat-box">
                <i class="bi bi-ticket-perforated-fill text-amber"></i>
                <small>${window.I18n.getText("planner_estimated_fare")}</small>
                <strong>$${plan.priceARS.toLocaleString()} ARS</strong>
              </div>
            </div>

            <div class="journey-timeline">
              <div class="journey-point start">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">${window.I18n.getText("planner_boarding_at")}</span>
                  <strong>${plan.boardingPoint}</strong>
                </div>
              </div>
              <div class="journey-segment" style="border-left-color: ${plan.line.badgeColor}">
                <span><i class="bi bi-bus-front"></i> Viaje directo en ${plan.line.name}</span>
              </div>
              <div class="journey-point end">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">${window.I18n.getText("planner_dropoff_at")}</span>
                  <strong>${plan.dropoffPoint}</strong>
                </div>
              </div>
            </div>

            <div class="result-actions mt-3">
              <button class="btn-primary" onclick="window.IguazuApp.viewLineOnMap('${plan.line.id}')">
                <i class="bi bi-geo-alt-fill"></i> ${window.I18n.getText("planner_view_map_btn")}
              </button>
              <button class="btn-secondary" onclick="window.IguazuApp.openLineDetail('${plan.line.id}')">
                <i class="bi bi-clock-history"></i> ${window.I18n.getText("line_view_details")}
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div class="planner-result-card animate-fade-in">
          <div class="result-header bg-slate-800">
            <span class="result-badge"><i class="bi bi-shuffle"></i> Viaje con Transbordo Recomendado</span>
            <h3>${plan.firstLine.number} ➔ ${plan.secondLine.number}</h3>
          </div>
          <div class="result-body">
            <div class="result-stat-row">
              <div class="stat-box">
                <i class="bi bi-clock-fill text-amber"></i>
                <small>${window.I18n.getText("planner_estimated_time")}</small>
                <strong>${plan.estimatedTime}</strong>
              </div>
            </div>

            <div class="journey-timeline">
              <div class="journey-point start">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Tramo 1: Subir en</span>
                  <strong>${plan.boardingPoint}</strong> (Tomar ${plan.firstLine.name})
                </div>
              </div>
              <div class="journey-point transfer">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Transbordo en</span>
                  <strong>${plan.transferPoint}</strong> (Cambiar a ${plan.secondLine.name})
                </div>
              </div>
              <div class="journey-point end">
                <div class="point-circle"></div>
                <div class="point-info">
                  <span class="point-label">Llegada a</span>
                  <strong>${plan.dropoffPoint}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  startLiveCountdownEngine() {
    // Actualizar cada 30 segundos
    this.countdownTimer = setInterval(() => {
      this.renderLinesGrid();
      if (this.selectedLine) {
        this.renderModalSchedules();
        this.renderModalLive();
      }
    }, 30000);
  }

  setupEventListeners() {
    // Selector de Idiomas
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        window.I18n.setLanguage(lang);
      });
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
