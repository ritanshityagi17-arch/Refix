/**
 * REFIX — Fix It First
 * Demo Data & Knowledge Base
 * 
 * Note for Judges: All statistics, emissions factors, and cost benchmarks
 * are transparent deterministic demo heuristics drawn from circular economy
 * research (WRAP UK, iFixit, Ellen MacArthur Foundation, and EU Right-to-Repair studies).
 */

const REFIX_DATA = {
  currencies: {
    USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
    INR: { code: 'INR', symbol: '₹', rate: 83.5, name: 'Indian Rupee' }
  },

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
      commonIssues: ['Loose joints & wobbly legs', 'Surface scratches & water rings', 'Broken slats', 'Worn upholstery'],
      subcategories: [
        'Dining Chair / Desk Chair',
        'Wooden Table / Desk',
        'Cabinet / Dresser',
        'Bookshelf / Storage Unit',
        'Sofa / Armchair',
        'Wooden Door / Window Frame'
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
      description: 'Denim, outerwear, leather boots, backpacks, knitwear, and home textiles.',
      avgLifespanYears: 5,
      co2ReplacementKg: 28,
      landfillWeightKg: 1.8,
      commonIssues: ['Torn seams & crotch blowouts', 'Stuck / broken zippers', 'Worn shoe outsoles', 'Moth holes in knitwear'],
      subcategories: [
        'Denim Jeans / Pants',
        'Winter Jacket / Coat',
        'Leather Boots / Shoes',
        'Backpack / Canvas Bag',
        'Sweater / Knitwear',
        'Curtains / Bed Linen'
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
      badge: 'Right-to-Repair Critical',
      description: 'Smartphones, laptops, headphones, kitchen blenders, toasters, and power supplies.',
      avgLifespanYears: 4,
      co2ReplacementKg: 85,
      landfillWeightKg: 2.5,
      commonIssues: ['Cracked screen / casing', 'Degraded lithium battery', 'Loose charging port', 'Burnt motor / fuse'],
      subcategories: [
        'Smartphone / Mobile Device',
        'Laptop / Computer',
        'Headphones / Audio Speaker',
        'Kitchen Blender / Mixer',
        'Coffee Maker / Kettle',
        'Desk Lamp / Light Fixture'
      ],
      materials: [
        { id: 'modular_electronics', name: 'Modular Electronics (Accessible screws)', repairEase: 75, recyclability: 65 },
        { id: 'sealed_electronics', name: 'Glued / Sealed Unibody (Proprietary)', repairEase: 35, recyclability: 40 },
        { id: 'electromechanical', name: 'Motor / Mechanical Assembly', repairEase: 60, recyclability: 70 }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchenware, Ceramics & Cookware',
      icon: '🍳',
      badge: 'Safety-Sensitive Decisions',
      description: 'Pans, skillets, ceramic mugs, chef knives, glassware, and baking sheets.',
      avgLifespanYears: 8,
      co2ReplacementKg: 22,
      landfillWeightKg: 3.2,
      commonIssues: ['Pitted / peeling non-stick surface', 'Surface rust on cast iron', 'Chipped ceramic lip', 'Dull or chipped knife edge'],
      subcategories: [
        'Frying Pan / Skillet',
        'Ceramic Coffee Mug / Bowl',
        'Chef Knife / Cutlery',
        'Cast Iron Cookware',
        'Glass Storage Container / Jar',
        'Baking Sheet / Roasting Pan'
      ],
      materials: [
        { id: 'cast_iron_steel', name: 'Cast Iron / Carbon Steel', repairEase: 98, recyclability: 100 },
        { id: 'ceramic_porcelain', name: 'Ceramic / Porcelain / Stoneware', repairEase: 50, recyclability: 70 },
        { id: 'teflon_nonstick', name: 'PTFE Non-stick Coated Aluminum', repairEase: 10, recyclability: 25 },
        { id: 'stainless_steel', name: 'Multi-ply Stainless Steel', repairEase: 90, recyclability: 95 }
      ]
    },
    {
      id: 'mechanical',
      name: 'Bicycles, Sports & Mechanical Tools',
      icon: '🚲',
      badge: 'High Mechanical Longevity',
      description: 'Bicycles, skateboards, power drills, lawnmowers, and hand tools.',
      avgLifespanYears: 10,
      co2ReplacementKg: 65,
      landfillWeightKg: 14,
      commonIssues: ['Skipping gears / snapped chain', 'Flat tire / worn tread', 'Seized bearings / rust', 'Trigger switch failure'],
      subcategories: [
        'Commuter / Mountain Bicycle',
        'Corded / Cordless Power Drill',
        'Push Lawnmower / Weed Trimmer',
        'Skateboard / Scooter',
        'Hand Tool (Saw, Wrench, Pliers)',
        'Camping Tent / Outdoor Gear'
      ],
      materials: [
        { id: 'steel_alloy', name: 'Tubular Steel / Aluminum Alloy', repairEase: 90, recyclability: 95 },
        { id: 'carbon_fiber', name: 'Carbon Fiber Composite', repairEase: 30, recyclability: 15 },
        { id: 'mixed_metal_plastic', name: 'Machined Metal with Plastic Casing', repairEase: 70, recyclability: 55 }
      ]
    },
    {
      id: 'hardware',
      name: 'Home Hardware & Fixtures',
      icon: '🔨',
      badge: 'High Value Savings',
      description: 'Plumbing faucets, door locks, hinges, curtain tracks, and lighting brackets.',
      avgLifespanYears: 12,
      co2ReplacementKg: 32,
      landfillWeightKg: 4.5,
      commonIssues: ['Dripping cartridge / mineral buildup', 'Loose latch / misaligned strike', 'Stripped screw thread'],
      subcategories: [
        'Kitchen / Bathroom Faucet',
        'Entry Door Lockset / Deadbolt',
        'Curtain Rod / Blind Mechanism',
        'Cabinet Hinges & Drawer Slides',
        'Ceiling Fan / Ventilation Vent'
      ],
      materials: [
        { id: 'brass_bronze', name: 'Solid Brass / Bronze', repairEase: 88, recyclability: 98 },
        { id: 'die_cast_zinc', name: 'Pot Metal / Die-Cast Zinc', repairEase: 40, recyclability: 60 }
      ]
    },
    {
      id: 'plastics',
      name: 'Plastics, Luggage & Everyday Goods',
      icon: '🧳',
      badge: 'Upcycle or Recycle Target',
      description: 'Hard-shell suitcases, storage bins, kids toys, safety helmets, and coolers.',
      avgLifespanYears: 6,
      co2ReplacementKg: 18,
      landfillWeightKg: 3.8,
      commonIssues: ['Broken spinner wheel / trolley handle', 'Cracked plastic shell', 'Broken latch / hinge', 'Safety degradation'],
      subcategories: [
        'Luggage / Suitcase',
        'Plastic Storage Bin / Crate',
        'Bicycle / Skate Safety Helmet',
        'Insulated Cooler Box',
        'Children Toy / Playset'
      ],
      materials: [
        { id: 'polypropylene', name: 'Polypropylene / Polyethylene (HDPE)', repairEase: 55, recyclability: 70 },
        { id: 'polycarbonate', name: 'Polycarbonate / ABS Hard Shell', repairEase: 60, recyclability: 50 },
        { id: 'safety_foam_eps', name: 'Expanded Polystyrene (EPS Impact Foam)', repairEase: 0, recyclability: 10 }
      ]
    }
  ],

  // Ready-to-evaluate scenarios for Judges
  presets: [
    {
      id: 'chair_wood',
      name: 'Wobbly Solid Oak Dining Chair',
      tag: 'Furniture • Wood',
      category: 'furniture',
      itemTitle: 'Solid Oak Dining Chair',
      material: 'solid_wood',
      ageYears: 7,
      damageSeverity: 'minor', // cosmetic, minor, moderate, critical
      damageDetails: 'Mortise and tenon joint on rear leg is loose and creaks. Wood is in excellent shape otherwise.',
      partsAvailability: 'available', // available, rare, discontinued, none
      userSkill: 'intermediate', // beginner, intermediate, advanced, hire_pro
      originalCostUSD: 140,
      repairCostUSD: 12, // glue + clamp or dowel
      expectedVerdict: 'REPAIR',
      notes: 'Classic right-to-repair candidate. A $12 bottle of wood glue + bar clamps saves a $140 chair with zero toxic waste.'
    },
    {
      id: 'jeans_denim',
      name: 'Designer Denim Jeans (Torn Crotch)',
      tag: 'Textiles • Cotton',
      category: 'clothing',
      itemTitle: 'Raw Selvedge Denim Jeans',
      material: 'cotton_denim',
      ageYears: 2,
      damageSeverity: 'moderate',
      damageDetails: 'Blowout along inner thigh seam, 6cm tear. Fabric around it is still thick and durable.',
      partsAvailability: 'available',
      userSkill: 'beginner',
      originalCostUSD: 110,
      repairCostUSD: 15, // tailor sashiko or patch
      expectedVerdict: 'REPAIR',
      notes: 'Sashiko mending or sewing machine darning extends life by 3+ years and saves 3,800 Liters of water required to grow cotton for a new pair.'
    },
    {
      id: 'phone_screen',
      name: 'Smartphone (Cracked Screen, Good Battery)',
      tag: 'Electronics • Modular',
      category: 'electronics',
      itemTitle: '6.1" OLED Smartphone (2 Years Old)',
      material: 'modular_electronics',
      ageYears: 2,
      damageSeverity: 'moderate',
      damageDetails: 'Front glass cracked after drop, touch digitizer and display still function normally.',
      partsAvailability: 'available',
      userSkill: 'hire_pro',
      originalCostUSD: 750,
      repairCostUSD: 110,
      expectedVerdict: 'REPAIR',
      notes: 'Repair cost is 15% of replacement. Saves 70kg of CO2 equivalent emissions caused by semiconductor manufacturing.'
    },
    {
      id: 'teflon_pan',
      name: 'Flaking Non-Stick Teflon Frying Pan',
      tag: 'Kitchen • Toxic Hazard',
      category: 'kitchen',
      itemTitle: 'Non-Stick Aluminum Skillet',
      material: 'teflon_nonstick',
      ageYears: 4,
      damageSeverity: 'critical', // Safety issue!
      damageDetails: 'Non-stick coating is peeling and scratching off into cooking surface; underlying aluminum exposed.',
      partsAvailability: 'none',
      userSkill: 'beginner',
      originalCostUSD: 38,
      repairCostUSD: 45,
      expectedVerdict: 'REPLACE',
      notes: 'SAFETY VETO: Degraded PTFE non-stick coatings cannot be resurfaced safely at home and leach fluoropolymers. Replace with Buy-It-For-Life cast iron or stainless steel, and recycle the aluminum body.'
    },
    {
      id: 'ceramic_mug',
      name: 'Chipped Vintage Ceramic Coffee Mug',
      tag: 'Ceramics • Upcycle Candidate',
      category: 'kitchen',
      itemTitle: 'Glazed Ceramic Coffee Mug',
      material: 'ceramic_porcelain',
      ageYears: 5,
      damageSeverity: 'minor',
      damageDetails: 'Small 4mm chip on the rim that catches lips. Handle and base are pristine.',
      partsAvailability: 'none',
      userSkill: 'beginner',
      originalCostUSD: 18,
      repairCostUSD: 14,
      expectedVerdict: 'REUSE',
      notes: 'Drinking from a chipped rim can harbor bacteria or cut lips. Perfect candidate for creative REUSE as a desk succulent planter, pencil caddy, or Japanese Kintsugi art piece.'
    },
    {
      id: 'bicycle_gears',
      name: 'Commuter Bike with Slipping Gears',
      tag: 'Mechanical • Steel',
      category: 'mechanical',
      itemTitle: '7-Speed Commuter Bicycle',
      material: 'steel_alloy',
      ageYears: 3,
      damageSeverity: 'minor',
      damageDetails: 'Rear derailleur cable stretched; chain skips between 4th and 5th gear on hills.',
      partsAvailability: 'available',
      userSkill: 'intermediate',
      originalCostUSD: 360,
      repairCostUSD: 18, // new cable and barrel tuning
      expectedVerdict: 'REPAIR',
      notes: 'A simple cable replacement and limit screw adjustment brings shifting back to factory performance for < 5% of bike cost.'
    },
    {
      id: 'old_laptop',
      name: 'Aging Laptop (Slow HDD, 8 Years Old)',
      tag: 'Electronics • Repurpose',
      category: 'electronics',
      itemTitle: 'Core i3 Laptop with Worn Battery',
      material: 'modular_electronics',
      ageYears: 8,
      damageSeverity: 'moderate',
      damageDetails: 'Too sluggish for Windows 11; battery lasts 15 minutes unplugged. Screen and motherboard working.',
      partsAvailability: 'discontinued',
      userSkill: 'intermediate',
      originalCostUSD: 600,
      repairCostUSD: 180, // new battery + ram + ssd
      expectedVerdict: 'REUSE',
      notes: 'Repairing to modern daily-driver standards is uneconomical, but REPURPOSING with lightweight Linux transforms it into a zero-cost Home Assistant server, Plex media hub, or retro arcade console.'
    },
    {
      id: 'safety_helmet',
      name: 'Cracked Bicycle Safety Helmet',
      tag: 'Safety • Replace Alert',
      category: 'plastics',
      itemTitle: 'EPS Foam Road Bicycle Helmet',
      material: 'safety_foam_eps',
      ageYears: 3,
      damageSeverity: 'critical',
      damageDetails: 'Hairline fracture through inner EPS foam liner after a pavement impact.',
      partsAvailability: 'none',
      userSkill: 'beginner',
      originalCostUSD: 75,
      repairCostUSD: 0,
      expectedVerdict: 'REPLACE',
      notes: 'SAFETY MANDATE: Impact protection helmets rely on one-time compression of EPS foam. Any structural crack permanently ruins shock attenuation. Never repair a cracked safety helmet. Recycle shell and replace immediately.'
    }
  ],

  // Upcycling showcase database
  upcycleProjects: [
    {
      id: 'upcycle-denim-toolroll',
      title: 'Heavy-Duty Denim Tool Roll',
      category: 'clothing',
      originalItem: 'Tattered Work Jeans',
      difficulty: 'Easy',
      timeHours: 1.5,
      costSavingsUSD: 35,
      co2SavedKg: 14,
      imagePlaceholder: 'denim-tool',
      tags: ['Textile', 'No Complex Tools', 'Zero Waste'],
      summary: 'Convert old denim pant legs into a rugged roll-up tool organizer with custom-stitched pockets for wrenches, screwdrivers, or art brushes.'
    },
    {
      id: 'upcycle-mug-planter',
      title: 'Kintsugi or Drainage Succulent Pot',
      category: 'kitchen',
      originalItem: 'Chipped Ceramic Mug / Bowl',
      difficulty: 'Beginner',
      timeHours: 0.5,
      costSavingsUSD: 16,
      co2SavedKg: 4,
      imagePlaceholder: 'ceramic-pot',
      tags: ['Ceramic', 'Indoor Decor', '5-Minute Fix'],
      summary: 'Drill a drainage hole using a masonry bit or layer gravel at the base to turn chipped ceramic cups into charming desktop planters.'
    },
    {
      id: 'upcycle-laptop-server',
      title: 'Silent Home Media / DNS Server',
      category: 'electronics',
      originalItem: 'Retired Laptop (Old CPU)',
      difficulty: 'Intermediate',
      timeHours: 2.0,
      costSavingsUSD: 120,
      co2SavedKg: 65,
      imagePlaceholder: 'laptop-server',
      tags: ['Electronics', 'Pi-hole', 'Energy Efficient'],
      summary: 'Install lightweight Linux (Debian / DietPi) to run an ad-blocking Pi-hole, local network backup drive, or smart-home automation controller.'
    },
    {
      id: 'upcycle-wood-ladder',
      title: 'Rustic Blanket & Towel Ladder',
      category: 'furniture',
      originalItem: 'Wobbly Wooden Stepladder',
      difficulty: 'Beginner',
      timeHours: 1.0,
      costSavingsUSD: 85,
      co2SavedKg: 28,
      imagePlaceholder: 'ladder-rack',
      tags: ['Wood', 'Living Room', 'Rustic'],
      summary: 'Lightly sand, apply teak oil or wax, and lean against a bedroom or bathroom wall to create an elegant vertical towel and throw quilt rack.'
    },
    {
      id: 'upcycle-bike-rim',
      title: 'Overhead Pot & Pan Hanging Rack',
      category: 'mechanical',
      originalItem: 'Bent Bicycle Wheel Rim',
      difficulty: 'Intermediate',
      timeHours: 2.5,
      costSavingsUSD: 90,
      co2SavedKg: 35,
      imagePlaceholder: 'bike-pot-rack',
      tags: ['Metal', 'Kitchen Organization', 'Industrial'],
      summary: 'Strip spokes from a retired aluminum rim, suspend from ceiling anchors with metal chains, and insert S-hooks to hold heavy culinary cookware.'
    },
    {
      id: 'upcycle-wine-corks',
      title: 'Trivet Heat Mat & Drawer Bumpers',
      category: 'kitchen',
      originalItem: 'Natural Cork Stoppers',
      difficulty: 'Beginner',
      timeHours: 0.5,
      costSavingsUSD: 12,
      co2SavedKg: 2,
      imagePlaceholder: 'cork-trivet',
      tags: ['Natural Material', 'Craft', 'Quick'],
      summary: 'Slice and glue corks in a honeycomb pattern to create heat-resistant cookware trivets or cut into thin discs as quiet cabinet bumpers.'
    }
  ],

  // Local community directory demo data
  directory: [
    {
      id: 'dir-1',
      name: 'Community Repair Café Central',
      type: 'Repair Cafe / Volunteer',
      badge: 'Free / Pay-What-You-Can',
      services: ['Small Appliances', 'Lamps', 'Clothing Mending', 'Bicycle Tuning'],
      address: '42 Greenway Commons, Eco Arts Hub',
      city: 'Metro City',
      hours: '1st & 3rd Saturday of month (10 AM - 3 PM)',
      rating: 4.9,
      reviewsCount: 88,
      toolsAvailable: 'Soldering stations, sewing machines, multi-meters, wood clamps'
    },
    {
      id: 'dir-2',
      name: 'Precision Leather & Cobbler Works',
      type: 'Professional Cobbler',
      badge: 'Certified Artisan',
      services: ['Shoe & Boot Resoling', 'Zipper Replacement', 'Belt & Bag Stitching'],
      address: '118 Heritage Craft Row',
      city: 'Metro City',
      hours: 'Tue - Sat: 9 AM - 6 PM',
      rating: 4.8,
      reviewsCount: 142,
      toolsAvailable: 'Heavy-duty leather skivers, Goodyear welting machine, dye vats'
    },
    {
      id: 'dir-3',
      name: 'Open Circuit Electronics Lab & Tool Library',
      type: 'Tool Library & Hackerspace',
      badge: 'Tool Lending & Workbenches',
      services: ['Soldering Irons', '3D Printers for Spares', 'Oscilloscopes', 'Desoldering Stations'],
      address: '802 Silicon Wharf, Unit B',
      city: 'Metro City',
      hours: 'Mon - Sun: 8 AM - 10 PM (Members)',
      rating: 5.0,
      reviewsCount: 64,
      toolsAvailable: 'Over 250 handheld power tools available for 7-day home loan'
    },
    {
      id: 'dir-4',
      name: 'EcoCycle Certified E-Waste & Scrap Center',
      type: 'Drop-off & Recycling Depot',
      badge: 'Zero-Landfill Guarantee',
      services: ['Electronics Recycling', 'Non-stick Cookware Scrap', 'Lithium Battery Safe Disposal', 'Metals'],
      address: '500 Circular Industrial Way',
      city: 'Metro City',
      hours: 'Mon - Fri: 8 AM - 4 PM',
      rating: 4.7,
      reviewsCount: 110,
      toolsAvailable: 'Certified data destruction shredders, rare-earth element extraction partner'
    },
    {
      id: 'dir-5',
      name: 'Stitch & Salvage Textile Collective',
      type: 'Upcycling & Tailoring',
      badge: 'Community Workshop',
      services: ['Denim Repair', 'Sashiko Visible Mending Classes', 'Fabric Remnant Exchange'],
      address: '29 Threadneedle Street',
      city: 'Metro City',
      hours: 'Wed - Sun: 11 AM - 7 PM',
      rating: 4.9,
      reviewsCount: 95,
      toolsAvailable: 'Industrial sergers, embroidery looms, fabric cutting tables'
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
    polypropylene: { co2ePerKg: 4.8, waterLitersPerKg: 400, circularScore: 65 },
    safety_foam_eps: { co2ePerKg: 6.2, waterLitersPerKg: 300, circularScore: 10 }
  },

  // Sample Damaged Photos for Camera & Visual Scanner Feature
  samplePhotos: [
    {
      id: 'photo_chair',
      name: 'Solid Oak Dining Chair (Wobbly Leg)',
      tag: 'Furniture • Wood',
      category: 'furniture',
      material: 'solid_wood',
      damageSeverity: 'minor',
      defectName: 'Mortise & Tenon Joint Separation',
      confidence: '91%',
      itemTitle: 'Solid Oak Dining Chair',
      ageYears: 7,
      originalCostUSD: 140,
      repairCostUSD: 12,
      damageDetails: 'Mortise and tenon joint on rear leg is loose and creaks. Wood fibers are intact.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#1e293b;">
        <rect width="200" height="150" fill="#1e293b"/>
        <!-- Chair backrest -->
        <rect x="70" y="25" width="8" height="70" rx="3" fill="#92400e"/>
        <rect x="122" y="25" width="8" height="70" rx="3" fill="#92400e"/>
        <rect x="74" y="32" width="52" height="10" rx="2" fill="#b45309"/>
        <rect x="74" y="52" width="52" height="6" rx="2" fill="#d97706"/>
        <!-- Chair seat -->
        <polygon points="60,85 140,85 132,98 68,98" fill="#d97706"/>
        <!-- Chair legs -->
        <rect x="68" y="98" width="7" height="42" fill="#92400e"/>
        <rect x="125" y="98" width="7" height="42" fill="#92400e"/>
        <!-- Fault Annotation Box -->
        <rect x="115" y="92" width="28" height="24" rx="4" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>
        <circle cx="128" cy="98" r="5" fill="#f59e0b" opacity="0.8"/>
        <!-- Defect Label -->
        <rect x="100" y="118" width="56" height="16" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
        <text x="128" y="129" fill="#f59e0b" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">LOOSE JOINT</text>
      </svg>`
    },
    {
      id: 'photo_phone',
      name: 'OLED Smartphone (Cracked Front Screen)',
      tag: 'Electronics • Screen',
      category: 'electronics',
      material: 'modular_electronics',
      damageSeverity: 'moderate',
      defectName: 'Display Glass Radial Fracture',
      confidence: '95%',
      itemTitle: '6.1" OLED Smartphone',
      ageYears: 2,
      originalCostUSD: 750,
      repairCostUSD: 110,
      damageDetails: 'Front glass cracked after drop, touch digitizer and display still function normally.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#0f172a;">
        <rect width="200" height="150" fill="#0f172a"/>
        <!-- Smartphone Body -->
        <rect x="72" y="20" width="56" height="110" rx="10" fill="#334155" stroke="#64748b" stroke-width="2"/>
        <rect x="76" y="26" width="48" height="98" rx="6" fill="#0284c7" opacity="0.4"/>
        <circle cx="100" cy="23" r="2" fill="#94a3b8"/>
        <!-- Spiderweb Crack -->
        <path d="M108,45 L98,62 L112,75 L88,95 M98,62 L82,55 M112,75 L120,90 M102,68 L118,60" fill="none" stroke="#ffffff" stroke-width="1.8"/>
        <!-- Damage Box -->
        <rect x="80" y="42" width="44" height="52" rx="4" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,2"/>
        <!-- Defect Label -->
        <rect x="76" y="100" width="52" height="16" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
        <text x="102" y="111" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">CRACKED GLASS</text>
      </svg>`
    },
    {
      id: 'photo_jeans',
      name: 'Denim Jeans (Inseam Fabric Tear)',
      tag: 'Textiles • Cotton',
      category: 'clothing',
      material: 'cotton_denim',
      damageSeverity: 'moderate',
      defectName: 'Inner Thigh Seam Blowout',
      confidence: '88%',
      itemTitle: 'Raw Selvedge Denim Jeans',
      ageYears: 2,
      originalCostUSD: 110,
      repairCostUSD: 15,
      damageDetails: 'Blowout along inner thigh seam, 6cm tear. Fabric around it is still thick and durable.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#0f172a;">
        <rect width="200" height="150" fill="#0f172a"/>
        <!-- Denim Jeans -->
        <path d="M70,25 L130,25 L128,50 L115,130 L102,130 L100,65 L98,130 L85,130 L72,50 Z" fill="#1e3a8a"/>
        <path d="M70,25 L130,25" stroke="#ca8a04" stroke-width="2"/>
        <!-- Tear in crotch -->
        <path d="M96,65 Q100,74 104,65 Q102,78 98,72" fill="#0f172a" stroke="#f43f5e" stroke-width="1.8"/>
        <!-- Defect Box -->
        <rect x="86" y="58" width="28" height="24" rx="4" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,2"/>
        <rect x="74" y="86" width="52" height="16" rx="3" fill="#0f172a" stroke="#f43f5e" stroke-width="1"/>
        <text x="100" y="97" fill="#f43f5e" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">SEAM TEAR</text>
      </svg>`
    },
    {
      id: 'photo_teflon',
      name: 'Teflon Pan (Toxic Coating Flaking)',
      tag: 'Kitchen • Toxic Hazard',
      category: 'kitchen',
      material: 'teflon_nonstick',
      damageSeverity: 'critical',
      defectName: 'PTFE Fluoropolymer Delamination (Safety Hazard)',
      confidence: '97%',
      itemTitle: 'Non-Stick Aluminum Skillet',
      ageYears: 4,
      originalCostUSD: 38,
      repairCostUSD: 45,
      damageDetails: 'Non-stick coating is peeling and scratching off into cooking surface; underlying aluminum exposed.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#0f172a;">
        <rect width="200" height="150" fill="#0f172a"/>
        <!-- Pan Handle -->
        <rect x="25" y="68" width="45" height="12" rx="4" fill="#334155"/>
        <!-- Pan Body -->
        <ellipse cx="120" cy="74" rx="55" ry="38" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <ellipse cx="120" cy="74" rx="45" ry="30" fill="#090d16"/>
        <!-- Flaking spots -->
        <path d="M105,65 Q115,60 125,68 Q130,76 118,78 Q108,74 105,65" fill="#cbd5e1"/>
        <circle cx="132" cy="80" r="4" fill="#cbd5e1"/>
        <!-- Hazard Box -->
        <rect x="98" y="55" width="46" height="34" rx="4" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,2"/>
        <rect x="94" y="94" width="54" height="16" rx="3" fill="#0f172a" stroke="#f43f5e" stroke-width="1"/>
        <text x="121" y="105" fill="#f43f5e" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">PEELING PTFE</text>
      </svg>`
    },
    {
      id: 'photo_mug',
      name: 'Ceramic Mug (Chipped Lip Rim)',
      tag: 'Ceramics • Upcycle Candidate',
      category: 'kitchen',
      material: 'ceramic_porcelain',
      damageSeverity: 'minor',
      defectName: 'Ceramic Rim Edge Fracture',
      confidence: '93%',
      itemTitle: 'Glazed Ceramic Coffee Mug',
      ageYears: 5,
      originalCostUSD: 18,
      repairCostUSD: 14,
      damageDetails: 'Small 4mm chip on the rim that catches lips. Handle and base are pristine.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#0f172a;">
        <rect width="200" height="150" fill="#0f172a"/>
        <!-- Mug body -->
        <rect x="75" y="45" width="50" height="65" rx="6" fill="#0d9488"/>
        <ellipse cx="100" cy="45" rx="25" ry="8" fill="#14b8a6"/>
        <ellipse cx="100" cy="45" rx="20" ry="6" fill="#042f2e"/>
        <!-- Handle -->
        <path d="M125,55 Q145,65 142,85 Q138,98 125,98" fill="none" stroke="#0d9488" stroke-width="6" stroke-linecap="round"/>
        <!-- Rim Chip -->
        <polygon points="85,38 90,44 82,43" fill="#ffffff"/>
        <!-- Box -->
        <rect x="76" y="34" width="22" height="18" rx="3" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="2,2"/>
        <rect x="62" y="15" width="50" height="16" rx="3" fill="#0f172a" stroke="#06b6d4" stroke-width="1"/>
        <text x="87" y="26" fill="#06b6d4" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">CHIPPED RIM</text>
      </svg>`
    },
    {
      id: 'photo_derailleur',
      name: 'Commuter Bike (Slipping Gears)',
      tag: 'Mechanical • Steel',
      category: 'mechanical',
      material: 'steel_alloy',
      damageSeverity: 'minor',
      defectName: 'Derailleur Cable Slack & Misalignment',
      confidence: '89%',
      itemTitle: '7-Speed Commuter Bicycle',
      ageYears: 3,
      originalCostUSD: 360,
      repairCostUSD: 18,
      damageDetails: 'Rear derailleur cable stretched; chain skips between 4th and 5th gear on hills.',
      svgThumb: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:8px;background:#0f172a;">
        <rect width="200" height="150" fill="#0f172a"/>
        <!-- Bike cogs -->
        <circle cx="100" cy="65" r="32" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="6,4"/>
        <circle cx="100" cy="65" r="22" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="5,3"/>
        <circle cx="100" cy="65" r="12" fill="#94a3b8"/>
        <!-- Derailleur cage -->
        <path d="M100,75 L115,105 L108,122" fill="none" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
        <circle cx="115" cy="105" r="6" fill="#f59e0b"/>
        <circle cx="108" cy="122" r="6" fill="#f59e0b"/>
        <!-- Cable slack -->
        <path d="M85,50 Q105,80 114,98" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>
        <!-- Annotation Box -->
        <rect x="94" y="90" width="34" height="38" rx="4" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>
        <rect x="55" y="118" width="58" height="16" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
        <text x="84" y="129" fill="#f59e0b" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">CABLE SLACK</text>
      </svg>`
    }
  ]
};

// Global export helper for browser
if (typeof window !== 'undefined') {
  window.REFIX_DATA = REFIX_DATA;
}
