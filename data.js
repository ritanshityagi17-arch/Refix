/**
 * REFIX — Fix It First
 * Circularity Knowledge Base & Benchmark Data
 * 
 * Open Circular Economy Platform
 * Multi-Material Lifecycles, Heuristics, and Environmental Factors
 */

const REFIX_DATA = {
  currency: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    format: 'en-IN'
  },
  costDisclaimer: 'All financial estimates, repair costs, and replacement values are illustrative estimates for circular decision guidance.',

  categories: [
    {
      id: 'furniture',
      name: 'Furniture & Woodwork',
      icon: '🪑',
      badge: 'High Repairability',
      description: 'Chairs, dining tables, desks, bookshelves, cabinetry, and wooden decor.',
      avgLifespanYears: 15,
      co2ReplacementKg: 48,
      landfillWeightKg: 22,
      commonIssues: ['Loose mortise joints & wobbly legs', 'Surface scratches & water rings', 'Broken slats', 'Worn upholstery padding'],
      subcategories: [
        'Solid Oak Dining Chair',
        'Hardwood Table / Desk',
        'Cabinet / Dresser Drawer',
        'Bookshelf & Shelving',
        'Upholstered Armchair',
        'Wooden Bed Frame'
      ],
      materials: [
        { id: 'solid_wood', name: 'Solid Hardwood / Softwood', repairEase: 90, recyclability: 85 },
        { id: 'engineered_wood', name: 'MDF / Particle Board', repairEase: 45, recyclability: 30 },
        { id: 'upholstered', name: 'Wood with Fabric / Foam', repairEase: 65, recyclability: 40 }
      ]
    },
    {
      id: 'clothing',
      name: 'Clothing, Footwear & Textiles',
      icon: '👕',
      badge: 'High Upcycling Potential',
      description: 'Denim, cotton shirts, leather boots, outerwear, backpacks, knitwear, and home textiles.',
      avgLifespanYears: 5,
      co2ReplacementKg: 28,
      landfillWeightKg: 1.8,
      commonIssues: ['Torn seams & crotch blowouts', 'Stuck / broken zippers', 'Worn shoe outsoles', 'Moth holes in knitwear'],
      subcategories: [
        'Damaged Cotton Shirt',
        'Denim Jeans & Jackets',
        'Worn Leather Boots',
        'Winter Coat / Parka',
        'Backpack / Canvas Bag',
        'Wool Sweater & Knitwear'
      ],
      materials: [
        { id: 'cotton_denim', name: '100% Cotton / Denim', repairEase: 95, recyclability: 90 },
        { id: 'leather', name: 'Natural Leather / Suede', repairEase: 80, recyclability: 60 },
        { id: 'synthetic_textile', name: 'Polyester / Nylon / Blend', repairEase: 70, recyclability: 35 },
        { id: 'wool', name: 'Natural Wool / Cashmere', repairEase: 85, recyclability: 85 }
      ]
    },
    {
      id: 'electronics',
      name: 'Electronics & Small Appliances',
      icon: '📱',
      badge: 'E-Waste Critical',
      description: 'Solid State Drives (SSDs), smartphones, laptops, blenders, audio equipment, and home gadgets.',
      avgLifespanYears: 4,
      co2ReplacementKg: 65,
      landfillWeightKg: 2.5,
      commonIssues: ['Loose USB-C / interface ports', 'Cracked glass / screens', 'Degraded batteries', 'Frayed cords & power jacks', 'Worn motor drive sockets'],
      subcategories: [
        'Solid State Drive (SSD)',
        'Smartphone / Mobile Device',
        'Laptop & Computing Hardware',
        'Kitchen Blender & Mixer',
        'Headphones & Audio Gear',
        'Power Tool Battery & Charger'
      ],
      materials: [
        { id: 'modular_electronics', name: 'Modular Electronics (Accessible screws/ports)', repairEase: 75, recyclability: 65 },
        { id: 'sealed_electronics', name: 'Glued / Sealed Unibody (Proprietary)', repairEase: 35, recyclability: 40 },
        { id: 'electromechanical', name: 'Motor / Mechanical Assembly', repairEase: 60, recyclability: 70 }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchenware, Ceramics & Cookware',
      icon: '🍳',
      badge: 'Longevity Focus',
      description: 'Cast iron skillets, stainless steel cookware, ceramic mugs, porcelain bowls, and pans.',
      avgLifespanYears: 10,
      co2ReplacementKg: 32,
      landfillWeightKg: 3.5,
      commonIssues: ['Loose pan handles', 'Surface rust on cast iron', 'Chipped ceramic rims', 'Flaking non-stick coating (Safety Veto)'],
      subcategories: [
        'Cast Iron Skillet',
        'Chipped Ceramic Mug / Bowl',
        'Multi-Ply Stainless Steel Pan',
        'PTFE Non-stick Pan',
        'Glass Storage Container / Jar',
        'Chef Knife & Cutlery'
      ],
      materials: [
        { id: 'cast_iron_steel', name: 'Cast Iron / Carbon Steel', repairEase: 98, recyclability: 100 },
        { id: 'ceramic_porcelain', name: 'Ceramic / Porcelain / Stoneware', repairEase: 50, recyclability: 70 },
        { id: 'teflon_nonstick', name: 'PTFE Non-stick Coated Aluminum (Safety Hazard)', repairEase: 10, recyclability: 25 },
        { id: 'stainless_steel', name: 'Multi-ply Stainless Steel', repairEase: 90, recyclability: 95 }
      ]
    },
    {
      id: 'mechanical',
      name: 'Bicycles, Sports & Mechanical Tools',
      icon: '🚲',
      badge: 'Highly Repairable',
      description: 'Commuter bicycles, power drills, skateboards, exercise bikes, and manual hand tools.',
      avgLifespanYears: 12,
      co2ReplacementKg: 85,
      landfillWeightKg: 14,
      commonIssues: ['Stretched cables & slipped gears', 'Punctured inner tubes', 'Worn brake pads', 'Wobbly bearings', 'Cracked safety helmet foam (Safety Veto)'],
      subcategories: [
        'Commuter Bicycle',
        'Cordless Power Drill',
        'Skateboard / Scooter Deck',
        'Hand Tool (Saw, Wrench, Pliers)',
        'Bicycle Safety Helmet',
        'Lawnmower / Weed Trimmer'
      ],
      materials: [
        { id: 'steel_alloy', name: 'Tubular Steel / Aluminum Alloy', repairEase: 90, recyclability: 95 },
        { id: 'carbon_fiber', name: 'Carbon Fiber Composite', repairEase: 30, recyclability: 15 },
        { id: 'safety_foam_eps', name: 'Expanded Polystyrene (EPS Impact Foam)', repairEase: 0, recyclability: 10 }
      ]
    },
    {
      id: 'hardware',
      name: 'Home Hardware & Fixtures',
      icon: '🔨',
      badge: 'High Circularity',
      description: 'Faucets, brass door handles, cabinet hinges, locks, and metal fittings.',
      avgLifespanYears: 20,
      co2ReplacementKg: 24,
      landfillWeightKg: 4.2,
      commonIssues: ['Worn rubber O-rings & mineral leaks', 'Stripped screw threads', 'Corroded latch mechanisms', 'Loose hinges'],
      subcategories: [
        'Bathroom / Kitchen Faucet',
        'Door Lockset & Deadbolt',
        'Cabinet Hinges & Slides',
        'Ceiling Fan & Ventilation',
        'Window Hardware & Latches'
      ],
      materials: [
        { id: 'brass_bronze', name: 'Solid Brass / Bronze', repairEase: 88, recyclability: 98 },
        { id: 'die_cast_zinc', name: 'Pot Metal / Die-Cast Zinc', repairEase: 40, recyclability: 60 }
      ]
    },
    {
      id: 'plastics',
      name: 'Plastics, Books & Everyday Goods',
      icon: '🧴',
      badge: 'Material Recovery',
      description: 'Storage bins, suitcases, books, paper goods, plastic packaging, toys, and containers.',
      avgLifespanYears: 6,
      co2ReplacementKg: 18,
      landfillWeightKg: 2.1,
      commonIssues: ['Cracked plastic shells', 'Loose book spines & dog-eared pages', 'Broken suitcase wheels', 'Degraded food seal'],
      subcategories: [
        'Old Hardcover Book',
        'HDPE Plastic Storage Tub',
        'Hard-Shell Suitcase / Luggage',
        'Children Wooden / Plastic Toy',
        'PET 2-Liter Beverage Bottle',
        'Natural Wine Corks'
      ],
      materials: [
        { id: 'paper_cardboard', name: 'Cellulose / Acid-Free Paper', repairEase: 85, recyclability: 95 },
        { id: 'polypropylene', name: 'Polypropylene / Polyethylene (HDPE)', repairEase: 55, recyclability: 70 },
        { id: 'polycarbonate', name: 'Polycarbonate / ABS Hard Shell', repairEase: 60, recyclability: 50 }
      ]
    }
  ],

  // Ready-to-Evaluate Scenario Presets (All in Indian Rupees ₹ - Illustrative Estimates)
  presets: [
    {
      id: 'chair_wood',
      name: 'Solid Oak Dining Chair',
      tag: 'Furniture • Solid Wood',
      category: 'furniture',
      categoryName: 'Furniture & Woodwork',
      itemTitle: 'Solid Oak Dining Chair',
      icon: '🪑',
      material: 'solid_wood',
      ageYears: 7,
      damageSeverity: 'minor',
      damageDetails: 'Mortise and tenon joint on rear leg is loose and creaks. Wood is structurally sound.',
      partsAvailability: 'available',
      userSkill: 'intermediate',
      originalCost: 4500,
      repairCost: 450,
      repurposeCost: 600,
      reuseValue: 2800,
      expectedVerdict: 'REPAIR',
      notes: 'Fixing loose mortise joint with PVA wood glue and clamping for 12h saves ₹4,050 vs replacement.'
    },
    {
      id: 'ssd_drive',
      name: 'Solid State Drive (SSD)',
      tag: 'Electronics • Solid State Storage',
      category: 'electronics',
      categoryName: 'Electronics & Small Appliances',
      itemTitle: 'Solid State Drive (SSD)',
      icon: '💾',
      material: 'modular_electronics',
      ageYears: 3,
      damageSeverity: 'minor',
      damageDetails: 'Enclosure USB-C port is mechanically loose and disconnects under cable movement. Flash memory NAND chips and controller operate without data corruption.',
      partsAvailability: 'available',
      userSkill: 'intermediate',
      originalCost: 4200,
      repairCost: 850,
      repurposeCost: 500,
      reuseValue: 2500,
      expectedVerdict: 'REPAIR',
      notes: 'Transferring drive PCB into a modular ₹850 replacement enclosure or re-soldering the connector pin preserves all data and saves ₹3,350.'
    },
    {
      id: 'shirt_cotton',
      name: 'Damaged Cotton Shirt',
      tag: 'Clothing • 100% Cotton',
      category: 'clothing',
      categoryName: 'Clothing, Footwear & Textiles',
      itemTitle: 'Damaged Cotton Button-Down Shirt',
      icon: '👕',
      material: 'cotton_denim',
      ageYears: 2,
      damageSeverity: 'minor',
      damageDetails: 'Torn underarm seam (5cm) and one missing cuff button. Fabric is clean and sturdy.',
      partsAvailability: 'available',
      userSkill: 'beginner',
      originalCost: 1499,
      repairCost: 150,
      repurposeCost: 120,
      reuseValue: 600,
      expectedVerdict: 'REPAIR',
      notes: 'Sewing seam and replacing missing button preserves 2,700 liters of water needed for new cotton.'
    },
    {
      id: 'book_old',
      name: 'Old Hardcover Book',
      tag: 'Plastics & Books • Paper',
      category: 'plastics',
      categoryName: 'Plastics, Books & Everyday Goods',
      itemTitle: 'Old Hardcover Encyclopedia / Book',
      icon: '📚',
      material: 'paper_cardboard',
      ageYears: 18,
      damageSeverity: 'cosmetic',
      damageDetails: 'Loose spine cloth binding, slightly yellowed pages, intact readable text block.',
      partsAvailability: 'available',
      userSkill: 'beginner',
      originalCost: 850,
      repairCost: 120,
      repurposeCost: 100,
      reuseValue: 500,
      expectedVerdict: 'REUSE',
      notes: 'Re-glue spine cloth with pH-neutral starch paste or donate to community reading exchange.'
    },
    {
      id: 'jeans_denim',
      name: 'Denim Jeans (Knee Tear)',
      tag: 'Clothing • Heavy Denim',
      category: 'clothing',
      categoryName: 'Clothing, Footwear & Textiles',
      itemTitle: 'Denim Jeans with Knee Tear',
      icon: '👖',
      material: 'cotton_denim',
      ageYears: 3,
      damageSeverity: 'minor',
      damageDetails: 'Worn fabric blowout at left knee; zipper, rivets, waistband, and pockets are fully intact.',
      partsAvailability: 'available',
      userSkill: 'beginner',
      originalCost: 2799,
      repairCost: 250,
      repurposeCost: 200,
      reuseValue: 1200,
      expectedVerdict: 'REPAIR',
      notes: 'Sashiko visible mending or inner iron-on patch adds character and extends life by 3+ years.'
    },
    {
      id: 'phone_oled',
      name: 'Smartphone with Cracked Glass',
      tag: 'Electronics • Modular Device',
      category: 'electronics',
      categoryName: 'Electronics & Small Appliances',
      itemTitle: 'OLED Smartphone with Cracked Outer Glass',
      icon: '📱',
      material: 'modular_electronics',
      ageYears: 3,
      damageSeverity: 'moderate',
      damageDetails: 'Front exterior glass shattered; digitizer touch response, camera, battery, and logic board 100% functional.',
      partsAvailability: 'available',
      userSkill: 'intermediate',
      originalCost: 24000,
      repairCost: 3200,
      repurposeCost: 1500,
      reuseValue: 11000,
      expectedVerdict: 'REPAIR',
      notes: 'Replacing display module with standard screwdrivers and suction cup saves ₹20,800 and 65kg CO₂e.'
    },
    {
      id: 'pan_teflon',
      name: 'Flaking Teflon Pan',
      tag: 'Cookware • PTFE Aluminum',
      category: 'kitchen',
      categoryName: 'Kitchenware, Ceramics & Cookware',
      itemTitle: 'Non-Stick Frying Pan',
      icon: '🍳',
      material: 'teflon_nonstick',
      ageYears: 4,
      damageSeverity: 'critical',
      damageDetails: 'PTFE non-stick coating peeling and flaking into cooked food surface across cooking floor.',
      partsAvailability: 'none',
      userSkill: 'beginner',
      originalCost: 1800,
      repairCost: 0,
      repurposeCost: 150,
      reuseValue: 0,
      expectedVerdict: 'REPLACE',
      notes: '🚨 SAFETY VETO: Degraded PTFE releases toxic micro-compounds. Never DIY re-coat. Recycle bare aluminum and upgrade to cast iron or multi-ply stainless.'
    },
    {
      id: 'bike_commuter',
      name: 'Commuter Bicycle',
      tag: 'Mechanical • Steel Frame',
      category: 'mechanical',
      categoryName: 'Bicycles, Sports & Mechanical Tools',
      itemTitle: 'Commuter Bicycle with Slipped Derailleur',
      icon: '🚲',
      material: 'steel_alloy',
      ageYears: 6,
      damageSeverity: 'minor',
      damageDetails: 'Rear derailleur cable slack causes gear skipping under load; tires, frame, and brakes are solid.',
      partsAvailability: 'available',
      userSkill: 'intermediate',
      originalCost: 12500,
      repairCost: 650,
      repurposeCost: 1200,
      reuseValue: 7000,
      expectedVerdict: 'REPAIR',
      notes: 'Tightening cable tension screw and oiling links restores crisp shifting in under 15 minutes.'
    },
    {
      id: 'boots_leather',
      name: 'Worn Leather Boots',
      tag: 'Footwear • Full-Grain Leather',
      category: 'clothing',
      categoryName: 'Clothing, Footwear & Textiles',
      itemTitle: 'Full-Grain Leather Work Boots',
      icon: '👞',
      material: 'leather',
      ageYears: 5,
      damageSeverity: 'moderate',
      damageDetails: 'Vibram rubber heel outsole worn down at angle; upper leather is supple and pristine.',
      partsAvailability: 'available',
      userSkill: 'hire_pro',
      originalCost: 6500,
      repairCost: 950,
      repurposeCost: 450,
      reuseValue: 3500,
      expectedVerdict: 'REPAIR',
      notes: 'Goodyear welt resoling by local cobbler restores waterproof traction for 5+ years of wear.'
    },
    {
      id: 'helmet_safety',
      name: 'Cracked Safety Helmet',
      tag: 'Safety Gear • EPS Impact Foam',
      category: 'mechanical',
      categoryName: 'Bicycles, Sports & Mechanical Tools',
      itemTitle: 'Bicycle Safety Helmet',
      icon: '⛑️',
      material: 'safety_foam_eps',
      ageYears: 2,
      damageSeverity: 'critical',
      damageDetails: 'Hairline fracture visible across internal EPS shock-absorbing foam after fall.',
      partsAvailability: 'none',
      userSkill: 'beginner',
      originalCost: 2400,
      repairCost: 0,
      repurposeCost: 0,
      reuseValue: 0,
      expectedVerdict: 'REPLACE',
      notes: '🚨 SAFETY VETO: Single-use EPS micro-cells are crushed. Gluing is fatal. Cut straps and replace new.'
    }
  ],

  // Sample Photos for Camera Scanner Modal
  samplePhotos: [
    {
      id: 'sample-ssd',
      name: 'Solid State Drive (Enclosure Wear)',
      defectName: 'USB-C Interface Connector Strain',
      category: 'electronics',
      material: 'modular_electronics',
      severity: 'minor',
      originalCost: 4200,
      repairCost: 850,
      tag: 'Electronics • SSD',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="42" text-anchor="middle" dominant-baseline="middle">💾</text></svg>`
    },
    {
      id: 'sample-chair',
      name: 'Solid Oak Dining Chair (Wobbly Leg)',
      defectName: 'Mortise & Tenon Joint Separation',
      category: 'furniture',
      material: 'solid_wood',
      severity: 'minor',
      originalCost: 4500,
      repairCost: 450,
      tag: 'Furniture • Wood',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">🪑</text></svg>`
    },
    {
      id: 'sample-phone',
      name: 'OLED Smartphone (Cracked Screen)',
      defectName: 'Display Glass Radial Fracture',
      category: 'electronics',
      material: 'modular_electronics',
      severity: 'moderate',
      originalCost: 24000,
      repairCost: 3200,
      tag: 'Electronics • Phone',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">📱</text></svg>`
    },
    {
      id: 'sample-jeans',
      name: 'Denim Jeans (Inseam Tear)',
      defectName: 'Inner Thigh Seam Blowout',
      category: 'clothing',
      material: 'cotton_denim',
      severity: 'minor',
      originalCost: 2799,
      repairCost: 250,
      tag: 'Textiles • Denim',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">👖</text></svg>`
    },
    {
      id: 'sample-teflon',
      name: 'Teflon Pan (Flaking Coating)',
      defectName: 'PTFE Fluoropolymer Peeling (Safety Hazard)',
      category: 'kitchen',
      material: 'teflon_nonstick',
      severity: 'critical',
      originalCost: 1800,
      repairCost: 0,
      tag: 'Cookware • Safety Veto',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">🍳</text></svg>`
    },
    {
      id: 'sample-bike',
      name: 'Commuter Bike (Slipping Gears)',
      defectName: 'Derailleur Cable Slack & Misalignment',
      category: 'mechanical',
      material: 'steel_alloy',
      severity: 'minor',
      originalCost: 12500,
      repairCost: 650,
      tag: 'Bicycles • Cable',
      svgThumb: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e293b"/><text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">🚲</text></svg>`
    }
  ],

  // Comprehensive Creative Repurposing Ideas (Covering all 10 material categories)
  upcycleProjects: [
    // 1. Clothing & Fabrics
    {
      id: 'up-cloth-1',
      category: 'clothing',
      categoryName: 'Clothing & Fabrics',
      title: 'Heavy-Duty Denim Tool Roll',
      sourceObject: 'Worn-out Denim Jeans with Blown Knees',
      icon: '👖',
      difficulty: 'Beginner',
      timeRequired: '45 mins',
      materialsNeeded: ['Old jeans', 'Fabric shears', 'Needle & thread or machine', '1m twill ribbon'],
      summary: 'Slice the lower leg cylinders of discarded jeans open and stitch vertical divider slots to create a puncture-resistant roll-up tool wrap for chisels, spanners, or paintbrushes.',
      steps: [
        'Cut off the intact denim pant legs below the knee blowout.',
        'Slit each cylinder open along the inner seam to form two long rectangular fabric panels.',
        'Fold bottom 12cm upward to create the pocket pouch; pin securely.',
        'Stitch vertical slots 3cm to 5cm apart to create custom tool sleeves.',
        'Stitch a twill tie ribbon to the outer center hem to roll and bind closed.'
      ],
      co2SavedKg: 14.5,
      costSavingsUSD: 28,
      safetyTip: 'Use a heavy #16 denim needle when machine stitching thick folded flat-felled seams.'
    },
    {
      id: 'up-cloth-2',
      category: 'clothing',
      categoryName: 'Clothing & Fabrics',
      title: 'Zero-Waste T-Shirt Market Tote',
      sourceObject: 'Stained or Stretched Cotton T-Shirt',
      icon: '👕',
      difficulty: 'Beginner',
      timeRequired: '20 mins',
      materialsNeeded: ['Old 100% cotton T-shirt', 'Fabric scissors', 'Ruler'],
      summary: 'Transform an unwanted cotton T-shirt into a strong, washable, expandable market bag without needing a sewing machine—utilizing a no-sew fringe-knot technique.',
      steps: [
        'Turn T-shirt inside out and cut off both sleeves along the inner arm seams.',
        'Cut a deep oval around the neck collar to form the bag opening and shoulder handles.',
        'Cut vertical 8cm slits along the bottom hem spaced 2cm apart to form matching fringes.',
        'Tie opposing front and back fringe pairs tightly in double knots across the base.',
        'Flip right-side out; the jersey knit stretches to hold 10kg of groceries.'
      ],
      co2SavedKg: 6.2,
      costSavingsUSD: 12,
      safetyTip: 'Pinking shears prevent loose jersey fibers from fraying over repeated washings.'
    },
    {
      id: 'up-cloth-3',
      category: 'clothing',
      categoryName: 'Clothing & Fabrics',
      title: 'Flannel Scraps Reusable Cleaning Wipes',
      sourceObject: 'Frayed Flannel Shirt or Worn Bedlinen',
      icon: '🪡',
      difficulty: 'Beginner',
      timeRequired: '15 mins',
      materialsNeeded: ['Flannel fabric scraps', 'Pinking shears', 'Mason jar with lid'],
      summary: 'Convert torn cotton flannel panels into washable, lint-free dusting and glass-cleaning wipes stored in an airtight jar with vinegar and essential oil cleaner.',
      steps: [
        'Discard frayed buttons and seam bands.',
        'Cut clean fabric squares (20x20cm) using zig-zag pinking shears to seal edges.',
        'Stack into a wide-mouth jar with 1 cup water, 1/4 cup white vinegar, and 5 drops tea tree oil.',
        'Pull individual wipes as needed and wash in standard laundry hampers.'
      ],
      co2SavedKg: 4.8,
      costSavingsUSD: 35,
      safetyTip: 'Never use vinegar wipes on natural unsealed marble or granite stone surfaces.'
    },

    // 2. Shoes & Accessories
    {
      id: 'up-shoes-1',
      category: 'clothing',
      categoryName: 'Shoes & Accessories',
      title: 'Artisan Leather Cardholder & Key Fob',
      sourceObject: 'Unrepairable Full-Grain Leather Boot Tongues',
      icon: '👞',
      difficulty: 'Intermediate',
      timeRequired: '40 mins',
      materialsNeeded: ['Thick leather from boots', 'Utility blade', 'Leather hole punch', 'Waxed linen thread', 'Key ring'],
      summary: 'Extract supple, seasoned full-grain leather from boot tongues and collars to craft hand-stitched minimalist cardholders and durable brass-riveted key fobs.',
      steps: [
        'Carefully slice the tongue and ankle collar leather free from worn boot uppers.',
        'Buff clean with saddle soap and trim into a 10x7cm dual-slot card pocket template.',
        'Punch stitch holes along three sides using a 4mm stitching chisel or leather punch.',
        'Saddle stitch with waxed thread and burnish raw edges with beeswax and a wooden slicker.',
        'Rivet leather scrap loop around a brass split ring for a matching heirloom key fob.'
      ],
      co2SavedKg: 18.2,
      costSavingsUSD: 45,
      safetyTip: 'Always clamp a metal ruler over leather and cut on a self-healing mat with a sharp blade.'
    },
    {
      id: 'up-shoes-2',
      category: 'clothing',
      categoryName: 'Shoes & Accessories',
      title: 'Rubber Outsole Garden Mud Treads',
      sourceObject: 'Worn Sneakers with Broken Mesh Uppers',
      icon: '👟',
      difficulty: 'Beginner',
      timeRequired: '25 mins',
      materialsNeeded: ['Old sneakers', 'Heavy shears', 'Shoe cement or rivets'],
      summary: 'Salvage textured rubber tread slabs from retired sneakers and adhere them to smooth wooden garden steps or workshop ladder rungs to prevent dangerous slipping in wet weather.',
      steps: [
        'Cut away the ruined fabric mesh uppers right at the midsole edge.',
        'Scrape clean the grippy EVA/rubber outsole base.',
        'Apply outdoor polyurethane adhesive or screws to mount rubber soles onto wooden ramp or steps.',
        'Cure for 24 hours under a brick weight.'
      ],
      co2SavedKg: 5.4,
      costSavingsUSD: 22,
      safetyTip: 'Work in a ventilated area when applying contact cement adhesives.'
    },

    // 3. Books & Paper
    {
      id: 'up-books-1',
      category: 'plastics',
      categoryName: 'Books & Paper',
      title: 'Secret Book-Nook Compartment Box',
      sourceObject: 'Damaged Hardcover Encyclopedia / Discarded Book',
      icon: '📚',
      difficulty: 'Intermediate',
      timeRequired: '1 hour',
      materialsNeeded: ['Old thick hardcover book', 'Utility craft knife', 'PVA book glue', 'Ruler', 'Clamps'],
      summary: 'Hollow out the interior page block of an obsolete hardcover volume to create a discreet, bookshelf-camouflaged compartment for keepsakes, jewelry, or backup keys.',
      steps: [
        'Open the cover and protect the first 10 pages with plastic wrap.',
        'Paint outer edges of remaining closed pages with a 50/50 water-PVA glue solution and clamp tightly for 1 hour.',
        'Draw a 2cm border on the top page, then slice inward layer-by-layer with a sharp utility knife.',
        'Coat the newly exposed inner hollow pocket with PVA glue to bind all inner page edges firm.',
        'Allow 12 hours drying time under weight.'
      ],
      co2SavedKg: 8.5,
      costSavingsUSD: 30,
      safetyTip: 'Change knife blades often; dull blades slip and rip wet paper fibers.'
    },
    {
      id: 'up-books-2',
      category: 'plastics',
      categoryName: 'Books & Paper',
      title: 'Biodegradable Seedling Starter Pots',
      sourceObject: 'Unread Newspaper / Pulp Paperback Pages',
      icon: '🌱',
      difficulty: 'Beginner',
      timeRequired: '15 mins',
      materialsNeeded: ['Non-glossy newsprint pages', 'Small glass jar or can', 'Potting soil', 'Seeds'],
      summary: 'Roll non-toxic black-and-white newspaper pages around a cylindrical jar into biodegradable nursery pots that can be planted straight into garden beds without root shock.',
      steps: [
        'Cut newspaper strips 15cm wide by 30cm long.',
        'Wrap strip around base of a small jar, leaving 4cm overhang past the bottom.',
        'Fold overhanging paper tightly inward like origami to seal the base.',
        'Slide jar out, fill pot with compost soil, and sow vegetable seeds.',
        'When planting outdoors, set the entire paper pot directly into earth where it decomposes.'
      ],
      co2SavedKg: 3.1,
      costSavingsUSD: 18,
      safetyTip: 'Use only standard matte newsprint with non-toxic soy ink; avoid glossy colored magazine pages.'
    },

    // 4. Furniture & Wood
    {
      id: 'up-furn-1',
      category: 'furniture',
      categoryName: 'Furniture & Woodwork',
      title: 'Under-Bed Rolling Storage Organizer',
      sourceObject: 'Sturdy Hardwood Drawer from Broken Dresser',
      icon: '🪑',
      difficulty: 'Intermediate',
      timeRequired: '45 mins',
      materialsNeeded: ['Solid wood drawer', '4 low-profile caster wheels', 'Short wood screws', 'Drawer handle'],
      summary: 'Rescue a solid dovetail-jointed drawer from a collapsed particle-board dresser, mount four caster wheels to the underside, and roll it beneath beds for blanket storage.',
      steps: [
        'Sand the drawer exterior to remove splinters and wipe clean with mineral spirits.',
        'Flip drawer upside-down and pre-drill pilot holes in the four corner frame blocks.',
        'Fasten 4 swivel caster wheels using 20mm heavy-duty wood screws.',
        'Attach a sturdy brass or leather pull handle to the front face.',
        'Roll seamlessly beneath bedframes or sofas for dust-free storage.'
      ],
      co2SavedKg: 26.0,
      costSavingsUSD: 65,
      safetyTip: 'Ensure screw length is shorter than drawer bottom panel thickness to avoid sharp penetrations.'
    },
    {
      id: 'up-furn-2',
      category: 'furniture',
      categoryName: 'Furniture & Woodwork',
      title: 'Farmhouse Hanging Slatted Herb Shelf',
      sourceObject: 'Broken Wooden Dining Chair Backrest',
      icon: '🪴',
      difficulty: 'Intermediate',
      timeRequired: '1 hour',
      materialsNeeded: ['Chair backrest with spindles', 'Sandpaper (120/220 grit)', 'D-ring picture hooks', 'Jute rope'],
      summary: 'Unscrew the carved wooden spindles and arched crest rail of a wobbly chair, invert it horizontally, and hang small terracotta potted succulents between the upright bars.',
      steps: [
        'Saw or unbolt the intact backrest assembly away from broken chair seat rails.',
        'Sand away cracked lacquer and apply a coat of Danish oil or natural beeswax.',
        'Mount two heavy-duty D-ring hangers to the rear spine.',
        'Secure firmly to wall studs and slide matching ceramic herb pots between spindles.'
      ],
      co2SavedKg: 18.0,
      costSavingsUSD: 50,
      safetyTip: 'Always use drywall wall anchors rated for at least 15kg when hanging terracotta plants.'
    },

    // 5. Electronics & Electrical Appliances
    {
      id: 'up-elec-1',
      category: 'electronics',
      categoryName: 'Electronics & Small Appliances',
      title: 'High-Speed USB Storage from Internal SSD',
      sourceObject: 'Decommissioned PC / Laptop M.2 or SATA SSD',
      icon: '💾',
      difficulty: 'Beginner',
      timeRequired: '10 mins',
      materialsNeeded: ['Functional internal SSD', 'Aluminum USB-C NVMe/SATA enclosure ($15)'],
      summary: 'Extract a fast internal solid state drive from a discarded laptop and slide it into a tool-free aluminum enclosure to create a pocket-sized 1000MB/s backup drive.',
      steps: [
        'Unscrew laptop base plate and ground yourself on an unpainted metal surface.',
        'Remove the single mounting screw retaining the M.2 SSD card.',
        'Slide SSD into the aluminum USB-C enclosure at a 30-degree angle and snap the thermal pad down.',
        'Plug into computer USB-C port, format as exFAT, and enjoy blazing-fast portable storage.'
      ],
      co2SavedKg: 35.0,
      costSavingsUSD: 85,
      safetyTip: 'Touch an earthed metallic object first to discharge static electricity before handling raw NAND circuit boards.'
    },
    {
      id: 'up-elec-2',
      category: 'electronics',
      categoryName: 'Electronics & Small Appliances',
      title: 'Dedicated Home Security Streamer / Cam',
      sourceObject: 'Cracked Smartphone with Intact Camera Sensor',
      icon: '📱',
      difficulty: 'Easy (Software only)',
      timeRequired: '20 mins',
      materialsNeeded: ['Old smartphone', 'USB charger cable', 'Phone mount or adhesive stand'],
      summary: 'Repurpose an old smartphone with a broken front screen into a high-definition 1080p pet camera or baby monitor running over local Wi-Fi via open-source streaming software.',
      steps: [
        'Factory reset phone and remove all personal accounts/passwords.',
        'Install open-source camera streaming app (e.g. Haven, DroidCam, or Alfred Camera).',
        'Mount phone in discreet bracket overlooking front doorway or 3D printer bed.',
        'Plug in continuous power adapter and access live video feed from any web browser on your network.'
      ],
      co2SavedKg: 42.0,
      costSavingsUSD: 70,
      safetyTip: 'Do NOT use phones with visibly swollen or bulging lithium-ion batteries—recycle swollen batteries safely.'
    },
    {
      id: 'up-elec-3',
      category: 'electronics',
      categoryName: 'Electronics & Small Appliances',
      title: 'Safe Component & Cord Recovery',
      sourceObject: 'Dead Blender Base / Appliance with Burnt Motor',
      icon: '🔌',
      difficulty: 'Intermediate',
      timeRequired: '25 mins',
      materialsNeeded: ['Phillips screwdriver', 'Wire cutters', 'Multimeter'],
      summary: 'Recover thick heavy-gauge copper power cords, rubber vibration feet, toggle switches, and stainless hardware from fried appliances before recycling bare casing.',
      steps: [
        'Ensure appliance has been unplugged from wall outlet for at least 48 hours.',
        'Snip the AC power cord near chassis to salvage a grounded replacement cord for future lamps or tools.',
        'Unscrew non-slip rubber feet and stainless chassis screws into parts jars.',
        'Deliver dead copper motor windings to certified e-waste scrap stream.'
      ],
      co2SavedKg: 12.0,
      costSavingsUSD: 30,
      safetyTip: '🚨 NEVER disassemble microwave ovens, CRT televisions, or heat pumps—capacitors store lethal voltage even when unplugged.'
    },

    // 6. Plastic Containers & Packaging
    {
      id: 'up-plast-1',
      category: 'plastics',
      categoryName: 'Plastics & Packaging',
      title: 'Inverted Self-Watering Wicking Planter',
      sourceObject: 'Clean 2-Liter PET Soda / Water Bottle',
      icon: '🧴',
      difficulty: 'Beginner',
      timeRequired: '15 mins',
      materialsNeeded: ['Empty 2L plastic bottle', 'Box cutter', 'Cotton wick / shoelace', 'Potting mix'],
      summary: 'Cut a 2-liter bottle in half and invert the neck into the water-filled base with a cotton wicking cord to build an automatic sub-irrigated kitchen planter for mint or basil.',
      steps: [
        'Thoroughly wash and rinse the bottle with warm soapy water.',
        'Cut bottle horizontally into two halves 10cm down from cap.',
        'Poke a 5mm hole through bottle cap and thread a 15cm cotton cord through.',
        'Invert top half like a funnel into base; fill base with 5cm water.',
        'Pack potting soil into funnel around wick and plant seeds; capillary action waters roots automatically.'
      ],
      co2SavedKg: 2.8,
      costSavingsUSD: 16,
      safetyTip: 'Never use containers that previously stored motor oil, herbicides, or cleaning bleach for edible herbs.'
    },
    {
      id: 'up-plast-2',
      category: 'plastics',
      categoryName: 'Plastics & Packaging',
      title: 'Hardware Workshop Scoop & Sorter Tubs',
      sourceObject: 'Clean HDPE (#2) Laundry Detergent Jugs',
      icon: '🪣',
      difficulty: 'Beginner',
      timeRequired: '15 mins',
      materialsNeeded: ['Empty HDPE detergent bottle', 'Marker', 'Utility shears'],
      summary: 'Slice durable #2 HDPE plastic jugs along the handle angle to produce indestructible garden compost scoops or interlocking nail/screw organizers for workbench pegboards.',
      steps: [
        'Rinse container with hot water until water runs completely clear of detergent bubbles.',
        'Trace a diagonal scoop line from handle base downward to front bottom lip.',
        'Cut along line with heavy-duty kitchen shears.',
        'Smooth cut edges with 180-grit sandpaper.',
        'Use ergonomic handle to scoop garden potting soil, pet kibble, or birdseed.'
      ],
      co2SavedKg: 4.5,
      costSavingsUSD: 14,
      safetyTip: 'Sand plastic edges to remove micro-burrs that could scratch skin during fast scooping.'
    },

    // 7. Glass & Metal
    {
      id: 'up-glass-1',
      category: 'kitchen',
      categoryName: 'Glass & Metal',
      title: 'Magnetic Under-Shelf Spice Carousel',
      sourceObject: 'Empty Glass Baby Food / Jam Jars with Metal Lids',
      icon: '🏺',
      difficulty: 'Beginner',
      timeRequired: '30 mins',
      materialsNeeded: ['Matching glass jars with lids', 'Neodymium magnets or short wood screws', 'Under-cabinet shelf'],
      summary: 'Fasten clean metal jar lids directly to the underside of upper kitchen cabinets so glass jars screw upward into place, freeing up 100% of counter work space.',
      steps: [
        'Wash glass jars thoroughly and soak off label adhesive with baking soda and oil.',
        'Drill two small pilot holes in each metal screw lid.',
        'Screw lids spaced 4cm apart into the underside of your wooden kitchen cabinet.',
        'Fill jars with dried oregano, paprika, or loose hardware nuts and bolts.',
        'Screw glass jars upward into their hanging lids with a quick quarter-turn.'
      ],
      co2SavedKg: 9.0,
      costSavingsUSD: 40,
      safetyTip: 'Check that screw heads sit flush inside lid so glass rims seal tight without metal chipping.'
    },
    {
      id: 'up-metal-1',
      category: 'kitchen',
      categoryName: 'Glass & Metal',
      title: 'Industrial Desk Organizer & Pencil Caddy',
      sourceObject: 'Clean Steel Food Cans (Soup / Tomato / Beans)',
      icon: '🥫',
      difficulty: 'Beginner',
      timeRequired: '25 mins',
      materialsNeeded: ['3 clean steel cans', 'Metal file or rotary tool', 'Scrap wood block', 'Spray primer'],
      summary: 'Smooth sharp inner rims of clean food tins with a metal file, paint in matte terracotta or sage green, and fasten onto a salvaged wooden base for an organized desktop workstation.',
      steps: [
        'Wash cans and peel paper labels cleanly in warm water.',
        'Use a flat metal bastard file to grind down any sharp burs left by the can opener.',
        'Spray with rust-preventive metal primer and topcoat.',
        'Screw three varying height cans onto a reclaimed wooden base from the inside base.',
        'Organize scissors, rulers, pens, and USB cables.'
      ],
      co2SavedKg: 3.8,
      costSavingsUSD: 20,
      safetyTip: 'Wear heavy leather gloves when filing raw steel edges to prevent cuts from sharp burrs.'
    },

    // 8. Toys & Sports Equipment
    {
      id: 'up-toys-1',
      category: 'mechanical',
      categoryName: 'Toys & Sports Equipment',
      title: 'Wall-Mounted Skateboard Floating Bookshelf',
      sourceObject: 'Cracked / Chipped Maple Skateboard Deck',
      icon: '🛹',
      difficulty: 'Intermediate',
      timeRequired: '40 mins',
      materialsNeeded: ['Old skateboard deck', '2 heavy L-brackets (20cm)', 'Wall anchors', 'Screws'],
      summary: 'Clean grip tape from an old 7-ply Canadian maple skateboard deck and mount it horizontally atop heavy steel L-brackets to create an authentic street-style bookshelf.',
      steps: [
        'Remove trucks and wheels with skate tool (salvage polyurethane wheels for cart casters).',
        'Scrape worn grip tape with a heat gun or sand top deck smooth.',
        'Fasten heavy-duty steel L-brackets into wall studs at matching distance to truck holes.',
        'Bolt deck flat onto brackets using original truck mounting holes.',
        'Displays up to 25 books or sneaker collectibles with cool upturned kicktail ends.'
      ],
      co2SavedKg: 14.0,
      costSavingsUSD: 55,
      safetyTip: 'Pre-drill wall studs to ensure heavy book weight does not pull drywall out.'
    },
    {
      id: 'up-toys-2',
      category: 'plastics',
      categoryName: 'Toys & Sports Equipment',
      title: 'Punctured Tennis Ball Floor Protectors',
      sourceObject: 'Dead / Depressurized Tennis Balls',
      icon: '🎾',
      difficulty: 'Beginner',
      timeRequired: '10 mins',
      materialsNeeded: ['4 flat tennis balls', 'Utility knife', 'Vice or clamp'],
      summary: 'Cut subtle "X" slits in punctured tennis balls and slide them onto wooden or metal chair legs to completely eliminate scraping screeching noises on hardwood or linoleum floors.',
      steps: [
        'Secure tennis ball in a workbench clamp or cup holder so it cannot roll.',
        'Carefully cut a 3cm "X" incision through the felt and rubber core with a utility knife.',
        'Slide ball onto the bottom tip of each chair or desk leg.',
        'The soft felt exterior glides silently without scuffing delicate floor finishes.'
      ],
      co2SavedKg: 2.4,
      costSavingsUSD: 15,
      safetyTip: 'Never hold tennis balls in your bare hand while puncturing with a sharp utility knife.'
    },

    // 9. Bicycles & Mechanics
    {
      id: 'up-bike-1',
      category: 'mechanical',
      categoryName: 'Bicycles & Mechanics',
      title: 'Indestructible Rubber Bungee Straps & Bands',
      sourceObject: 'Punctured Butyl Bicycle Inner Tube',
      icon: '🚲',
      difficulty: 'Beginner',
      timeRequired: '15 mins',
      materialsNeeded: ['Old bicycle inner tube', 'Sharp kitchen scissors', 'Ruler'],
      summary: 'Slice punctured butyl rubber inner tubes across the diameter into heavy-duty Ranger bands and weather-resistant elastic straps that outlast commercial rubber bands by 10x.',
      steps: [
        'Snip off the brass valve stem (recycle with brass scrap).',
        'Wash the outer rubber to remove road dust and talcum powder.',
        'Cut crosswise into 1cm slices for ultra-strong bands, or lengthwise into long tie-down straps.',
        'Use to bundle garden hoses, bind rolled sleeping mats, or strap luggage onto bike racks.',
        'Butyl rubber is UV-resistant and will not dry rot in direct sunlight.'
      ],
      co2SavedKg: 5.5,
      costSavingsUSD: 18,
      safetyTip: 'Avoid using rubber bands near open flames or direct high-heat radiator sources.'
    },
    {
      id: 'up-bike-2',
      category: 'mechanical',
      categoryName: 'Bicycles & Mechanics',
      title: 'Degreased Bicycle Chain Keychains & Art',
      sourceObject: 'Stretched / Worn Steel Bicycle Chain',
      icon: '⛓️',
      difficulty: 'Intermediate',
      timeRequired: '35 mins',
      materialsNeeded: ['Old bike chain', 'Chain breaker tool', 'Citrus degreaser', 'Split key rings'],
      summary: 'Soak stretched bike chains in eco-degreaser to clean grease, then push out master pins to create articulated industrial fidget keychains and cool bottle openers.',
      steps: [
        'Submerge chain in citrus degreaser jar for 2 hours and scrub clean with an old toothbrush.',
        'Use a pocket chain tool to pop out pins every 6 links.',
        'Loop the 6-link segment into a circle and re-press pin halfway to lock into a miniature sprocket ring.',
        'Thread a key ring through the open roller bearing.',
        'Coat with clear metal lacquer to prevent humidity oxidation.'
      ],
      co2SavedKg: 4.2,
      costSavingsUSD: 24,
      safetyTip: 'Dispose of degreaser sludge at hazardous waste depots; do not pour petroleum grease down domestic sinks.'
    },

    // 10. Household Items & Other Materials
    {
      id: 'up-house-1',
      category: 'clothing',
      categoryName: 'Household & Other Materials',
      title: 'Braided Bathroom Mat from Frayed Towels',
      sourceObject: 'Torn / Frayed Cotton Bath Towels',
      icon: '🛁',
      difficulty: 'Beginner',
      timeRequired: '1 hour',
      materialsNeeded: ['3 old bath towels', 'Fabric scissors', 'Large safety pin', 'Heavy needle & thread'],
      summary: 'Slice stained or frayed bath towels into long strips, braid together in a three-strand plait, and coil into a super-absorbent, plush, machine-washable bathroom rug.',
      steps: [
        'Cut towels into long continuous 4cm-wide strips.',
        'Pin three strip ends together and braid tightly along the entire length.',
        'Begin coiling the braid flat like a spiral snail on a flat surface.',
        'Stitch the adjoining coils together on the underside with strong thread every 5cm.',
        'Creates an ultra-absorbent zero-waste bathroom rug that launders in standard wash.'
      ],
      co2SavedKg: 16.0,
      costSavingsUSD: 32,
      safetyTip: 'Pinch braid coils tight while stitching to ensure mat stays flat and does not cup upward.'
    },
    {
      id: 'up-house-2',
      category: 'furniture',
      categoryName: 'Household & Other Materials',
      title: 'Ergonomic Natural Cork Hot Pot Trivet',
      sourceObject: 'Saved Wine & Beverage Corks',
      icon: '🍷',
      difficulty: 'Beginner',
      timeRequired: '25 mins',
      materialsNeeded: ['25 natural wine corks', 'Hot glue gun', 'Sandpaper', 'Metal hose clamp'],
      summary: 'Stand natural bark corks upright in concentric rings and bind them with a brushed metal hose clamp to build a heat-resistant, tabletop-safe trivet for boiling cookware.',
      steps: [
        'Sand cork tops lightly to equalize height to a flat 40mm plane.',
        'Arrange corks upright into a tight hexagonal pattern (one central cork, 6 around, 12 in outer ring).',
        'Dab small drops of hot glue between touching edges.',
        'Tighten an adjustable stainless steel hose clamp around the outer perimeter for industrial chic styling.',
        'Natural suberin cork resists heat up to 200°C without transferring thermal damage to wood tables.'
      ],
      co2SavedKg: 3.6,
      costSavingsUSD: 22,
      safetyTip: 'Use natural corks; avoid synthetic plastic spongy wine stoppers that melt when hot.'
    }
  ],

  // Community Repair & Drop-Off Directory
  directory: [
    {
      id: 'dir-1',
      name: 'Community Repair Café Central',
      type: 'Volunteer Repair Cafe',
      badge: 'Free / Donation',
      services: ['Solid State Drives & Laptops', 'Small Appliances', 'Lamps & Cord Rewiring', 'Clothing Mending', 'Bicycle Tuning'],
      address: '142 Market Street, Community Center',
      city: 'Metro City',
      hours: 'Every 2nd Saturday: 10 AM - 2 PM',
      rating: 4.9,
      reviewsCount: 88,
      toolsAvailable: 'Soldering station, sewing machines, bike truing stand, 3D printer for spare gears'
    },
    {
      id: 'dir-2',
      name: 'Heritage Cobbler & Leather Care',
      type: 'Professional Artisan Cobbler',
      badge: 'Certified Master Cobbler',
      services: ['Shoe Resoling', 'Goodyear Welt Replacement', 'Leather Bag & Zipper Mending', 'Boot Conditioning'],
      address: '88 Oak Avenue',
      city: 'Metro City',
      hours: 'Mon - Fri: 8 AM - 6 PM, Sat: 9 AM - 3 PM',
      rating: 5.0,
      reviewsCount: 142,
      toolsAvailable: 'Heavy-duty leather stitcher, sole press, heel trimmer, edge burnisher'
    },
    {
      id: 'dir-3',
      name: 'Spoke & Sprocket Community Bike Co-op',
      type: 'DIY Bike Workshop',
      badge: 'Open Tool Access',
      services: ['Derailleur Indexing', 'Wheel Truing', 'Cable & Brake Replacement', 'Bottom Bracket Overhaul'],
      address: '215 Greenway Blvd',
      city: 'Metro City',
      hours: 'Tue - Sun: 11 AM - 7 PM',
      rating: 4.8,
      reviewsCount: 116,
      toolsAvailable: 'Full park tool wall, wheel truing stands, bearing press, chain stretch gauges'
    },
    {
      id: 'dir-4',
      name: 'MakerSpace Tool Library & Woodshop',
      type: 'Tool Lending Library',
      badge: 'Community Lending',
      services: ['Tool Lending (Drills, Saws, Clamps)', 'Wood Furniture Restoration Bench', 'Electronics Workbench'],
      address: '404 Industrial Way, Bay 3',
      city: 'Metro City',
      hours: 'Mon - Sat: 9 AM - 8 PM',
      rating: 4.9,
      reviewsCount: 95,
      toolsAvailable: 'Table saw, thickness planer, bar clamps, multimeters, oscilloscopes, sewing machines'
    },
    {
      id: 'dir-5',
      name: 'EcoRecycle Certified E-Waste Depot',
      type: 'Certified Electronics Recycler',
      badge: 'R2 Certified Recycler',
      services: ['Hard Drive & SSD Secure Shredding', 'Lithium Battery Recovery', 'PTFE Cookware Scrap', 'Fluorescent Tube Reclamation'],
      address: '500 Recovery Road',
      city: 'Metro City',
      hours: 'Mon - Fri: 8 AM - 4:30 PM',
      rating: 4.7,
      reviewsCount: 64,
      toolsAvailable: 'Certified degausser, shredder, battery sorting bins, metal separation line'
    }
  ],

  // Sustainability impact benchmarks per material class (kg CO2e per kg saved)
  carbonFactors: {
    solid_wood: { co2ePerKg: 1.8, waterLitersPerKg: 400, circularScore: 92 },
    engineered_wood: { co2ePerKg: 2.4, waterLitersPerKg: 300, circularScore: 40 },
    cotton_denim: { co2ePerKg: 15.0, waterLitersPerKg: 8500, circularScore: 90 },
    leather: { co2ePerKg: 25.0, waterLitersPerKg: 12000, circularScore: 65 },
    synthetic_textile: { co2ePerKg: 18.5, waterLitersPerKg: 1200, circularScore: 35 },
    wool: { co2ePerKg: 22.0, waterLitersPerKg: 4500, circularScore: 85 },
    modular_electronics: { co2ePerKg: 45.0, waterLitersPerKg: 2500, circularScore: 78 },
    sealed_electronics: { co2ePerKg: 60.0, waterLitersPerKg: 3500, circularScore: 30 },
    electromechanical: { co2ePerKg: 28.0, waterLitersPerKg: 1800, circularScore: 70 },
    cast_iron_steel: { co2ePerKg: 3.2, waterLitersPerKg: 450, circularScore: 98 },
    ceramic_porcelain: { co2ePerKg: 2.1, waterLitersPerKg: 600, circularScore: 60 },
    teflon_nonstick: { co2ePerKg: 8.5, waterLitersPerKg: 950, circularScore: 20 },
    stainless_steel: { co2ePerKg: 6.8, waterLitersPerKg: 850, circularScore: 95 },
    steel_alloy: { co2ePerKg: 4.0, waterLitersPerKg: 500, circularScore: 94 },
    carbon_fiber: { co2ePerKg: 32.0, waterLitersPerKg: 1500, circularScore: 25 },
    mixed_metal_plastic: { co2ePerKg: 7.2, waterLitersPerKg: 800, circularScore: 62 },
    brass_bronze: { co2ePerKg: 5.5, waterLitersPerKg: 650, circularScore: 96 },
    die_cast_zinc: { co2ePerKg: 3.8, waterLitersPerKg: 500, circularScore: 60 },
    paper_cardboard: { co2ePerKg: 1.4, waterLitersPerKg: 800, circularScore: 85 },
    polypropylene: { co2ePerKg: 4.8, waterLitersPerKg: 400, circularScore: 65 },
    polycarbonate: { co2ePerKg: 5.2, waterLitersPerKg: 450, circularScore: 60 },
    safety_foam_eps: { co2ePerKg: 6.2, waterLitersPerKg: 300, circularScore: 10 }
  },

  // LCA Factors for Heuristics
  lcaFactors: {
    virginCo2SavingsPerKg: {
      solid_wood: 1.8,
      engineered_wood: 1.2,
      upholstered: 3.5,
      cotton_denim: 15.0,
      leather: 22.0,
      synthetic_textile: 8.5,
      wool: 20.0,
      modular_electronics: 45.0,
      sealed_electronics: 38.0,
      electromechanical: 25.0,
      cast_iron_steel: 3.2,
      ceramic_porcelain: 2.1,
      teflon_nonstick: 9.0,
      stainless_steel: 6.5,
      steel_alloy: 2.8,
      carbon_fiber: 28.0,
      safety_foam_eps: 4.5,
      brass_bronze: 5.5,
      die_cast_zinc: 3.8,
      paper_cardboard: 1.4,
      polypropylene: 2.8,
      polycarbonate: 4.2
    },
    waterSavedLitersPerKg: {
      cotton_denim: 7500,
      wool: 3500,
      leather: 4200,
      solid_wood: 150,
      modular_electronics: 1200,
      synthetic_textile: 1200
    }
  },

  // Distinct illustrative estimates in Indian Rupees (₹) for all Universal Scope options
  subcategoryDefaults: {
    'Solid Oak Dining Chair': { originalCost: 4500, repairCost: 450, ageYears: 7, damageSeverity: 'minor', material: 'solid_wood', damageDetails: 'Wobbly mortise joint, wood fibers structurally sound.' },
    'Hardwood Table / Desk': { originalCost: 8500, repairCost: 750, ageYears: 5, damageSeverity: 'minor', material: 'solid_wood', damageDetails: 'Surface water rings and finish scratches on tabletop.' },
    'Cabinet / Dresser Drawer': { originalCost: 6200, repairCost: 500, ageYears: 6, damageSeverity: 'minor', material: 'solid_wood', damageDetails: 'Sticky wooden drawer runners and misaligned faceplate.' },
    'Bookshelf & Shelving': { originalCost: 3800, repairCost: 350, ageYears: 4, damageSeverity: 'minor', material: 'engineered_wood', damageDetails: 'Loose shelf pins and sagging center span bracket.' },
    'Upholstered Armchair': { originalCost: 11000, repairCost: 1400, ageYears: 5, damageSeverity: 'moderate', material: 'upholstered', damageDetails: 'Worn cushion batting and minor piping thread separation.' },
    'Wooden Bed Frame': { originalCost: 14000, repairCost: 900, ageYears: 4, damageSeverity: 'minor', material: 'solid_wood', damageDetails: 'Squeaking side rail bracket connection bolts.' },

    'Solid State Drive (SSD)': { originalCost: 4200, repairCost: 850, ageYears: 3, damageSeverity: 'minor', material: 'modular_electronics', damageDetails: 'Loose USB-C connector port on enclosure. NAND flash memory 100% healthy.' },
    'Smartphone / Mobile Device': { originalCost: 24000, repairCost: 3200, ageYears: 3, damageSeverity: 'moderate', material: 'modular_electronics', damageDetails: 'Cracked outer display glass; digitizer touch and logic board fully working.' },
    'Laptop & Computing Hardware': { originalCost: 48000, repairCost: 4500, ageYears: 4, damageSeverity: 'minor', material: 'modular_electronics', damageDetails: 'Degraded battery runtime and dusty cooling fan.' },
    'Kitchen Blender & Mixer': { originalCost: 3200, repairCost: 400, ageYears: 3, damageSeverity: 'minor', material: 'electromechanical', damageDetails: 'Stripped rubber drive coupling gear on motor base.' },
    'Headphones & Audio Gear': { originalCost: 5500, repairCost: 600, ageYears: 2, damageSeverity: 'minor', material: 'modular_electronics', damageDetails: 'Cracked plastic headband slider and worn faux-leather ear cushions.' },
    'Power Tool Battery & Charger': { originalCost: 3900, repairCost: 550, ageYears: 3, damageSeverity: 'minor', material: 'modular_electronics', damageDetails: 'Oxidized terminal blades on 18V battery casing.' },

    'Damaged Cotton Shirt': { originalCost: 1499, repairCost: 150, ageYears: 2, damageSeverity: 'minor', material: 'cotton_denim', damageDetails: 'Torn underarm seam (4cm) and missing cuff button.' },
    'Denim Jeans & Jackets': { originalCost: 2799, repairCost: 250, ageYears: 3, damageSeverity: 'minor', material: 'cotton_denim', damageDetails: 'Worn knee blowout; zipper, waistband, and rivets solid.' },
    'Worn Leather Boots': { originalCost: 6500, repairCost: 950, ageYears: 5, damageSeverity: 'moderate', material: 'leather', damageDetails: 'Worn angled heel rubber outsole; upper leather well-conditioned.' },
    'Winter Coat / Parka': { originalCost: 7500, repairCost: 500, ageYears: 3, damageSeverity: 'minor', material: 'synthetic_textile', damageDetails: 'Broken main zipper slider pulling off teeth track.' },
    'Backpack / Canvas Bag': { originalCost: 2200, repairCost: 200, ageYears: 3, damageSeverity: 'minor', material: 'synthetic_textile', damageDetails: 'Frayed shoulder strap stitching at top anchor point.' },
    'Wool Sweater & Knitwear': { originalCost: 3400, repairCost: 300, ageYears: 4, damageSeverity: 'minor', material: 'wool', damageDetails: 'Small hole on elbow sleeve from moth wear.' },

    'Non-Stick Frying Pan (PTFE)': { originalCost: 1800, repairCost: 0, ageYears: 4, damageSeverity: 'critical', material: 'teflon_nonstick', damageDetails: 'PTFE non-stick coating peeling and flaking into food.' },
    'Cast Iron Skillet / Pot': { originalCost: 2400, repairCost: 180, ageYears: 10, damageSeverity: 'cosmetic', material: 'cast_iron_steel', damageDetails: 'Surface flash rust from moisture; cast iron body 100% intact.' },
    'Stainless Steel Cookware': { originalCost: 3100, repairCost: 220, ageYears: 6, damageSeverity: 'minor', material: 'stainless_steel', damageDetails: 'Loose riveted stainless handle bracket.' },
    'Ceramic Plates & Mugs': { originalCost: 1200, repairCost: 150, ageYears: 3, damageSeverity: 'minor', material: 'ceramic_porcelain', damageDetails: 'Small chip on outer ceramic mug rim.' },
    'Glass Jars & Glassware': { originalCost: 600, repairCost: 80, ageYears: 2, damageSeverity: 'cosmetic', material: 'borosilicate_glass', damageDetails: 'Stuck corroded lid ring on vintage preserving jar.' },

    'Commuter Bicycle': { originalCost: 12500, repairCost: 650, ageYears: 6, damageSeverity: 'minor', material: 'steel_alloy', damageDetails: 'Rear derailleur cable slack causes gear slipping under load.' },
    'Skateboard & Longboard': { originalCost: 4500, repairCost: 400, ageYears: 2, damageSeverity: 'minor', material: 'hardwood_mechanics', damageDetails: 'Seized wheel bearings and chipped maple tail.' },
    'Electric Cordless Drill': { originalCost: 5800, repairCost: 650, ageYears: 4, damageSeverity: 'minor', material: 'power_tools', damageDetails: 'Sticky keyless chuck mechanism.' },
    'Hand Saws & Wood Tools': { originalCost: 1600, repairCost: 150, ageYears: 8, damageSeverity: 'minor', material: 'carbon_steel', damageDetails: 'Dull crosscut teeth and light surface oxidation.' },
    'Sports Ball & Inflation Gear': { originalCost: 1200, repairCost: 100, ageYears: 2, damageSeverity: 'minor', material: 'composite_sports', damageDetails: 'Leaking air valve needle bladder core.' },

    'Old Hardcover Book': { originalCost: 850, repairCost: 120, ageYears: 15, damageSeverity: 'cosmetic', material: 'paper_cardboard', damageDetails: 'Loose spine cloth binding, intact readable text block.' },
    'Plastic Storage Containers': { originalCost: 650, repairCost: 80, ageYears: 3, damageSeverity: 'minor', material: 'polypropylene', damageDetails: 'Cracked plastic lid snap latch hinge.' },
    'Luggage & Hard Travel Cases': { originalCost: 4500, repairCost: 450, ageYears: 4, damageSeverity: 'minor', material: 'polycarbonate', damageDetails: 'Broken 360 spinner caster wheel bracket.' },
    'Kids Toys & Activity Sets': { originalCost: 1400, repairCost: 120, ageYears: 2, damageSeverity: 'minor', material: 'polypropylene', damageDetails: 'Loose battery spring contact terminal.' }
  }
};

// Freeze data to prevent accidental mutation
if (typeof window !== 'undefined') {
  window.REFIX_DATA = REFIX_DATA;
}
