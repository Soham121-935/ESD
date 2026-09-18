import type {
  DebugFault,
  DesignChallengeSpec,
  MatrixSpec,
  ModeContent,
  NumericalProblem,
  Question,
  TopicMeta,
} from '../../types'

export const TOPIC1: TopicMeta = {
  id: 'u1t1',
  index: 1,
  title: 'Electronic System Classification',
  shortTitle: 'Classification',
  hook: 'Same function, three completely different products — the requirements decide, not the circuit.',
  status: 'live',
}

/** Provenance note shown at the top of the topic. */
export const SOURCE_NOTE = {
  primary:
    'Supplied course material: “Classification & reliability” (ARN) — Table: Classification of Electronic Product (Consumer / Industry / Military) and the notes on Ergonomics.',
  coverage:
    'The supplied table gives seven comparison parameters and their entries. Examples, the generic system block diagram, the temperature-margin method and all “what-if” extensions are labelled Engineering Insight.',
}

/* ------------------------------------------------------------------ */
/* 1. Source comparison matrix (verbatim entries preserved)           */
/* ------------------------------------------------------------------ */

export const CLASSIFICATION_MATRIX: MatrixSpec = {
  id: 'u1t1-classification-matrix',
  title: 'Classification of Electronic Product — supplied comparison table',
  provenance: 'source',
  columns: ['Parameter', 'Consumer Product', 'Industry Product', 'Military Product'],
  rows: [
    {
      id: 'cost',
      parameter: 'Cost',
      cells: {
        'Consumer Product': 'Should be affordable',
        'Industry Product': 'Development cost higher',
        'Military Product': 'Very High',
      },
      provenance: 'source',
      note: 'The consumer row speaks about the selling price; the industry row speaks about development cost; the military row is simply “Very High”.',
    },
    {
      id: 'reliability',
      parameter: 'Reliability',
      cells: {
        'Consumer Product': 'Good',
        'Industry Product': 'Higher: Service @ customer sight',
        'Military Product': 'Highly reliable and durable',
      },
      provenance: 'source',
      note: 'The industry entry is not only a field value — it also carries a service obligation at the customer site.',
    },
    {
      id: 'ergonomics',
      parameter: 'Ergonomics',
      cells: {
        'Consumer Product': 'Comfort and safety is important',
        'Industry Product': 'Operator safety is important',
        'Military Product': 'Operator safety is important',
      },
      provenance: 'source',
    },
    {
      id: 'aesthetics',
      parameter: 'Aesthetics',
      cells: {
        'Consumer Product': 'Attractive',
        'Industry Product': 'Look of product is not important',
        'Military Product': 'Look of product is not important',
      },
      provenance: 'source',
    },
    {
      id: 'life',
      parameter: 'Life',
      cells: {
        'Consumer Product': 'Moderate',
        'Industry Product': 'Better',
        'Military Product': 'Best',
      },
      provenance: 'source',
    },
    {
      id: 'maintenance',
      parameter: 'Maintenance',
      cells: {
        'Consumer Product': 'Minimum',
        'Industry Product': 'Minimum',
        'Military Product': 'Lowest',
      },
      provenance: 'source',
      note: 'Both consumer and industry entries read “Minimum”; only the military entry is “Lowest”.',
    },
    {
      id: 'temp',
      parameter: 'Operating temp. range',
      cells: {
        'Consumer Product': '0 to 70 °C',
        'Industry Product': '-25 to 85 °C',
        'Military Product': '-55 to 125 °C',
      },
      provenance: 'source',
    },
  ],
  interpretation:
    'Read the table vertically, not horizontally. For any single product, the seven parameters are a package: raising the operating-temperature requirement forces different components, which raises development cost, which in turn changes the maintenance and life expectations. The table is a requirements package, not a shopping list.',
}

/* ------------------------------------------------------------------ */
/* 2. Generic electronic system block diagram (Engineering Insight)   */
/* ------------------------------------------------------------------ */

export interface StageNode {
  id: string
  label: string
  sub: string
  x: number
  y: number
  w: number
  h: number
  role: string
  why: string
  parameters: string[]
}

export const SYSTEM_STAGES: StageNode[] = [
  {
    id: 'input',
    label: 'Input / Sensor',
    sub: 'converts a physical quantity to an electrical signal',
    x: 20,
    y: 108,
    w: 150,
    h: 78,
    role: 'The interface between the physical world and the electronics.',
    why:
      'Every specification argument starts here: if the sensor cannot survive the environment, the rest of the design is irrelevant. This is where the operating-temperature limit is usually set.',
    parameters: ['Operating temp. range', 'Reliability', 'Cost'],
  },
  {
    id: 'conditioning',
    label: 'Signal Conditioning',
    sub: 'amplify / filter / level-shift / protect',
    x: 210,
    y: 108,
    w: 150,
    h: 78,
    role: 'Makes the sensor signal usable by the processing stage.',
    why:
      'This stage decides measurement accuracy. Component quality here directly changes reliability, life and development cost.',
    parameters: ['Reliability', 'Cost', 'Maintenance'],
  },
  {
    id: 'processing',
    label: 'Processing / Control',
    sub: 'decision, computation, sequencing',
    x: 400,
    y: 108,
    w: 150,
    h: 78,
    role: 'Implements the intended function of the product.',
    why:
      'The “intended function” named in the reliability definition is implemented here. It is also the block most affected by development cost.',
    parameters: ['Cost', 'Life', 'Ergonomics'],
  },
  {
    id: 'output',
    label: 'Output / Actuator / Display',
    sub: 'what the user or the plant sees',
    x: 590,
    y: 108,
    w: 150,
    h: 78,
    role: 'Delivers the result to a human operator or to another machine.',
    why:
      'This is where ergonomics and aesthetics become real engineering requirements: comfort, safety, readability and operator error rate are decided here.',
    parameters: ['Ergonomics', 'Aesthetics', 'Maintenance'],
  },
  {
    id: 'power',
    label: 'Power Supply',
    sub: 'conversion, regulation, protection',
    x: 210,
    y: 246,
    w: 150,
    h: 78,
    role: 'Feeds every other block.',
    why:
      'A supply that is not designed for the environment is the single most common cause of field failure. Heat generated here raises the internal temperature above the ambient limit.',
    parameters: ['Operating temp. range', 'Reliability', 'Life'],
  },
]

export const SYSTEM_EDGES: { from: string; to: string; label: string }[] = [
  { from: 'input', to: 'conditioning', label: 'raw signal' },
  { from: 'conditioning', to: 'processing', label: 'conditioned signal' },
  { from: 'processing', to: 'output', label: 'action / indication' },
  { from: 'power', to: 'conditioning', label: 'supply' },
  { from: 'power', to: 'processing', label: 'supply' },
]

/* ------------------------------------------------------------------ */
/* 3. Mode content — Beginner / Intermediate / Exam                   */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'Start here. We do not begin with a definition — we begin with two customers who want the same function.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — Two customers, one function',
      provenance: 'insight',
      body: [
        'A company builds a digital temperature indicator. It measures one temperature and shows it on a display.',
        'Customer A wants it for a kitchen. Customer B wants it inside a cement plant, where the panel sits in an un-air-conditioned room that reaches 48 °C in summer and the plant runs 24 × 7.',
        'The electronics inside both products can be identical in function. So why can the company not ship the same box to both customers?',
      ],
      bullets: [
        'What is required? A product that works for its whole life, in its own environment.',
        'What is given? The function is the same; the environment, the user and the cost of failure are not.',
        'Which parameter changes first? The operating temperature range — and everything else follows it.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Electronic system',
      provenance: 'insight',
      body: [
        'An electronic system is a group of electronic blocks connected together to accept an input, process it and produce a required output.',
        'The supplied material does not give a one-line definition of “electronic system”, so the block view below is an Engineering Insight reconstruction. Use it as a working model, not as a quotation from the source.',
      ],
      bullets: [
        'Input / sensor — turns a physical quantity into an electrical signal.',
        'Signal conditioning — makes that signal usable (amplify, filter, protect).',
        'Processing / control — implements the intended function.',
        'Output / actuator / display — delivers the result.',
        'Power supply — feeds everything and is usually the hottest block.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Classification of Electronic Product',
      provenance: 'source',
      body: [
        'The supplied material classifies electronic products into three application classes and compares them on seven parameters.',
      ],
      quote:
        'Classification of Electronic Product — Parameter: Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance, Operating temp. range. Consumer Product / Industry Product / Military Product.',
      sourceRef: '“Classification & reliability” (ARN), p. 1',
      bullets: [
        'Consumer Product — Cost: Should be affordable',
        'Industry Product — Cost: Development cost higher',
        'Military Product — Cost: Very High',
        'Operating temp. range — Consumer: 0 to 70 °C, Industry: −25 to 85 °C, Military: −55 to 125 °C',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why classify at all?',
      provenance: 'insight',
      body: [
        'Because “it works on the bench” is not a requirement. A requirement is: it must work, under stated conditions, for a stated period, for a stated user.',
        'The class tells you which conditions, which period and which user before you draw the circuit. If you classify first, the component list follows. If you classify last, you will re-design the product.',
      ],
      bullets: [
        'Environment → sets the operating temperature range → sets component grade.',
        'User → sets ergonomics and aesthetics → sets enclosure, display, keypad.',
        'Cost of failure → sets reliability and maintenance → sets derating, protection, redundancy.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — How to classify a product in practice',
      provenance: 'insight',
      body: [
        'Work through the seven parameters in the supplied order. Write one line per parameter. If you cannot fill a line, you do not yet understand the requirement — go and ask.',
      ],
      bullets: [
        'Step 1 — Where does it work? (operating temp. range)',
        'Step 2 — Who uses it, and how often? (ergonomics, aesthetics)',
        'Step 3 — What does a failure cost the customer? (reliability, maintenance)',
        'Step 4 — How long must it last? (life)',
        'Step 5 — What can the customer pay, and what can we spend developing it? (cost)',
        'Step 6 — Now choose the class and check that all seven lines agree with each other.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Generic electronic system',
      provenance: 'insight',
      body: [
        'Click any block. For each block you get: what it does, why it matters for classification, and which of the seven parameters it drives.',
        'Interactive reconstruction — not a scanned copy of a source figure.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — The number that quietly kills products',
      provenance: 'source',
      body: [
        'The supplied table gives one numeric parameter: operating temperature range. It is the fastest way to reject a wrong class.',
        'Required ambient for the cement-plant panel: −5 °C to +48 °C.',
      ],
      bullets: [
        'Consumer: 0 to 70 °C → span = 70 °C − 0 °C = 70 °C. Low-side check: required −5 °C is BELOW 0 °C → fails by 5 °C.',
        'Industry: −25 to 85 °C → span = 85 °C − (−25 °C) = 110 °C. Low side OK with 20 °C margin, high side OK with 37 °C margin.',
        'Military: −55 to 125 °C → span = 125 °C − (−55 °C) = 180 °C. Both sides OK with large margin — and you have paid for margin you do not need.',
        'Decision: Industry. It is the cheapest class that satisfies the environment.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: [
        'Change one thing at a time and watch the decision move. This is the habit the whole Unit 1 is built on.',
      ],
      bullets: [
        'What if the panel is moved outdoors to −35 °C? Consumer and Industry both fail; Military becomes mandatory.',
        'What if the product is for a kitchen (0 to 45 °C) instead? Consumer satisfies it — Industry would be over-design.',
        'What if the plant adds air conditioning and the ambient becomes 15 to 30 °C? The environment no longer drives the class; reliability and maintenance do.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Ergonomics is a requirement, not decoration',
      provenance: 'source',
      body: [
        'The supplied material defines ergonomics and states what ergonomic design should achieve. Note that “comfort” appears only in the consumer row; both industry and military rows reduce ergonomics to “Operator safety is important”.',
      ],
      quote:
        '“Ergonomics — Efficient and effective interconnect between man machine and environment around it. Ergonomic design should reduce user fatigue, stress, improve safety, comfort, job satisfaction, quality of life.”',
      sourceRef: '“Classification & reliability” (ARN), p. 1',
      bullets: [
        'For a consumer product the user is also the buyer — comfort and looks sell the product.',
        'For industry and military products the user is an operator doing a job — the requirement is that the operator does not make an error or get hurt.',
      ],
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'You already know what the classes are. Now treat the table as a requirements contract you have to defend parameter by parameter.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The requirement arrived before the circuit',
      provenance: 'insight',
      body: [
        'You are handed a one-page requirement: a handheld data logger for a refrigerated warehouse. Ambient −22 °C to +35 °C. Operator wears gloves. Product must stay in service for 10 years. Annual shut-down for maintenance is not available.',
        'There is no schematic yet. Before you select a single component, you must decide the class of the product — because the class decides the component grade, the enclosure, the display and the development budget.',
      ],
      bullets: [
        'Required: a defensible class selection plus the parameter set that goes with it.',
        'Given: environment, operator condition, service life, maintenance window.',
        'Which parameter rules first? Operating temp. range — it is the only numeric, falsifiable entry in the supplied table.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — The table is a package, not a list',
      provenance: 'source',
      body: [
        'Read the supplied table as three coherent packages. A class is the set of seven entries taken together; you do not get to mix the cost line of one class with the temperature line of another and call it a design.',
      ],
      sourceRef: '“Classification & reliability” (ARN), p. 1',
      bullets: [
        'Consumer: affordable, good reliability, comfort + safety, attractive, moderate life, minimum maintenance, 0 to 70 °C.',
        'Industry: higher development cost, higher reliability with service at customer site, operator safety, looks unimportant, better life, minimum maintenance, −25 to 85 °C.',
        'Military: very high cost, highly reliable and durable, operator safety, looks unimportant, best life, lowest maintenance, −55 to 125 °C.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why the numeric line decides first',
      provenance: 'insight',
      body: [
        'Six of the seven parameters are qualitative (“Good”, “Better”, “Attractive”). Only the operating temperature range can be checked against a measurement.',
        'That makes it the first falsifiable requirement: a single thermometer reading can disqualify a class. Engineer the arguments you can falsify before the arguments you can only discuss.',
      ],
      bullets: [
        'A component rated 0 to 70 °C used at −22 °C is not “slightly outside spec” — its specified behaviour is simply undefined there.',
        'Internal heating raises the junction temperature above ambient, so the margin you need is larger than the difference between ambient and the limit.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Turn a specification into a class decision',
      provenance: 'insight',
      body: [
        'Write the requirement as numbers, then intersect it with the supplied packages.',
      ],
      bullets: [
        'Step 1 — Extract the numeric environment: Tmin_required = −22 °C, Tmax_required = +35 °C.',
        'Step 2 — Compute the low-side margin for each class. Define margin_low = T_min(req) − T_min(class); the class qualifies only when the result is ≥ 0 °C. Check the sign on a known case: if you compute class minus required instead, a consumer product at −22 °C appears to have +22 °C of margin — obviously wrong, because 0 °C cannot be below −22 °C. Consumer: −22 − 0 = −22 °C → fails. Industry: −22 − (−25) = +3 °C → passes with 3 °C. Military: −22 − (−55) = +33 °C → passes.',
        'Step 3 — Check the high side: margin_high = Tmax_class − Tmax_required. Consumer: 70 − 35 = +35 °C. Industry: 85 − 35 = +50 °C. Military: 125 − 35 = +90 °C.',
        'Step 4 — Bring in the non-numeric parameters: gloves → ergonomics; 10-year life with no maintenance window → life “Better/Best” and maintenance “Minimum/Lowest”.',
        'Step 5 — Industry is the cheapest package that satisfies every line. Military also satisfies it, and that is exactly the trap: it costs “Very High” for margin nobody asked for.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Where each parameter is decided',
      provenance: 'insight',
      body: [
        'The block diagram below maps each of the seven supplied parameters onto the block that actually creates it. Use it during design reviews: if a parameter has no owning block, nobody is responsible for it.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Temperature span and margin',
      provenance: 'source',
      body: [
        'Spans are computed from the supplied ranges; the margin method itself is an Engineering Insight.',
      ],
      bullets: [
        'Span = Tmax − Tmin. Consumer: 70 − 0 = 70 °C. Industry: 85 − (−25) = 110 °C. Military: 125 − (−55) = 180 °C.',
        'The military span is 180 / 110 ≈ 1.64 × the industry span, and 180 / 70 ≈ 2.57 × the consumer span.',
        'Required span for the warehouse: 35 − (−22) = 57 °C. Consumer span (70 °C) is numerically bigger — and still fails, because span is not the test. Position of the window is the test.',
      ],
      sourceRef: 'Ranges taken from “Classification & reliability” (ARN), p. 1',
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Sensitivity of the decision',
      provenance: 'insight',
      body: [
        'Move one requirement at a time and note where the class boundary actually sits.',
      ],
      bullets: [
        'What if the warehouse is held at −30 °C? Industry margin becomes −30 − (−25) = −5 °C → fails. Military becomes mandatory.',
        'What if the logger is moved to an office (5 to 40 °C)? Consumer now satisfies the environment; the decision moves to life and maintenance.',
        'What if the product must be serviced only every 10 years? That pushes maintenance toward “Lowest”, which only the Military row offers — you must then decide whether to buy a better component or to allow a service visit.',
        'What if the customer refuses to pay the industry development cost? The honest engineering answer is that the requirement and the budget are in conflict; the resolution is a redesign of the environment (enclosure, heater, relocation), not a silent downgrade of the component grade.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Two entries in the table are identical',
      provenance: 'source',
      body: [
        'Ergonomics and Aesthetics are identical for Industry and Military products in the supplied table. That is informative: the two expensive classes are not differentiated by how they look or how they feel.',
        'The real differentiators between Industry and Military are Cost, Reliability, Life, Maintenance and Operating temp. range. If a design argument between those two classes is based on looks, it is not an engineering argument.',
      ],
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode writes the topic the way an 8-mark answer is written: definition → diagram → explanation → comparison → justification → conclusion.',
  blocks: [
    {
      kind: 'problem',
      title: 'EXAM QUESTION — 8 Marks',
      provenance: 'source',
      body: [
        'Q. Classify electronic products. Compare Consumer, Industry and Military electronic products on the parameters given in the supplied material, and justify why the same function needs three different product classes. (8 marks)',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (1) Introduction / definition (1–2 marks)',
      provenance: 'source',
      body: [
        'Electronic products are classified according to the application in which they are used. The supplied material classifies them into three classes — Consumer Product, Industry Product and Military Product — and compares them on seven parameters: Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance and Operating temp. range.',
        'An electronic system accepts a physical input through a sensor, conditions the signal, processes it and produces an output or action; a power supply feeds all the blocks. The class of the product decides the requirement imposed on each of these blocks.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Model answer — (2) Diagram (2 marks)',
      provenance: 'insight',
      body: [
        'Draw the functional block diagram: Input/Sensor → Signal Conditioning → Processing/Control → Output/Actuator, with the Power Supply feeding the conditioning and processing blocks. Label the signal direction on every arrow.',
        'Exam tip: a labelled block diagram with signal direction is worth two marks on its own. Do not skip it to write extra prose.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (3) Comparison table (3 marks)',
      provenance: 'source',
      body: [
        'Reproduce the supplied table. Three marks are normally awarded for the table; a table with the seven parameters and the correct entries in all three columns is the fastest marks in the paper.',
      ],
      quote:
        'Cost — Should be affordable / Development cost higher / Very High. Reliability — Good / Higher: Service @ customer sight / Highly reliable and durable. Ergonomics — Comfort and safety is important / Operator safety is important / Operator safety is important. Aesthetics — Attractive / Look of product is not important / Look of product is not important. Life — Moderate / Better / Best. Maintenance — Minimum / Minimum / Lowest. Operating temp. range — 0 to 70 °C / −25 to 85 °C / −55 to 125 °C.',
      sourceRef: '“Classification & reliability” (ARN), p. 1',
    },
    {
      kind: 'concept',
      title: 'Model answer — (4) Explanation of the parameters (1–2 marks)',
      provenance: 'insight',
      body: [
        'Cost rises across the classes because a wider operating temperature range, longer life and higher reliability require higher-grade components, more design effort and more testing; note that the industry entry explicitly names development cost, not unit cost.',
        'Reliability rises because the cost of a failure rises: a consumer failure is an inconvenience, an industrial failure stops production and carries a service obligation at the customer site, and a military failure may be unrecoverable.',
        'Ergonomics is defined in the supplied material as the efficient and effective interconnection between man, machine and the environment around it; ergonomic design should reduce user fatigue and stress and improve safety, comfort, job satisfaction and quality of life. Only the consumer row adds comfort, because there the user is also the buyer.',
        'Aesthetics matters only where appearance influences the purchase decision; for industry and military products the source states that the look of the product is not important.',
        'Life increases from Moderate to Better to Best, and Maintenance correspondingly tightens from Minimum to Lowest, because a product that must remain in service longer must also need less attention.',
        'Operating temperature range is the one numeric parameter and therefore the first check: 0 to 70 °C, −25 to 85 °C and −55 to 125 °C.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (5) Justification and conclusion (1 mark)',
      provenance: 'insight',
      body: [
        'The same function needs three different product classes because the function is not the requirement — the environment, the user, the acceptable failure cost and the service life are the requirement.',
        'Conclude with the engineering rule the table teaches: select the cheapest class whose complete parameter package satisfies every stated requirement. Over-specifying to Military grade “to be safe” spends money on margin that was never asked for; under-specifying to Consumer grade produces field failures that no amount of good circuit design can repair afterwards.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme',
      provenance: 'insight',
      body: [
        '1 mark — classification named with the three classes.',
        '2 marks — labelled functional block diagram with signal direction.',
        '3 marks — comparison table, seven parameters, correct entries.',
        '1½ marks — explanation of at least three parameters in engineering terms.',
        '½ mark — justification / conclusion statement.',
      ],
      bullets: [
        'Common mistake 1: writing only the table and no justification — caps the answer at about 5 of 8.',
        'Common mistake 2: mixing entries between classes (for example “Consumer — −25 to 85 °C”). The table is a package.',
        'Common mistake 3: calling the second class “Industrial”. The supplied material writes “Industry Product”. Preserve the source terminology in the exam answer.',
      ],
    },
  ],
}

export const TOPIC1_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* 4. Numerical problem (source ranges + Engineering Insight method)  */
/* ------------------------------------------------------------------ */

export const TEMP_RANGE_PROBLEM: NumericalProblem = {
  id: 'u1t1-temp-range',
  title: 'Selecting a product class from the operating temperature range',
  provenance: 'source',
  situation:
    'A data logger is installed in a cold-storage warehouse. The measured ambient at the mounting point is −22 °C on the coldest night and +35 °C on the hottest afternoon. You must decide the cheapest class of product that can be deployed.',
  given: [
    { symbol: 'T_min(req)', value: '−22 °C' },
    { symbol: 'T_max(req)', value: '+35 °C' },
    { symbol: 'Consumer range', value: '0 to 70 °C (supplied)' },
    { symbol: 'Industry range', value: '−25 to 85 °C (supplied)' },
    { symbol: 'Military range', value: '−55 to 125 °C (supplied)' },
  ],
  required: [
    'Temperature span of each class',
    'Low-side margin of each class at the required minimum',
    'High-side margin of each class at the required maximum',
    'The class you will deploy, and why not the one above it',
  ],
  assumptions: [
    'The quoted ranges are the operating ambient ranges from the supplied table.',
    'The margin method (required limit compared with class limit) is an Engineering Insight; the supplied material gives the ranges but does not define a margin rule.',
    'Internal heating is ignored in this first pass — in a real design it reduces the effective margin.',
  ],
  steps: [
    {
      id: 'span',
      ask: 'Step 1 — What is the temperature span of each of the three classes? Span = T_max − T_min.',
      concept:
        'A range has two limits. The span only tells you how wide the permitted window is — it says nothing about where the window sits.',
      equation: 'Span = T_max(class) − T_min(class)',
      substitution:
        'Consumer: 70 °C − 0 °C = 70 °C  |  Industry: 85 °C − (−25 °C) = 110 °C  |  Military: 125 °C − (−55 °C) = 180 °C',
      entries: [
        { id: 'sc', label: 'Consumer span', unit: '°C', answer: 70, tolerance: 0.5 },
        { id: 'si', label: 'Industry span', unit: '°C', answer: 110, tolerance: 0.5 },
        { id: 'sm', label: 'Military span', unit: '°C', answer: 180, tolerance: 0.5 },
      ],
      hints: [
        'Subtract the lower limit from the upper limit. Watch the negative signs.',
        'Industry: 85 − (−25). Subtracting a negative is the same as adding 25, so the span is 110 °C.',
      ],
      interpretation:
        'The military window is 180 °C wide, 1.64 × the industry window and 2.57 × the consumer window. Width alone does not decide anything — the next step does.',
      whatIf:
        'If a supplier offers a “semi-industrial” range of −10 to 80 °C, its span is 90 °C — larger than the consumer span and still unable to cover −22 °C. Always recompute both the span and the window position.',
    },
    {
      id: 'low',
      ask: 'Step 2 — What is the low-side margin of each class? margin_low = T_min(req) − T_min(class). A class qualifies only if the result is ≥ 0 °C.',
      concept:
        'The cold end is usually where a consumer product dies, because 0 °C is a hard floor for that class. State the sign convention before you calculate.',
      equation: 'margin_low = T_min(req) − T_min(class)',
      substitution:
        'Consumer: −22 °C − 0 °C = −22 °C (fail)  |  Industry: −22 °C − (−25 °C) = +3 °C (pass)  |  Military: −22 °C − (−55 °C) = +33 °C (pass)',
      entries: [
        { id: 'lc', label: 'Consumer low-side margin', unit: '°C', answer: -22, tolerance: 0.5 },
        { id: 'li', label: 'Industry low-side margin', unit: '°C', answer: 3, tolerance: 0.5 },
        { id: 'lm', label: 'Military low-side margin', unit: '°C', answer: 33, tolerance: 0.5 },
      ],
      hints: [
        'Use the sign convention given: required minus class limit. A negative result means the class cannot reach that temperature.',
        'For Industry you are computing −22 − (−25) = −22 + 25 = +3 °C.',
      ],
      interpretation:
        'Consumer is rejected by 22 °C on the cold end. Industry passes with only 3 °C in hand, which is thin once internal heating and sensor error are added — a real design would ask for the next grade of component or for a heated enclosure.',
      whatIf:
        'If the warehouse is held at −30 °C, the industry margin becomes −30 − (−25) = −5 °C: the decision flips to Military. One degree of ambient moved the answer by an entire class — that is why the ambient must be measured at the mounting point.',
    },
    {
      id: 'high',
      ask: 'Step 3 — What is the high-side margin of each class? margin_high = T_max(class) − T_max(req).',
      concept:
        'The hot end is where the power-supply block and the enclosure decide the real limit, not the silicon alone.',
      equation: 'margin_high = T_max(class) − T_max(req)',
      substitution:
        'Consumer: 70 °C − 35 °C = +35 °C  |  Industry: 85 °C − 35 °C = +50 °C  |  Military: 125 °C − 35 °C = +90 °C',
      entries: [
        { id: 'hc', label: 'Consumer high-side margin', unit: '°C', answer: 35, tolerance: 0.5 },
        { id: 'hi', label: 'Industry high-side margin', unit: '°C', answer: 50, tolerance: 0.5 },
        { id: 'hm', label: 'Military high-side margin', unit: '°C', answer: 90, tolerance: 0.5 },
      ],
      hints: [
        'Here the class limit is the larger number, so the subtraction is class limit minus required limit.',
        'All three pass on the hot side. That is the point: the cold end is the binding constraint.',
      ],
      interpretation:
        'Every class passes the hot end comfortably. The hot end is therefore not the deciding constraint — worth stating explicitly in an exam answer, because it shows you tested both limits instead of assuming one.',
      whatIf:
        'If the logger is moved next to a compressor and the local ambient reaches 95 °C, industry fails (85 − 95 = −10 °C) and only Military survives. Local hotspots matter more than the room thermostat reading.',
    },
    {
      id: 'decision',
      ask: 'Step 4 — Which class do you deploy? Enter 1 = Consumer, 2 = Industry, 3 = Military.',
      concept:
        'Choose the cheapest class whose complete parameter package satisfies every requirement. Over-specifying is a cost defect, not a virtue.',
      equation:
        'Consumer: rejected (margin_low = −22 °C)  →  Industry: accepted  →  Military: accepted but cost = “Very High”',
      substitution:
        'Feasible set = {Industry, Military}; cheapest feasible = Industry. Select 2.',
      entries: [
        {
          id: 'cls',
          label: 'Class to deploy',
          unit: '1 = Consumer, 2 = Industry, 3 = Military',
          answer: 2,
          accepted: ['2', 'industry', 'industry product'],
          tolerance: 0,
        },
      ],
      hints: [
        'More than one class may technically work. Ask which one you are not being paid for.',
        'The supplied table calls military cost “Very High”. Pick the cheaper class that still passes both limits.',
      ],
      interpretation:
        'Industry. This is the engineering decision the table is designed to teach: pass the requirement with the least expensive package, and spend money only where a stated requirement forces you to.',
      whatIf:
        'If the customer later adds “no maintenance access for 10 years”, the maintenance entry pushes toward “Lowest” — a military-grade expectation. The honest response is to price that change, not to quietly upgrade the product.',
    },
  ],
  verification:
    'Check by substitution: place Industry (−25 to 85 °C) against the requirement window (−22 to +35 °C). Both required limits lie inside the class window, so the class is feasible. Consumer (0 to 70 °C) does not contain −22 °C, so it is infeasible regardless of span.',
  interpretation:
    'The classification table is a screening tool. The operating temperature range is the only numeric entry, so it is the only one that can falsify a class with a single measurement — use it first, then argue the qualitative parameters around the result.',
}

/* ------------------------------------------------------------------ */
/* 5. Design challenge                                                 */
/* ------------------------------------------------------------------ */

export const TICKET_DESIGN: DesignChallengeSpec = {
  id: 'u1t1-design-handheld',
  title: 'Design Challenge — Handheld ticket validator for a bus depot',
  provenance: 'insight',
  requirement:
    'A transport authority wants a handheld ticket validator. Depot staff use it outdoors at a bus stand, in the rain, in Pune summer heat and in a hill-station winter night. Operators wear gloves. Units are issued 200 at a time; a unit that fails is swapped, not repaired in the field. Purchase budget is tight, but the authority will pay for a proper development cycle.',
  constraints: [
    'Outdoor use, ambient measured between −10 °C and +52 °C at the mounting point.',
    'Operator wears gloves — keypad and display must work in that condition.',
    'Expected service life: 8 years.',
    'Field repair is not available; a failed unit is replaced from a spares pool.',
    'Unit cost must stay low enough to buy 200 units; a one-time development cost is acceptable.',
  ],
  assumptions: [
    'The seven parameters from the supplied table are the design vocabulary.',
    'The temperature-margin method from the Calculate tab is used as the screening test.',
    'Engineering Insight: this scenario and its numbers are constructed for practice; they are not supplied course values.',
  ],
  checks: [
    {
      id: 'class',
      label: 'Product class',
      ask: 'Which class does this product belong to? (consumer / industry / military)',
      accepted: ['industry', 'industry product', 'industrial'],
      hints: [
        'Hint 1 — Start with the only numeric parameter in the supplied table.',
        'Hint 2 — The required window is −10 °C to +52 °C. Which classes contain that window?',
        'Hint 3 — Consumer spans 0 to 70 °C. −10 °C is outside it. Industry spans −25 to 85 °C and contains the whole window.',
      ],
      rationale:
        'Industry. The required window (−10 to +52 °C) is fully inside −25 to 85 °C and is not inside 0 to 70 °C. Military also contains it, but the constraint on unit cost rules military out.',
    },
    {
      id: 'temp',
      label: 'Operating temperature range to specify',
      ask: 'State the operating temperature range you will write into the specification.',
      unit: '°C',
      accepted: ['-25 to 85', '-25 to 85 °c', '-25 °c to 85 °c', '−25 to 85'],
      hints: [
        'Hint 1 — You are writing the range, not the measured ambient.',
        'Hint 2 — The specification range comes from the class you selected in the previous step.',
        'Hint 3 — Industry class: lower limit first, then upper limit.',
      ],
      rationale:
        '−25 to 85 °C, taken from the Industry column. Do not write the measured depot ambient (−10 to +52 °C) into the product specification: the product must be specified for the class it is bought in, and the depot may redeploy units elsewhere.',
    },
    {
      id: 'ergonomics',
      label: 'Ergonomics requirement',
      ask: 'One line: what does ergonomics mean for this product, and which entry from the supplied table applies?',
      accepted: [
        'operator safety is important',
        'operator safety',
        'operator safety is important — glove operable keypad and readable display',
        'glove operable controls and operator safety',
      ],
      hints: [
        'Hint 1 — Which column does an outdoor depot operator fall into: consumer, industry or military?',
        'Hint 2 — The supplied table has an exact phrase for this column.',
        'Hint 3 — The phrase is “Operator safety is important”. Then translate it: gloves change the keypad and display decision.',
      ],
      rationale:
        'Industry → “Operator safety is important”. Applied: large glove-operable keys, high-contrast display readable in sunlight, one-hand grip, and no exposed sharp edges. Comfort is not the driver here; not making an error while wearing gloves is.',
    },
    {
      id: 'maintenance',
      label: 'Maintenance strategy',
      ask: 'Given the swap-not-repair policy and 8-year life, what maintenance entry applies and what does it force in the design?',
      accepted: [
        'minimum',
        'minimum — modular swap with spares pool',
        'minimum maintenance: swap unit, no field repair',
        'minimum (unit replaced, not repaired)',
      ],
      hints: [
        'Hint 1 — Look at the Maintenance row for the class you selected.',
        'Hint 2 — Industry and Consumer both read “Minimum”; only Military reads “Lowest”.',
        'Hint 3 — “Minimum” with a swap policy means the unit must be replaceable without tools and without recalibration.',
      ],
      rationale:
        '“Minimum”. It forces a modular, tool-free swap design with a spares pool, self-test on power-up, and no field-adjustable parts that would require a technician.',
    },
    {
      id: 'tradeoff',
      label: 'The trade-off you must justify',
      ask: 'The authority wants low unit cost AND an 8-year life AND outdoor operation. Name the trade-off you would put in writing to the customer.',
      accepted: [
        'accept higher development cost to keep unit cost down',
        'higher development cost for lower unit cost',
        'development cost vs unit cost trade-off',
        'spend on development (sealing, component grade, testing) to protect unit cost and life',
      ],
      hints: [
        'Hint 1 — The Industry Cost entry says something specific: “Development cost higher”.',
        'Hint 2 — Which cost can you spend once, and which cost do you pay 200 times?',
        'Hint 3 — One-time development and tooling cost is amortised over the batch; unit cost is multiplied by 200.',
      ],
      rationale:
        'Accept a higher one-off development cost (sealing, component grade selection, environmental testing, tooling) in order to hold the unit cost down over 200 units and to protect the 8-year life. That is exactly what the Industry “Development cost higher” entry describes.',
    },
  ],
  solution: [
    {
      label: 'Requirement',
      content:
        'Handheld outdoor ticket validator, ambient −10 °C to +52 °C, glove-operated, 8-year service life, swap-not-repair, tight unit cost at 200 units.',
    },
    {
      label: 'Constraints',
      content:
        'Numeric environment window; operator condition; service life; no field repair; unit-cost ceiling with development budget available.',
    },
    {
      label: 'Assumptions',
      content:
        'The supplied seven-parameter table is the design vocabulary. The temperature-margin method is an Engineering Insight. The scenario values are constructed for practice.',
    },
    {
      label: 'Class selection',
      content:
        'Industry. Required window −10 to +52 °C lies inside −25 to 85 °C and outside 0 to 70 °C.',
    },
    {
      label: 'Parameter write-up',
      content:
        'Cost — Development cost higher, unit cost controlled. Reliability — Higher, with service at customer site. Ergonomics — Operator safety is important (glove operability, sunlight-readable display). Aesthetics — Look of product is not important. Life — Better (8 years). Maintenance — Minimum (unit swap, no field repair). Operating temp. range — −25 to 85 °C.',
    },
    {
      label: 'Verification',
      content:
        'Low-side margin = −10 °C − (−25 °C) = +15 °C. High-side margin = 85 °C − 52 °C = +33 °C. Both positive → Industry class is feasible on the numeric parameter. Remaining parameters are consistent with the Industry package.',
    },
    {
      label: 'Possible failure modes',
      content:
        'Sealing failure at the keypad (rain ingress); display unreadable in direct sun causing operator error; cold-start battery voltage drop below the regulator minimum at −10 °C; connector corrosion from humidity; keypad membrane stiffening at low temperature and being pressed harder by a gloved operator.',
    },
    {
      label: 'Alternative',
      content:
        'If the depot later reports −30 °C nights, no class below Military covers it. The alternative is to engineer the environment instead of the product: a heated/w insulated docking holster keeps the unit inside its specified window and avoids a full military-grade redesign.',
    },
  ],
  failureModes: [
    'Specifying the measured depot ambient (−10 to +52 °C) as the product range instead of the class range.',
    'Selecting Consumer class because the function is simple, and discovering the failure only in the first winter.',
    'Selecting Military class “to be safe” and blowing the unit-cost ceiling for margin nobody requested.',
    'Treating ergonomics as industrial design and shipping a keypad that cannot be used with gloves.',
  ],
  interpretation:
    'The design output of this topic is not a circuit — it is a written parameter package. Once the package is right, the circuit design in the later topics has a target to hit and a limit to respect.',
}

/* ------------------------------------------------------------------ */
/* 6. Debugging lab                                                    */
/* ------------------------------------------------------------------ */

export const DEBUG_CASES: DebugFault[] = [
  {
    id: 'u1t1-debug-cold-store',
    title: 'Fault 1 — Consumer unit installed in a cold store',
    provenance: 'insight',
    symptom:
      'A Wi-Fi temperature logger bought as a “consumer smart sensor” is installed in a cold-storage room. Through the summer it works. Every winter night, around 02:00, it drops off the network and the display freezes. In the morning it recovers by itself. No fault is found when the unit is brought to the office.',
    measurements: [
      { label: 'Ambient at the mounting point (winter night)', value: '−18 °C' },
      { label: 'Ambient at the mounting point (summer day)', value: '+29 °C' },
      { label: 'Supply voltage at the unit', value: '5.05 V (normal)' },
      { label: 'Wi-Fi signal strength', value: '−58 dBm (good)' },
      { label: 'Behaviour on the office bench at 25 °C', value: 'No fault in 72 hours' },
      { label: 'Nameplate on the unit', value: '“Operating temperature: 0 °C to 40 °C”' },
    ],
    hypotheses: [
      { id: 'h1', text: 'Weak Wi-Fi coverage at night' },
      { id: 'h2', text: 'The supply voltage collapses in the cold' },
      { id: 'h3', text: 'The ambient temperature is outside the operating range of the product class used' },
      { id: 'h4', text: 'The firmware has a memory leak that appears after several hours' },
    ],
    correctHypothesisId: 'h3',
    fixes: [
      { id: 'f1', text: 'Add a Wi-Fi repeater closer to the cold room' },
      { id: 'f2', text: 'Replace the unit with an Industry-class product specified for −25 to 85 °C' },
      { id: 'f3', text: 'Increase the supply voltage to 6 V' },
      { id: 'f4', text: 'Reboot the unit every night with a timer' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — Which measurement is the only one that changes between the working case and the failing case?',
      'Hint 2 — The unit works at +29 °C and fails at −18 °C. Compare that with the nameplate range.',
      'Hint 3 — Look up the Operating temp. range row of the supplied classification table and see which class contains −18 °C.',
    ],
    rootCause:
      'The product was specified as Consumer class (0 to 70 °C in the supplied table; 0 to 40 °C on this particular nameplate). The application requires operation at −18 °C, which is below the lower limit of that class. Below the stated limit the manufacturer’s specified behaviour is undefined: the display slows and freezes, and the radio drops out. Nothing is “broken” — the unit is simply being asked to work outside the range it was designed and tested for.',
    prevention:
      'Write the operating temperature range into the purchase specification and verify it against the measured worst-case ambient before procurement, not after commissioning. If an existing Consumer unit must stay in place, engineer the environment instead: an insulated, thermostatically heated enclosure keeps the unit inside its specified window — but note that this adds a failure mode of its own (the heater).',
  },
  {
    id: 'u1t1-debug-hmi',
    title: 'Fault 2 — The panel HMI nobody can use',
    provenance: 'insight',
    symptom:
      'A new operator panel is installed on a bottling line. Electrically it is perfect: it reads the PLC, it logs correctly, nothing overheats. After two weeks the plant manager rejects it — operators keep pressing the wrong key, and they have to remove their gloves to hit the buttons, which they are not allowed to do.',
    measurements: [
      { label: 'Panel internal temperature (measured)', value: '46 °C — within the industry range' },
      { label: 'All electrical functions', value: 'Pass — no hardware fault found' },
      { label: 'Key pitch on the membrane keypad', value: '8 mm' },
      { label: 'Display character height', value: '3 mm, no backlight boost, glossy cover' },
      { label: 'Operator handwear', value: 'Cut-resistant gloves, mandatory on the line' },
      { label: 'Ambient light at the panel', value: 'Direct overhead lighting plus daylight from the dock doors' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The panel is overheating and causing intermittent key faults' },
      { id: 'h2', text: 'The ergonomics requirement was treated as appearance instead of as an operator-interface requirement' },
      { id: 'h3', text: 'The PLC communication protocol is wrong' },
      { id: 'h4', text: 'The keypad needs more debounce in firmware' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Add a cooling fan to the panel enclosure' },
      { id: 'f2', text: 'Re-specify the operator interface: glove-operable keys, larger high-contrast display, matt anti-glare cover' },
      { id: 'f3', text: 'Change the PLC baud rate' },
      { id: 'f4', text: 'Increase the keypad debounce time to 200 ms' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — Every electrical measurement is normal. So what kind of requirement is unmet?',
      'Hint 2 — The source defines ergonomics as the interconnection between man, machine and environment. Which of those three is being ignored?',
      'Hint 3 — The operator is part of the system. Gloves and glare are operating conditions, not user preferences.',
    ],
    rootCause:
      'The design met the electrical requirements and ignored the man–machine–environment interface. The supplied material states that for Industry products “Operator safety is important”, and defines ergonomics as the efficient and effective interconnection between man, machine and the environment around it — with the explicit goals of reducing user fatigue and stress and improving safety. Small keys under mandatory gloves, a 3 mm glossy display under direct light, produce operator error. An operator who cannot read the panel is a safety problem, not a comfort problem.',
    prevention:
      'Put ergonomics into the requirement document as measurable entries: minimum key pitch with gloves, minimum character height, contrast ratio and glare treatment, viewing angle. Then test with the actual operator wearing the actual gloves, in the actual lighting — not on the bench.',
  },
]

/* ------------------------------------------------------------------ */
/* 7. Question bank — 40 questions                                     */
/* ------------------------------------------------------------------ */

const T = 'u1t1'

export const TOPIC1_QUESTIONS: Question[] = [
  /* ---------------- CONCEPTUAL (10) ---------------- */
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'State',
    prompt:
      'List the seven parameters used in the supplied material to compare Consumer, Industry and Military electronic products.',
    hint: 'They are the row headings of the “Classification of Electronic Product” table. There are exactly seven.',
    solution: [
      { label: 'Required', content: 'The seven comparison parameters.' },
      {
        label: 'Answer',
        content:
          '1. Cost  2. Reliability  3. Ergonomics  4. Aesthetics  5. Life  6. Maintenance  7. Operating temp. range',
      },
      {
        label: 'Note',
        content:
          'The supplied material writes the class name as “Industry Product”. Preserve that wording in an exam answer.',
      },
    ],
    engineeringExplanation:
      'The parameter list is the design vocabulary for the whole of Unit 1. If a requirement cannot be mapped to one of these seven lines, it has not been stated in a form an engineer can design against.',
    provenance: 'source',
  },
  {
    id: `${T}-c2`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'The Reliability row reads “Good” (Consumer), “Higher: Service @ customer sight” (Industry) and “Highly reliable and durable” (Military). Explain what actually changes in the engineering obligation across these three entries.',
    hint: 'Two different things are being described at once: a reliability level, and a service obligation.',
    solution: [
      {
        label: 'Given',
        content: 'Three reliability entries from the supplied table.',
      },
      {
        label: 'Principle',
        content:
          'Reliability is the ability of a product to perform its intended function under stated conditions for a stated period of time. The required level follows the cost of a failure.',
      },
      {
        label: 'Answer',
        content:
          'Consumer — “Good”: a failure is an inconvenience to the user, who can usually replace the product. Industry — “Higher”: a failure stops production, so the reliability requirement rises AND a service obligation at the customer site is created; the product must be designed to be serviced where it is installed. Military — “Highly reliable and durable”: a failure may be unrecoverable and service may be impossible, so the requirement is met by design margin, component grade and durability rather than by a service visit.',
      },
    ],
    engineeringExplanation:
      'Notice that only the industry entry adds a duty of service. That single phrase changes the mechanical design (access, modules, test points) and the commercial model (spares, field engineers) — not just the component selection.',
    provenance: 'source',
  },
  {
    id: `${T}-c3`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Under Ergonomics, the Consumer entry is “Comfort and safety is important” while both Industry and Military entries are “Operator safety is important”. Explain why the word “comfort” appears only in the consumer column.',
    hint: 'Ask who chooses the product in each case, and what the operator is being paid to do.',
    solution: [
      {
        label: 'Principle',
        content:
          'Ergonomics is defined in the supplied material as the efficient and effective interconnect between man, machine and the environment around it.',
      },
      {
        label: 'Answer',
        content:
          'For a consumer product the user is also the buyer, so comfort and appearance influence the purchase decision — comfort is a commercial requirement as well as a human one. For industry and military products the operator does not buy the product; the operator is performing a job in an environment that may be hazardous. There the requirement reduces to not making an error and not being injured, which is why the source states “Operator safety is important”.',
      },
      {
        label: 'Engineering translation',
        content:
          'Consumer → pleasant to hold, quiet, attractive. Industry/Military → glove-operable controls, readable display in the actual lighting, unambiguous indication, no possibility of an unintended action.',
      },
    ],
    engineeringExplanation:
      'Removing “comfort” does not lower the ergonomics requirement — it changes what the requirement means. An uncomfortable consumer product loses sales; an unsafe industrial panel loses fingers.',
    provenance: 'source',
  },
  {
    id: `${T}-c4`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Aesthetics is “Attractive” for Consumer and “Look of product is not important” for Industry and Military. State the engineering consequence of this difference for the enclosure design.',
    hint: 'Think about what a curved, styled, vent-free enclosure does to sealing, mounting and cost.',
    solution: [
      {
        label: 'Answer',
        content:
          'Consumer enclosure design is driven by appearance: styled curves, hidden fasteners, seamless surfaces, colour and finish. That constrains moulding/tooling cost and can conflict with sealing, ventilation and service access. Industry and Military enclosures are driven by function: panel or rack mounting, gasketed sealing, cable glands, visible and captive fasteners, provision for heat dissipation and easy module replacement. Appearance is allowed to follow the function.',
      },
      {
        label: 'Consequence',
        content:
          'Budget that a consumer product spends on tooling and finish, an industrial product spends on sealing, EMC gaskets, connectors and service access.',
      },
    ],
    engineeringExplanation:
      '“Looks do not matter” is not a licence to design something ugly — it is a statement about where the design budget goes. It frees the engineer to put a gasket, a gland or a heatsink exactly where the physics needs it.',
    provenance: 'source',
  },
  {
    id: `${T}-c5`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'The Cost row reads “Should be affordable” (Consumer), “Development cost higher” (Industry) and “Very High” (Military). Explain why the Industry entry names development cost rather than unit cost, and what that implies for a 200-unit batch.',
    hint: 'One of these costs is paid once, the other is paid as many times as you build units.',
    solution: [
      {
        label: 'Principle',
        content:
          'Total cost of a batch = one-time development/tooling/qualification cost + (unit cost × quantity).',
      },
      {
        label: 'Answer',
        content:
          'An industrial product must meet a wider temperature range, higher reliability, better life and a service obligation. Those are achieved by design effort — component grade selection, derating, protection, environmental and EMC testing, documentation and tooling — which is largely a one-time development cost. The unit cost can then still be held competitive. Military products carry “Very High” cost because both the development cost and the component/qualification cost are high.',
      },
      {
        label: 'Implication for a 200-unit batch',
        content:
          'Spending on development is amortised over 200 units, so it is rational to spend once to hold the recurring unit cost down. That is precisely the trade-off the Industry Cost entry describes.',
      },
    ],
    engineeringExplanation:
      'This is the single most misread line in the table. “Development cost higher” is not a warning that the product is expensive to manufacture — it is a statement that the engineering effort, not the bill of materials, is where the money goes.',
    provenance: 'source',
  },
  {
    id: `${T}-c6`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Interpret',
    prompt:
      'The Maintenance row reads “Minimum” for both Consumer and Industry and “Lowest” for Military. Interpret this ordering — why is Military not simply “Minimum” as well?',
    hint: 'Consider what maintenance means when the product is in a place a technician cannot easily reach.',
    solution: [
      {
        label: 'Answer',
        content:
          '“Minimum” means the product is designed so that little maintenance is needed and what is needed is straightforward. “Lowest” goes further: the product must be designed so that maintenance is reduced as far as physically possible, because in military use a maintenance action may be dangerous, impossible, or operationally unacceptable. The design therefore pushes towards sealed units, modular replacement, built-in test and long-life parts.',
      },
      {
        label: 'Link to the rest of the table',
        content:
          '“Lowest” maintenance is consistent with “Best” life, “Highly reliable and durable” and “Very High” cost in the same column — the whole column is one coherent package.',
      },
    ],
    engineeringExplanation:
      'Maintenance is a design output, not a service-department problem. Every adjustable component you put in the design is a maintenance action you have created.',
    provenance: 'source',
  },
  {
    id: `${T}-c7`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Life is “Moderate” / “Better” / “Best” across the three classes. Analyse how the expected life interacts with the maintenance requirement in the same column.',
    hint: 'A product that must stay in service longer must also need less attention while it is in service.',
    solution: [
      {
        label: 'Answer',
        content:
          'Life and maintenance move together by design. A moderate-life consumer product can tolerate a service visit or an early replacement. A better-life industrial product must run for years inside a production process, so its maintenance must stay at a minimum — otherwise downtime destroys the value of the longer life. A best-life military product must remain available with the lowest possible maintenance, which forces sealed, modular and self-testing designs.',
      },
      {
        label: 'Engineering form',
        content:
          'Availability ≈ function of (reliability, life, maintenance). Improving only one of the three does not improve availability.',
      },
    ],
    engineeringExplanation:
      'This is why the table must be read as packages. Quoting “Best” life from the military column while quoting “Minimum” maintenance from the consumer column is not a design — it is a contradiction.',
    provenance: 'source',
  },
  {
    id: `${T}-c8`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 3,
    skill: 'concept',
    action: 'Define',
    prompt:
      'Define ergonomics as given in the supplied material and list the four outcomes that ergonomic design should achieve.',
    hint: 'The source definition speaks of an “interconnect” between three things.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          '“Ergonomics — Efficient and effective interconnect between man machine and environment around it.”',
      },
      {
        label: 'Outcomes (source)',
        content:
          'Ergonomic design should: (1) reduce user fatigue, (2) reduce stress, (3) improve safety, (4) improve comfort, job satisfaction and quality of life.',
      },
    ],
    engineeringExplanation:
      'Memorise the definition verbatim for a 2-mark question, then immediately translate it into something measurable (key size, display height, glare, reach, force) — that translation is what earns the application marks.',
    provenance: 'source',
  },
  {
    id: `${T}-c9`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'analysis',
    action: 'Compare',
    prompt:
      'Electronic products can be classified by application domain (consumer / industry / military) or by signal type (analog / digital / mixed-signal). Which scheme does the supplied table use, and why can both be useful to the same engineer?',
    hint: 'One scheme tells you the requirements package; the other tells you the design techniques you will need.',
    solution: [
      {
        label: 'Answer',
        content:
          'The supplied table classifies by application domain — Consumer Product, Industry Product, Military Product — and compares them on seven requirement parameters.',
      },
      {
        label: 'Why both are useful',
        content:
          'Classification by application domain decides the requirement package: environment, life, maintenance, cost, ergonomics. Classification by signal type decides the engineering methods: analog conditioning, noise and grounding practice, or digital logic levels and timing. A real product needs both decisions, made in that order — requirements first, techniques second.',
      },
      {
        label: 'Engineering Insight',
        content:
          'The signal-type classification is not in the supplied material; it is standard engineering practice and is presented here as Engineering Insight.',
      },
    ],
    engineeringExplanation:
      'Students lose marks by answering a requirements question with a circuit-technique answer. “It is an industrial product” tells you the temperature range; “it is a mixed-signal product” tells you how to lay out the PCB. Different questions.',
    provenance: 'insight',
  },
  {
    id: `${T}-c10`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'concept',
    action: 'Justify',
    prompt:
      'The supplied material defines reliability as “the ability of product to perform intended function under stated condition, for stated period of time”. Justify why each of the three qualifiers — intended function, stated condition, stated period — is necessary.',
    hint: 'Remove one qualifier at a time and see whether the statement is still testable.',
    solution: [
      {
        label: 'Principle',
        content:
          'A requirement that cannot be tested is not a requirement. Each qualifier converts the sentence into something measurable.',
      },
      {
        label: 'Answer',
        content:
          'Intended function — without it, “working” is undefined: a display that lights but shows the wrong value has not failed mechanically but has failed functionally. Stated condition — the same product behaves differently at −25 °C and at 70 °C, so reliability is meaningless without the environment (temperature, humidity, supply, vibration). Stated period — reliability is always quoted with respect to time; a product that is certain to fail on day one and a product expected to run for ten years cannot be compared without the period.',
      },
      {
        label: 'Link',
        content:
          'This definition is developed mathematically in Topic 2 (System Reliability) using the exponential law R(t) = e^(−λt).',
      },
    ],
    engineeringExplanation:
      'This is the bridge between Topic 1 and Topic 2. Classification gives you the “stated condition”; reliability engineering turns that condition into a number.',
    provenance: 'source',
  },

  /* ---------------- APPLICATION (5) ---------------- */
  {
    id: `${T}-a1`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Classify',
    prompt:
      'A microcontroller-based washing-machine controller is to be designed. Classify it and justify the classification using four parameters from the supplied table.',
    hint: 'Who buys it, where does it work, and what does a failure cost?',
    solution: [
      { label: 'Class', content: 'Consumer Product.' },
      {
        label: 'Justification',
        content:
          'Cost — “Should be affordable”: the appliance market is price-sensitive, so the bill of materials dominates. Operating temp. range — 0 to 70 °C: a domestic laundry area is within this window. Ergonomics — “Comfort and safety is important”: the user is the buyer, so the interface must be pleasant and safe for untrained users. Aesthetics — “Attractive”: appearance influences the purchase decision.',
      },
      {
        label: 'What the engineer should notice',
        content:
          'Life is only “Moderate” and maintenance “Minimum” — you are not designing a 20-year product, but you are also not designing a serviceable one. Design for replacement, not repair.',
      },
    ],
    engineeringExplanation:
      'The trap in this question is humidity and detergent vapour, which are not in the supplied table. A good engineer classifies with the table and then adds the environment-specific requirements the table does not cover — conformal coating, sealed connectors — and says so explicitly.',
    provenance: 'source',
  },
  {
    id: `${T}-a2`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Classify',
    prompt:
      'A PLC-based conveyor controller is mounted in an un-air-conditioned panel inside a cement plant. Panel ambient reaches 48 °C in summer and falls to 2 °C on winter nights. Classify the product and identify the parameter that decides the answer.',
    hint: 'Find the one numeric parameter and test it first.',
    solution: [
      { label: 'Class', content: 'Industry Product.' },
      {
        label: 'Deciding parameter',
        content:
          'Operating temp. range. Consumer: 0 to 70 °C — the low side is safe at 2 °C, so temperature alone does not reject consumer here. The rejection comes from the other parameters: a plant stoppage is expensive, so Reliability must be “Higher: Service @ customer sight”, Life must be “Better”, and the product must be serviceable at the customer site.',
      },
      {
        label: 'Careful reading',
        content:
          'If the panel were outdoors and reached −10 °C, the temperature parameter alone would reject Consumer (0 °C lower limit) and Industry (−25 to 85 °C) would become mandatory. Always state the ambient you are designing for.',
      },
    ],
    engineeringExplanation:
      'Notice what this question is really testing: the ability to say “temperature does not reject it here, so I must argue the other parameters”. Students who only check one parameter give incomplete answers.',
    provenance: 'source',
  },
  {
    id: `${T}-a3`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Classify',
    prompt:
      'An avionics display unit in a military aircraft must operate from −50 °C on the ground to +95 °C behind the panel. Classify it and explain why no lower class can be used.',
    hint: 'Test both limits against all three windows.',
    solution: [
      { label: 'Class', content: 'Military Product.' },
      {
        label: 'Test',
        content:
          'Required window: −50 °C to +95 °C. Consumer (0 to 70 °C) fails on both limits. Industry (−25 to 85 °C) fails on both limits: −50 °C is below −25 °C and +95 °C is above 85 °C. Military (−55 to 125 °C) contains both limits.',
      },
      {
        label: 'Consequence',
        content:
          'Because only the Military package fits, the cost entry “Very High”, the life entry “Best” and the maintenance entry “Lowest” come with it whether you want them or not. That is the meaning of a package: you cannot buy only the temperature row.',
      },
    ],
    engineeringExplanation:
      'This is the case where over-specification is not a choice — the environment forces the package. The engineering skill is recognising when the environment forces it and when it does not.',
    provenance: 'source',
  },
  {
    id: `${T}-a4`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Determine',
    prompt:
      'A technician carries a handheld digital multimeter into a steel plant. The instrument is sold in the consumer market, but it is being used 8 hours a day inside an industrial plant where a wrong reading can scrap a heat of steel. Which class should govern the purchase specification, and why?',
    hint: 'The class follows the application, not the catalogue the product was sold from.',
    solution: [
      { label: 'Class', content: 'Industry Product should govern the purchase specification.' },
      {
        label: 'Reasoning',
        content:
          'Classification is a property of the application, not of the sales channel. The “stated condition” in the reliability definition is the steel-plant environment; the cost of failure is an industrial cost of failure. Therefore the requirement package is the industry package: “Development cost higher”, “Higher: Service @ customer sight”, “Operator safety is important”, “Look of product is not important”, “Better” life, “Minimum” maintenance, −25 to 85 °C.',
      },
      {
        label: 'Practical consequence',
        content:
          'The instrument must also be specified for the electrical environment (category/overvoltage rating, calibration interval) — requirements the supplied classification table does not cover. Engineering Insight: add them explicitly rather than assuming the class covers them.',
      },
    ],
    engineeringExplanation:
      'This is the most common procurement error in real plants: buying by catalogue instead of by requirement. The classification table exists to stop exactly that argument.',
    provenance: 'insight',
  },
  {
    id: `${T}-a5`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 5,
    skill: 'design',
    action: 'Justify',
    prompt:
      'A hospital patient monitor does not appear in the supplied table. Using the seven supplied parameters as your vocabulary, decide where it sits and which three parameters dominate the design.',
    hint: 'What is the cost of a failure here, and who is the operator?',
    solution: [
      {
        label: 'Position',
        content:
          'Closest to the Military / high-end Industry package, with consumer-grade ergonomics. It is not in the table; the reasoning below is Engineering Insight.',
      },
      {
        label: 'Dominant parameters',
        content:
          '1. Reliability — a failure can be fatal, so the reliability requirement is at or above the industrial level and must include fail-safe behaviour and alarms. 2. Ergonomics — “Operator safety is important”: the operator is a clinician under time pressure, so unambiguous indication, alarm priority and error-proof controls dominate. 3. Maintenance — must be “Minimum” to “Lowest”: calibration and verification must be possible without taking the device out of service for long.',
      },
      {
        label: 'Secondary',
        content:
          'Operating temp. range is easy (wards are 15 to 30 °C) and aesthetics matters more than for an industrial panel but far less than for a phone.',
      },
    ],
    engineeringExplanation:
      'The value of the table is that it gives you a vocabulary when you meet a product that is not in it. State the class you are approximating, and then say which parameters you are raising or lowering and why — that is a design justification.',
    provenance: 'insight',
  },

  /* ---------------- COMPARISON (5) ---------------- */
  {
    id: `${T}-m1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 3,
    skill: 'concept',
    action: 'Compare',
    prompt:
      'Compare Consumer and Industry products on the operating temperature parameter using the supplied values, and state the exact number of degrees by which the Industry window is wider.',
    hint: 'Compute both spans, then take the difference.',
    solution: [
      { label: 'Given', content: 'Consumer: 0 to 70 °C. Industry: −25 to 85 °C.' },
      { label: 'Equation', content: 'Span = T_max − T_min. Difference = Span_industry − Span_consumer.' },
      {
        label: 'Calculation',
        content:
          'Span_consumer = 70 °C − 0 °C = 70 °C. Span_industry = 85 °C − (−25 °C) = 110 °C. Difference = 110 °C − 70 °C = 40 °C.',
      },
      {
        label: 'Answer with unit',
        content:
          'The Industry window is wider by 40 °C: it extends 25 °C lower at the cold end and 15 °C higher at the hot end.',
      },
      {
        label: 'Interpretation',
        content:
          'The extra 40 °C is not free — it is paid for by the “Development cost higher” entry and by higher-grade components.',
      },
    ],
    engineeringExplanation:
      'Splitting the 40 °C into 25 °C at the bottom and 15 °C at the top is the useful form of the answer: the cold end is where most consumer products actually fail.',
    provenance: 'source',
  },
  {
    id: `${T}-m2`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Compare',
    prompt:
      'Two rows of the supplied table have identical entries for Industry and Military products. Name them, and explain what that tells you about the real differentiators between those two classes.',
    hint: 'Look for the rows where the second and third columns say the same thing.',
    solution: [
      { label: 'Answer', content: 'Ergonomics (“Operator safety is important”) and Aesthetics (“Look of product is not important”).' },
      {
        label: 'Interpretation',
        content:
          'The two expensive classes are not differentiated by how the product looks or how it feels to use. The real differentiators are Cost, Reliability, Life, Maintenance and Operating temp. range.',
      },
      {
        label: 'Consequence for design reviews',
        content:
          'If an argument between an Industry and a Military design is based on appearance or comfort, it is not an engineering argument. Push the discussion to the numeric and service parameters.',
      },
    ],
    engineeringExplanation:
      'Recognising which parameters are NOT differentiators is as important as knowing which ones are. It stops a design review from spending an hour on the enclosure colour when the real question is the maintenance interval.',
    provenance: 'source',
  },
  {
    id: `${T}-m3`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt:
      'Rank the three classes by operating temperature span, largest first, using the supplied ranges. Then state the ratio of the largest span to the smallest span.',
    hint: 'Span = T_max − T_min. Watch the negative lower limits.',
    solution: [
      { label: 'Given', content: 'Consumer 0 to 70 °C; Industry −25 to 85 °C; Military −55 to 125 °C.' },
      {
        label: 'Calculation',
        content:
          'Consumer: 70 °C − 0 °C = 70 °C. Industry: 85 °C − (−25 °C) = 110 °C. Military: 125 °C − (−55 °C) = 180 °C.',
      },
      {
        label: 'Answer with unit',
        content:
          'Ranking: Military (180 °C) > Industry (110 °C) > Consumer (70 °C). Ratio largest/smallest = 180 °C / 70 °C ≈ 2.57.',
      },
      {
        label: 'Verification',
        content: 'Each span is positive and larger than the one below it, consistent with the ordering of the classes.',
      },
      {
        label: 'Caution',
        content:
          'A wider span does not mean a suitable product. A required window of −40 to +20 °C is only 60 °C wide — narrower than the consumer span — and consumer still fails it.',
      },
    ],
    engineeringExplanation:
      'This question exists to break a specific wrong intuition: that span size is the selection criterion. The position of the window is the criterion; span is only a by-product.',
    provenance: 'source',
  },
  {
    id: `${T}-m4`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Across the three supplied classes, Cost rises while Life also rises. Analyse the engineering relationship between these two parameters — why are they not in conflict?',
    hint: 'Higher-grade components and more design effort cost more, and they also last longer. What connects them?',
    solution: [
      {
        label: 'Answer',
        content:
          'They are not in conflict because the same design actions raise both. Derating components, selecting higher temperature-grade parts, improving sealing, adding protection and qualifying the design by test all increase cost AND increase life. The conflict is not between cost and life — it is between cost and the customer’s willingness to pay for life.',
      },
      {
        label: 'Where the real trade-off sits',
        content:
          'The genuine trade-off is development cost versus unit cost (visible in the Industry entry) and up-front cost versus maintenance cost over the service life.',
      },
    ],
    engineeringExplanation:
      'Engineers who say “cost and life are a trade-off” without qualification usually have not identified what they are giving up. Be precise: you give up unit cost today to buy service life tomorrow.',
    provenance: 'insight',
  },
  {
    id: `${T}-m5`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'analysis',
    action: 'Compare',
    prompt:
      'Compare the maintenance philosophy implied by the Consumer and Military columns, and give one concrete design decision that follows from each.',
    hint: '“Minimum” and “Lowest” are not the same word.',
    solution: [
      {
        label: 'Consumer — Minimum',
        content:
          'Philosophy: the product should need little attention during a moderate life, and when it fails it is replaced rather than repaired. Design decision: no user-serviceable parts, no field calibration, snap-fit enclosure.',
      },
      {
        label: 'Military — Lowest',
        content:
          'Philosophy: maintenance actions are themselves a risk or an operational penalty, so the design must reduce them as far as possible. Design decision: sealed modular line-replaceable units with built-in test, so a fault is isolated to one module and swapped in minutes without adjustment.',
      },
    ],
    engineeringExplanation:
      '“Minimum” is a quantity. “Lowest” is an optimisation target. When you write a specification, write which one you mean — the maintenance team will design to it.',
    provenance: 'source',
  },

  /* ---------------- VIVA (5) ---------------- */
  {
    id: `${T}-v1`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 2,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why does the same function need three different product classes?',
    hint: 'Separate “function” from “requirement”.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the function is not the requirement. The requirement includes the environment, the user, the acceptable cost of failure and the service life. A temperature indicator in a kitchen and a temperature indicator in a cement plant have the same function and completely different requirements, so they are different products.',
      },
    ],
    engineeringExplanation:
      'This is the opening viva question of Unit 1. If the student answers “because the cost is different”, push to “why is the cost different?” — the chain must end at a requirement.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'But the circuit inside is the same. So why can you not just put it in a better box?',
        expected:
          'Because the enclosure does not change the operating temperature range of the components inside it, nor the failure rate of the parts, nor the service life. A better box can move the environment, but the component grade and the qualification testing still have to match the class.',
      },
      {
        teacher: 'Give me one parameter that no enclosure can fix.',
        expected:
          'The internal temperature rise of the power-supply block, or the specified operating temperature range of the semiconductor itself — those are properties of the components, not of the box.',
      },
    ],
  },
  {
    id: `${T}-v2`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 2,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why is the operating temperature range given as a range with two limits instead of one number?',
    hint: 'What fails at the cold end is not what fails at the hot end.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the two limits come from different physical mechanisms. The upper limit is set by heating, junction temperature and thermal runaway; the lower limit is set by material and semiconductor behaviour at low temperature, condensation, battery capacity and mechanical contraction. One number cannot express both.',
      },
    ],
    engineeringExplanation:
      'A student who says “because it has a minimum and a maximum” has restated the question. Push for the mechanism at each end.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Which end usually kills a consumer product first in the field?',
        expected:
          'The cold end, because the consumer lower limit is 0 °C, which is reached far more easily than the 70 °C upper limit in most installations.',
      },
      {
        teacher: 'If the ambient is inside the range, are you safe?',
        expected:
          'Not necessarily. Internal heating raises the temperature inside the enclosure above ambient, and the requirement applies to the component, not to the room. You must check the internal temperature, not only the ambient.',
      },
    ],
  },
  {
    id: `${T}-v3`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Justify',
    prompt:
      'The Industry and Military rows both say “Look of product is not important”. Is that an engineering requirement, or just a comment about style?',
    hint: 'What does the design budget get spent on instead?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'It is an engineering requirement about where the design effort goes. It releases the engineer from styling constraints so that sealing, heat dissipation, cable entry, service access and mounting can be placed where the physics requires them. It also tells you not to spend tooling money on appearance.',
      },
    ],
    engineeringExplanation:
      'The follow-up that separates a memorised answer from an understood one: ask what the engineer does with the money that was not spent on styling.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'So an industrial panel is allowed to be ugly?',
        expected:
          'It is allowed to be unstyled. It is still not allowed to be unusable — legibility, labelling, control layout and indication are ergonomics, not aesthetics, and they remain requirements.',
      },
      {
        teacher: 'Give me an example of a styling constraint that would hurt an industrial design.',
        expected:
          'A seamless curved enclosure with hidden fasteners and no visible vents: it prevents gasketed cable glands, service access and adequate heat dissipation.',
      },
    ],
  },
  {
    id: `${T}-v4`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Interpret',
    prompt: 'Why does the Industry reliability entry say “Higher: Service @ customer sight”?',
    hint: 'The phrase after the colon is the important part.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because for an industrial product the supplier carries an obligation to restore the product where it is installed. That makes serviceability a design requirement: the product must be diagnosable and repairable at the customer site, which drives test points, modular construction, documentation, spares and field-engineer training — none of which appear in a consumer design.',
      },
    ],
    engineeringExplanation:
      'Most students read only the word “Higher”. The viva mark is for the service obligation, which is a design and commercial commitment, not a number.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'What does that force in the hardware?',
        expected:
          'Accessible modules, identified test points, self-test or fault indication, standard connectors, and a documented spare-parts list.',
      },
      {
        teacher: 'Why does the Military column not say the same thing?',
        expected:
          'Because service may not be available or acceptable at all; the requirement is met by durability and by “Lowest” maintenance with modular replacement instead.',
      },
    ],
  },
  {
    id: `${T}-v5`,
    topicId: T,
    type: 'viva',
    level: 4,
    marks: 4,
    skill: 'viva',
    action: 'Debug',
    prompt:
      'A student proposes: “Use a Consumer product and add a small heater inside the enclosure so it never goes below 0 °C.” Evaluate this proposal the way an engineering teacher would.',
    hint: 'It can work. Name what it costs and what new failure it creates.',
    solution: [
      {
        label: 'Evaluation',
        content:
          'It is a legitimate technique — engineer the environment instead of the product — but it is not free. The heater adds a component that can itself fail, needs control and power, raises the internal temperature (which eats the hot-end margin), and creates a new single point of failure. If the consequence of heater failure is the same as the consequence of product failure, the heater has not improved the system reliability unless it is itself redundant and monitored.',
      },
      {
        label: 'When it is the right answer',
        content:
          'When the product class cannot be changed (already purchased, or the industry/military version is unaffordable) and the environment is the only problem.',
      },
      {
        label: 'When it is the wrong answer',
        content:
          'When it is used to avoid admitting that the wrong class was specified. The correct action then is to re-specify the product.',
      },
    ],
    engineeringExplanation:
      'Viva questions like this test whether the student sees second-order effects. The strong answer names the new failure mode the fix introduces — that is what an experienced engineer listens for.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'What is the reliability of the heater plus the product compared with the product alone?',
        expected:
          'It is lower, because the heater is in series with the product in a reliability sense — developed formally in Topic 2.',
      },
      {
        teacher: 'How would you make the heater solution acceptable?',
        expected:
          'Monitor the internal temperature, alarm on heater failure, and either use a thermostatic controller with a redundant element or accept a defined safe shutdown when the heater fails.',
      },
    ],
  },

  /* ---------------- MCQ (10) ---------------- */
  {
    id: `${T}-q1`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The operating temperature range of an Industry Product, as given in the supplied material, is:',
    options: [
      { id: 'a', text: '0 to 70 °C' },
      { id: 'b', text: '−25 to 85 °C' },
      { id: 'c', text: '−55 to 125 °C' },
      { id: 'd', text: '−40 to 85 °C' },
    ],
    answerId: 'b',
    hint: 'It is the middle column, and it is the only column whose lower limit is negative but above −50 °C.',
    solution: [
      { label: 'Answer', content: '(b) −25 to 85 °C' },
      { label: 'Why not the others', content: '(a) is Consumer. (c) is Military. (d) is a common industry marketing range, not the supplied value.' },
    ],
    engineeringExplanation:
      'Memorise the three ranges as a set: 0/70, −25/85, −55/125. In the exam, writing the wrong one into a comparison table costs marks in three places at once.',
    provenance: 'source',
  },
  {
    id: `${T}-q2`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'Which class is described in the supplied table as “Highly reliable and durable”?',
    options: [
      { id: 'a', text: 'Consumer Product' },
      { id: 'b', text: 'Industry Product' },
      { id: 'c', text: 'Military Product' },
      { id: 'd', text: 'Both Consumer and Industry Product' },
    ],
    answerId: 'c',
    hint: 'It is the class whose life is also “Best”.',
    solution: [
      { label: 'Answer', content: '(c) Military Product' },
      { label: 'Cross-check', content: 'The same column also carries Life = “Best”, Maintenance = “Lowest” and Cost = “Very High”.' },
    ],
    engineeringExplanation:
      'Use column consistency as a memory check: if one entry you remember does not sit with the others in the same column, you have remembered it wrong.',
    provenance: 'source',
  },
  {
    id: `${T}-q3`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The Aesthetics entry for a Consumer Product is:',
    options: [
      { id: 'a', text: 'Attractive' },
      { id: 'b', text: 'Not important' },
      { id: 'c', text: 'Functional only' },
      { id: 'd', text: 'Same as Industry Product' },
    ],
    answerId: 'a',
    hint: 'This is the only parameter where the consumer column is the demanding one.',
    solution: [{ label: 'Answer', content: '(a) Attractive' }],
    engineeringExplanation:
      'Aesthetics is the clearest commercial-vs-engineering parameter in the table: it is driven by the buyer, not by the physics.',
    provenance: 'source',
  },
  {
    id: `${T}-q4`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The Maintenance entry for a Military Product is:',
    options: [
      { id: 'a', text: 'Minimum' },
      { id: 'b', text: 'Moderate' },
      { id: 'c', text: 'Lowest' },
      { id: 'd', text: 'Not specified' },
    ],
    answerId: 'c',
    hint: '“Minimum” appears twice in the row — find the odd one out.',
    solution: [
      { label: 'Answer', content: '(c) Lowest' },
      { label: 'Watch out', content: 'Consumer and Industry both read “Minimum”. Only Military reads “Lowest”.' },
    ],
    engineeringExplanation:
      'Distractors in this topic are built from the row, not from outside it. Read the whole row before answering.',
    provenance: 'source',
  },
  {
    id: `${T}-q5`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The supplied Cost entry “Development cost higher” belongs to:',
    options: [
      { id: 'a', text: 'Consumer Product' },
      { id: 'b', text: 'Industry Product' },
      { id: 'c', text: 'Military Product' },
      { id: 'd', text: 'Both Industry and Military Product' },
    ],
    answerId: 'b',
    hint: 'It is the only entry in the row that names a specific kind of cost.',
    solution: [
      { label: 'Answer', content: '(b) Industry Product' },
      { label: 'Note', content: 'Military reads simply “Very High”. The industry entry distinguishes development cost from unit cost.' },
    ],
    engineeringExplanation:
      'The phrase matters in design reviews: it is the justification for spending engineering effort to protect the unit cost of a batch.',
    provenance: 'source',
  },
  {
    id: `${T}-q6`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'A product whose Life is “Moderate” in the supplied table is a:',
    options: [
      { id: 'a', text: 'Consumer Product' },
      { id: 'b', text: 'Industry Product' },
      { id: 'c', text: 'Military Product' },
      { id: 'd', text: 'Cannot be determined' },
    ],
    answerId: 'a',
    hint: 'The life row ascends: Moderate → Better → Best.',
    solution: [{ label: 'Answer', content: '(a) Consumer Product' }],
    engineeringExplanation:
      'The Life row is monotonic across the columns, so it is the easiest row to reconstruct from memory in the exam.',
    provenance: 'source',
  },
  {
    id: `${T}-q7`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'How many comparison parameters are given in the supplied classification table?',
    options: [
      { id: 'a', text: 'Five' },
      { id: 'b', text: 'Six' },
      { id: 'c', text: 'Seven' },
      { id: 'd', text: 'Eight' },
    ],
    answerId: 'c',
    hint: 'Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance, Operating temp. range.',
    solution: [{ label: 'Answer', content: '(c) Seven' }],
    engineeringExplanation:
      'If you can recite all seven in order, you can rebuild the entire table under exam pressure instead of memorising 21 cells.',
    provenance: 'source',
  },
  {
    id: `${T}-q8`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'According to the supplied material, ergonomics is:',
    options: [
      { id: 'a', text: 'The study of product appearance' },
      { id: 'b', text: 'Efficient and effective interconnect between man, machine and the environment around it' },
      { id: 'c', text: 'The reduction of manufacturing cost' },
      { id: 'd', text: 'The probability that a product performs its function' },
    ],
    answerId: 'b',
    hint: 'The definition names three things that are being interconnected.',
    solution: [
      { label: 'Answer', content: '(b)' },
      { label: 'Note', content: '(d) is the definition of reliability, which appears in the same source and belongs to Topic 2.' },
    ],
    engineeringExplanation:
      'Definitions from the same source page are often used as each other’s distractors. Read the question twice before answering.',
    provenance: 'source',
  },
  {
    id: `${T}-q9`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'analysis',
    action: 'Select',
    prompt: 'Which two classes have identical entries for BOTH Ergonomics and Aesthetics?',
    options: [
      { id: 'a', text: 'Consumer and Industry' },
      { id: 'b', text: 'Consumer and Military' },
      { id: 'c', text: 'Industry and Military' },
      { id: 'd', text: 'All three are identical' },
    ],
    answerId: 'c',
    hint: 'Both rows reduce to “Operator safety is important” and “Look of product is not important”.',
    solution: [
      { label: 'Answer', content: '(c) Industry and Military' },
      { label: 'Consequence', content: 'Neither appearance nor comfort distinguishes the two expensive classes.' },
    ],
    engineeringExplanation:
      'This is the observation that moves a design review away from styling and toward the parameters that genuinely differ.',
    provenance: 'source',
  },
  {
    id: `${T}-q10`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'numerical',
    action: 'Determine',
    prompt:
      'An installation requires operation from −40 °C to +60 °C. Using the supplied table, the cheapest class that covers this window is:',
    options: [
      { id: 'a', text: 'Consumer Product (0 to 70 °C)' },
      { id: 'b', text: 'Industry Product (−25 to 85 °C)' },
      { id: 'c', text: 'Military Product (−55 to 125 °C)' },
      { id: 'd', text: 'No class covers this window' },
    ],
    answerId: 'c',
    hint: 'Check the cold end first: which lower limits are below −40 °C?',
    solution: [
      {
        label: 'Calculation',
        content:
          'Consumer lower limit 0 °C > −40 °C → fails. Industry lower limit −25 °C > −40 °C → fails. Military lower limit −55 °C ≤ −40 °C and upper limit 125 °C ≥ 60 °C → passes.',
      },
      { label: 'Answer with unit', content: '(c) Military Product — the required window is −40 °C to +60 °C.' },
    ],
    engineeringExplanation:
      'Cheapest that covers the window — not “the middle one”. Check both limits every time; this question is designed to be answered wrong by students who only look at the hot end.',
    provenance: 'source',
  },

  /* ---------------- EXAM / LONG ANSWER (5) ---------------- */
  {
    id: `${T}-e1`,
    topicId: T,
    type: 'exam',
    level: 2,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Classify electronic products. Draw the functional block diagram of an electronic system and compare Consumer, Industry and Military products on the parameters given in the supplied material. (8 marks)',
    hint:
      'Structure: definition (1–2) → labelled block diagram (2) → comparison table (3) → explanation of at least three parameters (1½) → justification (½).',
    solution: [
      {
        label: '1. Introduction',
        content:
          'Electronic products are classified by application into Consumer Product, Industry Product and Military Product, and compared on seven parameters: Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance and Operating temp. range.',
      },
      {
        label: '2. Block diagram',
        content:
          'Input/Sensor → Signal Conditioning → Processing/Control → Output/Actuator, with Power Supply feeding the conditioning and processing blocks. Arrows show signal direction. (Engineering Insight reconstruction.)',
      },
      {
        label: '3. Comparison table',
        content:
          'Cost: Should be affordable / Development cost higher / Very High. Reliability: Good / Higher: Service @ customer sight / Highly reliable and durable. Ergonomics: Comfort and safety is important / Operator safety is important / Operator safety is important. Aesthetics: Attractive / Look of product is not important / Look of product is not important. Life: Moderate / Better / Best. Maintenance: Minimum / Minimum / Lowest. Operating temp. range: 0 to 70 °C / −25 to 85 °C / −55 to 125 °C.',
      },
      {
        label: '4. Explanation',
        content:
          'Cost rises because wider temperature range, longer life and higher reliability need higher-grade parts, more design effort and more testing; the industry entry names development cost rather than unit cost. Reliability rises with the cost of failure, and the industry entry additionally creates a service obligation at the customer site. Ergonomics is the interconnection of man, machine and environment; comfort appears only in the consumer column because there the user is also the buyer. Life and maintenance move together: the longer the required service life, the less attention the product may demand.',
      },
      {
        label: '5. Justification',
        content:
          'The same function needs three classes because the function is not the requirement — the environment, the user, the cost of failure and the service life are. Select the cheapest class whose complete package satisfies every stated requirement.',
      },
    ],
    marking: [
      '1 mark — three classes named',
      '2 marks — labelled block diagram with signal direction',
      '3 marks — comparison table with seven parameters and correct entries',
      '1½ marks — engineering explanation of at least three parameters',
      '½ mark — justification / conclusion',
    ],
    engineeringExplanation:
      'The three marks for the table are the fastest marks in this paper. Write the seven row headings first, then fill the columns — that way a memory slip costs one cell, not the whole table.',
    provenance: 'source',
  },
  {
    id: `${T}-e2`,
    topicId: T,
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'analysis',
    action: 'Justify',
    prompt:
      '“A consumer product cannot be used in an industrial environment.” Discuss this statement with reference to the supplied classification table. (8 marks)',
    hint: 'Do not agree blindly. Identify which parameters genuinely block the use, and the conditions under which the statement is false.',
    solution: [
      {
        label: '1. Position',
        content:
          'The statement is a useful rule of thumb but is not unconditionally true. It is true when the industrial environment or the industrial failure cost exceeds the consumer package; it is false when the specific installation stays inside the consumer package.',
      },
      {
        label: '2. Parameters that genuinely block it',
        content:
          'Operating temp. range: consumer covers only 0 to 70 °C, so any installation below 0 °C or above 70 °C is outside the specified behaviour. Reliability: consumer is “Good”, with no service obligation, whereas industry requires “Higher: Service @ customer sight”. Life: “Moderate” against an industrial “Better”. Maintenance: “Minimum” in both, but an industrial product must be diagnosable on site.',
      },
      {
        label: '3. When it is false',
        content:
          'A consumer-grade instrument used inside an air-conditioned control room at 22 °C, in a non-critical logging role, satisfies every consumer entry. The requirement — not the label on the catalogue — decides.',
      },
      {
        label: '4. The real engineering point',
        content:
          'Below the stated temperature limit the behaviour is undefined, not degraded. That is why temperature is checked first: it is the only parameter a single measurement can falsify.',
      },
      {
        label: '5. Conclusion',
        content:
          'Classify by requirement, not by sales channel. Where a consumer product must be used in a harsher environment, engineer the environment (heated/insulated enclosure) and state the new failure mode that the fix introduces.',
      },
    ],
    marking: [
      '2 marks — identifies the qualifying conditions rather than a flat yes/no',
      '3 marks — cites the specific parameters with supplied values',
      '2 marks — explains that out-of-range behaviour is undefined',
      '1 mark — conclusion / mitigation',
    ],
    engineeringExplanation:
      'Examiners reward the student who qualifies the statement. A flat “yes, because industrial is better” answer earns about three of eight; the conditional answer earns full marks.',
    provenance: 'source',
  },
  {
    id: `${T}-e3`,
    topicId: T,
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Explain, with a numerical example, how the operating temperature range and the maintenance requirement together decide the class of an electronic product. (8 marks)',
    hint: 'Build a small numeric example, compute both margins, then bring maintenance in as the tie-breaker.',
    solution: [
      {
        label: '1. Setup',
        content:
          'Take a required window of −22 °C to +35 °C, measured at the mounting point.',
      },
      {
        label: '2. Temperature test',
        content:
          'Consumer 0 to 70 °C: low-side margin = −22 °C − 0 °C = −22 °C → rejected. Industry −25 to 85 °C: −22 °C − (−25 °C) = +3 °C, and 85 °C − 35 °C = +50 °C → accepted. Military −55 to 125 °C: +33 °C and +90 °C → accepted but over-specified.',
      },
      {
        label: '3. Maintenance tie-breaker',
        content:
          'If the product must remain in service for ten years with no maintenance window, maintenance must be “Minimum” (Industry) or “Lowest” (Military). Industry is acceptable if a short swap can be scheduled; Military is required only if no access is possible at all.',
      },
      {
        label: '4. Why both parameters are needed',
        content:
          'Temperature alone would accept both Industry and Military. Maintenance alone cannot reject anything, because it is qualitative. Together they narrow the choice to one class.',
      },
      {
        label: '5. Conclusion',
        content:
          'Numeric parameters falsify; qualitative parameters choose between what survives falsification. Use them in that order.',
      },
    ],
    marking: [
      '3 marks — numerical margin calculation with units and correct signs',
      '2 marks — maintenance argument tied to the service-life requirement',
      '2 marks — explanation of the interaction between the two parameters',
      '1 mark — conclusion',
    ],
    engineeringExplanation:
      'The sign convention must be stated in the answer. Write “margin_low = T_min(req) − T_min(class); a class qualifies when the result is ≥ 0 °C” and the examiner can follow every line.',
    provenance: 'source',
  },
  {
    id: `${T}-e4`,
    topicId: T,
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Explain the role of ergonomics in electronic product design, and show how the ergonomics requirement differs across the three supplied product classes. (8 marks)',
    hint: 'Definition first, then the three column entries, then translate each into a measurable design decision.',
    solution: [
      {
        label: '1. Definition (source)',
        content:
          '“Ergonomics — Efficient and effective interconnect between man machine and environment around it.” Ergonomic design should reduce user fatigue and stress, and improve safety, comfort, job satisfaction and quality of life.',
      },
      {
        label: '2. Consumer column',
        content: '“Comfort and safety is important.” The user is also the buyer, so comfort is a commercial requirement. Design: pleasant feel, low acoustic noise, intuitive layout, attractive appearance.',
      },
      {
        label: '3. Industry column',
        content: '“Operator safety is important.” The operator is doing a job, often with PPE, often under time pressure. Design: glove-operable controls, sunlight-readable display, unambiguous alarm priority, guards against unintended action.',
      },
      {
        label: '4. Military column',
        content:
          'Identical wording to Industry. The emphasis falls even harder on error-proofing under stress and on operation with gloves, in the dark, and in a moving vehicle or aircraft.',
      },
      {
        label: '5. Engineering translation',
        content:
          'Ergonomics becomes a requirement only when it is written as a number: minimum key pitch, minimum character height, viewing angle, contrast ratio, operating force, reach envelope. Test with the real operator wearing the real gloves under the real lighting.',
      },
    ],
    marking: [
      '2 marks — verbatim definition and the stated outcomes',
      '3 marks — correct distinguishing of the consumer column from the other two',
      '2 marks — concrete design decisions per column',
      '1 mark — measurability / verification statement',
    ],
    engineeringExplanation:
      '“Ergonomics means comfort” is the standard wrong answer. In the supplied table comfort appears in exactly one of three columns.',
    provenance: 'source',
  },
  {
    id: `${T}-e5`,
    topicId: T,
    type: 'exam',
    level: 4,
    marks: 8,
    skill: 'design',
    action: 'Design',
    prompt:
      'An outdoor handheld ticket validator must operate from −10 °C to +52 °C, is used by operators wearing gloves, must last 8 years, is replaced rather than repaired, and must be bought in a batch of 200 on a tight unit-cost budget. Select the product class and write the complete seven-parameter specification, justifying each line. (8 marks)',
    hint: 'Screen with the temperature window, then write all seven lines from the chosen column, then justify the cost line.',
    solution: [
      { label: '1. Requirement', content: 'Outdoor handheld validator; window −10 °C to +52 °C; gloves; 8-year life; swap-not-repair; 200 units; tight unit cost.' },
      {
        label: '2. Screening',
        content:
          'Low-side margin for Consumer = −10 °C − 0 °C = −10 °C → rejected. Industry = −10 °C − (−25 °C) = +15 °C → accepted. High-side margins: Consumer 70 − 52 = +18 °C, Industry 85 − 52 = +33 °C.',
      },
      {
        label: '3. Selection',
        content: 'Industry Product. Military also covers the window but its Cost entry is “Very High”, which the unit-cost ceiling rules out.',
      },
      {
        label: '4. Seven-parameter specification',
        content:
          'Cost — Development cost higher, unit cost controlled. Reliability — Higher, with service at customer site. Ergonomics — Operator safety is important (glove-operable keys, sunlight-readable display). Aesthetics — Look of product is not important. Life — Better (8 years). Maintenance — Minimum (tool-free module swap from a spares pool, no field repair). Operating temp. range — −25 to 85 °C.',
      },
      {
        label: '5. Failure modes to address',
        content: 'Keypad/water ingress; display unreadable in sunlight; cold-start battery voltage drop; connector corrosion; keypad stiffening at low temperature.',
      },
      {
        label: '6. Alternative',
        content:
          'If the ambient later falls below −25 °C, do not silently re-specify to Military — either use a heated holster to keep the unit inside its window, or re-open the commercial discussion, because the unit-cost ceiling will be breached.',
      },
    ],
    marking: [
      '2 marks — temperature screening with margins and units',
      '1 mark — class selection with the cost justification',
      '3 marks — all seven parameter lines from the correct column',
      '1 mark — failure modes',
      '1 mark — alternative / trade-off statement',
    ],
    engineeringExplanation:
      'Note the deliberate trap: the required span (62 °C) is narrower than the consumer span (70 °C), so a student who compares spans instead of windows picks the wrong class. Always compare the window position.',
    provenance: 'insight',
  },
]

export const TOPIC1_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'System Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const

export type Topic1SectionId = (typeof TOPIC1_SECTIONS)[number]['id']
