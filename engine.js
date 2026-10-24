/**
 * REFIX — Fix It First
 * Decision Engine & Algorithmic Assessment Core
 * 
 * Transparent, deterministic heuristic evaluation model based on:
 * - Material circularity benchmarks
 * - Economic Viability Ratio (EVR)
 * - Severity & Safety Hazard Veto Rules
 * - Right-to-Repair lifecycle heuristics
 */

class RefixEngine {
  constructor(data) {
    this.data = data || window.REFIX_DATA;
  }

  /**
   * Main assessment evaluator
   * @param {Object} input - form inputs
   * @returns {Object} detailed recommendation result
   */
  assessItem(input) {
    const category = this.data.categories.find(c => c.id === input.category) || this.data.categories[0];
    const materialKey = input.material || (category.materials[0] && category.materials[0].id);
    const materialInfo = this.findMaterial(category, materialKey);
    const carbonBenchmark = this.data.carbonFactors[materialKey] || { co2ePerKg: 10, waterLitersPerKg: 1000, circularScore: 50 };

    const originalCost = Math.max(5, parseFloat(input.originalCost) || 50);
    const ageYears = Math.max(0, parseFloat(input.ageYears) || 1);
    const damageSeverity = input.damageSeverity || 'moderate';
    const partsAvailability = input.partsAvailability || 'available';
    const userSkill = input.userSkill || 'intermediate';

    // Auto-estimate repair cost if not provided or 0
    let repairCost = parseFloat(input.repairCost);
    let isRepairCostEstimated = false;
    if (isNaN(repairCost) || repairCost <= 0) {
      repairCost = this.estimateRepairCost(originalCost, damageSeverity, partsAvailability);
      isRepairCostEstimated = true;
    }

    // Economic Viability Ratio: Repair Cost / Replacement Cost
    const evr = repairCost / originalCost;

    // Repurpose DIY cost benchmark (typically 8-18% of original value for supplies/hardware)
    const repurposeCost = Math.round(originalCost * 0.12 * 10) / 10;

    // Calculate component scores
    const severityScore = this.getSeverityScore(damageSeverity);
    const partsScore = this.getPartsScore(partsAvailability);
    const skillScore = this.getSkillScore(userSkill);
    const materialRepairEase = materialInfo ? materialInfo.repairEase : 60;

    // 1. Safety Hazard Check (VETO RULE)
    const safetyVeto = this.checkSafetyHazard(materialKey, damageSeverity, input.damageDetails);

    // 2. Repairability Score (0 - 100)
    let repairabilityScore = Math.round(
      (materialRepairEase * 0.30) +
      (severityScore * 0.35) +
      (partsScore * 0.20) +
      (skillScore * 0.15)
    );
    repairabilityScore = Math.min(100, Math.max(0, repairabilityScore));

    // 3. Upcycle / Reuse Viability Score (0 - 100)
    let reuseScore = this.calculateReuseScore(category, materialKey, damageSeverity, ageYears, carbonBenchmark);

    // 4. Determine Verdict
    let verdict = 'REPAIR';
    let verdictReason = '';
    let confidence = 88;

    if (safetyVeto.isHazardous) {
      verdict = 'REPLACE';
      verdictReason = safetyVeto.reason;
      confidence = 96;
    } else if (evr > 0.70 && reuseScore >= 55) {
      // Uneconomical to restore original purpose, but material has strong repurpose utility
      verdict = 'REUSE';
      verdictReason = `Repairing exceeds 70% of new replacement cost (${Math.round(evr * 100)}%), but the item's ${materialInfo.name} has high structural and creative reuse value.`;
      confidence = 86;
    } else if (evr > 0.75 && reuseScore < 55) {
      // Uneconomical and low reuse utility
      verdict = 'REPLACE';
      verdictReason = `Repair cost is uneconomically high relative to replacement (${Math.round(evr * 100)}%) and spare parts or materials are heavily degraded. Safe recycling recommended.`;
      confidence = 84;
    } else if (repairabilityScore >= 55 && evr <= 0.65) {
      // Clear repair candidate
      verdict = 'REPAIR';
      verdictReason = `High repair viability (${repairabilityScore}%) and strong economic return. Fixing costs only ${Math.round(evr * 100)}% of buying new.`;
      confidence = 92;
    } else if (reuseScore > repairabilityScore) {
      verdict = 'REUSE';
      verdictReason = `While fixing original function is challenging, the raw materials are prime for upcycling into a second life.`;
      confidence = 82;
    } else {
      verdict = 'REPAIR';
      verdictReason = `Modest repair effort needed. Worth consulting a local repair cafe or pro technician before discarding.`;
      confidence = 78;
    }

    // 5. Environmental Impact Calculations (Deterministic Demo Heuristics)
    const impact = this.calculateEnvironmentalImpact(category, materialKey, verdict, originalCost);

    // 6. Savings comparison
    const moneySaved = Math.max(0, originalCost - (verdict === 'REUSE' ? repurposeCost : repairCost));
    const savingsPercent = Math.round((moneySaved / originalCost) * 100);

    // 7. Action plan recommendations
    const actionPlan = this.generateActionPlan(verdict, category, materialKey, userSkill, damageSeverity, input.itemTitle);

    return {
      verdict, // 'REPAIR' | 'REUSE' | 'REPLACE'
      verdictReason,
      confidence,
      repairabilityScore,
      reuseScore,
      safetyVeto,
      itemTitle: input.itemTitle || `${category.name} Item`,
      category,
      materialInfo,
      costs: {
        originalCost,
        repairCost,
        repurposeCost,
        moneySaved,
        savingsPercent,
        evr: Math.round(evr * 100),
        isRepairCostEstimated
      },
      impact,
      actionPlan,
      timestamp: new Date().toISOString()
    };
  }

  findMaterial(category, materialId) {
    if (!category || !category.materials) return null;
    return category.materials.find(m => m.id === materialId) || category.materials[0];
  }

  getSeverityScore(severity) {
    switch (severity) {
      case 'cosmetic': return 95;
      case 'minor': return 82;
      case 'moderate': return 52;
      case 'critical': return 15;
      default: return 60;
    }
  }

  getPartsScore(availability) {
    switch (availability) {
      case 'available': return 100;
      case 'rare': return 65;
      case 'discontinued': return 35;
      case 'none': return 10;
      default: return 70;
    }
  }

  getSkillScore(skill) {
    switch (skill) {
      case 'beginner': return 60;
      case 'intermediate': return 85;
      case 'advanced': return 100;
      case 'hire_pro': return 95; // Local pro can execute complex fixes
      default: return 75;
    }
  }

  estimateRepairCost(originalCost, severity, parts) {
    let multiplier = 0.20; // default 20%
    if (severity === 'cosmetic') multiplier = 0.08;
    else if (severity === 'minor') multiplier = 0.16;
    else if (severity === 'moderate') multiplier = 0.35;
    else if (severity === 'critical') multiplier = 0.65;

    if (parts === 'rare') multiplier *= 1.25;
    if (parts === 'discontinued') multiplier *= 1.5;

    return Math.max(5, Math.round(originalCost * multiplier));
  }

  checkSafetyHazard(materialKey, severity, detailsText) {
    const text = (detailsText || '').toLowerCase();

    // 1. Non-stick Teflon peeling
    if (materialKey === 'teflon_nonstick' && (severity === 'moderate' || severity === 'critical' || text.includes('peel') || text.includes('flake'))) {
      return {
        isHazardous: true,
        reason: 'SAFETY HAZARD: Damaged non-stick PTFE coatings can flake into food and emit toxic fluoropolymer fumes when heated. Home resurfacing is unsafe. Retire & recycle the aluminum pan body.'
      };
    }

    // 2. Helmet EPS impact foam crack
    if (materialKey === 'safety_foam_eps' && (severity === 'moderate' || severity === 'critical' || text.includes('crack') || text.includes('impact') || text.includes('crash'))) {
      return {
        isHazardous: true,
        reason: 'CRITICAL SAFETY MANDATE: Safety helmets rely on single-use EPS foam compression to dissipate traumatic impact shock. Any foam fracture destroys structural shock absorption. Do not use or repair.'
      };
    }

    // 3. Swollen lithium battery
    if ((text.includes('swollen') || text.includes('bloated') || text.includes('burning') || text.includes('smoke')) && (materialKey.includes('electronics') || materialKey === 'modular_electronics' || materialKey === 'sealed_electronics')) {
      return {
        isHazardous: true,
        reason: 'FIRE HAZARD: Swollen battery or burning smell indicates thermal instability. Discontinue charging immediately and transport safely to a hazardous e-waste recycler.'
      };
    }

    return { isHazardous: false, reason: null };
  }

  calculateReuseScore(category, materialKey, severity, ageYears, carbonBenchmark) {
    let base = 50;

    // Materials with great upcycle / craft value
    if (['cotton_denim', 'solid_wood', 'leather', 'cast_iron_steel', 'ceramic_porcelain'].includes(materialKey)) {
      base += 25;
    } else if (['polypropylene', 'steel_alloy', 'modular_electronics'].includes(materialKey)) {
      base += 15;
    }

    // Older items that might no longer serve primary role
    if (ageYears > 5) base += 10;
    if (severity === 'moderate' || severity === 'minor') base += 10;

    return Math.min(95, Math.max(15, base));
  }

  calculateEnvironmentalImpact(category, materialKey, verdict, originalCost) {
    const factor = this.data.carbonFactors[materialKey] || { co2ePerKg: 12, waterLitersPerKg: 2000 };
    const baseWeightKg = category.landfillWeightKg || 3.5;
    const baseReplacementCO2 = category.co2ReplacementKg || 30;

    let co2AvoidedKg = 0;
    let wasteDivertedKg = 0;
    let waterLitersSaved = 0;

    if (verdict === 'REPAIR') {
      // Full replacement avoided
      co2AvoidedKg = Math.round(baseReplacementCO2 * 0.88 * 10) / 10;
      wasteDivertedKg = Math.round(baseWeightKg * 0.95 * 10) / 10;
      waterLitersSaved = Math.round(factor.waterLitersPerKg * baseWeightKg * 0.85);
    } else if (verdict === 'REUSE') {
      // Diverts 100% landfill waste, avoids ~70% manufacturing of new replacement item
      co2AvoidedKg = Math.round(baseReplacementCO2 * 0.70 * 10) / 10;
      wasteDivertedKg = Math.round(baseWeightKg * 0.98 * 10) / 10;
      waterLitersSaved = Math.round(factor.waterLitersPerKg * baseWeightKg * 0.65);
    } else {
      // REPLACE with certified recycling avoids a fraction through raw material reclamation
      co2AvoidedKg = Math.round(baseReplacementCO2 * 0.22 * 10) / 10;
      wasteDivertedKg = Math.round(baseWeightKg * 0.60 * 10) / 10; // via municipal recycler
      waterLitersSaved = Math.round(factor.waterLitersPerKg * baseWeightKg * 0.20);
    }

    // Tangible real-world equivalence metrics
    const treeAbsorptionDays = Math.round((co2AvoidedKg / 21) * 365); // 1 tree absorbs ~21kg CO2/year
    const smartphoneCharges = Math.round(co2AvoidedKg * 120); // ~8g CO2 per smartphone charge
    const milesDriven = Math.round(co2AvoidedKg * 2.5); // ~0.4kg CO2 per passenger car mile

    return {
      co2AvoidedKg,
      wasteDivertedKg,
      waterLitersSaved,
      equivalencies: {
        treeDays: Math.max(1, treeAbsorptionDays),
        smartphoneCharges,
        milesDriven
      }
    };
  }

  generateActionPlan(verdict, category, materialKey, userSkill, severity, itemTitle) {
    const isPro = userSkill === 'hire_pro';
    const isNovice = userSkill === 'beginner';

    if (verdict === 'REPAIR') {
      return {
        mode: isPro ? 'Professional Service' : 'DIY / Community Fix',
        difficultyBadge: isNovice ? 'Gentle DIY' : 'Moderate Handiwork',
        estimatedTime: isNovice ? '45 - 90 minutes' : '30 - 60 minutes',
        keySteps: [
          'Inspect & clean the damaged area thoroughly before beginning.',
          'Secure matching fasteners, glue, adhesive, or certified replacement components.',
          isPro 
            ? 'Book a consultation with a local specialized technician or community repair cafe.' 
            : 'Follow an open-source visual teardown guide (e.g., iFixit, YouTube Maker).',
          'Test mechanical integrity and stress-load under controlled conditions.'
        ],
        toolsNeeded: this.getRecommendedTools(category.id, materialKey),
        cautionNote: 'Always disconnect power sources and wear protective eyewear during mechanical or chemical tasks.'
      };
    } else if (verdict === 'REUSE') {
      return {
        mode: 'Creative Upcycling / Repurposing',
        difficultyBadge: 'Creative Craft',
        estimatedTime: '1 - 2 hours',
        keySteps: [
          'Deconstruct non-reusable parts and sort into proper local recycling streams.',
          'Clean, sand, or sanitize reusable structural materials (wood, denim, metal).',
          'Adapt mounting holes, stitch new hemline, or reflash software for secondary role.',
          'Celebrate the piece’s heritage — visible wear tells a characterful story!'
        ],
        toolsNeeded: ['Basic utility knife / scissors', 'Measuring tape', 'Sandpaper / Surface cleaner', 'Mounting hardware or glue'],
        cautionNote: 'Ensure item is sanitized and all sharp burrs or frayed wires are removed before repurposing.'
      };
    } else {
      return {
        mode: 'Responsible Replacement & Certified Recycling',
        difficultyBadge: 'Eco-Retirement',
        estimatedTime: '15 - 30 minutes',
        keySteps: [
          'Do not place into regular landfill garbage bins.',
          'Locate an authorized recycling drop-off (e-waste, metal scrap, or textile bank).',
          'Wipe any personal data (if electronics) or detach hazardous batteries first.',
          'Invest in a "Buy-It-For-Life" replacement featuring repairable screws and spare parts availability.'
        ],
        toolsNeeded: ['Recycling bin bag', 'Protective gloves (if glass/damaged foam)'],
        cautionNote: 'Never burn or incinerate synthetic plastics, treated wood, or electronics.'
      };
    }
  }

  getRecommendedTools(categoryId, materialKey) {
    switch (categoryId) {
      case 'furniture':
        return ['PVA Wood Glue / Epoxy', 'Quick-Grip Bar Clamps', 'Fine 220-Grit Sandpaper', 'Rubber Mallet'];
      case 'clothing':
        return ['Fabric Scissors', 'Heavy-Duty Needle & Thread', 'Sashiko / Denim Patch', 'Iron-on Bonding Tape'];
      case 'electronics':
        return ['Precision Screwdriver Set (Torx/Phillips)', 'Plastic Pry Spudger', '99% Isopropyl Alcohol', 'Tweezers'];
      case 'kitchen':
        return ['Non-abrasive scour pad', 'Food-safe mineral or flaxseed oil', 'High-heat baking oven', 'Diamond sharpening stone'];
      case 'mechanical':
        return ['Metric Hex / Allen Keys (4,5,6mm)', 'Cable Cutter', 'Chain Degreaser & Dry Lube', 'Adjustable Wrench'];
      case 'hardware':
        return ['Plumber’s Teflon Tape', 'Channel-lock Pliers', 'Replacement Rubber O-rings', 'White Vinegar Descaler'];
      default:
        return ['General Multi-tool', 'Adhesive / Superglue', 'Cleaning Cloth'];
    }
  }
}

// Global browser export
if (typeof window !== 'undefined') {
  window.RefixEngine = RefixEngine;
}
