import type { DesignChallengeSpec, ModeContent, Question, TopicMeta } from '../../types'
import type { MatrixOption, MatrixParam } from '../../components/MatrixBuilder'

export const TOPIC6: TopicMeta = {
  id: 'u1t6',
  index: 6,
  title: 'Design Matrix',
  shortTitle: 'Design Matrix',
  hook: 'A design is a set of decisions under constraints. The matrix is where you write them down and own them.',
  status: 'live',
}

export const SOURCE_NOTE6 = {
  primary:
    'Supplied course material: the assignment asks “Explain how System Performance Matrix and Design Matrix is used for decision-making during product development and system design” (TY ESD 2026 ISE1, Unit 1, Q.3). As with the performance matrix, the supplied material does not define the design matrix in words — but the “Classification of Electronic Product” table is itself a requirements-to-parameters artefact and is used here as the model.',
  coverage:
    'The seven supplied parameters, the reliability definitions and the op-amp and logic-interface material from this unit all feed the design matrices built here. The construction procedure, the weighting method and all scenario values are Engineering Insight.',
}

export const DESIGN_PARAMS: MatrixParam[] = [
  { id: 'accuracy', label: 'Measurement accuracy', higherIsBetter: true, defaultWeight: 5 },
  { id: 'env', label: 'Environmental capability', higherIsBetter: true, defaultWeight: 4 },
  { id: 'power', label: 'Power (5 = lowest consumption)', higherIsBetter: true, defaultWeight: 3 },
  { id: 'cost', label: 'Unit cost (5 = most affordable)', higherIsBetter: true, defaultWeight: 4 },
  { id: 'service', label: 'Serviceability', higherIsBetter: true, defaultWeight: 3 },
  { id: 'complexity', label: 'Complexity (5 = simplest)', higherIsBetter: true, defaultWeight: 2 },
]

export const DESIGN_OPTIONS: MatrixOption[] = [
  {
    id: 'single',
    label: 'Single-channel, general-purpose op-amp',
    scores: { accuracy: 2, env: 3, power: 4, cost: 5, service: 4, complexity: 5 },
  },
  {
    id: 'precision',
    label: 'Single-channel precision op-amp, derated',
    scores: { accuracy: 4, env: 4, power: 4, cost: 3, service: 4, complexity: 4 },
  },
  {
    id: 'redundant',
    label: 'Dual redundant precision channels with changeover',
    scores: { accuracy: 5, env: 5, power: 2, cost: 1, service: 2, complexity: 1 },
  },
]

/* ------------------------------------------------------------------ */
/* Mode content                                                        */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'A design matrix is the document you write before you draw the circuit: requirements on one axis, design parameters on the other, and a decision in every cell you care about.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — Two engineers, two circuits, no way to reconcile them',
      provenance: 'insight',
      body: [
        'Two engineers are asked to design the same temperature transmitter. One produces a single precision amplifier; the other produces a dual redundant architecture. Both work. Both are defensible. Neither engineer can say which is right, because the requirements were never turned into design parameters.',
        'A design matrix is the artefact that would have settled it — before either circuit was drawn.',
      ],
      bullets: [
        'What is required? A decision that can be traced back to the requirement.',
        'What is given? A specification, several constraints, and more than one workable architecture.',
        'What is missing? A written mapping from requirements to parameters, with the trade-offs recorded.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Requirement, constraint, parameter',
      provenance: 'insight',
      body: [
        'Three words that are routinely used interchangeably and must not be.',
      ],
      bullets: [
        'Requirement — what the product must do, with a number where possible: “measure 0 to 100 °C to ±1 °C”.',
        'Constraint — a limit on how you may do it: “must run from a 2-wire loop”, “unit cost below ₹2,000”, “no field calibration”.',
        'Parameter — the design quantity you can actually choose: gain, resistor values, device grade, supply voltage, filter cut-off, channel count.',
        'A design matrix maps requirements and constraints onto parameters and records what each choice costs.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — What a design matrix looks like',
      provenance: 'insight',
      body: [
        'Rows are the design parameters; columns are the candidate design decisions or architectures; each cell records how that decision performs against that parameter.',
        'Like the performance matrix, it carries weights — but the weights come from the constraints, and the matrix explicitly records the trade-off each decision makes.',
      ],
      bullets: [
        'The supplied classification table is the closest thing in the course material: it maps the requirement (“which product class do I need?”) onto seven parameters with entries for each candidate.',
        'A design matrix adds the two things that table lacks: weights, and a record of what each choice gives up.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why write it down at all?',
      provenance: 'insight',
      body: [
        'Because every design decision is a trade, and an unrecorded trade is a future argument with no evidence.',
        'Six months later someone will ask why the expensive part was chosen. The matrix answers with the requirement, the weight and the alternative that was rejected — instead of with a shrug.',
      ],
      bullets: [
        'It makes the trade-off reviewable while the decision is still cheap to change.',
        'It exposes decisions that were made by habit rather than by requirement.',
        'It is the fastest way to see the effect of a requirement change: move one row and read the consequences.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Build one in seven steps',
      provenance: 'insight',
      body: ['Follow the order. Each step depends on the one before it.'],
      bullets: [
        'Step 1 — List every requirement with its number and unit.',
        'Step 2 — List every constraint, including the commercial ones.',
        'Step 3 — Derive the design parameters you can actually choose.',
        'Step 4 — Propose at least two candidate architectures that satisfy the requirements.',
        'Step 5 — Score each candidate against each parameter, marking the direction of each parameter.',
        'Step 6 — Weight from the constraints and compute.',
        'Step 7 — Record the trade-off in words: “we chose X, which costs us Y, because of constraint Z”.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Weighted design matrix',
      provenance: 'insight',
      body: [
        'Move the weights and watch which architecture wins. Note that the redundant architecture is superb on accuracy and poor on cost, complexity and power — exactly the trade the written record has to capture.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Reading the trade',
      provenance: 'insight',
      body: [
        'Three candidate architectures scored on six parameters. Every score runs in the “good” direction, so 5 is always best: power is entered as low consumption, cost as affordability, complexity as simplicity.',
      ],
      bullets: [
        'Single general-purpose channel: accuracy 2, environment 3, power 4, cost 5 (cheapest), serviceability 4, complexity 5 (simplest).',
        'Single precision channel, derated: accuracy 4, environment 4, power 4, cost 3, serviceability 4, complexity 4.',
        'Dual redundant precision: accuracy 5, environment 5, power 2 (hungriest), cost 1 (dearest), serviceability 2, complexity 1 (most complex).',
        'With the default weights the precision single channel leads by only 0.19 points — inside the noise of subjective scoring, so the honest record is “precision, with the general-purpose channel not excluded”. The redundant architecture wins only when accuracy and environment are weighted far above cost and complexity.',
        'The recorded trade: “we chose the single derated precision channel; it costs us the redundancy margin, because the unit-cost constraint is binding at this volume”.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: ['Each of these is a requirements-change question. Answer with the new ranking and the reason.'],
      bullets: [
        'What if the accuracy requirement tightens from ±1 °C to ±0.2 °C? The general-purpose channel drops out and the matrix shifts toward the precision or redundant options.',
        'What if the unit-cost ceiling is removed? The redundant architecture becomes competitive immediately — which tells you the decision was always a cost decision.',
        'What if the product must run from a 2-wire loop? Power becomes a hard constraint, and the redundant architecture fails on it.',
        'What if field service is unavailable for ten years? Serviceability rises in weight and the modular single channel is favoured over integrated redundancy.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Constraints decide, requirements describe',
      provenance: 'insight',
      body: [
        'Requirements tell you what to achieve. Constraints decide which of the ways to achieve it is permissible — and in practice the binding constraint is usually cost, power, size or time.',
        'A design matrix that lists requirements but omits constraints will recommend an excellent design that cannot be built, sold or serviced.',
      ],
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'Use the matrix to justify a real design: derive the parameters from a specification, score honestly, and write the trade-off down in a sentence.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The design that met every requirement and failed the review',
      provenance: 'insight',
      body: [
        'A signal conditioner meets its accuracy, bandwidth and temperature requirements. The review board rejects it anyway, because it uses a part with a twelve-week lead time and needs field calibration that the customer cannot perform.',
        'Both objections are constraints, and neither appeared in the design matrix — because the matrix only listed requirements.',
      ],
      bullets: [
        'Required: a matrix that includes the constraints as well as the requirements.',
        'Given: a specification and a rejected design.',
        'Which axis was incomplete? The constraints.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Constraints are parameters too',
      provenance: 'insight',
      body: [
        'Availability, lead time, field calibration, service access, supply voltage, enclosure size and unit cost are all design parameters: you choose them or you choose within them, and each one eliminates options.',
        'Treating them as “commercial detail” and keeping them out of the matrix is the commonest cause of a design that passes its requirements and fails its review.',
      ],
      bullets: [
        'Lead time and availability remove options before any technical scoring begins.',
        'Field calibration removes options that depend on adjustment after installation.',
        'Supply voltage and power budget remove options that need more energy than the installation can provide.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why at least two candidate architectures?',
      provenance: 'insight',
      body: [
        'Because a matrix with one column cannot make a decision — it can only describe one. The second option is what forces you to articulate the trade-off.',
        'If you cannot write down a second workable architecture, you have not explored the design space; you have rationalised the first idea that came to mind.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Turn a specification into a design matrix',
      provenance: 'insight',
      body: ['Worked from a real specification, in order.'],
      bullets: [
        'Step 1 — Requirement: 0 to 100 °C, ±1 °C, 4–20 mA two-wire loop, −20 °C to +70 °C ambient, 8-year life, no field calibration.',
        'Step 2 — Constraints: loop-powered so the total budget is under 4 mA; unit cost ceiling; no field adjustment; standard parts only.',
        'Step 3 — Parameters: sensor type, excitation, gain, offset method, device grade, filter cut-off, calibration method, channel architecture.',
        'Step 4 — Candidates: a single precision channel with digital calibration, and a dual redundant channel with analogue trimming.',
        'Step 5 — Score with evidence, marking cost, power and complexity as lower-is-better.',
        'Step 6 — Weight from the constraints: power 5 (loop budget is a hard limit), cost 4, accuracy 4, environment 3, serviceability 3, complexity 2.',
        'Step 7 — Record the trade: the single digitally calibrated channel wins because the redundant option cannot fit the loop power budget.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Design matrix with live weights',
      provenance: 'insight',
      body: [
        'Set the power weight to its maximum and watch the redundant architecture fall away. That is the loop-power constraint doing its work in the matrix.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Finding the binding constraint',
      provenance: 'insight',
      body: [
        'With only two parameters — accuracy (weight w) and cost (weight 5 − w) — compare the precision single channel and the redundant pair.',
      ],
      bullets: [
        'Precision single: good-scores accuracy 4, cost 3. Weighted = 4w + 3(5 − w) = 15 + w.',
        'Redundant pair: good-scores accuracy 5, cost 1. Weighted = 5w + 1(5 − w) = 5 + 4w.',
        'Equal when 15 + w = 5 + 4w → w = 3.33.',
        'So redundancy only wins when the accuracy weight exceeds about 3.3 out of 5.',
        'Add the power constraint and the redundant option fails outright before the weights matter — a hard constraint beats any weighting.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Design sensitivity',
      provenance: 'insight',
      body: ['Change one requirement at a time and record what the matrix does.'],
      bullets: [
        'What if the accuracy requirement loosens? The precision part is no longer justified and the general-purpose channel wins on cost.',
        'What if the product must be field-calibratable after all? The digital-calibration option gains a parameter it scores well on.',
        'What if a second source is required for every part? Availability becomes a weighted parameter and single-sourced precision parts lose ground.',
        'What if the volume doubles? Amortised development cost falls, so options with higher development effort and lower unit cost become more attractive.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Design matrix versus performance matrix',
      provenance: 'insight',
      body: [
        'The two matrices in this unit answer different questions and are used at different points.',
      ],
      bullets: [
        'Performance matrix — compares existing candidate systems against performance parameters; used to select between options.',
        'Design matrix — maps requirements and constraints onto the parameters you will actually choose; used to justify and record the design you then build.',
        'In a real project: performance matrix to choose the architecture, then design matrix to justify every parameter within it.',
      ],
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode writes Unit 1 Q.3 in 8-mark form, with the design matrix fully defined, constructed and interpreted.',
  blocks: [
    {
      kind: 'problem',
      title: 'EXAM QUESTION — 8 Marks',
      provenance: 'source',
      body: [
        'Q. Explain how System Performance Matrix and Design Matrix is used for decision-making during product development and system design.',
      ],
      sourceRef: 'TY ESD 2026 ISE1 — Unit 1, Q.3',
    },
    {
      kind: 'concept',
      title: 'Model answer — (1) Definitions (2 marks)',
      provenance: 'insight',
      body: [
        'A design matrix maps the requirements and constraints of a product onto the design parameters that the engineer can choose, recording for each candidate decision how it performs and what it costs.',
        'A system performance matrix compares candidate systems against defined performance parameters with weights, and ranks them.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (2) How each is built (3 marks)',
      provenance: 'source',
      body: [
        'The supplied classification table shows the structure: parameters as rows, candidate systems as columns, entries in the cells. For a design matrix the rows become the design parameters and the columns the candidate architectures.',
      ],
      bullets: [
        'Design matrix steps: list requirements with units → list constraints → derive choosable parameters → propose at least two architectures → score with evidence → weight from the constraints → record the trade-off in words.',
        'Performance matrix steps: list candidate systems → derive parameters from the requirement → mark directions → score → weight → stress-test.',
        'Both require directions to be marked: cost, power, size and complexity are lower-is-better.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Model answer — (3) Worked example (2 marks)',
      provenance: 'insight',
      body: [
        'Present a small design matrix and state the decision it produced.',
      ],
      bullets: [
        'Candidates: single general-purpose channel; single precision channel with derating; dual redundant precision channels.',
        'Parameters: measurement accuracy ↑, environmental capability ↑, power ↓, unit cost ↓, serviceability ↑, design complexity ↓.',
        'Result: the single derated precision channel leads under balanced weights; the redundant option wins only if accuracy and environment are weighted far above cost, power and complexity.',
        'Recorded trade: “we chose the single precision channel; it costs us redundancy, because the unit-cost and loop-power constraints are binding”.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (4) Use in decision-making (1 mark)',
      provenance: 'insight',
      body: [
        'Both matrices turn an intuitive choice into a reviewable argument. The performance matrix is used early, to select between system options; the design matrix is used throughout, to justify each parameter and to record the trade-off that was accepted.',
        'Their value is not the ranking — it is that the weights, the evidence and the rejected alternatives are all on paper while the decision is still cheap to change.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme and common mistakes',
      provenance: 'insight',
      body: [
        '2 marks — both matrices defined, with the distinction between them clear.',
        '3 marks — construction steps, using the supplied classification table as the structural model.',
        '2 marks — a worked example with numbers and a stated decision.',
        '1 mark — how they are used in decision-making.',
      ],
      bullets: [
        'Common mistake 1: describing the two matrices as if they were the same thing.',
        'Common mistake 2: listing requirements but omitting constraints.',
        'Common mistake 3: giving a ranking with no recorded trade-off.',
      ],
    },
  ],
}

export const TOPIC6_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* Design challenge                                                    */
/* ------------------------------------------------------------------ */

export const DM_DESIGN: DesignChallengeSpec = {
  id: 'u1t6-design-loop-transmitter',
  title: 'Design Challenge — Two-wire temperature transmitter design matrix',
  provenance: 'insight',
  requirement:
    'Design the architecture of a two-wire 4–20 mA temperature transmitter: 0 to 100 °C input, ±1 °C accuracy, −20 °C to +70 °C ambient, 8-year life, no field calibration, standard parts only, tight unit cost. Build the design matrix and record the trade-off.',
  constraints: [
    'Two-wire loop powered — the entire transmitter must run inside the 4 mA budget, including the sensor excitation.',
    'Accuracy ±1 °C over 0 to 100 °C.',
    'Ambient −20 °C to +70 °C; 8-year life; no field calibration after installation.',
    'Standard, multi-sourced parts; tight unit-cost ceiling.',
  ],
  assumptions: [
    'The seven supplied classification parameters inform the environmental and serviceability rows.',
    'Engineering Insight: the scenario, the scoring scale, the weighting method and the arithmetic.',
  ],
  checks: [
    {
      id: 'params',
      label: 'Design parameters',
      ask: 'Name four design parameters you can actually choose for this product.',
      accepted: [
        'sensor type, gain, offset/zero method, device grade',
        'sensor, excitation, gain, calibration method',
        'sensor type, excitation current, amplifier gain, offset method, filter, device grade, channel architecture',
        'gain, offset, sensor, device grade',
      ],
      hints: [
        'Hint 1 — A parameter is something you can put a number on in the schematic.',
        'Hint 2 — Think about the signal chain: sensor → excitation → gain → offset → filter → device.',
        'Hint 3 — Sensor type, excitation current, amplifier gain, offset and span method, filter cut-off, device grade, channel architecture.',
      ],
      rationale:
        'Sensor type, excitation current, amplifier gain, offset and span method, filter cut-off, device grade, and channel architecture. Each is choosable and each has a measurable consequence — which is what makes them parameters rather than requirements.',
    },
    {
      id: 'binding',
      label: 'The binding constraint',
      ask: 'Which constraint eliminates options before any scoring begins, and which architecture does it remove?',
      accepted: [
        'the loop power budget (must run under 4 ma)',
        'power — dual redundant channels cannot fit the 4 ma budget',
        'the 4 ma loop budget removes the dual redundant architecture',
      ],
      hints: [
        'Hint 1 — Two-wire loop powered means the whole transmitter runs on the loop current.',
        'Hint 2 — The 4 mA floor is a hard ceiling on total consumption, sensor excitation included.',
        'Hint 3 — Dual redundant channels roughly double the analogue consumption and cannot fit — so power is a screen, not a weighted row.',
      ],
      rationale:
        'The loop power budget. Everything the transmitter does must happen inside the current it is allowed to draw, and that removes dual redundant architectures before any weighted scoring. This is why power should be entered as a screening constraint rather than as a weighted row — a hard limit is not a matter of degree.',
    },
    {
      id: 'calibration',
      label: 'Calibration strategy',
      ask: 'Given “no field calibration”, what offset and span method do you choose, and why?',
      accepted: [
        'digital calibration with stored coefficients, trimmed at manufacture',
        'factory digital calibration — no field-adjustable parts',
        'digital trim at manufacture; no trimpots in the field',
      ],
      hints: [
        'Hint 1 — “No field calibration” means nothing may require adjustment after installation.',
        'Hint 2 — Trimpots are field-adjustable, which is exactly what the constraint forbids — and they drift.',
        'Hint 3 — Calibrate at manufacture and store the coefficients digitally, with the reference and the sensor characterised on the bench.',
      ],
      rationale:
        'Factory digital calibration with coefficients stored in the device. It removes every field-adjustable element, which is what the constraint requires, and it removes the drift and handling risk that trimpots carry. The cost is a small amount of firmware and a characterised reference.',
    },
    {
      id: 'tradeoff',
      label: 'Record the trade-off',
      ask: 'Write the one-sentence trade-off record for your chosen architecture.',
      accepted: [
        'we chose a single derated precision channel with factory digital calibration; it costs us redundancy and some accuracy margin, because the loop-power and unit-cost constraints are binding',
        'chose single precision channel, gave up redundancy, due to power and cost constraints',
        'single precision channel — sacrificed redundancy for power and cost',
      ],
      hints: [
        'Hint 1 — The sentence has three parts: what you chose, what it cost, and why.',
        'Hint 2 — The “why” must name the binding constraint, not a preference.',
        'Hint 3 — “We chose X, which costs us Y, because constraint Z is binding.”',
      ],
      rationale:
        '“We chose a single derated precision channel with factory digital calibration; it costs us redundancy and some accuracy margin, because the loop-power and unit-cost constraints are binding.” That sentence is the deliverable — it lets a reviewer check the decision against the requirement six months later.',
    },
  ],
  solution: [
    { label: 'Requirement', content: '0 to 100 °C input, ±1 °C accuracy, two-wire 4–20 mA, −20 °C to +70 °C ambient, 8-year life, no field calibration, standard parts, tight unit cost.' },
    { label: 'Screening constraints', content: 'Loop power budget (must operate inside 4 mA) removes multi-channel architectures. Availability and multi-sourcing remove single-sourced parts. No field adjustment removes trimpot-based designs.' },
    { label: 'Parameters', content: 'Sensor type, excitation current, amplifier gain, offset and span method, filter cut-off, device grade, channel architecture.' },
    { label: 'Candidates', content: 'A: single general-purpose channel. B: single precision channel with derating and factory digital calibration. C: dual redundant precision channels.' },
    { label: 'Weighting', content: 'Power 5, unit cost 4, accuracy 4, environmental capability 3, serviceability 3, complexity 2 — each traced to a constraint or requirement line.' },
    { label: 'Outcome', content: 'Candidate B wins. Candidate A fails the accuracy requirement; candidate C fails the power screen and the cost constraint.' },
    { label: 'Verification', content: 'Accuracy budget checked against the op-amp VOS and drift from Topic 3; the loop budget checked against sensor excitation plus analogue plus digital consumption; the temperature range checked against the class entries from Topic 1.' },
    { label: 'Possible failure modes', content: 'Excitation current causing sensor self-heating; drift over eight years exceeding the accuracy budget; the reference drifting; a single-sourced precision part becoming unavailable.' },
    { label: 'Alternative', content: 'If the accuracy requirement were relaxed to ±2 °C, candidate A would win on cost and the precision part could be dropped — a reminder that the accuracy requirement is what makes the whole precision chain necessary.' },
  ],
  failureModes: [
    'Listing requirements but omitting the constraints that actually decide.',
    'Weighting a hard limit such as the loop power budget instead of screening on it.',
    'Proposing only one architecture, so no trade-off is ever recorded.',
    'Choosing a part that meets the specification but has a single source or a long lead time.',
    'Recording the decision without the sentence that says what it cost.',
  ],
  interpretation:
    'A design matrix is finished when you can write “we chose X, which costs us Y, because constraint Z is binding”. Until that sentence exists, the design has been described but not justified.',
}

/* ------------------------------------------------------------------ */
/* Question bank — 25                                                  */
/* ------------------------------------------------------------------ */

const T = 'u1t6'

export const TOPIC6_QUESTIONS: Question[] = [
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define a design matrix and state its purpose.',
    hint: 'Requirements and constraints mapped onto choosable parameters.',
    solution: [
      {
        label: 'Definition',
        content:
          'A design matrix maps the requirements and constraints of a product onto the design parameters the engineer can choose, recording for each candidate decision how it performs and what it costs.',
      },
      {
        label: 'Purpose',
        content:
          'To justify the design and to record the trade-offs while the decision is still cheap to change, so that it can be reviewed and defended later.',
      },
    ],
    engineeringExplanation: 'The deliverable is the recorded trade-off, not the table. A matrix with no written trade-off is unfinished.',
    provenance: 'insight',
  },
  {
    id: `${T}-c2`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Distinguish',
    prompt: 'Distinguish a requirement from a constraint from a design parameter, giving one example of each for a temperature transmitter.',
    hint: 'What it must do / what limits how / what you choose.',
    solution: [
      { label: 'Requirement', content: 'What the product must achieve, with a number: “measure 0 to 100 °C to ±1 °C”.' },
      { label: 'Constraint', content: 'A limit on how you may achieve it: “must run from a two-wire 4–20 mA loop”, “no field calibration”.' },
      { label: 'Design parameter', content: 'A quantity you actually choose in the design: gain, filter cut-off, excitation current, device grade, channel architecture.' },
      { label: 'Why the distinction matters', content: 'Constraints decide between options that all satisfy the requirements. A matrix that lists only requirements will recommend a design that cannot be built or sold.' },
    ],
    engineeringExplanation: 'In practice the binding constraint is usually cost, power, size or time — not the requirement everyone argued about.',
    provenance: 'insight',
  },
  {
    id: `${T}-c3`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'State the seven steps for building a design matrix.',
    hint: 'Requirements, constraints, parameters, candidates, scores, weights, trade-off.',
    solution: [
      {
        label: 'Steps',
        content:
          '1 List every requirement with its number and unit. 2 List every constraint, including commercial ones. 3 Derive the design parameters you can choose. 4 Propose at least two candidate architectures. 5 Score each candidate with evidence, marking parameter directions. 6 Weight from the constraints and compute. 7 Record the trade-off in words.',
      },
    ],
    engineeringExplanation: 'Step 4 is the one people skip, and it is the one that creates the trade-off the matrix exists to record.',
    provenance: 'insight',
  },
  {
    id: `${T}-c4`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Why must a design matrix include at least two candidate architectures?',
    hint: 'What does a matrix with one column decide?',
    solution: [
      {
        label: 'Answer',
        content:
          'A matrix with one column cannot make a decision — it can only describe one. The second candidate is what forces you to articulate what the first one gives up.',
      },
      {
        label: 'Deeper point',
        content:
          'If you cannot write down a second workable architecture, you have not explored the design space; you have rationalised the first idea that came to mind.',
      },
    ],
    engineeringExplanation: 'The rejected alternative is part of the record. Without it, there is no evidence that a choice was ever made.',
    provenance: 'insight',
  },
  {
    id: `${T}-c5`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain why a hard limit such as a loop power budget should be applied as a screening test rather than as a weighted row.',
    hint: 'What does weighting allow that screening does not?',
    solution: [
      {
        label: 'Answer',
        content:
          'Weighting lets a strong score on other parameters compensate for a poor score on the limit. Screening removes the offending option outright. Where the limit is absolute — the transmitter simply cannot draw more than the loop allows — compensation is not legitimate.',
      },
      {
        label: 'Rule',
        content: 'Screen on hard limits and on anything safety-related; weight on parameters that are genuinely a matter of degree.',
      },
    ],
    engineeringExplanation: 'Weighting a pass/fail limit is the subtlest way to reach a wrong answer with correct arithmetic.',
    provenance: 'insight',
  },

  {
    id: `${T}-m1`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Construct',
    prompt:
      'Construct a design matrix for a 0 to 100 °C, ±1 °C, two-wire 4–20 mA transmitter with no field calibration. Give the constraints, the parameters, two candidates and the recorded trade-off.',
    hint: 'Screen on the loop budget, then weight accuracy and cost.',
    solution: [
      { label: 'Constraints', content: 'Loop power budget under 4 mA; no field adjustment; standard multi-sourced parts; unit-cost ceiling; −20 °C to +70 °C ambient.' },
      { label: 'Parameters', content: 'Sensor type, excitation current, gain, offset and span method, filter cut-off, device grade, channel architecture.' },
      { label: 'Candidate A', content: 'Single precision channel, derated, factory digital calibration.' },
      { label: 'Candidate B', content: 'Dual redundant precision channels with analogue trimming.' },
      { label: 'Recorded trade-off', content: '“We chose candidate A; it costs us redundancy and some accuracy margin, because the loop-power and unit-cost constraints are binding.”' },
    ],
    engineeringExplanation: 'Note how the constraint, not the requirement, decided it. That is typical, and worth saying out loud in a review.',
    provenance: 'insight',
  },
  {
    id: `${T}-m2`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Construct',
    prompt:
      'Construct a design matrix comparing a 4–20 mA current loop against an RS-485 digital link for eight sensors spread over 200 m in a plant. List the parameters with directions and justify a recommendation.',
    hint: 'Noise immunity, wiring cost, diagnostic capability, power, complexity.',
    solution: [
      { label: 'Parameters', content: 'Noise immunity ↑, wiring cost ↓, diagnostic capability ↑, distance capability ↑, power available at the sensor ↓, receiver complexity ↓.' },
      { label: 'Directions', content: 'Higher is better for immunity, diagnostics and distance; lower is better for wiring cost, sensor power and receiver complexity.' },
      { label: 'Scores', content: '4–20 mA: immunity 5, wiring 4, diagnostics 2, distance 4, sensor power 4, complexity 5. RS-485: immunity 4, wiring 5, diagnostics 5, distance 5, sensor power 2, complexity 2.' },
      { label: 'Recommendation', content: 'For eight sensors over 200 m with diagnostics required, RS-485 usually wins on wiring cost and diagnostics; for a single sensor in a noisy area with power available at the device, 4–20 mA wins.' },
      { label: 'Caveat', content: 'The answer depends on whether the sensors are loop-powered — which is a constraint, and it screens rather than weights.' },
    ],
    engineeringExplanation: 'When the recommendation changes with the number of sensors, say so: the matrix is telling you where the decision boundary is.',
    provenance: 'insight',
  },
  {
    id: `${T}-m3`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Construct',
    prompt:
      'Construct a design matrix for selecting between a single high-resolution ADC with an external precision reference and a lower-resolution ADC with an internal reference, for a ±0.1% measurement.',
    hint: 'Accuracy, drift, cost, complexity, calibration.',
    solution: [
      { label: 'Parameters', content: 'Absolute accuracy ↑, temperature drift ↓, unit cost ↓, board area ↓, design complexity ↓, calibration effort ↓.' },
      { label: 'Directions', content: 'Higher is better for accuracy; lower is better for drift, cost, area, complexity and calibration effort.' },
      { label: 'Candidate A', content: 'High-resolution ADC plus external precision reference: accuracy 5, drift 5, cost 2, area 2, complexity 3, calibration 3.' },
      { label: 'Candidate B', content: 'Lower-resolution ADC with internal reference: accuracy 2, drift 2, cost 5, area 5, complexity 5, calibration 4.' },
      { label: 'Recommendation', content: 'Candidate A. A ±0.1% requirement cannot be met by an internal reference whose drift alone exceeds the budget — accuracy is a screening requirement here, not a weighted preference.' },
    ],
    engineeringExplanation: 'Check whether the requirement is a screen or a weight before scoring. Here it is a screen, and the cheaper option never gets scored.',
    provenance: 'insight',
  },
  {
    id: `${T}-m4`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Analyze',
    prompt:
      'Analyse this design matrix record and state what is wrong with it: “Candidate A scores 4.1, candidate B scores 4.0. Selected A.”',
    hint: 'What is missing besides the number?',
    solution: [
      { label: 'Missing 1', content: 'The weights. A score without the weights that produced it cannot be reviewed.' },
      { label: 'Missing 2', content: 'The sensitivity. A 0.1-point gap is inside the noise of subjective scoring; it should be reported as a tie.' },
      { label: 'Missing 3', content: 'The trade-off sentence: what A costs, and which constraint made it the right choice.' },
      { label: 'Missing 4', content: 'The evidence for the scores and a statement of what the matrix does not cover.' },
      { label: 'Correct form', content: '“A and B are effectively tied (4.1 vs 4.0). We selected A because it uses multi-sourced parts, which the availability constraint requires; it costs us 8% more unit cost.”' },
    ],
    engineeringExplanation: 'A number without its weights and its trade-off is not a decision record — it is a scoreboard.',
    provenance: 'insight',
  },
  {
    id: `${T}-m5`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Justify',
    prompt:
      'Justify the choice of a single derated precision channel over a dual redundant architecture for a loop-powered transmitter, using the design matrix arguments from this unit.',
    hint: 'Power is a hard constraint, not a preference.',
    solution: [
      { label: 'Constraint', content: 'The two-wire loop allows the transmitter only the current it draws below 4 mA — a hard ceiling on total consumption including sensor excitation.' },
      { label: 'Consequence', content: 'Dual redundant analogue channels roughly double consumption and cannot fit the budget. This is a screening failure, not a low score to be outweighed.' },
      { label: 'Derating', content: 'A single precision channel with derating addresses the useful-life failure region, which is where the constant-λ reliability model applies — matching the remedy to the region.' },
      { label: 'Recorded trade-off', content: '“We chose the single derated precision channel; it costs us redundancy and some accuracy margin, because the loop-power constraint is binding.”' },
      { label: 'When it would change', content: 'If the transmitter were four-wire with an external supply, power stops screening and the redundant option becomes competitive — the constraint, not the technology, made the decision.' },
    ],
    engineeringExplanation: 'This question ties the whole unit together: classification sets the environment, reliability sets the region, the op-amp sets the error budget, and the constraint decides.',
    provenance: 'insight',
  },

  {
    id: `${T}-a1`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse the following design decision: a team selects a high-precision, single-sourced op-amp that meets every technical requirement. Identify the constraint that was ignored and the consequence.',
    hint: 'Think beyond the datasheet.',
    solution: [
      { label: 'Ignored constraint', content: 'Availability and multi-sourcing, together with lead time.' },
      { label: 'Consequence', content: 'A single-sourced part creates supply risk: a long lead time delays production, an end-of-life notice forces a redesign, and a price change cannot be negotiated.' },
      { label: 'Matrix fix', content: 'Add availability, lead time and number of sources as weighted parameters — or, better, as a screening constraint if the project requires multi-sourcing.' },
      { label: 'Wider point', content: 'Constraints decide between options that all satisfy the requirements. Omitting them from the matrix guarantees a design that passes its specification and fails its review.' },
    ],
    engineeringExplanation: 'Supply risk is a design parameter. Treating it as a purchasing detail is how good designs become unbuildable products.',
    provenance: 'insight',
  },
  {
    id: `${T}-a2`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse a design matrix whose top-scoring option requires field calibration that the customer cannot perform. State what went wrong and how to correct the matrix.',
    hint: 'Calibration method is a design parameter.',
    solution: [
      { label: 'What went wrong', content: 'The “no field calibration” constraint was not translated into a parameter or a screen, so an option that violates it was scored and won.' },
      { label: 'Correction 1', content: 'Add the calibration method as a design parameter and score each architecture on it.' },
      { label: 'Correction 2', content: 'Better, apply “no field adjustment” as a screening constraint — it is pass/fail, not a matter of degree.' },
      { label: 'Design consequence', content: 'The winning architecture shifts to factory digital calibration with stored coefficients and no trimpots.' },
    ],
    engineeringExplanation: 'A constraint that is not in the matrix cannot influence the result. Translate every constraint into either a screen or a row.',
    provenance: 'insight',
  },
  {
    id: `${T}-a3`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse the effect of doubling the production volume on a design matrix that compares an option with high development cost and low unit cost against one with low development cost and high unit cost.',
    hint: 'One cost is paid once, the other per unit.',
    solution: [
      { label: 'Mechanism', content: 'Development cost is amortised across the batch; unit cost is paid on every unit. Doubling the volume halves the amortised development cost per unit and leaves the unit cost unchanged.' },
      { label: 'Effect', content: 'The high-development, low-unit-cost option improves with volume and will eventually win.' },
      { label: 'Link to the source', content: 'This is exactly the trade the supplied Cost entries describe: the Industry entry names “Development cost higher” rather than unit cost.' },
      { label: 'What to record', content: 'The break-even volume at which the ranking flips — that number is more useful than either ranking alone.' },
    ],
    engineeringExplanation: 'Always compute the break-even volume. It turns a preference into a number the commercial team can act on.',
    provenance: 'source',
  },
  {
    id: `${T}-a4`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse the trade-off recorded as “we chose the redundant architecture; it costs us power and cost”. State whether this is a complete record and, if not, complete it.',
    hint: 'The record needs the binding constraint.',
    solution: [
      { label: 'Assessment', content: 'Incomplete. It says what was chosen and what it cost, but not why the cost was acceptable.' },
      { label: 'Completed record', content: '“We chose the redundant architecture; it costs us power consumption and unit cost, because the availability requirement cannot be met by any single channel at the required confidence.”' },
      { label: 'Why the “why” matters', content: 'Without the binding requirement, a reviewer cannot tell whether the trade was justified or merely habitual — and cannot tell when it should be revisited.' },
      { label: 'Test', content: 'A complete record lets someone re-derive the decision from the requirement document alone.' },
    ],
    engineeringExplanation: 'Three parts: what you chose, what it cost, and which requirement or constraint made the cost acceptable.',
    provenance: 'insight',
  },
  {
    id: `${T}-a5`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Interpret',
    prompt:
      'Interpret a design matrix in which one candidate wins on every technical parameter and loses on cost. State the decision rule you would apply and why.',
    hint: 'Is cost a constraint or a weighted parameter here?',
    solution: [
      { label: 'First question', content: 'Is there a hard cost ceiling? If yes, cost is a screen and the technically best option is eliminated regardless of its scores.' },
      { label: 'If cost is a weighted parameter', content: 'Compute the cost weight at which the ranking flips and report it as the decision boundary.' },
      { label: 'Decision rule', content: 'Choose the cheapest option that satisfies every hard requirement. Over-specification is a defect; it spends money on margin nobody requested.' },
      { label: 'Link to the source', content: 'The supplied classification table makes the same point structurally — the Military column has the best technical entries and is still wrong for a consumer product because Cost is part of the package.' },
    ],
    engineeringExplanation: 'The rule “cheapest that satisfies everything” is the practical form of every matrix in this unit.',
    provenance: 'source',
  },

  {
    id: `${T}-t1`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Analyze',
    prompt: 'Analyse the trade-off between accuracy and power in a two-wire transmitter, and state how the design matrix should represent it.',
    hint: 'Accuracy is a requirement; power is a hard constraint.',
    solution: [
      { label: 'Relationship', content: 'Higher accuracy generally needs more excitation, more averaging, a better reference and a higher-grade amplifier — all of which consume current or add cost.' },
      { label: 'Representation', content: 'Power enters as a screening constraint because the loop budget is absolute; accuracy enters as a requirement that sets the error budget.' },
      { label: 'Consequence', content: 'The matrix does not trade accuracy against power — it eliminates any option that cannot fit the power budget, then scores accuracy among those that remain.' },
      { label: 'Recorded trade', content: '“We met ±1 °C within the loop budget by reducing the excitation current and averaging longer; this costs us response time.”' },
    ],
    engineeringExplanation: 'Not every trade is a weighting exercise. When one side is a hard limit, it screens — and saying so is the engineering content of the answer.',
    provenance: 'insight',
  },
  {
    id: `${T}-t2`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Analyze',
    prompt: 'Analyse the trade-off between designing for serviceability and designing for reliability, and state which the source would treat as a separate lever.',
    hint: 'Maintainability has its own definition in the supplied material.',
    solution: [
      { label: 'Reliability lever', content: 'Failing less often — better parts, derating, redundancy. Costs money per unit and takes development time.' },
      { label: 'Serviceability lever', content: 'Being restored faster — modular swap-out, on-site spares, built-in fault indication. Usually cheaper and acts immediately.' },
      { label: 'Source support', content: 'The supplied material defines maintainability separately as M(t) = Pr(T ≤ t), where T is repair time — confirming that they are different quantities.' },
      { label: 'Decision rule', content: 'When reliability improvements are expensive, look at maintainability first. Availability can be bought from either lever.' },
      { label: 'Matrix representation', content: 'Include both as parameters and weight them by whether the installation allows quick intervention — a site with a six-month visit interval weights reliability heavily.' },
    ],
    engineeringExplanation: 'Two levers, different costs, different timescales. A matrix that only contains one will always recommend it.',
    provenance: 'source',
  },
  {
    id: `${T}-t3`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Analyze',
    prompt: 'Analyse the trade-off between design complexity and every other parameter, and state why the source treats complexity as a defect in itself.',
    hint: 'Find complexity in the supplied failure-factor list.',
    solution: [
      { label: 'Effect', content: 'Every added part, connector and feature adds cost, board area, power, test time, documentation and a failure mechanism.' },
      { label: 'Source support', content: 'The supplied material lists “Complexity of equipment” among the factors responsible for failure — complexity is a reliability parameter, not merely an aesthetic one.' },
      { label: 'Matrix representation', content: 'Include complexity as a lower-is-better parameter so that options which add parts must pay for them in the score.' },
      { label: 'Recorded trade', content: '“We removed the adjustable trim and replaced it with factory digital calibration; it costs us firmware effort and gains reliability, area and test time.”' },
    ],
    engineeringExplanation: 'The cheapest reliability improvement available is usually to remove something. Put that in the matrix as its own row.',
    provenance: 'source',
  },
  {
    id: `${T}-t4`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Analyze',
    prompt: 'Analyse the trade-off involved in specifying a wider operating temperature range than the application needs, in design-matrix terms.',
    hint: 'Use the supplied classification entries.',
    solution: [
      { label: 'What it buys', content: 'Tolerance of an unknown or varying environment; fewer surprises if the product is redeployed.' },
      { label: 'What it costs (source)', content: 'Moving from Consumer (0 to 70 °C) to Industry (−25 to 85 °C) to Military (−55 to 125 °C) changes the whole package, and the Cost row rises to “Very High”.' },
      { label: 'Matrix representation', content: 'Enter the required window as a screen, and enter headroom beyond it as a weighted parameter rather than assuming more is always better.' },
      { label: 'When it is justified', content: 'When the environment is genuinely unmeasured and a redesign would cost more than the margin. Say so explicitly and price it — silent over-specification is a defect.' },
    ],
    engineeringExplanation: 'Headroom is insurance, not improvement. Price it like insurance and record the premium.',
    provenance: 'source',
  },
  {
    id: `${T}-t5`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Justify',
    prompt: 'Justify the statement: “constraints decide, requirements describe”, using an example from this unit.',
    hint: 'Think of a case where two designs both meet the requirement and the constraint separates them.',
    solution: [
      { label: 'Meaning', content: 'Requirements tell you what to achieve; constraints decide which way of achieving it is permissible.' },
      { label: 'Example', content: 'A single precision channel and a dual redundant channel can both meet an accuracy requirement. The two-wire loop power budget, not accuracy, eliminates the redundant option.' },
      { label: 'Second example', content: 'Two designs may both meet a reliability target; a “no field calibration” constraint eliminates the one with trimpots.' },
      { label: 'Consequence for the matrix', content: 'Constraints must appear either as screens or as weighted rows. Omitting them produces a design that satisfies the specification and fails the review.' },
    ],
    engineeringExplanation: 'Most real design arguments are about constraints, not requirements. Naming that is a seniority signal in a review.',
    provenance: 'insight',
  },

  {
    id: `${T}-v1`,
    topicId: T,
    type: 'viva',
    level: 2,
    marks: 2,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why does a design need a matrix at all? Why not just design it?',
    hint: 'What happens six months later?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because every design decision is a trade, and an unrecorded trade becomes an argument with no evidence later. The matrix records the requirement, the weight, the evidence and the rejected alternative while the decision is still cheap to change.',
      },
    ],
    engineeringExplanation: 'The audit trail is the product. The circuit is only one of its outputs.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Six months later someone asks why you chose the expensive part. What do you show them?',
        expected: 'The matrix: the requirement that created the parameter, the weight, the score with its evidence, and the cheaper alternative that failed the screen or the score.',
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
    action: 'Distinguish',
    prompt: 'Distinguish a design matrix from a performance matrix in one sentence each, and say when each is used.',
    hint: 'One selects, the other justifies.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'A performance matrix compares candidate systems against performance parameters and is used to select between options. A design matrix maps requirements and constraints onto the parameters you will actually choose, and is used to justify and record the design. Performance matrix first, to choose the architecture; design matrix throughout, to justify each parameter within it.',
      },
    ],
    engineeringExplanation: 'They answer different questions at different stages. Treating them as the same artefact is the commonest exam error here.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Can one table serve both purposes?',
        expected:
          'Only loosely. The supplied classification table is close — it maps a requirement onto parameters — but it lacks weights and any record of trade-offs, so it compares without deciding.',
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
    prompt: 'Why is it important to record the rejected alternative in a design matrix?',
    hint: 'What does the second column buy you?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the trade-off only exists relative to an alternative. Recording what was rejected — and why — shows that a choice was actually made, lets a reviewer check it against the requirement, and lets a later engineer reopen the decision when the constraint changes.',
      },
    ],
    engineeringExplanation: 'A one-column matrix has not decided anything; it has only described. The second column is the decision.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'What if there is genuinely only one workable architecture?',
        expected:
          'Then say so and justify it explicitly — “no alternative satisfies the loop-power constraint”. That statement is itself the record, and it tells the next engineer which constraint to attack if the design must change.',
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
    action: 'Explain why',
    prompt: 'Why can a design that meets every stated requirement still fail its review?',
    hint: 'What is not in the requirement document?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because requirements are not the only thing that decides. Constraints — cost, power, availability, lead time, calibration access, size, service interval — decide between the designs that all satisfy the requirements. A design that ignores them can pass its specification and still be unbuildable, unserviceable or unsellable.',
      },
    ],
    engineeringExplanation: 'Name a specific example — a single-sourced precision part, or a design needing field calibration the customer cannot perform — and the answer is complete.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Where should those constraints appear in the matrix?',
        expected:
          'Either as screening rows if they are hard limits, or as weighted lower-is-better parameters if they are matters of degree. Never left out.',
      },
    ],
  },
  {
    id: `${T}-v5`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Justify',
    prompt: 'Your design matrix recommends the redundant architecture. The project manager says it is too expensive. How do you respond?',
    hint: 'Go back to the requirement that weighted reliability so heavily.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Show the weight and the requirement behind it: “redundancy wins because the availability requirement cannot be met by any single channel at the required confidence — that requirement carried weight 5.” Then reopen the question properly: either the availability requirement is real and the cost must be accepted, or it is not and the weight should be lowered, in which case the matrix will recommend the single channel.',
      },
    ],
    engineeringExplanation: 'Do not defend the number — reopen the weight. The matrix makes the argument about the requirement, where it belongs.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'And if the requirement is genuinely soft?',
        expected:
          'Lower the weight, re-run, and record the new trade-off. That is the matrix doing its job — converting a disagreement about a design into a discussion about a requirement.',
      },
    ],
  },
]

export const TOPIC6_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Matrix Lab' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Review Faults' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const

export const DM_REVIEW_FAULTS: {
  id: string
  title: string
  fault: string
  whyItIsWrong: string
  fix: string
}[] = [
  {
    id: 'g1',
    title: 'Requirements listed, constraints omitted',
    fault: 'A design matrix with every technical requirement and no cost, power, availability or calibration rows.',
    whyItIsWrong:
      'Constraints decide between designs that all satisfy the requirements. Omitting them produces a design that passes its specification and fails its review.',
    fix: 'List the constraints explicitly alongside the requirements, and make each one either a screen or a weighted row.',
  },
  {
    id: 'g2',
    title: 'Only one candidate architecture',
    fault: 'A matrix with a single column, presented as a decision.',
    whyItIsWrong: 'With one option there is no trade-off to record, so nothing has been decided — only described.',
    fix: 'Propose at least two architectures. If only one survives the screens, record that as the finding and name the constraint that eliminated the others.',
  },
  {
    id: 'g3',
    title: 'A hard limit entered as a weighted row',
    fault: 'The loop power budget scored 1–5 and weighted alongside accuracy.',
    whyItIsWrong:
      'Weighting lets a strong accuracy score compensate for exceeding an absolute limit. The transmitter cannot draw more current than the loop provides, whatever the matrix says.',
    fix: 'Apply absolute limits as go/no-go screens before any scoring.',
  },
  {
    id: 'g4',
    title: 'No trade-off sentence',
    fault: 'A matrix whose entire output is “candidate A scores 4.1, selected”.',
    whyItIsWrong:
      'A score without the weights, the sensitivity and a statement of what the choice costs cannot be reviewed or revisited.',
    fix: 'Finish every matrix with “we chose X, which costs us Y, because constraint Z is binding”.',
  },
  {
    id: 'g5',
    title: 'Single-sourced part selected on technical merit alone',
    fault: 'A precision device chosen because it scored highest, with no availability or lead-time row.',
    whyItIsWrong: 'Availability is a design parameter. A single-sourced part creates supply risk that no amount of technical excellence compensates for.',
    fix: 'Add sources and lead time as parameters, or as a screen if the project requires multi-sourcing.',
  },
]
