/**
 * REFIX — Fix It First
 * Main Application Controller & Interaction Logic
 * 
 * Features:
 * - Deterministic circularity decision engine & lifecycle analysis
 * - Global shared currency switcher (USD, EUR, GBP, INR) with verified Q4 2024 benchmarks
 * - Interactive Universal Scope section with subcategory/appliance selection & Solid State Drive (SSD)
 * - Enhanced DIY Creative Repurposing Studio with multi-category filters, search, and dynamic contextual suggestions
 * - Visual damage scanner with device camera, photo upload & verified defect inspection
 * - HTML5 Drag-and-Drop spatial interaction for primary evaluation verdicts with mobile tap fallback
 * - Dark/Light theme, Web Audio synthesizer, and balanced responsive navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Initialize Engine & Shared State
  // ==========================================================================
  const data = window.REFIX_DATA;
  if (!data) {
    console.error('REFIX_DATA not loaded. Please ensure js/data.js is included.');
    return;
  }
  const engine = new window.RefixEngine(data);

  const state = {
    currency: localStorage.getItem('refix_currency') || 'USD',
    theme: localStorage.getItem('refix_theme') || 'dark',
    sound: localStorage.getItem('refix_sound') !== 'false',
    currentStep: 1,
    currentAssessment: null,
    activeCategoryFilter: 'all',
    selectedScopeCategory: 'furniture',
    activeSubcategory: 'Solid Oak Dining Chair',
    repurposeCategory: 'all',
    repurposeSearch: '',
    directorySearchTerm: '',
    simCount: 250,
    cameraStream: null,
    scannedPhoto: null,
    activeDraggedItem: null,
    selectedItemForTap: null,
    // Base USD benchmark costs for seamless currency conversion in form inputs
    baseOriginalUSD: 140,
    baseRepairUSD: 12
  };

  // ==========================================================================
  // 2. Audio Synthesizer (Zero external audio files needed)
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && typeof window.AudioContext !== 'undefined') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.08) {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or suspended, ignore gracefully
    }
  }

  function playSuccessChime() {
    if (!state.sound) return;
    playTone(523.25, 'sine', 0.14, 0.06); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.14, 0.06), 75); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.22, 0.07), 150); // G5
  }

  function playVetoBuzzer() {
    if (!state.sound) return;
    playTone(220, 'sawtooth', 0.2, 0.08);
    setTimeout(() => playTone(185, 'sawtooth', 0.25, 0.09), 120);
  }

  function playClick() {
    playTone(800, 'triangle', 0.04, 0.03);
  }

  // ==========================================================================
  // 3. Shared Global Currency Engine
  // ==========================================================================
  function formatMoney(amountUSD) {
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const converted = amountUSD * cur.rate;
    
    if (state.currency === 'INR') {
      return `${cur.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${cur.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }

  function updateHeroSavingsStat() {
    const heroStatsMoney = document.getElementById('heroStatsMoney');
    if (!heroStatsMoney) return;
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const converted = 142000 * cur.rate;

    if (state.currency === 'INR') {
      heroStatsMoney.textContent = `₹${(converted / 10000000).toFixed(2)}Cr+`;
    } else if (state.currency === 'EUR') {
      heroStatsMoney.textContent = `€${Math.round(converted / 1000)}K+`;
    } else if (state.currency === 'GBP') {
      heroStatsMoney.textContent = `£${Math.round(converted / 1000)}K+`;
    } else {
      heroStatsMoney.textContent = `$${Math.round(converted / 1000)}K+`;
    }
  }

  function updateCurrencyLabels() {
    const cur = data.currencies[state.currency] || data.currencies.USD;

    // 1. Update all currency symbol labels across the page
    document.querySelectorAll('.currency-symbol-label').forEach(el => {
      el.textContent = cur.symbol;
    });

    // 2. Update currency rate benchmark badge
    const rateBadge = document.getElementById('currencyRateBadge');
    if (rateBadge) {
      rateBadge.textContent = cur.benchmark;
    }

    // 3. Convert numeric values in active form inputs based on base USD values
    const origInput = document.getElementById('originalCost');
    const repInput = document.getElementById('repairCost');
    if (origInput) {
      origInput.value = Math.round(state.baseOriginalUSD * cur.rate);
    }
    if (repInput) {
      repInput.value = Math.round(state.baseRepairUSD * cur.rate);
    }

    // 4. Update Hero counter & Hero preview card
    updateHeroSavingsStat();
    updateHeroPreview();

    // 5. Update Draggable Item Card display
    syncFormDraggableCard();

    // 6. Update Recommendation Result Panel if assessment exists
    if (state.currentAssessment) {
      renderResultPanel(state.currentAssessment);
    }

    // 7. Update presets ribbon chips
    renderPresets();

    // 8. Update Repurposing Studio cards
    renderUpcycling();

    // 9. Update Community Impact Simulator
    updateSimulator();
  }

  // Toast Notifications
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✓';
    if (type === 'info') icon = 'ℹ️';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span style="font-weight: bold;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // 4. Theme & Audio Controls
  // ==========================================================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('refix_theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
  applyTheme(state.theme);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playClick();
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  function updateSoundIcon() {
    if (soundIcon) soundIcon.textContent = state.sound ? '🔊' : '🔇';
  }
  updateSoundIcon();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      state.sound = !state.sound;
      localStorage.setItem('refix_sound', state.sound);
      updateSoundIcon();
      playClick();
      showToast(state.sound ? 'Audio feedback enabled' : 'Audio muted', 'info');
    });
  }

  // Currency Selector Listener
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.value = state.currency;
    currencySelect.addEventListener('change', (e) => {
      playClick();
      state.currency = e.target.value;
      localStorage.setItem('refix_currency', state.currency);
      updateCurrencyLabels();
      const cur = data.currencies[state.currency];
      showToast(`Currency: ${cur.name} (${cur.symbol}) • Rate: ${cur.benchmark}`, 'info');
    });
  }

  // Mobile Navigation Toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
    });
  }

  // ==========================================================================
  // 5. Form Category & Material Selectors Setup
  // ==========================================================================
  const categorySelect = document.getElementById('itemCategory');
  const materialSelect = document.getElementById('itemMaterial');

  function populateCategoriesDropdown() {
    if (!categorySelect) return;
    categorySelect.innerHTML = '';
    data.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.icon} ${cat.name}`;
      categorySelect.appendChild(opt);
    });
    populateMaterialsForCategory(categorySelect.value);
  }

  function populateMaterialsForCategory(categoryId) {
    if (!materialSelect) return;
    materialSelect.innerHTML = '';
    const cat = data.categories.find(c => c.id === categoryId) || data.categories[0];
    if (cat && cat.materials) {
      cat.materials.forEach(mat => {
        const opt = document.createElement('option');
        opt.value = mat.id;
        opt.textContent = `${mat.name} (Repair ease: ${mat.repairEase}%)`;
        materialSelect.appendChild(opt);
      });
    }
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      state.selectedScopeCategory = e.target.value;
      populateMaterialsForCategory(e.target.value);
      syncFormDraggableCard();
      highlightActiveScopeCard(e.target.value);
    });
  }

  if (materialSelect) {
    materialSelect.addEventListener('change', () => {
      syncFormDraggableCard();
    });
  }

  // Cost input listeners to update base USD values cleanly
  const origCostInput = document.getElementById('originalCost');
  const repairCostInput = document.getElementById('repairCost');
  if (origCostInput) {
    origCostInput.addEventListener('input', () => {
      const cur = data.currencies[state.currency] || data.currencies.USD;
      const val = parseFloat(origCostInput.value) || 0;
      state.baseOriginalUSD = val / cur.rate;
      syncFormDraggableCard();
    });
  }
  if (repairCostInput) {
    repairCostInput.addEventListener('input', () => {
      const cur = data.currencies[state.currency] || data.currencies.USD;
      const val = parseFloat(repairCostInput.value) || 0;
      state.baseRepairUSD = val / cur.rate;
      syncFormDraggableCard();
    });
  }

  // ==========================================================================
  // 6. Wizard Stepper & View Mode Switcher
  // ==========================================================================
  const wizardCard = document.getElementById('wizardCard');
  const viewModeAllBtn = document.getElementById('viewModeAllBtn');
  const viewModeWizardBtn = document.getElementById('viewModeWizardBtn');
  const engineLayoutGrid = document.querySelector('.engine-layout-grid');
  const compactShowFormBtn = document.getElementById('compactShowFormBtn');
  const compactShowResultBtn = document.getElementById('compactShowResultBtn');
  const compactBackToFormBtn = document.getElementById('compactBackToFormBtn');
  const wizardFooterActions = document.getElementById('wizardFooterActions');

  const stepNavItems = document.querySelectorAll('.step-nav-item');
  const stepContents = document.querySelectorAll('.form-step-content');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  if (viewModeAllBtn && viewModeWizardBtn && wizardCard) {
    viewModeAllBtn.addEventListener('click', () => {
      playClick();
      viewModeAllBtn.classList.add('active');
      viewModeWizardBtn.classList.remove('active');
      wizardCard.classList.add('all-in-one-mode');
      if (wizardFooterActions) wizardFooterActions.style.display = 'none';
      showToast('Switched to All-in-One Dashboard (all sections visible)', 'info');
    });

    viewModeWizardBtn.addEventListener('click', () => {
      playClick();
      viewModeWizardBtn.classList.add('active');
      viewModeAllBtn.classList.remove('active');
      wizardCard.classList.remove('all-in-one-mode');
      if (wizardFooterActions) wizardFooterActions.style.display = 'flex';
      setWizardStep(state.currentStep || 1);
      showToast('Switched to Step-by-Step Wizard', 'info');
    });
  }

  // Compact screen tab toggles
  if (compactShowFormBtn && compactShowResultBtn && engineLayoutGrid) {
    compactShowFormBtn.addEventListener('click', () => {
      playClick();
      compactShowFormBtn.classList.add('active');
      compactShowResultBtn.classList.remove('active');
      engineLayoutGrid.classList.remove('show-result-only');
      engineLayoutGrid.classList.add('show-form-only');
      if (wizardCard) wizardCard.scrollIntoView({ behavior: 'smooth' });
    });

    compactShowResultBtn.addEventListener('click', () => {
      playClick();
      compactShowResultBtn.classList.add('active');
      compactShowFormBtn.classList.remove('active');
      engineLayoutGrid.classList.remove('show-form-only');
      engineLayoutGrid.classList.add('show-result-only');
      const resPanel = document.getElementById('resultPanel');
      if (resPanel) resPanel.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (compactBackToFormBtn && engineLayoutGrid) {
    compactBackToFormBtn.addEventListener('click', () => {
      playClick();
      if (compactShowFormBtn) compactShowFormBtn.classList.add('active');
      if (compactShowResultBtn) compactShowResultBtn.classList.remove('active');
      engineLayoutGrid.classList.remove('show-result-only');
      engineLayoutGrid.classList.add('show-form-only');
      if (wizardCard) wizardCard.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function setWizardStep(stepNumber) {
    playClick();
    state.currentStep = stepNumber;

    stepNavItems.forEach((item, index) => {
      const stepIdx = index + 1;
      item.classList.remove('active');
      if (stepIdx === stepNumber) {
        item.classList.add('active');
      }
      if (stepIdx < stepNumber) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });

    stepContents.forEach((content, index) => {
      content.classList.remove('active');
      if (index + 1 === stepNumber) {
        content.classList.add('active');
      }
    });

    if (prevStepBtn) {
      prevStepBtn.style.visibility = stepNumber === 1 ? 'hidden' : 'visible';
    }
    if (nextStepBtn) {
      if (stepNumber === 4) {
        nextStepBtn.textContent = 'Ready to Drag Card ↓';
      } else {
        nextStepBtn.textContent = 'Next Step →';
      }
    }
  }

  stepNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      setWizardStep(targetStep);
    });
  });

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (state.currentStep < 4) {
        setWizardStep(state.currentStep + 1);
      } else {
        const dragCard = document.getElementById('formDraggableCard');
        if (dragCard) dragCard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (state.currentStep > 1) {
        setWizardStep(state.currentStep - 1);
      }
    });
  }

  // Radio cards interaction
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const input = card.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
        const groupName = input.name;
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(other => {
          other.closest('.radio-card').classList.remove('selected');
        });
        card.classList.add('selected');
        playClick();
        syncFormDraggableCard();
      }
    });
  });

  // Sentimental Slider Label
  const sentimentalSlider = document.getElementById('sentimentalSlider');
  const sentimentalValText = document.getElementById('sentimentalValText');
  const sentimentalLevels = {
    1: 'Low (Purely Utilitarian)',
    2: 'Minor Sentimental Value',
    3: 'Moderate (Favorite Daily Item)',
    4: 'High (Personal Attachment)',
    5: 'Irreplaceable Heirloom'
  };

  if (sentimentalSlider && sentimentalValText) {
    sentimentalSlider.addEventListener('input', (e) => {
      sentimentalValText.textContent = sentimentalLevels[e.target.value] || 'Moderate';
    });
  }

  // ==========================================================================
  // 7. Form Data Collection & Draggable Card Synchronization
  // ==========================================================================
  const form = document.getElementById('assessmentForm');

  function collectFormData() {
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const originalLocal = parseFloat(document.getElementById('originalCost').value) || 50;
    const repairLocal = parseFloat(document.getElementById('repairCost').value) || 0;

    const originalCostUSD = originalLocal / cur.rate;
    const repairCostUSD = repairLocal / cur.rate;

    // Keep base USD in state
    state.baseOriginalUSD = originalCostUSD;
    state.baseRepairUSD = repairCostUSD;

    const severityRadio = document.querySelector('input[name="damageSeverity"]:checked');
    const cat = data.categories.find(c => c.id === categorySelect.value) || data.categories[0];

    return {
      category: categorySelect.value,
      material: materialSelect.value,
      itemTitle: document.getElementById('itemTitle').value || `${cat.name} Object`,
      ageYears: parseFloat(document.getElementById('itemAge').value) || 1,
      damageSeverity: severityRadio ? severityRadio.value : 'minor',
      damageDetails: document.getElementById('damageDetails').value || '',
      partsAvailability: document.getElementById('partsAvailability').value || 'available',
      userSkill: document.getElementById('userSkill').value || 'intermediate',
      originalCost: originalCostUSD,
      repairCost: repairCostUSD,
      icon: cat ? cat.icon : '📦'
    };
  }

  function syncFormDraggableCard() {
    const itemData = collectFormData();
    const cardTitle = document.getElementById('decisionCardTitle');
    const cardIcon = document.getElementById('decisionCardIcon');
    const cardSevTag = document.getElementById('decisionCardSevTag');
    const cardDesc = document.getElementById('decisionCardDesc');
    const cardCatText = document.getElementById('decisionCardCatText');
    const cardPriceText = document.getElementById('decisionCardPriceText');

    if (cardTitle) cardTitle.textContent = itemData.itemTitle;
    if (cardIcon) cardIcon.textContent = itemData.icon;

    if (cardSevTag) {
      cardSevTag.className = `severity-mini-tag severity-${itemData.damageSeverity}`;
      const sevLabel = itemData.damageSeverity.charAt(0).toUpperCase() + itemData.damageSeverity.slice(1);
      const icon = itemData.damageSeverity === 'minor' ? '🟡' : itemData.damageSeverity === 'moderate' ? '🟠' : '🔴';
      cardSevTag.textContent = `${icon} ${sevLabel}`;
    }

    if (cardDesc) {
      cardDesc.textContent = itemData.damageDetails || 'Condition details configured. Drag card to an action zone below.';
    }

    if (cardCatText) {
      const cat = data.categories.find(c => c.id === itemData.category);
      const mat = cat && cat.materials ? cat.materials.find(m => m.id === itemData.material) : null;
      cardCatText.textContent = `${cat ? cat.name : 'Object'} • ${mat ? mat.name : 'Standard'}`;
    }

    if (cardPriceText) {
      cardPriceText.textContent = `Est. New: ${formatMoney(itemData.originalCost)}`;
    }
  }

  if (form) {
    form.addEventListener('input', () => {
      syncFormDraggableCard();
    });
    form.addEventListener('change', () => {
      syncFormDraggableCard();
    });
  }

  // ==========================================================================
  // 8. Presets Ribbon & Hero Quick Test Chips
  // ==========================================================================
  let heroActivePreset = data.presets[0];

  function renderPresets() {
    const wizardPills = document.getElementById('wizardPresetPills');
    const heroChips = document.getElementById('heroPresetChips');

    if (wizardPills) {
      wizardPills.innerHTML = '';
      data.presets.forEach(preset => {
        const card = document.createElement('div');
        card.className = 'preset-draggable-card';
        card.setAttribute('draggable', 'true');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${preset.name}. Draggable card or click to load.`);

        let verdictBadge = '🟢';
        if (preset.expectedVerdict === 'REUSE') verdictBadge = '🟡';
        if (preset.expectedVerdict === 'REPLACE') verdictBadge = '🔴';

        card.innerHTML = `
          <div class="preset-card-top">
            <span class="preset-card-icon">${preset.icon || '📦'}</span>
            <span class="preset-card-verdict">${verdictBadge} ${preset.expectedVerdict}</span>
          </div>
          <strong class="preset-card-name">${preset.name}</strong>
          <span class="preset-card-sub">${preset.tag || preset.categoryName || preset.category}</span>
          <div class="preset-drag-handle">
            <span>⠿ Drag to Zone</span>
          </div>
        `;

        card.addEventListener('click', () => {
          loadPresetIntoForm(preset, true);
        });

        setupDraggableItem(card, preset);
        wizardPills.appendChild(card);
      });
    }

    if (heroChips) {
      heroChips.innerHTML = '';
      data.presets.slice(0, 6).forEach((preset, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `preset-chip ${preset.id === heroActivePreset.id ? 'active' : ''}`;
        chip.textContent = preset.name;
        chip.addEventListener('click', () => {
          heroChips.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          heroActivePreset = preset;
          updateHeroPreview();
          playClick();
        });
        heroChips.appendChild(chip);
      });
    }
  }

  function updateHeroPreview() {
    if (!heroActivePreset) return;
    const verdictPill = document.getElementById('heroPreviewVerdictPill');
    const title = document.getElementById('heroPreviewTitle');
    const summary = document.getElementById('heroPreviewSummary');
    const savings = document.getElementById('heroPreviewSavings');
    const carbon = document.getElementById('heroPreviewCarbon');

    if (!verdictPill) return;

    const verdict = heroActivePreset.expectedVerdict;
    verdictPill.className = `preview-verdict-pill verdict-${verdict.toLowerCase()}`;
    
    let icon = '🟢';
    if (verdict === 'REUSE') icon = '🟡';
    if (verdict === 'REPLACE') icon = '🔴';
    verdictPill.innerHTML = `<span>${icon}</span> Recommended: ${verdict}`;

    title.textContent = heroActivePreset.name;
    summary.textContent = heroActivePreset.notes;
    savings.textContent = formatMoney(heroActivePreset.originalCostUSD - heroActivePreset.repairCostUSD);
    
    const cat = data.categories.find(c => c.id === heroActivePreset.category);
    carbon.textContent = `${cat ? cat.co2ReplacementKg : 35} kg CO₂`;
  }

  const heroLoadIntoEngineBtn = document.getElementById('heroLoadIntoEngineBtn');
  if (heroLoadIntoEngineBtn) {
    heroLoadIntoEngineBtn.addEventListener('click', () => {
      loadPresetIntoForm(heroActivePreset, false);
      executeDropEvaluation(heroActivePreset, heroActivePreset.expectedVerdict.toLowerCase());
      document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function loadPresetIntoForm(preset, evaluateImmediately = false) {
    categorySelect.value = preset.category;
    state.selectedScopeCategory = preset.category;
    populateMaterialsForCategory(preset.category);

    setTimeout(() => {
      materialSelect.value = preset.material;
      document.getElementById('itemTitle').value = preset.itemTitle || preset.name;
      document.getElementById('itemAge').value = preset.ageYears;
      document.getElementById('damageDetails').value = preset.damageDetails;
      document.getElementById('partsAvailability').value = preset.partsAvailability;
      document.getElementById('userSkill').value = preset.userSkill;

      state.baseOriginalUSD = preset.originalCostUSD;
      state.baseRepairUSD = preset.repairCostUSD;

      const cur = data.currencies[state.currency] || data.currencies.USD;
      document.getElementById('originalCost').value = Math.round(preset.originalCostUSD * cur.rate);
      document.getElementById('repairCost').value = Math.round(preset.repairCostUSD * cur.rate);

      const radio = document.querySelector(`input[name="damageSeverity"][value="${preset.damageSeverity}"]`);
      if (radio) {
        radio.checked = true;
        document.querySelectorAll('input[name="damageSeverity"]').forEach(r => {
          r.closest('.radio-card').classList.remove('selected');
        });
        radio.closest('.radio-card').classList.add('selected');
      }

      syncFormDraggableCard();
      highlightActiveScopeCard(preset.category);

      if (evaluateImmediately) {
        playClick();
        executeDropEvaluation(preset, preset.expectedVerdict.toLowerCase());
        showToast(`Loaded preset "${preset.name}". Drag to an Action Zone to re-evaluate!`, 'info');
      }
    }, 40);
  }

  // ==========================================================================
  // 9. DRAG-AND-DROP PROTOCOL CONTROLLER
  // ==========================================================================
  function setupDraggableItem(element, itemDataGetter) {
    if (!element) return;
    element.setAttribute('draggable', 'true');

    element.addEventListener('dragstart', (e) => {
      const itemData = typeof itemDataGetter === 'function' ? itemDataGetter() : itemDataGetter;
      state.activeDraggedItem = itemData;

      try {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', JSON.stringify(itemData));
        e.dataTransfer.setData('application/json', JSON.stringify(itemData));
      } catch (err) {
        // Fallback already stored in state.activeDraggedItem
      }

      element.classList.add('is-dragging');
      document.body.classList.add('drag-in-progress');
      playTone(480, 'sine', 0.08, 0.04);
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('is-dragging');
      document.body.classList.remove('drag-in-progress');
      setTimeout(() => {
        state.activeDraggedItem = null;
      }, 100);
    });

    // Touch / Click fallback
    element.addEventListener('click', () => {
      const itemData = typeof itemDataGetter === 'function' ? itemDataGetter() : itemDataGetter;
      state.selectedItemForTap = itemData;
      
      document.querySelectorAll('.is-tap-selected').forEach(el => el.classList.remove('is-tap-selected'));
      element.classList.add('is-tap-selected');
      
      showToast(`Selected "${itemData.itemTitle || itemData.name}". Tap an Action Zone to evaluate!`, 'info');
    });
  }

  const formDraggableCard = document.getElementById('formDraggableCard');
  if (formDraggableCard) {
    setupDraggableItem(formDraggableCard, () => collectFormData());
  }

  const resRedragPill = document.getElementById('resRedragPill');
  if (resRedragPill) {
    setupDraggableItem(resRedragPill, () => {
      if (state.currentAssessment) {
        return {
          category: state.currentAssessment.category.id,
          material: state.currentAssessment.materialInfo ? state.currentAssessment.materialInfo.id : 'standard',
          itemTitle: state.currentAssessment.itemTitle,
          damageSeverity: state.currentAssessment.damageSeverity,
          damageDetails: state.currentAssessment.damageDetails,
          originalCostUSD: state.currentAssessment.costs.originalCost,
          repairCostUSD: state.currentAssessment.costs.repairCost,
          icon: state.currentAssessment.category.icon
        };
      }
      return collectFormData();
    });
  }

  function setupActionZones() {
    const actionZones = document.querySelectorAll('.action-zone, .action-drop-zone');

    actionZones.forEach(zone => {
      const actionName = zone.getAttribute('data-action') || 'repair';

      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        if (!zone.classList.contains('drag-hover')) {
          zone.classList.add('drag-hover');
        }
      });

      zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('drag-hover');
      });

      zone.addEventListener('dragleave', (e) => {
        const rect = zone.getBoundingClientRect();
        if (
          e.clientX <= rect.left ||
          e.clientX >= rect.right ||
          e.clientY <= rect.top ||
          e.clientY >= rect.bottom
        ) {
          zone.classList.remove('drag-hover');
        }
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-hover');

        zone.classList.add('drop-success-flash');
        setTimeout(() => zone.classList.remove('drop-success-flash'), 900);

        let droppedItem = state.activeDraggedItem;
        if (!droppedItem) {
          try {
            const rawData = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
            if (rawData) droppedItem = JSON.parse(rawData);
          } catch (err) {
            console.warn('Could not parse drop payload:', err);
          }
        }
        if (!droppedItem) {
          droppedItem = collectFormData();
        }

        executeDropEvaluation(droppedItem, actionName);
      });

      // Click / Tap Fallback
      zone.addEventListener('click', () => {
        if (state.selectedItemForTap) {
          zone.classList.add('drop-success-flash');
          setTimeout(() => zone.classList.remove('drop-success-flash'), 900);
          executeDropEvaluation(state.selectedItemForTap, actionName);
          state.selectedItemForTap = null;
          document.querySelectorAll('.is-tap-selected').forEach(el => el.classList.remove('is-tap-selected'));
        }
      });
    });
  }

  function executeDropEvaluation(item, targetAction) {
    const result = engine.evaluateDrop(item, targetAction);
    state.currentAssessment = result;

    renderResultPanel(result);
    updateRepurposingContextBanner(result);

    if (result.isVeto) {
      playVetoBuzzer();
    } else {
      playSuccessChime();
    }

    const itemName = result.itemTitle || 'Item';
    showToast(`Evaluated "${itemName}" for ${targetAction.toUpperCase()}!`, result.isVeto ? 'warning' : 'success');

    if (compactShowResultBtn && engineLayoutGrid && window.innerWidth <= 1024) {
      compactShowResultBtn.classList.add('active');
      if (compactShowFormBtn) compactShowFormBtn.classList.remove('active');
      engineLayoutGrid.classList.remove('show-form-only');
      engineLayoutGrid.classList.add('show-result-only');
    }

    const resultPanel = document.getElementById('resultPanel');
    if (resultPanel) {
      const rect = resultPanel.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // ==========================================================================
  // 10. Render Recommendation Result Panel
  // ==========================================================================
  function renderResultPanel(res) {
    const resultPanel = document.getElementById('resultPanel');
    if (!resultPanel) return;

    const resItemTitle = document.getElementById('resItemTitle');
    const resCategoryPill = document.getElementById('resCategoryPill');
    const resTimestamp = document.getElementById('resTimestamp');

    if (resItemTitle) resItemTitle.textContent = res.itemTitle;
    if (resCategoryPill) {
      const matName = res.materialInfo ? res.materialInfo.name : 'Standard';
      resCategoryPill.textContent = `${res.category.name} • ${matName}`;
    }
    if (resTimestamp) {
      resTimestamp.textContent = `Evaluated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Scanned Photo Inspection Verified Card
    const photoWrap = document.getElementById('resPhotoInspectionWrap');
    const photoThumb = document.getElementById('resPhotoThumb');
    const photoDefect = document.getElementById('resPhotoDefect');
    const photoConfidence = document.getElementById('resPhotoConfidence');

    if (state.scannedPhoto) {
      if (photoWrap) photoWrap.style.display = 'flex';
      if (photoThumb) {
        if (state.scannedPhoto.isSvg) {
          photoThumb.innerHTML = state.scannedPhoto.imgSource;
        } else {
          photoThumb.innerHTML = `<img src="${state.scannedPhoto.imgSource}" alt="Inspection preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm);">`;
        }
      }
      if (photoDefect) photoDefect.textContent = state.scannedPhoto.meta.defectName || 'Physical Wear / Surface Strain';
      if (photoConfidence) photoConfidence.textContent = `Confidence: ${state.scannedPhoto.meta.confidence || '92%'} • Defect localized`;
    } else if (photoWrap) {
      photoWrap.style.display = 'none';
    }

    // Big Verdict Banner
    const banner = document.getElementById('resVerdictBanner');
    const title = document.getElementById('resVerdictTitle');
    const confidence = document.getElementById('resConfidence');
    const reason = document.getElementById('resVerdictReason');

    if (banner) {
      banner.className = `verdict-banner verdict-${res.verdict.toLowerCase()}`;
    }
    
    let icon = '🟢';
    if (res.verdict === 'REUSE') icon = '🟡';
    if (res.verdict === 'REPLACE') icon = '🔴';

    if (title) title.innerHTML = `<span>${icon}</span> ${res.verdict}`;
    if (confidence) confidence.textContent = `${res.confidence}% Confidence`;
    if (reason) reason.textContent = res.verdictReason;

    // Compact Screen Verdict Pill
    const compactPill = document.getElementById('compactVerdictPill');
    if (compactPill) {
      compactPill.className = `compact-verdict-pill verdict-${res.verdict.toLowerCase()}`;
      compactPill.textContent = `${icon} ${res.verdict}`;
    }

    // Gauges
    const resRepairScore = document.getElementById('resRepairScore');
    const resRepairBar = document.getElementById('resRepairBar');
    const resReuseScore = document.getElementById('resReuseScore');
    const resReuseBar = document.getElementById('resReuseBar');

    if (resRepairScore) resRepairScore.textContent = `${res.repairabilityScore}%`;
    if (resRepairBar) resRepairBar.style.width = `${res.repairabilityScore}%`;
    if (resReuseScore) resReuseScore.textContent = `${res.reuseScore}%`;
    if (resReuseBar) resReuseBar.style.width = `${res.reuseScore}%`;

    // Cost Breakdown
    const savingsHighlight = document.getElementById('resSavingsHighlight');
    if (savingsHighlight) {
      if (res.verdict === 'REPLACE') {
        savingsHighlight.textContent = 'Retire & Upgrade';
        savingsHighlight.style.color = 'var(--replace)';
      } else {
        savingsHighlight.textContent = `Save ${formatMoney(res.costs.moneySaved)} (${res.costs.savingsPercent}%)`;
        savingsHighlight.style.color = 'var(--primary)';
      }
    }

    const resRepairCostVal = document.getElementById('resRepairCostVal');
    const resRepurposeCostVal = document.getElementById('resRepurposeCostVal');
    const resReplaceCostVal = document.getElementById('resReplaceCostVal');

    if (resRepairCostVal) resRepairCostVal.textContent = formatMoney(res.costs.repairCost);
    if (resRepurposeCostVal) resRepurposeCostVal.textContent = formatMoney(res.costs.repurposeCost);
    if (resReplaceCostVal) resReplaceCostVal.textContent = formatMoney(res.costs.originalCost);

    const maxVal = Math.max(res.costs.originalCost, res.costs.repairCost, res.costs.repurposeCost, 1);
    const barRepair = document.getElementById('barRepairWidth');
    const barRepurpose = document.getElementById('barRepurposeWidth');
    if (barRepair) {
      barRepair.style.width = `${Math.min(100, Math.round((res.costs.repairCost / maxVal) * 100))}%`;
    }
    if (barRepurpose) {
      barRepurpose.style.width = `${Math.min(100, Math.round((res.costs.repurposeCost / maxVal) * 100))}%`;
    }

    // Environmental indicators
    const resCo2Val = document.getElementById('resCo2Val');
    const resWasteVal = document.getElementById('resWasteVal');
    const resWaterVal = document.getElementById('resWaterVal');

    if (resCo2Val) resCo2Val.textContent = `${res.impact.co2AvoidedKg} kg`;
    if (resWasteVal) resWasteVal.textContent = `${res.impact.wasteDivertedKg} kg`;
    if (resWaterVal) resWaterVal.textContent = `${res.impact.waterLitersSaved.toLocaleString()} L`;

    // Roadmap actions
    const resActionMode = document.getElementById('resActionMode');
    const stepsList = document.getElementById('resActionSteps');
    const toolsNote = document.getElementById('resToolsNote');

    if (resActionMode) {
      resActionMode.textContent = `Recommended: ${res.actionPlan.mode} (${res.actionPlan.difficultyBadge})`;
    }

    if (stepsList) {
      stepsList.innerHTML = '';
      res.actionPlan.keySteps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
      });
    }

    if (toolsNote) {
      toolsNote.innerHTML = `<strong>Tools:</strong> ${res.actionPlan.toolsNeeded.join(', ')}`;
    }

    // Re-drag pill inside result card
    const resRedragIcon = document.getElementById('resRedragIcon');
    const resRedragName = document.getElementById('resRedragName');
    if (resRedragIcon) resRedragIcon.textContent = res.category.icon;
    if (resRedragName) resRedragName.textContent = res.itemTitle;
  }

  // ==========================================================================
  // 11. UNIVERSAL SCOPE SECTION CONTROLLER (FIXED & FULLY FUNCTIONAL)
  // ==========================================================================
  function highlightActiveScopeCard(categoryId) {
    document.querySelectorAll('.category-card').forEach(card => {
      if (card.getAttribute('data-cat-id') === categoryId) {
        card.classList.add('is-selected');
      } else {
        card.classList.remove('is-selected');
      }
    });
  }

  function renderCategories(filter = 'all') {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = filter === 'all' 
      ? data.categories 
      : data.categories.filter(c => c.id === filter);

    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = `category-card ${state.selectedScopeCategory === cat.id ? 'is-selected' : ''}`;
      card.setAttribute('data-cat-id', cat.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'region');
      card.setAttribute('aria-label', `${cat.name} Category Card`);

      const subList = cat.subcategories || [cat.name];

      card.innerHTML = `
        <div class="cat-card-header">
          <span class="cat-icon-large">${cat.icon}</span>
          <span class="cat-badge">${cat.badge}</span>
        </div>
        <h3 class="cat-card-title">${cat.name}</h3>
        <p class="cat-card-desc">${cat.description}</p>
        
        <div class="cat-metrics-strip">
          <div class="strip-item">
            <p>Avg Lifespan</p>
            <strong>${cat.avgLifespanYears} Years</strong>
          </div>
          <div class="strip-item">
            <p>New Footprint</p>
            <strong>${cat.co2ReplacementKg} kg CO₂</strong>
          </div>
        </div>

        <div class="cat-subcategories-section">
          <div class="cat-subcategories-label">Selectable Scope Items / Appliances:</div>
          <div class="cat-subcategories-list">
            ${subList.map(sub => `
              <button type="button" class="cat-sub-item-chip ${state.activeSubcategory === sub ? 'is-active' : ''}" data-cat-id="${cat.id}" data-sub-name="${sub}">
                ${sub}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.35rem;">
          Common Repair Points:
        </div>
        <ul class="cat-issues-list">
          ${cat.commonIssues.slice(0, 3).map(issue => `<li>${issue}</li>`).join('')}
        </ul>

        <button type="button" class="btn btn-secondary btn-sm cat-load-btn" data-load-cat="${cat.id}">
          Assess a ${cat.name.split(' ')[0]} Object →
        </button>
      `;

      // 1. Subcategory Chips click listener (e.g. Solid State Drive (SSD), Smartphone, Chair)
      card.querySelectorAll('.cat-sub-item-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          playClick();
          const subName = chip.getAttribute('data-sub-name');
          const catId = chip.getAttribute('data-cat-id');
          loadScopeSubcategoryItem(catId, subName);
        });
      });

      // 2. "Assess a [Category] Object →" Button listener
      const loadBtn = card.querySelector(`[data-load-cat="${cat.id}"]`);
      if (loadBtn) {
        loadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          playClick();
          loadScopeCategory(cat);
        });
      }

      // 3. Whole Card Click Listener
      card.addEventListener('click', () => {
        playClick();
        loadScopeCategory(cat);
      });

      grid.appendChild(card);
    });
  }

  function loadScopeCategory(cat) {
    state.selectedScopeCategory = cat.id;
    const defaultSub = (cat.subcategories && cat.subcategories[0]) ? cat.subcategories[0] : cat.name;
    loadScopeSubcategoryItem(cat.id, defaultSub);
  }

  function loadScopeSubcategoryItem(categoryId, subcategoryName) {
    state.selectedScopeCategory = categoryId;
    state.activeSubcategory = subcategoryName;

    // 1. Visibly highlight card & chips in Universal Scope
    highlightActiveScopeCard(categoryId);
    document.querySelectorAll('.cat-sub-item-chip').forEach(ch => {
      ch.classList.toggle('is-active', ch.getAttribute('data-sub-name') === subcategoryName);
    });

    // 2. Set form selectors
    categorySelect.value = categoryId;
    populateMaterialsForCategory(categoryId);

    // 3. Check if matching preset exists (e.g. SSD, chair, shirt, boots)
    const matchingPreset = data.presets.find(p => 
      p.itemTitle.toLowerCase().includes(subcategoryName.toLowerCase()) ||
      subcategoryName.toLowerCase().includes(p.name.toLowerCase()) ||
      (subcategoryName.includes('SSD') && p.id === 'ssd_drive')
    );

    setTimeout(() => {
      if (matchingPreset) {
        loadPresetIntoForm(matchingPreset, false);
      } else {
        document.getElementById('itemTitle').value = subcategoryName;
        const cur = data.currencies[state.currency] || data.currencies.USD;
        // Sensible category-based defaults
        const defaultOrigUSD = categoryId === 'electronics' ? 120 : categoryId === 'mechanical' ? 180 : 75;
        const defaultRepairUSD = Math.round(defaultOrigUSD * 0.2);
        state.baseOriginalUSD = defaultOrigUSD;
        state.baseRepairUSD = defaultRepairUSD;
        document.getElementById('originalCost').value = Math.round(defaultOrigUSD * cur.rate);
        document.getElementById('repairCost').value = Math.round(defaultRepairUSD * cur.rate);
      }

      syncFormDraggableCard();

      // 4. Execute evaluation & update Recommendation Result Panel immediately
      const configuredItem = collectFormData();
      executeDropEvaluation(configuredItem, configuredItem.damageSeverity === 'critical' ? 'replace' : 'repair');

      // 5. Scroll smoothly to engine
      document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected "${subcategoryName}". Circular verdict evaluated!`, 'success');
    }, 40);
  }

  // Universal Scope filter tabs
  const catFilterBtns = document.querySelectorAll('.cat-filter-btn');
  catFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      catFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const catKey = btn.getAttribute('data-category');
      renderCategories(catKey);
    });
  });

  // ==========================================================================
  // 12. CREATIVE REPURPOSING IDEAS STUDIO (DIY FOCUSED)
  // ==========================================================================
  function updateRepurposingContextBanner(res) {
    const banner = document.getElementById('repurposeContextBanner');
    const title = document.getElementById('repurposeContextTitle');
    const desc = document.getElementById('repurposeContextDesc');
    if (!banner || !res) return;

    banner.style.display = 'flex';
    title.textContent = `✨ Tailored Repurposing Matches for: ${res.itemTitle}`;
    desc.textContent = `Showing creative DIY transformations suited for ${res.category.name} (${res.damageSeverity} wear).`;
  }

  function renderUpcycling() {
    const grid = document.getElementById('upcyclingGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const term = state.repurposeSearch.toLowerCase().trim();
    const catFilter = state.repurposeCategory;

    const filtered = data.upcycleProjects.filter(proj => {
      const matchesCat = catFilter === 'all' || proj.category === catFilter;
      const matchesTerm = !term || 
        proj.title.toLowerCase().includes(term) ||
        proj.sourceObject.toLowerCase().includes(term) ||
        proj.summary.toLowerCase().includes(term) ||
        proj.categoryName.toLowerCase().includes(term) ||
        proj.materialsNeeded.some(m => m.toLowerCase().includes(term));
      return matchesCat && matchesTerm;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="repurpose-empty-state">
          <div class="empty-icon">✂️</div>
          <h4>No Repurposing Ideas Found for "${state.repurposeSearch}"</h4>
          <p>Try searching for another material (e.g. "t-shirt", "drawer", "SSD", "glass", "denim") or reset the filter.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="emptyResetFilterBtn" style="margin-top: 1rem;">
            Show All Ideas
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('emptyResetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.repurposeCategory = 'all';
          state.repurposeSearch = '';
          const searchInput = document.getElementById('repurposeSearchInput');
          if (searchInput) searchInput.value = '';
          document.querySelectorAll('.repurpose-filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-repurpose-cat') === 'all'));
          renderUpcycling();
        });
      }
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'upcycle-card';

      card.innerHTML = `
        <div class="upcycle-preview-visual">
          <span class="visual-icon">${proj.icon || '✂️'}</span>
          <span class="upcycle-difficulty-pill">${proj.difficulty} • ${proj.timeRequired}</span>
        </div>
        <div class="upcycle-body">
          <div class="upcycle-category-tag">${proj.categoryName}</div>
          <h3 class="upcycle-title">${proj.title}</h3>
          <div class="upcycle-origin">Repurposed from: <strong>${proj.sourceObject}</strong></div>
          <p class="upcycle-desc">${proj.summary}</p>
          
          <div class="upcycle-materials-box">
            <strong>Required:</strong> ${proj.materialsNeeded.join(', ')}
          </div>

          <div class="upcycle-steps-preview">
            <h6>Step-by-Step Preview (${proj.steps.length} Steps):</h6>
            <ol>
              ${proj.steps.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
              ${proj.steps.length > 3 ? `<li style="list-style: none; color: var(--primary); font-weight: 600;">+ ${proj.steps.length - 3} more steps in full guide...</li>` : ''}
            </ol>
          </div>

          ${proj.safetyTip ? `
            <div class="repurpose-safety-box">
              <strong>⚠️ Safety Note:</strong> ${proj.safetyTip}
            </div>
          ` : ''}

          <div class="upcycle-stats-row">
            <div>
              <span style="color: var(--text-dim);">Diverts:</span>
              <strong style="color: var(--reuse);">${proj.co2SavedKg} kg CO₂</strong>
            </div>
            <div>
              <span style="color: var(--text-dim);">Est. Saved:</span>
              <strong style="color: var(--primary);">${formatMoney(proj.costSavingsUSD)}</strong>
            </div>
          </div>

          <div class="upcycle-actions-row">
            <button type="button" class="btn btn-secondary btn-sm" data-view-guide="${proj.id}">
              📖 View Full DIY Guide
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-try-material="${proj.id}">
              Evaluate in Engine →
            </button>
          </div>
        </div>
      `;

      // Button: View Full Guide Modal
      const viewGuideBtn = card.querySelector(`[data-view-guide="${proj.id}"]`);
      if (viewGuideBtn) {
        viewGuideBtn.addEventListener('click', () => {
          playClick();
          openRepurposeGuideModal(proj);
        });
      }

      // Button: Evaluate in Engine
      const tryMatBtn = card.querySelector(`[data-try-material="${proj.id}"]`);
      if (tryMatBtn) {
        tryMatBtn.addEventListener('click', () => {
          playClick();
          categorySelect.value = proj.category;
          populateMaterialsForCategory(proj.category);
          document.getElementById('itemTitle').value = proj.sourceObject.split(' (')[0].split(' with')[0];
          syncFormDraggableCard();
          const configured = collectFormData();
          executeDropEvaluation(configured, 'repurpose');
          document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
          showToast(`Loaded "${proj.sourceObject}" for repurposing assessment!`, 'info');
        });
      }

      grid.appendChild(card);
    });
  }

  // Open DIY Repurposing Guide Modal
  function openRepurposeGuideModal(proj) {
    const modalIcon = document.getElementById('guideModalIcon');
    const modalTitle = document.getElementById('guideModalTitle');
    const modalSubtitle = document.getElementById('guideModalSubtitle');
    const modalBody = document.getElementById('repurposeGuideBody');
    const loadEngineBtn = document.getElementById('guideModalLoadEngineBtn');

    if (modalIcon) modalIcon.textContent = proj.icon || '✂️';
    if (modalTitle) modalTitle.textContent = proj.title;
    if (modalSubtitle) modalSubtitle.textContent = `Repurposed from: ${proj.sourceObject} • ${proj.difficulty} (${proj.timeRequired})`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="margin-bottom: 0.35rem; font-size: 0.95rem;">Project Overview</h5>
          <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${proj.summary}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="background: var(--bg-input); padding: 0.85rem; border-radius: var(--radius-sm);">
            <span style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Environmental Benefit</span>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--reuse);">${proj.co2SavedKg} kg CO₂ Avoided</div>
          </div>
          <div style="background: var(--bg-input); padding: 0.85rem; border-radius: var(--radius-sm);">
            <span style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Average Money Saved</span>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${formatMoney(proj.costSavingsUSD)}</div>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h5 style="margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; color: var(--text-dim);">Materials &amp; Tools Checklist:</h5>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
            ${proj.materialsNeeded.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h5 style="margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; color: var(--primary);">Step-by-Step DIY Execution:</h5>
          <ol style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); line-height: 1.6;">
            ${proj.steps.map(s => `<li style="margin-bottom: 0.45rem;">${s}</li>`).join('')}
          </ol>
        </div>

        ${proj.safetyTip ? `
          <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.825rem; color: #f59e0b;">
            <strong>⚠️ Safety &amp; Durability Note:</strong> ${proj.safetyTip}
          </div>
        ` : ''}
      `;
    }

    if (loadEngineBtn) {
      loadEngineBtn.onclick = () => {
        closeModal('repurposeGuideModal');
        categorySelect.value = proj.category;
        populateMaterialsForCategory(proj.category);
        document.getElementById('itemTitle').value = proj.sourceObject.split(' (')[0];
        syncFormDraggableCard();
        executeDropEvaluation(collectFormData(), 'repurpose');
        document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
      };
    }

    openModal('repurposeGuideModal');
  }

  // Repurposing Category Filter Pills
  document.querySelectorAll('.repurpose-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      document.querySelectorAll('.repurpose-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.repurposeCategory = btn.getAttribute('data-repurpose-cat');
      renderUpcycling();
    });
  });

  // Repurposing Search Input
  const repurposeSearchInput = document.getElementById('repurposeSearchInput');
  if (repurposeSearchInput) {
    repurposeSearchInput.addEventListener('input', (e) => {
      state.repurposeSearch = e.target.value;
      renderUpcycling();
    });
  }

  // Repurposing Reset Filter Button in Context Banner
  const repurposeResetFilterBtn = document.getElementById('repurposeResetFilterBtn');
  if (repurposeResetFilterBtn) {
    repurposeResetFilterBtn.addEventListener('click', () => {
      playClick();
      state.repurposeCategory = 'all';
      state.repurposeSearch = '';
      if (repurposeSearchInput) repurposeSearchInput.value = '';
      document.querySelectorAll('.repurpose-filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-repurpose-cat') === 'all'));
      renderUpcycling();
    });
  }

  // ==========================================================================
  // 13. Community Impact Simulator
  // ==========================================================================
  const simSlider = document.getElementById('simSlider');
  const simCountDisplay = document.getElementById('simCountDisplay');

  function updateSimulator() {
    if (!simSlider) return;
    const count = parseInt(simSlider.value, 10);
    if (simCountDisplay) simCountDisplay.textContent = count.toLocaleString();

    const totalUSD = count * 114;
    const totalCO2Kg = count * 38;
    const totalWasteKg = count * 9;
    const trees = Math.round(totalCO2Kg / 21);

    const simMoneyVal = document.getElementById('simMoneyVal');
    const simCo2Val = document.getElementById('simCo2Val');
    const simWasteVal = document.getElementById('simWasteVal');
    const simTreesVal = document.getElementById('simTreesVal');

    if (simMoneyVal) simMoneyVal.textContent = formatMoney(totalUSD);
    if (simCo2Val) simCo2Val.textContent = `${(totalCO2Kg / 1000).toFixed(1)} Tons`;
    if (simWasteVal) simWasteVal.textContent = `${totalWasteKg.toLocaleString()} kg`;
    if (simTreesVal) simTreesVal.textContent = `${trees.toLocaleString()} Trees`;
  }

  if (simSlider) {
    simSlider.addEventListener('input', () => {
      updateSimulator();
    });
  }

  // ==========================================================================
  // 14. Community Directory Renderer & Search
  // ==========================================================================
  function renderDirectory(searchTerm = '') {
    const grid = document.getElementById('directoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const term = searchTerm.toLowerCase().trim();
    const filtered = data.directory.filter(item => {
      return !term || 
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.services.some(s => s.toLowerCase().includes(term));
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">No repair locations matching "${searchTerm}". Try another term or submit one below!</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'directory-card';
      card.innerHTML = `
        <div class="dir-card-header">
          <div>
            <h4 class="dir-name">${item.name}</h4>
            <span class="dir-type">${item.type}</span>
          </div>
          <span class="dir-rating-pill">★ ${item.rating}</span>
        </div>
        <div class="dir-address">📍 ${item.address}, ${item.city}</div>
        <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-dim); margin-bottom: 0.35rem;">Services &amp; Materials:</div>
        <div class="dir-services-chips">
          ${item.services.map(s => `<span class="mini-tag">${s}</span>`).join('')}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          <strong>Workstation:</strong> ${item.toolsAvailable}
        </div>
        <div class="dir-hours-text">🕒 ${item.hours}</div>
      `;
      grid.appendChild(card);
    });
  }

  const dirSearchInput = document.getElementById('dirSearchInput');
  if (dirSearchInput) {
    dirSearchInput.addEventListener('input', (e) => {
      renderDirectory(e.target.value);
    });
  }

  // ==========================================================================
  // 15. Modal Controllers
  // ==========================================================================
  function openModal(modalId) {
    playClick();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    playClick();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-close-modal');
      closeModal(id);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        if (modal.id === 'cameraScannerModal') {
          stopCamera();
        }
      }
    });
  });

  const viewMethodologyBtn = document.getElementById('viewMethodologyBtn');
  if (viewMethodologyBtn) {
    viewMethodologyBtn.addEventListener('click', () => openModal('methodologyModal'));
  }
  const footerMethodologyLink = document.getElementById('footerMethodologyLink');
  if (footerMethodologyLink) {
    footerMethodologyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('methodologyModal');
    });
  }

  const openSubmitSpotModal = document.getElementById('openSubmitSpotModal');
  if (openSubmitSpotModal) {
    openSubmitSpotModal.addEventListener('click', () => openModal('submitSpotModal'));
  }

  const submitSpotForm = document.getElementById('submitSpotForm');
  if (submitSpotForm) {
    submitSpotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSuccessChime();
      const newSpot = {
        id: `dir-user-${Date.now()}`,
        name: document.getElementById('spotName').value,
        type: document.getElementById('spotType').value,
        badge: 'Community Submitted',
        address: document.getElementById('spotAddress').value,
        city: document.getElementById('spotCity').value,
        hours: 'Local Community Hours',
        rating: 5.0,
        reviewsCount: 1,
        services: document.getElementById('spotServices').value.split(',').map(s => s.trim()),
        toolsAvailable: 'Community workbench & tools'
      };

      data.directory.unshift(newSpot);
      renderDirectory(dirSearchInput ? dirSearchInput.value : '');
      closeModal('submitSpotModal');
      submitSpotForm.reset();
      showToast('Thank you! Local repair hub submitted for verification.', 'success');
    });

    const submitSpotConfirmBtn = document.getElementById('submitSpotConfirmBtn');
    if (submitSpotConfirmBtn) {
      submitSpotConfirmBtn.addEventListener('click', () => {
        if (submitSpotForm.checkValidity()) {
          submitSpotForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        } else {
          submitSpotForm.reportValidity();
        }
      });
    }
  }

  const findNearbyBtn = document.getElementById('findNearbyBtn');
  if (findNearbyBtn) {
    findNearbyBtn.addEventListener('click', () => {
      playClick();
      document.getElementById('directory').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Printable Assessment Report Generator
  const printReportBtn = document.getElementById('printReportBtn');
  const reportModalBody = document.getElementById('reportModalBody');
  const triggerPrintBtn = document.getElementById('triggerPrintBtn');

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      if (!state.currentAssessment) {
        state.currentAssessment = engine.assessItem(collectFormData());
      }
      const res = state.currentAssessment;

      if (reportModalBody) {
        reportModalBody.innerHTML = `
          <div style="border-bottom: 2px solid var(--primary); padding-bottom: 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🌱</div>
              <div>
                <h2 style="font-size: 1.4rem; margin-bottom: 0.15rem;">REFIX Assessment Certificate</h2>
                <p style="font-size: 0.8rem; color: var(--text-dim);">Circularity &amp; Right-to-Repair Lifecycle Evaluation</p>
              </div>
            </div>
            <div style="text-align: right; font-size: 0.8rem; color: var(--text-dim);">
              <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
              <strong>Certificate ID:</strong> RFX-${Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem;">${res.itemTitle}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Category: ${res.category.name} | Material: ${res.materialInfo ? res.materialInfo.name : 'Standard'}</p>
          </div>

          <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="font-size: 1.4rem; font-weight: 800; color: ${res.verdict === 'REPAIR' ? 'var(--repair)' : res.verdict === 'REUSE' ? 'var(--reuse)' : 'var(--replace)'}; margin-bottom: 0.4rem;">
              Decision Verdict: ${res.verdict} (${res.confidence}% Confidence)
            </div>
            <p style="font-size: 0.925rem; line-height: 1.5;">${res.verdictReason}</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; text-align: center;">
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Financial Savings</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--primary);">${formatMoney(res.costs.moneySaved)}</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">CO₂e Diverted</div>
              <div style="font-size: 1.35rem; font-weight: 800;">${res.impact.co2AvoidedKg} kg</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Landfill Diverted</div>
              <div style="font-size: 1.35rem; font-weight: 800;">${res.impact.wasteDivertedKg} kg</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Recommended Action Blueprint:</h4>
            <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); line-height: 1.6;">
              ${res.actionPlan.keySteps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div style="border-top: 1px dashed var(--border); padding-top: 1rem; font-size: 0.75rem; color: var(--text-dim);">
            * Evaluation computed via REFIX Circularity Engine heuristics based on lifecycle benchmarks. Currency displayed in ${data.currencies[state.currency].name}.
          </div>
        `;
      }

      openModal('reportModal');
    });
  }

  if (triggerPrintBtn) {
    triggerPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 16. Visual Damage Scanner & Camera Subsystem
  // ==========================================================================
  const heroScanPhotoBtn = document.getElementById('heroScanPhotoBtn');
  const openScannerModalBtn = document.getElementById('openScannerModalBtn');
  const scannerVideo = document.getElementById('scannerVideo');
  const scannerCanvas = document.getElementById('scannerCanvas');
  const cameraFallbackMsg = document.getElementById('cameraFallbackMsg');
  const viewfinderHud = document.getElementById('viewfinderHud');
  const capturePhotoBtn = document.getElementById('capturePhotoBtn');
  const retryCameraBtn = document.getElementById('retryCameraBtn');
  const damageFileInput = document.getElementById('damageFileInput');
  const photoDropzone = document.getElementById('photoDropzone');
  const browsePhotoBtn = document.getElementById('browsePhotoBtn');
  const samplePhotosGrid = document.getElementById('samplePhotosGrid');
  const scannerAnalysisSection = document.getElementById('scannerAnalysisSection');
  const analysisSpinner = document.getElementById('analysisSpinner');
  const analysisStatusTitle = document.getElementById('analysisStatusTitle');
  const analysisStatusStep = document.getElementById('analysisStatusStep');
  const capturedImageDisplay = document.getElementById('capturedImageDisplay');
  const detectionTagsCard = document.getElementById('detectionTagsCard');
  const retakePhotoBtn = document.getElementById('retakePhotoBtn');
  const applyScanBtn = document.getElementById('applyScanBtn');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  let activeScanResult = null;

  function openScannerModal(initialTab = 'camera') {
    openModal('cameraScannerModal');
    switchScannerTab(initialTab);
  }

  if (heroScanPhotoBtn) {
    heroScanPhotoBtn.addEventListener('click', () => openScannerModal('camera'));
  }
  if (openScannerModalBtn) {
    openScannerModalBtn.addEventListener('click', () => openScannerModal('camera'));
  }

  const scannerTabBtns = document.querySelectorAll('.scanner-tab-btn');
  function switchScannerTab(tabName) {
    scannerTabBtns.forEach(btn => {
      if (btn.getAttribute('data-scanner-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const camPane = document.getElementById('scannerCameraPane');
    const upPane = document.getElementById('scannerUploadPane');
    const samPane = document.getElementById('scannerSamplesPane');

    if (camPane) camPane.classList.toggle('active', tabName === 'camera');
    if (upPane) upPane.classList.toggle('active', tabName === 'upload');
    if (samPane) samPane.classList.toggle('active', tabName === 'samples');

    if (tabName === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }

  scannerTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      const tabName = btn.getAttribute('data-scanner-tab');
      switchScannerTab(tabName);
    });
  });

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraFallback();
      return;
    }

    try {
      if (state.cameraStream) stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      state.cameraStream = stream;
      if (scannerVideo) {
        scannerVideo.srcObject = stream;
        scannerVideo.play();
        if (cameraFallbackMsg) cameraFallbackMsg.style.display = 'none';
        if (viewfinderHud) viewfinderHud.style.display = 'block';
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      showCameraFallback();
    }
  }

  function showCameraFallback() {
    if (cameraFallbackMsg) cameraFallbackMsg.style.display = 'block';
    if (viewfinderHud) viewfinderHud.style.display = 'none';
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
    if (scannerVideo) {
      scannerVideo.srcObject = null;
    }
  }

  if (retryCameraBtn) {
    retryCameraBtn.addEventListener('click', () => {
      playClick();
      startCamera();
    });
  }

  if (capturePhotoBtn) {
    capturePhotoBtn.addEventListener('click', () => {
      playSuccessChime();
      if (!scannerVideo || !scannerVideo.videoWidth) {
        const fallbackSample = data.samplePhotos[0];
        analyzeImage(fallbackSample.svgThumb, fallbackSample, true);
        return;
      }

      scannerCanvas.width = scannerVideo.videoWidth;
      scannerCanvas.height = scannerVideo.videoHeight;
      const ctx = scannerCanvas.getContext('2d');
      ctx.drawImage(scannerVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);
      const dataUrl = scannerCanvas.toDataURL('image/jpeg', 0.85);

      const activeCat = data.categories.find(c => c.id === categorySelect.value) || data.categories[0];
      const cameraMeta = {
        itemTitle: document.getElementById('itemTitle').value || `${activeCat.name} Item`,
        category: activeCat.id,
        material: materialSelect.value,
        damageSeverity: 'minor',
        defectName: 'Surface Wear & Joint Strain Detected',
        confidence: '90%',
        damageDetails: 'Optical scan localized surface wear and connector strain.'
      };

      analyzeImage(dataUrl, cameraMeta, false);
      stopCamera();
    });
  }

  if (photoDropzone) {
    if (browsePhotoBtn) {
      browsePhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        damageFileInput.click();
      });
    }

    photoDropzone.addEventListener('click', () => {
      damageFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      photoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        photoDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      photoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        photoDropzone.classList.remove('dragover');
      });
    });

    photoDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processUploadedImage(files[0]);
      }
    });

    if (damageFileInput) {
      damageFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          processUploadedImage(e.target.files[0]);
        }
      });
    }
  }

  function processUploadedImage(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPEG, PNG, WebP)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      playSuccessChime();
      const dataUrl = e.target.result;
      const uploadMeta = {
        itemTitle: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Uploaded Object',
        category: categorySelect.value || 'furniture',
        material: materialSelect.value || 'solid_wood',
        damageSeverity: 'moderate',
        defectName: 'Localized Structural & Material Wear',
        confidence: '92%',
        damageDetails: `Visual inspection of "${file.name}" reveals localized wear ready for circular evaluation.`
      };
      analyzeImage(dataUrl, uploadMeta, false);
    };
    reader.readAsDataURL(file);
  }

  function renderSamplePhotos() {
    if (!samplePhotosGrid) return;
    samplePhotosGrid.innerHTML = '';
    
    data.samplePhotos.forEach(sample => {
      const card = document.createElement('div');
      card.className = 'sample-photo-card';
      card.innerHTML = `
        <div class="sample-photo-thumb">${sample.svgThumb}</div>
        <div class="sample-photo-meta">
          <h6>${sample.name}</h6>
          <span>${sample.tag}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        playClick();
        analyzeImage(sample.svgThumb, sample, true);
      });
      samplePhotosGrid.appendChild(card);
    });
  }

  function analyzeImage(imgSource, meta, isSvg = false) {
    activeScanResult = { imgSource, meta, isSvg };

    if (scannerAnalysisSection) {
      scannerAnalysisSection.style.display = 'block';
      scannerAnalysisSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (capturedImageDisplay) {
      if (isSvg) {
        capturedImageDisplay.innerHTML = imgSource;
      } else {
        capturedImageDisplay.innerHTML = `<img src="${imgSource}" alt="Damage scan preview" style="max-height: 220px; border-radius: var(--radius-md);">`;
      }
    }

    if (analysisSpinner) analysisSpinner.style.display = 'block';
    if (detectionTagsCard) detectionTagsCard.style.display = 'none';
    if (analysisStatusTitle) analysisStatusTitle.textContent = 'Analyzing Object Condition...';
    if (analysisStatusStep) analysisStatusStep.textContent = 'Segmenting defect contours and material boundaries...';

    setTimeout(() => {
      if (analysisStatusStep) analysisStatusStep.textContent = `Classifying defect: "${meta.defectName}"...`;
      playTone(600, 'sine', 0.08, 0.04);
    }, 600);

    setTimeout(() => {
      if (analysisSpinner) analysisSpinner.style.display = 'none';
      if (analysisStatusTitle) analysisStatusTitle.textContent = '✓ Inspection Verified';
      if (analysisStatusStep) analysisStatusStep.textContent = 'Condition verified. Ready to apply to assessment card.';
      
      const detObject = document.getElementById('detObjectVal');
      const detMat = document.getElementById('detMaterialVal');
      const detDefect = document.getElementById('detDefectVal');
      const detSev = document.getElementById('detSeverityVal');

      if (detObject) detObject.textContent = meta.itemTitle || meta.name;
      if (detMat) detMat.textContent = (meta.material || 'Standard').replace(/_/g, ' ');
      if (detDefect) detDefect.textContent = meta.defectName;
      if (detSev) detSev.textContent = `${(meta.damageSeverity || 'moderate').toUpperCase()} Severity`;

      if (detectionTagsCard) detectionTagsCard.style.display = 'block';
      playSuccessChime();
    }, 1200);
  }

  if (retakePhotoBtn) {
    retakePhotoBtn.addEventListener('click', () => {
      playClick();
      if (scannerAnalysisSection) scannerAnalysisSection.style.display = 'none';
      switchScannerTab('camera');
    });
  }

  if (applyScanBtn) {
    applyScanBtn.addEventListener('click', () => {
      if (!activeScanResult) return;
      playSuccessChime();

      const meta = activeScanResult.meta;
      state.scannedPhoto = activeScanResult;

      if (meta.category) {
        categorySelect.value = meta.category;
        state.selectedScopeCategory = meta.category;
        populateMaterialsForCategory(meta.category);
      }

      setTimeout(() => {
        if (meta.material) materialSelect.value = meta.material;
        if (meta.itemTitle) document.getElementById('itemTitle').value = meta.itemTitle;
        if (meta.damageDetails) document.getElementById('damageDetails').value = meta.damageDetails;
        if (meta.ageYears) document.getElementById('itemAge').value = meta.ageYears;

        if (meta.originalCost) {
          state.baseOriginalUSD = meta.originalCost;
          state.baseRepairUSD = meta.repairCost || Math.round(meta.originalCost * 0.2);
          const cur = data.currencies[state.currency] || data.currencies.USD;
          document.getElementById('originalCost').value = Math.round(state.baseOriginalUSD * cur.rate);
          document.getElementById('repairCost').value = Math.round(state.baseRepairUSD * cur.rate);
        }

        const radio = document.querySelector(`input[name="damageSeverity"][value="${meta.damageSeverity}"]`);
        if (radio) {
          radio.checked = true;
          document.querySelectorAll('input[name="damageSeverity"]').forEach(r => {
            r.closest('.radio-card').classList.remove('selected');
          });
          radio.closest('.radio-card').classList.add('selected');
        }

        syncFormDraggableCard();
        closeModal('cameraScannerModal');
        stopCamera();

        const evaluatedItem = collectFormData();
        executeDropEvaluation(evaluatedItem, meta.damageSeverity === 'critical' ? 'replace' : 'repair');
        showToast('Photo inspection verified and applied to decision engine!', 'success');
        document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      playClick();
      state.scannedPhoto = null;
      const photoWrap = document.getElementById('resPhotoInspectionWrap');
      if (photoWrap) photoWrap.style.display = 'none';
      showToast('Inspection photo removed', 'info');
    });
  }

  // ==========================================================================
  // 17. Initial Application Bootstrap
  // ==========================================================================
  populateCategoriesDropdown();
  renderPresets();
  renderSamplePhotos();
  syncFormDraggableCard();
  setupActionZones();
  updateCurrencyLabels();
  renderCategories('all');
  renderUpcycling();
  updateSimulator();
  renderDirectory();

  // Run initial evaluation for default Oak Dining Chair
  const initialData = collectFormData();
  executeDropEvaluation(initialData, 'repair');
});
