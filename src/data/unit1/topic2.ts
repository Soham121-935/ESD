import type {
  DebugFault,
  DesignChallengeSpec,
  MatrixSpec,
  ModeContent,
  NumericalProblem,
  Question,
  TopicMeta,
} from '../../types'
import type { BathtubRegion } from '../../components/BathtubCurve'

export const TOPIC2: TopicMeta = {
  id: 'u1t2',
  index: 2,
  title: 'System Reliability',
  shortTitle: 'Reliability',
  hook: 'Nothing works forever. Reliability is the number that says how long “forever” is.',
  status: 'live',
}

export const SOURCE_NOTE2 = {
  primary:
    'Supplied course material: “Classification & reliability” (ARN), pp. 1–5 — reliability definition, factors affecting reliability of equipment, exponential law R = e^(−λt) with m = 1/λ and the 37% anchor, failure/defect types table, factors responsible for failure, maintainability, bathtub curve, early-failure reasons, random failure and wear-out with the two stress-severity graphs.',
  coverage:
    'Series-system reliability, half-life, redundancy and every constructed numerical value are labelled Engineering Insight. The law itself, the m = 1/λ relation, the 37% result and all cause lists are source-derived.',
}

/* ------------------------------------------------------------------ */
/* Source tables                                                       */
/* ------------------------------------------------------------------ */

export const FAILURE_TYPE_MATRIX: MatrixSpec = {
  id: 'u1t2-failure-types',
  title: 'Failure or Defect — types of failure and the phase at which they occur',
  provenance: 'source',
  columns: ['Type', 'Phase at which failure occurs'],
  rows: [
    { id: 'initial', parameter: 'Initial', cells: { Phase: 'During initial phase' }, provenance: 'source' },
    { id: 'early', parameter: 'Early', cells: { Phase: 'Immediately after short time of installation' }, provenance: 'source' },
    { id: 'random', parameter: 'Random', cells: { Phase: 'During arbitrary instance' }, provenance: 'source' },
    { id: 'catastrophic', parameter: 'Catastrophic', cells: { Phase: 'Major failure for long time' }, provenance: 'source' },
    { id: 'wearout', parameter: 'Wear out', cells: { Phase: 'After long usage of equipment' }, provenance: 'source' },
  ],
  interpretation:
    'The supplied table names five failure types by the phase in which they occur. Note that only “Random — during arbitrary instance” is a phase with a constant failure rate; the others are tied to installation, to the beginning of life or to long usage. That is why a single constant-λ model cannot describe the whole life of a product.',
}

/** Source columns are keyed by the header text above. */
FAILURE_TYPE_MATRIX.rows.forEach((r) => {
  r.cells = { 'Phase at which failure occurs': r.cells.Phase ?? '' }
  delete (r.cells as Record<string, string>).Phase
})

export const FAILURE_FACTORS: string[] = [
  'Incorrect design',
  'Wrong manufacturing process',
  'Complexity of equipment',
  'Poor quality control',
  'Improper storage or transportation',
  'Misuse / mishandling of equipment',
  'Human error',
]

export const EQUIPMENT_RELIABILITY_FACTORS: string[] = [
  'Design of equipment',
  'Quality of Manufacturing',
  'Storage of product',
  'Environmental conditions',
]

/* ------------------------------------------------------------------ */
/* Bathtub regions                                                     */
/* ------------------------------------------------------------------ */

export const BATHTUB_REGIONS: BathtubRegion[] = [
  {
    id: 'infant',
    name: 'Region 1 — Infant mortality (early failure / burn-in period)',
    shape:
      'Failure rate is high at the start and falls with time as the weak members of the population are removed.',
    causes: [
      'Defect or errors during manufacturing',
      'Poor quality raw material',
      'Wrong assembly',
      'Improper insulation',
      'Poor fitting',
    ],
    componentFix: [
      'Burn-in / run-in screening at the supplier so weak units fail before delivery, not after installation',
      'Incoming quality control and lot acceptance testing',
      'Approved raw material and component sources',
      'Assembly and insulation work instructions with verification',
    ],
    systemFix: [
      'Design for assembly so that wrong assembly is physically difficult',
      'Supplier qualification and lot traceability',
      'Commissioning test that exercises the unit before hand-over',
      'Design the product so a failed unit can be swapped quickly — the failure is removed by replacement, not by repair',
    ],
    provenance: 'source',
    sourceRef:
      '“Early failure reasons … Early failure period is also called as burn-in-period.” — Classification & reliability, p. 4',
  },
  {
    id: 'useful',
    name: 'Region 2 — Useful life (random failure period)',
    shape:
      'Failure rate is approximately constant. This is the only region in which the exponential law R(t) = e^(−λt) is the correct model.',
    causes: [
      'Failure rate is constant',
      'Mishandling damages components',
      'Exceeding operating condition damages components',
    ],
    componentFix: [
      'Derate components — operate below maximum rated voltage, current, power and temperature',
      'Protect against the electrical environment: overvoltage, reverse polarity, surge, ESD',
      'Keep the unit inside its specified operating temperature range (Topic 1)',
      'Handle and store to the manufacturer’s instructions',
    ],
    systemFix: [
      'Design margin and worst-case analysis rather than typical-value design',
      'Enclosure, thermal and environmental design that keeps the internal conditions inside the ratings',
      'Operator training and clear labelling to prevent mishandling',
      'Monitoring and alarms that catch an excursion before it becomes a failure',
    ],
    provenance: 'source',
    sourceRef:
      '“Random failure — Failure rate is constant. Mishandling / Exceeding operating condition damage components.” — p. 4',
  },
  {
    id: 'wearout',
    name: 'Region 3 — Wear-out',
    shape:
      'Failure rate rises with time as components age. The supplied material notes that the curve is obtained by running components at maximum rated condition and plotting failure rate against time, for two different stress severities.',
    causes: [
      'Components kept in operation at maximum rated condition',
      'Ageing mechanisms accumulate with operating time',
      'Higher stress severity moves the wear-out knee earlier (Graph A)',
    ],
    componentFix: [
      'Reduce stress severity — operate below maximum rated condition',
      'Select longer-life parts for the wear-out mechanisms that dominate (electrolytic capacitors, batteries, contacts, opto-isolators, mechanical parts)',
      'Scheduled preventive replacement before the wear-out knee',
      'Thermal management: every 10 °C reduction in operating temperature buys life',
    ],
    systemFix: [
      'Planned replacement interval derived from the rising part of the curve',
      'Condition monitoring so replacement is driven by measured condition, not by a fixed guess',
      'Design so the wearing parts are modules that can be replaced without scrapping the product',
      'Spares provisioning matched to the wear-out forecast',
    ],
    provenance: 'source',
    sourceRef:
      '“Wear out failure … Graph A = High stress severity, Graph B = Low stress severity.” — p. 5',
  },
]

/* ------------------------------------------------------------------ */
/* Mode content                                                        */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'We start with a plant that has 200 instruments installed and one question from the maintenance manager: “How many will still be working next year?”',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The question nobody can answer without a number',
      provenance: 'insight',
      body: [
        'A water-treatment plant installs 200 electronic flow transmitters. The supplier says the product is “very reliable”. The maintenance manager needs to budget spares for next year.',
        '“Very reliable” is not a number. Budgeting needs a number. Reliability engineering exists to turn that adjective into a probability.',
      ],
      bullets: [
        'What is required? The expected number of units still working after a stated period.',
        'What is given? A population of 200 and a stated period of 12 months.',
        'What is missing? A failure rate — and a model that converts it into a probability.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Reliability',
      provenance: 'source',
      body: [
        'The supplied material gives reliability in two forms, and both are worth memorising because exam answers quote them.',
      ],
      quote:
        '“Reliability Engineering — Ability of product to perform intended function under stated condition, for stated period of time. It is probability the unit perform intended functionality for stated period of time for stated operating conditions.”',
      sourceRef: 'Classification & reliability (ARN), p. 1',
      bullets: [
        'Three qualifiers carry the meaning: intended function, stated condition, stated period.',
        'Because it is a probability, reliability is always less than 100% — the source makes exactly this point.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Failure and defect',
      provenance: 'source',
      body: [
        'A component or system may fail after some time, and therefore reliability is always less than 100%. The supplied material then lists failure types by the phase in which they occur.',
      ],
      bullets: [
        'Initial — during initial phase',
        'Early — immediately after short time of installation',
        'Random — during arbitrary instance',
        'Catastrophic — major failure for long time',
        'Wear out — after long usage of equipment',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why a probability and not a guarantee?',
      provenance: 'insight',
      body: [
        'Because two identical units in the same environment do not fail at the same instant. Manufacturing variation, assembly variation and environment variation spread the failure times out.',
        'A single number cannot say “this unit fails at month 41”. A probability can say “about 63% of the population is expected to be running at month 41”. The second statement is the one a maintenance budget can use.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — The exponential law of reliability',
      provenance: 'source',
      body: [
        'The supplied material states the exponential law of reliability directly.',
      ],
      quote:
        '“R = e^(−λt). R = reliability of Equipment. λ = system failure rate (Failure per month). If m = 1/λ then R = e^(−t/m) … If t = m then R = e^(−1) = 0.37. I.e. if t = m then probability of successful operation reduces to 37%.”',
      sourceRef: 'Classification & reliability (ARN), p. 3',
      bullets: [
        'λ is the system failure rate, stated as failures per month in the source.',
        'm = 1/λ is the mean time between failures, in the same time unit as λ.',
        'The exponent −λt must be dimensionless — always check that λ and t use the same time unit.',
        'At t = m the reliability is e^(−1) ≈ 0.37: only about 37% of the population is expected to survive one MTBF.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Reliability against time',
      provenance: 'insight',
      body: [
        'Move λ and t and watch R fall. The amber marker sits at t = m, where the source tells us R = 37%.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Back to the 200 transmitters',
      provenance: 'insight',
      body: [
        'Take λ = 0.01 failures per month as the stated failure rate, and a period of 12 months.',
      ],
      bullets: [
        'Step 1 — Check the units: λ is per month and t is in months, so λt is dimensionless. λt = 0.01 × 12 = 0.12.',
        'Step 2 — Apply the law: R(12) = e^(−0.12) = 0.887, i.e. 88.7%.',
        'Step 3 — Convert to a population: expected survivors = 200 × 0.887 = 177.4, so about 177 units running and about 23 failed.',
        'Step 4 — Find the MTBF: m = 1/λ = 1/0.01 = 100 months. At t = 100 months, R = e^(−1) = 0.37 → about 74 of the 200 still running.',
        'Step 5 — Budget: roughly 23 spares in year one, and note that this number is an expectation, not a guarantee.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: [
        'Change one thing at a time and state the direction before you calculate it.',
      ],
      bullets: [
        'What if the period doubles to 24 months? R = e^(−0.24) = 0.787 — it does not halve, it falls to R(12)². R(2t) = R(t)².',
        'What if λ is halved to 0.005? R(12) = e^(−0.06) = 0.942. Halving λ is worth more than halving t.',
        'What if the plant wants at least 95% at 12 months? The allowable λ is −ln(0.95)/12 = 8.5 × 10⁻⁴ per month — that is a procurement specification, not a hope.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — What affects reliability of equipment',
      provenance: 'source',
      body: [
        'The supplied material lists four things that decide the reliability of equipment, and a further seven factors responsible for failure. Both lists are worth learning verbatim because they are short and they are examined.',
      ],
      bullets: [
        'Reliability of equipment: Design of equipment · Quality of Manufacturing · Storage of product · Environmental conditions.',
        'Factors responsible for failure: Incorrect design · Wrong manufacturing process · Complexity of equipment · Poor quality control · Improper storage or transportation · Misuse/mishandling of equipment · Human error.',
      ],
      sourceRef: 'Classification & reliability (ARN), pp. 2–3',
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'You know the law. Now the engineering question: when is the law actually valid, and what do you do in the regions where it is not?',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — Two predictions, one of them wrong',
      provenance: 'insight',
      body: [
        'A plant has run 300 drives for five years. In the first six months the failure rate looked like λ = 0.004 per month. The maintenance engineer uses R = e^(−λt) with that λ to predict year five.',
        'The prediction says 79% should still be running. The plant count says 61% are running, and the gap is widening every month.',
        'The arithmetic is correct. The model is being used outside the region where it is valid.',
      ],
      bullets: [
        'Required: explain the gap and choose the correct action.',
        'Given: a λ measured early in life, a five-year operating window, and a rising observed failure rate.',
        'Which assumption is violated? The constant-failure-rate assumption.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — The bathtub curve',
      provenance: 'source',
      body: [
        'The supplied material groups failures into three modes according to their nature, and the curve of failure rate against time has the shape of a bathtub.',
      ],
      bullets: [
        'Region 1 — Infant mortality / early failure: failure rate falls with time. The source calls this the burn-in period.',
        'Region 2 — Useful life / random failure: failure rate is constant. Only here is R(t) = e^(−λt) valid.',
        'Region 3 — Wear-out: failure rate rises with time, and the source plots two curves for high and low stress severity.',
      ],
      sourceRef: 'Classification & reliability (ARN), pp. 4–5',
    },
    {
      kind: 'why',
      title: 'WHY? — Why the exponential law needs a constant failure rate',
      provenance: 'insight',
      body: [
        'R(t) = e^(−λt) comes from integrating a constant hazard rate λ. If λ changes with time the correct form is R(t) = exp(−∫λ(τ)dτ), which only collapses to e^(−λt) when λ is constant.',
        'That is the whole reason the bathtub curve matters to this calculation: it tells you over which part of the life your λ is allowed to be a single number.',
      ],
      bullets: [
        'During infant mortality λ(t) is falling — a single constant λ over-estimates early failures and under-estimates later ones.',
        'During wear-out λ(t) is rising — a single constant λ under-estimates failures badly, which is exactly the plant’s problem above.',
        'Engineering rule: measure λ inside the useful-life region, and never extrapolate it across the wear-out knee.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Diagnose the region from field data',
      provenance: 'insight',
      body: [
        'Plot failures per month for the surviving population — not the raw count of failures. Raw counts fall simply because fewer units are left to fail; the failure rate is the honest quantity.',
      ],
      bullets: [
        'Step 1 — Compute failures per month divided by units still running at the start of that month.',
        'Step 2 — If the result falls with time → infant mortality. If flat → useful life. If rising → wear-out.',
        'Step 3 — Choose the action for that region: screening for region 1, derating and margin for region 2, condition-based replacement for region 3.',
        'Step 4 — Only after step 3 may you use λ in R = e^(−λt), and only for a horizon that stays inside region 2.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — The three regions and what to do in each',
      provenance: 'insight',
      body: [
        'Click each region. You get the source’s causes plus the improvement actions at component level and at product/system level. Toggle the stress-severity control to see the source’s Graph A and Graph B.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Quantifying the wrong prediction',
      provenance: 'insight',
      body: [
        'λ_early = 0.004 per month measured over months 1–6; horizon 60 months; population 300.',
      ],
      bullets: [
        'Step 1 — Model prediction: λt = 0.004 × 60 = 0.24, so R(60) = e^(−0.24) = 0.787 → 236 of 300 units.',
        'Step 2 — Observed: 61% of 300 = 183 units. Shortfall = 236 − 183 = 53 units.',
        'Step 3 — The implied average failure rate is −ln(0.61)/60 = 0.4943/60 = 8.24 × 10⁻³ per month, about twice the early-life value.',
        'Step 4 — Conclusion: λ has risen with time, so the population has entered wear-out. The fix is not a better λ — it is a replacement plan and a stress-severity reduction.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Sensitivity of the reliability decision',
      provenance: 'insight',
      body: [
        'Each of these is a question a teacher can ask in one breath. Answer with a direction and a number.',
      ],
      bullets: [
        'What if the mission time doubles? R(2t) = [R(t)]². At R = 0.9 the answer is 0.81 — you lose more than 9%.',
        'What if λ is reduced by a factor of 4? R(12) rises from e^(−0.12) = 0.887 to e^(−0.03) = 0.970. Big win, and it usually costs money.',
        'What if the operating temperature is raised and stress severity increases? The wear-out knee moves left: the useful-life region shortens, so the window in which the exponential law is valid shrinks.',
        'What if you add redundancy (Engineering Insight)? Two independent units in parallel give R = 1 − (1 − R₁)(1 − R₂), which for R = 0.9 each gives 0.99 — but you have doubled the hardware and added a switching failure mode.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Maintainability is a separate quantity',
      provenance: 'source',
      body: [
        'The supplied material defines maintainability and gives it its own probability expression. Do not confuse it with reliability: reliability is about not failing, maintainability is about being restored quickly when you do.',
      ],
      quote:
        '“Maintainability — It is probability that failed equipment is restored to meet designed specifications in known time called down time when maintenance performed under stated conditions … M(t) = Pr(T ≤ t), where T is the repair time.”',
      sourceRef: 'Classification & reliability (ARN), p. 4',
      bullets: [
        'Reliability R(t) — probability the unit is still performing at time t.',
        'Maintainability M(t) — probability the failed unit is restored within time t.',
        'Availability (Engineering Insight) combines both: a very reliable product that takes six weeks to repair may be less useful than a moderately reliable one repaired in an hour.',
      ],
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode answers this topic the way the assignment asks it: define the law, derive the anchor point, draw and explain the bathtub curve, then justify an improvement action.',
  blocks: [
    {
      kind: 'problem',
      title: 'EXAM QUESTION — 8 Marks',
      provenance: 'source',
      body: [
        'Q. What is reliability? Explain the exponential law of reliability. Which factors affect reliability of equipment? (8 marks)',
        'Also examined in this unit: “Discuss the causes of failures during the Infant Mortality, Useful Life, and Wear-out periods of the Bathtub Curve.”',
      ],
      sourceRef: 'TY ESD 2026 ISE1 — Unit 1, Q.1 and Q.2',
    },
    {
      kind: 'concept',
      title: 'Model answer — (1) Definition (2 marks)',
      provenance: 'source',
      body: [
        'Reliability is the ability of a product to perform its intended function under stated conditions for a stated period of time. It is the probability that the unit performs its intended functionality for the stated period of time under the stated operating conditions.',
        'Because a component or system may fail after some time, reliability is always less than 100%.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (2) Exponential law of reliability (3 marks)',
      provenance: 'source',
      body: [
        'State the law, define every symbol with its unit, then give the source’s anchor point.',
      ],
      quote:
        'R = e^(−λt), where R = reliability of equipment, λ = system failure rate (failure per month), t = operating time. If m = 1/λ then R = e^(−t/m). If t = m then R = e^(−1) = 0.37, i.e. at t = m the probability of successful operation reduces to 37%.',
      bullets: [
        'Write the units: λ in failures per month, t in months, so λt is dimensionless.',
        'Then write the interpretation: after one MTBF only about 37% of the population is expected to be running.',
        'One numerical substitution earns a mark — e.g. λ = 0.01/month and t = 100 months gives R = e^(−1) = 0.37.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Model answer — (3) Bathtub curve (2 marks)',
      provenance: 'source',
      body: [
        'Draw failure rate λ(t) on the vertical axis against operating time on the horizontal axis. The curve falls, is flat, then rises — the shape of a bathtub.',
        'Label three regions: infant mortality (decreasing), useful life (constant), wear-out (increasing). Mark the burn-in period on the first region.',
        'Exam tip: two marks are awarded for the labelled sketch. A neat, correctly labelled curve is faster and safer than two paragraphs of prose.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (4) Causes in each region (2 marks)',
      provenance: 'source',
      body: [
        'Infant mortality — causes per the supplied material: defect or errors during manufacturing, poor quality raw material, wrong assembly, improper insulation, poor fitting. This period is also called the burn-in period.',
        'Useful life — failure rate is constant; failures come from mishandling and from exceeding the operating conditions.',
        'Wear-out — components kept in operation at maximum rated condition; the failure-rate curve is plotted against time and can be plotted for two stress severities, Graph A (high stress severity) and Graph B (low stress severity).',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (5) Factors affecting reliability (1 mark)',
      provenance: 'source',
      body: [
        'Reliability of equipment depends on: design of equipment, quality of manufacturing, storage of product, and environmental conditions.',
        'And the factors responsible for failure are: incorrect design, wrong manufacturing process, complexity of equipment, poor quality control, improper storage or transportation, misuse/mishandling of equipment, and human error.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme',
      provenance: 'insight',
      body: [
        '2 marks — definition with the three qualifiers (intended function, stated condition, stated period).',
        '3 marks — exponential law with symbols and units, plus the m = 1/λ relation and the 37% result.',
        '2 marks — labelled bathtub curve with the three regions named.',
        '1 mark — causes in the regions, or the list of factors affecting reliability.',
      ],
      bullets: [
        'Common mistake 1: writing R = e^(−λt) without stating that λ is per unit time. Units lose a mark.',
        'Common mistake 2: forgetting the 37% anchor. It is the only numerical result the source guarantees, so it is the safest mark in the question.',
        'Common mistake 3: using the exponential law to describe infant mortality or wear-out without noting the constant-λ assumption.',
      ],
    },
  ],
}

export const TOPIC2_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* Numerical problems                                                  */
/* ------------------------------------------------------------------ */

export const RELIABILITY_PROBLEMS: NumericalProblem[] = [
  {
    id: 'u1t2-p1',
    title: 'Problem 1 — The source anchor: reliability after one MTBF',
    provenance: 'source',
    situation:
      'A batch of industrial transmitters has a stated failure rate λ = 0.01 failures per month. The maintenance team needs to know what fraction of the population survives for one mean time between failures, and how many units that means out of 200 installed.',
    given: [
      { symbol: 'λ', value: '0.01 per month' },
      { symbol: 'N', value: '200 units installed' },
      { symbol: 'Law (source)', value: 'R = e^(−λt), m = 1/λ, R = e^(−t/m)' },
    ],
    required: [
      'Mean time between failures m',
      'Reliability at t = m',
      'Expected number of survivors out of 200 at t = m',
      'Reliability at t = 2m',
    ],
    assumptions: [
      'The failure rate is constant — i.e. the population is inside the useful-life region of the bathtub curve.',
      'λ is in failures per month and t is in months, as stated in the supplied material.',
      'Values of λ and N are chosen for practice (Engineering Insight); the law, the m = 1/λ relation and the 37% result are source-derived.',
    ],
    steps: [
      {
        id: 'm',
        ask: 'Step 1 — What is the mean time between failures m? m = 1/λ.',
        concept:
          'The source defines m = 1/λ. Since λ is per month, m comes out in months — the reciprocal carries the unit with it.',
        equation: 'm = 1/λ',
        substitution: 'm = 1 / 0.01 per month = 100 months',
        entries: [{ id: 'm1', label: 'm', unit: 'months', answer: 100, tolerance: 1 }],
        hints: [
          'Take the reciprocal of λ. The unit of m is the reciprocal of the unit of λ.',
          '1 / 0.01 = 100. The unit is months because λ was per month.',
        ],
        interpretation:
          'One MTBF is 100 months, a little over eight years. This is the single number the exponential law is built around.',
        whatIf:
          'If λ rises to 0.02 per month, m halves to 50 months. Everything else in the problem scales with this one reciprocal.',
      },
      {
        id: 'rm',
        ask: 'Step 2 — What is the reliability at t = m? Use R = e^(−t/m) or R = e^(−λt).',
        concept:
          'This is the anchor point given explicitly in the supplied material: at t = m the reliability is e^(−1) = 0.37.',
        equation: 'R(t = m) = e^(−m/m) = e^(−1)',
        substitution:
          'R = e^(−1) = 0.3679 ≈ 0.37, i.e. about 37% — exactly the value stated in the source',
        entries: [{ id: 'rm1', label: 'R at t = m', unit: '(0–1)', answer: 0.37, tolerance: 0.01 }],
        hints: [
          'At t = m the exponent −λt becomes −λm, and λm = λ × (1/λ) = 1.',
          'The source states the answer directly: R = e^(−1) = 0.37. Enter 0.37.',
        ],
        interpretation:
          'After one MTBF only about 37% of the population is expected to still be running. This is why MTBF is not “the life of the product” — it is the time at which roughly two-thirds have already failed.',
        whatIf:
          'This number is independent of λ. Every constant-failure-rate population is at 37% after one MTBF; only the clock speed changes.',
      },
      {
        id: 'surv',
        ask: 'Step 3 — Out of 200 installed units, how many are expected to still be running at t = m?',
        concept:
          'Reliability is a probability; multiplying it by the population converts it into the number a maintenance budget actually needs.',
        equation: 'Expected survivors = N × R(t)',
        substitution:
          'Survivors = 200 × 0.3679 = 73.6 ≈ 74 units. Expected failures = 200 − 74 = 126 units.',
        entries: [
          { id: 's1', label: 'Expected survivors', unit: 'units', answer: 74, tolerance: 2 },
          { id: 's2', label: 'Expected failures', unit: 'units', answer: 126, tolerance: 2 },
        ],
        hints: [
          'Multiply the population by R, not by the failure probability.',
          'Survivors and failures must add up to 200 — use that as your check.',
        ],
        interpretation:
          'Roughly 74 running and 126 failed. An engineer who quotes “MTBF = 100 months” to a customer who hears “life = 100 months” has mis-sold the product by a factor of nearly three.',
        whatIf:
          'If the plant can only tolerate 50 failures, the allowed mission time is far shorter than m — solve −ln(150/200)/λ = 0.2877/0.01 = 28.8 months.',
      },
      {
        id: 'r2m',
        ask: 'Step 4 — What is the reliability at t = 2m = 200 months?',
        concept:
          'Because the exponent is linear in t, doubling the time squares the reliability: R(2t) = [R(t)]².',
        equation: 'R(2m) = e^(−2) = [e^(−1)]²',
        substitution: 'R = e^(−2) = 0.1353 ≈ 0.135, i.e. about 13.5%',
        entries: [{ id: 'r2', label: 'R at t = 2m', unit: '(0–1)', answer: 0.135, tolerance: 0.01 }],
        hints: [
          'Square the 0.3679 you found in step 2.',
          '0.3679² = 0.1353.',
        ],
        interpretation:
          'After two MTBFs only about 13.5% survive. Reliability decays geometrically, not linearly — the second MTBF costs far less additional reliability in absolute terms but the same factor of 0.37.',
        whatIf:
          'Each additional MTBF multiplies the surviving fraction by 0.37. After n MTBFs, R = 0.37ⁿ.',
      },
    ],
    verification:
      'Check 1: λm = 0.01 × 100 = 1, so the exponent is −1 and R = 0.3679 as the source states. Check 2: survivors + failures = 74 + 126 = 200 = N. Check 3: R(2m) = 0.1353 = (0.3679)², consistent with the exponential form.',
    interpretation:
      'The useful output of this problem is the habit, not the number: write the law, write the units, substitute, then translate the probability into a population count. MTBF is a time constant, not a warranty period.',
  },
  {
    id: 'u1t2-p2',
    title: 'Problem 2 — Reliability for a specified failure rate and time',
    provenance: 'insight',
    situation:
      'A controller board has a constant failure rate λ = 0.02 failures per month. The plant wants the reliability after 24 months of continuous operation and the expected number of failures in a population of 1000 boards.',
    given: [
      { symbol: 'λ', value: '0.02 per month' },
      { symbol: 't', value: '24 months' },
      { symbol: 'N', value: '1000 boards' },
    ],
    required: [
      'The exponent λt',
      'Reliability R(24)',
      'Unreliability F(24) = 1 − R',
      'Expected failures out of 1000',
    ],
    assumptions: [
      'Constant failure rate (useful-life region).',
      'λ and t in the same time unit (months).',
      'Engineering Insight: the numerical values are constructed for practice; the law is source-derived.',
    ],
    steps: [
      {
        id: 'exp',
        ask: 'Step 1 — Compute the exponent λt. It must be dimensionless.',
        concept:
          'λ is in failures per month and t is in months, so the product is a pure number. If the units did not cancel you would have made a unit error.',
        equation: 'λt = λ × t',
        substitution: 'λt = 0.02 per month × 24 months = 0.48 (dimensionless)',
        entries: [{ id: 'e1', label: 'λt', unit: '(dimensionless)', answer: 0.48, tolerance: 0.01 }],
        hints: [
          'Multiply the two given numbers.',
          '0.02 × 24 = 0.48.',
        ],
        interpretation:
          'The exponent is the expected number of failures per unit over the period. Here 0.48 is already large — nearly half a failure per unit on average.',
        whatIf:
          'If λ were quoted per year you would first convert: 0.02/month = 0.24/year, and t = 2 years, giving the same 0.48.',
      },
      {
        id: 'r',
        ask: 'Step 2 — Compute the reliability R(24) = e^(−λt).',
        concept: 'The exponential law of reliability, valid where the failure rate is constant.',
        equation: 'R(t) = e^(−λt)',
        substitution: 'R(24) = e^(−0.48) = 0.6188 ≈ 0.619, i.e. about 61.9%',
        entries: [{ id: 'r1', label: 'R(24 months)', unit: '(0–1)', answer: 0.619, tolerance: 0.01 }],
        hints: [
          'Evaluate e raised to the power −0.48.',
          'e^(−0.5) ≈ 0.607, so the answer should be slightly above that, around 0.619.',
        ],
        interpretation:
          'About 62% of the boards are expected to be running at 24 months. Note that λt = 0.48 is close to 0.5, which is why the answer is close to 60%.',
        whatIf:
          'Doubling the time to 48 months gives R = e^(−0.96) = 0.383 — not 0.619/2, but 0.619².',
      },
      {
        id: 'f',
        ask: 'Step 3 — Compute the unreliability F(24) = 1 − R(24), as a fraction.',
        concept:
          'Unreliability is the probability of failure by time t. Reliability and unreliability are complements, so they must add to 1.',
        equation: 'F(t) = 1 − R(t)',
        substitution: 'F(24) = 1 − 0.6188 = 0.3812 ≈ 0.381, i.e. about 38.1%',
        entries: [{ id: 'f1', label: 'F(24 months)', unit: '(0–1)', answer: 0.381, tolerance: 0.01 }],
        hints: ['Subtract R from 1.', 'Check that R + F = 1.000.'],
        interpretation:
          'About 38% of the population is expected to have failed by 24 months — this is the number that sizes the spares holding.',
        whatIf:
          'If the plant requires F ≤ 0.10 at 24 months, the allowed λ is −ln(0.90)/24 = 4.39 × 10⁻³ per month.',
      },
      {
        id: 'pop',
        ask: 'Step 4 — Out of 1000 boards, how many are expected to have failed by 24 months?',
        concept:
          'Expected number of failures = N × F(t). Round to a whole number and remember it is an expectation, not a certainty.',
        equation: 'Expected failures = N × F(t)',
        substitution: '1000 × 0.3812 = 381.2 ≈ 381 boards failed; about 619 still running',
        entries: [{ id: 'p1', label: 'Expected failures', unit: 'boards', answer: 381, tolerance: 4 }],
        hints: [
          'Multiply the population by the unreliability, not by the reliability.',
          '619 + 381 = 1000, which is your check.',
        ],
        interpretation:
          '381 spares over two years is a procurement decision, not a theoretical result. This is the sentence that turns a probability into a purchase order.',
        whatIf:
          'If the boards cost ₹4,000 each, the expected failure cost is 381 × 4,000 ≈ ₹15.2 lakh — which is the number a reliability-improvement proposal has to beat.',
      },
    ],
    verification:
      'R + F = 0.6188 + 0.3812 = 1.0000. Survivors + failures = 619 + 381 = 1000 = N. λt = 0.48 is dimensionless, so the exponential is legal.',
    interpretation:
      'The pattern to internalise: exponent → R → F → population. Skip a step and you will eventually multiply by the wrong one of R and F.',
  },
  {
    id: 'u1t2-p3',
    title: 'Problem 3 — Determine the failure rate from a reliability requirement',
    provenance: 'insight',
    situation:
      'A customer specifies that a monitoring unit must have a reliability of at least 0.90 after 24 months of operation. You must determine the maximum allowable constant failure rate and the corresponding MTBF, so that the requirement can go into a procurement specification.',
    given: [
      { symbol: 'R required', value: '0.90 at t = 24 months' },
      { symbol: 't', value: '24 months' },
      { symbol: 'Law', value: 'R = e^(−λt)' },
    ],
    required: [
      'ln(R)',
      'Maximum allowable λ',
      'Minimum required MTBF m = 1/λ',
    ],
    assumptions: [
      'Constant failure rate over the 24-month window (useful-life region).',
      'Engineering Insight: the requirement and the values are constructed for practice.',
    ],
    steps: [
      {
        id: 'ln',
        ask: 'Step 1 — Evaluate ln(R) for R = 0.90.',
        concept:
          'Invert the exponential law by taking natural logs of both sides: ln R = −λt.',
        equation: 'ln(R) = −λt',
        substitution: 'ln(0.90) = −0.10536',
        entries: [{ id: 'l1', label: 'ln(0.90)', unit: '(dimensionless)', answer: -0.1054, tolerance: 0.002 }],
        hints: [
          'The natural log of a number between 0 and 1 is negative — keep the sign.',
          'ln(0.9) = −0.10536.',
        ],
        interpretation:
          'The negative sign is the point: reliability below 1 always corresponds to a positive λt.',
        whatIf:
          'For R = 0.95 the log is −0.05129; for R = 0.99 it is −0.01005. Tighter requirements shrink the allowed λt quickly.',
      },
      {
        id: 'lam',
        ask: 'Step 2 — Compute the maximum allowable λ = −ln(R)/t.',
        concept:
          'Rearrange ln R = −λt. The result is the largest constant failure rate that still meets the requirement.',
        equation: 'λ_max = −ln(R) / t',
        substitution: 'λ_max = 0.10536 / 24 months = 4.390 × 10⁻³ per month ≈ 0.00439 per month',
        entries: [
          { id: 'l2', label: 'λ_max', unit: 'per month', answer: 0.00439, tolerance: 0.0002 },
        ],
        hints: [
          'Divide 0.10536 by 24.',
          'The unit is per month, because t was in months.',
        ],
        interpretation:
          'Write this into the purchase specification as “λ ≤ 4.39 × 10⁻³ per month over 24 months, constant-failure-rate assumption”. A specification that says only “reliable” is unenforceable.',
        whatIf:
          'If the requirement tightens to R = 0.95 over the same 24 months, λ_max falls to 0.05129/24 = 2.14 × 10⁻³ per month — halving the allowance for a 5-point reliability gain.',
      },
      {
        id: 'mtbf',
        ask: 'Step 3 — What MTBF does that failure rate correspond to? m = 1/λ.',
        concept:
          'The source relates m and λ by m = 1/λ, so a reliability requirement can equally be written as an MTBF requirement.',
        equation: 'm = 1/λ',
        substitution: 'm = 1 / 0.004390 per month = 227.8 months ≈ 228 months (about 19 years)',
        entries: [{ id: 'm2', label: 'Minimum m', unit: 'months', answer: 228, tolerance: 4 }],
        hints: [
          'Take the reciprocal of the λ from step 2.',
          '1 / 0.00439 ≈ 228.',
        ],
        interpretation:
          'An MTBF of about 19 years is needed to deliver 90% over just 2 years. That ratio surprises people, and it is the reason MTBF numbers look so much larger than the mission time.',
        whatIf:
          'If the mission time were 60 months instead of 24, the same 90% requirement would demand λ ≤ 0.00176/month and m ≥ 569 months.',
      },
    ],
    verification:
      'Substitute back: R = e^(−0.004390 × 24) = e^(−0.10536) = 0.900 ✓. And 1/227.8 = 0.004390 per month, consistent with the MTBF relation.',
    interpretation:
      'Requirement → allowable λ → required MTBF is the direction an engineer actually works in. The exam usually asks the reverse direction, so practise both.',
  },
  {
    id: 'u1t2-p4',
    title: 'Problem 4 — Compare two designs and select one',
    provenance: 'insight',
    situation:
      'Two candidate designs are offered for a remote level transmitter. Design A has λ = 0.010 per month and costs ₹6,000 per unit. Design B has λ = 0.030 per month and costs ₹3,500 per unit. The plant will install 300 units and must maintain them for 24 months.',
    given: [
      { symbol: 'λ_A', value: '0.010 per month' },
      { symbol: 'λ_B', value: '0.030 per month' },
      { symbol: 't', value: '24 months' },
      { symbol: 'N', value: '300 units' },
      { symbol: 'Unit cost', value: 'A = ₹6,000, B = ₹3,500' },
    ],
    required: [
      'R_A(24) and R_B(24)',
      'Expected failures for each design out of 300',
      'The design you recommend, with the reason',
    ],
    assumptions: [
      'Constant failure rates; both designs are inside the useful-life region.',
      'Replacement cost is the unit cost; labour and downtime are ignored in this first pass.',
      'Engineering Insight: values and costs are constructed for practice.',
    ],
    steps: [
      {
        id: 'ra',
        ask: 'Step 1 — Compute R_A(24) for λ = 0.010 per month.',
        concept: 'Exponential law with a constant failure rate.',
        equation: 'R = e^(−λt)',
        substitution: 'λt = 0.010 × 24 = 0.24; R_A = e^(−0.24) = 0.7866 ≈ 0.787',
        entries: [{ id: 'ra1', label: 'R_A(24 months)', unit: '(0–1)', answer: 0.787, tolerance: 0.01 }],
        hints: ['Compute λt first, then exponentiate.', 'e^(−0.24) ≈ 0.787.'],
        interpretation: 'About 79% of Design A units are expected to survive 24 months.',
        whatIf: 'At 60 months R_A falls to e^(−0.6) = 0.549 — the gap between designs widens with time.',
      },
      {
        id: 'rb',
        ask: 'Step 2 — Compute R_B(24) for λ = 0.030 per month.',
        concept: 'Same law, three times the failure rate — note that the reliability does not fall by a factor of three.',
        equation: 'R = e^(−λt)',
        substitution: 'λt = 0.030 × 24 = 0.72; R_B = e^(−0.72) = 0.4868 ≈ 0.487',
        entries: [{ id: 'rb1', label: 'R_B(24 months)', unit: '(0–1)', answer: 0.487, tolerance: 0.01 }],
        hints: ['λt = 0.72 here.', 'e^(−0.72) ≈ 0.487.'],
        interpretation:
          'Design B is at about 49% — nearly half the plant is expected to have failed within two years.',
        whatIf: 'Tripling λ cut reliability from 0.787 to 0.487, a factor of 1.62, not 3. Reliability is exponential in λ, not inversely proportional.',
      },
      {
        id: 'fail',
        ask: 'Step 3 — Expected failures out of 300 units for each design.',
        concept: 'Expected failures = N × F = N(1 − R).',
        equation: 'Failures = N × (1 − R)',
        substitution:
          'A: 300 × (1 − 0.7866) = 300 × 0.2134 = 64.0 ≈ 64 units. B: 300 × (1 − 0.4868) = 300 × 0.5132 = 154.0 ≈ 154 units. Difference ≈ 90 units.',
        entries: [
          { id: 'fa', label: 'Failures — Design A', unit: 'units', answer: 64, tolerance: 3 },
          { id: 'fb', label: 'Failures — Design B', unit: 'units', answer: 154, tolerance: 4 },
        ],
        hints: [
          'Use 1 − R, then multiply by 300.',
          'Sanity check: Design B should have roughly 2.4 times as many failures as Design A.',
        ],
        interpretation:
          'Ninety extra failures is a maintenance-crew problem, a spares-holding problem and a downtime problem — not just a line item.',
        whatIf: 'If each failure costs 4 hours of technician time at ₹800/hour, the 90 extra failures cost about ₹2.9 lakh in labour alone.',
      },
      {
        id: 'rec',
        ask: 'Step 4 — Which design do you recommend? Enter A or B.',
        concept:
          'Compare total cost of ownership, not unit price: purchase cost plus expected replacement cost plus the cost of the extra failures.',
        equation:
          'Purchase A = 300 × 6,000 = ₹18.0 lakh; Purchase B = 300 × 3,500 = ₹10.5 lakh. Replacement A = 64 × 6,000 = ₹3.84 lakh; Replacement B = 154 × 3,500 = ₹5.39 lakh. Total A ≈ ₹21.84 lakh; Total B ≈ ₹15.89 lakh.',
        substitution:
          'On purchase plus replacement, B is cheaper by about ₹5.95 lakh — but B produces 90 more failures, i.e. 90 more site visits, 90 more process upsets and 90 more opportunities for a safety incident. Where downtime is expensive, A wins; where it is not, B wins.',
        entries: [
          {
            id: 'rec1',
            label: 'Recommendation',
            unit: 'A or B',
            answer: null,
            accepted: ['a', 'design a', 'a — lower failure rate', 'b', 'design b'],
            tolerance: 0,
          },
        ],
        hints: [
          'Hint 1 — Do not answer from the unit price alone. Add the expected replacement cost.',
          'Hint 2 — Then ask what a failure actually costs this plant. Is it a spare part, or is it a process stoppage?',
          'Hint 3 — There is no single right answer here. The mark is for naming the trade-off and the condition under which each design wins.',
        ],
        interpretation:
          'This is the engineering decision the topic is really about. The arithmetic is trivial; the judgement is the point. State the condition: if downtime cost per failure exceeds about ₹6,600 (the ₹5.95 lakh gap over 90 failures), choose A; otherwise choose B.',
        whatIf:
          'If the plant can burn in the units before installation, most infant-mortality failures move from the field to the bench, and the comparison shifts again — that is a component-level improvement, not a design change.',
      },
    ],
    verification:
      'R_A/R_B = 0.7866/0.4868 = 1.616, and e^(−0.24)/e^(−0.72) = e^(0.48) = 1.616 ✓. Failures: 64 + 236 = 300 and 154 + 146 = 300 ✓.',
    interpretation:
      'Reliability is an economic parameter. Convert probabilities into counts, counts into costs, and then decide — and always say which assumption your decision depends on.',
  },
]

/* ------------------------------------------------------------------ */
/* Design challenge                                                    */
/* ------------------------------------------------------------------ */

export const RELIABILITY_DESIGN: DesignChallengeSpec = {
  id: 'u1t2-design-flow-transmitter',
  title: 'Design Challenge — Reliability plan for 200 remote flow transmitters',
  provenance: 'insight',
  requirement:
    'A utility is installing 200 remote flow transmitters on a pipeline network. Sites are visited once every six months. The reliability requirement is R ≥ 0.95 at 12 months. Field data on a previous, similar installation gave λ = 0.009 per month, with a cluster of failures in the first month after installation. Produce the reliability plan: the number that decides whether the requirement is met, the allowable failure rate, and the improvement action for each region of the bathtub curve.',
  constraints: [
    'Population N = 200 units, requirement R ≥ 0.95 at t = 12 months.',
    'Previous installation: λ = 0.009 per month, with early failures clustered in month 1.',
    'Site visit interval is six months, so field failures are not corrected quickly.',
    'The exponential model may only be used where the failure rate is constant.',
  ],
  assumptions: [
    'The law R = e^(−λt) and the relation m = 1/λ are source-derived.',
    'The scenario numbers, the cost model and the series/parallel reasoning are Engineering Insight.',
    'Reliability actions must be separated into component level and product/system level, as the syllabus requires.',
  ],
  checks: [
    {
      id: 'r12',
      label: 'Does the current design meet the requirement?',
      ask: 'Compute R(12 months) for λ = 0.009 per month. State whether the requirement is met.',
      unit: 'R (0–1)',
      accepted: ['0.897', '0.898', '0.90', 'no', 'not met', 'fails', '897'],
      hints: [
        'Hint 1 — Write the exponent first: λt = 0.009 × 12.',
        'Hint 2 — λt = 0.108. Now evaluate e^(−0.108).',
        'Hint 3 — R = 0.8976, which is below 0.95, so the requirement is NOT met — by about 5 points.',
      ],
      rationale:
        'R(12) = e^(−0.009 × 12) = e^(−0.108) = 0.8976 ≈ 0.898. The requirement of 0.95 is not met. Note that 0.898 looks close to 0.90 and is very close to being accepted by eye — this is exactly the kind of gap that must be caught on paper, not by looking at the number.',
    },
    {
      id: 'lamax',
      label: 'Allowable failure rate',
      ask: 'What is the maximum allowable constant failure rate that meets R ≥ 0.95 at 12 months? Give it per month.',
      unit: 'per month',
      accepted: ['0.00427', '0.0043', '0.00427 per month', '4.27e-3', '0.004'],
      hints: [
        'Hint 1 — Rearrange the law: λ = −ln(R)/t.',
        'Hint 2 — ln(0.95) = −0.05129, so λ = 0.05129 / 12.',
        'Hint 3 — λ_max = 4.27 × 10⁻³ per month. The present λ of 9 × 10⁻³ must be cut by more than half.',
      ],
      rationale:
        'λ_max = −ln(0.95)/12 = 0.05129/12 = 4.274 × 10⁻³ per month. The corresponding MTBF is 1/λ = 234 months. Writing this into the procurement specification converts a wish into a testable requirement.',
    },
    {
      id: 'region',
      label: 'Region diagnosis',
      ask: 'Which region of the bathtub curve does the month-1 failure cluster belong to, and what is the correct component-level action?',
      accepted: [
        'infant mortality',
        'infant mortality — burn-in screening and incoming quality control',
        'early failure period / burn-in, screened before installation',
        'infant mortality: burn-in, incoming qc, supplier quality',
      ],
      hints: [
        'Hint 1 — A cluster of failures right after installation, followed by a lower steady rate, is the signature of one region.',
        'Hint 2 — The supplied material calls this period the burn-in period.',
        'Hint 3 — The action happens BEFORE installation: burn-in screening, incoming quality control, supplier qualification.',
      ],
      rationale:
        'Infant mortality (early failure period / burn-in period). Component-level action: burn-in or run-in screening at the supplier so weak units fail on the bench, plus incoming quality control and lot traceability. The source’s stated causes are defects or errors during manufacturing, poor quality raw material, wrong assembly, improper insulation and poor fitting — every one of them is prevented before delivery, not repaired after installation.',
    },
    {
      id: 'model',
      label: 'Model validity',
      ask: 'Over which part of the life may you use R = e^(−λt) for this installation, and why?',
      accepted: [
        'useful life',
        'only in the useful life / random failure region where failure rate is constant',
        'constant failure rate region only',
      ],
      hints: [
        'Hint 1 — The exponential law assumes something about λ. What?',
        'Hint 2 — λ must be constant. Which region has a constant failure rate?',
        'Hint 3 — The useful-life (random failure) region only. Using it across the wear-out knee under-predicts failures.',
      ],
      rationale:
        'Only during the useful-life (random failure) region, where the failure rate is constant. The source states that in the random-failure region the failure rate is constant, and that in the wear-out region the failure rate rises with time. Applying a constant λ across the wear-out knee under-predicts late failures — the classic maintenance-planning error.',
    },
    {
      id: 'system',
      label: 'System-level improvement',
      ask: 'Name ONE product/system-level action that raises reliability without changing the components, and say what it costs you.',
      accepted: [
        'redundancy',
        'redundancy — two units in parallel, costs extra hardware and a switching failure mode',
        'reduce complexity / simpler design',
        'simpler design to reduce the number of parts and connections',
        'improve maintainability so failures are corrected faster',
      ],
      hints: [
        'Hint 1 — Component-level actions change the parts. What changes when you act on the architecture instead?',
        'Hint 2 — The source lists “Complexity of equipment” as a factor responsible for failure. Fewer parts is itself a reliability action.',
        'Hint 3 — Redundancy is the obvious one: two independent units give R = 1 − (1 − R)², but you pay in hardware, cost and a new switching failure mode.',
      ],
      rationale:
        'Redundancy (Engineering Insight): two independent units in parallel give R = 1 − (1 − R₁)(1 − R₂); with R = 0.8976 each, the pair gives 0.9895. But it doubles the hardware, roughly doubles the cost, and introduces a changeover/switching failure mode that does not exist in a single channel. Simpler alternatives: reduce the number of parts and connectors (directly attacking the source’s “Complexity of equipment” factor), or improve maintainability so that a six-month correction delay is shortened.',
    },
  ],
  solution: [
    {
      label: 'Requirement',
      content:
        '200 units, R ≥ 0.95 at 12 months, six-month site-visit interval, previous λ = 0.009 per month with a month-1 failure cluster.',
    },
    { label: 'Constraints', content: 'Population size, reliability target, visit interval, model-validity limit.' },
    {
      label: 'Assumptions',
      content:
        'Law and MTBF relation source-derived; scenario values, redundancy formula and cost model are Engineering Insight.',
    },
    {
      label: 'Screening calculation',
      content:
        'R(12) = e^(−0.009 × 12) = e^(−0.108) = 0.8976. Requirement not met; shortfall ≈ 0.052.',
    },
    {
      label: 'Allowable failure rate',
      content:
        'λ_max = −ln(0.95)/12 = 0.05129/12 = 4.27 × 10⁻³ per month; required MTBF = 234 months.',
    },
    {
      label: 'Infant mortality action',
      content:
        'Burn-in screening at the supplier, incoming quality control, lot traceability and a commissioning test before hand-over.',
    },
    {
      label: 'Useful-life action',
      content:
        'Derate components, protect against overvoltage/reverse polarity/surge, keep the unit inside its specified operating temperature range (Topic 1), and train operators against mishandling.',
    },
    {
      label: 'Wear-out action',
      content:
        'Reduce stress severity, select long-life parts for the dominant ageing mechanisms, and plan condition-based replacement before the wear-out knee.',
    },
    {
      label: 'Verification',
      content:
        'Re-compute after the actions: with λ = 4.0 × 10⁻³ per month (achieved by screening plus derating), R(12) = e^(−0.048) = 0.953, which meets the requirement with a small margin. Expected failures out of 200 = 200 × 0.047 = 9 units in year one.',
    },
    {
      label: 'Possible failure modes',
      content:
        'Screening that is too short to remove the weak population; a burn-in that stresses good units and creates wear-out damage; a derating rule applied to the typical case rather than the worst case; a redundancy scheme whose changeover mechanism is itself unproven.',
    },
    {
      label: 'Alternative',
      content:
        'Instead of buying a lower λ, shorten the correction time: if a failure is corrected in days rather than six months, availability rises even though R is unchanged. Reliability and maintainability are different levers — the source defines maintainability separately as M(t) = Pr(T ≤ t).',
    },
  ],
  failureModes: [
    'Accepting 0.898 as “about 0.90” and calling the requirement met.',
    'Measuring λ during the first month and using it for a five-year forecast.',
    'Screening for infant mortality and then claiming the useful-life failure rate has improved.',
    'Adding redundancy without analysing the changeover failure mode.',
    'Quoting MTBF as if it were the service life of the product.',
  ],
  interpretation:
    'A reliability plan is three separate plans — one for each region of the bathtub curve — plus one number in a procurement specification. If your plan has only one action, it only addresses one region.',
}

/* ------------------------------------------------------------------ */
/* Debugging cases                                                     */
/* ------------------------------------------------------------------ */

export const DEBUG_CASES2: DebugFault[] = [
  {
    id: 'u1t2-debug-infant',
    title: 'Fault 1 — 22 failures in the first month, then quiet',
    provenance: 'insight',
    symptom:
      'Three hundred temperature transmitters are installed in a new plant. Twenty-two fail in the first month. In month two, two fail. In month three, one. From month four onward the failure count settles at about one per month and stays there. The maintenance team proposes to increase the site-visit frequency.',
    measurements: [
      { label: 'Failures, month 1', value: '22 of 300' },
      { label: 'Failures, month 2', value: '2 of 278' },
      { label: 'Failures, month 3', value: '1 of 276' },
      { label: 'Failures, month 4 onward', value: '≈ 1 per month, steady' },
      { label: 'Failed units', value: 'All from the same production lot' },
      { label: 'Ambient and supply at site', value: 'Within specification' },
      { label: 'Age of installed base', value: 'Under 12 months' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The units are wearing out early because the site is too hot' },
      { id: 'h2', text: 'This is infant mortality — a weak sub-population from one manufacturing lot failing early' },
      { id: 'h3', text: 'The site-visit interval is too long' },
      { id: 'h4', text: 'The power supply is noisy and damaging the units randomly' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Increase the site-visit frequency to once a month' },
      { id: 'f2', text: 'Burn-in / screen replacement units before installation and tighten incoming quality control on the lot' },
      { id: 'f3', text: 'Increase the cooling of all field enclosures' },
      { id: 'f4', text: 'Redesign the transmitter to use higher-temperature components' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — Compute the failure RATE, not the raw count. Failures per month divided by units still running.',
      'Hint 2 — Month 1: 22/300 = 7.3%. Month 4: about 1/274 = 0.36%. Is the rate rising, falling or flat?',
      'Hint 3 — A falling failure rate is the signature of exactly one region of the bathtub curve.',
    ],
    rootCause:
      'Infant mortality. The failure rate falls sharply with time (7.3% in month 1 down to about 0.36% per month by month 4), and every failed unit comes from one production lot. That is the classic weak-sub-population pattern, and the supplied material names the period the burn-in period. The environmental measurements are within specification, so overheating is not supported by the data, and increasing visit frequency treats the symptom — the units were already defective before they were installed.',
    prevention:
      'Burn-in or run-in screening at the supplier so the weak population fails on the bench, incoming quality control with lot acceptance testing, supplier qualification and lot traceability, plus a commissioning test that exercises each unit before hand-over. Source causes to design against: defects or errors during manufacturing, poor quality raw material, wrong assembly, improper insulation and poor fitting.',
  },
  {
    id: 'u1t2-debug-wrongmodel',
    title: 'Fault 2 — The forecast that kept being wrong',
    provenance: 'insight',
    symptom:
      'A maintenance engineer measured λ = 0.004 per month over the first six months of a drive installation and used R = e^(−λt) to forecast year five. The model predicted 79% surviving; the plant counted 61%. Every quarter the forecast is worse than the plant count, and the gap is growing.',
    measurements: [
      { label: 'λ measured over months 1–6', value: '0.004 per month' },
      { label: 'Model prediction R(60)', value: 'e^(−0.24) = 0.787 → 236 of 300' },
      { label: 'Observed surviving at 60 months', value: '183 of 300 (61%)' },
      { label: 'Failures per month, months 1–12', value: '≈ 1.2 — flat' },
      { label: 'Failures per month, months 49–60', value: '≈ 4.1 — rising' },
      { label: 'Operating condition', value: 'Continuous, at maximum rated load' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The arithmetic in the forecast is wrong' },
      { id: 'h2', text: 'A constant failure rate was measured early in life and then extrapolated across the wear-out region, where λ rises with time' },
      { id: 'h3', text: 'The population figure of 300 is wrong' },
      { id: 'h4', text: 'The units are suffering infant mortality' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Re-measure λ more accurately over a longer window' },
      { id: 'f2', text: 'Stop using a single constant λ: plan condition-based replacement before the wear-out knee and reduce the operating stress severity' },
      { id: 'f3', text: 'Replace the whole population immediately' },
      { id: 'f4', text: 'Increase the spares holding to match the forecast' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — The model prediction is lower or higher than reality? Which way is the error, and what does that say about λ?',
      'Hint 2 — Work out the λ implied by the observed 61%: −ln(0.61)/60.',
      'Hint 3 — Implied λ ≈ 8.2 × 10⁻³ per month, about twice the early-life 0.004. A λ that grows with time is the definition of which region?',
    ],
    rootCause:
      'The exponential law was applied outside its valid region. R = e^(−λt) assumes a constant failure rate, which is only true in the useful-life region. The measured rate of 1.2 failures per month was flat early on, but by months 49–60 it had risen to about 4.1 per month — the population has entered wear-out. The implied average λ is −ln(0.61)/60 = 8.24 × 10⁻³ per month, roughly double the early value, which is why the constant-λ forecast under-predicts failures and why the gap widens every quarter. The source itself notes that wear-out failures are obtained by keeping components at maximum rated condition — which is exactly how this plant operates.',
    prevention:
      'Measure λ only inside the flat region and never extrapolate it across the wear-out knee. Plot failures per month divided by units at risk so you can see λ(t) change shape. Then act on the region: reduce stress severity (operate below maximum rated condition), select long-life parts for the dominant ageing mechanism, and plan condition-based replacement before the knee rather than a fixed spare holding based on a constant-λ forecast.',
  },
]

/* ------------------------------------------------------------------ */
/* Question bank — 65 questions                                        */
/* ------------------------------------------------------------------ */

const T = 'u1t2'

export const TOPIC2_QUESTIONS: Question[] = [
  /* ---------------- CONCEPTUAL (10) ---------------- */
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define reliability as given in the supplied material, and state why reliability is always less than 100%.',
    hint: 'The source gives the definition twice — as an ability and as a probability. Quote both.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Reliability is the ability of a product to perform its intended function under stated conditions for a stated period of time. It is the probability that the unit performs its intended functionality for the stated period of time under the stated operating conditions.',
      },
      {
        label: 'Why it is always below 100%',
        content:
          'Because a component or system may fail after some time. Once any non-zero possibility of failure exists over the stated period, the probability of survival is strictly less than 1.',
      },
    ],
    engineeringExplanation:
      'The three qualifiers — intended function, stated condition, stated period — are what make the definition testable. Drop any one and you can no longer say whether a product met its reliability requirement.',
    provenance: 'source',
  },
  {
    id: `${T}-c2`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'List',
    prompt: 'List the four factors that affect the reliability of equipment, as given in the supplied material.',
    hint: 'The source lists these under “Reliability of equipment”. There are exactly four.',
    solution: [
      { label: 'Answer (source)', content: 'Design of equipment · Quality of Manufacturing · Storage of product · Environmental conditions.' },
      {
        label: 'Note',
        content:
          'Do not confuse this list with the seven “factors responsible for failure” — that is a separate list on the next page of the same source.',
      },
    ],
    engineeringExplanation:
      'Two short lists, two different questions. “What decides reliability?” is answered by these four; “What causes failures?” is answered by the seven.',
    provenance: 'source',
  },
  {
    id: `${T}-c3`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 3,
    skill: 'concept',
    action: 'List',
    prompt: 'List the seven factors responsible for failure given in the supplied material, and separate them into design-stage, manufacturing-stage and in-service causes.',
    hint: 'Group them by when they occur, not by how they are worded in the source.',
    solution: [
      {
        label: 'Answer (source)',
        content:
          'Incorrect design · Wrong manufacturing process · Complexity of equipment · Poor quality control · Improper storage or transportation · Misuse/mishandling of equipment · Human error.',
      },
      {
        label: 'Grouping (Engineering Insight)',
        content:
          'Design stage: incorrect design, complexity of equipment. Manufacturing stage: wrong manufacturing process, poor quality control. Storage and service: improper storage or transportation, misuse/mishandling, human error.',
      },
    ],
    engineeringExplanation:
      'The grouping tells you who owns the fix. Design-stage causes are fixed by engineering, manufacturing-stage causes by the supplier and quality function, in-service causes by logistics, training and handling procedure.',
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
    prompt: 'State the exponential law of reliability. Define every symbol with its unit and state the relation between the failure rate and m.',
    hint: 'The source writes it twice: R = e^(−λt) and R = e^(−t/m).',
    solution: [
      {
        label: 'Law (source)',
        content:
          'R = e^(−λt), where R is the reliability of the equipment, λ is the system failure rate (stated in the source as failure per month) and t is the operating time in the same time unit. With m = 1/λ, the same law is written R = e^(−t/m).',
      },
      {
        label: 'Units',
        content: 'λ in failures per month and t in months make λt dimensionless, as an exponent must be. m is in months.',
      },
      {
        label: 'Anchor',
        content: 'If t = m then R = e^(−1) = 0.37, i.e. the probability of successful operation reduces to 37%.',
      },
    ],
    engineeringExplanation:
      'Always write the units next to λ. A candidate who writes λ without “per month” has not established that λt is dimensionless, which is the commonest way to lose a mark in this topic.',
    provenance: 'source',
  },
  {
    id: `${T}-c5`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain the significance of the result R = 0.37 at t = m. Why is this single number worth memorising?',
    hint: 'It does not depend on λ. Think about what that means for comparing products.',
    solution: [
      {
        label: 'Answer',
        content:
          'At t = m the exponent becomes −1 regardless of the value of λ, so R = e^(−1) = 0.3679 ≈ 0.37 for every constant-failure-rate population. After one MTBF, only about 37% of the population is expected to be running — roughly two-thirds have already failed.',
      },
      {
        label: 'Why it matters',
        content:
          'It is the only numerical result the supplied material guarantees, so it is the safest mark in an exam answer. It also kills the common misreading of MTBF as “the life of the product”.',
      },
      {
        label: 'Extension (Engineering Insight)',
        content: 'After n MTBFs, R = 0.37ⁿ: two MTBFs give 0.135, three give 0.050.',
      },
    ],
    engineeringExplanation:
      'When a datasheet says MTBF = 100,000 hours, customers hear “it lasts 100,000 hours”. It does not: about 63% of the population has failed by then.',
    provenance: 'source',
  },
  {
    id: `${T}-c6`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'Reproduce the supplied table of failure types and the phase at which each occurs.',
    hint: 'Five types: Initial, Early, Random, Catastrophic, Wear out.',
    solution: [
      {
        label: 'Answer (source)',
        content:
          'Initial — during initial phase. Early — immediately after short time of installation. Random — during arbitrary instance. Catastrophic — major failure for long time. Wear out — after long usage of equipment.',
      },
      {
        label: 'Observation',
        content:
          'Only “Random — during arbitrary instance” describes a phase with a constant failure rate; the others are tied to the start of life or to long usage.',
      },
    ],
    engineeringExplanation:
      'This table is the bridge to the bathtub curve: it is the same life history described by name instead of by graph.',
    provenance: 'source',
  },
  {
    id: `${T}-c7`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define maintainability as given in the supplied material and write its probability expression.',
    hint: 'The source defines it in terms of repair time T and down time.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Maintainability is the probability that failed equipment is restored to meet the designed specifications in a known time, called down time, when maintenance is performed under stated conditions.',
      },
      {
        label: 'Expression (source)',
        content: 'M(t) = Pr(T ≤ t), where T is the random variable representing the repair time.',
      },
    ],
    engineeringExplanation:
      'Reliability and maintainability are independent levers. You can buy availability either by failing less often or by being restored faster — and sometimes the second is far cheaper.',
    provenance: 'source',
  },
  {
    id: `${T}-c8`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Distinguish',
    prompt: 'Distinguish clearly between reliability R(t), unreliability F(t) and maintainability M(t). Give the relation between the first two.',
    hint: 'R and F are complements. M is about a different random variable altogether.',
    solution: [
      {
        label: 'R(t)',
        content: 'Probability that the unit is still performing its intended function at time t. Source: R = e^(−λt) under a constant failure rate.',
      },
      {
        label: 'F(t)',
        content: 'Probability that the unit has failed by time t. F(t) = 1 − R(t) (Engineering Insight; the relation follows from the two being complementary events).',
      },
      {
        label: 'M(t)',
        content: 'Probability that a failed unit is restored within time t: M(t) = Pr(T ≤ t) where T is repair time (source).',
      },
      {
        label: 'Why the distinction matters',
        content:
          'A product with modest reliability but excellent maintainability can deliver higher availability than a very reliable product that takes months to repair.',
      },
    ],
    engineeringExplanation:
      'Examiners ask this because students routinely use “reliability” to mean “availability”. Keep the three letters straight and the rest of the topic follows.',
    provenance: 'insight',
  },
  {
    id: `${T}-c9`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain what is meant by the early failure period and state what else the supplied material calls it.',
    hint: 'The source names it explicitly after listing the early-failure reasons.',
    solution: [
      {
        label: 'Answer (source)',
        content:
          'The early failure period is the first part of the life during which the failure rate is high and falling, caused by defects and errors in manufacture and assembly. The supplied material states that the early failure period is also called the burn-in period.',
      },
      {
        label: 'Causes (source)',
        content:
          'Defect or errors during manufacturing · Poor quality raw material · Wrong assembly · Improper insulation · Poor fitting.',
      },
    ],
    engineeringExplanation:
      'The alternative name is the answer to the engineering question: you burn the units in so that the weak population fails where it is cheap to deal with.',
    provenance: 'source',
  },
  {
    id: `${T}-c10`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain what the supplied material says about random failures and about wear-out failures, including the two stress-severity graphs.',
    hint: 'One has a constant failure rate; the other is plotted at maximum rated condition for two severities.',
    solution: [
      {
        label: 'Random failure (source)',
        content: 'The failure rate is constant. Causes: mishandling, and exceeding the operating conditions, which damage components.',
      },
      {
        label: 'Wear out failure (source)',
        content:
          'Components are kept in operation at maximum rated condition and the failure rate is observed and plotted against time. The graph can be plotted for two different stress severities: Graph A = high stress severity, Graph B = low stress severity.',
      },
      {
        label: 'Consequence (Engineering Insight)',
        content:
          'Higher stress severity moves the wear-out knee earlier, shortening the region over which a constant λ is valid. Derating is therefore a reliability action, not just a safety margin.',
      },
    ],
    engineeringExplanation:
      'Stress severity is the one variable that links the physics (temperature, voltage, load) to the shape of the bathtub curve. Reducing it is the cheapest wear-out action available.',
    provenance: 'source',
  },

  /* ---------------- NUMERICAL (15) ---------------- */
  {
    id: `${T}-n1`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A unit has a constant failure rate λ = 0.02 per month. Calculate the reliability after 24 months and the unreliability.',
    hint: 'Compute λt first, then R = e^(−λt), then F = 1 − R.',
    solution: [
      { label: 'Given', content: 'λ = 0.02 per month, t = 24 months.' },
      { label: 'Equation', content: 'R = e^(−λt);  F = 1 − R' },
      { label: 'Substitution', content: 'λt = 0.02 × 24 = 0.48. R = e^(−0.48) = 0.6188.' },
      { label: 'Answer with unit', content: 'R(24 months) = 0.619 (61.9%); F(24 months) = 1 − 0.6188 = 0.381 (38.1%).' },
      { label: 'Verification', content: 'R + F = 0.6188 + 0.3812 = 1.0000 ✓; λt is dimensionless ✓.' },
      { label: 'Interpretation', content: 'About 38% of the population is expected to have failed by two years — that figure sizes the spares holding.' },
    ],
    engineeringExplanation: 'The step most often skipped is F = 1 − R. Spares are bought against F, not against R.',
    provenance: 'insight',
  },
  {
    id: `${T}-n2`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'λ = 0.01 per month. Calculate the MTBF m and the reliability at t = m.',
    hint: 'Use m = 1/λ, then the source’s anchor point.',
    solution: [
      { label: 'Given', content: 'λ = 0.01 per month.' },
      { label: 'Equation', content: 'm = 1/λ;  R = e^(−t/m)' },
      { label: 'Substitution', content: 'm = 1/0.01 = 100 months. At t = m = 100 months, R = e^(−1) = 0.3679.' },
      { label: 'Answer with unit', content: 'm = 100 months; R(t = m) = 0.37 (37%).' },
      { label: 'Verification', content: 'λm = 0.01 × 100 = 1, so R = e^(−1) — exactly the source result.' },
      { label: 'Interpretation', content: 'After one MTBF, about 63% of the population has already failed.' },
    ],
    engineeringExplanation: 'This is the only numerical result guaranteed by the supplied material. Quote it whenever a question mentions MTBF.',
    provenance: 'source',
  },
  {
    id: `${T}-n3`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Determine',
    prompt: 'A reliability of 0.90 is required after 24 months. Determine the maximum allowable constant failure rate, and the MTBF it implies.',
    hint: 'Invert the law: λ = −ln(R)/t. Then m = 1/λ.',
    solution: [
      { label: 'Given', content: 'R = 0.90 at t = 24 months.' },
      { label: 'Equation', content: 'ln R = −λt → λ = −ln(R)/t;  m = 1/λ' },
      { label: 'Substitution', content: 'ln(0.90) = −0.10536. λ = 0.10536/24 = 4.390 × 10⁻³ per month. m = 1/0.004390 = 227.8 months.' },
      { label: 'Answer with unit', content: 'λ_max = 4.39 × 10⁻³ per month; m_min = 228 months (about 19 years).' },
      { label: 'Verification', content: 'R = e^(−0.004390 × 24) = e^(−0.10536) = 0.900 ✓.' },
      { label: 'Interpretation', content: 'A 2-year 90% requirement implies an MTBF of about 19 years — MTBF numbers are always much larger than mission times.' },
    ],
    engineeringExplanation: 'This is the direction engineers actually work in: specification → allowable λ → procurement clause.',
    provenance: 'insight',
  },
  {
    id: `${T}-n4`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'λ = 0.005 per month. After how many months does the reliability fall to 0.95? Give the answer to one decimal place.',
    hint: 't = −ln(R)/λ.',
    solution: [
      { label: 'Given', content: 'λ = 0.005 per month, R = 0.95.' },
      { label: 'Equation', content: 't = −ln(R)/λ' },
      { label: 'Substitution', content: 'ln(0.95) = −0.051293. t = 0.051293/0.005 = 10.259 months.' },
      { label: 'Answer with unit', content: 't = 10.3 months.' },
      { label: 'Verification', content: 'λt = 0.005 × 10.259 = 0.051293, so R = e^(−0.051293) = 0.950 ✓.' },
      { label: 'Interpretation', content: 'A 5% failure allowance is consumed in under a year even at this modest failure rate — useful when setting a calibration or inspection interval.' },
    ],
    engineeringExplanation: 'Same three quantities, third arrangement. Practise all three directions of R = e^(−λt) until each is automatic.',
    provenance: 'insight',
  },
  {
    id: `${T}-n5`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Compare',
    prompt: 'Compare two designs at t = 24 months: Design A has λ = 0.010 per month, Design B has λ = 0.030 per month. Calculate both reliabilities and state by what factor A is better.',
    hint: 'Compute both R values, then take the ratio — not the difference.',
    solution: [
      { label: 'Given', content: 'λ_A = 0.010 /month, λ_B = 0.030 /month, t = 24 months.' },
      { label: 'Equation', content: 'R = e^(−λt); ratio = R_A/R_B' },
      { label: 'Substitution', content: 'A: λt = 0.24 → R_A = 0.7866. B: λt = 0.72 → R_B = 0.4868. Ratio = 0.7866/0.4868 = 1.616.' },
      { label: 'Answer with unit', content: 'R_A = 0.787, R_B = 0.487; A is better by a factor of 1.62 in reliability.' },
      { label: 'Verification', content: 'e^(−0.24)/e^(−0.72) = e^(0.48) = 1.616 ✓ — the ratio is e^(Δλ·t).' },
      { label: 'Interpretation', content: 'Tripling the failure rate did NOT cut reliability by three. The relationship is exponential: reliability ratio = e^(Δλ·t).' },
    ],
    engineeringExplanation: 'The non-linearity is the lesson. Small improvements in λ buy disproportionate improvements in R over long mission times.',
    provenance: 'insight',
  },
  {
    id: `${T}-n6`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'An MTBF of 250 months is quoted. Calculate the failure rate per month and the reliability after 500 months.',
    hint: 'λ = 1/m. Then note that 500 months is 2m.',
    solution: [
      { label: 'Given', content: 'm = 250 months, t = 500 months.' },
      { label: 'Equation', content: 'λ = 1/m; R = e^(−t/m)' },
      { label: 'Substitution', content: 'λ = 1/250 = 0.004 per month. t/m = 500/250 = 2, so R = e^(−2) = 0.1353.' },
      { label: 'Answer with unit', content: 'λ = 0.004 per month; R(500 months) = 0.135 (13.5%).' },
      { label: 'Verification', content: 'e^(−1)² = 0.3679² = 0.1353 ✓.' },
      { label: 'Interpretation', content: 'Two MTBFs leave only about 13.5% running. Plan replacement long before this point.' },
    ],
    engineeringExplanation: 'Reading a datasheet MTBF backwards into λ is a routine task. Do it before you trust any availability claim.',
    provenance: 'insight',
  },
  {
    id: `${T}-n7`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'For λ = 0.01 per month, calculate the time at which the reliability falls to 0.5 (the half-life of the population).',
    hint: 't = −ln(0.5)/λ, and ln(0.5) = −0.6931.',
    solution: [
      { label: 'Given', content: 'λ = 0.01 per month, R = 0.5.' },
      { label: 'Equation', content: 't = −ln(R)/λ' },
      { label: 'Substitution', content: 't = 0.6931/0.01 = 69.31 months.' },
      { label: 'Answer with unit', content: 't = 69.3 months (about 5.8 years).' },
      { label: 'Verification', content: 'λt = 0.6931 → R = e^(−0.6931) = 0.500 ✓.' },
      { label: 'Interpretation', content: 'Half-life = ln(2)/λ = 0.693 m. It is shorter than the MTBF by a factor of 0.693 — another reason not to read MTBF as “life”.' },
    ],
    engineeringExplanation: 'Half-life is a friendlier number than MTBF for non-specialists, and it is derived from exactly the same law.',
    provenance: 'insight',
  },
  {
    id: `${T}-n8`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: '400 units are installed with λ = 0.015 per month. How many are expected to still be running after 36 months?',
    hint: 'Find λt, then R, then multiply by the population.',
    solution: [
      { label: 'Given', content: 'N = 400, λ = 0.015 per month, t = 36 months.' },
      { label: 'Equation', content: 'R = e^(−λt); survivors = N × R' },
      { label: 'Substitution', content: 'λt = 0.54. R = e^(−0.54) = 0.5827. Survivors = 400 × 0.5827 = 233.1.' },
      { label: 'Answer with unit', content: 'About 233 units running; about 167 failed.' },
      { label: 'Verification', content: '233 + 167 = 400 ✓.' },
      { label: 'Interpretation', content: 'A 42% attrition over three years is a major spares and labour commitment. The probability alone would not have communicated that; the count does.' },
    ],
    engineeringExplanation: 'Always finish a reliability calculation by multiplying by the population — that is the number that appears in a budget.',
    provenance: 'insight',
  },
  {
    id: `${T}-n9`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Determine',
    prompt: 'R = 0.6065 is measured after 50 months of operation. Determine the constant failure rate and the MTBF.',
    hint: 'λ = −ln(R)/t, and note that ln(0.6065) = −0.5 exactly.',
    solution: [
      { label: 'Given', content: 'R = 0.6065 at t = 50 months.' },
      { label: 'Equation', content: 'λ = −ln(R)/t; m = 1/λ' },
      { label: 'Substitution', content: 'ln(0.6065) = −0.5000. λ = 0.5000/50 = 0.010 per month. m = 1/0.010 = 100 months.' },
      { label: 'Answer with unit', content: 'λ = 0.010 per month; m = 100 months.' },
      { label: 'Verification', content: 'R = e^(−0.010 × 50) = e^(−0.5) = 0.6065 ✓.' },
      { label: 'Interpretation', content: 'Back-calculating λ from field survival data is the usual way a real λ is obtained — datasheet values are estimates until the field confirms them.' },
    ],
    engineeringExplanation: 'Field-derived λ beats datasheet λ. Measure it over the flat region and update the spares model with it.',
    provenance: 'insight',
  },
  {
    id: `${T}-n10`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Analyze',
    prompt: 'A supplier quotes λ = 0.02 per month. A second supplier quotes λ = 0.24 per year for an apparently different product. Show that the two quotes describe the same reliability, and state the reliability after 2 years.',
    hint: 'Convert one rate into the other unit before you compare anything.',
    solution: [
      { label: 'Given', content: 'λ₁ = 0.02 per month; λ₂ = 0.24 per year; t = 2 years = 24 months.' },
      { label: 'Equation', content: 'λ per year = 12 × λ per month; R = e^(−λt)' },
      { label: 'Substitution', content: '0.02 per month × 12 = 0.24 per year — identical. λt = 0.02 × 24 = 0.48 (or 0.24 × 2 = 0.48). R = e^(−0.48) = 0.6188.' },
      { label: 'Answer with unit', content: 'The quotes are the same failure rate; R(2 years) = 0.619 (61.9%).' },
      { label: 'Verification', content: 'Both unit systems give λt = 0.48, which is the dimensionless check.' },
      { label: 'Interpretation', content: 'The exponent must be dimensionless. Converting units before substituting is not pedantry — it is the difference between 0.619 and a nonsense answer.' },
    ],
    engineeringExplanation: 'Unit mismatch is the single most common numerical error in this topic. Write the unit next to every λ you are given.',
    provenance: 'insight',
  },
  {
    id: `${T}-n11`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A system consists of two independent blocks in series with R₁ = 0.90 and R₂ = 0.80 over the same period. Calculate the system reliability and explain what you must label about this calculation.',
    hint: 'For a series system the reliabilities multiply. Then state the provenance honestly.',
    solution: [
      { label: 'Given', content: 'R₁ = 0.90, R₂ = 0.80, independent blocks in series.' },
      { label: 'Equation (Engineering Insight)', content: 'R_series = R₁ × R₂' },
      { label: 'Substitution', content: 'R = 0.90 × 0.80 = 0.72.' },
      { label: 'Answer with unit', content: 'R_system = 0.72 (72%).' },
      { label: 'Provenance note', content: 'The supplied material gives the exponential law for equipment; the series-product rule is standard engineering practice and must be labelled Engineering Insight, not presented as a source result.' },
      { label: 'Interpretation', content: 'Series blocks multiply, so every added block lowers system reliability. This is the quantitative form of the source’s “Complexity of equipment” factor.' },
    ],
    engineeringExplanation: 'The series-product rule is the mathematical reason that simplicity is a reliability strategy rather than a stylistic preference.',
    provenance: 'insight',
  },
  {
    id: `${T}-n12`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Determine',
    prompt: 'A specification requires R ≥ 0.95 over 60 months. Determine the maximum allowable constant failure rate and the corresponding MTBF.',
    hint: 'λ_max = −ln(0.95)/60.',
    solution: [
      { label: 'Given', content: 'R = 0.95, t = 60 months.' },
      { label: 'Equation', content: 'λ_max = −ln(R)/t; m = 1/λ' },
      { label: 'Substitution', content: 'ln(0.95) = −0.051293. λ = 0.051293/60 = 8.549 × 10⁻⁴ per month. m = 1/8.549 × 10⁻⁴ = 1169.7 months.' },
      { label: 'Answer with unit', content: 'λ_max = 8.55 × 10⁻⁴ per month; m_min = 1170 months (about 97 years).' },
      { label: 'Verification', content: 'λt = 8.549 × 10⁻⁴ × 60 = 0.051293 → R = 0.950 ✓.' },
      { label: 'Interpretation', content: 'A five-year 95% requirement is demanding: it implies an MTBF of roughly a century. If a supplier offers it cheaply, ask how λ was measured.' },
    ],
    engineeringExplanation: 'Long mission times with high reliability targets produce absurd-looking MTBF numbers. That is the arithmetic, and it is why redundancy or maintainability is usually the practical answer.',
    provenance: 'insight',
  },
  {
    id: `${T}-n13`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'If R(t) = 0.90, what is R(2t)? Express the result both as a formula and as a number.',
    hint: 'R(2t) = e^(−2λt) = [e^(−λt)]².',
    solution: [
      { label: 'Given', content: 'R(t) = 0.90.' },
      { label: 'Equation', content: 'R(2t) = [R(t)]²' },
      { label: 'Substitution', content: 'R(2t) = 0.90² = 0.81.' },
      { label: 'Answer with unit', content: 'R(2t) = 0.81 (81%).' },
      { label: 'Verification', content: 'Also check R(3t) = 0.90³ = 0.729 — the decay is geometric.' },
      { label: 'Interpretation', content: 'Doubling the mission time costs more than the 10% you already had: you go from 90% to 81%, losing 19%.' },
    ],
    engineeringExplanation: 'Reliability decays geometrically with time, not linearly. Every extension of the mission window is more expensive than the last.',
    provenance: 'insight',
  },
  {
    id: `${T}-n14`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Verify',
    prompt: 'A device with a catalogue constant failure rate λ = 0.004 per month is reported to lose 30% of its population in the first month. Verify whether the constant-λ model is consistent with that observation.',
    hint: 'Compute what the model predicts for month 1 and compare with 30%.',
    solution: [
      { label: 'Given', content: 'λ = 0.004 per month, t = 1 month, observed loss = 30%.' },
      { label: 'Equation', content: 'R(1) = e^(−λt); F = 1 − R' },
      { label: 'Substitution', content: 'λt = 0.004. R(1) = e^(−0.004) = 0.9960. F(1) = 0.0040 = 0.40%.' },
      { label: 'Answer with unit', content: 'Model predicts 0.40% loss; observed is 30% — a factor of about 75. The model is not consistent.' },
      { label: 'Verification', content: 'The λ implied by the observation is −ln(0.70)/1 = 0.357 per month, about 90 times the catalogue value.' },
      { label: 'Interpretation', content: 'A 30% first-month loss is infant mortality, not a constant-rate random failure. No single λ can describe both the first month and later life.' },
    ],
    engineeringExplanation: 'This is the numerical form of “check which region you are in”. Compare predicted and observed before you trust any model.',
    provenance: 'insight',
  },
  {
    id: `${T}-n15`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A plant requires that no more than 25 of 500 units fail in 12 months. Calculate the required reliability and the maximum allowable constant failure rate.',
    hint: 'Allowed failures 25 of 500 → F ≤ 0.05 → R ≥ 0.95. Then λ = −ln(R)/t.',
    solution: [
      { label: 'Given', content: 'N = 500, allowed failures = 25, t = 12 months.' },
      { label: 'Equation', content: 'F = 25/500; R = 1 − F; λ = −ln(R)/t' },
      { label: 'Substitution', content: 'F = 0.05, so R = 0.95. λ = 0.051293/12 = 4.274 × 10⁻³ per month.' },
      { label: 'Answer with unit', content: 'R ≥ 0.95 required; λ_max = 4.27 × 10⁻³ per month (m ≥ 234 months).' },
      { label: 'Verification', content: 'Expected failures = 500 × (1 − e^(−0.004274 × 12)) = 500 × 0.05 = 25 ✓.' },
      { label: 'Interpretation', content: 'A spare-parts constraint written as a count converts directly into a reliability specification. This is how most real reliability requirements arrive.' },
    ],
    engineeringExplanation: 'Requirements rarely arrive as probabilities. Learn to convert counts, budgets and uptime targets into R and λ.',
    provenance: 'insight',
  },

  /* ---------------- BATHTUB-CURVE ANALYSIS (5) ---------------- */
  {
    id: `${T}-b1`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'A population of 300 units loses 22 units in month 1, 2 in month 2, 1 in month 3 and about 1 per month thereafter. Identify the region of the bathtub curve, justify the identification from the numbers, and state the component-level improvement action.',
    hint: 'Convert raw counts to failures per unit at risk, then look at whether the rate rises, falls or is flat.',
    solution: [
      { label: 'Given', content: 'Failures: 22, 2, 1, then ≈1 per month steady, out of 300 installed.' },
      {
        label: 'Analysis',
        content:
          'Failure rate month 1 = 22/300 = 7.33%. Month 2 = 2/278 = 0.72%. Month 3 = 1/276 = 0.36%. Month 4+ ≈ 1/274 = 0.36%. The rate FALLS and then flattens.',
      },
      { label: 'Identification', content: 'Infant mortality, followed by entry into the useful-life (random failure) region.' },
      {
        label: 'Causes (source)',
        content:
          'Defect or errors during manufacturing, poor quality raw material, wrong assembly, improper insulation, poor fitting. The source calls this the burn-in period.',
      },
      {
        label: 'Component-level action',
        content:
          'Burn-in or run-in screening at the supplier so the weak population fails before delivery; incoming quality control and lot acceptance testing; approved material sources; verified assembly and insulation work instructions.',
      },
    ],
    engineeringExplanation:
      'Raw failure counts fall even when the rate is constant, simply because fewer units remain. Always divide by the units at risk before deciding which region you are in.',
    provenance: 'source',
  },
  {
    id: `${T}-b2`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Failures per month divided by units at risk rise steadily from month 48 onwards in an installation running continuously at maximum rated load. Identify the region, explain the source’s Graph A / Graph B observation, and state the improvement actions at component and system level.',
    hint: 'A rising failure rate after long usage is one region only. Then bring in stress severity.',
    solution: [
      { label: 'Identification', content: 'Wear-out region — failure rate rises with time after long usage.' },
      {
        label: 'Source observation',
        content:
          'The supplied material states that the number of components is kept in operation at maximum rated condition and the failure rate is plotted against time, and that the graph can be plotted for two stress severities: Graph A (high stress severity) and Graph B (low stress severity).',
      },
      {
        label: 'Component-level action',
        content:
          'Reduce stress severity — operate below maximum rated condition; select long-life parts for the dominant ageing mechanism; improve thermal management; schedule preventive replacement before the knee.',
      },
      {
        label: 'System-level action',
        content:
          'Planned replacement interval derived from the rising part of the curve; condition monitoring instead of a fixed guess; make the wearing parts replaceable modules; provision spares against the wear-out forecast.',
      },
      {
        label: 'Design connection',
        content:
          'Running at maximum rated condition is a design decision. Derating moves the installation from Graph A towards Graph B.',
      },
    ],
    engineeringExplanation:
      'Wear-out is the only region where “replace it before it fails” is the correct strategy. In the other two regions scheduled replacement wastes the remaining life of good units.',
    provenance: 'source',
  },
  {
    id: `${T}-b3`,
    topicId: T,
    type: 'circuit-analysis',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Justify',
    prompt: 'Justify, using the bathtub curve, why the exponential law R = e^(−λt) may not be applied across the whole life of a product.',
    hint: 'State the assumption, then say in which regions the assumption is false.',
    solution: [
      { label: 'Given', content: 'R = e^(−λt) with a single constant λ.' },
      {
        label: 'Principle',
        content:
          'The exponential law follows from a constant failure rate. Where λ(t) changes, the correct expression is R(t) = exp(−∫λ(τ)dτ), which only reduces to e^(−λt) when λ is constant.',
      },
      {
        label: 'Region by region',
        content:
          'Infant mortality: λ(t) falls, so a constant λ over-predicts early survival. Useful life: λ(t) is constant, so the law is valid. Wear-out: λ(t) rises, so a constant λ under-predicts failures.',
      },
      {
        label: 'Source support',
        content:
          'The source states that in the random-failure region the failure rate is constant, and that wear-out failures are observed by running components at maximum rated condition and plotting failure rate against time.',
      },
    ],
    engineeringExplanation:
      'This is the most examined idea in the topic: the law is not wrong, it is regional. Saying where it is valid is what separates a pass from a first class.',
    provenance: 'source',
  },
  {
    id: `${T}-b4`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Map',
    prompt:
      'Map the five failure types given in the supplied table (Initial, Early, Random, Catastrophic, Wear out) onto the three regions of the bathtub curve, and comment on the one that does not fit neatly.',
    hint: 'Four of the five are phase-tagged in the source. One is tagged by consequence instead of by phase.',
    solution: [
      { label: 'Region 1 — Infant mortality', content: 'Initial (during initial phase) and Early (immediately after short time of installation).' },
      { label: 'Region 2 — Useful life', content: 'Random (during arbitrary instance) — the source states the failure rate is constant here.' },
      { label: 'Region 3 — Wear-out', content: 'Wear out (after long usage of equipment).' },
      {
        label: 'The one that does not fit',
        content:
          'Catastrophic is defined in the source as “Major failure for long time” — a description of consequence, not of phase. A catastrophic failure can occur in any region. Do not force it into one.',
      },
    ],
    engineeringExplanation:
      'Recognising which classifications are by phase and which are by consequence prevents a common exam muddle. Say so explicitly and you gain a mark most candidates drop.',
    provenance: 'source',
  },
  {
    id: `${T}-b5`,
    topicId: T,
    type: 'circuit-analysis',
    level: 4,
    marks: 5,
    skill: 'analysis',
    action: 'Evaluate',
    prompt:
      'A supplier proposes a 48-hour burn-in for every unit before delivery, at extra cost. Evaluate the proposal: what it removes, what it costs, what it does NOT fix, and the condition under which you would accept it.',
    hint: 'Burn-in acts on one region only. Name the region, then name what is left over.',
    solution: [
      {
        label: 'What it removes',
        content:
          'The infant-mortality population — the units that would have failed in the first weeks after installation (source causes: manufacturing defects, poor raw material, wrong assembly, improper insulation, poor fitting).',
      },
      {
        label: 'What it costs',
        content:
          'Test time and fixtures, extra handling, and some consumption of the service life of every good unit. A badly specified burn-in can itself damage healthy units.',
      },
      {
        label: 'What it does NOT fix',
        content:
          'It does not change the constant failure rate of the useful-life region, and it does not delay wear-out. If your field failures are random or age-related, burn-in will not reduce them.',
      },
      {
        label: 'Condition for acceptance',
        content:
          'Accept it when the observed failure rate is clearly falling in early life (infant mortality) and the cost of a field failure exceeds the burn-in cost per unit by a wide margin. Otherwise it is money spent on a problem you do not have.',
      },
    ],
    engineeringExplanation:
      'Every reliability action is regional. The skill is matching the action to the region the data actually shows — not to the region you hope it is.',
    provenance: 'insight',
  },

  /* ---------------- RELIABILITY DESIGN (5) ---------------- */
  {
    id: `${T}-d1`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt:
      'Design the reliability specification for a remote monitoring unit that must be at least 95% reliable over 24 months. Give the allowable failure rate, the required MTBF, and one procurement clause that makes the requirement testable.',
    hint: 'Convert the reliability target into λ, then into MTBF, then write a clause someone can verify.',
    solution: [
      { label: 'Requirement', content: 'R ≥ 0.95 at t = 24 months.' },
      { label: 'Equation', content: 'λ_max = −ln(R)/t; m = 1/λ' },
      { label: 'Calculation', content: 'ln(0.95) = −0.051293. λ_max = 0.051293/24 = 2.137 × 10⁻³ per month. m_min = 468 months.' },
      { label: 'Answer with unit', content: 'λ ≤ 2.14 × 10⁻³ per month; MTBF ≥ 468 months (about 39 years).' },
      {
        label: 'Procurement clause',
        content:
          '“The supplier shall demonstrate, by field data or an agreed test, a constant failure rate not exceeding 2.14 × 10⁻³ per month over a 24-month operating period, in the stated environment.” Without the environment and the period, the number is unenforceable.',
      },
    ],
    engineeringExplanation:
      'A reliability requirement is only a requirement if someone can test it. Always attach the period, the environment and the measurement method.',
    provenance: 'insight',
  },
  {
    id: `${T}-d2`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt:
      '500 units will be deployed and the maintenance budget allows for at most 25 failures in 12 months. Convert this constraint into a reliability requirement and a maximum allowable failure rate, then state what else the design must specify.',
    hint: 'Failures allowed → F → R → λ. Then ask what the constraint does NOT cover.',
    solution: [
      { label: 'Requirement', content: 'N = 500; allowed failures ≤ 25 in 12 months.' },
      { label: 'Equation', content: 'F = 25/500 = 0.05; R = 1 − F = 0.95; λ = −ln(R)/t' },
      { label: 'Calculation', content: 'λ = 0.051293/12 = 4.274 × 10⁻³ per month. m = 234 months.' },
      { label: 'Answer with unit', content: 'R ≥ 0.95 at 12 months; λ ≤ 4.27 × 10⁻³ per month.' },
      {
        label: 'What the constraint does not cover',
        content:
          'It says nothing about WHEN the 25 failures occur. Twenty-five failures in month 1 (infant mortality) is a very different problem from 25 spread over the year. The specification must also state the early-life acceptance limit and the region in which λ was measured.',
      },
    ],
    engineeringExplanation:
      'A count-based budget hides the time distribution. Add an early-life acceptance limit and you close the loophole.',
    provenance: 'insight',
  },
  {
    id: `${T}-d3`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Select',
    prompt:
      'Two transmitter designs are offered for a 300-unit installation over 24 months. A: λ = 0.010/month, ₹6,000 per unit. B: λ = 0.030/month, ₹3,500 per unit. Select one and justify the selection with the numbers, stating the condition under which your choice would change.',
    hint: 'Compute expected failures for each, add replacement cost to purchase cost, then price the extra failures.',
    solution: [
      { label: 'Given', content: 'λ_A = 0.010, λ_B = 0.030 per month; t = 24 months; N = 300; costs ₹6,000 and ₹3,500.' },
      {
        label: 'Calculation',
        content:
          'R_A = e^(−0.24) = 0.7866 → failures = 300 × 0.2134 = 64. R_B = e^(−0.72) = 0.4868 → failures = 300 × 0.5132 = 154.',
      },
      {
        label: 'Costs',
        content:
          'Purchase: A = ₹18.0 lakh, B = ₹10.5 lakh. Replacement: A = 64 × 6,000 = ₹3.84 lakh; B = 154 × 3,500 = ₹5.39 lakh. Totals: A ≈ ₹21.84 lakh, B ≈ ₹15.89 lakh.',
      },
      {
        label: 'Selection',
        content:
          'On purchase plus replacement only, B is cheaper by about ₹5.95 lakh. Choose B if a failure costs only the replacement unit. Choose A if the 90 extra failures cost more than about ₹6,600 each in downtime, labour or process upset.',
      },
      {
        label: 'Condition that changes the answer',
        content:
          'The break-even downtime cost per failure is ₹5.95 lakh / 90 ≈ ₹6,600. Above it, A wins; below it, B wins. State the number rather than the preference.',
      },
    ],
    engineeringExplanation:
      'Reliability is an economic parameter. The mark is not for picking A or B — it is for naming the break-even condition that decides it.',
    provenance: 'insight',
  },
  {
    id: `${T}-d4`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 6,
    skill: 'design',
    action: 'Design',
    prompt:
      'Produce a complete reliability improvement plan for an installation of 200 units: one component-level action and one product/system-level action for each of the three regions of the bathtub curve.',
    hint: 'Six actions in total. Keep each one in its own region — do not reuse the same action twice.',
    solution: [
      { label: 'Region 1 — Infant mortality', content: 'Component: burn-in screening and incoming lot acceptance testing. System: supplier qualification with lot traceability, plus a commissioning test before hand-over.' },
      { label: 'Region 2 — Useful life', content: 'Component: derate below maximum rated voltage, current, power and temperature; add overvoltage, reverse-polarity and surge protection. System: design margin and worst-case analysis, enclosure and thermal design that keeps internal conditions inside the ratings, operator training against mishandling.' },
      { label: 'Region 3 — Wear-out', content: 'Component: reduce stress severity and select long-life parts for the dominant ageing mechanism. System: condition-based replacement before the knee, wearing parts as replaceable modules, spares matched to the wear-out forecast.' },
      {
        label: 'Cross-cutting',
        content:
          'Attack the source’s “Complexity of equipment” factor directly: fewer parts and fewer connectors raise reliability in every region at once.',
      },
      {
        label: 'Verification',
        content:
          'Re-measure λ after each action and recompute R for the mission time. An action that does not move a measured number has not been verified.',
      },
    ],
    engineeringExplanation:
      'A plan with one action addresses one region. Most real installations need all three, and the cheapest one is usually attacking complexity.',
    provenance: 'source',
  },
  {
    id: `${T}-d5`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt:
      'Using the source definition of maintainability, design a maintenance policy for an installation where a failure takes an average of 45 days to correct. State what you would change and why, without changing the reliability of the product.',
    hint: 'Maintainability is about repair time T, not about failure rate. What levers change T?',
    solution: [
      { label: 'Definition (source)', content: 'Maintainability is the probability that failed equipment is restored to the designed specifications in a known time (down time) under stated conditions: M(t) = Pr(T ≤ t), where T is the repair time.' },
      { label: 'Given', content: 'Mean repair time T ≈ 45 days; M(45 days) ≈ 0.5 for a roughly symmetric distribution.' },
      {
        label: 'Levers that change T, not λ',
        content:
          'Hold critical spares on site instead of ordering them; design the unit as a swap-out module so the repair happens on the bench; provide built-in fault indication so the fault is diagnosed on the first visit; train the site technician; shorten the visit interval.',
      },
      {
        label: 'Policy',
        content:
          'Hold 10% of the population as on-site spares, make the unit a tool-free swap module, and require built-in self-test. Target M(24 hours) ≥ 0.9 rather than accepting 45 days.',
      },
      {
        label: 'Why this works',
        content:
          'Availability ≈ R combined with M. Improving M from 45 days to 24 hours raises availability without spending anything on a lower λ — often the cheapest improvement available.',
      },
    ],
    engineeringExplanation:
      'When reliability improvements are expensive, look at maintainability. It is a separate lever and the source gives it its own definition for exactly that reason.',
    provenance: 'source',
  },

  /* ---------------- DEBUGGING / WHAT-IF (5) ---------------- */
  {
    id: `${T}-w1`,
    topicId: T,
    type: 'debugging',
    level: 5,
    marks: 5,
    skill: 'debugging',
    action: 'Debug',
    prompt:
      'A population of 300 newly installed units loses 22 in month 1, 2 in month 2, 1 in month 3 and about 1 per month thereafter. The maintenance team proposes monthly site visits. Diagnose the fault, propose the correct fix, and say why the proposal is wrong.',
    hint: 'Compute the failure rate per unit at risk, name the region, then ask whether visiting more often changes the failure rate.',
    solution: [
      { label: 'Measure', content: 'Rate month 1 = 22/300 = 7.33%; month 2 = 2/278 = 0.72%; month 3+ ≈ 0.36%. The rate falls then flattens.' },
      { label: 'Diagnosis', content: 'Infant mortality (early failure / burn-in period), then entry into the useful-life region.' },
      { label: 'Why the proposal is wrong', content: 'Monthly visits change how quickly a failed unit is found; they do not change the failure rate. The units were already defective before installation.' },
      { label: 'Correct fix', content: 'Burn-in screening and incoming lot acceptance testing at the supplier, plus a commissioning test before hand-over.' },
      { label: 'Prevention', content: 'Supplier qualification and lot traceability; design for correct assembly; verified insulation and fitting instructions.' },
    ],
    engineeringExplanation: 'Distinguish “detect the failure sooner” from “prevent the failure”. Only the second is a reliability action.',
    provenance: 'insight',
  },
  {
    id: `${T}-w2`,
    topicId: T,
    type: 'debugging',
    level: 5,
    marks: 5,
    skill: 'debugging',
    action: 'Find the error',
    prompt:
      'An engineer measures λ = 0.004 per month over the first six months and forecasts R(60) = e^(−0.24) = 0.787. The plant counts only 61% surviving at 60 months, and the gap grows every quarter. Find the error and state the correct action.',
    hint: 'The arithmetic is right. Ask what λ does with time, and compute the λ implied by the observation.',
    solution: [
      { label: 'Check the arithmetic', content: 'λt = 0.004 × 60 = 0.24, R = 0.787. The arithmetic is correct — so the error is in the model, not the numbers.' },
      { label: 'Implied λ', content: '−ln(0.61)/60 = 0.4943/60 = 8.24 × 10⁻³ per month, about twice the early-life value.' },
      { label: 'Error', content: 'A constant λ measured early in life was extrapolated across the wear-out region, where λ rises with time.' },
      { label: 'Correct action', content: 'Stop using a single constant λ. Plan condition-based replacement before the wear-out knee and reduce the operating stress severity (the plant runs at maximum rated condition).' },
      { label: 'Prevention', content: 'Plot failures per month divided by units at risk so you can see λ(t) change shape; only use the flat region for a constant-λ model.' },
    ],
    engineeringExplanation: 'The most expensive reliability error in industry is not a wrong λ — it is a right λ used in the wrong region.',
    provenance: 'insight',
  },
  {
    id: `${T}-w3`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Predict',
    prompt: 'Predict what happens to the bathtub curve if the operating stress severity is increased, and state the consequence for the validity of R = e^(−λt).',
    hint: 'The source plots two stress severities, Graph A and Graph B. Which knee moves, and in which direction?',
    solution: [
      { label: 'Prediction', content: 'Higher stress severity (Graph A) raises the failure rate and moves the wear-out knee to earlier times; the useful-life region shortens.' },
      { label: 'Consequence for the model', content: 'The window over which a constant λ is valid becomes shorter, so a λ measured early in life becomes invalid sooner.' },
      { label: 'Quantitative form (Engineering Insight)', content: 'The useful-life λ itself usually rises with stress, so both the height of the flat region and its width change.' },
      { label: 'Engineering action', content: 'Derating is therefore a reliability action: it lengthens the region in which your model is valid, not only the life of the parts.' },
    ],
    engineeringExplanation: 'Stress severity is the physical link between how hard you run a product and how long your mathematical model stays true.',
    provenance: 'source',
  },
  {
    id: `${T}-w4`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Predict',
    prompt: 'λ is reduced from 0.020 to 0.010 per month. Predict the reliability at 24 months before and after, and state whether the improvement is proportional to the change in λ.',
    hint: 'Compute both values, then compare the ratio of reliabilities with the ratio of failure rates.',
    solution: [
      { label: 'Before', content: 'λt = 0.020 × 24 = 0.48 → R = e^(−0.48) = 0.6188.' },
      { label: 'After', content: 'λt = 0.010 × 24 = 0.24 → R = e^(−0.24) = 0.7866.' },
      { label: 'Answer with unit', content: 'R rises from 0.619 to 0.787 — a factor of 1.27, while λ fell by a factor of 2.' },
      { label: 'Verification', content: 'R_after/R_before = e^(0.24) = 1.271 ✓.' },
      { label: 'Interpretation', content: 'The improvement is NOT proportional. Halving λ raises R by a factor of e^(λt/2), which depends on how long the mission is — the longer the mission, the more a λ reduction is worth.' },
    ],
    engineeringExplanation: 'Because the gain from reducing λ grows with mission time, reliability investment pays off most on long-lived installations.',
    provenance: 'insight',
  },
  {
    id: `${T}-w5`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Predict',
    prompt: 'A design achieves R = 0.90 over 12 months. The customer extends the requirement to 24 months with no design change. Predict the new reliability and the extra failures in a 300-unit population.',
    hint: 'R(2t) = [R(t)]².',
    solution: [
      { label: 'Given', content: 'R(12) = 0.90, N = 300.' },
      { label: 'Equation', content: 'R(2t) = [R(t)]²; extra failures = N(R(t) − R(2t))' },
      { label: 'Substitution', content: 'R(24) = 0.90² = 0.81. Failures at 12 months = 300 × 0.10 = 30. Failures at 24 months = 300 × 0.19 = 57. Extra = 27 units.' },
      { label: 'Answer with unit', content: 'R(24) = 0.81; 27 extra failures in a 300-unit population.' },
      { label: 'Verification', content: '19% of 300 = 57 ✓, and 57 − 30 = 27 ✓.' },
      { label: 'Interpretation', content: 'Doubling the mission time nearly doubled the failure count (30 → 57), not the 10% you might expect. Re-open the reliability budget whenever a mission time is extended.' },
    ],
    engineeringExplanation: 'Requirement changes are the commonest cause of a reliability shortfall. Re-run the number before you accept an extended mission time.',
    provenance: 'insight',
  },

  /* ---------------- VIVA (10) ---------------- */
  {
    id: `${T}-v1`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 2,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why is reliability expressed probabilistically rather than as a fixed lifetime?',
    hint: 'Two identical units in the same environment do not fail at the same instant.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because failure time varies from unit to unit due to manufacturing, assembly and environmental variation. A single lifetime figure would be false for almost every individual unit. A probability statement — “about 62% will still be running at 24 months” — is true of the population and is directly usable for spares and maintenance planning.',
      },
    ],
    engineeringExplanation: 'Push for the consequence: the probability form is what makes the number usable for planning.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'If two identical units sit side by side, why does one fail first?',
        expected:
          'Because no two units are truly identical: component tolerances, solder joints, assembly variation and small differences in local temperature and load all differ. Reliability describes the distribution of failure times, not a single instant.',
      },
      {
        teacher: 'So can I tell the customer when a particular unit will fail?',
        expected:
          'No. You can only give the probability that it is still working at a stated time under stated conditions, and the expected number of failures in a population.',
      },
    ],
  },
  {
    id: `${T}-v2`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why does the exponential reliability model require a constant failure-rate assumption?',
    hint: 'Where does e^(−λt) come from mathematically?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'R(t) = e^(−λt) is the solution of the reliability differential equation with a constant hazard rate λ. If the failure rate varies with time the solution is R(t) = exp(−∫λ(τ)dτ), which only collapses to e^(−λt) when λ is constant. The bathtub curve shows that λ is constant only in the useful-life region.',
      },
    ],
    engineeringExplanation: 'This is the question that decides whether the candidate understands the law or has memorised it.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'In which region of the bathtub curve may I use it?',
        expected: 'Only in the useful-life (random failure) region, where the source states the failure rate is constant.',
      },
      {
        teacher: 'What is the error if I use it across wear-out?',
        expected: 'It under-predicts failures, because the real λ is rising. The error grows with time.',
      },
    ],
  },
  {
    id: `${T}-v3`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why does the bathtub curve have three regions?',
    hint: 'Name the physical mechanism that dominates in each region.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because three different mechanisms dominate at different times. Early on, a weak sub-population with manufacturing defects fails and is removed, so the rate falls. Then failures are random and the rate is flat. Finally ageing mechanisms accumulate and the rate rises. The shape is the sum of those three effects.',
      },
    ],
    engineeringExplanation: 'Three regions because there are three mechanisms. Name the mechanism and the answer is secure.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Can a product skip a region?',
        expected:
          'It can skip infant mortality if it is properly screened, and it may be replaced before wear-out if the service life ends inside the useful-life region. The curve describes the population you actually field.',
      },
      {
        teacher: 'Which region would you rather sell into?',
        expected: 'The useful-life region — that is the only one where you can quote a single λ honestly.',
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
    action: 'Compare',
    prompt: 'Why are early failures fundamentally different from wear-out failures?',
    hint: 'One is a population defect, the other is a time-accumulated mechanism.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Early failures come from a weak sub-population created during manufacture and assembly — defects, poor raw material, wrong assembly, improper insulation, poor fitting. They are present at t = 0 and are removed as the weak units fail. Wear-out failures are caused by ageing accumulated during operation, especially at maximum rated condition; they are absent at t = 0 and appear later. The first is a quality problem, the second is a physics-of-ageing problem, and they need opposite remedies.',
      },
    ],
    engineeringExplanation: 'Screening fixes the first, replacement and derating fix the second. Applying the wrong remedy is the classic error.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'So does burn-in help with wear-out?',
        expected:
          'No. Burn-in removes the weak population only. It does not change the ageing mechanism, and a badly specified burn-in can consume some of the useful life of good units.',
      },
    ],
  },
  {
    id: `${T}-v5`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 3,
    skill: 'viva',
    action: 'Interpret',
    prompt: 'Your product has MTBF = 100 months. A customer says “so it lasts 100 months”. Correct them.',
    hint: 'Use the source’s own anchor point.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'No. MTBF is the reciprocal of the failure rate, m = 1/λ. The supplied material states that at t = m the reliability is e^(−1) = 0.37, so after 100 months only about 37% of the population is expected to be running — roughly two-thirds have already failed. MTBF is a time constant, not a service life.',
      },
    ],
    engineeringExplanation: 'This is the most important practical correction in the topic. Say the 37% figure and the viva is won.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'When would 90% of them still be running?',
        expected:
          'Solve e^(−λt) = 0.90 with λ = 0.01 per month: t = −ln(0.9)/0.01 = 10.5 months. Only about 10 months.',
      },
      {
        teacher: 'Then why do datasheets quote MTBF at all?',
        expected:
          'Because it is a convenient single parameter for a constant failure rate, and it lets a buyer compare products on the same basis. It is a comparison parameter, not a lifetime promise.',
      },
    ],
  },
  {
    id: `${T}-v6`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 2,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why must the units of λ and t match before you substitute into R = e^(−λt)?',
    hint: 'What kind of quantity is an exponent allowed to be?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'An exponent must be dimensionless. λ is a rate — the source states it as failure per month — so t must be in months. If λ is quoted per year and t is in months you must convert one of them first, otherwise the answer is meaningless. The unit check is also the quickest way to catch a mis-read datasheet.',
      },
    ],
    engineeringExplanation: 'Candidates lose more marks on units in this topic than on the mathematics.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'A supplier quotes λ = 0.24 per year. What is it per month?',
        expected: '0.24/12 = 0.02 per month.',
      },
    ],
  },
  {
    id: `${T}-v7`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Justify',
    prompt: 'Why does burn-in improve field reliability but not the inherent design reliability?',
    hint: 'Burn-in removes units; it does not change the ones that survive.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Burn-in removes the weak sub-population before delivery, so the units the customer receives have a lower early failure rate — field reliability improves. But the surviving units are unchanged: their random failure rate and their ageing behaviour are exactly what they were. Inherent design reliability is set by the design margin, the component grades and the stress levels, and only design changes can move it.',
      },
    ],
    engineeringExplanation: 'Screening changes which units you ship; design changes what a unit is.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Can burn-in ever make things worse?',
        expected:
          'Yes. A burn-in that is too long or too severe consumes part of the useful life of good units and can even induce failures, moving the wear-out knee earlier.',
      },
    ],
  },
  {
    id: `${T}-v8`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'A colleague averages the falling early failure rate and the rising wear-out rate and uses the average in R = e^(−λt). Why is this wrong?',
    hint: 'The exponential of an average is not the average of the exponentials.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Averaging λ(t) over the whole life gives a single number that is correct nowhere: it over-predicts failures during the flat region and under-predicts them during wear-out. The correct expression when λ varies is R(t) = exp(−∫λ(τ)dτ). Averaging the rate is not the same as integrating it, and in the regions that matter the two differ substantially.',
      },
    ],
    engineeringExplanation: 'The honest answer is to model each region separately, or to restrict the calculation to the flat region.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'What would you do instead?',
        expected:
          'Use the constant λ only for the useful-life region and a separate wear-out model (or a scheduled replacement plan) beyond it.',
      },
    ],
  },
  {
    id: `${T}-v9`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why does reducing stress severity extend the useful life of a product?',
    hint: 'The source plots two stress severities — Graph A and Graph B. Where does the knee go?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Ageing mechanisms accelerate with electrical, thermal and mechanical stress. The supplied material notes that the failure-rate curve can be plotted for two stress severities, Graph A (high) and Graph B (low). Lower stress moves the wear-out knee to later times, which lengthens the flat useful-life region. Derating is therefore a reliability action, not merely a safety margin.',
      },
    ],
    engineeringExplanation: 'Link it back to Topic 1: operating temperature range is the entry point for stress severity.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Give me a concrete derating rule.',
        expected:
          'Operate components below their maximum rated voltage, current, power and temperature — for example, keep electrolytic capacitors well below their rated voltage and temperature, since they are usually the first wear-out mechanism in a power supply.',
      },
    ],
  },
  {
    id: `${T}-v10`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Distinguish',
    prompt: 'Why is maintainability not the same as reliability, and why does the distinction matter to a plant?',
    hint: 'One is about not failing; the other is about being restored.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Reliability R(t) is the probability the unit is still performing at time t. Maintainability M(t) is the probability that a failed unit is restored to specification within time t, where t is repair time. They are independent levers: a moderately reliable product that is repaired in an hour can deliver better availability than a very reliable one that takes six weeks to repair. For a plant, availability is what matters, and it can be bought from either lever.',
      },
    ],
    engineeringExplanation: 'When reliability improvements are expensive, maintainability is usually the cheaper lever — which is why the source defines it separately.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Which lever would you pull first on a tight budget?',
        expected:
          'Usually maintainability: on-site spares, modular swap-out design and built-in fault indication are cheap and act immediately, whereas lowering λ requires redesign and requalification.',
      },
    ],
  },

  /* ---------------- MCQ (15) ---------------- */
  {
    id: `${T}-q1`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The exponential law of reliability is:',
    options: [
      { id: 'a', text: 'R = e^(−λt)' },
      { id: 'b', text: 'R = e^(λt)' },
      { id: 'c', text: 'R = 1 − e^(−λt)' },
      { id: 'd', text: 'R = λt' },
    ],
    answerId: 'a',
    hint: 'Reliability decreases with time, so the exponent must be negative.',
    solution: [
      { label: 'Answer', content: '(a) R = e^(−λt)' },
      { label: 'Note', content: '(c) is the unreliability F(t), not the reliability.' },
    ],
    engineeringExplanation: 'Learn R and F as a pair: R = e^(−λt) and F = 1 − e^(−λt).',
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
    prompt: 'In the supplied material, λ is defined as:',
    options: [
      { id: 'a', text: 'The mean time between failures' },
      { id: 'b', text: 'The system failure rate (failure per month)' },
      { id: 'c', text: 'The reliability of the equipment' },
      { id: 'd', text: 'The repair time' },
    ],
    answerId: 'b',
    hint: 'λ has units of 1/time; m = 1/λ is the MTBF.',
    solution: [{ label: 'Answer', content: '(b) The system failure rate (failure per month)' }],
    engineeringExplanation: 'λ is a rate. Anything quoted as “hours” is m, not λ.',
    provenance: 'source',
  },
  {
    id: `${T}-q3`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'numerical',
    action: 'Select',
    prompt: 'If t = m, the reliability is:',
    options: [
      { id: 'a', text: '0.50' },
      { id: 'b', text: '0.63' },
      { id: 'c', text: '0.37' },
      { id: 'd', text: '1.00' },
    ],
    answerId: 'c',
    hint: 'The source states this result explicitly: R = e^(−1) = 0.37.',
    solution: [
      { label: 'Answer', content: '(c) 0.37' },
      { label: 'Common slip', content: '0.63 is the unreliability F at t = m, not the reliability. Read the question twice.' },
    ],
    engineeringExplanation: '0.37 and 0.63 are both correct numbers for different quantities — the distractor is built from exactly that slip.',
    provenance: 'source',
  },
  {
    id: `${T}-q4`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'For λ = 0.01 per month, the MTBF is:',
    options: [
      { id: 'a', text: '0.01 months' },
      { id: 'b', text: '10 months' },
      { id: 'c', text: '100 months' },
      { id: 'd', text: '1000 months' },
    ],
    answerId: 'c',
    hint: 'm = 1/λ.',
    solution: [{ label: 'Answer', content: '(c) 100 months' }],
    engineeringExplanation: 'The reciprocal carries the unit: per month in the denominator gives months in the result.',
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
    prompt: 'The region of the bathtub curve in which the failure rate is constant is the:',
    options: [
      { id: 'a', text: 'Infant mortality region' },
      { id: 'b', text: 'Useful life (random failure) region' },
      { id: 'c', text: 'Wear-out region' },
      { id: 'd', text: 'Burn-in period' },
    ],
    answerId: 'b',
    hint: 'This is the only region where a single λ is legitimate.',
    solution: [
      { label: 'Answer', content: '(b) Useful life (random failure) region' },
      { label: 'Note', content: 'The burn-in period is another name for the infant-mortality region, so (d) is a synonym of (a).' },
    ],
    engineeringExplanation: 'Two of the four options mean the same thing. Spotting that eliminates half the choices immediately.',
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
    prompt: 'The early failure period is also called the:',
    options: [
      { id: 'a', text: 'Useful-life period' },
      { id: 'b', text: 'Random-failure period' },
      { id: 'c', text: 'Burn-in period' },
      { id: 'd', text: 'Wear-out period' },
    ],
    answerId: 'c',
    hint: 'The source names it after listing the early-failure reasons.',
    solution: [{ label: 'Answer', content: '(c) Burn-in period' }],
    engineeringExplanation: 'The alternative name is also the remedy — burn the units in so the weak population fails on the bench.',
    provenance: 'source',
  },
  {
    id: `${T}-q7`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'Which of the following is NOT among the causes of early failure listed in the supplied material?',
    options: [
      { id: 'a', text: 'Wrong assembly' },
      { id: 'b', text: 'Poor quality raw material' },
      { id: 'c', text: 'Improper insulation' },
      { id: 'd', text: 'Exceeding operating conditions' },
    ],
    answerId: 'd',
    hint: 'One of these belongs to the random-failure region, not to early failure.',
    solution: [
      { label: 'Answer', content: '(d) Exceeding operating conditions' },
      { label: 'Why', content: 'The source lists exceeding operating conditions under random failure, together with mishandling.' },
    ],
    engineeringExplanation: 'The source’s cause lists are region-specific. Mixing them is the most common table error in answers.',
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
    prompt: 'Maintainability M(t), as defined in the supplied material, is:',
    options: [
      { id: 'a', text: 'The probability that the unit performs its function for time t' },
      { id: 'b', text: 'The probability that a failed unit is restored within time t' },
      { id: 'c', text: 'The reciprocal of the failure rate' },
      { id: 'd', text: 'One minus the reliability' },
    ],
    answerId: 'b',
    hint: 'M(t) = Pr(T ≤ t) where T is the repair time.',
    solution: [
      { label: 'Answer', content: '(b)' },
      { label: 'Note', content: '(a) is reliability, (c) is MTBF, (d) is unreliability. Four definitions, four different letters.' },
    ],
    engineeringExplanation: 'R, F, M and m are four different symbols. Confusing them is the fastest way to lose the whole topic in an exam.',
    provenance: 'source',
  },
  {
    id: `${T}-q9`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'For λ = 0.02 per month, R(24 months) is approximately:',
    options: [
      { id: 'a', text: '0.38' },
      { id: 'b', text: '0.62' },
      { id: 'c', text: '0.79' },
      { id: 'd', text: '0.95' },
    ],
    answerId: 'b',
    hint: 'λt = 0.48, so R = e^(−0.48).',
    solution: [{ label: 'Answer', content: '(b) 0.62' }],
    engineeringExplanation: 'Sanity check without a calculator: e^(−0.5) ≈ 0.607, and 0.48 is slightly less severe, so slightly above 0.61.',
    provenance: 'insight',
  },
  {
    id: `${T}-q10`,
    topicId: T,
    type: 'mcq',
    level: 3,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A requirement of R ≥ 0.95 over 12 months implies a maximum failure rate of about:',
    options: [
      { id: 'a', text: '4.27 × 10⁻³ per month' },
      { id: 'b', text: '8.55 × 10⁻⁴ per month' },
      { id: 'c', text: '0.05 per month' },
      { id: 'd', text: '0.95 per month' },
    ],
    answerId: 'a',
    hint: 'λ = −ln(0.95)/12 = 0.05129/12.',
    solution: [{ label: 'Answer', content: '(a) 4.27 × 10⁻³ per month' }],
    engineeringExplanation: '(b) is the answer for a 60-month horizon — the same question with a different period. Always check t.',
    provenance: 'insight',
  },
  {
    id: `${T}-q11`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The supplied material defines reliability as the ability to perform the intended function under stated conditions for:',
    options: [
      { id: 'a', text: 'An unlimited period' },
      { id: 'b', text: 'A stated period of time' },
      { id: 'c', text: 'The warranty period only' },
      { id: 'd', text: 'The MTBF' },
    ],
    answerId: 'b',
    hint: 'All three qualifiers must be stated.',
    solution: [{ label: 'Answer', content: '(b) A stated period of time' }],
    engineeringExplanation: 'Without a stated period, “reliable” is not a requirement — it is an adjective.',
    provenance: 'source',
  },
  {
    id: `${T}-q12`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'Graph A and Graph B in the supplied wear-out material refer to:',
    options: [
      { id: 'a', text: 'Two different product classes' },
      { id: 'b', text: 'Two different stress severities (high and low)' },
      { id: 'c', text: 'Reliability and unreliability curves' },
      { id: 'd', text: 'Infant mortality and wear-out curves' },
    ],
    answerId: 'b',
    hint: 'The source labels Graph A and Graph B explicitly.',
    solution: [{ label: 'Answer', content: '(b) Two different stress severities (high and low)' }],
    engineeringExplanation: 'Stress severity is the physical variable behind the wear-out knee. Derating moves you from Graph A towards Graph B.',
    provenance: 'source',
  },
  {
    id: `${T}-q13`,
    topicId: T,
    type: 'mcq',
    level: 3,
    marks: 1,
    skill: 'analysis',
    action: 'Select',
    prompt:
      'A population shows a failure rate of 7.3% in month 1, falling to about 0.36% per month from month 4 onward. The population is in:',
    options: [
      { id: 'a', text: 'Wear-out' },
      { id: 'b', text: 'Useful life throughout' },
      { id: 'c', text: 'Infant mortality, entering useful life' },
      { id: 'd', text: 'Catastrophic failure' },
    ],
    answerId: 'c',
    hint: 'A falling rate that then flattens is the signature of one region followed by another.',
    solution: [
      { label: 'Answer', content: '(c) Infant mortality, entering useful life' },
      { label: 'Note', content: 'Catastrophic describes the consequence of a failure, not a phase of life.' },
    ],
    engineeringExplanation: 'Always convert raw failure counts to a rate before naming the region — counts fall automatically as the population shrinks.',
    provenance: 'insight',
  },
  {
    id: `${T}-q14`,
    topicId: T,
    type: 'mcq',
    level: 3,
    marks: 1,
    skill: 'analysis',
    action: 'Select',
    prompt: 'Using a λ measured during the first six months to forecast year five will usually:',
    options: [
      { id: 'a', text: 'Over-predict failures' },
      { id: 'b', text: 'Under-predict failures' },
      { id: 'c', text: 'Be exactly correct' },
      { id: 'd', text: 'Be invalid because λ is always zero' },
    ],
    answerId: 'b',
    hint: 'What happens to λ if the population reaches the wear-out region?',
    solution: [
      { label: 'Answer', content: '(b) Under-predict failures' },
      { label: 'Why', content: 'λ rises with time in the wear-out region, so the constant-λ forecast is optimistic.' },
    ],
    engineeringExplanation: 'The direction of the error matters: an optimistic spares forecast is the expensive kind.',
    provenance: 'insight',
  },
  {
    id: `${T}-q15`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'Which of the following is one of the four factors affecting reliability of equipment listed in the supplied material?',
    options: [
      { id: 'a', text: 'Advertising budget' },
      { id: 'b', text: 'Storage of product' },
      { id: 'c', text: 'Number of competitors' },
      { id: 'd', text: 'Warranty period offered' },
    ],
    answerId: 'b',
    hint: 'The four are: design, manufacturing quality, storage and environment.',
    solution: [{ label: 'Answer', content: '(b) Storage of product' }],
    engineeringExplanation: 'Storage is easy to overlook: a product can lose reliability sitting in a warehouse before it is ever switched on.',
    provenance: 'source',
  },
]

export const TOPIC2_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Bathtub Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const
