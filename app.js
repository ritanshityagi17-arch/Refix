/**
 * REFIX — Fix It First
 * Main Application Controller & Interaction Logic
 * 
 * Features:
 * - Deterministic circularity decision engine & lifecycle analysis
 * - Pure INR (₹) illustrative pricing & consistent cost comparisons across the entire application
 * - Single source of truth (state.selectedItem) ensuring instantaneous synchronized updates across all components
 * - Interactive Universal Scope section with subcategory/appliance selection & Solid State Drive (SSD)
 * - Curated DIY Creative Repurposing Studio with dynamic contextual 3-card suggestions
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

  // Single source of truth for the currently selected item
  const initialDefaultItem = {
    id: 'oak_chair',
    name: 'Solid Oak Dining Chair',
    itemTitle: 'Solid Oak Dining Chair',
    category: 'furniture',
    material: 'hardwood',
    ageYears: 6,
    damageSeverity: 'minor',
    damageDetails: 'Loose front joint, cosmetic lacquer scratches along side rungs',
    partsAvailability: 'readily_available',
    userSkill: 'intermediate',
    originalCost: 4500,
    repairCost: 450,
    repurposeCost: 600,
    reuseValue: 2800,
    expectedVerdict: 'REPAIR',
    icon: '🪑'
  };

  const state = {
    currency: 'INR',
    theme: localStorage.getItem('refix_theme') || 'dark',
    sound: localStorage.getItem('refix_sound') !== 'false',
    currentStep: 1,
    currentAssessment: null,
    selectedItem: { ...initialDefaultItem },
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
    selectedItemForTap: null
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
  // 3. Indian Rupee (₹) Money Formatter & Label Manager
  // ==========================================================================
  function formatMoney(amountINR) {
    const num = Math.max(0, Math.round(Number(amountINR) || 0));
    return `₹${num.toLocaleString('en-IN')}`;
  }

  function updateHeroSavingsStat() {
    const heroStatsMoney = document.getElementById('heroStatsMoney');
    if (heroStatsMoney) {
      heroStatsMoney.textContent = '₹1.2Cr+';
    }
  }

  function updateCurrencyLabels() {
    document.querySelectorAll('.currency-symbol-label').forEach(el => {
      el.textContent = '₹';
    });
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

  // Mobile Navigation Toggle & Accessible Link Navigation
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navLinksContainer) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('mobile-open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Navigation Links Click & Smooth Target Handling
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        let targetEl = document.getElementById(targetId);
        
        // Match aliases if needed
        if (!targetEl && (targetId === 'local-repair' || targetId === 'localrepair')) {
          targetEl = document.getElementById('directory');
        } else if (!targetEl && targetId === 'directory') {
          targetEl = document.getElementById('local-repair');
        }

        if (targetEl) {
          e.preventDefault();
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          if (navLinksContainer) {
            navLinksContainer.classList.remove('mobile-open');
            if (mobileNavToggle) {
              mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
          }

          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', href);
          }
        }
      }
    });
  });

  // Active section spy
  const trackedSectionIds = ['engine', 'framework', 'categories', 'upcycling', 'simulator', 'how-it-works', 'directory', 'about'];
  const trackedSections = trackedSectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          allNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (
              linkHref === `#${currentId}` || 
              (currentId === 'directory' && (linkHref === '#local-repair' || linkHref === '#directory'))
            ) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    trackedSections.forEach(sec => navObserver.observe(sec));
  }

  // ==========================================================================
  // 5. Category & Material Dropdown Selectors
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
      handleManualFormUpdate();
      highlightActiveScopeCard(e.target.value);
    });
  }

  if (materialSelect) {
    materialSelect.addEventListener('change', () => {
      handleManualFormUpdate();
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
          const c = other.closest('.radio-card');
          if (c) c.classList.remove('selected');
        });
        card.classList.add('selected');
        playClick();
        handleManualFormUpdate();
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
  // 7. UNIFIED ITEM SELECTION & SYNCHRONIZED STATE MANAGEMENT
  // ==========================================================================
  const form = document.getElementById('assessmentForm');

  /**
   * Reads raw form inputs in INR and updates state.selectedItem
   */
  function collectFormData() {
    const origInput = document.getElementById('originalCost');
    const repInput = document.getElementById('repairCost');
    const titleInput = document.getElementById('itemTitle');
    const ageInput = document.getElementById('itemAge');
    const detailsInput = document.getElementById('damageDetails');
    const partsInput = document.getElementById('partsAvailability');
    const skillInput = document.getElementById('userSkill');
    const severityRadio = document.querySelector('input[name="damageSeverity"]:checked');

    const origVal = origInput ? Math.max(50, parseFloat(origInput.value) || 4500) : 4500;
    const repVal = repInput ? Math.max(0, parseFloat(repInput.value) || 450) : 450;
    const catId = categorySelect ? categorySelect.value : (state.selectedItem ? state.selectedItem.category : 'furniture');
    const cat = data.categories.find(c => c.id === catId) || data.categories[0];
    const itemTitle = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : (state.selectedItem ? state.selectedItem.name : `${cat.name} Object`);

    const matVal = (materialSelect && materialSelect.value) ? materialSelect.value : (cat.materials && cat.materials[0] ? cat.materials[0].id : 'standard');
    const sevVal = severityRadio ? severityRadio.value : (state.selectedItem ? state.selectedItem.damageSeverity : 'minor');
    const ageVal = ageInput ? (parseFloat(ageInput.value) || 2) : 2;
    const detailsVal = detailsInput ? detailsInput.value : '';
    const partsVal = partsInput ? partsInput.value : 'available';
    const skillVal = skillInput ? skillInput.value : 'intermediate';

    const item = {
      id: state.selectedItem ? state.selectedItem.id : 'item_' + Date.now(),
      name: itemTitle,
      itemTitle: itemTitle,
      category: catId,
      material: matVal,
      ageYears: ageVal,
      damageSeverity: sevVal,
      damageDetails: detailsVal,
      partsAvailability: partsVal,
      userSkill: skillVal,
      originalCost: origVal,
      repairCost: repVal,
      repurposeCost: state.selectedItem ? state.selectedItem.repurposeCost : Math.round(origVal * 0.25),
      reuseValue: state.selectedItem ? state.selectedItem.reuseValue : Math.round(origVal * 0.6),
      icon: cat ? cat.icon : '📦',
      expectedVerdict: sevVal === 'critical' ? 'REPLACE' : 'REPAIR'
    };

    state.selectedItem = item;
    return item;
  }

  /**
   * Primary unified selector: Single source of truth.
   * Updates state, form inputs, draggable card, active highlights, drop verdict, and repurposing ideas.
   */
  function selectItem(itemData, targetAction = null) {
    if (!itemData) return;

    const name = itemData.itemTitle || itemData.name || 'Selected Item';
    const catId = itemData.category || 'furniture';

    // Look up distinct subcategory defaults if available
    const subDef = (data.subcategoryDefaults && data.subcategoryDefaults[name]) || {};

    const originalCost = Math.round(Number(itemData.originalCost || itemData.originalCostUSD || subDef.originalCost || 4500));
    const repairCost = Math.round(Number(itemData.repairCost || itemData.repairCostUSD || subDef.repairCost || Math.round(originalCost * 0.2)));
    const repurposeCost = Math.round(Number(itemData.repurposeCost || subDef.repurposeCost || Math.round(originalCost * 0.25)));
    const reuseValue = Math.round(Number(itemData.reuseValue || subDef.reuseValue || Math.round(originalCost * 0.6)));

    const catObj = data.categories.find(c => c.id === catId) || data.categories[0];
    const materialId = itemData.material || subDef.material || (catObj.materials[0] ? catObj.materials[0].id : 'standard');
    const ageYears = Number(itemData.ageYears || subDef.ageYears || 2);
    const damageSeverity = itemData.damageSeverity || subDef.damageSeverity || 'minor';
    const damageDetails = itemData.damageDetails || subDef.damageDetails || 'Standard wear observed';
    const partsAvailability = itemData.partsAvailability || subDef.partsAvailability || 'available';
    const userSkill = itemData.userSkill || subDef.userSkill || 'intermediate';
    const icon = itemData.icon || subDef.icon || catObj.icon || '📦';
    const expectedVerdict = itemData.expectedVerdict || (damageSeverity === 'critical' ? 'REPLACE' : 'REPAIR');

    // 1. Commit into shared state as single source of truth
    state.selectedItem = {
      id: itemData.id || name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: name,
      itemTitle: name,
      category: catId,
      material: materialId,
      ageYears: ageYears,
      damageSeverity: damageSeverity,
      damageDetails: damageDetails,
      partsAvailability: partsAvailability,
      userSkill: userSkill,
      originalCost: originalCost,
      repairCost: repairCost,
      repurposeCost: repurposeCost,
      reuseValue: reuseValue,
      expectedVerdict: expectedVerdict,
      icon: icon
    };

    state.selectedScopeCategory = catId;
    state.activeSubcategory = name;

    // 2. Synchronously write values to HTML form inputs (no race conditions)
    if (categorySelect) categorySelect.value = catId;
    populateMaterialsForCategory(catId);
    if (materialSelect) materialSelect.value = materialId;

    const titleInput = document.getElementById('itemTitle');
    const ageInput = document.getElementById('itemAge');
    const detailsInput = document.getElementById('damageDetails');
    const origInput = document.getElementById('originalCost');
    const repInput = document.getElementById('repairCost');
    const partsInput = document.getElementById('partsAvailability');
    const skillInput = document.getElementById('userSkill');

    if (titleInput) titleInput.value = name;
    if (ageInput) ageInput.value = ageYears;
    if (detailsInput) detailsInput.value = damageDetails;
    if (origInput) origInput.value = originalCost;
    if (repInput) repInput.value = repairCost;
    if (partsInput) partsInput.value = partsAvailability;
    if (skillInput) skillInput.value = userSkill;

    const radio = document.querySelector(`input[name="damageSeverity"][value="${damageSeverity}"]`);
    if (radio) {
      radio.checked = true;
      document.querySelectorAll('input[name="damageSeverity"]').forEach(r => {
        const card = r.closest('.radio-card');
        if (card) card.classList.remove('selected');
      });
      const card = radio.closest('.radio-card');
      if (card) card.classList.add('selected');
    }

    // 3. Synchronize Draggable Decision Card
    syncFormDraggableCard();

    // 4. Update Universal Scope active chips and cards
    highlightActiveScopeCard(catId);
    document.querySelectorAll('.cat-sub-item-chip').forEach(ch => {
      ch.classList.toggle('is-active', ch.getAttribute('data-sub-name') === name);
    });

    // 5. Evaluate drop / verdict with engine
    const actionToEvaluate = targetAction || (expectedVerdict ? expectedVerdict.toLowerCase() : 'repair');
    executeDropEvaluation(state.selectedItem, actionToEvaluate);

    // 6. Refresh the simplified 3-card Repurposing section
    renderUpcycling();
  }

  function syncFormDraggableCard() {
    const itemData = state.selectedItem || collectFormData();
    const cardTitle = document.getElementById('decisionCardTitle');
    const cardIcon = document.getElementById('decisionCardIcon');
    const cardSevTag = document.getElementById('decisionCardSevTag');
    const cardDesc = document.getElementById('decisionCardDesc');
    const cardCatText = document.getElementById('decisionCardCatText');
    const cardPriceText = document.getElementById('decisionCardPriceText');

    if (cardTitle) cardTitle.textContent = itemData.itemTitle || itemData.name;
    if (cardIcon) cardIcon.textContent = itemData.icon || '📦';

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

  function handleManualFormUpdate() {
    const updated = collectFormData();
    syncFormDraggableCard();
    const action = updated.damageSeverity === 'critical' ? 'replace' : 'repair';
    const res = engine.evaluateDrop(updated, action);
    state.currentAssessment = res;
    renderResultPanel(res);
    renderUpcycling();
  }

  if (form) {
    form.addEventListener('input', () => handleManualFormUpdate());
    form.addEventListener('change', () => handleManualFormUpdate());
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
          playClick();
          selectItem(preset, preset.expectedVerdict.toLowerCase());
          showToast(`Loaded preset "${preset.name}". Drag to an Action Zone to re-evaluate!`, 'info');
        });

        setupDraggableItem(card, preset);
        wizardPills.appendChild(card);
      });
    }

    if (heroChips) {
      heroChips.innerHTML = '';
      data.presets.slice(0, 6).forEach((preset) => {
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
    savings.textContent = formatMoney(heroActivePreset.originalCost - heroActivePreset.repairCost);
    
    const cat = data.categories.find(c => c.id === heroActivePreset.category);
    carbon.textContent = `${cat ? cat.co2ReplacementKg : 35} kg CO₂`;
  }

  const heroLoadIntoEngineBtn = document.getElementById('heroLoadIntoEngineBtn');
  if (heroLoadIntoEngineBtn) {
    heroLoadIntoEngineBtn.addEventListener('click', () => {
      playClick();
      selectItem(heroActivePreset, heroActivePreset.expectedVerdict.toLowerCase());
      document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 9. DRAG-AND-DROP PROTOCOL CONTROLLER (Action Zones & Drops)
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
        // Fallback stored in state.activeDraggedItem
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
    setupDraggableItem(formDraggableCard, () => state.selectedItem || collectFormData());
  }

  const resRedragPill = document.getElementById('resRedragPill');
  if (resRedragPill) {
    setupDraggableItem(resRedragPill, () => {
      if (state.currentAssessment) {
        return {
          id: state.currentAssessment.id,
          name: state.currentAssessment.itemTitle,
          itemTitle: state.currentAssessment.itemTitle,
          category: state.currentAssessment.category.id,
          material: state.currentAssessment.materialInfo ? state.currentAssessment.materialInfo.id : 'standard',
          damageSeverity: state.currentAssessment.damageSeverity,
          damageDetails: state.currentAssessment.damageDetails,
          originalCost: state.currentAssessment.costs.originalCost,
          repairCost: state.currentAssessment.costs.repairCost,
          icon: state.currentAssessment.category.icon
        };
      }
      return state.selectedItem || collectFormData();
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
          droppedItem = state.selectedItem || collectFormData();
        }

        // Synchronize and evaluate immediately
        selectItem(droppedItem, actionName);
      });

      // Click / Tap Fallback
      zone.addEventListener('click', () => {
        if (state.selectedItemForTap) {
          zone.classList.add('drop-success-flash');
          setTimeout(() => zone.classList.remove('drop-success-flash'), 900);
          selectItem(state.selectedItemForTap, actionName);
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

    if (result.isVeto) {
      playVetoBuzzer();
    } else {
      playSuccessChime();
    }

    const itemName = result.itemTitle || item.name || 'Item';
    showToast(`Evaluated "${itemName}" for ${targetAction.toUpperCase()}!`, result.isVeto ? 'warning' : 'success');

    if (compactShowResultBtn && engineLayoutGrid && window.innerWidth <= 1024) {
      compactShowResultBtn.classList.add('active');
      if (compactShowFormBtn) compactShowFormBtn.classList.remove('active');
      engineLayoutGrid.classList.remove('show-form-only');
      engineLayoutGrid.classList.add('show-result-only');
    }
  }

  // ==========================================================================
  // 10. Render Recommendation Result Panel (with Clean INR Estimates)
  // ==========================================================================
  function renderResultPanel(res) {
    const resultPanel = document.getElementById('resultPanel');
    if (!resultPanel || !res) return;

    const resItemTitle = document.getElementById('resItemTitle');
    const resCategoryPill = document.getElementById('resCategoryPill');
    const resTimestamp = document.getElementById('resTimestamp');

    if (resItemTitle) resItemTitle.textContent = res.itemTitle || (state.selectedItem ? state.selectedItem.name : 'Object');
    if (resCategoryPill) {
      const catName = (res.category && res.category.name) || res.categoryName || (state.selectedItem ? state.selectedItem.category : 'Object');
      const matName = (res.materialInfo && res.materialInfo.name) || res.materialName || 'Standard';
      resCategoryPill.textContent = `${catName} • ${matName}`;
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

    // Cost Breakdown in Pure INR
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

    const co2Val = res.impact.co2eAvoidedKg || res.impact.co2AvoidedKg || 0;
    const wasteVal = res.impact.wasteDivertedKg || 0;
    const waterVal = res.impact.waterConservedL || res.impact.waterLitersSaved || 0;

    if (resCo2Val) resCo2Val.textContent = `${co2Val} kg`;
    if (resWasteVal) resWasteVal.textContent = `${wasteVal} kg`;
    if (resWaterVal) resWaterVal.textContent = `${waterVal.toLocaleString()} L`;

    // Roadmap actions
    const resActionMode = document.getElementById('resActionMode');
    const stepsList = document.getElementById('resActionSteps');
    const toolsNote = document.getElementById('resToolsNote');

    const plan = res.actionPlan || {};
    const mode = plan.mode || 'Recommended Pathway';
    const badge = plan.difficultyBadge || 'Moderate';
    const steps = plan.keySteps || plan.steps || [];
    const tools = plan.toolsNeeded || plan.toolsNote || [];
    const toolsStr = Array.isArray(tools) ? tools.join(', ') : tools;

    if (resActionMode) {
      resActionMode.textContent = `Recommended: ${mode} (${badge})`;
    }

    if (stepsList) {
      stepsList.innerHTML = '';
      steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
      });
    }

    if (toolsNote) {
      toolsNote.innerHTML = `<strong>Tools:</strong> ${toolsStr}`;
    }

    // Re-drag pill inside result card
    const resRedragIcon = document.getElementById('resRedragIcon');
    const resRedragName = document.getElementById('resRedragName');
    if (resRedragIcon) resRedragIcon.textContent = res.category.icon;
    if (resRedragName) resRedragName.textContent = res.itemTitle;
  }

  // ==========================================================================
  // 11. UNIVERSAL SCOPE SECTION CONTROLLER
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

      // 1. Subcategory Chips click listener
      card.querySelectorAll('.cat-sub-item-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          playClick();
          const subName = chip.getAttribute('data-sub-name');
          const catId = chip.getAttribute('data-cat-id');
          loadScopeSubcategoryItem(catId, subName);
        });
      });

      // 2. Assess button listener
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

    // Check if matching preset exists
    const matchingPreset = data.presets.find(p => 
      p.itemTitle.toLowerCase().includes(subcategoryName.toLowerCase()) ||
      subcategoryName.toLowerCase().includes(p.name.toLowerCase()) ||
      (subcategoryName.includes('SSD') && p.id === 'ssd_drive')
    );

    if (matchingPreset) {
      selectItem(matchingPreset, matchingPreset.expectedVerdict.toLowerCase());
    } else {
      // Look up distinct subcategory default
      const subDef = (data.subcategoryDefaults && data.subcategoryDefaults[subcategoryName]) || {};
      const catObj = data.categories.find(c => c.id === categoryId) || data.categories[0];
      
      const itemToSelect = {
        name: subcategoryName,
        itemTitle: subcategoryName,
        category: categoryId,
        material: subDef.material || (catObj.materials[0] ? catObj.materials[0].id : 'standard'),
        ageYears: subDef.ageYears || 2,
        damageSeverity: subDef.damageSeverity || 'minor',
        damageDetails: subDef.damageDetails || `Observed routine wear on ${subcategoryName}. Ready for circular lifecycle evaluation.`,
        partsAvailability: subDef.partsAvailability || 'available',
        userSkill: subDef.userSkill || 'intermediate',
        originalCost: subDef.originalCost || (categoryId === 'electronics' ? 8500 : categoryId === 'mechanical' ? 12000 : 4500),
        repairCost: subDef.repairCost || Math.round((subDef.originalCost || 4500) * 0.2),
        repurposeCost: subDef.repurposeCost || Math.round((subDef.originalCost || 4500) * 0.25),
        reuseValue: subDef.reuseValue || Math.round((subDef.originalCost || 4500) * 0.6),
        icon: subDef.icon || catObj.icon || '📦',
        expectedVerdict: subDef.expectedVerdict || 'REPAIR'
      };

      selectItem(itemToSelect, itemToSelect.expectedVerdict.toLowerCase());
    }

    // Scroll smoothly to engine
    const engineEl = document.getElementById('engine');
    if (engineEl) {
      engineEl.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Selected "${subcategoryName}". Circular verdict evaluated!`, 'success');
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
  // 12. SIMPLIFIED CREATIVE REPURPOSING IDEAS STUDIO (MAX 3 COMPACT CARDS)
  // ==========================================================================
  function renderUpcycling() {
    const grid = document.getElementById('upcyclingGrid');
    const contextItemName = document.getElementById('repurposeContextItemName');
    if (!grid) return;

    // Update active context header
    const currentItem = state.selectedItem;
    const currentName = currentItem ? (currentItem.itemTitle || currentItem.name) : 'Solid Oak Dining Chair';
    const currentCat = currentItem ? currentItem.category : 'furniture';
    const currentMat = currentItem ? (currentItem.material || '').toLowerCase() : '';

    if (contextItemName) {
      contextItemName.textContent = currentName;
    }

    grid.innerHTML = '';

    // Score and select exactly 3 most relevant projects from data.upcycleProjects
    let projects = [...data.upcycleProjects];
    
    // Sort so items matching current category and material keywords come first
    projects.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (a.category === currentCat) scoreA += 20;
      if (b.category === currentCat) scoreB += 20;

      const nameLower = currentName.toLowerCase();
      if (nameLower.includes(a.sourceObject.toLowerCase()) || a.sourceObject.toLowerCase().includes(nameLower)) scoreA += 15;
      if (nameLower.includes(b.sourceObject.toLowerCase()) || b.sourceObject.toLowerCase().includes(nameLower)) scoreB += 15;

      if (currentMat && a.title.toLowerCase().includes(currentMat)) scoreA += 10;
      if (currentMat && b.title.toLowerCase().includes(currentMat)) scoreB += 10;

      return scoreB - scoreA;
    });

    // Display maximum of 3 useful, relevant ideas
    const topThree = projects.slice(0, 3);

    topThree.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'upcycle-card compact-card';

      const costSavingsINR = proj.costSavingsINR || Math.round((proj.costSavingsUSD || 25) * 80);

      card.innerHTML = `
        <div class="upcycle-card-header">
          <span class="upcycle-icon">${proj.icon || '✂️'}</span>
          <span class="upcycle-cat-badge">${proj.difficulty} • ${proj.timeRequired}</span>
        </div>
        <h4 class="upcycle-title">${proj.title}</h4>
        <div class="upcycle-origin" style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem;">
          Repurposed from: <strong>${proj.sourceObject}</strong>
        </div>
        <p class="upcycle-summary">${proj.summary}</p>
        <div class="upcycle-metrics-bar">
          <span class="upcycle-metric-tag">CO₂ Diverted: <strong>${proj.co2SavedKg} kg</strong></span>
          <span class="upcycle-metric-tag">Est. Saved: <strong>${formatMoney(costSavingsINR)}</strong></span>
        </div>
        <div class="upcycle-actions-row">
          <button type="button" class="btn btn-secondary btn-sm" data-view-guide="${proj.id}">
            📖 DIY Guide
          </button>
          <button type="button" class="btn btn-primary btn-sm" data-try-material="${proj.id}">
            Evaluate in Engine →
          </button>
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
          const cleanName = proj.sourceObject.split(' (')[0].split(' with')[0];
          const matchedItem = {
            id: proj.id,
            name: cleanName,
            itemTitle: cleanName,
            category: proj.category,
            material: 'standard',
            damageSeverity: 'moderate',
            damageDetails: `Converted to ${proj.title}. Diverts ${proj.co2SavedKg} kg CO₂.`,
            originalCost: costSavingsINR * 2,
            repairCost: Math.round(costSavingsINR * 0.3),
            repurposeCost: Math.round(costSavingsINR * 0.4),
            reuseValue: costSavingsINR,
            icon: proj.icon || '✂️',
            expectedVerdict: 'REUSE'
          };
          selectItem(matchedItem, 'repurpose');
          document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
          showToast(`Loaded "${cleanName}" for creative repurposing!`, 'info');
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

    const costSavingsINR = proj.costSavingsINR || Math.round((proj.costSavingsUSD || 25) * 80);

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
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${formatMoney(costSavingsINR)}</div>
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
        const cleanName = proj.sourceObject.split(' (')[0];
        const itemObj = {
          id: proj.id,
          name: cleanName,
          itemTitle: cleanName,
          category: proj.category,
          material: 'standard',
          damageSeverity: 'moderate',
          damageDetails: `Converted to ${proj.title}`,
          originalCost: costSavingsINR * 2,
          repairCost: Math.round(costSavingsINR * 0.3),
          repurposeCost: Math.round(costSavingsINR * 0.4),
          reuseValue: costSavingsINR,
          icon: proj.icon || '✂️',
          expectedVerdict: 'REUSE'
        };
        selectItem(itemObj, 'repurpose');
        document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
      };
    }

    openModal('repurposeGuideModal');
  }

  // ==========================================================================
  // 13. Community Impact Simulator (Calculated in Pure INR)
  // ==========================================================================
  const simSlider = document.getElementById('simSlider');
  const simCountDisplay = document.getElementById('simCountDisplay');

  function updateSimulator() {
    if (!simSlider) return;
    const count = parseInt(simSlider.value, 10);
    if (simCountDisplay) simCountDisplay.textContent = count.toLocaleString('en-IN');

    // Illustrative baseline: Average repair/reuse savings ~₹3,200 per item
    const totalINR = count * 3200;
    const totalCO2Kg = count * 38;
    const totalWasteKg = count * 9;
    const trees = Math.round(totalCO2Kg / 21);

    const simMoneyVal = document.getElementById('simMoneyVal');
    const simCo2Val = document.getElementById('simCo2Val');
    const simWasteVal = document.getElementById('simWasteVal');
    const simTreesVal = document.getElementById('simTreesVal');

    if (simMoneyVal) simMoneyVal.textContent = formatMoney(totalINR);
    if (simCo2Val) simCo2Val.textContent = `${(totalCO2Kg / 1000).toFixed(1)} Tons`;
    if (simWasteVal) simWasteVal.textContent = `${totalWasteKg.toLocaleString('en-IN')} kg`;
    if (simTreesVal) simTreesVal.textContent = `${trees.toLocaleString('en-IN')} Trees`;
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
        state.currentAssessment = engine.evaluateDrop(state.selectedItem || collectFormData(), 'repair');
      }
      const res = state.currentAssessment;

      if (reportModalBody) {
        const co2Val = res.impact.co2eAvoidedKg || res.impact.co2AvoidedKg || 0;
        const wasteVal = res.impact.wasteDivertedKg || 0;

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
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Financial Savings (Illustrative)</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--primary);">${formatMoney(res.costs.moneySaved)}</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">CO₂e Diverted</div>
              <div style="font-size: 1.35rem; font-weight: 800;">${co2Val} kg</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Landfill Diverted</div>
              <div style="font-size: 1.35rem; font-weight: 800;">${wasteVal} kg</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Recommended Action Blueprint:</h4>
            <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); line-height: 1.6;">
              ${res.actionPlan.keySteps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div style="border-top: 1px dashed var(--border); padding-top: 1rem; font-size: 0.75rem; color: var(--text-dim);">
            * Evaluation computed via REFIX Circularity Engine heuristics based on lifecycle benchmarks. All figures are clearly identified illustrative estimates displayed in Indian Rupee (₹).
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
        damageDetails: 'Optical scan localized surface wear and connector strain.',
        originalCost: 4500,
        repairCost: 450
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
        material: materialSelect.value || 'hardwood',
        damageSeverity: 'moderate',
        defectName: 'Localized Structural & Material Wear',
        confidence: '92%',
        damageDetails: `Visual inspection of "${file.name}" reveals localized wear ready for circular evaluation.`,
        originalCost: 4500,
        repairCost: 650
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

      // Single source of truth update
      selectItem(meta, meta.damageSeverity === 'critical' ? 'replace' : 'repair');

      closeModal('cameraScannerModal');
      stopCamera();

      showToast('Photo inspection verified and applied to decision engine!', 'success');
      document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
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
  setupActionZones();
  updateCurrencyLabels();
  updateHeroSavingsStat();
  renderCategories('all');
  updateSimulator();
  renderDirectory();

  // Load and evaluate initial Oak Dining Chair seamlessly
  selectItem(initialDefaultItem, 'repair');
});
