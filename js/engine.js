/**
 * REFIX — Fix It First
 * Decision Engine & Algorithmic Assessment Core
 * 
 * Transparent, deterministic heuristic evaluation model based on:
 * - Material circularity benchmarks
 * - Economic Viability Ratio (EVR)
 * - Severity & Safety Hazard Veto Rules
 * - Right-to-Repair lifecycle heuristics
 * - Spatial Action Zone Drop Evaluation (Repair, Reuse, Repurpose, Recycle, Replace)
 */

class RefixEngine {
  constructor(data) {
    this.data = data || window.REFIX_DATA;
  }

  /**
   * Main assessment evaluator for general condition inputs
   * @param {Object} input - form inputs
   * @returns {Object} detailed recommendation result
   */
  assessItem(input) {
    const category = this.data.categories.find(c => c.id === input.category) || this.data.categories[0];
    const materialKey = input.material || (category.materials[0] && category.materials[0].id);
    const materialInfo = this.findMaterial(category, materialKey);
    const carbonBenchmark = (this.data.carbonFactors && this.data.carbonFactors[materialKey]) || { co2ePerKg: 10, waterLitersPerKg: 1000, circularScore: 50 };

    const originalCost = Math.max(10, parseFloat(input.originalCost) || 4500);
    const ageYears = Math.max(0, parseFloat(input.ageYears) || 1);
    const damageSeverity = input.damageSeverity || 'minor';
    const partsAvailability = input.partsAvailability || 'available';
    const userSkill = input.userSkill || 'intermediate';

    // Auto-estimate repair cost if not provided or 0
    let repairCost = parseFloat(input.repairCost);
    if (isNaN(repairCost) || repairCost < 0) {
      repairCost = Math.round(originalCost * 0.15);
    }

    // Economic Viability Ratio: Repair Cost / Replacement Cost
    const evr = originalCost > 0 ? repairCost / originalCost : 0;
    const repurposeCost = Math.round(originalCost * 0.12);
    const reuseValue = Math.round(originalCost * 0.65);

    // Component scores
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
      verdict = 'REUSE';
      verdictReason = `Repairing exceeds 70% of new replacement cost (${Math.round(evr * 100)}%), but the item's ${materialInfo.name} has high structural and creative reuse value.`;
      confidence = 86;
    } else if (evr > 0.75 && reuseScore < 55) {
      verdict = 'REPLACE';
      verdictReason = `Repair cost is uneconomically high relative to replacement (${Math.round(evr * 100)}%) and spare parts or materials are heavily degraded. Safe recycling recommended.`;
      confidence = 84;
    } else if (repairabilityScore >= 55 && evr <= 0.65) {
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

    // Savings Calculation
    const moneySaved = Math.max(0, Math.round(originalCost - repairCost));
    const savingsPercent = Math.min(99, Math.round((moneySaved / originalCost) * 100));

    // Environmental Impact Diverted
    const weightKg = category.landfillWeightKg || 2.5;
    const co2eAvoidedKg = Math.round(weightKg * carbonBenchmark.co2ePerKg * (verdict === 'REPAIR' ? 0.9 : 0.75));
    const wasteDivertedKg = Math.round(weightKg * (verdict === 'REPLACE' ? 0.4 : 0.95));
    const waterConservedL = Math.round(weightKg * carbonBenchmark.waterLitersPerKg * 0.85);

    // Action Plan Steps
    const actionPlan = this.generateActionPlan(verdict, input.itemTitle, materialKey, damageSeverity, safetyVeto);

    return {
      verdict,
      verdictReason,
      confidence,
      repairabilityScore,
      reuseScore,
      costs: {
        originalCost,
        repairCost,
        repurposeCost,
        reuseValue,
        moneySaved,
        savingsPercent
      },
      impact: {
        co2eAvoidedKg,
        wasteDivertedKg,
        waterConservedL
      },
      actionPlan: {
        mode: actionPlan.mode || 'Recommended Action',
        difficultyBadge: 'Moderate',
        keySteps: actionPlan.steps || actionPlan.keySteps || [],
        steps: actionPlan.steps || actionPlan.keySteps || [],
        toolsNeeded: Array.isArray(actionPlan.toolsNote) ? actionPlan.toolsNote : [actionPlan.toolsNote || 'Hand tools'],
        toolsNote: actionPlan.toolsNote || 'Hand tools'
      },
      safetyVeto,
      itemTitle: input.itemTitle || 'Item',
      category: category,
      categoryName: category.name,
      materialInfo: materialInfo,
      materialName: materialInfo ? materialInfo.name : 'Standard'
    };
  }

  /**
   * Specialized Evaluator for Card Drops into a specific Action Zone
   * @param {Object} item - The dragged item card or preset
   * @param {string} actionZone - 'repair' | 'reuse' | 'repurpose' | 'recycle' | 'replace'
   * @returns {Object} detailed recommendation result matching zone
   */
  evaluateDrop(item, actionZone) {
    const categoryId = item.category || 'furniture';
    const category = this.data.categories.find(c => c.id === categoryId) || this.data.categories[0];
    const materialKey = item.material || (category.materials[0] && category.materials[0].id);
    const materialInfo = this.findMaterial(category, materialKey);
    const carbonBenchmark = (this.data.carbonFactors && this.data.carbonFactors[materialKey]) || { co2ePerKg: 10, waterLitersPerKg: 1000, circularScore: 50 };

    const originalCost = Math.max(10, parseFloat(item.originalCost) || parseFloat(item.originalCostUSD) || 4500);
    const damageSeverity = item.damageSeverity || item.severity || 'minor';

    // 1. Safety Hazard Check
    const safetyVeto = this.checkSafetyHazard(materialKey, damageSeverity, item.damageDetails || item.description);

    // 2. Action Guidance Lookup from preset if available
    const presetGuidance = (item.actionGuidance && item.actionGuidance[actionZone]) || null;

    let verdict = actionZone.toUpperCase();
    let verdictReason = '';
    let confidence = 90;
    let actionCost = 0;

    if (actionZone === 'repair') {
      actionCost = item.repairCost !== undefined ? parseFloat(item.repairCost) : (item.repairCostUSD !== undefined ? parseFloat(item.repairCostUSD) : Math.round(originalCost * 0.15));
    } else if (actionZone === 'repurpose') {
      actionCost = item.repurposeCost !== undefined ? parseFloat(item.repurposeCost) : Math.round(originalCost * 0.12);
    } else if (actionZone === 'reuse') {
      actionCost = Math.round(originalCost * 0.05);
    } else if (actionZone === 'recycle') {
      actionCost = 0;
    } else {
      actionCost = originalCost;
    }

    let steps = [];
    let toolsNeeded = 'Standard household tools';
    let headline = '';

    // If safety veto applies and user attempts repair:
    if (safetyVeto.isHazardous && (actionZone === 'repair' || actionZone === 'reuse')) {
      verdict = 'REPLACE';
      confidence = 98;
      verdictReason = `CRITICAL SAFETY ALERT: ${safetyVeto.reason} Repairing or reusing this item is unsafe. Safe retirement and certified recycling mandated.`;
      steps = [
        'Discontinue food preparation, wearing, or use immediately.',
        'Do not attempt DIY chemical re-coating, gluing, or taping.',
        'Deliver to certified specialized hazardous or scrap recycler.',
        'Replace with non-toxic, Buy-It-For-Life alternative.'
      ];
      toolsNeeded = 'Protective gloves / Disconnect';
    } else if (presetGuidance) {
      verdictReason = presetGuidance.explanation;
      steps = presetGuidance.steps;
      toolsNeeded = Array.isArray(presetGuidance.toolsNeeded) ? presetGuidance.toolsNeeded.join(', ') : presetGuidance.toolsNeeded;
      headline = presetGuidance.headline;
    } else {
      // Rule-based fallback for arbitrary items
      const fallback = this.generateFallbackGuidance(actionZone, item.itemTitle || item.name || 'Object', materialInfo.name);
      verdictReason = fallback.explanation;
      steps = fallback.steps;
      toolsNeeded = fallback.tools;
      headline = fallback.headline;
    }

    const moneySaved = Math.max(0, Math.round(originalCost - actionCost));
    const savingsPercent = Math.min(99, Math.round((moneySaved / originalCost) * 100));

    // Environmental metrics
    const weightKg = category.landfillWeightKg || 2.5;
    const co2eAvoidedKg = Math.round(weightKg * carbonBenchmark.co2ePerKg * (actionZone === 'replace' ? 0.15 : 0.88));
    const wasteDivertedKg = Math.round(weightKg * (actionZone === 'replace' ? 0.4 : 0.95));
    const waterConservedL = Math.round(weightKg * carbonBenchmark.waterLitersPerKg * (actionZone === 'replace' ? 0.1 : 0.85));

    // Scores
    let repairabilityScore = actionZone === 'repair' ? 88 : (actionZone === 'replace' ? 25 : 65);
    let reuseScore = (actionZone === 'reuse' || actionZone === 'repurpose') ? 85 : 60;
    if (safetyVeto.isHazardous) {
      repairabilityScore = 10;
      reuseScore = 15;
    }

    return {
      verdict,
      actionZone,
      headline: headline || `${actionZone.toUpperCase()} Pathway`,
      verdictReason,
      confidence,
      repairabilityScore,
      reuseScore,
      costs: {
        originalCost,
        repairCost: actionZone === 'repair' ? actionCost : (item.repairCost !== undefined ? parseFloat(item.repairCost) : Math.round(originalCost * 0.15)),
        repurposeCost: actionZone === 'repurpose' ? actionCost : (item.repurposeCost !== undefined ? parseFloat(item.repurposeCost) : Math.round(originalCost * 0.12)),
        reuseValue: item.reuseValue !== undefined ? parseFloat(item.reuseValue) : Math.round(originalCost * 0.65),
        actionCost,
        moneySaved,
        savingsPercent
      },
      impact: {
        co2eAvoidedKg,
        wasteDivertedKg,
        waterConservedL
      },
      actionPlan: {
        mode: `Action Pathway: ${actionZone.toUpperCase()}`,
        difficultyBadge: actionZone === 'replace' ? 'Commercial' : 'DIY / Moderate',
        keySteps: steps || [],
        steps: steps || [],
        toolsNeeded: Array.isArray(toolsNeeded) ? toolsNeeded : [toolsNeeded || 'Hand tools'],
        toolsNote: Array.isArray(toolsNeeded) ? toolsNeeded.join(', ') : (toolsNeeded || 'Hand tools')
      },
      safetyVeto,
      itemTitle: item.itemTitle || item.name || 'Item',
      category: category,
      categoryName: category.name,
      materialInfo: materialInfo,
      materialName: materialInfo ? materialInfo.name : 'Standard'
    };
  }

  // Safety Hazard Veto Check
  checkSafetyHazard(materialKey, severity, description = '') {
    const desc = (description || '').toLowerCase();

    // 1. Peeling Teflon Non-Stick cookware
    if (materialKey === 'teflon_nonstick' && (severity === 'critical' || severity === 'moderate' || desc.includes('flak') || desc.includes('peel') || desc.includes('scratch'))) {
      return {
        isHazardous: true,
        reason: 'CRITICAL HEALTH HAZARD: Flaking PTFE non-stick coatings emit toxic fluoropolymers and PFAS into food when heated. Surface re-coating at home is strictly prohibited.',
        action: 'REPLACE'
      };
    }

    // 2. Cracked bicycle safety helmet
    if (materialKey === 'safety_foam_eps' && (severity === 'critical' || severity === 'moderate' || desc.includes('crack') || desc.includes('impact') || desc.includes('foam'))) {
      return {
        isHazardous: true,
        reason: 'CRITICAL IMPACT SAFETY RISK: Expanded Polystyrene (EPS) helmet foam is single-use compression material. Any internal fracture permanently destroys shock dissipation capability. Gluing or taping gives a fatal illusion of protection.',
        action: 'REPLACE'
      };
    }

    // 3. Swollen Lithium Battery
    if (desc.includes('swollen') || desc.includes('bulging battery') || desc.includes('smoke') || desc.includes('thermal runaway')) {
      return {
        isHazardous: true,
        reason: 'FIRE / EXPLOSION HAZARD: Punctured or swollen lithium-ion cells risk catastrophic thermal runaway fires. Never charge or puncture a swollen battery.',
        action: 'REPLACE'
      };
    }

    return { isHazardous: false };
  }

  calculateReuseScore(category, materialKey, severity, ageYears, carbonBenchmark) {
    let score = (carbonBenchmark && carbonBenchmark.circularScore) || 50;

    if (materialKey === 'cotton_denim' || materialKey === 'solid_wood' || materialKey === 'cast_iron_steel') {
      score += 20;
    }
    if (severity === 'cosmetic' || severity === 'minor') {
      score += 15;
    }
    if (severity === 'critical') {
      score -= 25;
    }
    return Math.min(100, Math.max(10, score));
  }

  estimateRepairCost(originalCost, severity, parts) {
    let factor = 0.15;
    if (severity === 'cosmetic') factor = 0.08;
    if (severity === 'minor') factor = 0.15;
    if (severity === 'moderate') factor = 0.32;
    if (severity === 'critical') factor = 0.55;

    if (parts === 'rare') factor += 0.12;
    if (parts === 'discontinued' || parts === 'none') factor += 0.20;

    return Math.max(5, Math.round(originalCost * factor));
  }

  getSeverityScore(severity) {
    switch (severity) {
      case 'cosmetic': return 95;
      case 'minor': return 80;
      case 'moderate': return 50;
      case 'critical': return 15;
      default: return 70;
    }
  }

  getPartsScore(parts) {
    switch (parts) {
      case 'available': return 95;
      case 'rare': return 55;
      case 'discontinued': return 35;
      case 'none': return 10;
      default: return 70;
    }
  }

  getSkillScore(skill) {
    switch (skill) {
      case 'beginner': return 65;
      case 'intermediate': return 85;
      case 'advanced': return 100;
      case 'hire_pro': return 75;
      default: return 80;
    }
  }

  findMaterial(category, materialId) {
    if (category && category.materials) {
      const mat = category.materials.find(m => m.id === materialId);
      if (mat) return mat;
    }
    return { id: 'unknown', name: 'Standard Material', repairEase: 60, recyclability: 50 };
  }

  generateActionPlan(verdict, title, materialKey, severity, safetyVeto) {
    if (safetyVeto.isHazardous) {
      return {
        mode: 'Safety Mandate: Safe Retirement & Recycling',
        steps: [
          'Cease using the item immediately to prevent health contamination or bodily injury.',
          'Do not attempt home DIY glue, tape, or surface paint restoration.',
          'Take to a certified municipal hazardous waste or scrap metal reclamation depot.',
          'Upgrade to a non-toxic, serviceable Buy-It-For-Life design.'
        ],
        toolsNote: 'Protective gloves, Safe transport container'
      };
    }

    if (verdict === 'REPAIR') {
      return {
        mode: 'Recommended Action: DIY / Community Fix',
        steps: [
          'Inspect the primary point of failure and remove degraded dust, dried glue, or rust.',
          'Source standard fasteners, patch fabric, or adhesive matching material composition.',
          'Execute repair following iFixit open manuals or local repair cafe volunteer assistance.',
          'Perform mechanical stress test before returning to full daily service.'
        ],
        toolsNote: 'Basic hand tools, appropriate adhesive/thread, safety glasses'
      };
    }

    if (verdict === 'REUSE') {
      return {
        mode: 'Recommended Action: Creative Upcycling & Second Life',
        steps: [
          'Deconstruct sound structural components (planks, denim twill, sheet metal).',
          'Explore the Upcycling Studio showcase below for step-by-step transformation templates.',
          'Sanitize or sand surfaces to prep for secondary household utility.',
          'Alternatively, donate to a community school, maker space, or tool library.'
        ],
        toolsNote: 'Utility scissors / saw, Sandpaper, Cleaning supplies'
      };
    }

    return {
      mode: 'Recommended Action: Certified Circular Recycling',
      steps: [
        'Disassemble and separate mixed materials (unscrew plastics from metal chassis).',
        'Check our local Repair & Drop-Off Directory below for certified recycling depots.',
        'Drop off for scrap material smelting, preventing virgin ore depletion.',
        'Choose replacement products rated 8/10 or higher for repairability.'
      ],
      toolsNote: 'Screwdriver, Sorting containers'
    };
  }

  generateFallbackGuidance(actionZone, itemName, materialName) {
    switch (actionZone) {
      case 'repair':
        return {
          headline: `Restore ${itemName} to Full Function`,
          explanation: `Repairing the damaged ${materialName} restores utility and avoids premature replacement expenses.`,
          steps: ['Inspect joint or mechanism.', 'Clean contact surfaces.', 'Fasten with standard hardware or adhesive.', 'Test load capacity.'],
          tools: 'Basic household tools, adhesive / lubricant'
        };
      case 'reuse':
        return {
          headline: `Share or Reposition ${itemName}`,
          explanation: `The object remains useful. Reposition for secondary utility or share via community library/swap.`,
          steps: ['Clean and sanitize.', 'Donate to community swap or reassign to garage/workshop use.'],
          tools: 'Cleaning cloth'
        };
      case 'repurpose':
        return {
          headline: `Creative Upcycling of ${itemName}`,
          explanation: `The durable ${materialName} has high craft value. Transform into functional workshop or home decor utility.`,
          steps: ['Disassemble unusable elements.', 'Prep raw material.', 'Adapt into organizer, planter, or storage.'],
          tools: 'Utility saw / shears, Sandpaper'
        };
      case 'recycle':
        return {
          headline: `Certified Recycling of ${materialName}`,
          explanation: `Separate distinct material layers and deliver to municipal reclamation facilities to recover virgin resources.`,
          steps: ['Separate plastics and metals.', 'Deliver to certified civic recycling depot.'],
          tools: 'Screwdriver / Pliers'
        };
      default:
        return {
          headline: `Responsible Replacement for ${itemName}`,
          explanation: `Retire responsibly and select a modular Buy-It-For-Life alternative built with serviceable standards.`,
          steps: ['Deliver old item to certified scrap stream.', 'Invest in modular, repairable construction.'],
          tools: 'Ethical buyer guide'
        };
    }
  }
}

// Global browser export
if (typeof window !== 'undefined') {
  window.RefixEngine = RefixEngine;
}
