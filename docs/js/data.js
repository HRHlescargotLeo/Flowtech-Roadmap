/* data.js — sample data for the Flowtech prototypes.
 *
 * PRODUCTS: names, codes, prices and national stock for the FT Pro, John Guest,
 * Aignep, Parker Legris and SMC items follow flowtech.co.uk as seen on 1 October 2026.
 * Tube, silencers, plugs, packs, lead times, branch stock and every quote, branch
 * address, course date and case study detail marked [sample] are illustrative.
 */
(function () {
  'use strict';

  var P = [
    /* code, name, brand, od, conn, shape, thread, price, stock, extra */
    ['2019-8396', 'FT Pro 4MM OD Equal Tee', 'FT Pro', 4, 'Tube to tube', 'Tee', '', 1.10, 1485],
    ['2019-8404', 'FT Pro 6MM OD Equal Tee', 'FT Pro', 6, 'Tube to tube', 'Tee', '', 1.15, 5895],
    ['2019-8412', 'FT Pro 8MM OD Equal Tee', 'FT Pro', 8, 'Tube to tube', 'Tee', '', 1.15, 38006],
    ['2019-8420', 'FT Pro 10MM OD Equal Tee', 'FT Pro', 10, 'Tube to tube', 'Tee', '', 1.44, 3165],
    ['2019-8438', 'FT Pro 12MM OD Equal Tee', 'FT Pro', 12, 'Tube to tube', 'Tee', '', 1.78, 5576],
    ['2019-8439', 'FT Pro 16MM OD Equal Tee', 'FT Pro', 16, 'Tube to tube', 'Tee', '', 3.37, 238],
    ['MPUT-8', 'FT Pro 8MM OD Equal Tee, Metal Body', 'FT Pro', 8, 'Tube to tube', 'Tee', '', 6.48, 708, { series: 'Metal push-in [sample]', material: 'Nickel plated brass [sample]', maxBar: 20 }],
    ['2019-8305', 'FT Pro 6MM OD Straight Connector', 'FT Pro', 6, 'Tube to tube', 'Straight', '', 0.86, 12821],
    ['2019-8313', 'FT Pro 8MM OD Straight Connector', 'FT Pro', 8, 'Tube to tube', 'Straight', '', 0.92, 7747],
    ['2019-8321', 'FT Pro 10MM OD Straight Connector', 'FT Pro', 10, 'Tube to tube', 'Straight', '', 1.11, 7016],
    ['2019-4965', 'FT Pro 6MM OD X 1/8" BSPT Male Stud', 'FT Pro', 6, 'Tube to thread', 'Straight', '1/8" BSPT', 0.97, 9318],
    ['2019-4973', 'FT Pro 6MM OD X 1/4" BSPT Male Stud', 'FT Pro', 6, 'Tube to thread', 'Straight', '1/4" BSPT', 0.95, 7304],
    ['2019-4999', 'FT Pro 8MM OD X 1/8" BSPT Male Stud', 'FT Pro', 8, 'Tube to thread', 'Straight', '1/8" BSPT', 1.01, 4400],
    ['2019-5004', 'FT Pro 8MM OD X 1/4" BSPT Male Stud', 'FT Pro', 8, 'Tube to thread', 'Straight', '1/4" BSPT', 0.97, 6966],
    ['2019-5046', 'FT Pro 10MM OD X 1/4" BSPT Male Stud', 'FT Pro', 10, 'Tube to thread', 'Straight', '1/4" BSPT', 1.49, 6348],
    ['2019-5145', 'FT Pro 6MM OD X 1/8" BSPT Male Stud Elbow', 'FT Pro', 6, 'Tube to thread', 'Elbow', '1/8" BSPT', 1.26, 6851],
    ['2019-5152', 'FT Pro 6MM OD X 1/4" BSPT Male Stud Elbow', 'FT Pro', 6, 'Tube to thread', 'Elbow', '1/4" BSPT', 1.22, 4246],
    ['2019-5186', 'FT Pro 8MM OD X 1/4" BSPT Male Stud Elbow', 'FT Pro', 8, 'Tube to thread', 'Elbow', '1/4" BSPT', 1.37, 4936],
    ['2111-3337', 'FT Pro 8MM X 1/8" NPT Male Branch Tee', 'FT Pro', 8, 'Tube to thread', 'Branch tee', '1/8" NPT', 6.03, 172, { offer: 0.47 }],
    ['2111-3352', 'FT Pro 8MM X 3/8" NPT Male Branch Tee', 'FT Pro', 8, 'Tube to thread', 'Branch tee', '3/8" NPT', 6.57, 164, { offer: 0.55 }],
    ['PM0206E', 'John Guest 06MM OD Equal Tee Connector', 'John Guest', 6, 'Tube to tube', 'Tee', '', 2.60, 420, { series: 'Speedfit [sample]' }],
    ['PM0208E', 'John Guest 08MM OD Equal Tee Connector', 'John Guest', 8, 'Tube to tube', 'Tee', '', 2.77, 380, { series: 'Speedfit [sample]' }],
    ['PM0210E', 'John Guest 10MM OD Equal Tee Connector', 'John Guest', 10, 'Tube to tube', 'Tee', '', 3.36, 0, { lead: 4, series: 'Speedfit [sample]' }],
    ['P16-6', 'Aignep 06MM OD Equal Tee Push-in', 'Aignep', 6, 'Tube to tube', 'Tee', '', 5.32, 96],
    ['P8-6-1/4', 'Aignep 06MM OD X 1/4" BSPP Male SW Elbow', 'Aignep', 6, 'Tube to thread', 'Elbow', '1/4" BSPP', 3.84, 519],
    ['LE-3108 08 10', 'Parker Legris 8MM X 1/8" Male Stud Branch Tee', 'Parker Legris', 8, 'Tube to thread', 'Branch tee', '1/8" BSPT', 10.03, 1197, { offer: 3.31 }],
    ['KQ2T04-00A', 'SMC 4MM OD Union Tee', 'SMC', 4, 'Tube to tube', 'Tee', '', 3.28, 64],
    ['KQ2T08-00A', 'SMC 8MM OD Union Tee', 'SMC', 8, 'Tube to tube', 'Tee', '', 5.21, 0, { lead: 5 }],
    ['FT-PU06-30B', 'FT Pro 6MM OD Polyurethane Tube, Blue, 30M Reel', 'FT Pro', 6, 'Tube', 'Tube', '', 21.40, 310, { cat: 'tube', pack: '30m reel', unit: 'per metre' }],
    ['FT-PU08-30B', 'FT Pro 8MM OD Polyurethane Tube, Blue, 30M Reel', 'FT Pro', 8, 'Tube', 'Tube', '', 28.90, 245, { cat: 'tube', pack: '30m reel', unit: 'per metre' }],
    ['FT-PU10-30B', 'FT Pro 10MM OD Polyurethane Tube, Blue, 30M Reel', 'FT Pro', 10, 'Tube', 'Tube', '', 39.50, 0, { cat: 'tube', pack: '30m reel', unit: 'per metre', lead: 3 }],
    ['FT-TC-14', 'FT Pro Tube Cutter, up to 14MM OD', 'FT Pro', 0, 'Tool', 'Tool', '', 7.85, 132, { cat: 'tool' }],
    ['FT-BP08-10', 'FT Pro 8MM Blanking Plug, Pack of 10', 'FT Pro', 8, 'Tube', 'Plug', '', 3.20, 540, { cat: 'accessory', pack: 'pack of 10', unit: 'each' }],
    ['FT-RC08-10', 'FT Pro 8MM Release Collar Clip, Pack of 10', 'FT Pro', 8, 'Tube', 'Clip', '', 2.10, 610, { cat: 'accessory', pack: 'pack of 10', unit: 'each' }]
  ];

  var PRODUCTS = P.map(function (r) {
    var x = r[9] || {};
    var o = {
      code: r[0], name: r[1], brand: r[2], od: r[3], conn: r[4], shape: r[5], thread: r[6],
      threadType: r[6] ? r[6].split(' ').pop() : '', price: r[7], stock: r[8],
      offer: x.offer || null, lead: x.lead || 0, cat: x.cat || 'fitting',
      series: x.series || (r[2] === 'FT Pro' ? 'One Touch' : ''),
      material: x.material || (r[2] === 'FT Pro' ? 'Plastic / nickel plated brass' : 'Plastic / brass [sample]'),
      maxBar: x.maxBar || 10, temp: '0°C to +60°C', pack: x.pack || '', unit: x.unit || '',
      techSheet: r[2] === 'FT Pro' ? '1964' : (r[2] === 'Aignep' ? '30106' : (r[2] === 'Parker Legris' ? '10626' : ''))
    };
    if (o.cat === 'tube') { o.material = 'Polyurethane'; o.series = ''; }
    return o;
  });

  /* Equivalents for other makers' codes [sample mapping — needs Flowtech's cross-reference data] */
  var CROSSREF = {
    'KQ2T08-00A': { maker: 'SMC', desc: '8mm union tee', match: { od: 8, shape: 'Tee', conn: 'Tube to tube' } },
    'QST-8': { maker: 'Festo', desc: '8mm push-in T-connector', match: { od: 8, shape: 'Tee', conn: 'Tube to tube' } },
    'QST-6': { maker: 'Festo', desc: '6mm push-in T-connector', match: { od: 6, shape: 'Tee', conn: 'Tube to tube' } },
    '3104 08 00': { maker: 'Parker Legris', desc: '8mm equal union tee', match: { od: 8, shape: 'Tee', conn: 'Tube to tube' } },
    'PM0408E': { maker: 'John Guest', desc: '1/4" equal tee (imperial)', match: null }
  };

  /* Branches. Towns and group brands follow the Contact and Locations pages.
     County Durham's address, phone and email are from the live site; all other
     contact details, capabilities and hours are [sample]. */
  var CAPS = {
    hose: 'Hose assembly', repair: 'Repair & overhaul', test: 'Pressure testing', collect: 'Click & collect',
    train: 'Training', cyl: 'Cylinder manufacture', comp: 'Compressed air', tube: 'Tube manipulation'
  };
  var B = [
    ['county-durham', 'County Durham', 'Flowtech', 'UK', 54.70, -1.60, ['hose', 'repair', 'test', 'collect'], 'Unit 43 Enterprise City, Spennymoor, County Durham, DL16 6JF', '01388 813433', 'salescountydurham@flowtech.co.uk'],
    ['exeter', 'Exeter', 'Flowtech', 'UK', 50.72, -3.53, ['hose', 'collect']],
    ['gloucester', 'Gloucester', 'Flowtech', 'UK', 51.86, -2.24, ['hose', 'repair', 'test', 'collect', 'train', 'cyl']],
    ['leicester', 'Leicester', 'Flowtech', 'UK', 52.64, -1.13, ['hose', 'repair', 'collect']],
    ['liverpool', 'Liverpool', 'Flowtech', 'UK', 53.41, -2.98, ['hose', 'test', 'collect']],
    ['ludlow', 'Ludlow', 'Flowtech', 'UK', 52.37, -2.72, ['hose', 'repair', 'collect', 'tube']],
    ['skelmersdale', 'Skelmersdale', 'Flowtech', 'UK', 53.55, -2.78, ['collect']],
    ['south-wales', 'South Wales', 'Flowtech', 'UK', 51.62, -3.40, ['hose', 'repair', 'collect']],
    ['west-midlands', 'West Midlands', 'Flowtech', 'UK', 52.50, -1.95, ['hose', 'test', 'collect']],
    ['leeds', 'Leeds', 'Flowtech', 'UK', 53.80, -1.55, ['hose', 'repair', 'test', 'collect']],
    ['pontefract', 'Pontefract', 'Flowtech', 'UK', 53.69, -1.31, ['repair', 'test', 'tube']],
    ['bradford-thorite', 'Bradford', 'Thorite', 'UK', 53.80, -1.75, ['comp', 'collect', 'train']],
    ['leeds-thorite', 'Leeds', 'Thorite', 'UK', 53.78, -1.52, ['comp', 'collect']],
    ['bolton-thorite', 'Bolton', 'Thorite', 'UK', 53.58, -2.43, ['comp', 'collect']],
    ['sheffield-thorite', 'Sheffield', 'Thorite', 'UK', 53.38, -1.47, ['comp', 'collect', 'repair']],
    ['north-shields-thorite', 'North Shields', 'Thorite', 'UK', 55.01, -1.45, ['comp', 'collect']],
    ['bristol-thorite', 'Bristol', 'Thorite', 'UK', 51.45, -2.59, ['comp', 'collect']],
    ['west-bromwich-allswage', 'West Bromwich', 'Allswage', 'UK', 52.52, -1.99, ['hose', 'collect']],
    ['ashford-thomas', 'Ashford', 'Thomas Group', 'UK', 51.15, 0.87, ['hose', 'repair', 'collect']],
    ['belfast', 'Belfast', 'Flowtech', 'Ireland', 54.60, -5.93, ['hose', 'repair', 'collect']],
    ['dungannon', 'Dungannon', 'Flowtech', 'Ireland', 54.50, -6.77, ['hose', 'repair']],
    ['dublin', 'Dublin', 'Flowtech', 'Ireland', 53.35, -6.26, ['hose', 'collect']],
    ['cork', 'Cork', 'Flowtech', 'Ireland', 51.90, -8.47, ['hose', 'repair', 'collect']],
    ['deventer', 'Deventer', 'Flowtech', 'Benelux', 52.25, 6.16, ['hose', 'repair', 'collect']],
    ['rotterdam', 'Rotterdam', 'Flowtech', 'Benelux', 51.92, 4.48, ['hose', 'collect']],
    ['brussels', 'Brussels', 'Flowtech', 'Benelux', 50.85, 4.35, ['hose', 'collect']]
  ];
  var BRANCHES = B.map(function (r) {
    return {
      id: r[0], town: r[1], brand: r[2], region: r[3], lat: r[4], lng: r[5], caps: r[6],
      address: r[7] || '[Address to be supplied]', phone: r[8] || '[Phone to be supplied]', email: r[9] || '[Email to be supplied]',
      real: !!r[7]
    };
  });

  /* Rough centroids for UK postcode areas, enough to sort branches by distance in a prototype. */
  var POSTCODES = {
    AB: [57.15, -2.10], B: [52.48, -1.90], BA: [51.38, -2.36], BB: [53.75, -2.48], BD: [53.80, -1.76], BH: [50.72, -1.88], BL: [53.58, -2.43], BN: [50.83, -0.14], BR: [51.40, 0.02], BS: [51.45, -2.59], BT: [54.60, -5.93],
    CA: [54.89, -2.93], CB: [52.20, 0.12], CF: [51.48, -3.18], CH: [53.19, -2.89], CM: [51.73, 0.47], CO: [51.89, 0.90], CR: [51.37, -0.10], CT: [51.28, 1.08], CV: [52.41, -1.51], CW: [53.10, -2.44],
    DA: [51.44, 0.21], DD: [56.46, -2.97], DE: [52.92, -1.48], DH: [54.78, -1.57], DL: [54.52, -1.55], DN: [53.52, -1.13], DT: [50.71, -2.44], DY: [52.51, -2.08], E: [51.53, -0.03], EC: [51.52, -0.09], EH: [55.95, -3.19], EN: [51.65, -0.08], EX: [50.72, -3.53],
    FK: [56.00, -3.78], FY: [53.82, -3.05], G: [55.86, -4.25], GL: [51.86, -2.24], GU: [51.24, -0.76], HA: [51.58, -0.34], HD: [53.65, -1.78], HG: [53.99, -1.54], HP: [51.75, -0.74], HR: [52.06, -2.72], HS: [57.76, -7.02], HU: [53.74, -0.33], HX: [53.72, -1.86],
    IG: [51.56, 0.08], IM: [54.15, -4.48], IP: [52.06, 1.15], IV: [57.48, -4.22], KA: [55.61, -4.50], KT: [51.40, -0.30], KW: [58.98, -2.96], KY: [56.11, -3.16], L: [53.41, -2.98], LA: [54.05, -2.80], LD: [52.24, -3.38], LE: [52.64, -1.13], LL: [53.12, -3.80], LN: [53.23, -0.54], LS: [53.80, -1.55], LU: [51.88, -0.42],
    M: [53.48, -2.24], ME: [51.27, 0.52], MK: [52.04, -0.76], ML: [55.78, -3.98], N: [51.57, -0.11], NE: [54.97, -1.61], NG: [52.95, -1.15], NN: [52.24, -0.90], NP: [51.59, -3.00], NR: [52.63, 1.30], NW: [51.55, -0.18], OL: [53.54, -2.12], OX: [51.75, -1.26],
    PA: [55.85, -4.43], PE: [52.57, -0.24], PH: [56.40, -3.43], PL: [50.38, -4.14], PO: [50.80, -1.09], PR: [53.76, -2.70], RG: [51.45, -0.97], RH: [51.12, -0.18], RM: [51.56, 0.18], S: [53.38, -1.47], SA: [51.62, -3.94], SE: [51.48, -0.06], SG: [51.90, -0.20], SK: [53.41, -2.15], SL: [51.51, -0.59], SM: [51.36, -0.19], SN: [51.56, -1.78], SO: [50.90, -1.40], SP: [51.07, -1.79], SR: [54.91, -1.38], SS: [51.54, 0.71], ST: [53.00, -2.18], SW: [51.46, -0.17], SY: [52.71, -2.75],
    TA: [51.02, -3.10], TD: [55.60, -2.43], TF: [52.68, -2.45], TN: [51.13, 0.26], TQ: [50.46, -3.53], TR: [50.26, -5.05], TS: [54.57, -1.23], TW: [51.45, -0.34], UB: [51.53, -0.45], W: [51.51, -0.20], WA: [53.39, -2.59], WC: [51.52, -0.12], WD: [51.66, -0.40], WF: [53.68, -1.50], WN: [53.55, -2.63], WR: [52.19, -2.22], WS: [52.58, -1.98], WV: [52.59, -2.13], YO: [53.96, -1.08], ZE: [60.15, -1.15]
  };
  /* Areas excluded from next-day delivery (Hours & Delivery page). */
  var NO_NEXT_DAY = ['AB', 'HS', 'IM', 'IV', 'KW', 'ZE', 'TR', 'PH', 'GY', 'JE'];

  var QUOTES = [
    { ref: 'Q-48213', date: '24 Sep 2026', valid: '24 Oct 2026', status: 'Ready', lines: [['2019-8412', 200], ['FT-PU08-30B', 6], ['2019-5004', 150]] },
    { ref: 'Q-48177', date: '19 Sep 2026', valid: '19 Oct 2026', status: 'In progress', lines: [['KQ2T08-00A', 40], ['PM0208E', 40]] },
    { ref: 'Q-47902', date: '2 Sep 2026', valid: '2 Oct 2026', status: 'Ready', lines: [['LE-3108 08 10', 25], ['2019-8438', 60]] },
    { ref: 'Q-47511', date: '11 Aug 2026', valid: '11 Sep 2026', status: 'Expired', lines: [['2019-8321', 300]] },
    { ref: 'Q-46980', date: '22 Jul 2026', valid: '22 Aug 2026', status: 'Ordered', lines: [['2019-8305', 500], ['FT-PU06-30B', 10]] }
  ];

  window.FT = {
    PRODUCTS: PRODUCTS, CROSSREF: CROSSREF, BRANCHES: BRANCHES, CAPS: CAPS,
    POSTCODES: POSTCODES, NO_NEXT_DAY: NO_NEXT_DAY, QUOTES: QUOTES,
    money: function (n) { return '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  };
})();

/* Engineering services, sectors and case studies.
   Service names, capabilities and project names follow flowtech.co.uk; anything in
   [brackets] or marked [sample] is a placeholder for Flowtech to supply. */
(function () {
  'use strict';
  var FT = window.FT || (window.FT = {});

  FT.SERVICES = [
    { id: 'bespoke', name: 'Bespoke product manufacture', caps: ['hose', 'tube', 'test'],
      summary: 'Hose assemblies, tube manipulation, pipe threading, pressure testing and valve assemblies, made to your drawing or sample in our Engineering Solution Centres.',
      includes: ['Hydraulic and industrial hose assemblies, made while you wait or to schedule', 'Tube bending and manipulation from drawing or sample', 'Pipe threading and cutting', 'Valve and manifold assemblies', 'Pressure testing with a test certificate'],
      turnaround: 'Hose assemblies same day; tube and valve assemblies from 3 working days [sample]', caseId: 'halley-vi', tool: { href: 'hose-builder.html', label: 'Build a hose assembly online' } },
    { id: 'hydraulic-systems', name: 'Hydraulic systems design & build', caps: ['repair', 'test', 'cyl'],
      summary: 'Power units, cylinders, manifolds and complete hydraulic systems, designed, built, installed and commissioned by our engineers.',
      includes: ['Design and specification', 'Power unit and manifold build', 'Hydraulic cylinder manufacture', 'Installation and commissioning', 'Testing and certification'],
      turnaround: 'Quoted per project [sample]', caseId: 'halley-vi' },
    { id: 'pneumatic-systems', name: 'Pneumatic systems design & build', caps: ['comp', 'test'],
      summary: 'Valve islands, control panels and pneumatic circuits for machine builders and plant engineers.',
      includes: ['Circuit design', 'Valve island and panel build', 'Air preparation', 'Installation and commissioning'],
      turnaround: 'Panels from 10 working days [sample]', caseId: '' },
    { id: 'compressed-air', name: 'Compressed air systems design & build', caps: ['comp'],
      summary: 'Compressors, ring mains and air treatment, sized for your demand and installed by our team.',
      includes: ['Air demand survey', 'Compressor and dryer selection', 'Ring main design and installation', 'Leak surveys [sample]'],
      turnaround: 'Survey within 5 working days [sample]', caseId: '' },
    { id: 'process-control', name: 'Process control & instrumentation design & build', caps: ['test'],
      summary: 'Instrumentation, valve automation and control for process plant, water and utilities.',
      includes: ['Valve actuation and automation', 'Instrumentation and monitoring', 'PLC control', 'Testing'],
      turnaround: 'Quoted per project [sample]', caseId: '' },
    { id: 'service-maintenance', name: 'Service & maintenance', caps: ['hose', 'repair'],
      summary: 'Planned maintenance, breakdown cover and on-site hose replacement, with an out-of-hours service when a line goes down.',
      includes: ['Planned preventive maintenance', 'Breakdown and emergency call-out', 'On-site hose replacement', 'Oil sampling and condition monitoring [sample]', 'Out-of-hours service (£75 call-out charge)'],
      turnaround: 'Emergency call-outs: engineer on site within [x] hours [to confirm]', caseId: 'tower-bridge', tool: { href: 'book-a-visit.html', label: 'Book a service visit' } },
    { id: 'repair-overhaul', name: 'Repair & overhaul', caps: ['repair', 'cyl', 'test'],
      summary: 'Strip, inspect, repair and test hydraulic cylinders, pumps, motors and valves, with a report and a fixed quote before work starts.',
      includes: ['Collection from site [sample]', 'Strip-down and inspection report', 'Fixed-price quote before work starts', 'Repair, re-chroming and re-sealing', 'Test and certificate'],
      turnaround: 'Inspection report within 2 working days [sample]', caseId: 'rice-bridge', tool: { href: 'book-a-visit.html?type=repair', label: 'Book a repair' } }
  ];

  FT.SECTORS = {
    'data-centres': { name: 'Data centres', target: true,
      intro: 'Cooling, power and fire suppression in data centres depend on pipework, valves, pumps and controls that cannot fail. Flowtech supplies the components and builds the assemblies, from design through to on-site support.',
      needs: ['Valves and actuation for chilled-water and cooling loops', 'Pipework, hose and fittings to specification, with traceability', 'Pressure testing and certification before handover', 'Fast replacement parts from local stock'],
      services: ['bespoke', 'process-control', 'service-maintenance'], cats: ['Valves & Actuation', 'Monitor & Test', 'Stainless Steel', 'Hose, Couplings, Ducting & Hose Reels'],
      news: { title: 'Flowtech exhibits at Data Centre World London 2026', text: 'Our team spoke to engineers, designers and major clients involved with building data centres.' },
      cases: ['dc-placeholder'] },
    'bridges-waterways': { name: 'Bridges, waterways & flood defence', target: true,
      intro: 'Moving bridges, lock gates and flood barriers run on hydraulics. Flowtech has worked on Tower Bridge in London and holds contracts on Narrow Water Bridge and Rice Bridge in Ireland.',
      needs: ['Hydraulic systems for bascule and swing bridges', 'Cylinders designed and built for the structure', 'Remediation and upgrade of existing systems', 'Long-term service and maintenance contracts'],
      services: ['hydraulic-systems', 'repair-overhaul', 'service-maintenance'], cats: ['Hydraulics', 'Valves & Actuation', 'Monitor & Test'],
      news: { title: 'Flowtech awarded prestigious Narrow Water Bridge contract', text: 'A 195-metre cable-stayed bascule bridge that will link County Down and County Louth.' },
      cases: ['tower-bridge', 'narrow-water-bridge', 'rice-bridge'] },
    'defence': { name: 'Defence', target: true,
      intro: '[Defence intro to be supplied by Flowtech: capabilities, accreditations and the kind of work the group can talk about publicly.]',
      needs: ['[Need 1]', '[Need 2]', '[Need 3]'], services: ['hydraulic-systems', 'bespoke'], cats: ['Hydraulics', 'Pneumatics & Vacuum'], news: null, cases: [] }
  };
  ['Food & Beverage', 'Agriculture', 'Transport', 'Utility', 'Aerospace', 'Off Highway', 'Metals & Heavy Engineering'].forEach(function (n) {
    var id = n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z]+/g, '-');
    FT.SECTORS[id] = { name: n, target: false, intro: '[' + n + ' intro to be supplied: the problems Flowtech solves in this sector, with one named example.]', needs: ['[Need 1]', '[Need 2]', '[Need 3]'], services: ['bespoke', 'service-maintenance'], cats: ['Hydraulics', 'Pneumatics & Vacuum'], news: null, cases: [] };
  });

  FT.CASES = [
    { id: 'halley-vi', title: 'Halley VI research station', place: 'Floating ice shelf, Antarctic', region: 'Worldwide', sector: 'Research', service: 'hydraulic-systems',
      summary: 'Hydraulic legs that let a research station be raised above the snow and moved.',
      challenge: 'Earlier Halley stations were lost to the ice. The new station needed to be relocatable and to stay above the annual snowfall.',
      solution: 'Eight modules, each the size of a terraced house and weighing 150 to 220 tonnes, stand on legs with built-in hydraulic cylinders. The legs are raised in turn so snow can be built up beneath each ski foot, then extended together to lift the module.',
      result: 'The station can be raised every year and towed to a new site. [Add figures: years in service, lifts carried out.]', real: true },
    { id: 'tower-bridge', title: 'Tower Bridge', place: 'London', region: 'UK', sector: 'Bridges, waterways & flood defence', service: 'service-maintenance',
      summary: 'Helping to maintain one of the world\'s best-known moving bridges.',
      challenge: '[To be supplied: what Flowtech was asked to do, and when.]', solution: '[To be supplied.]', result: '[To be supplied, with a figure if possible.]', real: true },
    { id: 'narrow-water-bridge', title: 'Narrow Water Bridge', place: 'County Down and County Louth', region: 'Ireland', sector: 'Bridges, waterways & flood defence', service: 'hydraulic-systems',
      summary: 'A 195-metre cable-stayed bascule bridge linking Northern Ireland and the Republic. Contract awarded.',
      challenge: '[To be supplied once the project can be described.]', solution: '[To be supplied.]', result: '[Project in progress.]', real: true },
    { id: 'rice-bridge', title: 'Rice Bridge remediation', place: 'Waterford', region: 'Ireland', sector: 'Bridges, waterways & flood defence', service: 'repair-overhaul',
      summary: 'Remediation works on Rice Bridge for Waterford City Council.',
      challenge: '[To be supplied.]', solution: '[To be supplied.]', result: '[To be supplied.]', real: true },
    { id: 'dc-placeholder', title: '[Data centre cooling project]', place: '[Location]', region: 'UK', sector: 'Data centres', service: 'bespoke',
      summary: '[Placeholder for a data centre case study. Flowtech to supply a project it can name.]',
      challenge: '[Challenge]', solution: '[Solution]', result: '[Result]', real: false }
  ];

  FT.HOSE = {
    types: [['1SN', 'EN 853 1SN, one-wire braid', 1.0], ['2SN', 'EN 853 2SN, two-wire braid', 1.35], ['4SP', 'EN 856 4SP, four-spiral', 2.1], ['THERMO', 'Thermoplastic, non-conductive', 1.6]],
    bores: [['1/4', 6.3, 4.10], ['3/8', 10, 5.20], ['1/2', 12.5, 6.60], ['3/4', 19, 9.40], ['1', 25, 13.10]],
    pressure: { '1SN': [225, 180, 160, 105, 88], '2SN': [400, 330, 275, 215, 165], '4SP': [450, 445, 415, 350, 280], 'THERMO': [210, 175, 160, 120, 100] },
    ends: [['BSPF-S', 'BSP female swivel, straight', 6.20], ['BSPF-90', 'BSP female swivel, 90°', 8.40], ['BSPM', 'BSP male, straight', 5.10], ['JICF-S', 'JIC female swivel, straight', 6.80], ['ORFS-S', 'ORFS female, straight', 9.30], ['NONE', 'Plain end (no fitting)', 0]]
  };
})();
