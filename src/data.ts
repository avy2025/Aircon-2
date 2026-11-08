export type Division = {
  slug: string
  title: string
  short: string
  description: string
  offerings: string[]
  index: string
}

export const divisions: Division[] = [
  {
    slug: 'railway',
    title: 'Railway systems',
    short: 'Railway Business',
    description:
      'Equipment and engineered systems for railway applications, from coach components to pneumatic and door solutions.',
    offerings: [
      'Wheel Set Earthing Equipment',
      'Electro-Pneumatic Pressurised Systems',
      'Vacuum Toilet Systems',
      'Railway Dampers',
      'Rail Coach Components',
      'Railway Door Systems',
      'SS Compactor Dustbins',
      'Railway torque machines',
      'Air mist systems',
    ],
    index: '01',
  },
  {
    slug: 'automation',
    title: 'Manufacturing & automation',
    short: 'Manufacturing & Automation',
    description:
      'Custom manufacturing systems, fixtures and automation equipment designed around production requirements.',
    offerings: [
      'Robotic Welding Cells',
      'MIG and Spot Welding Fixtures',
      'Assembly Line Automation',
      'Special Purpose Machines',
      'Leak Testing and Marking Machines',
      'Hydro-Pneumatic Presses',
      'Servo Presses',
      'Conveyor Systems',
      'Robot and Gantry Pick-and-Place Systems',
      'Torque Tools',
    ],
    index: '02',
  },
  {
    slug: 'distribution',
    title: 'Sales & distribution',
    short: 'Sales & Distribution',
    description:
      'Industrial products across hydraulic, pneumatic and fluid power applications, selected to suit your requirements.',
    offerings: [
      'Parker product ranges',
      'Hirotaka products',
      'Blago products',
      'Hydraulic and Pneumatic Products',
      'Filtration',
      'Instrumentation',
      'Fluid Connectors',
      'Engineered Materials',
      'Seals',
      'Hose Assemblies',
    ],
    index: '03',
  },
  {
    slug: 'hose-assembly',
    title: 'Hose assembly',
    short: 'Hose Assembly',
    description:
      'Hose assembly capabilities for industrial fluid power applications, supported by in-house preparation and testing.',
    offerings: [
      'Hydraulic hose assemblies',
      'Hose fittings',
      'Stainless steel hose products',
      'Cutting and skiving',
      'Crimping',
      'Pressure testing',
    ],
    index: '04',
  },
]

export type Product = {
  slug: string
  name: string
  category: string
  division: string
  description: string
  price: string
  type: 'standard' | 'engineered'
  specs: [string, string][]
}

export const products: Product[] = [
  {
    slug: 'pneumatic-power-cylinder',
    name: 'Pneumatic power cylinder',
    category: 'Pneumatic',
    division: 'distribution',
    description: 'Pneumatic actuation component for industrial equipment and production applications.',
    price: 'Request pricing',
    type: 'standard',
    specs: [['Category', 'Pneumatic cylinder'], ['Configuration', 'Confirm to application'], ['Availability', 'On enquiry']],
  },
  {
    slug: 'pneumatic-booster',
    name: 'Pneumatic booster',
    category: 'Pneumatic',
    division: 'distribution',
    description: 'Pressure-boosting component for pneumatic systems. Confirm requirements with our team.',
    price: 'Request pricing',
    type: 'standard',
    specs: [['Category', 'Pneumatic booster'], ['Configuration', 'Confirm to application'], ['Availability', 'On enquiry']],
  },
  {
    slug: 'power-pack-cylinder',
    name: 'Power pack cylinder',
    category: 'Hydraulic',
    division: 'distribution',
    description: 'Hydraulic cylinder product shown in AIRCON supplied product imagery.',
    price: 'Request pricing',
    type: 'standard',
    specs: [['Category', 'Hydraulic cylinder'], ['Configuration', 'Confirm to application'], ['Availability', 'On enquiry']],
  },
  {
    slug: 'floating-connector',
    name: 'Floating connector',
    category: 'Fluid connectors',
    division: 'distribution',
    description: 'Connector product for industrial applications; verify fit and specification before ordering.',
    price: 'Request pricing',
    type: 'standard',
    specs: [['Category', 'Fluid connector'], ['Material', 'Confirm before order'], ['Availability', 'On enquiry']],
  },
  {
    slug: 'hydraulic-hose-assembly',
    name: 'Hydraulic hose assembly',
    category: 'Hose assemblies',
    division: 'hose-assembly',
    description: 'Hose assembly configured to the application. Share size, ends and operating conditions for a quotation.',
    price: 'Request pricing',
    type: 'engineered',
    specs: [['Application', 'Hydraulic fluid transfer'], ['Ends and length', 'As specified'], ['Testing', 'Confirm on enquiry']],
  },
  {
    slug: 'robotic-welding-cell',
    name: 'Robotic welding cell',
    category: 'Automation',
    division: 'automation',
    description: 'A production automation solution configured around the part, cycle and facility requirements.',
    price: 'Request a quote',
    type: 'engineered',
    specs: [['Solution type', 'Engineered system'], ['Configuration', 'Application-specific'], ['Lead time', 'On enquiry']],
  },
  {
    slug: 'railway-door-system',
    name: 'Railway door system',
    category: 'Railway',
    division: 'railway',
    description: 'Railway door system offering. Confirm coach and technical requirements with AIRCON.',
    price: 'Request a quote',
    type: 'engineered',
    specs: [['Application', 'Railway'], ['Configuration', 'Application-specific'], ['Availability', 'On enquiry']],
  },
  {
    slug: 'servo-press',
    name: 'Servo press',
    category: 'Automation',
    division: 'automation',
    description: 'Servo press solution for production applications, engineered to suit process requirements.',
    price: 'Request a quote',
    type: 'engineered',
    specs: [['Solution type', 'Engineered system'], ['Force and stroke', 'Confirm to application'], ['Availability', 'On enquiry']],
  },
]

export const customers = [
  'Customer identity artwork supplied for AIRCON review',
]

export const projects = [
  {
    slug: 'railway-solutions',
    title: 'Railway equipment & systems',
    category: 'Railway',
    summary: 'Explore AIRCON railway product areas and engineered system capabilities.',
    division: 'railway',
  },
  {
    slug: 'manufacturing-automation',
    title: 'Manufacturing & automation',
    category: 'Automation',
    summary: 'Production fixtures, assembly systems and automation equipment.',
    division: 'automation',
  },
  {
    slug: 'fluid-power-products',
    title: 'Fluid power & hose assemblies',
    category: 'Industrial products',
    summary: 'Hydraulic and pneumatic products, fluid connectors and hose assemblies.',
    division: 'distribution',
  },
]

export const companyFacts = [
  { value: '2005', label: 'Established' },
  { value: '~60', label: 'Team members' },
  { value: '45,000', suffix: ' sq. ft.', label: 'Manesar facility' },
  { value: 'ISO 9001:2015', label: 'Certification stated in profile' },
]

export const categories = ['All products', 'Pneumatic', 'Hydraulic', 'Fluid connectors', 'Hose assemblies', 'Automation', 'Railway']
