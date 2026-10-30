/**
 * Aplicación Principal - Transporte Urbano Puerto Iguazú (Río Uruguay)
 *
 * Gestión de datos: Tarifas vigentes con cotización ARS, USD y BRL,
 * filtros por Urbanas, Turísticas e Internacionales, y horarios de cabecera.
 * Última actualización centralizada: 23/10/2026.
 */

class IguazuTransportApp {
  constructor() {
    this.selectedLine = null;
    this.activeCategory = "all";
    this.activeDayType = "weekday"; // weekday | saturday | sunday
    this.activeDirection = "ida"; // ida | vuelta
    this.exchangeRates = {
      usd: 1050,
      brl: 210,
      date: null,
      isLive: false
    };
  }

  init() {
    // Inicializar traducción
    window.I18n.updateDOM();

    // Cargar cotizaciones de monedas (dolarapi.com y open.er-api.com)
    this.loadExchangeRates();

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
   * Carga las cotizaciones oficiales de divisas desde dolarapi.com y open.er-api.com
   * y actualiza las tarifas con fallback a inputs manuales
   */
  async loadExchangeRates() {
    // 1. Fetch USD desde dolarapi.com
    try {
      const resUSD = await fetch("https://dolarapi.com/v1/dolares/oficial");
      if (resUSD.ok) {
        const dataUSD = await resUSD.json();
        if (dataUSD && dataUSD.venta) {
          this.exchangeRates.usd = dataUSD.venta;
          if (dataUSD.fechaActualizacion) {
            const d = new Date(dataUSD.fechaActualizacion);
            if (!isNaN(d.getTime())) {
              this.exchangeRates.date = d.toLocaleDateString("es-AR");
            }
          }
          this.exchangeRates.isLive = true;
        }
      }
    } catch (e) {
      console.warn("dolarapi.com no disponible, usando cotización de respaldo:", e.message);
    }

    // 2. Fetch BRL desde open.er-api.com (o fallback a dolarapi)
    try {
      const resBRL = await fetch("https://open.er-api.com/v6/latest/ARS");
      if (resBRL.ok) {
        const dataBRL = await resBRL.json();
        if (dataBRL && dataBRL.rates && dataBRL.rates.BRL) {
          // dataBRL.rates.BRL es la tasa ARS -> BRL (1 ARS = X BRL)
          // 1 BRL en ARS es 1 / tasa
          this.exchangeRates.brl = Math.round((1 / dataBRL.rates.BRL) * 100) / 100;
          if (dataBRL.time_last_update_utc) {
            const d = new Date(dataBRL.time_last_update_utc);
            if (!isNaN(d.getTime())) {
              this.exchangeRates.date = d.toLocaleDateString("es-AR");
            }
          }
          this.exchangeRates.isLive = true;
        }
      }
    } catch (e) {
      try {
        const resBRLFallback = await fetch("https://dolarapi.com/v1/cotizaciones/brl");
        if (resBRLFallback.ok) {
          const dataBRL = await resBRLFallback.json();
          if (dataBRL && dataBRL.venta) {
            this.exchangeRates.brl = dataBRL.venta;
            this.exchangeRates.isLive = true;
          }
        }
      } catch (err) {
        console.warn("API BRL no disponible, usando cotización de respaldo:", err.message);
      }
    }

    // Actualizar campos manuales si existen en el DOM
    const inputUSD = document.getElementById("manual-rate-usd");
    const inputBRL = document.getElementById("manual-rate-brl");
    const dateBadge = document.getElementById("exchange-rates-date");

    if (inputUSD) inputUSD.value = this.exchangeRates.usd;
    if (inputBRL) inputBRL.value = this.exchangeRates.brl;
    if (dateBadge) {
      if (this.exchangeRates.isLive && this.exchangeRates.date) {
        dateBadge.textContent = `Cotización externa de mercado: ${this.exchangeRates.date}`;
      } else {
        dateBadge.textContent = window.I18n ? (window.I18n.getText("converter_reference_values") || "Valores de referencia editables") : "Valores de referencia editables";
      }
    }

    // Re-renderizar tabla de tarifas con cotizaciones actualizadas
    this.renderFaresTable();
  }

  /**
   * Actualiza el indicador centralizado de fecha de actualización de datos
   */
  updateDataMeta() {
    const meta = TRANSPORT_DATA.meta;
    const lang = window.I18n ? window.I18n.currentLang : "es";
    const updateEls = document.querySelectorAll(".data-last-update-display");
    
    const prefix = (meta.lastUpdatedPrefix && meta.lastUpdatedPrefix[lang]) || window.I18n.getText("last_update_prefix") || "Última actualización:";
    const date = meta.lastUpdated || "23/10/2026";
    const fullLabel = `${prefix} ${date}`;

    updateEls.forEach(el => {
      el.textContent = fullLabel;
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
      btn.id = `filter-${cat.id}`;
      btn.setAttribute("data-cat", cat.id);
      btn.setAttribute("data-filter", cat.id);
      btn.innerHTML = `<i class="bi ${cat.icon}"></i> <span>${window.I18n.getText(cat.labelKey)}</span>`;
      btn.addEventListener("click", () => {
        if (this.activeCategory === cat.id) {
          this.activeCategory = "all";
          btn.classList.remove("active");
        } else {
          this.activeCategory = cat.id;
          document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
          btn.classList.add("active");
        }
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

      const isUrban = line.type === "urbanas" || line.type === "urban";
      const freqText = line.frequency && line.frequency.weekday 
        ? line.frequency.weekday 
        : (isUrban ? "Servicio regular" : "Frecuencia regular");

      card.innerHTML = `
        <div class="line-card-header" style="border-left: 6px solid ${line.badgeColor}">
          <div class="line-badge" style="background-color: ${line.badgeColor}">
            ${line.number}
          </div>
          <div class="line-title-group">
            <h3 class="line-name">${line.name}</h3>
            ${!isUrban ? `<span class="line-frequency"><i class="bi bi-clock-history"></i> ${freqText}</span>` : `<span class="line-frequency"><i class="bi bi-compass"></i> Recorrido Barrial</span>`}
          </div>
        </div>

        <p class="line-desc">${desc}</p>

        <div class="line-meta-grid">
          ${line.firstBus && line.lastBus ? `
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
          ` : `
            <div class="meta-item meta-item-cabecera">
              <i class="bi bi-clock text-emerald"></i>
              <div>
                <small>${window.I18n.getText("cabecera_schedule_title") || "Salidas desde cabecera"}</small>
                <strong>${window.I18n.getText("cabecera_departures_regular") || "Salidas regulares desde cabecera"}</strong>
              </div>
            </div>
          `}
          <div class="meta-item">
            <i class="bi bi-signpost-split"></i>
            <div>
              <small>Paradas</small>
              <strong>${line.routeIda.length} puntos</strong>
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
      if (!line) return;

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
    const tabsBar = modal ? modal.querySelector(".modal-tabs-bar") : null;
    const tabSchedules = document.getElementById("modal-tab-schedules");
    const tabStops = document.getElementById("modal-tab-stops");
    const tabLive = document.getElementById("modal-tab-live");

    const isUrban = line.type === "urbanas" || line.type === "urban";

    const lang = window.I18n ? window.I18n.currentLang : "es";
    if (headerTitle) headerTitle.textContent = line.name;
    if (badgeEl) {
      badgeEl.textContent = line.number;
      badgeEl.style.backgroundColor = line.badgeColor;
    }
    if (descEl) descEl.textContent = line.description[lang] || line.description.es;

    // Remover bloque previo de cabecera si existe
    const oldCabecera = document.getElementById("modal-cabecera-card-block");
    if (oldCabecera) oldCabecera.remove();

    if (isUrban) {
      // Líneas Urbanas: ocultar pestañas de horarios de frecuencia y estado en vivo.
      // Mostrar solo: Nombre de la línea (header), Horario de cabecera y Lista de paradas.
      if (tabsBar) tabsBar.style.display = "none";
      if (tabSchedules) {
        tabSchedules.classList.remove("active");
        tabSchedules.style.display = "none";
      }
      if (tabLive) {
        tabLive.classList.remove("active");
        tabLive.style.display = "none";
      }
      if (tabStops) {
        tabStops.classList.add("active");
        tabStops.style.display = "block";

        const cabeceraCard = document.createElement("div");
        cabeceraCard.id = "modal-cabecera-card-block";
        cabeceraCard.className = "modal-cabecera-card";
        const noteText = window.I18n.getText("cabecera_schedule_note") || "Los horarios corresponden a las salidas de las unidades desde la cabecera (Terminal de Ómnibus), no a horarios de paso por paradas intermedias.";

        let scheduleBody = "";
        if (line.firstBus && line.lastBus) {
          scheduleBody = `
            <div class="cabecera-grid">
              <div class="cabecera-box">
                <span class="cabecera-label"><i class="bi bi-arrow-up-right"></i> ${window.I18n.getText("line_first_bus") || "Primer servicio (salida cabecera):"}</span>
                <strong class="cabecera-value">${line.firstBus} hs</strong>
              </div>
              <div class="cabecera-box">
                <span class="cabecera-label"><i class="bi bi-arrow-down-left"></i> ${window.I18n.getText("line_last_bus") || "Último servicio (salida cabecera):"}</span>
                <strong class="cabecera-value">${line.lastBus} hs</strong>
              </div>
            </div>
          `;
        } else {
          scheduleBody = `
            <div class="cabecera-regular-msg">
              <i class="bi bi-info-circle text-emerald"></i>
              <span>${window.I18n.getText("cabecera_departures_regular") || "Salidas regulares desde cabecera según demanda operativa."}</span>
            </div>
          `;
        }

        cabeceraCard.innerHTML = `
          <div class="cabecera-card-header">
            <i class="bi bi-clock-history text-emerald"></i>
            <h4>${window.I18n.getText("cabecera_schedule_title") || "Salidas desde Cabecera (Terminal)"}</h4>
          </div>
          ${scheduleBody}
          <div class="cabecera-clarification">
            <small><i class="bi bi-info-circle"></i> ${noteText}</small>
          </div>
        `;
        tabStops.insertBefore(cabeceraCard, tabStops.firstChild);
      }

      this.renderModalRouteStops();
    } else {
      // Líneas Turísticas e Internacionales: mostrar barra de pestañas normal
      if (tabsBar) tabsBar.style.display = "flex";
      if (tabSchedules) tabSchedules.style.display = "";
      if (tabLive) tabLive.style.display = "";
      if (tabStops) tabStops.style.display = "";

      // Activar por defecto la pestaña de paradas
      document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".modal-tab-pane").forEach(p => p.classList.remove("active"));
      const defaultBtn = modal?.querySelector('.modal-tab-btn[data-tab="stops"]');
      if (defaultBtn) defaultBtn.classList.add("active");
      if (tabStops) tabStops.classList.add("active");

      this.renderModalSchedules();
      this.renderModalRouteStops();
      this.renderModalLive();
    }

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

    const noteText = window.I18n.getText("cabecera_schedule_note") || "Los horarios corresponden a las salidas de las unidades desde la cabecera (Terminal de Ómnibus), no a horarios de paso por paradas intermedias.";

    const scheduleHtml = `
      <div class="modal-info-box">
        <i class="bi bi-clock-history text-emerald"></i>
        <p><strong>Servicio Regular con Frecuencia Diaria</strong></p>
        <small class="text-muted">Servicios operando desde la Terminal de Ómnibus Plataforma 7 según demanda turística e internacional.</small>
        <div class="cabecera-clarification" style="margin-top: 0.75rem;">
          <small><i class="bi bi-info-circle"></i> ${noteText}</small>
        </div>
      </div>
    `;

    tableBodyIda.innerHTML = scheduleHtml;
    tableBodyVuelta.innerHTML = scheduleHtml;
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
      <div class="modal-info-box" style="padding: 2rem 1rem;">
        <i class="bi bi-check-circle-fill text-emerald" style="font-size: 2.2rem; margin-bottom: 0.5rem; display: inline-block;"></i>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Servicio en Operación Normal</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Unidades en circulación cubriendo el recorrido oficial.</p>
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

    // Obtener cotizaciones de los campos manuales o valores cargados de APIs
    const inputUSD = document.getElementById("manual-rate-usd");
    const inputBRL = document.getElementById("manual-rate-brl");

    let usdArs = inputUSD ? parseFloat(inputUSD.value) : (this.exchangeRates?.usd || 1050);
    let brlArs = inputBRL ? parseFloat(inputBRL.value) : (this.exchangeRates?.brl || 210);

    if (isNaN(usdArs) || usdArs <= 0) usdArs = 1050;
    if (isNaN(brlArs) || brlArs <= 0) brlArs = 210;

    // Calcular tasa unitaria (1 ARS = X moneda extranjera)
    const rateUSD = (usdArs > 1) ? (1 / usdArs) : usdArs;
    const rateBRL = (brlArs > 1) ? (1 / brlArs) : brlArs;

    tbody.innerHTML = "";
    TRANSPORT_DATA.fares.forEach(fare => {
      const tr = document.createElement("tr");
      const title = window.I18n.getText(fare.categoryKey) || fare.categoryKey;
      const desc = window.I18n.getText(fare.descriptionKey) || fare.descriptionKey;
      const validBadges = fare.validFor.map(l => `<span class="badge-mini">${l}</span>`).join(" ");

      // Caso beneficio gratuito (BEEG)
      if (fare.isFreeBenefit) {
        tr.innerHTML = `
          <td>
            <strong>${title}</strong>
            <small class="table-subdesc">${desc}</small>
          </td>
          <td class="price-cell ars"><span class="price-value text-emerald" style="font-weight: 700;">Gratuito (BEEG)</span></td>
          <td class="price-cell brl">—</td>
          <td class="price-cell usd">—</td>
          <td>${validBadges}</td>
        `;
        tbody.appendChild(tr);
        return;
      }

      // Omitir tarifas sin precio real
      if (fare.priceARS === null || fare.priceARS === undefined) return;

      const priceARS = fare.priceARS;
      const priceBRL = Math.round((priceARS * rateBRL) * 100) / 100;
      const priceUSD = Math.round((priceARS * rateUSD) * 100) / 100;

      tr.innerHTML = `
        <td>
          <strong>${title}</strong>
          <small class="table-subdesc">${desc}</small>
        </td>
        <td class="price-cell ars">$ ${priceARS.toLocaleString('es-AR')}</td>
        <td class="price-cell brl">R$ ${priceBRL.toFixed(2)}</td>
        <td class="price-cell usd">US$ ${priceUSD.toFixed(2)}</td>
        <td>${validBadges}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderPaymentMethods() {
    const container = document.getElementById("payment-methods-grid");
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Generate a card for each payment method defined in data
    TRANSPORT_DATA.paymentMethods.forEach(method => {
      const card = document.createElement("div");
      card.className = "payment-card";
      card.innerHTML = `
        <div class="payment-icon-box">
          <i class="${method.icon}"></i>
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

    // Inputs Manuales de Cotización (USD y BRL)
    const inputUSD = document.getElementById("manual-rate-usd");
    const inputBRL = document.getElementById("manual-rate-brl");
    if (inputUSD) {
      inputUSD.addEventListener("input", () => this.renderFaresTable());
      inputUSD.addEventListener("change", () => this.renderFaresTable());
    }
    if (inputBRL) {
      inputBRL.addEventListener("input", () => this.renderFaresTable());
      inputBRL.addEventListener("change", () => this.renderFaresTable());
    }

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
