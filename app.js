/**
 * REFIX — Fix It First
 * Main Application Controller & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engine & State
  const data = window.REFIX_DATA;
  const engine = new window.RefixEngine(data);

  const state = {
    currency: localStorage.getItem('refix_currency') || 'USD',
    theme: localStorage.getItem('refix_theme') || 'dark',
    sound: localStorage.getItem('refix_sound') !== 'false',
    currentStep: 1,
    currentAssessment: null,
    activeCategoryFilter: 'all',
    directorySearchTerm: '',
    simCount: 250,
    cameraStream: null,
    scannedPhoto: null
  };

  // 2. Audio Synthesizer (Zero external audio files needed)
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
    playTone(523.25, 'sine', 0.15, 0.06); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.06), 80); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.22, 0.07), 160); // G5
  }

  function playClick() {
    playTone(800, 'triangle', 0.04, 0.03);
  }

  // 3. Currency Helpers
  function formatMoney(amountUSD) {
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const converted = amountUSD * cur.rate;
    
    // Format based on currency
    if (state.currency === 'INR') {
      return `${cur.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${cur.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }

  function updateCurrencyLabels() {
    const cur = data.currencies[state.currency] || data.currencies.USD;
    document.querySelectorAll('.currency-symbol-label').forEach(el => {
      el.textContent = cur.symbol;
    });

    // Re-render components with money displays
    if (state.currentAssessment) {
      renderResultPanel(state.currentAssessment);
    }
    updateHeroPreview();
    updateSimulator();
    renderUpcycling();
  }

  // 4. Toast Notifications
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

  // 5. Initialize Theme
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

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    playClick();
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  function updateSoundIcon() {
    if (soundIcon) soundIcon.textContent = state.sound ? '🔊' : '🔇';
  }
  updateSoundIcon();

  soundToggleBtn.addEventListener('click', () => {
    state.sound = !state.sound;
    localStorage.setItem('refix_sound', state.sound);
    updateSoundIcon();
    playClick();
    showToast(state.sound ? 'Audio feedback enabled' : 'Audio muted', 'info');
  });

  // Currency Selector
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.value = state.currency;
    currencySelect.addEventListener('change', (e) => {
      playClick();
      state.currency = e.target.value;
      localStorage.setItem('refix_currency', state.currency);
      updateCurrencyLabels();
      showToast(`Currency updated to ${data.currencies[state.currency].name}`, 'info');
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

  // 6. Form Category & Material Selectors Setup
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
      populateMaterialsForCategory(e.target.value);
    });
  }

  // 7. Wizard Stepper & View Mode Switcher
  const wizardCard = document.getElementById('wizardCard');
  const viewModeAllBtn = document.getElementById('viewModeAllBtn');
  const viewModeWizardBtn = document.getElementById('viewModeWizardBtn');
  const engineLayoutGrid = document.querySelector('.engine-layout-grid');
  const compactShowFormBtn = document.getElementById('compactShowFormBtn');
  const compactShowResultBtn = document.getElementById('compactShowResultBtn');
  const compactBackToFormBtn = document.getElementById('compactBackToFormBtn');

  const stepNavItems = document.querySelectorAll('.step-nav-item');
  const stepContents = document.querySelectorAll('.form-step-content');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const calculateBtn = document.getElementById('calculateBtn');

  // View Mode Switcher Handlers
  if (viewModeAllBtn && viewModeWizardBtn && wizardCard) {
    viewModeAllBtn.addEventListener('click', () => {
      playClick();
      viewModeAllBtn.classList.add('active');
      viewModeWizardBtn.classList.remove('active');
      wizardCard.classList.add('all-in-one-mode');
      showToast('Switched to All-in-One Dashboard (all sections visible)', 'info');
    });

    viewModeWizardBtn.addEventListener('click', () => {
      playClick();
      viewModeWizardBtn.classList.add('active');
      viewModeAllBtn.classList.remove('active');
      wizardCard.classList.remove('all-in-one-mode');
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

    // Button states
    if (prevStepBtn) {
      prevStepBtn.style.visibility = stepNumber === 1 ? 'hidden' : 'visible';
    }
    if (nextStepBtn && calculateBtn) {
      if (stepNumber === 4) {
        nextStepBtn.style.display = 'none';
        calculateBtn.style.display = 'inline-flex';
      } else {
        nextStepBtn.style.display = 'inline-flex';
        calculateBtn.style.display = 'none';
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

  // 8. Populate Preset Buttons (Ribbon & Hero)
  function renderPresets() {
    const wizardPills = document.getElementById('wizardPresetPills');
    const heroChips = document.getElementById('heroPresetChips');

    if (wizardPills) {
      wizardPills.innerHTML = '';
      data.presets.forEach(preset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-load-btn';
        btn.innerHTML = `<span>${preset.expectedVerdict === 'REPAIR' ? '🟢' : preset.expectedVerdict === 'REUSE' ? '🟡' : '🔴'}</span> <span>${preset.name}</span>`;
        btn.addEventListener('click', () => loadPreset(preset));
        wizardPills.appendChild(btn);
      });
    }

    if (heroChips) {
      heroChips.innerHTML = '';
      data.presets.slice(0, 5).forEach((preset, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `preset-chip ${idx === 0 ? 'active' : ''}`;
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

  let heroActivePreset = data.presets[0];

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

  // Hero "Open in Engine" button
  const heroLoadIntoEngineBtn = document.getElementById('heroLoadIntoEngineBtn');
  if (heroLoadIntoEngineBtn) {
    heroLoadIntoEngineBtn.addEventListener('click', () => {
      loadPreset(heroActivePreset);
      document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 9. Load Preset into Form
  function loadPreset(preset) {
    playSuccessChime();
    
    categorySelect.value = preset.category;
    populateMaterialsForCategory(preset.category);

    setTimeout(() => {
      materialSelect.value = preset.material;
      document.getElementById('itemTitle').value = preset.itemTitle;
      document.getElementById('itemAge').value = preset.ageYears;
      document.getElementById('damageDetails').value = preset.damageDetails;
      document.getElementById('partsAvailability').value = preset.partsAvailability;
      document.getElementById('userSkill').value = preset.userSkill;

      // Convert USD benchmark to active currency
      const cur = data.currencies[state.currency] || data.currencies.USD;
      document.getElementById('originalCost').value = Math.round(preset.originalCostUSD * cur.rate);
      document.getElementById('repairCost').value = Math.round(preset.repairCostUSD * cur.rate);

      // Radio severity
      const radio = document.querySelector(`input[name="damageSeverity"][value="${preset.damageSeverity}"]`);
      if (radio) {
        radio.checked = true;
        document.querySelectorAll('input[name="damageSeverity"]').forEach(r => {
          r.closest('.radio-card').classList.remove('selected');
        });
        radio.closest('.radio-card').classList.add('selected');
      }

      setWizardStep(1);
      runEvaluation();
      showToast(`Loaded preset: "${preset.name}"`, 'info');
    }, 50);
  }

  // 10. Form Submission & Assessment Evaluation
  const form = document.getElementById('assessmentForm');

  function collectFormData() {
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const originalLocal = parseFloat(document.getElementById('originalCost').value) || 50;
    const repairLocal = parseFloat(document.getElementById('repairCost').value) || 0;

    // Convert local currency back to base USD for consistent engine heuristics
    const originalCostUSD = originalLocal / cur.rate;
    const repairCostUSD = repairLocal / cur.rate;

    const severityRadio = document.querySelector('input[name="damageSeverity"]:checked');

    return {
      category: categorySelect.value,
      material: materialSelect.value,
      itemTitle: document.getElementById('itemTitle').value || 'Object',
      ageYears: parseFloat(document.getElementById('itemAge').value) || 1,
      damageSeverity: severityRadio ? severityRadio.value : 'moderate',
      damageDetails: document.getElementById('damageDetails').value || '',
      partsAvailability: document.getElementById('partsAvailability').value,
      userSkill: document.getElementById('userSkill').value,
      originalCost: originalCostUSD,
      repairCost: repairCostUSD
    };
  }

  function runEvaluation() {
    const input = collectFormData();
    const result = engine.assessItem(input);
    state.currentAssessment = result;

    renderResultPanel(result);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runEvaluation();
      playSuccessChime();
      showToast('Assessment computed successfully!', 'success');
    });
  }

  // Live recalculate on any field change
  form.addEventListener('change', () => {
    runEvaluation();
  });

  // 11. Render Recommendation Panel
  function renderResultPanel(res) {
    const resultPanel = document.getElementById('resultPanel');
    if (!resultPanel) return;

    // Item header
    document.getElementById('resItemTitle').textContent = res.itemTitle;
    document.getElementById('resCategoryPill').textContent = `${res.category.name} • ${res.materialInfo ? res.materialInfo.name : ''}`;
    document.getElementById('resTimestamp').textContent = `Evaluated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Scanned Photo Inspection Verified Card
    const photoWrap = document.getElementById('resPhotoInspectionWrap');
    const photoThumb = document.getElementById('resPhotoThumb');
    const photoDefect = document.getElementById('resPhotoDefect');
    const photoConfidence = document.getElementById('resPhotoConfidence');

    if (state.scannedPhoto) {
      photoWrap.style.display = 'flex';
      if (state.scannedPhoto.isSvg) {
        photoThumb.innerHTML = state.scannedPhoto.imgSource;
      } else {
        photoThumb.innerHTML = `<img src="${state.scannedPhoto.imgSource}" alt="Damaged product inspection preview">`;
      }
      photoDefect.textContent = state.scannedPhoto.meta.defectName || 'Physical Fracture / Wear';
      photoConfidence.textContent = `Confidence: ${state.scannedPhoto.meta.confidence || '91%'} • Defect localized`;
    } else {
      photoWrap.style.display = 'none';
    }

    // Big Verdict Banner
    const banner = document.getElementById('resVerdictBanner');
    const title = document.getElementById('resVerdictTitle');
    const confidence = document.getElementById('resConfidence');
    const reason = document.getElementById('resVerdictReason');

    banner.className = `verdict-banner verdict-${res.verdict.toLowerCase()}`;
    let icon = '🟢';
    if (res.verdict === 'REUSE') icon = '🟡';
    if (res.verdict === 'REPLACE') icon = '🔴';

    title.innerHTML = `<span>${icon}</span> ${res.verdict}`;
    confidence.textContent = `${res.confidence}% Confidence`;
    reason.textContent = res.verdictReason;

    // Update Floating Mobile/Compact Result Pill
    const floatingBadge = document.getElementById('floatingVerdictBadge');
    if (floatingBadge) {
      floatingBadge.className = `floating-verdict-badge verdict-${res.verdict.toLowerCase()}`;
      floatingBadge.textContent = `${icon} ${res.verdict}`;
    }

    // Update Compact Screen Tab Verdict Pill
    const compactPill = document.getElementById('compactVerdictPill');
    if (compactPill) {
      compactPill.className = `compact-verdict-pill verdict-${res.verdict.toLowerCase()}`;
      compactPill.textContent = `${icon} ${res.verdict}`;
    }

    // Gauges
    document.getElementById('resRepairScore').textContent = `${res.repairabilityScore}%`;
    document.getElementById('resRepairBar').style.width = `${res.repairabilityScore}%`;

    document.getElementById('resReuseScore').textContent = `${res.reuseScore}%`;
    document.getElementById('resReuseBar').style.width = `${res.reuseScore}%`;

    // Costs
    const savingsHighlight = document.getElementById('resSavingsHighlight');
    if (res.verdict === 'REPLACE') {
      savingsHighlight.textContent = 'Retire & Upgrade';
      savingsHighlight.style.color = 'var(--replace)';
    } else {
      savingsHighlight.textContent = `Save ${formatMoney(res.costs.moneySaved)} (${res.costs.savingsPercent}%)`;
      savingsHighlight.style.color = 'var(--primary)';
    }

    document.getElementById('resRepairCostVal').textContent = formatMoney(res.costs.repairCost);
    document.getElementById('resRepurposeCostVal').textContent = formatMoney(res.costs.repurposeCost);
    document.getElementById('resReplaceCostVal').textContent = formatMoney(res.costs.originalCost);

    // Bars width
    const maxVal = Math.max(res.costs.originalCost, res.costs.repairCost, res.costs.repurposeCost, 1);
    document.getElementById('barRepairWidth').style.width = `${Math.min(100, Math.round((res.costs.repairCost / maxVal) * 100))}%`;
    document.getElementById('barRepurposeWidth').style.width = `${Math.min(100, Math.round((res.costs.repurposeCost / maxVal) * 100))}%`;

    // Environmental indicators
    document.getElementById('resCo2Val').textContent = `${res.impact.co2AvoidedKg} kg`;
    document.getElementById('resWasteVal').textContent = `${res.impact.wasteDivertedKg} kg`;
    document.getElementById('resWaterVal').textContent = `${res.impact.waterLitersSaved.toLocaleString()} L`;

    // Roadmap actions
    document.getElementById('resActionMode').textContent = `Recommended: ${res.actionPlan.mode} (${res.actionPlan.difficultyBadge})`;
    const stepsList = document.getElementById('resActionSteps');
    stepsList.innerHTML = '';
    res.actionPlan.keySteps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      stepsList.appendChild(li);
    });

    document.getElementById('resToolsNote').innerHTML = `<strong>Tools:</strong> ${res.actionPlan.toolsNeeded.join(', ')}`;
  }

  // 12. Object Categories Showcase Renderer
  function renderCategories(filter = 'all') {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = filter === 'all' 
      ? data.categories 
      : data.categories.filter(c => c.id === filter);

    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
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
            <p>New Item Footprint</p>
            <strong>${cat.co2ReplacementKg} kg CO₂</strong>
          </div>
        </div>
        <div style="font-size: 0.775rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.4rem;">
          Common Repair Points:
        </div>
        <ul class="cat-issues-list">
          ${cat.commonIssues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
        <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: auto;" data-load-cat="${cat.id}">
          Assess a ${cat.name.split(' ')[0]} Object →
        </button>
      `;

      card.querySelector(`[data-load-cat="${cat.id}"]`).addEventListener('click', () => {
        playClick();
        categorySelect.value = cat.id;
        populateMaterialsForCategory(cat.id);
        document.getElementById('itemTitle').value = cat.subcategories[0] || cat.name;
        document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
        setWizardStep(1);
        runEvaluation();
        showToast(`Category set to ${cat.name}`, 'info');
      });

      grid.appendChild(card);
    });
  }

  // Category filter bar
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const catKey = btn.getAttribute('data-category');
      renderCategories(catKey);
    });
  });

  // 13. Upcycling Projects Showcase Renderer
  function renderUpcycling() {
    const grid = document.getElementById('upcyclingGrid');
    if (!grid) return;

    grid.innerHTML = '';
    data.upcycleProjects.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'upcycle-card';
      
      let icon = '✂️';
      if (proj.category === 'kitchen') icon = '☕';
      if (proj.category === 'electronics') icon = '💻';
      if (proj.category === 'furniture') icon = '🪵';
      if (proj.category === 'mechanical') icon = '🚲';

      card.innerHTML = `
        <div class="upcycle-preview-visual">
          <span>${icon}</span>
          <span class="upcycle-difficulty-pill">${proj.difficulty} • ${proj.timeHours}h</span>
        </div>
        <div class="upcycle-body">
          <div class="upcycle-tags">
            ${proj.tags.map(t => `<span class="mini-tag">${t}</span>`).join('')}
          </div>
          <h3 class="upcycle-title">${proj.title}</h3>
          <div class="upcycle-origin">Repurposed from: ${proj.originalItem}</div>
          <p class="upcycle-desc">${proj.summary}</p>
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
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // 14. Community Impact Simulator
  const simSlider = document.getElementById('simSlider');
  const simCountDisplay = document.getElementById('simCountDisplay');

  function updateSimulator() {
    if (!simSlider) return;
    const count = parseInt(simSlider.value, 10);
    simCountDisplay.textContent = count.toLocaleString();

    // Heuristics:
    // Avg money saved per repaired/reused item: ~$114 USD
    // Avg CO2 saved: ~38 kg CO2
    // Avg waste diverted: ~9 kg
    // Tree equivalence: 1 tree absorbs ~21kg CO2/yr
    const cur = data.currencies[state.currency] || data.currencies.USD;
    const totalUSD = count * 114;
    const totalCO2Kg = count * 38;
    const totalWasteKg = count * 9;
    const trees = Math.round(totalCO2Kg / 21);

    document.getElementById('simMoneyVal').textContent = formatMoney(totalUSD);
    document.getElementById('simCo2Val').textContent = `${(totalCO2Kg / 1000).toFixed(1)} Tons`;
    document.getElementById('simWasteVal').textContent = `${totalWasteKg.toLocaleString()} kg`;
    document.getElementById('simTreesVal').textContent = `${trees.toLocaleString()} Trees`;
  }

  if (simSlider) {
    simSlider.addEventListener('input', () => {
      updateSimulator();
    });
  }

  // 15. Community Directory Renderer & Search
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

  // 16. Modal Controllers
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

  // Close modal when clicking outside dialog
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  // Open Methodology Modal
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

  // Open Submit Spot Modal
  const openSubmitSpotModal = document.getElementById('openSubmitSpotModal');
  if (openSubmitSpotModal) {
    openSubmitSpotModal.addEventListener('click', () => openModal('submitSpotModal'));
  }

  // Submit Spot Form Handler
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
  }

  // "Find Local Fixers" CTA button
  const findNearbyBtn = document.getElementById('findNearbyBtn');
  if (findNearbyBtn) {
    findNearbyBtn.addEventListener('click', () => {
      playClick();
      document.getElementById('directory').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 17. Printable Assessment Report Generator
  const printReportBtn = document.getElementById('printReportBtn');
  const reportModalBody = document.getElementById('reportModalBody');
  const triggerPrintBtn = document.getElementById('triggerPrintBtn');

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      if (!state.currentAssessment) runEvaluation();
      const res = state.currentAssessment;

      reportModalBody.innerHTML = `
        <div style="border-bottom: 2px solid var(--primary); padding-bottom: 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.2rem;">REFIX Assessment Certificate</h2>
            <p style="font-size: 0.85rem; color: var(--text-dim);">Right-to-Repair &amp; Circularity Lifecycle Evaluation</p>
          </div>
          <div style="text-align: right; font-size: 0.8rem; color: var(--text-dim);">
            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>ID:</strong> RFX-${Math.floor(100000 + Math.random() * 900000)}
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.25rem;">${res.itemTitle}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Category: ${res.category.name} | Material: ${res.materialInfo ? res.materialInfo.name : 'Standard'}</p>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 1.4rem; font-weight: 800; color: ${res.verdict === 'REPAIR' ? 'var(--repair)' : res.verdict === 'REUSE' ? 'var(--reuse)' : 'var(--replace)'}; margin-bottom: 0.4rem;">
            Official Verdict: ${res.verdict} (${res.confidence}% Confidence)
          </div>
          <p style="font-size: 0.925rem; line-height: 1.5;">${res.verdictReason}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Money Saved</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--primary);">${formatMoney(res.costs.moneySaved)}</div>
          </div>
          <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">CO₂e Diverted</div>
            <div style="font-size: 1.35rem; font-weight: 800;">${res.impact.co2AvoidedKg} kg</div>
          </div>
          <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim);">Waste Kept Out of Landfill</div>
            <div style="font-size: 1.35rem; font-weight: 800;">${res.impact.wasteDivertedKg} kg</div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Action Roadmap:</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); line-height: 1.6;">
            ${res.actionPlan.keySteps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="border-top: 1px dashed var(--border); padding-top: 1rem; font-size: 0.75rem; color: var(--text-dim);">
          * Methodology note: Calculations based on lifecycle circular benchmarks. Certified for hackathon demonstration.
        </div>
      `;

      openModal('reportModal');
    });
  }

  if (triggerPrintBtn) {
    triggerPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 17.5. Visual Damage Scanner & Camera Subsystem
  // ==========================================================================
  const scannerModal = document.getElementById('cameraScannerModal');
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
  const floatingResultBtn = document.getElementById('floatingResultBtn');

  let activeScanResult = null;

  // Open Scanner Modal
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

  // Scanner Tab Switching
  const scannerTabBtns = document.querySelectorAll('.scanner-tab-btn');
  function switchScannerTab(tabName) {
    scannerTabBtns.forEach(btn => {
      if (btn.getAttribute('data-scanner-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.getElementById('scannerCameraPane').classList.toggle('active', tabName === 'camera');
    document.getElementById('scannerUploadPane').classList.toggle('active', tabName === 'upload');
    document.getElementById('scannerSamplesPane').classList.toggle('active', tabName === 'samples');

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

  // Start Camera Stream
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
      console.warn('Camera access denied or unavailable:', err);
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

  // Hook into modal close to always stop camera stream
  const originalCloseModal = closeModal;
  closeModal = function(modalId) {
    if (modalId === 'cameraScannerModal') {
      stopCamera();
    }
    originalCloseModal(modalId);
  };

  // Capture photo from video feed
  if (capturePhotoBtn) {
    capturePhotoBtn.addEventListener('click', () => {
      playSuccessChime();
      if (!scannerVideo || !scannerVideo.videoWidth) {
        // Fallback to sample if camera has no active frame
        const fallbackSample = data.samplePhotos[0];
        analyzeImage(fallbackSample.svgThumb, fallbackSample, true);
        return;
      }

      scannerCanvas.width = scannerVideo.videoWidth;
      scannerCanvas.height = scannerVideo.videoHeight;
      const ctx = scannerCanvas.getContext('2d');
      ctx.drawImage(scannerVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);
      const dataUrl = scannerCanvas.toDataURL('image/jpeg', 0.85);

      // Computer Vision simulated heuristic detection
      const activeCat = data.categories.find(c => c.id === categorySelect.value) || data.categories[0];
      const cameraMeta = {
        itemTitle: document.getElementById('itemTitle').value || `${activeCat.name} Item`,
        category: activeCat.id,
        material: materialSelect.value,
        damageSeverity: 'minor',
        defectName: 'Surface Defect & Joint Stress Detected',
        confidence: '89%',
        damageDetails: 'Visual scan identified localized surface fracture and mechanical joint wear.'
      };

      analyzeImage(dataUrl, cameraMeta, false);
      stopCamera();
    });
  }

  // Upload File & Drag and Drop
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
      showToast('Please select a valid image file (JPEG, PNG, WebP)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      playSuccessChime();
      const dataUrl = e.target.result;
      const uploadMeta = {
        itemTitle: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Uploaded Item',
        category: categorySelect.value || 'furniture',
        material: materialSelect.value || 'solid_wood',
        damageSeverity: 'moderate',
        defectName: 'Localized Fracture & Material Stress',
        confidence: '92%',
        damageDetails: `Visual inspection of "${file.name}" reveals moderate material wear requiring repair intervention.`
      };
      analyzeImage(dataUrl, uploadMeta, false);
    };
    reader.readAsDataURL(file);
  }

  // Render Sample Photos Grid
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

  // Analyze Captured Image Sequence
  function analyzeImage(imgSource, meta, isSvg = false) {
    activeScanResult = { imgSource, meta, isSvg };

    scannerAnalysisSection.style.display = 'block';
    scannerAnalysisSection.scrollIntoView({ behavior: 'smooth' });

    if (isSvg) {
      capturedImageDisplay.innerHTML = imgSource;
    } else {
      capturedImageDisplay.innerHTML = `<img src="${imgSource}" alt="Damage scan">`;
    }

    analysisSpinner.style.display = 'block';
    detectionTagsCard.style.display = 'none';
    analysisStatusTitle.textContent = 'Visual AI Inspection in Progress...';
    analysisStatusStep.textContent = 'Analyzing surface fracture contours and texture frequency...';

    // Simulated 3-step inspection stages
    setTimeout(() => {
      analysisStatusStep.textContent = 'Segmenting material boundaries & structural stress points...';
      playTone(600, 'sine', 0.08, 0.04);
    }, 600);

    setTimeout(() => {
      analysisStatusStep.textContent = `Classifying defect: "${meta.defectName}" (Confidence: ${meta.confidence || '91%'})`;
      playTone(750, 'sine', 0.08, 0.04);
    }, 1200);

    setTimeout(() => {
      analysisSpinner.style.display = 'none';
      analysisStatusTitle.textContent = '✓ Visual Inspection Complete';
      analysisStatusStep.textContent = 'Defect classified with high confidence. Ready to apply to decision engine.';
      
      document.getElementById('detObjectVal').textContent = meta.itemTitle || meta.name;
      const cat = data.categories.find(c => c.id === meta.category);
      document.getElementById('detMaterialVal').textContent = (meta.material || 'Standard').replace(/_/g, ' ');
      document.getElementById('detDefectVal').textContent = meta.defectName;
      document.getElementById('detSeverityVal').textContent = `${(meta.damageSeverity || 'moderate').toUpperCase()} Severity`;

      detectionTagsCard.style.display = 'block';
      playSuccessChime();
    }, 1700);
  }

  // Retake photo
  if (retakePhotoBtn) {
    retakePhotoBtn.addEventListener('click', () => {
      playClick();
      scannerAnalysisSection.style.display = 'none';
      switchScannerTab('camera');
    });
  }

  // Apply Scan to Assessment Form
  if (applyScanBtn) {
    applyScanBtn.addEventListener('click', () => {
      if (!activeScanResult) return;
      playSuccessChime();

      const meta = activeScanResult.meta;
      state.scannedPhoto = activeScanResult;

      // Populate form fields
      if (meta.category) {
        categorySelect.value = meta.category;
        populateMaterialsForCategory(meta.category);
      }

      setTimeout(() => {
        if (meta.material) materialSelect.value = meta.material;
        if (meta.itemTitle) document.getElementById('itemTitle').value = meta.itemTitle;
        if (meta.damageDetails) document.getElementById('damageDetails').value = meta.damageDetails;
        if (meta.ageYears) document.getElementById('itemAge').value = meta.ageYears;

        if (meta.originalCostUSD) {
          const cur = data.currencies[state.currency] || data.currencies.USD;
          document.getElementById('originalCost').value = Math.round(meta.originalCostUSD * cur.rate);
          document.getElementById('repairCost').value = Math.round(meta.repairCostUSD * cur.rate);
        }

        // Radio severity
        const radio = document.querySelector(`input[name="damageSeverity"][value="${meta.damageSeverity}"]`);
        if (radio) {
          radio.checked = true;
          document.querySelectorAll('input[name="damageSeverity"]').forEach(r => {
            r.closest('.radio-card').classList.remove('selected');
          });
          radio.closest('.radio-card').classList.add('selected');
        }

        closeModal('cameraScannerModal');
        setWizardStep(1);
        runEvaluation();
        showToast('Visual scan applied! Assessment recalculated.', 'success');
        document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  }

  // Remove photo button handler in result card
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      playClick();
      state.scannedPhoto = null;
      document.getElementById('resPhotoInspectionWrap').style.display = 'none';
      showToast('Visual inspection photo removed', 'info');
    });
  }

  // Floating Result Jump Button
  if (floatingResultBtn) {
    floatingResultBtn.addEventListener('click', () => {
      playClick();
      const resultPanel = document.getElementById('resultPanel');
      if (resultPanel) {
        resultPanel.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 18. Initial App Bootstrap
  populateCategoriesDropdown();
  renderPresets();
  renderSamplePhotos();
  updateHeroPreview();
  renderCategories('all');
  renderUpcycling();
  updateSimulator();
  renderDirectory();
  runEvaluation();
});
