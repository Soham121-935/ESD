import type { Question } from '../../types'

/**
 * Unit 1 Final Test — a full-length paper covering all six Unit 1 topics.
 *
 * Section structure follows a university theory paper:
 *   A  Fundamentals (2 marks)      — definitions every student must own
 *   B  Numericals (4 marks)        — one concept, one calculation, units
 *   C  Circuit & system analysis   — 8-mark analysis with verification
 *   D  Circuit design              — 8-mark design with an error budget
 *   E  Component / class selection — 4-mark selection with justification
 *   F  Troubleshooting             — 4-mark fault finding
 *   G  What-if                     — 4-mark parameter sensitivity
 *   H  Long answers                — 8-mark descriptive, exam-model format
 *
 * Provenance rule used throughout: the law, the device table, the interfacing
 * rules and the classification table are source-derived; every constructed
 * scenario value is labelled Engineering Insight in the solution text and the
 * question provenance is set to 'insight' when the numbers are constructed.
 */

export interface TestSection {
  id: string
  letter: string
  title: string
  instruction: string
  marksEach: number
  /** What this section trains, shown in the section header. */
  focus: string
  questions: Question[]
}

export const FINAL_TEST_META = {
  code: 'UETPE0513 — Electronic System Design',
  title: 'Unit 1 — Final Test',
  subtitle:
    'Six topics, one paper: Electronic System Classification, System Reliability, Op-Amp Characteristics, TTL & CMOS, System Performance Matrix, Design Matrix.',
  durationMinutes: 180,
  note: 'Attempt the paper with the book closed and the solution hidden. Mark yourself against the published marking scheme only after you have written a full answer — half-remembered model answers are why numerical marks are lost in the real exam.',
}

/* ------------------------------------------------------------------ */
/* Section A — Fundamentals                                            */
/* ------------------------------------------------------------------ */

const SECTION_A: Question[] = [
  {
    id: 'u1ft-a1',
    topicId: 'u1t2',
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt:
      'Define reliability as stated in the supplied material, and state what the exponential law predicts when the operating time equals the mean time between failures.',
    hint: 'The definition has three qualifiers — function, conditions, period. The law has one famous number.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Reliability is the ability of a product to perform its intended function under stated conditions for a stated period of time — equivalently, the probability that the unit performs the intended functionality for the stated period under the stated operating conditions.',
      },
      {
        label: 'Law (source)',
        content:
          'R(t) = e^(−λt), where λ is the system failure rate (stated as failures per month in the source). Writing m = 1/λ gives the alternative form R = e^(−t/m).',
      },
      {
        label: 'At t = m',
        content:
          'R(m) = e^(−1) = 0.37 — the probability of successful operation reduces to about 37% after one MTBF.',
      },
    ],
    marking: [
      '1 mark — the definition, including “intended function”, “stated conditions” and “stated period”.',
      '1 mark — R = e^(−λt) with λ identified as the failure rate, and the 37% result at t = m.',
    ],
    engineeringExplanation:
      'The three qualifiers are what turn reliability from an opinion into a number. And MTBF is not “the life of the product”: at one MTBF roughly two-thirds of the population has already failed, so never quote MTBF to a customer as a service life.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a2',
    topicId: 'u1t2',
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define maintainability and write the expression given for it in the supplied material.',
    hint: 'It is a probability about the repair time, not about the failure time.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Maintainability is the probability that failed equipment is restored to meet the designed specifications within a known time, called the down time, when maintenance is performed under stated conditions.',
      },
      {
        label: 'Expression (source)',
        content:
          'M(t) = Pr(T ≤ t), where T is a random variable representing the repair time.',
      },
      {
        label: 'Examiner’s note',
        content:
          'A mark is routinely lost by writing “maintainability is how easy the equipment is to repair”. Ease is not a probability: the source defines it as a probability about the repair time T, and it must be quoted with the qualifying phrase “under stated conditions”.',
      },
    ],
    marking: [
      '1 mark — restoration “to the designed specifications” “under stated conditions”.',
      '1 mark — M(t) = Pr(T ≤ t) with T identified as the repair time.',
    ],
    engineeringExplanation:
      'Reliability decides how often you repair; maintainability decides how long you are down when you do. A plant buys both, and availability is where they meet.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a3',
    topicId: 'u1t1',
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define ergonomics and state any two objectives of ergonomic design from the supplied material.',
    hint: 'It is described as an interconnection — between what three things?',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Ergonomics is the efficient and effective interconnection between man, machine and the environment around it.',
      },
      {
        label: 'Objectives (source — any two)',
        content:
          'Reduce user fatigue and stress; improve safety, comfort, job satisfaction and quality of life.',
      },
      {
        label: 'Examiner’s note',
        content:
          'Do not answer with “the product should look good” — aesthetics is a separate row of the classification table, and it is explicitly not important for industry and military products. Ergonomics is about the man–machine–environment interconnection.',
      },
    ],
    marking: [
      '1 mark — the interconnection between man, machine and environment.',
      '1 mark — any two objectives stated as reductions or improvements.',
    ],
    engineeringExplanation:
      'Ergonomics is a system requirement, not styling: it changes enclosure size, control placement, display choice and even the maintenance procedure. A unit that cannot be serviced with gloves on has failed ergonomics whatever its electrical performance.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a4',
    topicId: 'u1t1',
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'State',
    prompt: 'State the operating temperature range specified for each of the three product classes.',
    hint: 'Three ranges, three classes — and the units are part of the answer.',
    solution: [
      { label: 'Consumer (source)', content: '0 to 70 °C.' },
      { label: 'Industry (source)', content: '−25 to 85 °C.' },
      { label: 'Military (source)', content: '−55 to 125 °C.' },
      {
        label: 'Caution (Engineering Insight)',
        content:
          'These are operating ranges, not storage ranges, and a number without its unit does not earn the mark.',
      },
    ],
    marking: [
      '1 mark — any two ranges correct with units.',
      '2 marks — all three ranges correct with units.',
    ],
    engineeringExplanation:
      'Compare the required window with the class window, never the span: a 62 °C-wide requirement can still fail a 70 °C-wide class if it starts below 0 °C. That single comparison decides an entire product class.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a5',
    topicId: 'u1t3',
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt:
      'Define the input offset voltage VOS of an op-amp using the relation given in the supplied material, and state why a practical op-amp needs one.',
    hint: 'Start from the ideal relation Vo = a(Vp − Vn) and ask what breaks it.',
    solution: [
      {
        label: 'Ideal (source)',
        content: 'Vo = a(Vp − Vn), which is 0 V when Vp = Vn.',
      },
      {
        label: 'Practical (source)',
        content:
          'Due to mismatch in the input transistors a practical op-amp produces a non-zero output even with the inputs tied together. VOS is therefore the input voltage needed to bring Vo back to 0 V, and the source writes Vo = a[Vp + VOS − Vn].',
      },
      {
        label: 'Examiner’s note',
        content:
          'A mark is routinely lost by defining VOS as “the output voltage when both inputs are grounded”. That is the output error Eo, not VOS: VOS is referred to the input, and the circuit multiplies it by the noise gain.',
      },
    ],
    marking: [
      '1 mark — the ideal relation and “mismatch in the input transistors” as the cause.',
      '1 mark — VOS as the input voltage required to make Vo = 0 V, quoted as Vo = a[Vp + VOS − Vn].',
    ],
    engineeringExplanation:
      'VOS is an input-referred error, so the circuit multiplies it by the noise gain. A DC-accurate design therefore starts by choosing the gain structure and only then the device — never the other way round.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a6',
    topicId: 'u1t3',
    type: 'conceptual',
    level: 2,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define input bias current IB and input offset current IOS, and state why they exist.',
    hint: 'One is an average, one is a difference — and one word explains the difference: β.',
    solution: [
      {
        label: 'Why they exist (source)',
        content:
          'Practical op-amps draw small currents Ip and In into the input pins in order to bias the transistors of the input differential pair, and those currents are derived from the external circuit.',
      },
      {
        label: 'IB (source)',
        content: 'IB = (Ip + In)/2 — the average of the two input currents.',
      },
      {
        label: 'IOS (source)',
        content:
          'IOS = Ip − In — the difference between them, caused by mismatch in the β of the input stage.',
      },
    ],
    marking: [
      '1 mark — IB as the average input current, with the biasing reason.',
      '1 mark — IOS as the difference, attributed to β mismatch.',
    ],
    engineeringExplanation:
      'IB produces an error only when the two inputs see different resistances; IOS produces an error even when they are matched. That is exactly why fitting Rp = R1||R2 removes the IB term and leaves only R2·IOS.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a7',
    topicId: 'u1t3',
    type: 'conceptual',
    level: 2,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt:
      'Define CMRR, give its dB relation, and state the configuration in which the supplied material says it is of no serious concern, with the reason.',
    hint: 'CMRR compares two gains, and one amplifier topology keeps Vcm at zero.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Vo = a(Vp − Vn) + acm·Vcm with Vcm = (Vp + Vn)/2, so the source writes Vo = a[Vp + Vcm/CMRR − Vn]; equivalently 1/CMRR = dVOS/dVcm, specified in µV/V.',
      },
      {
        label: 'dB relation (source)',
        content: 'CMRRdB = 20 log CMRR, i.e. 1/CMRR = 10^(−CMRRdB/20). CMRR is frequency dependent and starts to roll off at about 100 Hz.',
      },
      {
        label: 'Exemption (source)',
        content:
          'CMRR is no serious concern for the inverting amplifier, because Vp is at 0 volts, so Vcm ≈ 0 and the term Vcm/CMRR contributes nothing.',
      },
    ],
    marking: [
      '1 mark — the definition together with the dB relation.',
      '1 mark — the inverting-amplifier exemption with the reason (Vp at 0 V).',
    ],
    engineeringExplanation:
      'Treat CMRR as a budget: convert dB to a linear ratio, multiply by the actual Vcm, and compare the result with the error you can afford — and remember the dB figure is a DC figure, so check the frequency too.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a8',
    topicId: 'u1t4',
    type: 'conceptual',
    level: 2,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt:
      'Define the HIGH-state and LOW-state noise margins of a logic interface, give both expressions, and state what a negative margin means.',
    hint: 'Each expression subtracts one device’s output level from another device’s input level — be explicit about which is which.',
    solution: [
      {
        label: 'Expressions (source)',
        content:
          'VNH = VOH(min) of the driver − VIH(min) of the receiver. VNL = VIL(max) of the receiver − VOL(max) of the driver.',
      },
      {
        label: 'Interpretation',
        content:
          'A positive margin is the noise voltage the interface tolerates in that state. A negative margin means the driver’s guaranteed level never reaches the receiver’s required threshold: the interface is invalid, however quiet the board is.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: the two expressions and the interfacing rules are from the supplied material; the numeric level tables quoted elsewhere in this paper are standard datasheet figures.',
      },
    ],
    marking: [
      '1 mark — both expressions with driver and receiver correctly assigned.',
      '1 mark — the meaning of a negative margin.',
    ],
    engineeringExplanation:
      'Taking the driver and receiver columns from the wrong rows is the commonest arithmetic error in this topic. Write “driver” and “receiver” beside every number before you subtract.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a9',
    topicId: 'u1t4',
    type: 'conceptual',
    level: 2,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define the fan-out of a logic gate and state the two conditions that must both be satisfied.',
    hint: 'One condition is about sinking current, the other about sourcing it — and only one of them is usually binding.',
    solution: [
      {
        label: 'Definition',
        content:
          'Fan-out is the number of identical inputs an output can drive while still meeting its guaranteed output levels.',
      },
      {
        label: 'LOW state',
        content: 'N·IIL ≤ IOL(max), i.e. N ≤ IOL(max)/IIL.',
      },
      {
        label: 'HIGH state',
        content: 'N·IIH ≤ IOH(max), i.e. N ≤ IOH(max)/IIH. The usable fan-out is the smaller of the two results.',
      },
      {
        label: 'Scale (source)',
        content:
          'The supplied material gives the two anchors: a 74S00 sinks 20 mA (12.5 unit loads) and a 74LS sinks 8.0 mA (5 unit loads), both at VOL = 0.5 V.',
      },
    ],
    marking: [
      '1 mark — the definition in terms of guaranteed levels.',
      '1 mark — both inequalities and “take the smaller value”.',
    ],
    engineeringExplanation:
      'The two limits are almost never equal, and the smaller one is the fan-out. Derate it further for temperature and for capacitive loading before you commit it to a board.',
    provenance: 'source',
  },
  {
    id: 'u1ft-a10',
    topicId: 'u1t5',
    type: 'conceptual',
    level: 2,
    marks: 2,
    skill: 'concept',
    action: 'Distinguish',
    prompt: 'Distinguish a system performance matrix from a design matrix, in one sentence each.',
    hint: 'One compares things that already exist; the other is written before anything exists.',
    solution: [
      {
        label: 'Performance matrix',
        content:
          'A table that scores complete candidate systems (columns) against performance parameters (rows) with weights, in order to choose between options that already exist.',
      },
      {
        label: 'Design matrix',
        content:
          'A table that maps requirements onto the design parameters of the thing you are about to build, so that every architectural decision can be traced back to a requirement.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: neither matrix is defined in the supplied course material. The anchor is the supplied “Classification of Electronic Product” table, which already has the shape of a performance matrix — parameters as rows, candidate classes as columns — but no weights.',
      },
    ],
    marking: [
      '1 mark — performance matrix: comparing existing candidates with weighted parameters.',
      '1 mark — design matrix: mapping requirements to parameters before the design is built.',
    ],
    engineeringExplanation:
      'Same artefact, different moment: the performance matrix at selection time, the design matrix at architecture time. Both are decoration until they carry weights.',
    provenance: 'insight',
  },
]

/* ------------------------------------------------------------------ */
/* Section B — Numericals                                              */
/* ------------------------------------------------------------------ */

const SECTION_B: Question[] = [
  {
    id: 'u1ft-b1',
    topicId: 'u1t2',
    type: 'numerical',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt:
      'A batch of industrial transmitters has a stated failure rate λ = 0.01 failures per month and 200 units are installed. Using the exponential law, calculate (a) the mean time between failures, (b) the reliability over the first 12 months, and (c) the number of units expected to be running after 12 months.',
    hint: 'Check that λ and t share a time unit before you form the product λt.',
    solution: [
      { label: 'Given', content: 'λ = 0.01 failures per month; t = 12 months; N = 200 units installed.' },
      { label: 'Required', content: '(a) m, (b) R(12 months), (c) expected survivors.' },
      {
        label: 'Principle (source)',
        content:
          'R(t) = e^(−λt) with m = 1/λ, so R = e^(−t/m). The exponent must be dimensionless, so λ and t must use the same time unit. Values of λ and N here are chosen for practice (Engineering Insight).',
      },
      { label: 'Calculation (a)', content: 'm = 1/λ = 1/0.01 = 100 months.' },
      {
        label: 'Calculation (b)',
        content: 'λt = 0.01 × 12 = 0.12 → R(12) = e^(−0.12) = 0.887, i.e. 88.7%.',
      },
      {
        label: 'Calculation (c)',
        content: 'Survivors = N × R = 200 × 0.887 = 177.4 → about 177 units; expected failures ≈ 23.',
      },
      {
        label: 'Verification',
        content:
          'At t = m = 100 months, R = e^(−1) = 0.37 → 74 of 200, which reproduces the source anchor exactly.',
      },
      {
        label: 'Interpretation',
        content:
          'Reliability here is a population statement: it predicts the fraction surviving, not the fate of any individual unit. It is also not a warranty prediction — it says nothing about which 23 units fail.',
      },
    ],
    marking: [
      '1 mark — m = 100 months with the unit carried through the reciprocal.',
      '1 mark — λt = 0.12 formed from matching units.',
      '1 mark — R = 0.887 (88.7%).',
      '1 mark — 177 survivors, with the 37% check at t = m.',
    ],
    engineeringExplanation:
      'Two students get this wrong in the exam: the one who forgets the unit on λ, and the one who reports “reliability = 88.7%” without saying what it means for the 200 installed units. Quote the number and then the decision it supports.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-b2',
    topicId: 'u1t3',
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt:
      'For the inverting amplifier of the supplied problem — R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, a 2 kΩ load and IQ = 0.5 mA — calculate the closed-loop gain, the output voltage, the load current io with its direction, and the supply currents icc and iee.',
    hint: 'Decide from the sign of Vo which of the two source relations applies, and remember that Io = 0 is not the case here.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ; Rf = 20 kΩ; Vi = 3 V; RL = 2 kΩ to ground; IQ = 0.5 mA.' },
      { label: 'Required', content: 'Av, Vo, io (magnitude and direction), icc, iee.' },
      {
        label: 'Principle (source)',
        content:
          'Ideal inverting gain Av = −Rf/R1. The source supply-current relations are: ICC always flows into the VCC terminal; IEE always flows out of the VEE terminal; ICC = Io + IEE at VO+, or IEE = ICC + Io at VO−; and when Io = 0, ICC = IEE = IQ.',
      },
      { label: 'Calculation — gain', content: 'Av = −Rf/R1 = −20 kΩ / 10 kΩ = −2 V/V.' },
      { label: 'Calculation — output', content: 'Vo = Av × Vi = −2 × 3 V = −6 V.' },
      {
        label: 'Calculation — load current',
        content:
          'io = |Vo| / RL = 6 V / 2 kΩ = 3 mA. Because Vo is negative, the load current flows from ground through RL and INTO the op-amp output terminal.',
      },
      {
        label: 'Calculation — supply currents',
        content:
          'Vo is negative, so the relation IEE = ICC + Io applies. The quiescent current fixes ICC = IQ = 0.5 mA, hence IEE = 0.5 mA + 3 mA = 3.5 mA.',
      },
      {
        label: 'Verification',
        content:
          '|Vo| = 6 V is far below the saturation limit (about 2 V inside either rail), so the amplifier is in its linear region and the ideal gain expression is valid.',
      },
      {
        label: 'Interpretation',
        content:
          'Almost all of the 3.5 mA drawn from the negative rail is load current, not quiescent current. Size the supply for the load, not for the datasheet quiescent figure.',
      },
    ],
    marking: [
      '1 mark — Av = −2.',
      '1 mark — Vo = −6 V.',
      '1 mark — io = 3 mA with the direction stated (into the op-amp).',
      '1 mark — icc = 0.5 mA and iee = 3.5 mA, with the source relation IEE = ICC + Io quoted.',
    ],
    engineeringExplanation:
      'The mark that is most often dropped is the direction of io: |io| alone is half an answer. The sign of Vo tells you which supply rail delivers the load current, and that is the whole point of the source’s two current relations.',
    provenance: 'source',
  },
  {
    id: 'u1ft-b3',
    topicId: 'u1t3',
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt:
      'The supplied example uses R1 = 22 kΩ and R2 = 2.2 MΩ with IB = 80 nA and IOS = 20 nA. (a) State the value of the compensating resistor Rp that nulls the IB term. (b) Hence calculate the output error Eo. (c) Recalculate Eo if all resistances are simultaneously reduced by a factor of 10. (d) Recalculate Eo for part (c) with an op-amp having IOS = 3 nA. Comment on the sequence.',
    hint: 'Once Rp matches R1||R2 the general expression collapses to a single product — find that product first.',
    solution: [
      { label: 'Given', content: 'R1 = 22 kΩ; R2 = 2.2 MΩ; IB = 80 nA; IOS = 20 nA.' },
      { label: 'Required', content: 'Rp, then Eo in three cases.' },
      {
        label: 'Principle (source)',
        content:
          'Eo = (1 + R2/R1){[(R1||R2) − Rp]·IB − [(R1||R2) + Rp]·IOS/2}. When Rp = R1||R2 the IB term vanishes and the expression collapses to Eo = R2·IOS.',
      },
      {
        label: 'Calculation (a)',
        content: 'Rp = R1||R2 = (22 kΩ × 2.2 MΩ)/(22 kΩ + 2.2 MΩ) = 21.8 kΩ.',
      },
      { label: 'Calculation (b)', content: 'Eo = R2·IOS = 2.2 MΩ × 20 nA = 44 mV.' },
      {
        label: 'Calculation (c)',
        content: 'All resistances ÷ 10 → R2 = 220 kΩ. Eo = 220 kΩ × 20 nA = 4.4 mV.',
      },
      {
        label: 'Calculation (d)',
        content: 'With IOS = 3 nA: Eo = 220 kΩ × 3 nA = 0.66 mV ≈ 0.7 mV.',
      },
      {
        label: 'Comment (source sequence)',
        content:
          '44 mV → 4.4 mV → 0.7 mV: a factor of about 60, obtained without changing the gain, because the gain depends on the ratio R2/R1 while the bias error depends on the absolute value of R2. Engineering Insight: scaling the resistors down also loads the signal source more and raises the supply current, so the improvement is not free.',
      },
    ],
    marking: [
      '1 mark — Rp = R1||R2 = 21.8 kΩ.',
      '1 mark — Eo = R2·IOS = 44 mV.',
      '1 mark — 4.4 mV after scaling all resistances down.',
      '1 mark — 0.7 mV with IOS = 3 nA, plus the comment that the gain is unchanged.',
    ],
    engineeringExplanation:
      'This is the cleanest demonstration in the whole topic that matching and scaling are free accuracy: the error terms scale with absolute resistance while the gain scales with a ratio. Use it whenever someone proposes megohm resistors in a precision design.',
    provenance: 'source',
  },
  {
    id: 'u1ft-b4',
    topicId: 'u1t4',
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt:
      'A 74HC gate operating from a 5 V supply drives twelve 74LS inputs. The 74HC output is rated IOL(max) = 4 mA and IOH(max) = 4 mA; a 74LS input requires IIL = 0.4 mA and IIH = 20 µA. Determine the fan-out in both states, state whether twelve loads are acceptable, and give the remedy if not.',
    hint: 'Compute both ratios, take the smaller, and then say which state failed and why.',
    solution: [
      {
        label: 'Given',
        content:
          'Driver 74HC: IOL(max) = 4 mA, IOH(max) = 4 mA. Receiver 74LS: IIL = 0.4 mA, IIH = 20 µA. Proposed N = 12. Engineering Insight: these are standard 74-series datasheet figures; the fan-out idea and the unit-load facts are from the supplied material.',
      },
      { label: 'Required', content: 'Fan-out in both states, verdict on 12 loads, remedy.' },
      { label: 'LOW state', content: 'N ≤ IOL/IIL = 4 mA / 0.4 mA = 10.' },
      { label: 'HIGH state', content: 'N ≤ IOH/IIH = 4 mA / 0.02 mA = 200.' },
      {
        label: 'Verdict',
        content:
          'Usable fan-out = min(10, 200) = 10. Twelve loads exceed it: the driver would have to sink 12 × 0.4 mA = 4.8 mA against a guaranteed 4 mA, so VOL rises above its guaranteed maximum and the following gates can enter their indeterminate input region.',
      },
      {
        label: 'Remedy',
        content:
          'Buffer the 74HC output, or split the twelve loads across two drivers (six each). The HIGH state has enormous margin and is never the constraint here — which is exactly why quoting only one ratio is a mistake.',
      },
    ],
    marking: [
      '1 mark — LOW-state fan-out = 10.',
      '1 mark — HIGH-state fan-out = 200.',
      '1 mark — taking the smaller value and rejecting 12 loads with the current arithmetic (4.8 mA > 4 mA).',
      '1 mark — a valid remedy (buffer or split the load).',
    ],
    engineeringExplanation:
      'CMOS-to-TTL loading is a LOW-state problem, and the source says so explicitly: “Driving HIGH: no problem … Driving LOW: concern fan-out problem — use buffer”. If your answer blames the HIGH state, your two ratios came out in the wrong order.',
    provenance: 'insight',
  },
]

/* ------------------------------------------------------------------ */
/* Section C — Circuit & system analysis                               */
/* ------------------------------------------------------------------ */

const SECTION_C: Question[] = [
  {
    id: 'u1ft-c1',
    topicId: 'u1t3',
    type: 'circuit-analysis',
    level: 3,
    marks: 8,
    skill: 'analysis',
    action: 'Analyse',
    prompt:
      'The supplied inverting amplifier has R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, a 2 kΩ load to ground and IQ = 0.5 mA. (a) Determine Vo, io with its direction, icc and iee. (b) Determine the power dissipated inside the op-amp, stating every assumption you make. (c) Check that the output is not in saturation, and state what happens if Vi is raised to 10 V.',
    hint: 'The assignment statement does not give the supply rails. You must declare the value you use before any power figure can be calculated.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ; Rf = 20 kΩ; Vi = 3 V; RL = 2 kΩ; IQ = 0.5 mA.' },
      {
        label: 'Assumption (declared)',
        content:
          'Supply rails of ±15 V. The assignment statement supplies R1, Rf, Vi, the load and IQ but never the rails; ±15 V is the value the source uses in its own saturation example. An answer that produces a power figure without declaring this is incomplete.',
      },
      {
        label: 'Principle (source)',
        content:
          'Av = −Rf/R1; io = |Vo|/RL; ICC flows into VCC, IEE flows out of VEE, and IEE = ICC + Io at VO−; when Io = 0, ICC = IEE = IQ. The output saturates about 2 V below VCC (the source’s own example: ±15 V rails give about ±13 V; ±9 V rails give about ±7 V).',
      },
      { label: '(a) Gain and output', content: 'Av = −20 kΩ/10 kΩ = −2. Vo = −2 × 3 V = −6 V.' },
      {
        label: '(a) Load current',
        content: 'io = 6 V / 2 kΩ = 3 mA, flowing INTO the op-amp output terminal because Vo is negative.',
      },
      {
        label: '(a) Supply currents',
        content: 'Vo negative → IEE = ICC + Io. ICC = IQ = 0.5 mA, so IEE = 0.5 + 3 = 3.5 mA.',
      },
      {
        label: '(b) Power — supply',
        content: 'P_supply = VCC·ICC + |VEE|·IEE = 15 V × 0.5 mA + 15 V × 3.5 mA = 7.5 + 52.5 = 60 mW.',
      },
      { label: '(b) Power — load', content: 'P_load = |Vo| × io = 6 V × 3 mA = 18 mW.' },
      {
        label: '(b) Power — inside the op-amp',
        content:
          'P_inside = P_supply − P_load = 60 mW − 18 mW = 42 mW. Write both figures and label both: if the examiner means “total power drawn from the supplies”, the answer is 60 mW; if they mean “dissipated inside the device”, it is 42 mW. Saying which definition you are using is the difference between a full-mark and a half-mark answer.',
      },
      {
        label: '(c) Saturation check',
        content:
          'On ±15 V rails the output limit is about ±13 V. |−6 V| < 13 V, so the amplifier is linear and the ideal gain is valid.',
      },
      {
        label: '(c) Vi = 10 V',
        content:
          'The ideal output would be −20 V, which is beyond the −13 V limit: the output clamps near −13 V, the gain relation fails, io becomes 13 V / 2 kΩ = 6.5 mA and IEE ≈ 7 mA. The signal is destroyed — the amplifier is now a comparator, not an amplifier.',
      },
    ],
    marking: [
      '2 marks — Vo = −6 V and io = 3 mA with the direction stated.',
      '2 marks — icc = 0.5 mA and iee = 3.5 mA, with the source relation IEE = ICC + Io quoted.',
      '2 marks — 60 mW and 42 mW, with the ±15 V assumption declared and both definitions named.',
      '2 marks — the saturation check (≈ ±13 V) and the consequence at Vi = 10 V.',
    ],
    engineeringExplanation:
      'This single problem contains the three habits examiners reward: state the sign convention for current, declare every assumption the question omitted, and finish with a check that could have failed. A student who writes “P = 42 mW” without the rails has guessed; one who writes “assuming ±15 V rails, 42 mW inside the device (60 mW from the supplies)” has engineered.',
    provenance: 'source',
  },
  {
    id: 'u1ft-c2',
    topicId: 'u1t4',
    type: 'circuit-analysis',
    level: 3,
    marks: 8,
    skill: 'analysis',
    action: 'Analyse',
    prompt:
      'A 74LS gate (VOH(min) = 2.7 V, VOL(max) = 0.5 V) drives a 74HC input (VIH(min) = 3.5 V, VIL(max) = 1.5 V) from the same 5 V supply. (a) Calculate both noise margins and state the consequence. (b) Give two ways to make the interface work, and verify the HIGH-state margin for one of them. (c) Explain why the interface might still appear to work on the bench.',
    hint: 'Both margins come from the same four numbers — but only one of them is allowed to be negative before the circuit is dead.',
    solution: [
      {
        label: 'Given',
        content:
          'Driver 74LS: VOH(min) = 2.7 V, VOL(max) = 0.5 V. Receiver 74HC at 5 V: VIH(min) = 3.5 V, VIL(max) = 1.5 V. Engineering Insight: the numeric levels are standard datasheet figures; the expressions and the pull-up remedy are from the supplied material.',
      },
      {
        label: '(a) HIGH-state margin',
        content: 'VNH = VOH(min) of the driver − VIH(min) of the receiver = 2.7 V − 3.5 V = −0.8 V.',
      },
      {
        label: '(a) LOW-state margin',
        content: 'VNL = VIL(max) of the receiver − VOL(max) of the driver = 1.5 V − 0.5 V = +1.0 V.',
      },
      {
        label: '(a) Consequence',
        content:
          'The HIGH state has no margin at all: the driver’s guaranteed HIGH never reaches the receiver’s required HIGH, so the interface is invalid by specification. The LOW state is comfortable, with 1 V of noise tolerance. Only the HIGH state needs fixing.',
      },
      {
        label: '(b) Fix 1 — pull-up resistor',
        content:
          'The supplied rule is a pull-up resistor at the TTL output. With R_p = 2.2 kΩ and six CMOS inputs (IIH = 1 µA each): when the output is HIGH, VOH ≈ 5 V − (2.2 kΩ × 6 µA) = 4.99 V, so VNH = 4.99 − 3.5 = +1.49 V. When the output is LOW the resistor adds (5 − 0.5)/2.2 kΩ = 2.05 mA to the sink budget, well inside the 8 mA an LS output guarantees.',
      },
      {
        label: '(b) Fix 2 — 74HCT',
        content:
          'Replace the 74HC part with a 74HCT part, whose input levels are TTL-compatible (VIH(min) = 2.0 V). Then VNH = 2.7 − 2.0 = +0.7 V — positive, guaranteed, and with no extra component.',
      },
      {
        label: '(b) Note on the LOW state',
        content: 'Neither fix changes VNL, which stays at about +1.0 V. Always re-check the state you did not fix.',
      },
      {
        label: '(c) Why the bench test passes',
        content:
          'Typical values work where guaranteed values do not: a typical LS output idles near 3.4–3.6 V and a typical HC input switches near 2.5 V. The circuit has been built on the overlap of two distributions, so it works at 25 °C on one board and fails in a warm cabinet or with a different lot. Design to the guaranteed levels, never the typical ones.',
      },
    ],
    marking: [
      '2 marks — VNH = −0.8 V and VNL = +1.0 V, with driver and receiver identified in each subtraction.',
      '2 marks — the conclusion: negative margin means the interface is invalid by specification.',
      '2 marks — two valid fixes named from the supplied rules.',
      '2 marks — the verification arithmetic for one fix (VNH ≈ +1.49 V or +0.7 V) and the typical-vs-guaranteed explanation.',
    ],
    engineeringExplanation:
      'This is the canonical TTL→CMOS failure, and it is a specification failure rather than a component failure — which is why it survives the bench test and dies in the field. Every interfacing question in this topic is answered by the same two numbers; compute them before you reach for a remedy.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-c3',
    topicId: 'u1t3',
    type: 'circuit-analysis',
    level: 4,
    marks: 8,
    skill: 'analysis',
    action: 'Analyse',
    prompt:
      'An inverting amplifier uses R1 = 10 kΩ and R2 = 1 MΩ with the bias-compensation resistor Rp fitted. It is built first with a 741C (VOS = 2 mV typical, IOS = 20 nA) and then with an OP-77 (VOS = 10 µV typical, IOS = 0.3 nA). (a) Calculate the DC noise gain. (b) Calculate the output error contributed by VOS in each case. (c) Calculate the output error contributed by the bias currents in each case. (d) State whether CMRR matters here, and why. (e) Which device meets a 1% error budget on a 3 V full-scale output?',
    hint: 'VOS is multiplied by the noise gain; the matched-Rp bias error is not. Keep the two mechanisms in separate lines.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ; R2 = 1 MΩ; Rp = R1||R2. 741C: VOS = 2 mV, IOS = 20 nA. OP-77: VOS = 10 µV, IOS = 0.3 nA. Full scale 3 V. Engineering Insight: the 1% budget is a constructed requirement; the device data and the error relations are from the supplied material.' },
      { label: 'Required', content: 'Noise gain; both error terms for both devices; the CMRR verdict; the 1% verdict.' },
      {
        label: '(a) Noise gain (source)',
        content: 'DC noise gain = 1 + R2/R1 = 1 + 1 MΩ/10 kΩ = 1 + 100 = 101 V/V.',
      },
      {
        label: '(b) VOS error (source)',
        content:
          'Eo = (1 + R2/R1)·VOS. 741C: 101 × 2 mV = 202 mV (and 101 × 6 mV = 606 mV at the datasheet maximum — the source calls this “quite an error!”). OP-77: 101 × 10 µV = 1.01 mV.',
      },
      {
        label: '(c) Bias-current error (source)',
        content:
          'With Rp = R1||R2 the IB term cancels and the expression collapses to Eo = R2·IOS. 741C: 1 MΩ × 20 nA = 20 mV. OP-77: 1 MΩ × 0.3 nA = 0.30 mV.',
      },
      {
        label: '(c) Totals',
        content: 'Typical total output error: 741C ≈ 202 + 20 = 222 mV. OP-77 ≈ 1.01 + 0.30 = 1.31 mV.',
      },
      {
        label: '(d) CMRR (source)',
        content:
          'CMRR is no serious concern here: this is an inverting amplifier, so Vp sits at 0 V, Vcm ≈ 0, and the term Vcm/CMRR contributes nothing to the output. The source states this exemption explicitly.',
      },
      {
        label: '(e) Budget verdict',
        content:
          '1% of 3 V = 30 mV. The 741C contributes 222 mV = 7.4% of full scale and fails by a factor of about 7. The OP-77 contributes 1.31 mV = 0.044% and passes with a factor of about 23 in hand.',
      },
      {
        label: 'What-if (Engineering Insight)',
        content:
          'Scaling both resistors down by 10 divides the bias term by 10 (20 mV → 2 mV) but leaves the VOS term at 202 mV, because VOS is multiplied by a ratio and the bias error by an absolute resistance. Matching Rp and lowering IOS are the only cures for the second term.',
      },
    ],
    marking: [
      '2 marks — noise gain = 101 V/V.',
      '2 marks — VOS terms: 202 mV (741C) and 1.01 mV (OP-77).',
      '2 marks — bias terms: 20 mV and 0.30 mV, with the Rp = R1||R2 justification for using Eo = R2·IOS.',
      '1 mark — the CMRR exemption with the Vp = 0 V reason.',
      '1 mark — the 1% verdict with both percentages quoted.',
    ],
    engineeringExplanation:
      'An error budget is a table, not a feeling: one line per mechanism, each with its own formula, all referred to the output, and only then summed. Notice that changing the device bought a factor of 170 while changing the resistors would have bought a factor of 10 — the budget tells you where to spend money.',
    provenance: 'source',
  },
]

/* ------------------------------------------------------------------ */
/* Section D — Circuit design                                          */
/* ------------------------------------------------------------------ */

const SECTION_D: Question[] = [
  {
    id: 'u1ft-d1',
    topicId: 'u1t3',
    type: 'circuit-design',
    level: 4,
    marks: 8,
    skill: 'design',
    action: 'Design',
    prompt:
      'Design an inverting amplifier that maps a 0 to 200 mV shunt output onto a 0 to 3.3 V ADC input, with the total static error below 1% of full scale at 25 °C and still inside that budget at 70 °C. Choose R1, Rf and Rp, choose the op-amp from the supplied device table, and verify the load, the saturation margin and the error budget. State one failure mode of your design.',
    hint: 'Required gain first, then noise gain, then the error budget — the budget is what chooses the device, not the other way round.',
    solution: [
      {
        label: 'Requirement',
        content:
          '|Av| = 3.3 V / 0.2 V = 16.5. Error budget: 1% of 3.3 V full scale = 33 mV referred to the output, at 25 °C and at 70 °C.',
      },
      {
        label: 'Constraints and assumptions',
        content:
          '±15 V rails (Engineering Insight — the value the source uses in its own examples). ADC input is high impedance. The sign inversion is absorbed in software; if a positive-going output is mandatory, add a second unity-gain inverting stage and budget its error too.',
      },
      {
        label: 'Topology',
        content:
          'Standard inverting amplifier with a bias-compensation resistor Rp from the non-inverting input to ground.',
      },
      {
        label: 'Selection — resistors',
        content:
          'Choose R1 = 2.0 kΩ and Rf = 33 kΩ, giving |Av| = 33/2 = 16.5 exactly with both values in the E12 series. DC noise gain = 1 + 16.5 = 17.5.',
      },
      {
        label: 'Selection — Rp',
        content:
          'Rp = R1||Rf = (2 kΩ × 33 kΩ)/(35 kΩ) = 1.886 kΩ → use 1.9 kΩ (E24). The residual mismatch is only 14 Ω, so the leftover IB term is 17.5 × 14 Ω × 80 nA ≈ 0.02 µV even for a 741 — negligible next to the IOS term.',
      },
      {
        label: 'Error budget — 741C',
        content:
          'Eo(VOS) = 17.5 × 2 mV = 35.0 mV. Eo(bias) = Rf × IOS = 33 kΩ × 20 nA = 0.66 mV. Total ≈ 35.7 mV = 1.08% of full scale → FAILS the 1% budget at 25 °C, before any drift is added.',
      },
      {
        label: 'Error budget — OP-07',
        content:
          'Eo(VOS) = 17.5 × 30 µV = 0.525 mV. Eo(bias) = 33 kΩ × 0.3 nA = 0.0099 mV. Total ≈ 0.54 mV = 0.016%. At 70 °C with TC(VOS) = 0.3 µV/°C: VOS = 30 µV + 0.3 × 45 = 43.5 µV → Eo(VOS) = 0.76 mV, still 43× inside the budget. Select the OP-07; the OP-77 (10 µV, TC 0.1 µV/°C) also passes if more margin is wanted.',
      },
      {
        label: 'Verification — load and saturation',
        content:
          'Output range 0 to 3.3 V against a ±13 V limit: no saturation risk. Into a 10 kΩ ADC input, io = 0.33 mA — far inside any op-amp rating. Check the shunt side too: R1 = 2 kΩ loads the shunt, so confirm the shunt source impedance is small compared with 2 kΩ.',
      },
      {
        label: 'Practical note (source)',
        content:
          'Decoupling: 10 µF at the point where the supply enters the board, plus a 0.1 µF ceramic at the supply pins mounted in very close vicinity to the pins.',
      },
      {
        label: 'Failure modes',
        content:
          'Wiring resistance in series with the shunt adds directly to R1 and changes the gain; a single-supply rail would clip the output near 0 V and destroy the “0 V in → 0 V out” end of the range; OP-07 input bias-current cancellation is defeated if the source impedance seen by the two inputs is badly unbalanced.',
      },
      {
        label: 'Alternative',
        content:
          'If the shunt is not ground-referred, an instrumentation amplifier is the correct topology and the error budget has to be rebuilt around its CMRR instead.',
      },
    ],
    marking: [
      '2 marks — gain requirement, standard resistor values and the resulting noise gain.',
      '2 marks — Rp = R1||Rf with the residual-error argument.',
      '2 marks — the error budget for at least two devices, with the OP-07 selection justified by numbers.',
      '1 mark — load, saturation and decoupling checks.',
      '1 mark — a failure mode or an alternative topology.',
    ],
    engineeringExplanation:
      'Notice what decided this design: not the gain, which any resistor pair provides, but the error budget — and within the budget, the temperature drift, which is the term the datasheet typical column hides. Choose the device last, from the numbers.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-d2',
    topicId: 'u1t4',
    type: 'circuit-design',
    level: 4,
    marks: 8,
    skill: 'design',
    action: 'Design',
    prompt:
      'One 74LS gate at 5 V must drive six 74HC inputs. (a) Show with numbers why a direct connection fails. (b) Choose a pull-up resistor value, calculating both bounds. (c) Verify the sink current and the HIGH-state margin for the value you chose. (d) State the alternative that needs no resistor, with the margin it achieves.',
    hint: 'The lower bound comes from the LOW state (how much extra current can the driver still sink?) and the upper bound from the HIGH state (how much leakage must the resistor still hold up?).',
    solution: [
      {
        label: 'Given',
        content:
          'VCC = 5 V. Driver 74LS: VOH(min) = 2.7 V, VOL(max) = 0.5 V, IOL(max) = 8 mA (source: 74LS is guaranteed to sink 8.0 mA, i.e. 5 unit loads). Six 74HC inputs: VIH(min) = 3.5 V, IIH = 1 µA, IIL = 1 µA each. Engineering Insight: the current and level figures are standard datasheet values; the pull-up remedy is the supplied rule.',
      },
      {
        label: '(a) Why the direct connection fails',
        content:
          'VNH = VOH(min) − VIH(min) = 2.7 V − 3.5 V = −0.8 V. The driver’s guaranteed HIGH never reaches the receiver’s required HIGH, so the interface is invalid by specification. VNL = 1.5 − 0.5 = +1.0 V, so only the HIGH state needs work.',
      },
      {
        label: '(b) Lower bound — LOW state',
        content:
          'R_p ≥ (VCC − VOL(max)) / (IOL(max) − N·IIL) = (5 − 0.5) V / (8 mA − 6 µA) = 4.5 V / 7.994 mA = 563 Ω.',
      },
      {
        label: '(b) Upper bound — HIGH state',
        content: 'R_p ≤ (VCC − VIH(min)) / (N·IIH) = (5 − 3.5) V / 6 µA = 250 kΩ.',
      },
      {
        label: '(b) Choice',
        content:
          'Choose R_p = 2.2 kΩ — a standard value comfortably inside both bounds, with the binding LOW state satisfied by a factor of nearly 4.',
      },
      {
        label: '(c) Verification — LOW',
        content:
          'Resistor current = (5 − 0.5)/2.2 kΩ = 2.05 mA; total sink = 2.05 mA + 6 µA = 2.06 mA against a guaranteed 8 mA. VOL stays inside 0.5 V, so VNL is unchanged at about 1.0 V.',
      },
      {
        label: '(c) Verification — HIGH',
        content:
          'VOH ≈ 5 V − (2.2 kΩ × 6 µA) = 4.987 V, giving VNH = 4.987 − 3.5 = +1.49 V. The interface now has about 1.5 V of HIGH-state noise margin instead of −0.8 V.',
      },
      {
        label: '(d) Alternative — 74HCT',
        content:
          'Replace the 74HC device with a 74HCT device, whose inputs are TTL-compatible (VIH(min) = 2.0 V): VNH = 2.7 − 2.0 = +0.7 V guaranteed, with no resistor, no extra LOW-state current and no extra components. The pull-up gives more margin; the HCT gives the simpler board. Engineering Insight: the pull-up also slows the rising edge by roughly R_p × C_load, so for fast signals prefer the HCT.',
      },
      {
        label: 'Precaution (source)',
        content:
          'Never tie TTL totem-pole outputs together — the indeterminate range that results can damage the ICs. Open-collector (TTL) and open-drain (CMOS) outputs are the ones that may share a pull-up, and tri-state outputs may share a bus provided only one is enabled at a time.',
      },
    ],
    marking: [
      '2 marks — the failure demonstrated with VNH = −0.8 V, with VNL = +1.0 V shown to be adequate.',
      '3 marks — both bounds calculated (563 Ω and 250 kΩ) and a standard value chosen between them.',
      '2 marks — verification of both states (2.06 mA sink; VNH ≈ 1.49 V).',
      '1 mark — the 74HCT alternative with its +0.7 V margin.',
    ],
    engineeringExplanation:
      'A pull-up is not a value you copy from a lab manual — it is bounded from below by how much current the driver can still sink when LOW and from above by how much leakage it must hold up when HIGH. Compute both bounds and every interfacing question of this type becomes mechanical.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-d3',
    topicId: 'u1t6',
    type: 'design',
    level: 4,
    marks: 8,
    skill: 'design',
    action: 'Design',
    prompt:
      'A two-wire 4–20 mA temperature transmitter must be selected for a plant with a −25 °C to +85 °C ambient, an accuracy requirement of 0.5% of span, a constrained unit cost and a rule that a technician must replace and calibrate a unit in under 30 minutes. Three architectures are available: a single general-purpose channel, a single derated precision channel, and dual redundant precision channels with changeover. Build the design matrix, select the architecture, and state the sensitivity of the decision.',
    hint: 'Derive every parameter from a line of the requirement before you touch a score — a parameter with no requirement behind it does not belong in the matrix.',
    solution: [
      {
        label: 'Requirement → parameters',
        content:
          'Accuracy (weight 5 — from the 0.5% of span requirement); environmental capability (4 — from the −25 to +85 °C ambient); power (3 — the loop is loop-powered, so consumption is a real constraint); unit cost (4 — the stated cost constraint); serviceability (3 — the 30-minute swap rule); complexity (2 — the lowest of the six, because it is a consequence rather than a requirement).',
      },
      {
        label: 'Scoring convention',
        content:
          'Every score runs in the “good” direction, so 5 is always the best value: power is entered as low consumption, cost as affordability, complexity as simplicity. Mixing conventions in one table is the classic error that makes a matrix reward the most expensive option.',
      },
      {
        label: 'Scores (Engineering Insight)',
        content:
          'Single general-purpose: accuracy 2, environment 3, power 4, cost 5, serviceability 4, complexity 5. Single derated precision: 4, 4, 4, 3, 4, 4. Dual redundant precision: 5, 5, 2, 1, 2, 1.',
      },
      {
        label: 'Weighted totals',
        content:
          'Σ(weights) = 5 + 4 + 3 + 4 + 3 + 2 = 21. Single: (10 + 12 + 12 + 20 + 12 + 10)/21 = 76/21 = 3.62. Precision: (20 + 16 + 12 + 12 + 12 + 8)/21 = 80/21 = 3.81. Redundant: (25 + 20 + 6 + 4 + 6 + 2)/21 = 63/21 = 3.00.',
      },
      {
        label: 'Decision',
        content:
          'Select the single derated precision channel — but record the result honestly: it leads the general-purpose channel by only 0.19 points, which is inside the noise of any subjective 1–5 scoring. The defensible statement is “precision, with the general-purpose channel not excluded”. The redundant architecture is eliminated on cost and serviceability.',
      },
      {
        label: 'Sensitivity',
        content:
          'Weight only accuracy (5) and environment (4) and the redundant architecture scores (25 + 20)/9 = 5.00 against precision’s (20 + 16)/9 = 4.00: the ranking flips. The decision is therefore stable only while cost and serviceability carry real weight. If the 0.5% accuracy requirement is ever reclassified as safety-critical, the redundant architecture becomes the correct answer — and that is a requirement change, not a scoring change.',
      },
      {
        label: 'Verification against the requirement',
        content:
          'The precision channel covers −25 to +85 °C within the industry class, its accuracy supports 0.5% of span, and its serviceability score of 4 is consistent with a 30-minute swap. The general-purpose channel is marginal on accuracy and environment; the redundant channel fails the cost constraint outright.',
      },
      {
        label: 'Failure modes',
        content:
          'Parameters chosen to favour a preferred architecture; a hard constraint such as the cost ceiling entered as a score instead of applied outside the matrix; the 0.19-point gap reported as a decision rather than as a tie.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: the design matrix is not defined in the supplied course material. The anchor is the supplied Classification of Electronic Product table, which is already a parameter-by-candidate matrix; what it lacks — weights and an explicit direction for each parameter — is exactly what turns a comparison into a decision.',
      },
    ],
    marking: [
      '2 marks — parameters derived from named requirement lines, each with a justified weight.',
      '3 marks — the weighted arithmetic for all three options, with the scoring convention stated.',
      '2 marks — the selection, including the honest statement that a 0.19-point gap is a tie.',
      '1 mark — the sensitivity: which weighting flips the ranking, and why.',
    ],
    engineeringExplanation:
      'The artefact is not the table, it is the argument. “Precision, because it leads by 0.19, and here is the weight that would flip it” survives a design review; “precision won” does not.',
    provenance: 'insight',
  },
]
/* ------------------------------------------------------------------ */
/* Section E — Component and class selection                           */
/* ------------------------------------------------------------------ */

const SECTION_E: Question[] = [
  {
    id: 'u1ft-e1',
    topicId: 'u1t1',
    type: 'component-selection',
    level: 2,
    marks: 4,
    skill: 'analysis',
    action: 'Select',
    prompt:
      'A hand-held instrument is used by glove-wearing operators at a site that ranges from −10 °C to +50 °C, in a volume of 5000 units with a strict unit-cost ceiling. Select the product class from the supplied classification table and justify the choice with three parameters.',
    hint: 'Screen on temperature first — a matrix cannot rescue an option that fails a hard requirement.',
    solution: [
      {
        label: 'Screening test',
        content:
          'Required window −10 °C to +50 °C. The consumer class spans 0 to 70 °C and does NOT contain −10 °C, so it is eliminated. Industry (−25 to 85 °C) contains the window with 15 °C of cold margin and 35 °C of hot margin. Military (−55 to 125 °C) also contains it but is described as “Very High” cost.',
      },
      { label: 'Selection', content: 'Industry product class.' },
      {
        label: 'Justification 1 — operating temperature range (source)',
        content: '−25 to 85 °C contains the required window; the consumer class does not.',
      },
      {
        label: 'Justification 2 — cost (source)',
        content:
          'Consumer “should be affordable”, industry has a higher development cost, military “very high”. At 5000 units the industry development cost is amortised, whereas the military unit cost is not justified by a −10 °C requirement.',
      },
      {
        label: 'Justification 3 — ergonomics (source)',
        content:
          'The industry column states “operator safety is important”, which matches glove operation; the consumer column stresses comfort and an attractive look, which is not what a glove-wearing operator needs.',
      },
      {
        label: 'Note (Engineering Insight)',
        content:
          'The required span is 60 °C, narrower than the consumer span of 70 °C — so a comparison of spans wrongly suggests consumer is adequate. Always compare window positions, never spans.',
      },
    ],
    marking: [
      '1 mark — consumer eliminated by the temperature screen.',
      '1 mark — industry selected.',
      '2 marks — three parameters quoted from the supplied table and tied to the requirement.',
    ],
    engineeringExplanation:
      'Class selection is a screening exercise before it is a scoring exercise: one falsifiable parameter removes an option, and the rest of the table then discriminates between what is left. Scoring an option that has already failed a hard requirement is the commonest matrix error in practice.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-e2',
    topicId: 'u1t3',
    type: 'component-selection',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Select',
    prompt:
      'A DC measurement system amplifies a 10 mV signal with a gain of 100 to give 1 V full scale. The total output error must stay below 5 mV from 25 °C to 70 °C. Select an op-amp from the supplied device table, justifying the choice with two numbers and rejecting at least one device with numbers.',
    hint: 'Convert the output budget into an input-referred budget first — the device table is written in input-referred volts.',
    solution: [
      {
        label: 'Given',
        content:
          'Noise gain ≈ 100; full scale 1 V; allowed output error 5 mV over 25 °C to 70 °C (ΔT = 45 °C). Device data from the supplied table: 741C VOS = 2 mV with TC(VOS) = 5 µV/°C; 741E VOS = 0.8 mV; OP-07 VOS = 30 µV with TC 0.3 µV/°C; OP-77 VOS = 10 µV with TC 0.1 µV/°C. Engineering Insight: the 5 mV budget is a constructed requirement; the device data and the drift example are source-derived.',
      },
      {
        label: 'Budget conversion',
        content: 'Allowed output error 5 mV ÷ noise gain 100 = 50 µV of allowed input-referred error.',
      },
      {
        label: 'Rejection 1 — 741C',
        content:
          'Eo = 100 × 2 mV = 200 mV at 25 °C, and at 70 °C VOS = 2 mV + 5 µV/°C × 45 °C = 2.225 mV → 222.5 mV. That is about 45× the budget: rejected.',
      },
      {
        label: 'Rejection 2 — 741E',
        content: 'Eo = 100 × 0.8 mV = 80 mV at 25 °C — still 16× the budget: rejected.',
      },
      {
        label: 'Candidate — OP-07',
        content:
          'Eo = 100 × 30 µV = 3.0 mV at 25 °C. At 70 °C: VOS = 30 µV + 0.3 µV/°C × 45 °C = 43.5 µV → Eo = 4.35 mV, still inside the 5 mV budget. Meets the requirement with modest margin.',
      },
      {
        label: 'Candidate — OP-77',
        content:
          'Eo = 1.0 mV at 25 °C; at 70 °C VOS = 10 + 0.1 × 45 = 14.5 µV → Eo = 1.45 mV. Meets the requirement with a factor of about 3.4 in hand.',
      },
      {
        label: 'Selection',
        content:
          'Select the OP-07 for a cost-sensitive production unit: it meets the budget across the whole temperature range with margin. Choose the OP-77 if the budget is expected to tighten or the ambient goes above 70 °C. Note that the source also lists low-input-current devices (LF356 at 30 pA, TLC279 at 0.7 pA) for cases where source impedance, not VOS, dominates.',
      },
    ],
    marking: [
      '1 mark — the 5 mV output budget converted to 50 µV input-referred.',
      '1 mark — 741C (and/or 741E) rejected with numbers.',
      '1 mark — OP-07 evaluated at both 25 °C and 70 °C using TC(VOS).',
      '1 mark — the final selection with its cost or margin argument.',
    ],
    engineeringExplanation:
      'Two mistakes lose these marks: comparing device offset voltages without dividing the budget by the noise gain, and comparing the 25 °C figure only. The source gives TC(VOS) precisely so the second mistake is avoidable — drift is what separates an OP-07 from a 741E in a real product.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-e3',
    topicId: 'u1t4',
    type: 'component-selection',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Select',
    prompt:
      'A battery-powered industrial counter board runs from a 5 V rail, must accept signals from existing 74LS logic, drives twelve TTL inputs, and is slow enough that speed is irrelevant. Choose between 74HC, 74HCT and the 4000B series, giving two reasons for the choice and a reason for rejecting each of the others.',
    hint: 'One family is rejected on input levels, one on output current and compatibility — one reason is enough for each.',
    solution: [
      { label: 'Selection', content: '74HCT.' },
      {
        label: 'Reason 1 — input levels',
        content:
          '74HCT inputs are TTL-compatible (VIH(min) = 2.0 V). The existing 74LS outputs (VOH(min) = 2.7 V) therefore drive them with VNH = 2.7 − 2.0 = +0.7 V guaranteed — no pull-up resistor, no extra components and no extra LOW-state current, which matters on a battery board.',
      },
      {
        label: 'Reason 2 — power and pinning (source)',
        content:
          'The source states that the 74HC/HCT family is pin-compatible with TTL, comparable in speed to 74LS, and about ten times faster than the first 7400-series CMOS. For a battery board the CMOS quiescent power is the decisive advantage over any bipolar TTL family.',
      },
      {
        label: 'Reject 74HC',
        content:
          'Its VIH(min) = 3.5 V is above the 74LS VOH(min) = 2.7 V, giving VNH = −0.8 V. Every LS-to-HC signal would need a pull-up resistor, adding components, board area and LOW-state current — exactly what a battery design cannot afford.',
      },
      {
        label: 'Reject 4000B (source)',
        content:
          'The source states that the 4000/14000 series operates over 3 to 15 V, dissipates very little power, is slow, has low output current, and is NOT pin-compatible or electrically compatible with any TTL series. Driving twelve TTL inputs is precisely what its 0.5 mA output cannot do.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: the numeric level and current figures are standard datasheet values. The compatibility statements, the pin-compatibility of 74HC/HCT and the 4000-series limitations are from the supplied material.',
      },
    ],
    marking: [
      '1 mark — 74HCT selected.',
      '2 marks — two valid reasons (TTL-compatible input levels with a number; CMOS power plus pin compatibility from the source).',
      '1 mark — both rejections, each with its specific technical reason.',
    ],
    engineeringExplanation:
      '“HCT” is the one-letter answer to most mixed 5 V boards: CMOS power with TTL thresholds. Choosing plain HC in a TTL environment converts a free compatibility into a resistor-per-signal problem — a bill-of-materials mistake, not a technical one.',
    provenance: 'insight',
  },
]

/* ------------------------------------------------------------------ */
/* Section F — Troubleshooting                                         */
/* ------------------------------------------------------------------ */

const SECTION_F: Question[] = [
  {
    id: 'u1ft-f1',
    topicId: 'u1t3',
    type: 'debugging',
    level: 4,
    marks: 4,
    skill: 'debugging',
    action: 'Diagnose',
    prompt:
      'An inverting amplifier built with R1 = 10 kΩ and Rf = 220 kΩ on ±15 V rails should give −2.2 V out for +100 mV in. The output instead sits at −13.2 V and does not move when the input is swept from +50 mV to +150 mV. Give the most likely cause, the measurement that distinguishes it from the alternative, and the fix with a verification step.',
    hint: 'An output pinned to a rail that ignores the input has either lost its feedback loop or is saturated — one measurement separates the two.',
    solution: [
      {
        label: 'Observation',
        content:
          'The output is pinned near the negative rail (−13.2 V ≈ 2 V inside −15 V, the source’s saturation rule) and is insensitive to the input over a 3:1 sweep. The amplifier is therefore either saturated with the loop closed, or running open-loop.',
      },
      {
        label: 'Measurement — the inverting input',
        content:
          'Measure the voltage at the inverting input. If it sits at ≈ 0 V (virtual ground) while the output is at −13.2 V, the loop is closed and the amplifier is saturated — look instead at the gain or the input level. If the inverting input follows the input signal, the feedback path is open.',
      },
      {
        label: 'Hypothesis',
        content:
          'Rf is open — not soldered, cracked, or the wrong value fitted. With the feedback path open the circuit behaves as a comparator: the open-loop gain a (typically 10^5) amplifies the millivolt difference between the inputs and drives the output to a rail.',
      },
      {
        label: 'Alternative, and why it is excluded',
        content:
          'R1 and Rf transposed would give Av = −10/220 = −0.045 and Vo ≈ −4.5 mV, not −13.2 V. A dead op-amp would usually show both inputs floating and no supply current. Neither matches the measurement, so the open Rf remains.',
      },
      {
        label: 'Confirmation',
        content:
          'With power off, measure Rf in circuit: an open reads ∞ instead of 220 kΩ. Live, the signal input current collapses to the bias current when feedback is lost.',
      },
      {
        label: 'Fix and verification',
        content:
          'Refit or replace Rf. Then verify: Vi = +100 mV → Vo = −2.2 V, and sweep Vi from +50 mV to +150 mV expecting −1.1 V to −3.3 V with a straight-line response.',
      },
      {
        label: 'Prevention (source)',
        content:
          'Check the decoupling while the board is open — 10 µF where the supply enters plus 0.1 µF at the pins, mounted in very close vicinity to the pins — and verify every feedback resistor by measurement, not by colour code, before power-up.',
      },
    ],
    marking: [
      '1 mark — the symptom read correctly (rail-pinned, input-insensitive → open loop or saturation).',
      '1 mark — the discriminating measurement (inverting input ≈ 0 V versus following the input).',
      '1 mark — open Rf identified, with at least one alternative excluded by a number.',
      '1 mark — the fix plus a numerical verification.',
    ],
    engineeringExplanation:
      'Debugging is a branching test, not a list of guesses: one measurement should split the remaining causes roughly in half. Here a single DMM reading on the summing node separates “saturated” from “open loop”, and only the second branch means a component is faulty.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-f2',
    topicId: 'u1t4',
    type: 'debugging',
    level: 4,
    marks: 4,
    skill: 'debugging',
    action: 'Diagnose',
    prompt:
      'A 74LS counter drives a 74HC decoder on the same 5 V rail. The board works on the bench but mis-counts in the installed cabinet, and the failures get worse in the afternoon when the cabinet is warm. Give the most likely cause with the numbers that prove it, the measurement that confirms it, and two fixes with their margins.',
    hint: 'The symptom is intermittent, temperature-correlated and only affects the HIGH level — that combination has one cause in this topic.',
    solution: [
      {
        label: 'Observation',
        content:
          'Intermittent, worse when warm, and the count is wrong rather than dead. A timing problem usually worsens with speed; a level problem worsens with temperature. Suspect the HIGH-state interface level.',
      },
      {
        label: 'Cause — no HIGH-state margin',
        content:
          'VNH = VOH(min) of 74LS − VIH(min) of 74HC = 2.7 V − 3.5 V = −0.8 V. The interface has no guaranteed margin at all: it works only because the typical LS output happens to sit above the typical HC threshold.',
      },
      {
        label: 'Why temperature exposes it',
        content:
          'As the device warms, its output HIGH level falls while the CMOS input threshold rises, so the two typical distributions cross. The board then intermittently reads a valid HIGH as an invalid level — exactly the reported symptom.',
      },
      {
        label: 'Measurement that confirms it',
        content:
          'Capture the HIGH level at the 74HC input with a scope, or a min/max DMM, at room temperature and again warm. A HIGH level sitting between 2.7 V and 3.5 V — say 3.1 V falling to 2.8 V — confirms it; triggering on the mis-count shows the failing edge.',
      },
      {
        label: 'Fix 1 — pull-up resistor',
        content:
          '2.2 kΩ from the LS output to +5 V: VOH ≈ 5 V − (2.2 kΩ × 1 µA) = 4.998 V, so VNH ≈ +1.50 V. The cost is about 2 mA of extra LOW-state sink current, well inside the 8 mA an LS output guarantees.',
      },
      {
        label: 'Fix 2 — 74HCT',
        content:
          'Replace the 74HC device with a 74HCT device (TTL-compatible inputs, VIH(min) = 2.0 V): VNH = 2.7 − 2.0 = +0.70 V guaranteed, with no extra component and no extra current.',
      },
      {
        label: 'Lesson',
        content:
          'The board passed because typical values worked. Interfaces are specified by guaranteed values over the full temperature range — design to the guaranteed column and the intermittent field failure never happens.',
      },
    ],
    marking: [
      '1 mark — VNH = −0.8 V identified as the cause.',
      '1 mark — the temperature explanation (the two levels move in opposite directions).',
      '1 mark — the measurement that confirms it, with the expected voltage band.',
      '1 mark — two fixes, each with its resulting margin.',
    ],
    engineeringExplanation:
      'This is the most instructive field failure in the interfacing topic, because nothing is broken: every component is inside its datasheet. The design was built on typical values, and typical values are not a specification.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-f3',
    topicId: 'u1t2',
    type: 'debugging',
    level: 3,
    marks: 4,
    skill: 'debugging',
    action: 'Diagnose',
    prompt:
      'Of 400 installed units, 27 failed in the first six weeks and only 3 failed in the following twelve months. Identify the region of the bathtub curve, name two causes from the supplied material, state the corrective action at the factory and in the field, and explain why this is not a wear-out problem.',
    hint: 'The failure rate is falling, not rising. Which region has a falling rate, and what does that say about the failed sub-population?',
    solution: [
      {
        label: 'Region',
        content:
          'Early failure, or infant mortality — also called the burn-in period — where the failure rate falls with time. The numbers show it: 27 failures in 6 weeks against 3 in the following 52 weeks is a falling rate, not a constant or rising one.',
      },
      {
        label: 'Causes (source — any two)',
        content:
          'Defects or errors during manufacturing; poor-quality raw material; wrong assembly; improper insulation; poor fitting.',
      },
      {
        label: 'Factory action',
        content:
          'Burn-in: operate units under stress before dispatch so the defective sub-population fails in the factory instead of at the customer. Tighten incoming inspection and assembly process control, and trace each returned unit back to the process step that produced it.',
      },
      {
        label: 'Field action',
        content:
          'Replace rather than repair the early failures; keep the failure signature (serial numbers, dates, symptoms) so the process step can be identified; and expect the rate to keep falling — do not redesign the product on the basis of it.',
      },
      {
        label: 'Why not wear-out',
        content:
          'Wear-out appears after long usage, with a rising failure rate, when components have been kept at maximum rated condition. Here the rate is falling, which is the signature of a defective sub-population being consumed, not of a population ageing.',
      },
      {
        label: 'Why not random failure',
        content:
          'Random failure has a constant rate — the useful-life region. A constant rate cannot produce 27 failures in six weeks followed by 3 in a year.',
      },
    ],
    marking: [
      '1 mark — infant mortality / early failure identified from the falling rate.',
      '1 mark — two causes quoted from the supplied list.',
      '1 mark — burn-in and process action, with the field action stated separately.',
      '1 mark — the distinction from wear-out (rising rate) and from random failure (constant rate).',
    ],
    engineeringExplanation:
      'The shape of the failure rate tells you which remedy to buy. Infant mortality is a manufacturing problem and burn-in is the fix; wear-out is an ageing problem and a replacement plan is the fix. Buying the wrong remedy for the wrong region is the expensive version of this mistake.',
    provenance: 'source',
  },
  {
    id: 'u1ft-f4',
    topicId: 'u1t1',
    type: 'debugging',
    level: 3,
    marks: 4,
    skill: 'debugging',
    action: 'Diagnose',
    prompt:
      'A data logger built to the consumer product class fails repeatedly at a site where the night temperature reaches −12 °C, although every unit passes the factory test at 25 °C. Identify the cause, name the parameter in the supplied table that should have caught it, give two remedies, and state the margin each leaves.',
    hint: 'Nothing is defective. The requirement and the specification simply do not overlap — find the row of the table that proves it.',
    solution: [
      {
        label: 'Cause',
        content:
          'The unit was specified to the consumer class, whose operating temperature range is 0 to 70 °C. At −12 °C it is operating outside its specified window, so these are specification failures, not defects. A factory test at 25 °C cannot detect the problem.',
      },
      {
        label: 'The parameter that should have caught it (source)',
        content:
          '“Operating temp. range” in the Classification of Electronic Product table: Consumer 0 to 70 °C, Industry −25 to 85 °C, Military −55 to 125 °C.',
      },
      {
        label: 'Remedy 1 — re-specify the class',
        content:
          'Move to the Industry class (−25 to 85 °C). Against a site window of −12 °C to +50 °C that leaves 13 °C of margin at the cold end and 35 °C at the hot end. Military would also qualify, but the source describes its cost as “Very High” and nothing in the requirement justifies it.',
      },
      {
        label: 'Remedy 2 — engineer the environment',
        content:
          'Fit a heated or insulated enclosure so the cheaper consumer unit stays inside its own window. This keeps the unit cost down but adds a new failure mode (the heater), a power budget and a maintenance item — the trade must be written down, not assumed.',
      },
      {
        label: 'The trap (Engineering Insight)',
        content:
          'The required span is 62 °C, narrower than the consumer span of 70 °C, so a comparison of spans suggests consumer is adequate; only a comparison of window positions shows that it is not. Always compare windows, never spans.',
      },
    ],
    marking: [
      '1 mark — out-of-window operation identified as a specification failure, not a defect.',
      '1 mark — the operating temperature range row quoted with the three class values.',
      '1 mark — two remedies named.',
      '1 mark — the margin for each remedy, or the span-versus-window trap.',
    ],
    engineeringExplanation:
      'Most field failures blamed on “bad components” are really requirements that were never compared with a specification. One row of one table, checked at quotation stage, would have prevented the whole campaign.',
    provenance: 'insight',
  },
]
/* ------------------------------------------------------------------ */
/* Section G — What-if analysis                                        */
/* ------------------------------------------------------------------ */

const SECTION_G: Question[] = [
  {
    id: 'u1ft-g1',
    topicId: 'u1t2',
    type: 'whatif',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Analyse what-if',
    prompt:
      'A system has λ = 0.01 failures per month and a required operating period of 12 months. (a) Calculate the 12-month reliability and the MTBF. (b) Recalculate both if the failure rate is halved to 0.005 per month. (c) Is halving λ better or worse than halving the operating period to 6 months? Justify the answer from the law itself.',
    hint: 'The law contains only one quantity: the product λt. Everything else follows from that.',
    solution: [
      {
        label: 'Given',
        content:
          'λ = 0.01 per month; t = 12 months. Alternatives: λ′ = 0.005 per month, and t′ = 6 months.',
      },
      {
        label: '(a) Baseline',
        content: 'λt = 0.01 × 12 = 0.12 → R = e^(−0.12) = 0.887, i.e. 88.7%. MTBF m = 1/0.01 = 100 months.',
      },
      {
        label: '(b) Halved failure rate',
        content: 'λ′t = 0.005 × 12 = 0.06 → R = e^(−0.06) = 0.942, i.e. 94.2%. MTBF m′ = 1/0.005 = 200 months.',
      },
      {
        label: '(c) Halved operating period',
        content:
          'λt′ = 0.01 × 6 = 0.06 → R = e^(−0.06) = 0.942 — identical to (b), because the law depends only on the product λt.',
      },
      {
        label: 'Interpretation',
        content:
          'As far as reliability is concerned the two changes are equivalent: reliability is a function of λt, so any trade along that product is neutral. But only one of them is a design choice — you can usually buy a lower λ with better parts or derating, whereas the mission duration belongs to the customer. Halving λ also doubles the MTBF, which halving the period does not.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: λ = 0.01 per month and t = 12 months are chosen for practice. The law R = e^(−λt), the relation m = 1/λ and the 37% result at t = m are source-derived.',
      },
    ],
    marking: [
      '1 mark — baseline R = 0.887 and m = 100 months.',
      '1 mark — halved λ: R = 0.942 and m = 200 months.',
      '1 mark — halved t: R = 0.942, with the λt-product explanation.',
      '1 mark — the engineering conclusion: only λ is a design variable, and only λ changes the MTBF.',
    ],
    engineeringExplanation:
      'The λt product is the whole model, so “improve reliability” always means “reduce the product”. Since t belongs to the customer, every improvement you can actually deliver comes out of λ — better parts, derating, or a better environment.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-g2',
    topicId: 'u1t3',
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyse what-if',
    prompt:
      'In the supplied inverting-amplifier problem (R1 = 10 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA) Rf is doubled from 20 kΩ to 40 kΩ. Recalculate the gain, Vo, io, icc and iee, state how much saturation margin remains, and cross-check the power dissipated inside the op-amp against the supply and load powers.',
    hint: 'Recompute the gain first, then check the new output against the rail limit before trusting any of the current figures.',
    solution: [
      {
        label: 'Given',
        content: 'R1 = 10 kΩ; Rf = 40 kΩ; Vi = 3 V; RL = 2 kΩ; IQ = 0.5 mA; rails ±15 V (declared).',
      },
      { label: 'Gain', content: 'Av = −Rf/R1 = −40 kΩ / 10 kΩ = −4 V/V.' },
      { label: 'Output', content: 'Vo = −4 × 3 V = −12 V.' },
      {
        label: 'Load current',
        content: 'io = 12 V / 2 kΩ = 6 mA, flowing INTO the op-amp output terminal because Vo is negative.',
      },
      {
        label: 'Supply currents (source relations)',
        content: 'Vo negative → IEE = ICC + Io. ICC = IQ = 0.5 mA, so IEE = 0.5 + 6 = 6.5 mA.',
      },
      {
        label: 'Saturation margin',
        content:
          'On ±15 V rails the output limit is about ±13 V (the source: the output saturates about 2 V below VCC). |−12 V| leaves only about 1 V of margin: any increase in Vi, any tolerance in Rf, or any temperature drift now clips the output. The original design had 7 V of margin.',
      },
      {
        label: 'Power cross-check',
        content:
          'P_supply = 15 V × 0.5 mA + 15 V × 6.5 mA = 7.5 + 97.5 = 105 mW. P_load = 12 V × 6 mA = 72 mW. P_inside = 105 − 72 = 33 mW. Independent check: the output transistor drops (15 − 12) V at 6 mA = 18 mW and the quiescent dissipation is 15 V × 0.5 mA + 15 V × 0.5 mA = 15 mW; 18 + 15 = 33 mW ✓.',
      },
      {
        label: 'Interpretation',
        content:
          'Raising the gain moved the design from comfortable to marginal without changing a single supply rail. Note that the dissipation inside the device actually fell (42 mW → 33 mW) because the load now takes a larger share of the supply power — which is why “more output swing” must never be read as “more stress on the amplifier” without the arithmetic.',
      },
    ],
    marking: [
      '1 mark — Av = −4 and Vo = −12 V.',
      '1 mark — io = 6 mA with its direction.',
      '1 mark — icc = 0.5 mA and iee = 6.5 mA via IEE = ICC + Io.',
      '1 mark — the saturation margin (about 1 V) plus the power cross-check.',
    ],
    engineeringExplanation:
      'The what-if that matters is not the gain — it is that a harmless-looking resistor change consumed 6 V of the 7 V of output margin. Always recompute the headroom after a gain change; the datasheet limit does not move to accommodate your new design.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-g3',
    topicId: 'u1t4',
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyse what-if',
    prompt:
      'A 74HC output (IOL = IOH = 4 mA) drives ten 74LS inputs (IIL = 0.4 mA, IIH = 20 µA) at 5 V and is just inside its limit. (a) What changes if the load count rises to fourteen? (b) What changes if the supply is reduced to 4.5 V? State the margin or the excess in each case, and the remedy.',
    hint: 'Quantify the overload in milliamps, then ask which state is binding and what a lower rail does to both the currents and the thresholds.',
    solution: [
      {
        label: 'Baseline',
        content:
          'Fan-out(LOW) = IOL/IIL = 4 mA / 0.4 mA = 10. Fan-out(HIGH) = IOH/IIH = 4 mA / 0.02 mA = 200. Usable fan-out = 10, so ten loads is exactly at the limit and not derated.',
      },
      {
        label: '(a) Fourteen loads — LOW state',
        content:
          'Required sink = 14 × 0.4 mA = 5.6 mA against a guaranteed 4 mA: an overload of 1.6 mA, or 40%. VOL would rise above its guaranteed 0.5 V and can enter the indeterminate input region of the following gates, so it is the logic levels — not the devices — that fail first.',
      },
      {
        label: '(a) Fourteen loads — HIGH state',
        content:
          'Required source = 14 × 0.02 mA = 0.28 mA against 4 mA: no problem at all. The LOW state is the only binding constraint, as the source states for CMOS driving TTL.',
      },
      {
        label: '(a) Remedy',
        content:
          'Buffer the 74HC output — the source’s stated answer for this direction — or split the fourteen loads across two drivers (seven each, leaving about 30% margin).',
      },
      {
        label: '(b) Supply at 4.5 V',
        content:
          'CMOS output current capability falls as VCC falls (Engineering Insight: read the datasheet curve at the minimum supply, not at 5 V), so the guaranteed IOL drops and the already-exact ten-load case falls out of specification. At the same time the absolute noise margins shrink roughly in proportion to the supply: a margin of 3.4 V at 5 V becomes about 2.9 V at 4.5 V.',
      },
      {
        label: '(b) Remedy',
        content:
          'Re-derive the fan-out from the datasheet limits at 4.5 V and derate — typically to eight loads or fewer — or hold the supply inside the guaranteed range. Never assume a 5 V datasheet figure applies at the bottom of a battery discharge curve.',
      },
    ],
    marking: [
      '1 mark — the LOW-state overload quantified (5.6 mA against 4 mA).',
      '1 mark — the HIGH state shown not to be binding (0.28 mA against 4 mA).',
      '1 mark — a buffer, or splitting the load, as the remedy.',
      '1 mark — the supply-reduction reasoning: output current and noise margins both fall, so use the datasheet limits at the minimum VCC.',
    ],
    engineeringExplanation:
      'Two habits separate a safe answer from a lucky one: identify which state is binding before proposing a fix, and evaluate the interface at the worst supply, the worst temperature and the worst load — not at the nominal bench condition.',
    provenance: 'insight',
  },
  {
    id: 'u1ft-g4',
    topicId: 'u1t3',
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyse what-if',
    prompt:
      'A JFET-input op-amp is rated IB = 1 pA at 25 °C. (a) Estimate IB at 100 °C using the rule of thumb in the supplied material. (b) The circuit uses a 10 MΩ feedback resistor: calculate the bias-current output error at 25 °C and at 100 °C, and state the consequence for a 1 mV error budget. (c) Give one mitigation.',
    hint: 'The rule is a doubling, not a linear rise — count the number of 10 °C steps carefully.',
    solution: [
      {
        label: 'Rule (source)',
        content:
          'A well-known rule of thumb states that the reverse-bias current of a pn junction, whether that of a diode or of a JFET, doubles for every 10 °C increase. Hence IB(T) = IB(T0)·2^((T − T0)/10).',
      },
      {
        label: '(a) Calculation',
        content:
          'IB(100 °C) = 1 pA × 2^((100 − 25)/10) = 1 pA × 2^7.5 = 1 pA × 181 ≈ 181 pA ≈ 0.18 nA — the source’s own answer for this example.',
      },
      {
        label: '(b) Error at 25 °C',
        content: 'With Rp matched, Eo ≈ R2·IB = 10 MΩ × 1 pA = 10 µV.',
      },
      {
        label: '(b) Error at 100 °C',
        content: 'Eo ≈ 10 MΩ × 0.18 nA = 1.8 mV — an increase by a factor of about 180.',
      },
      {
        label: 'Consequence for a 1 mV budget',
        content:
          'The design meets the budget comfortably at 25 °C (10 µV) and fails it at 100 °C (1.8 mV). This is the classic high-temperature failure: the term that was negligible on the bench becomes dominant in service while nothing else in the circuit changed.',
      },
      {
        label: '(c) Mitigation',
        content:
          'Balance the resistances so only IOS contributes (IOS is far smaller than IB and drifts far less), keep the feedback resistance as low as the gain allows, choose a device whose leakage is specified at the maximum temperature, or control the ambient. The source’s progression of technologies is the designer’s toolkit here: JFET-input LF356 (30 pA), MOS-input TLC279 (0.7 pA), electrometer grades AD549 and OPA129 (below 100 fA).',
      },
      {
        label: 'Important asymmetry (source)',
        content:
          'In BJT-input devices IB tends to decrease with temperature because β rises, whereas in JFET-input devices it increases exponentially. The doubling rule applies to the JFET case — it would be wrong to apply it to a bipolar-input part.',
      },
    ],
    marking: [
      '1 mark — the doubling rule stated with its 10 °C step.',
      '1 mark — IB(100 °C) ≈ 0.18 nA from 2^7.5.',
      '1 mark — the error at both temperatures (10 µV and 1.8 mV) and the verdict against the 1 mV budget.',
      '1 mark — a valid mitigation, or the BJT-versus-JFET asymmetry note.',
    ],
    engineeringExplanation:
      'Picoamp datasheet figures are quoted at 25 °C, and the exponent is what you are really designing against: seven and a half doublings turn “negligible” into “dominant”. Any circuit with megohm resistors must have its bias-current error evaluated at the maximum temperature, not at the bench.',
    provenance: 'source',
  },
]
/* ------------------------------------------------------------------ */
/* Section H — Long answers                                            */
/* ------------------------------------------------------------------ */

const SECTION_H: Question[] = [
  {
    id: 'u1ft-h1',
    topicId: 'u1t2',
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Define reliability and explain the exponential law of reliability. Hence discuss the causes of failure during infant mortality, useful life and wear-out, and state where the exponential law is and is not valid.',
    hint: 'Definition, law with symbols and units, the one famous number, then three regions — and finish with the assumption the law makes.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'Reliability is the ability of a product to perform its intended function under stated conditions for a stated period of time — equivalently, the probability that the unit performs the intended functionality for the stated period under the stated operating conditions.',
      },
      {
        label: 'The exponential law (source)',
        content:
          'R = e^(−λt), where R is the reliability of the equipment and λ is the system failure rate, stated as failures per month in the source. Putting m = 1/λ gives R = e^(−t/m). If t = m then R = e^(−1) = 0.37: at one MTBF the probability of successful operation has fallen to about 37%.',
      },
      {
        label: 'Assumption behind the law',
        content:
          'The law comes from integrating a constant hazard rate λ. If λ varies with time the correct form is R(t) = exp(−∫λ(τ)dτ), which collapses to e^(−λt) only when λ is constant. That single assumption limits where the law may be used.',
      },
      {
        label: 'Region 1 — infant mortality (source)',
        content:
          'The failure rate is falling. Also called the burn-in period. Causes: defects or errors during manufacturing, poor-quality raw material, wrong assembly, improper insulation, poor fitting. The remedy is manufacturing: burn-in, incoming inspection and process control.',
      },
      {
        label: 'Region 2 — useful life / random failure (source)',
        content:
          'The failure rate is approximately constant. Causes: mishandling, or exceeding the operating conditions, which damage components at an arbitrary instant. This is the ONLY region in which R(t) = e^(−λt) is the correct model.',
      },
      {
        label: 'Region 3 — wear-out (source)',
        content:
          'The failure rate rises once components have been kept in operation at maximum rated condition for a long time. The source plots failure rate against time for two stress severities (graph A high, graph B low), showing that higher stress moves the knee to the left. The remedy is a replacement or refurbishment plan and a reduction in stress severity.',
      },
      {
        label: 'Validity — the sentence examiners look for',
        content:
          'Measure λ inside the useful-life region and never extrapolate it across the wear-out knee. Using a constant λ during infant mortality over-estimates early failures and under-estimates later ones; using it during wear-out under-estimates failures badly.',
      },
      {
        label: 'Related definition (source)',
        content:
          'Maintainability is M(t) = Pr(T ≤ t), where T is the repair time — the probability that failed equipment is restored to its designed specifications within a known down time under stated conditions. Reliability decides how often you repair; maintainability decides how long you are down.',
      },
    ],
    marking: [
      '2 marks — the definition, including “intended function”, “stated conditions” and “stated period”.',
      '2 marks — R = e^(−λt) with λ and m identified, the units stated, and the 37% result at t = m.',
      '3 marks — all three regions, each with at least two causes and the shape of the failure rate.',
      '1 mark — the constant-λ assumption and the warning against extrapolating across the wear-out knee.',
    ],
    engineeringExplanation:
      'The law is a model of one region of life, not of a product. Knowing which region your λ was measured in is the difference between a reliability prediction and a reliability guess — and it is the one sentence that separates an 8-mark answer from a 5-mark one.',
    provenance: 'source',
  },
  {
    id: 'u1ft-h2',
    topicId: 'u1t3',
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Explain input offset voltage, input bias current, input offset current and CMRR of an op-amp, and discuss their influence on measurement accuracy. Include the error expression for the bias terms and the condition under which it simplifies.',
    hint: 'Four definitions, but the marks are in the error expressions and in how each term is minimised — write one formula per mechanism.',
    solution: [
      {
        label: '1. Input offset voltage VOS (source)',
        content:
          'Ideally Vo = a(Vp − Vn) = 0 V when Vp = Vn. Because of mismatch in the input transistors a practical op-amp delivers a non-zero output, so VOS is defined as the input voltage needed to bring Vo back to 0 V, and the source writes Vo = a[Vp + VOS − Vn]. Typical values from the supplied table: 741C 2 mV, 741E 0.8 mV, OP-07 30 µV, OP-77 10 µV.',
      },
      {
        label: 'Influence of VOS',
        content:
          'The offset-free amplifier acts as a non-inverting amplifier with respect to VOS, so the output error is Eo = (1 + R2/R1)·VOS — the DC noise gain multiplies it. The source’s own illustration: with R2 = 1000·R1 and a 741C, Eo = 1001 × (±2 mV) ≈ ±2 V typical and ±6 V maximum — “quite an error!”. VOS also drifts: with VOS(25 °C) = 1 mV and TC(VOS) = 5 µV/°C, VOS(70 °C) = 1 mV + 5 µV/°C × 45 °C = 1.225 mV.',
      },
      {
        label: '2. and 3. Input bias and offset currents (source)',
        content:
          'Practical op-amps draw small currents Ip and In to bias the input differential pair, and those currents come from the external circuit. IB = (Ip + In)/2 is the average; IOS = Ip − In is the difference, caused by mismatch in β. Typical values: 741C IB = 80 nA and IOS = 20 nA; 741E 30 nA and 3 nA; OP-77 1.2 nA and 0.3 nA.',
      },
      {
        label: 'Influence of IB and IOS — the general expression',
        content:
          'By superposition, Vo = (1 + R2/R1){[(R1||R2) − Rp]·IB − [(R1||R2) + Rp]·IOS/2}.',
      },
      {
        label: 'The simplification',
        content:
          'If Rp = R1||R2 the IB term vanishes and the expression collapses to Eo = R2·IOS. The supplied worked example (R1 = 22 kΩ, R2 = 2.2 MΩ, IB = 80 nA, IOS = 20 nA) gives 44 mV with Rp fitted, 4.4 mV after all resistances are divided by 10, and 0.7 mV with IOS = 3 nA — a factor of about 60 from matching and scaling alone.',
      },
      {
        label: 'Low-input-current technologies (source)',
        content:
          'Super-beta BJTs (LM308, IB ≈ 1 nA or less); bias-current cancellation (OP-07); JFET input (LF356: IB = 30 pA, IOS = 3 pA); MOSFET input (TLC279: IB = 0.7 pA, IOS = 0.1 pA); electrometer grades (AD549, OPA129: IB below 100 fA). Drift: a pn-junction reverse current doubles every 10 °C, so 1 pA at 25 °C becomes about 0.18 nA at 100 °C.',
      },
      {
        label: '4. CMRR (source)',
        content:
          'A practical op-amp also responds to the common-mode input Vcm = (Vp + Vn)/2: Vo = a(Vp − Vn) + acm·Vcm = a[Vp + Vcm/CMRR − Vn], with 1/CMRR = dVOS/dVcm (µV/V) and CMRRdB = 20 log CMRR, so 1/CMRR = 10^(−CMRRdB/20). CMRR is frequency dependent and begins to roll off at about 100 Hz. Crucially, CMRR is no serious concern for the inverting amplifier, because Vp is at 0 volts.',
      },
      {
        label: 'Influence on measurement accuracy — summary',
        content:
          'Every term is input-referred and then multiplied by the noise gain, so a measurement is limited by (i) the device chosen, (ii) the gain structure, (iii) whether the resistances are balanced, and (iv) the temperature. The cures, in order of value: reduce the noise gain; choose the device from an error budget rather than from habit; fit Rp = R1||R2; keep resistances low; and control or compensate the temperature.',
      },
    ],
    marking: [
      '2 marks — VOS defined and its error relation Eo = (1 + R2/R1)·VOS given, ideally with the source’s “quite an error!” illustration.',
      '2 marks — IB and IOS defined, with the general error expression.',
      '2 marks — the Rp = R1||R2 simplification to Eo = R2·IOS, with the worked sequence.',
      '1 mark — CMRR defined with its dB relation and the inverting-amplifier exemption.',
      '1 mark — a closing statement on how the four terms together limit measurement accuracy.',
    ],
    engineeringExplanation:
      'Examiners award these marks for formulas, not prose: one expression per mechanism, all referred to the output, plus the one condition (Rp = R1||R2) that deletes a whole term. A student who writes four definitions and no expressions has answered a 3-mark question in eight marks’ worth of time.',
    provenance: 'source',
  },
  {
    id: 'u1ft-h3',
    topicId: 'u1t4',
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Explain the need for TTL-CMOS interfacing. Discuss TTL-to-CMOS and CMOS-to-TTL interfacing techniques with suitable circuits, and state the precautions that apply when outputs are connected together.',
    hint: 'The incompatibility is not symmetric: TTL driving CMOS fails on voltage, CMOS driving TTL fails on current. Two numbers prove each.',
    solution: [
      {
        label: 'The need',
        content:
          'TTL and CMOS families do not share guaranteed logic levels or output current capability, so a direct connection between them is not guaranteed to transfer a valid logic state. The problem is direction-dependent, which is why the two cases must be treated separately.',
      },
      {
        label: 'TTL → CMOS: current is fine, voltage is not (source)',
        content:
          'The source states it directly: “Current: no problem … VOH(min) of TTL too low compared with VIH(min) of CMOS”. With 74LS driving 74HC at 5 V: VNH = VOH(min) − VIH(min) = 2.7 V − 3.5 V = −0.8 V, so the HIGH state has no guaranteed margin, while VNL = 1.5 − 0.5 = +1.0 V is comfortable.',
      },
      {
        label: 'TTL → CMOS: remedies (source)',
        content:
          '(1) A pull-up resistor at the TTL output — the source’s stated solution. With R_p = 2.2 kΩ the HIGH level rises to about 5 V − R_p·(N·IIH) ≈ 4.99 V, giving VNH ≈ +1.5 V; the LOW state must then be re-checked because the resistor adds (VCC − VOL)/R_p ≈ 2 mA to the sink budget. (2) Use a 74HCT device, whose inputs are TTL-compatible (VIH(min) = 2.0 V), giving VNH = +0.7 V with no extra component. (3) For high-voltage CMOS (for example 4000B at 10 V, VIH(min) = 7 V) neither works: use an open-collector TTL buffer with the pull-up returned to the higher rail, or a dedicated level translator.',
      },
      {
        label: 'CMOS → TTL: HIGH is fine, current is not (source)',
        content:
          '“Driving HIGH: no problem … Driving LOW: concern fan-out problem — use buffer.” A 74HC output guarantees IOL = 4 mA while a 74LS input can require 0.4 mA when held LOW, so fan-out(LOW) = 4/0.4 = 10 whereas fan-out(HIGH) = 4/0.02 = 200: the LOW state binds. Remedies: a CMOS buffer or line driver, or splitting the load. The source also notes that 74HC/74HCT outputs are intended to drive a single TTL load of any series except 4000B.',
      },
      {
        label: 'CMOS → TTL at a different supply (source)',
        content:
          'The 4000/14000 series operates over 3 to 15 V, dissipates very little power, is slow, has low output current, and is not pin-compatible or electrically compatible with any TTL series — so a 4000B output driving TTL needs a level translator as well as a current buffer.',
      },
      {
        label: 'Precautions when outputs are connected (source)',
        content:
          'Conventional CMOS outputs and TTL totem-pole outputs must never be tied together: the resulting indeterminate range can damage the ICs. Open-collector (TTL) and open-drain (CMOS) outputs remove the active pull-up transistor and require an external pull-up resistor R_p; those outputs may be wired together to form a wired-OR. Tri-state outputs may share a bus provided only one is enabled at a time.',
      },
      {
        label: 'Unused inputs (source)',
        content:
          'Tie unused TTL emitter inputs to a defined level through a 1 kΩ to 5 kΩ resistor, and never leave control inputs such as MR, PE, PL or CP floating. LS diode inputs rated above 15 V need no resistor.',
      },
      {
        label: 'Provenance note',
        content:
          'Engineering Insight: the numeric level and current figures used above are standard 74-series and 4000-series datasheet values. The expressions, the fan-out idea, the unit-load facts, the pull-up and buffer remedies and all of the precautions are from the supplied material.',
      },
    ],
    marking: [
      '2 marks — the need, stated as a direction-dependent incompatibility.',
      '3 marks — TTL → CMOS: the voltage failure with numbers, and at least two remedies including the pull-up, plus the high-voltage CMOS case.',
      '2 marks — CMOS → TTL: the fan-out arithmetic showing the LOW state binds, and the buffer remedy.',
      '1 mark — the precautions: no tied totem-pole outputs, open-collector with a pull-up, tri-state with one driver active.',
    ],
    engineeringExplanation:
      'Reduce the whole topic to two numbers per direction — VNH and VNL for TTL to CMOS, and the two fan-out ratios for CMOS to TTL — and the remedy follows mechanically from whichever one is negative or too small. That is why interfacing is examined with numbers and not with prose.',
    provenance: 'source',
  },
  {
    id: 'u1ft-h4',
    topicId: 'u1t5',
    type: 'exam',
    level: 3,
    marks: 8,
    skill: 'concept',
    action: 'Explain',
    prompt:
      'Explain how the System Performance Matrix and the Design Matrix are used for decision-making. Give the structure of each, a worked example with numbers, and state the limitations of the method.',
    hint: 'Anchor both matrices to the one table the supplied material actually contains, and say exactly what that table is missing.',
    solution: [
      {
        label: 'Structure of a performance matrix',
        content:
          'Candidate systems form the columns, performance parameters form the rows, each cell holds a score, and each parameter carries a weight taken from the requirement. The weighted score is Σ(good-score × weight) / Σ(weight), and the ranking is reported together with its sensitivity.',
      },
      {
        label: 'The supplied model (source)',
        content:
          'The “Classification of Electronic Product” table already has this shape: parameters (cost, reliability, ergonomics, aesthetics, life, maintenance, operating temperature range) as rows and candidate classes (consumer, industry, military) as columns. What it lacks is a weight per parameter and an explicit direction for each — and without weights it supports discussion but not a decision.',
      },
      {
        label: 'Worked example (Engineering Insight)',
        content:
          'Score the three classes 1–5 in the “good” direction so 5 is always best: consumer 2/2/2/4/5/4, industry 4/4/4/3/3/3, military 5/5/5/5/1/2 across temperature, reliability, life, maintenance, cost and ergonomics. With default weights (5/4/3/3/4/2, total 21) the military class leads with 83 against industry’s 75, because the ruggedness parameters carry most of the weight. Reduce the comparison to two parameters — reliability with weight w and cost with weight (5 − w) — and the boundary appears: industry scores 4w + 3(5 − w) = 15 + w and military 5w + 1(5 − w) = 5 + 4w; they are equal at w = 3.33. So the military class only wins when reliability carries more than about 3.3 of the 5 available points.',
      },
      {
        label: 'Structure of a design matrix',
        content:
          'The same artefact applied before the circuit exists: requirements are mapped onto the design parameters of the thing to be built — accuracy, environmental capability, power, unit cost, serviceability, complexity — so that every architectural decision can be traced back to a requirement. It is written at architecture time, not at selection time.',
      },
      {
        label: 'How the matrix is used for a decision',
        content:
          'Screen hard requirements first: a pass/fail requirement such as an operating-temperature window must be applied as a go/no-go test, never scored, because weighting lets a strong score elsewhere compensate for a failure. Then score every remaining candidate, convert each parameter so 5 is the best value, weight from the requirement, rank, and finally stress-test by changing one weight and reporting where the ranking flips.',
      },
      {
        label: 'Limitations',
        content:
          'Subjective 1–5 scores are not reproducible to better than about half a point, so a gap below roughly 0.25 points is a tie and must be reported as one. A matrix only ranks the options you gave it, so a missing candidate or a missing parameter can overturn the result. A hard constraint — a cost ceiling, a legal requirement — is not a score and must be applied outside the matrix. And a matrix presented without its weights is decoration, not evidence.',
      },
      {
        label: 'Provenance note (important)',
        content:
          'Engineering Insight: neither the System Performance Matrix nor the Design Matrix is defined in the supplied course material. This answer anchors both to the supplied classification table, which is a genuine parameter-by-candidate matrix, and identifies weights as the element the supplied table does not provide.',
      },
    ],
    marking: [
      '2 marks — the structure of a performance matrix and the weighted-score formula.',
      '2 marks — the supplied classification table identified as the model, with the weights it lacks named.',
      '3 marks — a worked example with arithmetic and a decision boundary.',
      '1 mark — the design matrix, and at least two limitations (tie threshold, hard constraints, missing options).',
    ],
    engineeringExplanation:
      'The matrix is not there to produce a winner; it is there to force the trade-off into the open. The answer an examiner rewards states the ranking, the weight that would flip it, and what the matrix cannot decide — because that is what a design review actually asks for.',
    provenance: 'insight',
  },
]

/* ------------------------------------------------------------------ */
/* Paper assembly                                                      */
/* ------------------------------------------------------------------ */

export const UNIT1_FINAL_TEST: TestSection[] = [
  {
    id: 'a',
    letter: 'A',
    title: 'Fundamentals',
    instruction: 'Answer all ten. Each carries 2 marks. One definition and one distinguishing point is enough.',
    marksEach: 2,
    focus: 'Definitions and source statements you must be able to write without thinking.',
    questions: SECTION_A,
  },
  {
    id: 'b',
    letter: 'B',
    title: 'Numericals',
    instruction:
      'Answer all four. Each carries 4 marks. Write the given values, the equation, the substitution with units, and the answer with units.',
    marksEach: 4,
    focus: 'One concept, one calculation, every unit shown.',
    questions: SECTION_B,
  },
  {
    id: 'c',
    letter: 'C',
    title: 'Circuit & System Analysis',
    instruction:
      'Answer any two of three. Each carries 8 marks. State assumptions, then calculate, then verify with a check that could have failed.',
    marksEach: 8,
    focus: 'Analysis with declared assumptions and a verification step.',
    questions: SECTION_C,
  },
  {
    id: 'd',
    letter: 'D',
    title: 'Circuit Design',
    instruction:
      'Answer any two of three. Each carries 8 marks. Requirement → constraints → topology → values → verification → failure modes.',
    marksEach: 8,
    focus: 'Design with an error budget, not with a guess.',
    questions: SECTION_D,
  },
  {
    id: 'e',
    letter: 'E',
    title: 'Component & Class Selection',
    instruction: 'Answer all three. Each carries 4 marks. Select, then justify with numbers from the source data.',
    marksEach: 4,
    focus: 'Choosing a part or a class and defending the choice.',
    questions: SECTION_E,
  },
  {
    id: 'f',
    letter: 'F',
    title: 'Troubleshooting',
    instruction:
      'Answer all four. Each carries 4 marks. Symptom → measurement → hypothesis → confirm → fix → verify.',
    marksEach: 4,
    focus: 'Fault finding with a measurement that splits the possibilities.',
    questions: SECTION_F,
  },
  {
    id: 'g',
    letter: 'G',
    title: 'What-if Analysis',
    instruction:
      'Answer all four. Each carries 4 marks. Change one parameter, quantify the consequence, state what it does to the margin.',
    marksEach: 4,
    focus: 'Sensitivity: how much headroom does a change consume?',
    questions: SECTION_G,
  },
  {
    id: 'h',
    letter: 'H',
    title: 'Long Answers',
    instruction:
      'Answer any two of four. Each carries 8 marks. These are the supplied assignment questions: definition, explanation, derivation where asked, and a closing interpretation.',
    marksEach: 8,
    focus: 'Eight-mark descriptive answers in exam format.',
    questions: SECTION_H,
  },
]

/** Flat list of every question in the paper. */
export const FINAL_TEST_QUESTIONS: Question[] = UNIT1_FINAL_TEST.flatMap((s) => s.questions)

export const FINAL_TEST_TOTAL_MARKS = FINAL_TEST_QUESTIONS.reduce((n, q) => n + q.marks, 0)
