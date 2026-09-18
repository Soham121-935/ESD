import type {
  DesignChallengeSpec,
  ModeContent,
  Question,
  TopicMeta,
} from '../../types'
import type { MatrixOption, MatrixParam } from '../../components/MatrixBuilder'

export const TOPIC5: TopicMeta = {
  id: 'u1t5',
  index: 5,
  title: 'System Performance Matrix',
  shortTitle: 'Performance Matrix',
  hook: 'When “which system is best?” has no answer until you write down what “best” means.',
  status: 'live',
}

export const SOURCE_NOTE5 = {
  primary:
    'Supplied course material: the assignment asks “Explain how System Performance Matrix and Design Matrix is used for decision-making during product development and system design” (TY ESD 2026 ISE1, Unit 1, Q.3). The supplied material does not define either matrix in words — but it does supply a working example: the “Classification of Electronic Product” table, which compares three candidate product classes across seven parameters.',
  coverage:
    'That supplied table is treated here as the model performance matrix, and the seven parameters in it are reused as the vocabulary. The weighted-scoring method, the construction procedure and all scenario values are Engineering Insight.',
}

/* ------------------------------------------------------------------ */
/* The supplied table, read as a performance matrix                   */
/* ------------------------------------------------------------------ */

export const PM_PARAMS: MatrixParam[] = [
  { id: 'temp', label: 'Operating temp. range', higherIsBetter: true, defaultWeight: 5, provenance: 'source' },
  { id: 'reliability', label: 'Reliability', higherIsBetter: true, defaultWeight: 4, provenance: 'source' },
  { id: 'life', label: 'Life', higherIsBetter: true, defaultWeight: 3, provenance: 'source' },
  { id: 'maintenance', label: 'Maintenance burden', higherIsBetter: false, defaultWeight: 3, provenance: 'source' },
  { id: 'cost', label: 'Cost', higherIsBetter: false, defaultWeight: 4, provenance: 'source' },
  { id: 'ergonomics', label: 'Ergonomics', higherIsBetter: true, defaultWeight: 2, provenance: 'source' },
]

export const PM_OPTIONS: MatrixOption[] = [
  {
    id: 'consumer',
    label: 'Consumer-grade unit',
    scores: { temp: 2, reliability: 2, life: 2, maintenance: 4, cost: 5, ergonomics: 4 },
  },
  {
    id: 'industry',
    label: 'Industry-grade unit',
    scores: { temp: 4, reliability: 4, life: 4, maintenance: 3, cost: 3, ergonomics: 3 },
  },
  {
    id: 'military',
    label: 'Military-grade unit',
    scores: { temp: 5, reliability: 5, life: 5, maintenance: 5, cost: 1, ergonomics: 2 },
  },
]

/* ------------------------------------------------------------------ */
/* Mode content                                                        */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'You already have a performance matrix in your notes — you just have not called it that. Open the classification table and look at its shape.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — Three quotes, no way to choose',
      provenance: 'insight',
      body: [
        'Three vendors quote for a data logger. One is cheap and attractive. One is expensive and rugged. One is very expensive and extremely rugged. The project manager asks which is best.',
        'There is no answer to that question as asked, because “best” has not been defined. A performance matrix is the tool that defines it.',
      ],
      bullets: [
        'What is required? A defensible ranking.',
        'What is given? Three options and a set of parameters.',
        'What is missing? The relative importance of each parameter — the weighting.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — You have already seen one',
      provenance: 'source',
      body: [
        'The supplied “Classification of Electronic Product” table is a performance matrix: the rows are the parameters on which the systems are compared, and the columns are the candidate systems.',
        'It uses exactly the structure this topic is about — parameters down the side, options across the top — and it uses seven parameters, which is a good working number for a real comparison.',
      ],
      bullets: [
        'Parameters: Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance, Operating temp. range.',
        'Options: Consumer Product, Industry Product, Military Product.',
        'What the table does NOT do is weight the parameters — that is the part you must add, and it is the part that turns a table into a decision.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — What a performance matrix is',
      provenance: 'insight',
      body: [
        'A system performance matrix is a table that lists the candidate systems as columns, the performance parameters as rows, and a score for every combination.',
        'Each parameter carries a weight that expresses how much the requirement cares about it. The weighted scores produce a ranking — and, more importantly, they expose the trade-off that produced it.',
      ],
      bullets: [
        'Parameters must be measurable, or at least consistently judgeable.',
        'Weights must come from the requirement, not from intuition.',
        'Some parameters run the other way — cost, size, power and maintenance burden are better when they are smaller.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why not just pick the one with the highest total?',
      provenance: 'insight',
      body: [
        'Because the total is only as good as the weights, and because a large number on one parameter can hide a fatal weakness on another.',
        'The supplied table shows this clearly: the Military column wins on reliability, life, maintenance and temperature, and loses badly on cost. If cost is the binding requirement, the column with the best technical scores is the wrong choice.',
      ],
      bullets: [
        'A matrix is not an oracle. It is a way of making the trade-off visible so that it can be argued about.',
        'If changing one weight flips the ranking, the requirements do not yet discriminate between the options — say so instead of pretending the matrix has decided.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Construct one in six steps',
      provenance: 'insight',
      body: ['Write the steps down; the artefact is the argument, not the table.'],
      bullets: [
        'Step 1 — List the candidate systems as columns.',
        'Step 2 — Derive the parameters from the requirement. If a parameter is not traceable to a requirement, remove it.',
        'Step 3 — Mark the direction of each parameter: higher is better, or lower is better.',
        'Step 4 — Score every combination on a fixed scale (1–5 works well) and record the evidence for each score.',
        'Step 5 — Assign weights from the requirement, and check that they sum sensibly.',
        'Step 6 — Compute the weighted totals, then stress-test: change one weight and see whether the ranking holds.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Weighted matrix builder',
      provenance: 'insight',
      body: [
        'Move the weights and watch the ranking change. Notice how the military-grade unit wins when reliability is weighted heavily and loses the moment cost is weighted heavily.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Scoring the three grades',
      provenance: 'insight',
      body: [
        'Six parameters from the supplied table, scored 1–5, with cost and maintenance inverted so that a smaller value scores better.',
      ],
      bullets: [
        'Consumer: temp 2, reliability 2, life 2, maintenance burden 4 (→2 good), cost 5 (→1 good), ergonomics 4.',
        'Industry: temp 4, reliability 4, life 4, maintenance burden 3 (→3 good), cost 3 (→3 good), ergonomics 3.',
        'Military: temp 5, reliability 5, life 5, maintenance burden 5 (→1 good), cost 1 (→5 good), ergonomics 2.',
        'With the default weights the industry unit leads, because it is the only option that is not weak anywhere.',
        'Raise the cost weight and the consumer unit competes; drop it and the military unit wins. The ranking is a function of the requirement — which is the point.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: ['Each of these is a design-review question.'],
      bullets: [
        'What if cost is weighted zero? The military unit wins on every remaining parameter — and you have just discovered that the decision was entirely a cost decision.',
        'What if a new parameter is added — say, delivery time — and the industry vendor cannot meet it? A parameter the matrix did not contain can overturn the result; keep asking what is missing.',
        'What if two options score within 0.2 points? That is inside the noise of subjective scoring. Report it as a tie and find a discriminating requirement.',
        'What if one score is a guess? Mark it as an assumption and re-run the matrix with the best and worst case. A decision that survives that range is robust.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Interpreting the matrix honestly',
      provenance: 'insight',
      body: [
        'The value of a performance matrix is not the ranking — it is the argument it forces you to write down.',
        'A matrix that is presented without its weights is not evidence, it is decoration. A matrix whose ranking flips when one weight changes is not a decision, it is a question that has not been settled.',
      ],
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'Build a matrix that a review board will accept: every parameter traceable to a requirement, every score evidenced, every weight defended.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The matrix that was used to justify a decision already made',
      provenance: 'insight',
      body: [
        'A team presents a performance matrix in which their preferred architecture wins. On inspection, three of the six parameters are things their architecture happens to be good at, and the two parameters where it is weak — cost and power — are not in the table at all.',
        'The arithmetic in the matrix is correct. The matrix is still worthless.',
      ],
      bullets: [
        'Required: a matrix that survives hostile review.',
        'Given: candidate architectures and a requirement document.',
        'Which step was corrupted? Step 2 — the parameters were chosen to fit the answer.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Where parameters must come from',
      provenance: 'insight',
      body: [
        'Every row of a performance matrix must be traceable to a line in the requirement. If you cannot point at the requirement that created a parameter, either the parameter does not belong, or the requirement is missing and should be raised.',
        'This is the discipline that separates a matrix from a brochure.',
      ],
      bullets: [
        'Requirement → parameter → direction → weight → score → evidence.',
        'A parameter with no direction marked will eventually be scored the wrong way round.',
        'A parameter with no evidence attached is an opinion wearing a number.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why the numerically highest value is not automatically the best',
      provenance: 'insight',
      body: [
        'Because requirement satisfaction is not maximisation. A product that exceeds one requirement while missing another has failed, no matter how impressive the exceeded figure looks.',
        'The supplied classification table makes the point structurally: the Military column has the best figures on six of seven parameters and is still the wrong choice for a consumer product, because the Cost row is part of the package.',
      ],
      bullets: [
        'Over-specification is a defect: it spends money on margin nobody asked for.',
        'Under-specification on a single binding parameter cannot be compensated by excellence elsewhere.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Run a defensible comparison',
      provenance: 'insight',
      body: ['Work through the matrix in this order and record every step.'],
      bullets: [
        'Step 1 — Extract every measurable requirement and turn it into a parameter with a unit where possible.',
        'Step 2 — Mark the direction of each parameter explicitly.',
        'Step 3 — Score with evidence: a test report, a datasheet figure, a measurement. Record the source next to the score.',
        'Step 4 — Weight from the requirement, and write one sentence justifying each weight.',
        'Step 5 — Compute, then stress-test: vary each weight across its plausible range and note where the ranking flips.',
        'Step 6 — Report the ranking AND the sensitivity. “Option B wins, but it becomes Option A if the cost weight rises above 4” is a far more useful answer than a single name.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Stress-test the ranking',
      provenance: 'insight',
      body: [
        'Use the builder below. Find the weight at which the leading option changes. That weight is the real decision boundary, and it is what you should report.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Finding the decision boundary',
      provenance: 'insight',
      body: [
        'Compare the industry and military units with only two parameters — reliability (weight w) and cost (weight 5 − w).',
      ],
      bullets: [
        'Industry good-scores: reliability 4, cost 3. Weighted score = 4w + 3(5 − w) = 15 + w.',
        'Military good-scores: reliability 5, cost 1. Weighted score = 5w + 1(5 − w) = 5 + 4w.',
        'Set them equal: 15 + w = 5 + 4w → 10 = 3w → w = 3.33.',
        'So the military unit only wins when the reliability weight exceeds about 3.3 out of 5 AND the cost weight is correspondingly below 1.7.',
        'That is the decision boundary, and it is far more useful to a review board than “the matrix says industry”.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Sensitivity as the deliverable',
      provenance: 'insight',
      body: ['Report sensitivity alongside the ranking, every time.'],
      bullets: [
        'What if the cost estimate for the military unit is 20% low? Its cost score worsens and the boundary moves — say by how much.',
        'What if the customer adds a delivery-time requirement? A parameter outside the matrix can overturn it entirely.',
        'What if two options tie? Report the tie and find the discriminating requirement rather than splitting the difference.',
        'What if the weights come from three different stakeholders? Run the matrix three times and show where they agree — that overlap is the real decision.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Performance matrix versus design matrix',
      provenance: 'insight',
      body: [
        'The two matrices in this syllabus are related but not the same.',
      ],
      bullets: [
        'Performance matrix — compares candidate SYSTEMS against defined performance parameters. It answers “which one is better for this requirement?”',
        'Design matrix — maps REQUIREMENTS and CONSTRAINTS onto design parameters and records the resulting trade-offs and decisions. It answers “what must the design do, and what did we give up?”',
        'In practice the performance matrix is used to choose between options; the design matrix is used to justify the design you then build.',
      ],
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode writes Unit 1 Q.3 in 8-mark form: definition, purpose, construction, worked example and interpretation.',
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
      title: 'Model answer — (1) Definition and purpose (2 marks)',
      provenance: 'insight',
      body: [
        'A system performance matrix is a table in which candidate systems are compared against a defined set of performance parameters, each carrying a weight that expresses its importance to the requirement. Its purpose is to make the comparison explicit and arguable rather than intuitive.',
        'A design matrix maps requirements and constraints onto design parameters and records the trade-offs and the decisions that follow from them. Its purpose is to justify the design, not merely to select it.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (2) Construction (3 marks)',
      provenance: 'source',
      body: [
        'The supplied material gives the model to follow: the “Classification of Electronic Product” table, in which the parameters form the rows and the candidate product classes form the columns.',
      ],
      bullets: [
        'Rows: the parameters on which the systems will be judged — in the supplied table, Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance and Operating temp. range.',
        'Columns: the candidate systems — Consumer, Industry and Military products.',
        'Cells: the score or entry for each combination.',
        'Additions required for decision-making: a direction for each parameter (higher or lower is better) and a weight expressing its importance.',
        'Weighted score = Σ(good-score × weight) / Σ(weight), where a “lower is better” parameter is inverted before weighting.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Model answer — (3) Worked example (2 marks)',
      provenance: 'insight',
      body: [
        'Reproduce a small matrix and interpret it. Using the supplied table as the source of parameters:',
      ],
      bullets: [
        'Consumer-grade: temp 2, reliability 2, life 2, maintenance burden 4, cost 5, ergonomics 4.',
        'Industry-grade: temp 4, reliability 4, life 4, maintenance burden 3, cost 3, ergonomics 3.',
        'Military-grade: temp 5, reliability 5, life 5, maintenance burden 5, cost 1, ergonomics 2.',
        'Conclusion: the industry grade leads under balanced weights because it has no weak parameter; the military grade wins only if cost is weighted very low.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (4) Interpretation and limitations (1 mark)',
      provenance: 'insight',
      body: [
        'The matrix does not make the decision — it makes the trade-off visible so that the decision can be argued and reviewed.',
        'State the limitations: the ranking depends on the weights; a parameter that is missing from the table can overturn it; and two options within a few tenths of a point are a tie, not a ranking.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme and common mistakes',
      provenance: 'insight',
      body: [
        '2 marks — definition and purpose of both matrices.',
        '3 marks — construction, with the supplied table named as the model.',
        '2 marks — worked example with numbers.',
        '1 mark — interpretation and limitations.',
      ],
      bullets: [
        'Common mistake 1: describing the matrix without saying where the parameters come from. They come from the requirement.',
        'Common mistake 2: treating a high cost or a high power figure as a high score.',
        'Common mistake 3: presenting a single ranking with no sensitivity analysis.',
      ],
    },
  ],
}

export const TOPIC5_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* Design challenge                                                    */
/* ------------------------------------------------------------------ */

export const PM_DESIGN: DesignChallengeSpec = {
  id: 'u1t5-design-selection',
  title: 'Design Challenge — Build the matrix that selects the product class',
  provenance: 'insight',
  requirement:
    'A utility must select a data logger for 200 outdoor sites with a required operating window of −15 °C to +55 °C, glove-operated use, an 8-year service life, a swap-not-repair policy and a tight unit-cost ceiling. Build the performance matrix that selects the product class, then state where the decision is fragile.',
  constraints: [
    'Environment: −15 °C to +55 °C at the mounting point.',
    'Operator wears gloves; 8-year service life; unit replaced, not repaired.',
    '200 units on a tight unit-cost budget.',
    'Parameters must be traceable to the requirement.',
  ],
  assumptions: [
    'The seven supplied parameters are the vocabulary; the weighting and scoring are Engineering Insight.',
    'The supplied table is treated as the model performance matrix.',
  ],
  checks: [
    {
      id: 'screen',
      label: 'Screening test',
      ask: 'Which class survives the operating-temperature window test, and why does that test come before the matrix?',
      accepted: [
        'industry',
        'industry survives; consumer fails',
        'industry — the temperature test is falsifiable so it comes first',
      ],
      hints: [
        'Hint 1 — Consumer spans 0 to 70 °C; the requirement starts at −15 °C.',
        'Hint 2 — A matrix cannot rescue an option that fails a hard requirement. Screen first, score second.',
        'Hint 3 — Industry (−25 to 85 °C) contains the window; Military does too but breaches the cost ceiling.',
      ],
      rationale:
        'Industry survives; Consumer is eliminated on temperature alone. The screening test comes first because it is falsifiable — a single measurement settles it — whereas the matrix scores are judgements. Never score an option that has already failed a hard requirement.',
    },
    {
      id: 'weight',
      label: 'Weighting',
      ask: 'Which parameter should carry the highest weight for this requirement, and why?',
      accepted: [
        'cost',
        'cost — 200 units makes unit cost the binding constraint',
        'operating temperature range (it is a go/no-go)',
        'cost, after temperature has been applied as a screening test',
      ],
      hints: [
        'Hint 1 — Temperature has already eliminated Consumer, so it has done its job as a screen. What is left?',
        'Hint 2 — The requirement mentions 200 units and a tight unit-cost ceiling.',
        'Hint 3 — Cost, followed by maintenance and life. Weight cost highest and see whether Industry still beats Consumer on the remaining parameters.',
      ],
      rationale:
        'Cost carries the highest weight, because 200 units on a tight ceiling makes unit cost the binding constraint. Temperature is applied first as a go/no-go screen rather than as a weighted parameter — a distinction that matters, because weighting a pass/fail requirement lets a strong score elsewhere compensate for a failure.',
    },
    {
      id: 'direction',
      label: 'Direction of parameters',
      ask: 'Which two parameters in the supplied vocabulary run the wrong way — that is, lower is better?',
      accepted: [
        'cost and maintenance',
        'cost and maintenance burden',
        'cost, maintenance',
      ],
      hints: [
        'Hint 1 — Most parameters are better when larger. Which are better when smaller?',
        'Hint 2 — You want the cheapest product and the least maintenance.',
        'Hint 3 — Cost and maintenance. Both must be inverted before weighting, or the matrix will reward the most expensive option.',
      ],
      rationale:
        'Cost and maintenance burden. If they are not inverted before weighting, the matrix awards the highest scores to the most expensive and the most maintenance-hungry option — a classic and entirely avoidable error.',
    },
    {
      id: 'fragile',
      label: 'Where is the decision fragile?',
      ask: 'State one condition under which your ranking would flip, and what you would do about it.',
      accepted: [
        'if the ambient falls below -25c the industry class fails and military becomes mandatory',
        'if the unit-cost ceiling is raised, military becomes competitive',
        'if maintenance access is removed entirely, the lowest-maintenance option wins',
        'if the ambient drops below −25 °c',
      ],
      hints: [
        'Hint 1 — Think about the assumption behind the temperature screen.',
        'Hint 2 — Industry covers down to −25 °C. What if a site is colder?',
        'Hint 3 — Below −25 °C the industry class fails and only Military remains — which breaches the cost ceiling. The honest answer is to re-engineer the environment (a heated enclosure) or to renegotiate, not to silently upgrade.',
      ],
      rationale:
        'The decision flips if any site falls below −25 °C: Industry fails and only Military qualifies, which breaches the cost ceiling. The correct response is to engineer the environment (heated enclosure) or to reopen the commercial discussion — not to quietly upgrade the class and absorb the cost.',
    },
  ],
  solution: [
    { label: 'Requirement', content: '200 outdoor loggers, −15 °C to +55 °C, glove operation, 8-year life, swap-not-repair, tight unit cost.' },
    { label: 'Screening', content: 'Temperature window eliminates Consumer (0 to 70 °C). Industry and Military both contain the window.' },
    { label: 'Parameters', content: 'Operating temp. range, reliability, life, maintenance burden (inverted), cost (inverted), ergonomics — all from the supplied vocabulary.' },
    { label: 'Weighting', content: 'Cost highest, then reliability, maintenance and life, then temperature, then ergonomics. Each weight justified by a line in the requirement.' },
    { label: 'Result', content: 'Industry leads. It is the only option with no weak parameter once cost is weighted heavily.' },
    { label: 'Sensitivity', content: 'The ranking is stable while the cost weight stays at 3 or above. If the ambient at any site falls below −25 °C the screen removes Industry entirely and the decision collapses.' },
    { label: 'Possible failure modes', content: 'Parameters chosen to favour a preferred option; a pass/fail requirement scored instead of screened; cost not inverted; a tie reported as a ranking.' },
    { label: 'Alternative', content: 'If the cost ceiling cannot be met by Industry, reduce the environment instead of the class: a heated or insulated enclosure keeps a cheaper unit inside its window, at the price of a new failure mode (the heater).' },
  ],
  failureModes: [
    'Scoring an option that has already failed a hard requirement.',
    'Forgetting to invert cost and maintenance before weighting.',
    'Choosing parameters that match the strengths of the preferred option.',
    'Reporting a ranking without the sensitivity that produced it.',
    'Presenting a 0.2-point difference as a decision.',
  ],
  interpretation:
    'A performance matrix is an argument written as a table. If you cannot say which weight would change the answer, you have not finished the analysis.',
}

/* ------------------------------------------------------------------ */
/* Question bank — 25                                                  */
/* ------------------------------------------------------------------ */

const T = 'u1t5'

export const TOPIC5_QUESTIONS: Question[] = [
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define a system performance matrix and state its purpose.',
    hint: 'Candidate systems as columns, parameters as rows.',
    solution: [
      {
        label: 'Definition',
        content:
          'A system performance matrix is a table in which candidate systems are compared against a defined set of performance parameters, each carrying a weight that expresses its importance to the requirement.',
      },
      {
        label: 'Purpose',
        content:
          'To make a comparison explicit, traceable and arguable instead of intuitive — so that a selection can be defended in review.',
      },
    ],
    engineeringExplanation: 'If the matrix cannot be argued with, it is not a matrix — it is a summary.',
    provenance: 'insight',
  },
  {
    id: `${T}-c2`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'The supplied material does not define a performance matrix — but it supplies one. Identify it and explain why it qualifies.',
    hint: 'Look at the Topic 1 table: what are its rows and what are its columns?',
    solution: [
      {
        label: 'Answer (source)',
        content:
          'The “Classification of Electronic Product” table. Its rows are the parameters on which the systems are compared — Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance and Operating temp. range — and its columns are the candidate systems: Consumer, Industry and Military products.',
      },
      {
        label: 'What it lacks',
        content:
          'Weights. The supplied table compares but does not rank, because it does not say how much each parameter matters. Adding weights is what turns it into a decision tool.',
      },
    ],
    engineeringExplanation: 'Recognising the supplied table as a performance matrix is the strongest opening in an exam answer on this topic.',
    provenance: 'source',
  },
  {
    id: `${T}-c3`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Distinguish',
    prompt: 'Distinguish a system performance matrix from a design matrix.',
    hint: 'One compares options, the other justifies a design.',
    solution: [
      {
        label: 'Performance matrix',
        content:
          'Compares candidate systems against defined performance parameters and answers “which option is better for this requirement?”',
      },
      {
        label: 'Design matrix',
        content:
          'Maps requirements and constraints onto design parameters, recording the trade-offs and decisions, and answers “what must the design do and what did we give up?”',
      },
      {
        label: 'Order of use',
        content: 'The performance matrix selects the option; the design matrix then justifies and records the design that follows from it.',
      },
    ],
    engineeringExplanation: 'They are used at different points in the project, and confusing them leads to a matrix that answers the wrong question.',
    provenance: 'insight',
  },
  {
    id: `${T}-c4`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'State the six steps for constructing a performance matrix.',
    hint: 'Candidates, parameters, direction, scores, weights, stress test.',
    solution: [
      {
        label: 'Steps',
        content:
          '1 List the candidate systems as columns. 2 Derive the parameters from the requirement, removing any that is not traceable. 3 Mark the direction of each parameter. 4 Score every combination on a fixed scale with recorded evidence. 5 Assign weights from the requirement and justify each in one sentence. 6 Compute the weighted totals and stress-test by varying the weights.',
      },
    ],
    engineeringExplanation: 'Step 2 is where matrices get corrupted. Parameters must come from the requirement, not from the strengths of a preferred option.',
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
    prompt: 'Why must some parameters be inverted before weighting? Give two examples from the supplied vocabulary.',
    hint: 'Not every parameter is better when larger.',
    solution: [
      {
        label: 'Answer',
        content:
          'Because the scoring scale rewards a high number. If a parameter is better when it is small, scoring it directly makes the matrix prefer the worse option.',
      },
      {
        label: 'Examples (source)',
        content:
          'Cost — the source entries run from “Should be affordable” to “Very High”, and cheaper is better. Maintenance — the entries run from “Minimum” to “Lowest”, and less attention is better.',
      },
      {
        label: 'Method (Engineering Insight)',
        content: 'Invert before weighting: good-score = 6 − raw score on a 1–5 scale, then weight as usual.',
      },
    ],
    engineeringExplanation: 'A matrix that rewards the highest cost is not a subtle error — it is a visible one, and it destroys the credibility of the whole analysis.',
    provenance: 'source',
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
      'Analyse the supplied classification table as a performance matrix: identify the rows, the columns, the cells, and state what a decision-maker must add before it can produce a ranking.',
    hint: 'Three structural elements plus one missing element.',
    solution: [
      { label: 'Rows (source)', content: 'The seven parameters: Cost, Reliability, Ergonomics, Aesthetics, Life, Maintenance, Operating temp. range.' },
      { label: 'Columns (source)', content: 'The three candidate systems: Consumer Product, Industry Product, Military Product.' },
      { label: 'Cells (source)', content: 'The entry for each parameter/system combination, such as “0 to 70 °C” or “Very High”.' },
      { label: 'What must be added', content: 'A weight for each parameter and a direction for each parameter. Without weights the table compares but cannot rank; without directions it cannot even be scored consistently.' },
    ],
    engineeringExplanation: 'The supplied table is complete as a comparison and incomplete as a decision tool. Naming the missing element is the whole answer.',
    provenance: 'source',
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
      'Two options are separated by 0.15 points in a weighted performance matrix. Analyse what that difference means and what you should report.',
    hint: 'Compare it with the precision of the scoring.',
    solution: [
      { label: 'Analysis', content: 'Subjective 1–5 scores are rarely reproducible to better than about half a point, so a 0.15-point gap is inside the noise of the method.' },
      { label: 'What to report', content: 'A tie, not a ranking — together with the parameter that would discriminate between them.' },
      { label: 'Action', content: 'Find a requirement that separates the two, or measure the distinguishing parameter rather than scoring it.' },
      { label: 'Why it matters', content: 'Presenting noise as a decision invites a challenge that the matrix cannot survive.' },
    ],
    engineeringExplanation: 'Saying “these two are tied and here is the measurement that will separate them” is a stronger engineering answer than a fake ranking.',
    provenance: 'insight',
  },
  {
    id: `${T}-a3`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse a matrix in which the winning option also has the worst score on the parameter the customer named first. What is wrong, and how do you fix it?',
    hint: 'The weights do not reflect the stated requirement.',
    solution: [
      { label: 'Diagnosis', content: 'The weights do not reflect the requirement. Either the customer’s priority was not translated into a weight, or parameters were chosen to favour the preferred option.' },
      { label: 'Fix 1', content: 'Re-derive the weights from the requirement document, writing one justification sentence per weight.' },
      { label: 'Fix 2', content: 'Check for missing parameters — if the customer’s priority is not a row in the table, the matrix cannot honour it.' },
      { label: 'Fix 3', content: 'If a requirement is pass/fail, apply it as a screening test before scoring rather than as a weighted row.' },
    ],
    engineeringExplanation: 'A matrix that contradicts the stated priority is evidence of a process error, not of a surprising result. Check the process first.',
    provenance: 'insight',
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
      'Analyse the difference between applying a requirement as a screening test and applying it as a weighted parameter. Use the operating temperature range as your example.',
    hint: 'What does weighting let an option do that screening does not?',
    solution: [
      { label: 'Screening', content: 'A hard go/no-go test applied before scoring. Using the supplied ranges, a required window of −15 °C removes the Consumer class outright.' },
      { label: 'Weighting', content: 'A scored row that contributes to a total. Weighting temperature lets a strong score elsewhere compensate for a temperature failure.' },
      { label: 'Which to use', content: 'Screen on anything falsifiable or safety-related; weight on anything that is genuinely a matter of degree.' },
      { label: 'Why', content: 'Compensation is only legitimate where the requirement allows trade-off. A product that cannot operate at the required temperature cannot be compensated into service.' },
    ],
    engineeringExplanation: 'This distinction — screen versus score — is the difference between a matrix that decides and a matrix that rationalises.',
    provenance: 'source',
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
      'A matrix ranks three options 4.2, 3.9 and 2.1. Interpret the result, stating what you can conclude and what you cannot.',
    hint: 'Consider the gap sizes and what is not in the table.',
    solution: [
      { label: 'What you can conclude', content: 'The third option is clearly behind. The first two are separated by 0.3, which may or may not be significant depending on the precision of the scores.' },
      { label: 'What you cannot conclude', content: 'That option one is “the best system” in any absolute sense — only that it is best against these parameters with these weights.' },
      { label: 'What is missing', content: 'Any requirement that is not a row in the table. A parameter outside the matrix can overturn the ranking entirely.' },
      { label: 'What to report', content: 'The ranking, the weights that produced it, the sensitivity, and an explicit statement of what the matrix does not cover.' },
    ],
    engineeringExplanation: 'Every matrix has an implicit boundary: it only knows about the rows you gave it. State that boundary out loud.',
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
      'Construct a performance matrix to select between a Consumer, an Industry and a Military grade logger for 200 outdoor sites at −15 °C to +55 °C with a tight unit-cost ceiling. Give the parameters, the directions, the weights and the outcome.',
    hint: 'Screen on temperature first, then weight cost highest.',
    solution: [
      { label: 'Screen', content: 'Temperature eliminates Consumer (0 to 70 °C does not contain −15 °C).' },
      { label: 'Parameters and directions', content: 'Operating temp. range ↑, reliability ↑, life ↑, maintenance burden ↓, cost ↓, ergonomics ↑.' },
      { label: 'Weights', content: 'Cost 5, reliability 4, maintenance 4, life 3, temperature 3, ergonomics 2 — each justified from a line in the requirement.' },
      { label: 'Outcome', content: 'Industry leads. It is the only remaining option without a weak parameter once cost is weighted heavily.' },
      { label: 'Sensitivity', content: 'Stable while the cost weight is 3 or above; collapses if any site falls below −25 °C, where only Military qualifies.' },
    ],
    engineeringExplanation: 'Always finish a matrix with its sensitivity. The ranking is the answer; the sensitivity is the engineering.',
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
      'Construct a performance matrix comparing three candidate display technologies for a plant-floor annunciator: LED, LCD and OLED. Choose the parameters, mark the directions, and justify each weight for a bright, 24×7 industrial environment.',
    hint: 'Think about sunlight readability, life, temperature and power.',
    solution: [
      { label: 'Parameters', content: 'Sunlight readability ↑, operating temperature range ↑, service life ↑, power consumption ↓, cost ↓, viewing angle ↑.' },
      { label: 'Directions', content: 'Higher is better for readability, temperature range, life and viewing angle. Lower is better for power and cost.' },
      { label: 'Weights for this environment', content: 'Readability 5 (operators must not misread an alarm), temperature range 4, life 4, power 2 (mains powered), cost 2, viewing angle 3.' },
      { label: 'Likely outcome', content: 'LED leads on readability, life and temperature; LCD suffers on viewing angle and low-temperature response; OLED is strong on contrast but weaker on life.' },
      { label: 'Caveat', content: 'State the scores as estimates and re-run with best and worst cases before committing.' },
    ],
    engineeringExplanation: 'The weights are the requirement. Two engineers with different requirements should produce different rankings from the same table — and be able to explain why.',
    provenance: 'insight',
  },
  {
    id: `${T}-m3`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Verify',
    prompt:
      'You are given a completed matrix whose parameters are speed, memory, package size, price and brand reputation. Verify whether it is fit for purpose for selecting a microcontroller for a battery-powered sensor, and state what you would change.',
    hint: 'Look for a missing parameter that dominates a battery-powered design.',
    solution: [
      { label: 'Missing parameter', content: 'Power consumption. It dominates a battery-powered design and is absent from the table.' },
      { label: 'Dubious parameter', content: 'Brand reputation is not a performance parameter and is not measurable — remove it or replace it with support and availability evidence.' },
      { label: 'Directions', content: 'Package size and price should be marked lower-is-better; speed and memory higher-is-better. Verify these are marked at all.' },
      { label: 'Changes', content: 'Add power consumption with the highest weight, add availability and development-tool support, remove brand reputation, and mark every direction explicitly.' },
      { label: 'Conclusion', content: 'As it stands the matrix cannot select correctly for this application, because the binding parameter is not in it.' },
    ],
    engineeringExplanation: 'Reviewing someone else’s matrix means checking what is NOT in it. The missing parameter is usually the one that decides.',
    provenance: 'insight',
  },
  {
    id: `${T}-m4`,
    topicId: T,
    type: 'design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Construct',
    prompt:
      'Construct a performance matrix for choosing between a 4–20 mA current loop and a 0–10 V voltage link for a 30 m cable run in an electrically noisy plant. Give the parameters, directions and a justified recommendation.',
    hint: 'Noise immunity, voltage drop over distance, fault detection, cost, number of wires.',
    solution: [
      { label: 'Parameters', content: 'Noise immunity ↑, immunity to cable resistance ↑, fault detection (open circuit) ↑, transmission distance ↑, cost ↓, simplicity of receiver ↓.' },
      { label: 'Directions', content: 'Higher is better for immunity and distance; lower is better for cost and receiver complexity.' },
      { label: 'Scores', content: 'Current loop: noise immunity 5, cable-resistance immunity 5, fault detection 5, distance 5, cost 3, receiver complexity 3. Voltage link: 2, 2, 2, 2, 5, 5.' },
      { label: 'Weights for a noisy 30 m run', content: 'Noise immunity 5, cable-resistance immunity 4, fault detection 4, distance 4, cost 2, receiver complexity 2.' },
      { label: 'Recommendation', content: 'The 4–20 mA current loop. Its advantage on the heavily weighted parameters outweighs its higher receiver complexity, and the live-zero gives open-circuit detection that a voltage link cannot.' },
    ],
    engineeringExplanation: 'This is the classic industrial interface decision, and the matrix shows why the current loop wins on noise and distance rather than on cost.',
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
      'Justify the statement: “the numerically highest parameter value is not automatically the best engineering choice”, using the supplied classification table as your evidence.',
    hint: 'Find a column with the best figures that is still the wrong choice.',
    solution: [
      { label: 'Evidence (source)', content: 'The Military column has the best entries on Reliability (“Highly reliable and durable”), Life (“Best”), Maintenance (“Lowest”) and Operating temp. range (−55 to 125 °C).' },
      { label: 'Counter-evidence (source)', content: 'The same column has Cost “Very High”. For a consumer product the requirement package includes affordability, so the column with the best technical figures is the wrong choice.' },
      { label: 'General principle', content: 'Requirement satisfaction is not maximisation. Exceeding one requirement while failing another is failure, however impressive the exceeded figure is.' },
      { label: 'Engineering form', content: 'Over-specification is a defect that costs money for margin nobody requested; under-specification on a binding parameter cannot be compensated elsewhere.' },
    ],
    engineeringExplanation: 'This single sentence is the most examined idea in the matrix topics, and the supplied table is the perfect illustration of it.',
    provenance: 'source',
  },

  {
    id: `${T}-t1`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Perform the trade-off analysis: raising the reliability weight in a selection matrix favours the military-grade option. Trace the full consequence of that change and state what it costs.',
    hint: 'Follow the change through the package, not just the score.',
    solution: [
      { label: 'Immediate effect', content: 'The reliability row gains influence, so the option with the best reliability entries rises in the ranking.' },
      { label: 'Package effect (source)', content: 'The supplied table is a package: the Military column pairs its reliability with “Very High” cost. Selecting it buys the whole column.' },
      { label: 'What it costs', content: 'Money per unit, multiplied across the batch — in a 200-unit deployment, a small unit-cost difference becomes a large budget difference.' },
      { label: 'What it buys', content: 'Margin on a parameter the requirement may not have asked for. If no requirement demanded military-grade reliability, that margin is waste.' },
    ],
    engineeringExplanation: 'Trace a weight change through the whole package. The parameter you weighted is never the only thing that changes.',
    provenance: 'source',
  },
  {
    id: `${T}-t2`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse the trade-off between unit cost and development cost using the supplied Cost entries, and state when each is the better place to spend.',
    hint: 'One is paid once, the other is paid per unit.',
    solution: [
      { label: 'Entries (source)', content: 'Consumer “Should be affordable”; Industry “Development cost higher”; Military “Very High”.' },
      { label: 'Trade-off', content: 'Development cost is paid once and amortised across the batch; unit cost is paid on every unit built.' },
      { label: 'When to spend on development', content: 'When quantities are large. Spending once to reduce the recurring unit cost pays back proportionally to volume.' },
      { label: 'When to accept a higher unit cost', content: 'When volumes are small and the development cost cannot be amortised, or when time to market dominates.' },
    ],
    engineeringExplanation: 'The Industry entry is the quantitative statement of this trade-off — that is why the source names development cost rather than unit cost.',
    provenance: 'source',
  },
  {
    id: `${T}-t3`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse the trade-off between adding redundancy and improving component reliability, in matrix terms.',
    hint: 'One raises the score on one parameter and lowers it on others.',
    solution: [
      { label: 'Redundancy', content: 'Raises the reliability score substantially. Lowers the scores on cost, size, power and complexity — and introduces a new failure mode in the changeover mechanism.' },
      { label: 'Better components', content: 'Raises the reliability score by a smaller amount, with a modest cost penalty and usually no new failure mode.' },
      { label: 'Matrix view', content: 'Add the parameters that redundancy degrades — size, power, complexity, changeover reliability — and score both options honestly.' },
      { label: 'Decision rule', content: 'Choose component improvement while it is sufficient; choose redundancy only when the requirement cannot be met by any single channel.' },
    ],
    engineeringExplanation: 'A matrix that only contains the parameter an option improves will always recommend it. Add the parameters it degrades.',
    provenance: 'insight',
  },
  {
    id: `${T}-t4`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse the trade-off inherent in tightening an operating temperature requirement, and state what it forces elsewhere in the design.',
    hint: 'Widen the range and something has to give.',
    solution: [
      { label: 'What improves', content: 'Field reliability in extreme environments; the usable deployment envelope.' },
      { label: 'What it forces (source)', content: 'Moving from Consumer (0 to 70 °C) to Industry (−25 to 85 °C) to Military (−55 to 125 °C) changes the whole package: cost rises from “Should be affordable” to “Very High”.' },
      { label: 'Design consequences', content: 'Higher-grade components, derating, thermal design, environmental testing and qualification — most of it development cost.' },
      { label: 'Alternative', content: 'Engineer the environment instead of the product — a heated or cooled enclosure keeps a cheaper unit inside its window, at the cost of a new failure mode.' },
    ],
    engineeringExplanation: 'The cheapest way to meet a temperature requirement is often to move the environment, not to upgrade every component.',
    provenance: 'source',
  },
  {
    id: `${T}-t5`,
    topicId: T,
    type: 'conceptual',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse what a performance matrix cannot tell you, and list three questions it cannot answer.',
    hint: 'Think about what is outside the table.',
    solution: [
      { label: 'Limitation 1', content: 'It cannot account for a requirement that is not one of its rows. A missing parameter can overturn the ranking entirely.' },
      { label: 'Limitation 2', content: 'It cannot resolve differences smaller than the precision of its scores — a 0.2-point gap is a tie, not a decision.' },
      { label: 'Limitation 3', content: 'It cannot tell you whether the scores are right. A score without evidence is an opinion wearing a number.' },
      { label: 'Consequence', content: 'Report the ranking with the weights, the sensitivity and an explicit statement of what the matrix does not cover.' },
    ],
    engineeringExplanation: 'Knowing what a tool cannot do is the mark of someone who has actually used it.',
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
    prompt: 'Why is a performance matrix needed at all? Why not just compare the datasheets?',
    hint: 'Datasheets do not carry your requirements.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because a datasheet presents a device’s parameters, not your requirement’s priorities. A matrix forces you to state which parameters matter and how much, and then shows the trade-off explicitly so it can be reviewed and challenged. Without it, the comparison happens in someone’s head and cannot be audited.',
      },
    ],
    engineeringExplanation: 'The audit trail is the product. Anyone can pick a winner; the matrix is what lets someone else check the reasoning.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Two engineers produce different rankings from the same table. Is one of them wrong?',
        expected:
          'Not necessarily — if they derived different weights from different requirements, both can be right. What must be checked is whether each weight is traceable to a stated requirement.',
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
    prompt: 'Why is the numerically highest parameter value not necessarily the best engineering choice?',
    hint: 'Use the supplied table.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because requirement satisfaction is not maximisation. In the supplied classification table the Military column has the best entries on reliability, life, maintenance and operating temperature, yet its cost entry is “Very High”. For a consumer product, where affordability is part of the requirement package, that column is the wrong choice despite having the best figures. Exceeding one requirement while failing another is failure.',
      },
    ],
    engineeringExplanation: 'Say “over-specification is a defect” and the examiner knows you have met this argument before.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'So when IS over-specification acceptable?',
        expected:
          'When it is the cheapest way to cover uncertainty in the requirement — for example, when the environment is not yet measured and a wider temperature range avoids a redesign later. Even then, say it out loud and price it.',
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
    prompt: 'Your matrix ranks option A first. The customer asks: “What would have to be true for B to win?” How do you answer?',
    hint: 'Sensitivity, with a number.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Name the weight and the threshold. For example: “B wins if the cost weight rises above 4 out of 5, or if the required reliability at five years rises above 0.95 — because B scores 5 on cost and 4 on reliability while A scores 3 and 5.” That is the decision boundary, and it is more useful than the ranking itself.',
      },
    ],
    engineeringExplanation: 'Presenting a decision boundary converts a judgement into something the customer can actually act on.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'And if the ranking flips when any single weight moves?',
        expected:
          'Then the requirements do not yet discriminate between the options. Report it as an open question, not as a decision, and go back to the customer.',
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
    prompt: 'Why must parameters in a matrix be traceable to the requirement?',
    hint: 'What happens when they are not?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the weights are supposed to express the requirement. If a parameter is not traceable to one, it is either irrelevant — and should be removed — or it encodes an unstated requirement that should be raised and agreed. Parameters chosen to match the strengths of a preferred option produce a matrix that justifies a decision rather than making one.',
      },
    ],
    engineeringExplanation: 'This is the failure mode that discredits matrices in real reviews. Name it before the examiner does.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'Give me a sign that a matrix has been built that way.',
        expected:
          'The parameters cluster around what the winning option is good at, and the parameters where it is weak — typically cost and power — are absent.',
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
    action: 'Distinguish',
    prompt: 'Distinguish screening from weighting, and say which you would apply to the operating temperature range.',
    hint: 'One is pass/fail.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Screening is a hard go/no-go test applied before any scoring; weighting is a scored row that contributes to a total. Operating temperature range should be applied as a screen, because it is falsifiable — a single measurement settles it — and because weighting it would let a strong score elsewhere compensate for a product that simply cannot operate at the required temperature.',
      },
    ],
    engineeringExplanation: 'Weighting a pass/fail requirement is the subtlest way to get a wrong answer with correct arithmetic.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Which parameters would you weight rather than screen?',
        expected:
          'Ones that are genuinely a matter of degree and where trade-off is legitimate — cost, life, ergonomics, power — never safety-critical or falsifiable limits.',
      },
    ],
  },
]

export const TOPIC5_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Matrix Lab' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Review Faults' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const

export const PM_REVIEW_FAULTS: {
  id: string
  title: string
  fault: string
  whyItIsWrong: string
  fix: string
}[] = [
  {
    id: 'f1',
    title: 'Parameters chosen to fit the answer',
    fault: 'A matrix in which the winning option’s strengths are all present as rows and its weaknesses are absent.',
    whyItIsWrong:
      'The matrix then justifies a decision that has already been made rather than making one. The weights may be arithmetically correct and the result still worthless.',
    fix: 'Derive every row from a line in the requirement document and delete any row that cannot be traced to one.',
  },
  {
    id: 'f2',
    title: 'Cost scored the wrong way round',
    fault: 'Cost entered as “higher is better” in a weighted matrix.',
    whyItIsWrong:
      'The matrix then rewards the most expensive option. It is a visible error that destroys the credibility of the whole analysis.',
    fix: 'Mark the direction of every parameter explicitly and invert the lower-is-better ones before weighting.',
  },
  {
    id: 'f3',
    title: 'A pass/fail requirement weighted instead of screened',
    fault: 'Operating temperature range entered as a weighted row, so a strong cost score compensates for a temperature failure.',
    whyItIsWrong:
      'A product that cannot operate at the required temperature cannot be compensated into service. Compensation is only legitimate where the requirement allows trade-off.',
    fix: 'Apply falsifiable and safety-related requirements as go/no-go screens before scoring.',
  },
  {
    id: 'f4',
    title: 'Noise reported as a ranking',
    fault: 'Two options separated by 0.15 points presented as first and second.',
    whyItIsWrong:
      'Subjective 1–5 scores are not reproducible to that precision. Presenting the gap as a decision invites a challenge the matrix cannot survive.',
    fix: 'Report a tie, find the parameter that would discriminate, and measure it rather than scoring it.',
  },
  {
    id: 'f5',
    title: 'Scores with no evidence',
    fault: 'Cells filled from memory or preference rather than from a datasheet, test report or measurement.',
    whyItIsWrong: 'An unevidenced score is an opinion wearing a number, and it cannot be reviewed.',
    fix: 'Record the source next to every score, and re-run the matrix with best and worst cases for the uncertain ones.',
  },
]
