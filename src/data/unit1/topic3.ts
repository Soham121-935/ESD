import type {
  DebugFault,
  DesignChallengeSpec,
  MatrixSpec,
  ModeContent,
  NumericalProblem,
  Question,
  TopicMeta,
} from '../../types'

export const TOPIC3: TopicMeta = {
  id: 'u1t3',
  index: 3,
  title: 'Op-Amp Characteristics',
  shortTitle: 'Op-Amp',
  hook: 'The ideal op-amp draws nothing, offsets nothing and rails instantly. The real one does all three.',
  status: 'live',
}

export const SOURCE_NOTE3 = {
  primary:
    'Supplied course material: “Opamp performance parameters” (ARN, 3/20/2018) — VOS definitions and device table, thermal drift, input bias and offset currents with device table, bias-current error derivation, the worked R1 = 22 kΩ / R2 = 2.2 MΩ example, and CMRR. “OPAMP Fundamentals” (ARN) — powering relations for ICC / IEE / IQ and output saturation. “TY ESD 2026 ISE1” — the inverting-amplifier problem.',
  coverage:
    'The assignment text gives R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, 2 kΩ load and IQ = 0.5 mA but does NOT state the supply rails. Any supply voltage used in a power calculation is declared as an explicit assumption, not presented as source-derived.',
}

/* ------------------------------------------------------------------ */
/* Source device tables                                                */
/* ------------------------------------------------------------------ */

export const OPAMP_SPEC_MATRIX: MatrixSpec = {
  id: 'u1t3-opamp-specs',
  title: 'Practical op-amp parameters — supplied device tables',
  provenance: 'source',
  columns: ['Parameter', '741', '741E', 'OP-07 / OP-77'],
  rows: [
    {
      id: 'vos',
      parameter: 'VOS (typical)',
      cells: {
        '741': '2 mV',
        '741E': '0.8 mV',
        'OP-07 / OP-77': '30 µV (OP-07) / 10 µV (OP-77)',
      },
      provenance: 'source',
    },
    {
      id: 'vosmax',
      parameter: 'VOS (max)',
      cells: {
        '741': '6 mV',
        '741E': '3 mV',
        'OP-07 / OP-77': '75 µV (OP-07) / 50 µV (OP-77)',
      },
      provenance: 'source',
    },
    {
      id: 'tc',
      parameter: 'TC(VOS)',
      cells: {
        '741': '5 µV/°C (typical)',
        '741E': '—',
        'OP-07 / OP-77': '0.1 µV/°C typical, 0.3 µV/°C max (OP-77)',
      },
      provenance: 'source',
    },
    {
      id: 'ib',
      parameter: 'IB (typical / max)',
      cells: {
        '741': '80 nA / 500 nA',
        '741E': '30 nA / 80 nA',
        'OP-07 / OP-77': '1.2 nA / 2 nA (OP-77)',
      },
      provenance: 'source',
    },
    {
      id: 'ios',
      parameter: 'IOS (typical / max)',
      cells: {
        '741': '20 nA / 200 nA',
        '741E': '3 nA / 30 nA',
        'OP-07 / OP-77': '0.3 nA / 1.5 nA (OP-77)',
      },
      provenance: 'source',
    },
  ],
  interpretation:
    'The gap between a 741 and an OP-77 is roughly three orders of magnitude in both VOS and IB. That gap is the whole reason device selection is an engineering decision rather than a default.',
}

export const LOW_IB_NOTES: { device: string; note: string; provenance: 'source' | 'insight' }[] = [
  { device: 'LF356 (JFET input)', note: 'IB = 30 pA, IOS = 3 pA at room temperature.', provenance: 'source' },
  { device: 'TLC279 (MOS input, BiMOS)', note: 'IB = 0.7 pA, IOS = 0.1 pA.', provenance: 'source' },
  { device: 'AD549 / OPA129', note: 'Special JFET structures give IB < 100 fA — electrometer, ion-gauge and photodetector amplifiers.', provenance: 'source' },
  { device: 'LM308 (super-beta)', note: 'Input BJTs with β in excess of 10³ give IB ≈ 1 nA or less.', provenance: 'source' },
  { device: 'OP-07 with bias cancellation', note: 'Internal circuitry supplies the base currents: IB = ±1 nA, IOS = 0.4 nA.', provenance: 'source' },
]

export const BIAS_DRIFT_RULE =
  'The reverse-bias current of a pn junction — a diode or a JFET gate — doubles for every 10 °C increase. Knowing IB at a reference temperature T₀, IB at temperature T is IB(T) = IB(T₀) × 2^((T − T₀)/10).'

/* ------------------------------------------------------------------ */
/* Mode content                                                        */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'Start with the problem your teacher actually set: an inverting amplifier driving a load, and a quiescent current you are told to assume.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The amplifier on the bench',
      provenance: 'source',
      body: [
        'You build an inverting amplifier: R1 = 10 kΩ, Rf = 20 kΩ, input Vi = 3 V. It drives a 2 kΩ load. The datasheet quiescent current is IQ = 0.5 mA.',
        'Your teacher asks: find icc, iee and io, and find the power dissipated inside the op-amp.',
        'The ideal op-amp model answers none of these. It draws no supply current, has no output limit and no offset. Everything the question asks about lives in the gap between the ideal model and the real device.',
      ],
      bullets: [
        'What is required? Three currents and one power.',
        'What is given? R1, Rf, Vi, RL and IQ.',
        'What is missing from the question as written? The supply rails — see the note in the calculation below.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — What the ideal model hides',
      provenance: 'insight',
      body: [
        'The ideal op-amp has infinite gain, infinite input impedance, zero output impedance and zero offset. Under those assumptions Vp = Vn, no current enters the inputs, and the output is whatever the feedback network demands.',
        'A real device has a finite input offset voltage, draws bias current, has a finite CMRR, and its output cannot reach the supply rails. Each of these produces an error at the output, and each must be budgeted.',
      ],
      bullets: [
        'Input offset voltage VOS — the input voltage needed to force Vo = 0 V.',
        'Input bias current IB — the average of the two input currents: IB = (Ip + In)/2.',
        'Input offset current IOS — the difference: IOS = Ip − In.',
        'Temperature drift — VOS and IB both move with temperature.',
        'CMRR — the device also responds a little to the common-mode input.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Input offset voltage (source)',
      provenance: 'source',
      body: [
        'Ideally Vo = a(Vp − Vn) = 0 when Vp = Vn. In a practical op-amp, mismatch in the input transistors produces a non-zero output even then.',
      ],
      quote:
        '“VOS the input offset voltage needed at input so as Vo = 0 V. Vo = a[Vp + VOS − Vn].”',
      sourceRef: 'Opamp performance parameters (ARN), p. 1',
      bullets: [
        'The offset-free op-amp acts as a non-inverting amplifier with respect to VOS, so the output error is Eo = (1 + R2/R1) × VOS.',
        'The factor (1 + R2/R1) is the noise gain — the same gain the circuit applies to anything appearing at the input pins.',
        'The source’s own illustration: with R1 = R2 a 741C gives Eo = 2 × (±2 mV) = ±4 mV typical and ±12 mV maximum. With R2 = 1000·R1 it gives Eo = 1001 × (±2 mV) = ±2 V typical and ±6 V maximum — “quite an error!”.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why does the error grow with gain?',
      provenance: 'insight',
      body: [
        'Because VOS appears at the input, in series with the signal. Whatever gain the circuit applies to the signal it also applies to the offset. You cannot amplify a 10 mV sensor signal by 1000 and expect a 2 mV offset to stay small — it comes out 2 V.',
        'This is the first thing to check when a high-gain DC amplifier reads nonsense with the input shorted.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Supply currents: the source relations',
      provenance: 'source',
      body: [
        'The supplied “OPAMP Fundamentals” sheet states the powering rules directly. These are the relations the assignment question is testing.',
      ],
      quote:
        '“ICC will always flow in VCC terminal. IEE will always flow out of VEE terminal. ICC = Io + IEE @ VO+ or IEE = ICC + Io @ VO−. When Io = 0 then ICC = IEE = IQ: Supply quiescent current required to bias transistors in Opamp.”',
      sourceRef: 'OPAMP Fundamentals (ARN), p. 2',
      bullets: [
        'IQ is the current the op-amp needs just to bias its internal transistors — it flows even with no load.',
        'When the output sources current (Vo positive), that load current is drawn from the positive rail, so ICC grows.',
        'When the output sinks current (Vo negative), that load current leaves through the negative rail, so IEE grows.',
        'The other rail keeps carrying only IQ.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Live inverting amplifier',
      provenance: 'insight',
      body: [
        'Move any value and watch the currents, the saturation flag and the offset error change together. Five of the controls are the supplied problem’s own values.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — The supplied problem',
      provenance: 'source',
      body: [
        'R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA.',
      ],
      bullets: [
        'Step 1 — Gain: Av = −Rf/R1 = −20 kΩ / 10 kΩ = −2. Vo = Av × Vi = −2 × 3 V = −6 V.',
        'Step 2 — Load current: Io = |Vo| / RL = 6 V / 2 kΩ = 3 mA. Because Vo is negative, this current flows INTO the op-amp output.',
        'Step 3 — Supply currents: Vo is negative, so the source relation is IEE = ICC + Io. With no load current the rails would each carry IQ, so ICC = IQ = 0.5 mA and IEE = 0.5 mA + 3 mA = 3.5 mA.',
        'Step 4 — Power. The rails are NOT stated in the assignment. Taking ±15 V, the value the source uses in its own saturation example: power drawn from the supplies = VCC·ICC + |VEE|·IEE = 15 V × 0.5 mA + 15 V × 3.5 mA = 7.5 mW + 52.5 mW = 60 mW.',
        'Step 5 — Power dissipated inside the op-amp = power from the supplies − power delivered to the load = 60 mW − (6 V × 3 mA) = 60 mW − 18 mW = 42 mW.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: ['Change one quantity at a time and state the direction before you calculate it.'],
      bullets: [
        'What if Vi = −3 V? Vo becomes +6 V, the output sources current, and the roles swap: ICC = 3.5 mA, IEE = 0.5 mA.',
        'What if the load is removed? Io = 0, so ICC = IEE = IQ = 0.5 mA — the source states this case explicitly.',
        'What if RL is halved to 1 kΩ? Io doubles to 6 mA and IEE becomes 6.5 mA, so the power dissipated in the op-amp roughly doubles.',
        'What if Rf is increased to 100 kΩ? Vo = −30 V — beyond the ±13 V the source allows on ±15 V rails. The output saturates and every number above becomes invalid.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Output saturation',
      provenance: 'source',
      body: [
        'The supplied sheet states that the op-amp output saturates below 2 V of VCC and VEE.',
      ],
      bullets: [
        'For ±15 V rails, Vo = ±13 V.',
        'For ±9 V rails, Vo = ±7 V.',
        'Rail-to-rail op-amps (CMOS based, with moderate loading) give VOH = VCC and VOL = VEE.',
        'Always check the saturation limit before trusting a gain calculation — a saturated output is the commonest reason a measured gain does not match the resistor ratio.',
      ],
      sourceRef: 'OPAMP Fundamentals (ARN), p. 2',
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'You can compute the ideal gain. Now budget the error: offset voltage, bias current, offset current and CMRR, and decide which device and which resistor values you need.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The amplifier that reads 40 mV with the input shorted',
      provenance: 'insight',
      body: [
        'A current-shunt monitor uses an inverting amplifier with R1 = 1 kΩ and Rf = 1 MΩ, giving a gain of 1000. With the input grounded the output sits at +40 mV instead of 0 V. The customer rejects the batch.',
        'Nothing is broken. The gain of 1000 is doing exactly what it does to everything appearing at the input — including the op-amp’s own offset.',
      ],
      bullets: [
        'Required: identify the error source, quantify it, and choose the fix.',
        'Given: noise gain 1001, output error 40 mV with input grounded.',
        'Which parameter multiplies by the noise gain? VOS — and, if the compensation resistor is missing, IB too.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — The full bias-current error expression',
      provenance: 'source',
      body: [
        'Using superposition — set Ip to zero and compute Von due to In, set In to zero and compute Vop due to Ip, then add — the source derives the general output error',
      ],
      quote:
        'Vo = (1 + R2/R1) { [(R1||R2) − Rp]·IB − [(R1||R2) + Rp]·IOS/2 }.',
      sourceRef: 'Opamp performance parameters (ARN), p. 2',
      bullets: [
        'If Rp = R1||R2 the IB term vanishes and the expression collapses to Vo = R2 × IOS.',
        'That is the whole point of the compensation resistor: it turns an IB error into a much smaller IOS error.',
        'The source’s worked example: R1 = 22 kΩ, R2 = 2.2 MΩ, IB = 80 nA, IOS = 20 nA gives 175 mV with Rp = 0, 44 mV with Rp = R1||R2, 4.4 mV when all resistances are divided by 10, and 0.7 mV when the device is changed to one with IOS = 3 nA.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why does matching Rp help so much?',
      provenance: 'insight',
      body: [
        'IB is the average of the two input currents and is typically much larger than IOS — for a 741, 80 nA against 20 nA, and in the worst case 500 nA against 200 nA.',
        'If both inputs see the same resistance, the two equal parts of IB develop equal voltages and the differential input error cancels. What is left is only the mismatch between the two currents, which is IOS.',
        'So the compensation resistor does not reduce IB — it stops IB from becoming a differential error.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Budget the error before you choose the device',
      provenance: 'insight',
      body: [
        'Work out what the circuit can tolerate, then work backwards to the device and the resistor values.',
      ],
      bullets: [
        'Step 1 — Write the noise gain: 1 + Rf/R1. Everything at the input is multiplied by this.',
        'Step 2 — Offset budget: Eo(VOS) = (1 + Rf/R1) × VOS. Use the maximum VOS, not the typical value, if the product must work over a batch.',
        'Step 3 — Bias budget: add Rp = R1||Rf so the error becomes Rf × IOS.',
        'Step 4 — Temperature: Eo at the worst-case temperature uses VOS(T) = VOS(25 °C) + TC(VOS) × (T − 25 °C).',
        'Step 5 — Compare the total with the allowed error. If it fails, change the device before you change the circuit — swapping a 741 for an OP-77 buys roughly 200× on VOS.',
        'Step 6 — Only if the device cannot fix it, reduce the resistances or reduce the gain.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Watch each error term separately',
      provenance: 'insight',
      body: [
        'The live circuit shows the VOS error, the IB error when Rp is omitted, and the IOS error when Rp is matched, as three separate numbers. Change the gain and watch which one dominates.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — The 40 mV fault',
      provenance: 'insight',
      body: [
        'R1 = 1 kΩ, Rf = 1 MΩ, noise gain = 1 + 1000 = 1001. Observed Eo = +40 mV with the input grounded.',
      ],
      bullets: [
        'Step 1 — Implied input-referred offset: VOS(effective) = Eo / noise gain = 40 mV / 1001 = 39.96 µV ≈ 40 µV.',
        'Step 2 — Compare with the devices: a 741 typical VOS is 2 mV, which alone would give 1001 × 2 mV ≈ 2 V. So the device is NOT a 741 — 40 µV input-referred is consistent with an OP-07-class part (30 µV typical).',
        'Step 3 — Check the bias term: with Rp omitted, R1||Rf ≈ 1 kΩ, and a 741’s IB of 80 nA would add 1001 × 1 kΩ × 80 nA ≈ 80 mV. With an OP-77 (IB = 1.2 nA) the same term is about 1.2 mV.',
        'Step 4 — Conclusion: at gain 1000 the remaining 40 mV is ordinary VOS, amplified. The fix is not to “adjust” it but to decide whether 40 mV is inside the specification — at gain 1000 it corresponds to 40 µV of input, which is 0.4% of a 10 mV full-scale signal.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Sensitivity of the error budget',
      provenance: 'insight',
      body: ['Each of these is a design-review question. Answer with a number.'],
      bullets: [
        'What if the gain is halved to 500? Every input-referred error halves at the output — the cheapest error reduction available.',
        'What if the resistors are divided by 10? The source’s own example shows the error falling from 44 mV to 4.4 mV, because the IOS error is Rf × IOS and Rf has fallen by 10.',
        'What if the device is changed to one with IOS = 3 nA instead of 20 nA? Again from the source example: 4.4 mV becomes 0.7 mV.',
        'What if the temperature rises from 25 °C to 70 °C? VOS grows by TC(VOS) × 45 °C — about 225 µV on a 741, about 4.5 µV on an OP-77.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — CMRR',
      provenance: 'source',
      body: [
        'A practical op-amp responds a little to the common-mode input as well as to the differential input.',
      ],
      quote:
        '“Vo = a(Vp − Vn) + acm·Vcm … 1/CMRR = dVOS/dVcm and can be specified as µVolts/Volt. CMRR is specified in dB: CMRRdB = 20 log CMRR, and 1/CMRR = 10^(−CMRRdB/20). CMRR is frequency dependent and starts to roll off at 100 Hz. CMRR is no serious concern for inverting amplifier as Vp is at 0 volts.”',
      sourceRef: 'Opamp performance parameters (ARN), p. 3',
      bullets: [
        'Vcm = (Vp + Vn)/2. The error appears as an equivalent input offset of Vcm/CMRR.',
        'In an inverting amplifier the non-inverting pin is at 0 V, so Vcm is near zero and CMRR error is negligible — the source says exactly this.',
        'CMRR matters in non-inverting and differential configurations, and in measurement systems where the signal sits on a common-mode voltage.',
      ],
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode answers the assignment question directly and in the order the marks are awarded: circuit, gain, currents, power, then the assumption declared.',
  blocks: [
    {
      kind: 'problem',
      title: 'EXAM QUESTION — the supplied problem',
      provenance: 'source',
      body: [
        'Q. An inverting amplifier with R1 = 10 kΩ and Rf = 20 kΩ and Vi = 3 V drives a 2 kΩ load. (a) Assume IQ = 0.5 mA, find icc, iee and io. (b) Find the power dissipated inside the op-amp.',
      ],
      sourceRef: 'TY ESD 2026 ISE1 — Unit 1, Q.4',
    },
    {
      kind: 'concept',
      title: 'Model answer — (a) Currents',
      provenance: 'source',
      body: [
        'Write the gain, then the output, then decide the direction of the load current, and only then apply the supply-current relations.',
      ],
      bullets: [
        'Av = −Rf/R1 = −20 kΩ/10 kΩ = −2.',
        'Vo = Av × Vi = −2 × 3 V = −6 V.',
        'Io = |Vo|/RL = 6 V / 2 kΩ = 3 mA. Since Vo is negative, the op-amp sinks current: Io flows into the output terminal.',
        'Source relation for Vo negative: IEE = ICC + Io. With the quiescent current flowing in both rails, ICC = IQ = 0.5 mA.',
        'Therefore IEE = 0.5 mA + 3 mA = 3.5 mA.',
        'Answer (a): io = 3 mA, icc = 0.5 mA, iee = 3.5 mA.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (b) Power dissipated inside the op-amp',
      provenance: 'insight',
      body: [
        'The assignment text does not state the supply rails. State that, then choose a value and show both power quantities.',
      ],
      bullets: [
        'Assumption: ±15 V rails — the supply the source quotes in its own saturation example (±15 V → Vo = ±13 V). Declare it explicitly.',
        'Check saturation: |Vo| = 6 V < 13 V, so the output is in the linear region and the calculation is valid.',
        'Power drawn from the supplies: P = VCC × ICC + |VEE| × IEE = 15 V × 0.5 mA + 15 V × 3.5 mA = 7.5 mW + 52.5 mW = 60 mW.',
        'Power delivered to the load: PL = |Vo| × Io = 6 V × 3 mA = 18 mW.',
        'Power dissipated inside the op-amp: Pd = 60 mW − 18 mW = 42 mW.',
        'If the examiner intends “power dissipated” to mean the total drawn from the supplies, the answer is 60 mW. Write both, label both, and state which definition you are using — that is the mark-winning move.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Diagram (2 marks if asked to draw the circuit)',
      provenance: 'insight',
      body: [
        'Draw: Vi → R1 → inverting node; Rf from the output back to the inverting node; non-inverting input to ground through Rp; output to ground through RL; the op-amp triangle with +VCC and −VEE rails and decoupling capacitors.',
        'Show ICC flowing into the VCC pin, IEE flowing out of the VEE pin, and Io at the output. Labelled current arrows are marks.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme and common mistakes',
      provenance: 'insight',
      body: [
        '1 mark — gain and output voltage with the sign.',
        '2 marks — load current with its direction stated.',
        '2 marks — ICC and IEE from the source relations, with the correct rail carrying the load current.',
        '2 marks — power, with the supply assumption stated and the load power handled correctly.',
        '1 mark — saturation check and/or decoupling note.',
      ],
      bullets: [
        'Common mistake 1: putting the load current on the wrong rail. Vo = −6 V means the op-amp sinks, so IEE grows, not ICC.',
        'Common mistake 2: forgetting that the quiescent current flows in BOTH rails, not just one.',
        'Common mistake 3: quoting 60 mW as the power “dissipated inside” the op-amp without subtracting the 18 mW delivered to the load.',
        'Common mistake 4: not declaring the supply rails. If you must assume them, say so in the answer.',
      ],
    },
  ],
}

export const TOPIC3_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* Numerical problems                                                  */
/* ------------------------------------------------------------------ */

export const OPAMP_PROBLEMS: NumericalProblem[] = [
  {
    id: 'u1t3-p1',
    title: 'Problem 1 — The supplied inverting amplifier problem',
    provenance: 'source',
    situation:
      'An inverting amplifier with R1 = 10 kΩ and Rf = 20 kΩ and Vi = 3 V drives a 2 kΩ load. Assume IQ = 0.5 mA. Find io, icc and iee, and find the power dissipated inside the op-amp.',
    given: [
      { symbol: 'R1', value: '10 kΩ' },
      { symbol: 'Rf', value: '20 kΩ' },
      { symbol: 'Vi', value: '3 V' },
      { symbol: 'RL', value: '2 kΩ' },
      { symbol: 'IQ', value: '0.5 mA' },
      { symbol: 'Supply rails', value: 'NOT stated in the assignment' },
    ],
    required: [
      'Closed-loop gain and output voltage',
      'Load current io and its direction',
      'Supply currents icc and iee',
      'Power drawn from the supplies, and power dissipated inside the op-amp',
    ],
    assumptions: [
      'Source relations (OPAMP Fundamentals, p. 2): ICC flows into VCC, IEE flows out of VEE, ICC = Io + IEE at Vo+, IEE = ICC + Io at Vo−, and ICC = IEE = IQ when Io = 0.',
      'Supply rails: the assignment text does not give them. The power answers below assume ±15 V — the supply value the source quotes in its own saturation example. This is an explicit assumption, not a source value.',
      'Output saturation check (source): on ±15 V rails the output saturates 2 V below the rails, i.e. at ±13 V. |Vo| = 6 V, so the output is in the linear region.',
    ],
    steps: [
      {
        id: 'gain',
        ask: 'Step 1 — What are the closed-loop gain and the output voltage? Av = −Rf/R1, Vo = Av × Vi.',
        concept:
          'For an inverting amplifier the signal enters the inverting input, so the closed-loop gain is negative: Av = −Rf/R1.',
        equation: 'Av = −Rf/R1 ;  Vo = Av × Vi',
        substitution:
          'Av = −20 kΩ / 10 kΩ = −2. Vo = −2 × 3 V = −6 V. Saturation check: |−6 V| < 13 V on ±15 V rails, so the output is linear.',
        entries: [
          { id: 'g1', label: 'Av', unit: 'V/V', answer: -2, tolerance: 0.05 },
          { id: 'g2', label: 'Vo', unit: 'V', answer: -6, tolerance: 0.1 },
        ],
        hints: [
          'The gain of an inverting amplifier is negative — keep the sign, it decides the next step.',
          'Rf/R1 = 20/10 = 2, so Av = −2 and Vo = −2 × 3 = −6 V.',
        ],
        interpretation:
          'Vo = −6 V. The sign matters more than the magnitude here: because Vo is negative the op-amp is sinking current, which determines which supply rail carries the load current.',
        whatIf:
          'If Vi = −3 V, Vo = +6 V and the roles of the two supply rails swap. If Rf were 100 kΩ, Vo = −30 V, which is beyond the ±13 V allowed on ±15 V rails — the output saturates and every later number becomes meaningless.',
      },
      {
        id: 'io',
        ask: 'Step 2 — What is the load current io, and in which direction does it flow?',
        concept:
          'The load is connected from the output to ground, so the load current is Vo/RL. A negative result means current flows from ground through the load and into the op-amp output.',
        equation: 'Io = Vo / RL',
        substitution:
          'Io = −6 V / 2 kΩ = −3 mA. Magnitude 3 mA, flowing INTO the op-amp output (the op-amp sinks it).',
        entries: [{ id: 'io1', label: 'io (magnitude)', unit: 'mA', answer: 3, tolerance: 0.05 }],
        hints: [
          'Divide the output voltage by the load resistance. Volts over kΩ gives mA.',
          '6 V / 2 kΩ = 3 mA. The negative sign in Vo tells you the direction.',
        ],
        interpretation:
          'Three milliamps is large compared with the 0.5 mA quiescent current — six times larger. That ratio is why the load current dominates the supply-current answer.',
        whatIf:
          'Halving RL to 1 kΩ doubles io to 6 mA. The quiescent current does not change, so the load term becomes twelve times IQ.',
      },
      {
        id: 'supply',
        ask: 'Step 3 — Find icc and iee. Vo is negative, so use IEE = ICC + Io with ICC = IQ.',
        concept:
          'Source: ICC always flows in VCC, IEE always flows out of VEE, and at Vo− the relation is IEE = ICC + Io. When Io = 0 both rails carry IQ.',
        equation: 'ICC = IQ ;  IEE = ICC + Io',
        substitution:
          'ICC = 0.5 mA. IEE = 0.5 mA + 3 mA = 3.5 mA. Check: the source relation IEE = ICC + Io gives 3.5 = 0.5 + 3 ✓.',
        entries: [
          { id: 's1', label: 'icc', unit: 'mA', answer: 0.5, tolerance: 0.02 },
          { id: 's2', label: 'iee', unit: 'mA', answer: 3.5, tolerance: 0.05 },
        ],
        hints: [
          'Which rail carries the load current? Vo is negative, so the op-amp sinks current and it leaves through the negative rail.',
          'The rail that does NOT supply the load still carries IQ. So ICC = 0.5 mA and IEE = 0.5 + 3 = 3.5 mA.',
        ],
        interpretation:
          'Only 0.5 mA flows in the positive rail while 3.5 mA flows out of the negative rail. An engineer who assumes the two supply currents are equal will under-size the negative supply by a factor of seven.',
        whatIf:
          'With no load, ICC = IEE = IQ = 0.5 mA exactly as the source states. With Vi = −3 V the answers swap to ICC = 3.5 mA, IEE = 0.5 mA.',
      },
      {
        id: 'psupply',
        ask: 'Step 4 — Taking ±15 V rails (assumption: not given in the assignment), find the power drawn from the supplies.',
        concept:
          'Power from each supply is the rail voltage times the current in that rail. Add the two rails; the currents are not equal, so you cannot double one of them.',
        equation: 'P_supply = VCC × ICC + |VEE| × IEE',
        substitution:
          'P = 15 V × 0.5 mA + 15 V × 3.5 mA = 7.5 mW + 52.5 mW = 60 mW.',
        entries: [{ id: 'p1', label: 'P from supplies', unit: 'mW', answer: 60, tolerance: 1 }],
        hints: [
          'Volts times milliamps gives milliwatts.',
          'Compute each rail separately because ICC ≠ IEE, then add: 7.5 + 52.5 = 60 mW.',
        ],
        interpretation:
          'If the examiner means “power drawn from the supplies”, 60 mW is the answer. Write the assumption down next to it — that is what separates a good answer from a lucky one.',
        whatIf:
          'On ±9 V rails the same currents give 9 × 0.5 + 9 × 3.5 = 36 mW. The power scales with the rails; the currents do not.',
      },
      {
        id: 'pdiss',
        ask: 'Step 5 — What is the power dissipated inside the op-amp? Subtract the power delivered to the load.',
        concept:
          'Conservation of energy: the power taken from the supplies either goes to the load or becomes heat inside the op-amp. What is delivered to the load is not dissipated in the device.',
        equation: 'PL = |Vo| × Io ;  Pd = P_supply − PL',
        substitution:
          'PL = 6 V × 3 mA = 18 mW. Pd = 60 mW − 18 mW = 42 mW.',
        entries: [
          { id: 'p2', label: 'Power in load', unit: 'mW', answer: 18, tolerance: 0.5 },
          { id: 'p3', label: 'Power dissipated in op-amp', unit: 'mW', answer: 42, tolerance: 1 },
        ],
        hints: [
          'First compute the load power: 6 V × 3 mA.',
          'Then subtract it from the 60 mW found in step 4: 60 − 18 = 42 mW.',
        ],
        interpretation:
          '42 mW of heat inside the package. That is the number a thermal check uses — and it is why a small package driving a 2 kΩ load on ±15 V rails can run surprisingly warm.',
        whatIf:
          'If the load is removed, Io = 0, PL = 0 and the dissipation falls to 15 × 0.5 + 15 × 0.5 = 15 mW — all of it quiescent.',
      },
    ],
    verification:
      'Check 1: IEE = ICC + Io → 3.5 mA = 0.5 mA + 3 mA ✓ (the source relation for Vo−). Check 2: energy balance, 60 mW from the supplies = 18 mW to the load + 42 mW dissipated ✓. Check 3: |Vo| = 6 V is inside the ±13 V the source allows on ±15 V rails, so no saturation ✓.',
    interpretation:
      'The exam point of this problem is the direction of the load current and the resulting asymmetry between the two supply rails. The arithmetic is trivial; getting ICC and IEE the right way round is the whole question.',
  },
  {
    id: 'u1t3-p2',
    title: 'Problem 2 — Output error caused by input offset voltage',
    provenance: 'source',
    situation:
      'The supplied material treats the offset-free op-amp as a non-inverting amplifier with respect to VOS, so Eo = (1 + R2/R1) × VOS. A 741C is used with R1 = R2, and then with R2 = 1000 × R1. Calculate the output error in both cases, typical and maximum.',
    given: [
      { symbol: 'VOS (741C, typical)', value: '2 mV' },
      { symbol: 'VOS (741C, max)', value: '6 mV' },
      { symbol: 'Case 1', value: 'R1 = R2, so noise gain = 2' },
      { symbol: 'Case 2', value: 'R2 = 1000·R1, so noise gain = 1001' },
    ],
    required: [
      'Noise gain in each case',
      'Typical output error in each case',
      'Maximum output error in each case',
    ],
    assumptions: [
      'Source: the offset-free op-amp acts as a non-inverting amplifier with respect to VOS, so Eo = (1 + R2/R1)·VOS.',
      'Device values are the supplied 741C figures.',
      'Temperature is 25 °C; drift is handled separately.',
    ],
    steps: [
      {
        id: 'ng',
        ask: 'Step 1 — What is the noise gain (1 + R2/R1) in each case?',
        concept:
          'The noise gain is the gain the circuit applies to anything appearing at the input pins, including the offset voltage.',
        equation: 'Noise gain = 1 + R2/R1',
        substitution: 'Case 1: R2/R1 = 1 → noise gain = 2. Case 2: R2/R1 = 1000 → noise gain = 1001.',
        entries: [
          { id: 'n1', label: 'Noise gain, case 1', unit: 'V/V', answer: 2, tolerance: 0.01 },
          { id: 'n2', label: 'Noise gain, case 2', unit: 'V/V', answer: 1001, tolerance: 1 },
        ],
        hints: [
          'Add 1 to the resistor ratio — it is a non-inverting gain, not −R2/R1.',
          'Case 2 has R2 = 1000 R1, so the ratio is 1000 and the noise gain is 1001.',
        ],
        interpretation:
          'Case 2 applies 500 times more gain to the offset than case 1, which is exactly why the error explodes.',
        whatIf:
          'At unity-gain noise gain (a voltage follower) the factor is 1 and the output error equals VOS itself.',
      },
      {
        id: 'typ',
        ask: 'Step 2 — Typical output error in each case, using VOS = 2 mV.',
        concept: 'Eo = noise gain × VOS.',
        equation: 'Eo = (1 + R2/R1) × VOS',
        substitution:
          'Case 1: 2 × 2 mV = 4 mV. Case 2: 1001 × 2 mV = 2002 mV ≈ 2 V. These are the source’s own figures.',
        entries: [
          { id: 't1', label: 'Eo typical, case 1', unit: 'mV', answer: 4, tolerance: 0.1 },
          { id: 't2', label: 'Eo typical, case 2', unit: 'V', answer: 2, tolerance: 0.05 },
        ],
        hints: [
          'Multiply the noise gain by 2 mV and watch the units.',
          'Case 2: 1001 × 0.002 V = 2.002 V.',
        ],
        interpretation:
          'Two volts of output error from a 2 mV input imperfection. The source calls this “quite an error!” — and it is, on any supply.',
        whatIf:
          'On ±15 V rails the usable swing is ±13 V, so a ±2 V typical error consumes about 15% of the available range before any signal is applied.',
      },
      {
        id: 'max',
        ask: 'Step 3 — Maximum output error in each case, using VOS = 6 mV.',
        concept:
          'Use the maximum VOS when the product must work across a batch or over the full temperature range.',
        equation: 'Eo(max) = (1 + R2/R1) × VOS(max)',
        substitution:
          'Case 1: 2 × 6 mV = 12 mV. Case 2: 1001 × 6 mV = 6006 mV ≈ 6 V.',
        entries: [
          { id: 'm1', label: 'Eo max, case 1', unit: 'mV', answer: 12, tolerance: 0.2 },
          { id: 'm2', label: 'Eo max, case 2', unit: 'V', answer: 6, tolerance: 0.1 },
        ],
        hints: [
          'Same multiplication with the maximum offset.',
          'Case 2: 1001 × 0.006 V = 6.006 V.',
        ],
        interpretation:
          'Six volts of worst-case error on ±15 V rails is nearly half the available output swing. A worst-case design with a 741 at gain 1000 is not a design — it is a gamble.',
        whatIf:
          'Swapping to an OP-77 (VOS max = 50 µV) at the same gain gives 1001 × 50 µV = 50 mV — a 120× improvement for the price of a different part number.',
      },
    ],
    verification:
      'Ratio check: 1001/2 = 500.5, and 2002 mV / 4 mV = 500.5 ✓. Likewise 6006/12 = 500.5 ✓. The error scales exactly with the noise gain, as the source expression requires.',
    interpretation:
      'The design lesson: at high gain, the offset voltage — not the signal — sets the output. Choose the device from the error budget, then choose the resistors.',
  },
  {
    id: 'u1t3-p3',
    title: 'Problem 3 — Bias-current compensation (source worked example)',
    provenance: 'source',
    situation:
      'The supplied worked example: R1 = 22 kΩ and R2 = 2.2 MΩ, with IB = 80 nA and IOS = 20 nA. (a) Calculate Eo with Rp = 0. (b) Repeat with Rp = R1||R2. (c) Repeat (b) with all resistances reduced by a factor of 10. (d) Repeat (c) with a device having IOS = 3 nA. Comment.',
    given: [
      { symbol: 'R1', value: '22 kΩ' },
      { symbol: 'R2', value: '2.2 MΩ' },
      { symbol: 'IB', value: '80 nA' },
      { symbol: 'IOS', value: '20 nA (3 nA in part d)' },
      { symbol: 'Source expression', value: 'Vo = (1 + R2/R1){[(R1||R2) − Rp]·IB − [(R1||R2) + Rp]·IOS/2}' },
    ],
    required: [
      'R1||R2 and the noise gain',
      'Eo for each of the four cases',
      'The engineering comment the source expects',
    ],
    assumptions: [
      'The source’s own expression and its own numerical answers (175 mV, 44 mV, 4.4 mV, 0.7 mV).',
      'Part (a) is dominated by the IB term because Rp = 0 leaves the bias current uncompensated.',
    ],
    steps: [
      {
        id: 'net',
        ask: 'Step 1 — Calculate R1||R2 and the noise gain 1 + R2/R1.',
        concept:
          'R1||R2 is the resistance seen by the non-inverting input with the sources set to zero; it is the value Rp must match for cancellation.',
        equation: 'R1||R2 = R1·R2/(R1 + R2) ; noise gain = 1 + R2/R1',
        substitution:
          'R1||R2 = 22 kΩ × 2.2 MΩ / (22 kΩ + 2.2 MΩ) = 21.78 kΩ. Noise gain = 1 + 2.2 MΩ/22 kΩ = 1 + 100 = 101.',
        entries: [
          { id: 'r1', label: 'R1||R2', unit: 'kΩ', answer: 21.78, tolerance: 0.2 },
          { id: 'r2', label: 'Noise gain', unit: 'V/V', answer: 101, tolerance: 0.5 },
        ],
        hints: [
          'Product over sum for the parallel combination.',
          '2200/22 = 100, so the noise gain is 101.',
        ],
        interpretation:
          'R1||R2 ≈ 21.8 kΩ is very close to R1 because R2 is 100 times larger — a useful mental shortcut at high gain.',
      },
      {
        id: 'a',
        ask: 'Step 2 — Case (a): Rp = 0. What is the output error?',
        concept:
          'With Rp = 0 the IB term is unopposed: the bias current flowing in R1||R2 is amplified by the noise gain. The source gives 175 mV.',
        equation: 'Eo ≈ (1 + R2/R1) × (R1||R2) × IB',
        substitution:
          'Eo ≈ 101 × 21.78 kΩ × 80 nA = 101 × 1.742 mV = 176 mV ≈ 175 mV (source value).',
        entries: [{ id: 'a1', label: 'Eo, Rp = 0', unit: 'mV', answer: 175, tolerance: 3 }],
        hints: [
          'With no compensation resistor the dominant term is the IB term.',
          'kΩ × nA gives mV: 21.78 × 80 = 1742 µV = 1.742 mV, then multiply by 101.',
        ],
        interpretation:
          '175 mV of error from the bias current alone. This is the number you get when the compensation resistor is omitted — the classic omission on a copied schematic.',
        whatIf:
          'With the worst-case IB of 500 nA the same circuit gives about 1.1 V.',
      },
      {
        id: 'b',
        ask: 'Step 3 — Case (b): Rp = R1||R2. What is the output error?',
        concept:
          'When Rp matches R1||R2 the IB term cancels and the expression collapses to Eo = R2 × IOS — the source derives this explicitly.',
        equation: 'Eo = R2 × IOS',
        substitution: 'Eo = 2.2 MΩ × 20 nA = 44 mV.',
        entries: [{ id: 'b1', label: 'Eo, Rp matched', unit: 'mV', answer: 44, tolerance: 1 }],
        hints: [
          'With Rp = R1||R2 the IB term disappears entirely.',
          'MΩ × nA gives mV directly: 2.2 × 20 = 44 mV.',
        ],
        interpretation:
          'Adding one 21.8 kΩ resistor cut the error by a factor of four — from 175 mV to 44 mV — at the cost of one component.',
        whatIf:
          'If Rp is mismatched by 10%, the residual IB term reappears at about 10% of 175 mV, i.e. ≈ 17 mV, which is comparable to the IOS term.',
      },
      {
        id: 'cd',
        ask: 'Step 4 — Cases (c) and (d): all resistances ÷ 10, then IOS = 3 nA.',
        concept:
          'Because Eo = R2 × IOS once Rp is matched, the error scales directly with R2 and with IOS.',
        equation: 'Eo(c) = (R2/10) × IOS ; Eo(d) = (R2/10) × IOS(new)',
        substitution:
          'R2 becomes 220 kΩ. (c) Eo = 220 kΩ × 20 nA = 4.4 mV. (d) Eo = 220 kΩ × 3 nA = 0.66 mV ≈ 0.7 mV.',
        entries: [
          { id: 'c1', label: 'Eo, case (c)', unit: 'mV', answer: 4.4, tolerance: 0.2 },
          { id: 'd1', label: 'Eo, case (d)', unit: 'mV', answer: 0.7, tolerance: 0.1 },
        ],
        hints: [
          'Dividing every resistance by 10 divides R2 by 10, so the error drops by 10.',
          'Then IOS falls from 20 nA to 3 nA, a further factor of about 6.7.',
        ],
        interpretation:
          'The source’s comment: adding the compensation resistor, reducing the resistances and choosing a low-IOS device together took the error from 175 mV to 0.7 mV — a factor of 250 — with no change to the circuit topology.',
        whatIf:
          'Reducing resistances increases current consumption and loads the op-amp output, so this is not free; the trade-off is error against power and drive capability.',
      },
    ],
    verification:
      'Ordering check: 175 mV > 44 mV > 4.4 mV > 0.7 mV, and each step matches the factor expected from the expression (×0.25 for compensation, ×0.1 for the resistor scaling, ×0.15 for the IOS change).',
    interpretation:
      'Three independent levers on the same error: cancel it (Rp), scale it down (smaller resistors), or buy it away (a better device). Engineering is choosing which lever is cheapest.',
  },
  {
    id: 'u1t3-p4',
    title: 'Problem 4 — Thermal drift of VOS',
    provenance: 'source',
    situation:
      'The supplied example: an op-amp with VOS(25 °C) = 1 mV and TC(VOS)avg = 5 µV/°C. Calculate VOS at 70 °C and state what this means for a product that must work over that range.',
    given: [
      { symbol: 'VOS at 25 °C', value: '1 mV' },
      { symbol: 'TC(VOS)avg', value: '5 µV/°C' },
      { symbol: 'T', value: '70 °C' },
    ],
    required: ['VOS at 70 °C', 'The temperature-induced change', 'The engineering consequence'],
    assumptions: [
      'Source: VOS is temperature dependent, with TC(VOS) = ∂VOS/∂T in µV/°C.',
      'A linear (average) drift coefficient is used, as in the supplied example.',
    ],
    steps: [
      {
        id: 'delta',
        ask: 'Step 1 — What is the temperature rise above the 25 °C reference?',
        concept: 'Drift is specified relative to a reference temperature, normally 25 °C.',
        equation: 'ΔT = T − 25 °C',
        substitution: 'ΔT = 70 °C − 25 °C = 45 °C.',
        entries: [{ id: 'd1', label: 'ΔT', unit: '°C', answer: 45, tolerance: 0.5 }],
        hints: ['Subtract the reference temperature.', '70 − 25 = 45 °C.'],
        interpretation:
          'The reference matters: quoting drift without the reference temperature is meaningless.',
      },
      {
        id: 'vos',
        ask: 'Step 2 — What is VOS at 70 °C?',
        concept: 'VOS(T) = VOS(25 °C) + TC(VOS) × ΔT.',
        equation: 'VOS(T) = VOS(25 °C) + TC(VOS) × (T − 25 °C)',
        substitution:
          'VOS(70 °C) = 1 mV + (5 µV/°C × 45 °C) = 1 mV + 225 µV = 1.225 mV. This is the source’s own result.',
        entries: [{ id: 'v1', label: 'VOS at 70 °C', unit: 'mV', answer: 1.225, tolerance: 0.01 }],
        hints: [
          'Convert 225 µV to mV before adding: 225 µV = 0.225 mV.',
          '1 + 0.225 = 1.225 mV.',
        ],
        interpretation:
          'A 22.5% increase in offset from temperature alone — before any signal, gain or common-mode effect is considered.',
        whatIf:
          'An OP-77 with TC(VOS) = 0.1 µV/°C would drift only 4.5 µV over the same range — 50 times less.',
      },
      {
        id: 'out',
        ask: 'Step 3 — If the circuit has a noise gain of 101, what is the change in output error between 25 °C and 70 °C?',
        concept: 'The drift in VOS is amplified by exactly the same noise gain as the offset itself.',
        equation: 'ΔEo = noise gain × ΔVOS',
        substitution:
          'ΔVOS = 0.225 mV, so ΔEo = 101 × 0.225 mV = 22.7 mV.',
        entries: [{ id: 'o1', label: 'ΔEo', unit: 'mV', answer: 22.7, tolerance: 1 }],
        hints: [
          'Only the CHANGE is asked for, not the total error.',
          '101 × 0.225 mV ≈ 22.7 mV.',
        ],
        interpretation:
          'Nearly 23 mV of output wander over the temperature range — which is why a precision instrument needs either a low-drift device or periodic auto-zero.',
        whatIf:
          'At a noise gain of 1001 the same drift gives 225 mV of output wander.',
      },
    ],
    verification:
      '225 µV = 0.225 mV and 1 + 0.225 = 1.225 mV, matching the source’s stated 1.225 mV exactly.',
    interpretation:
      'Drift is the error you cannot calibrate out with a single trim, because it moves. That is what makes TC(VOS) more important than VOS in a product that sees temperature.',
  },
  {
    id: 'u1t3-p5',
    title: 'Problem 5 — CMRR error',
    provenance: 'insight',
    situation:
      'A non-inverting measurement amplifier has a common-mode input of 5 V and the device is specified at CMRR = 90 dB. Calculate the input-referred error, and state what happens for an inverting amplifier.',
    given: [
      { symbol: 'Vcm', value: '5 V' },
      { symbol: 'CMRR', value: '90 dB' },
    ],
    required: ['CMRR as a linear ratio', 'The input-referred error voltage', 'The case of the inverting amplifier'],
    assumptions: [
      'Source: 1/CMRR = dVOS/dVcm, specified in µV/V; CMRRdB = 20 log CMRR; 1/CMRR = 10^(−CMRRdB/20).',
      'Source: CMRR is no serious concern for the inverting amplifier because Vp is at 0 V.',
      'Engineering Insight: the numerical values here are constructed for practice.',
    ],
    steps: [
      {
        id: 'lin',
        ask: 'Step 1 — Convert 90 dB to a linear ratio.',
        concept: 'CMRRdB = 20 log₁₀(CMRR), so CMRR = 10^(CMRRdB/20).',
        equation: 'CMRR = 10^(CMRRdB/20)',
        substitution: 'CMRR = 10^(90/20) = 10^4.5 ≈ 31,623.',
        entries: [{ id: 'l1', label: 'CMRR (linear)', unit: 'V/V', answer: 31623, tolerance: 300 }],
        hints: [
          'Divide the dB figure by 20 first, then take the antilog.',
          '10^4.5 = 10^4 × √10 ≈ 31,623.',
        ],
        interpretation:
          'A 90 dB CMRR means the differential gain is about 31,600 times the common-mode gain.',
      },
      {
        id: 'err',
        ask: 'Step 2 — What input-referred error does a 5 V common-mode input produce?',
        concept: 'The source states 1/CMRR = dVOS/dVcm, so the error is Vcm/CMRR.',
        equation: 'Error = Vcm / CMRR',
        substitution: 'Error = 5 V / 31,623 = 158 µV.',
        entries: [{ id: 'e1', label: 'Input-referred error', unit: 'µV', answer: 158, tolerance: 5 }],
        hints: [
          'Divide the common-mode voltage by the linear CMRR.',
          '5 / 31623 = 1.58 × 10⁻⁴ V = 158 µV.',
        ],
        interpretation:
          '158 µV input-referred. Compare it with the device’s own VOS: if VOS is 30 µV, the CMRR error dominates and raising CMRR is worth more than lowering VOS.',
        whatIf:
          'At 60 dB (CMRR = 1000) the same 5 V gives 5 mV — thirty times worse.',
      },
      {
        id: 'inv',
        ask: 'Step 3 — Why does CMRR not matter for an inverting amplifier? Enter the common-mode voltage at the input of an inverting amplifier.',
        concept:
          'In the inverting configuration the non-inverting pin is grounded, and the inverting pin is a virtual earth, so both inputs sit near 0 V and Vcm ≈ 0.',
        equation: 'Vcm = (Vp + Vn)/2 with Vp = 0 V and Vn ≈ 0 V → Vcm ≈ 0 V',
        substitution: 'Vcm ≈ 0 V, so the CMRR error ≈ 0 V — the source states this explicitly.',
        entries: [{ id: 'i1', label: 'Vcm (inverting)', unit: 'V', answer: 0, tolerance: 0.01 }],
        hints: [
          'What is the voltage at the non-inverting pin of an inverting amplifier?',
          'It is grounded, and the inverting pin is a virtual earth — so both are near 0 V and Vcm ≈ 0.',
        ],
        interpretation:
          'This is a free design win: if your signal does not require a non-inverting input, the inverting topology removes the CMRR error term entirely. The source says exactly this.',
        whatIf:
          'In a non-inverting or differential amplifier the same signal does see a common-mode voltage, and CMRR becomes a specification that must be budgeted.',
      },
    ],
    verification:
      '20 log₁₀(31,623) = 90.0 dB ✓. 5 V / 31,623 = 1.58 × 10⁻⁴ V ✓.',
    interpretation:
      'CMRR is a topology-dependent error. Choosing the inverting configuration is often a cheaper way to remove it than buying a higher-CMRR part.',
  },
  {
    id: 'u1t3-p6',
    title: 'Problem 6 — Input bias-current drift in a JFET-input op-amp',
    provenance: 'source',
    situation:
      'A FET-input op-amp is rated IB = 1 pA at 25 °C. The source gives the rule of thumb that the reverse-bias current of a pn junction doubles for every 10 °C rise. Estimate IB at 100 °C.',
    given: [
      { symbol: 'IB at 25 °C', value: '1 pA' },
      { symbol: 'T', value: '100 °C' },
      { symbol: 'Rule (source)', value: 'IB doubles for every 10 °C increase' },
    ],
    required: ['The number of 10 °C steps', 'IB at 100 °C'],
    assumptions: [
      'Source rule: IB(T) = IB(T₀) × 2^((T − T₀)/10).',
      'This is the source’s own worked example.',
    ],
    steps: [
      {
        id: 'steps',
        ask: 'Step 1 — How many 10 °C steps are there between 25 °C and 100 °C?',
        concept: 'The doubling rule is applied once per 10 °C step, so count the steps first.',
        equation: 'n = (T − T₀)/10',
        substitution: 'n = (100 °C − 25 °C)/10 = 7.5 steps.',
        entries: [{ id: 's1', label: 'Number of steps', unit: '(count)', answer: 7.5, tolerance: 0.1 }],
        hints: ['Divide the temperature rise by 10.', '75 / 10 = 7.5.'],
        interpretation: 'Seven and a half doublings — the exponent is not required to be a whole number.',
      },
      {
        id: 'ib',
        ask: 'Step 2 — What is IB at 100 °C?',
        concept: 'IB(T) = IB(T₀) × 2^n.',
        equation: 'IB(100 °C) = 1 pA × 2^7.5',
        substitution: '2^7.5 ≈ 181, so IB = 181 pA = 0.18 nA — the source’s stated result.',
        entries: [{ id: 'i1', label: 'IB at 100 °C', unit: 'nA', answer: 0.18, tolerance: 0.01 }],
        hints: [
          '2^7 = 128 and 2^8 = 256, so 2^7.5 is about 181.',
          '181 pA = 0.181 nA.',
        ],
        interpretation:
          'A 181× increase in bias current. An electrometer design that is excellent at 25 °C can be useless at 100 °C — which is why the datasheet value alone is not enough.',
        whatIf:
          'For a bipolar-input device the trend is the opposite: IB tends to decrease with temperature because β increases.',
      },
    ],
    verification:
      '2^7.5 = e^(7.5 × 0.6931) = e^5.198 = 181 ✓, and 1 pA × 181 = 181 pA = 0.181 nA ≈ 0.18 nA ✓.',
    interpretation:
      'Direction of drift depends on the input technology. Know which way your device drifts before you promise a specification over temperature.',
  },
]

/* ------------------------------------------------------------------ */
/* Design challenge                                                    */
/* ------------------------------------------------------------------ */

export const OPAMP_DESIGN: DesignChallengeSpec = {
  id: 'u1t3-design-shunt-monitor',
  title: 'Design Challenge — Inverting amplifier for a 0 to 100 mV shunt',
  provenance: 'insight',
  requirement:
    'Design an inverting amplifier that maps a 0 to 100 mV shunt voltage to a 0 to −5 V output for an ADC, drives a 2 kΩ load, and keeps the total output error below 50 mV over 25 °C to 70 °C. The op-amp runs on ±15 V rails and has IQ = 0.5 mA.',
  constraints: [
    'Input: 0 to 100 mV. Required output: 0 to −5 V.',
    'Load: 2 kΩ to ground.',
    'Total output error at 70 °C: below 50 mV.',
    'Supply: ±15 V, IQ = 0.5 mA. Output must stay out of saturation.',
    'Cost target: use a general-purpose device if it meets the budget; justify any upgrade.',
  ],
  assumptions: [
    'Source relations are used for the supply currents and the saturation limit (±13 V on ±15 V rails).',
    'Source device tables are used for VOS, TC(VOS), IB and IOS.',
    'Engineering Insight: the requirement values, the error budget and the device-selection logic are constructed for practice.',
  ],
  checks: [
    {
      id: 'gain',
      label: 'Required gain and resistor ratio',
      ask: 'What closed-loop gain is required, and what must Rf/R1 be?',
      unit: 'V/V',
      accepted: ['-50', '50', 'rf/r1 = 50', 'av = -50, rf/r1 = 50'],
      hints: [
        'Hint 1 — The output span is 5 V for an input span of 100 mV. What ratio is that?',
        'Hint 2 — 5 V / 0.1 V = 50. The inverting configuration makes the gain negative.',
        'Hint 3 — Av = −50, so Rf/R1 = 50. The noise gain is 1 + 50 = 51.',
      ],
      rationale:
        'Av = −5 V / 0.1 V = −50, so Rf/R1 = 50. The noise gain is 51 — remember it is 1 + Rf/R1, not Rf/R1, and the noise gain is what multiplies the offset errors.',
    },
    {
      id: 'values',
      label: 'Practical resistor values',
      ask: 'Choose practical standard values for R1 and Rf from a 1% series.',
      unit: 'kΩ',
      accepted: [
        'r1 = 2 kΩ, rf = 100 kΩ',
        '2k and 100k',
        'r1 = 2k, rf = 100k',
        '2 kΩ / 100 kΩ',
      ],
      hints: [
        'Hint 1 — You need a ratio of 50 and you want the resistors small enough to keep the bias-current error low.',
        'Hint 2 — R1 = 2 kΩ is small enough not to load the shunt, and 50 × 2 kΩ = 100 kΩ is a standard value.',
        'Hint 3 — Check the input loading: a 2 kΩ input resistance across a 100 mV shunt is acceptable for most shunts, but verify against the shunt specification.',
      ],
      rationale:
        'R1 = 2 kΩ and Rf = 100 kΩ give exactly 50 and both are standard 1% values. Smaller values would reduce bias-current error further but load the shunt and the op-amp output more heavily; larger values would increase both the IOS error (Rf × IOS) and the noise.',
    },
    {
      id: 'offset',
      label: 'Offset error budget',
      ask: 'Using a 741 (VOS = 2 mV typical, TC = 5 µV/°C), what is the output error at 70 °C from offset alone? Is it within the 50 mV budget?',
      accepted: [
        'no',
        'not within budget',
        'about 113 mv — exceeds budget',
        '113 mv, fails',
        'fails',
      ],
      hints: [
        'Hint 1 — First find VOS at 70 °C: VOS(25 °C) + TC × 45 °C.',
        'Hint 2 — VOS(70 °C) = 2 mV + 5 µV/°C × 45 °C = 2 mV + 225 µV = 2.225 mV.',
        'Hint 3 — Multiply by the noise gain 51: 51 × 2.225 mV ≈ 113 mV. That is more than twice the 50 mV budget.',
      ],
      rationale:
        'VOS(70 °C) = 2.225 mV; with the noise gain of 51 the output error is about 113 mV. That is more than double the 50 mV budget, so a 741 cannot meet this requirement — the device, not the circuit, is the problem.',
    },
    {
      id: 'device',
      label: 'Device selection',
      ask: 'Which class of device meets the 50 mV budget, and what output error does it give?',
      accepted: [
        'op-07',
        'op77',
        'op-07 or op-77',
        'op-07: about 1.7 mv',
        'an op-07 class precision op-amp',
      ],
      hints: [
        'Hint 1 — You need VOS(70 °C) × 51 < 50 mV, so VOS(70 °C) must be below about 0.98 mV.',
        'Hint 2 — Look at the supplied device table: which parts have tens of microvolts of offset and a drift of a fraction of a µV/°C?',
        'Hint 3 — An OP-07 with VOS = 30 µV and TC = 0.5 µV/°C gives VOS(70 °C) ≈ 30 µV + 22.5 µV = 52.5 µV, and 51 × 52.5 µV ≈ 2.7 mV — well inside budget.',
      ],
      rationale:
        'An OP-07-class precision op-amp. With VOS = 30 µV typical and a drift of well under 1 µV/°C, the offset error at 70 °C is a few millivolts at most — comfortably inside 50 mV. The upgrade is justified by the error budget, not by preference.',
    },
    {
      id: 'power',
      label: 'Current and power check',
      ask: 'At full scale (Vo = −5 V) with a 2 kΩ load, what are ICC and IEE, and is the output inside saturation?',
      accepted: [
        'io = 2.5 ma, icc = 0.5 ma, iee = 3 ma, output fine',
        'icc = 0.5 ma, iee = 3 ma, not saturated',
        'io 2.5ma icc 0.5ma iee 3ma vo -5v within +-13v',
      ],
      hints: [
        'Hint 1 — Io = |Vo|/RL = 5 V / 2 kΩ.',
        'Hint 2 — Vo is negative, so which source relation applies? IEE = ICC + Io.',
        'Hint 3 — Io = 2.5 mA, ICC = IQ = 0.5 mA, IEE = 0.5 + 2.5 = 3.0 mA. |−5 V| is well inside the ±13 V limit.',
      ],
      rationale:
        'Io = 2.5 mA, ICC = 0.5 mA, IEE = 3.0 mA. The output at −5 V is well inside the ±13 V the source allows on ±15 V rails, so there is no saturation problem. Power drawn from the supplies = 15 × 0.5 + 15 × 3.0 = 52.5 mW, of which 12.5 mW goes to the load, leaving 40 mW dissipated in the op-amp.',
    },
  ],
  solution: [
    { label: 'Requirement', content: '0 to 100 mV in, 0 to −5 V out, 2 kΩ load, error below 50 mV from 25 °C to 70 °C, ±15 V rails, IQ = 0.5 mA.' },
    { label: 'Constraints', content: 'Gain, load, error budget over temperature, saturation headroom, device cost.' },
    { label: 'Topology', content: 'Inverting amplifier. Chosen because the non-inverting input is at 0 V, which removes the CMRR error term entirely (source), and because a negative gain is what the ADC mapping requires.' },
    { label: 'Gain', content: 'Av = −5 V / 0.1 V = −50, so Rf/R1 = 50 and the noise gain is 51.' },
    { label: 'Component selection', content: 'R1 = 2 kΩ, Rf = 100 kΩ (standard 1% values). Compensation resistor Rp = R1||Rf = 1.96 kΩ, so the IB term cancels and only Rf × IOS remains.' },
    {
      label: 'Error budget',
      content:
        '741: VOS(70 °C) = 2.225 mV → 51 × 2.225 mV ≈ 113 mV → FAILS. OP-07: VOS(70 °C) ≈ 52.5 µV → 51 × 52.5 µV ≈ 2.7 mV, plus Rf × IOS = 100 kΩ × 0.3 nA = 30 µV → PASSES with large margin.',
    },
    {
      label: 'Current check',
      content: 'Io = 2.5 mA, ICC = 0.5 mA, IEE = 3.0 mA. Power from supplies = 52.5 mW; load 12.5 mW; dissipated in the op-amp 40 mW.',
    },
    {
      label: 'Verification',
      content:
        'Output −5 V at full scale is inside ±13 V; the error budget is met by a factor of about 18; the input resistance of 2 kΩ must still be checked against the shunt’s own specification.',
    },
    {
      label: 'Possible failure modes',
      content:
        'Input loading of the shunt by R1; noise gain 51 amplifying not just VOS but also any pickup at the input; the compensation resistor omitted on the production schematic, reinstating the IB error; drift of the 1% resistors changing the gain.',
    },
    {
      label: 'Alternative',
      content:
        'Use a non-inverting topology with a rail-to-rail input device if the shunt must not be loaded, but then CMRR becomes a budget item and a higher-CMRR part is needed. The inverting topology is the cheaper route to the same accuracy here.',
    },
  ],
  failureModes: [
    'Omitting Rp and losing the factor-of-four improvement the compensation resistor provides.',
    'Using typical VOS instead of maximum VOS in a budget that must hold across a production batch.',
    'Designing the gain from Rf/R1 and then budgeting the error with Rf/R1 instead of 1 + Rf/R1.',
    'Checking gain and currents but never checking the saturation limit.',
    'Assuming the supply currents are equal in both rails.',
  ],
  interpretation:
    'The design sequence that works: gain → resistor values → error budget → device → current and power check. The error budget decides the device; the device should never be chosen first and justified afterwards.',
}

/* ------------------------------------------------------------------ */
/* Debugging cases                                                     */
/* ------------------------------------------------------------------ */

export const DEBUG_CASES3: DebugFault[] = [
  {
    id: 'u1t3-debug-saturated',
    title: 'Fault 1 — The gain is right but the output is stuck at −13 V',
    provenance: 'insight',
    symptom:
      'An inverting amplifier built with R1 = 10 kΩ and Rf = 200 kΩ is fed with Vi = 1 V. The expected output is −20 V. The measured output is −13.1 V and does not move when Vi is increased further. The resistor ratio has been checked with a multimeter and is correct.',
    measurements: [
      { label: 'Measured R1 / Rf', value: '10.0 kΩ / 200 kΩ — correct' },
      { label: 'Expected Vo from the ratio', value: '−20 V' },
      { label: 'Measured Vo', value: '−13.1 V (fixed, does not respond to further increase in Vi)' },
      { label: 'Supply rails at the pins', value: '+15.0 V and −15.0 V' },
      { label: 'Input Vi', value: '1.00 V DC' },
      { label: 'Load', value: '10 kΩ to ground' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The feedback resistor is the wrong value' },
      { id: 'h2', text: 'The op-amp output has saturated because the required output exceeds what the rails allow' },
      { id: 'h3', text: 'The op-amp is damaged' },
      { id: 'h4', text: 'The input offset voltage is very large' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Replace Rf with a larger value to get more gain' },
      { id: 'f2', text: 'Reduce the gain to bring the required output inside the rails, or increase the supply voltage' },
      { id: 'f3', text: 'Add a compensation resistor Rp' },
      { id: 'f4', text: 'Replace the op-amp with a precision device' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — The gain calculation is correct and the resistors measure correctly, so where else can the output be limited?',
      'Hint 2 — The source states that the output saturates below 2 V of VCC and VEE. What is the limit on ±15 V rails?',
      'Hint 3 — ±15 V rails give ±13 V, and the output is sitting at −13.1 V. The circuit is asking for −20 V from a supply that can only give −13 V.',
    ],
    rootCause:
      'Output saturation. The required output of −20 V is beyond what ±15 V rails can produce: the supplied material states that the output saturates below 2 V of VCC and VEE, giving ±13 V on ±15 V supplies. The measured −13.1 V is the saturated output, not an amplified signal, which is why it stops responding to further increases in Vi. Nothing is damaged and the resistor ratio is fine — the design simply asked for more output swing than the supply provides.',
    prevention:
      'Check the saturation limit before finalising any gain: compute the maximum output the largest expected input will demand, and compare it with (supply − 2 V) for a standard op-amp. If the required swing is close to the rails, either raise the supply, reduce the gain, or specify a rail-to-rail output device (the source notes that rail-to-rail CMOS parts give VOH = VCC and VOL = VEE with moderate loading).',
  },
  {
    id: 'u1t3-debug-offset',
    title: 'Fault 2 — 170 mV of output with the input grounded',
    provenance: 'insight',
    symptom:
      'A high-gain inverting stage (R1 = 22 kΩ, Rf = 2.2 MΩ) shows about 175 mV at the output with the input grounded. The schematic was copied from a reference design; the reference design shows a resistor from the non-inverting input to ground, and that resistor was left out because “it does not affect the gain”.',
    measurements: [
      { label: 'Output with input grounded', value: '+175 mV' },
      { label: 'R1 / Rf', value: '22 kΩ / 2.2 MΩ' },
      { label: 'Rp (non-inverting input to ground)', value: 'Not fitted — 0 Ω' },
      { label: 'Device', value: '741-class, IB = 80 nA, IOS = 20 nA' },
      { label: 'Device VOS measured separately', value: '≈ 1.7 mV' },
      { label: 'Supply', value: '±15 V, correct and decoupled' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The op-amp is oscillating' },
      { id: 'h2', text: 'The missing compensation resistor lets the input bias current produce a large differential error' },
      { id: 'h3', text: 'The feedback resistor is open circuit' },
      { id: 'h4', text: 'The input offset voltage is faulty' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Replace the op-amp with a faster one' },
      { id: 'f2', text: 'Fit Rp = R1||Rf ≈ 21.8 kΩ from the non-inverting input to ground' },
      { id: 'f3', text: 'Reduce the supply voltage' },
      { id: 'f4', text: 'Add a capacitor across Rf' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — The device VOS is only 1.7 mV. With a noise gain of 101 that accounts for about 172 mV... so is VOS really the dominant term?',
      'Hint 2 — Compare the size of IB (80 nA) with IOS (20 nA), and look at what resistance each input sees.',
      'Hint 3 — With Rp = 0 the IB term is unopposed: the source’s worked example gives 175 mV for exactly this case, falling to 44 mV when Rp = R1||R2.',
    ],
    rootCause:
      'The compensation resistor was omitted. With Rp = 0 the input bias current flowing through R1||Rf = 21.78 kΩ produces a differential error that the noise gain of 101 amplifies: 101 × 21.78 kΩ × 80 nA ≈ 176 mV, matching the measured 175 mV and the source’s own worked example. Fitting Rp = R1||Rf makes both inputs see the same resistance, so the equal parts of IB cancel and only the much smaller IOS term remains (Rf × IOS = 44 mV). The resistor “does not affect the gain” — it affects the error, which is a different specification.',
    prevention:
      'Always fit Rp = R1||Rf on bipolar-input designs, and mark it on the schematic as a required part rather than an optional one. Better still, reduce the resistances if the design allows it: the source’s example shows the error falling from 44 mV to 4.4 mV when all resistances are divided by ten.',
  },
]

/* ------------------------------------------------------------------ */
/* Question bank                                                       */
/* ------------------------------------------------------------------ */

const T = 'u1t3'

export const TOPIC3_QUESTIONS: Question[] = [
  /* ---------------- CONCEPTUAL (8) ---------------- */
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 2,
    skill: 'concept',
    action: 'Define',
    prompt: 'Define input offset voltage VOS as given in the supplied material, and write the expression that shows how it appears in the output equation.',
    hint: 'The source defines it as the input voltage needed to make the output zero.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'VOS is the input offset voltage needed at the input so that Vo = 0 V. The source writes the output as Vo = a[Vp + VOS − Vn].',
      },
      {
        label: 'Why it exists',
        content: 'Mismatch in the input transistors means a practical op-amp produces a non-zero output even when Vp = Vn.',
      },
    ],
    engineeringExplanation: 'Treat VOS as a small voltage source in series with one input. Everything else follows from that one picture.',
    provenance: 'source',
  },
  {
    id: `${T}-c2`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain why the output error due to VOS is multiplied by (1 + R2/R1) and not by the signal gain of the configuration.',
    hint: 'VOS is applied to the input pins. Which gain does the circuit apply to something at the input pins?',
    solution: [
      {
        label: 'Answer',
        content:
          'The source states that the offset-free op-amp acts as a non-inverting amplifier with respect to VOS. Anything appearing at the input pins is therefore amplified by the noise gain 1 + R2/R1, regardless of whether the signal enters at the inverting or the non-inverting terminal.',
      },
      {
        label: 'Consequence',
        content: 'For an inverting amplifier with signal gain −Rf/R1, the offset error still uses 1 + Rf/R1. At high gain the two are nearly equal; at low gain they are very different.',
      },
    ],
    engineeringExplanation: 'Using the signal gain instead of the noise gain is the single most common error-budget mistake in this topic.',
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
    prompt: 'Distinguish between input bias current IB and input offset current IOS, giving the defining expression for each.',
    hint: 'One is an average, the other a difference.',
    solution: [
      { label: 'IB (source)', content: 'The average of the two input currents: IB = (Ip + In)/2.' },
      { label: 'IOS (source)', content: 'The difference between them: IOS = Ip − In.' },
      {
        label: 'Why they differ',
        content: 'Mismatch in the β of the input stage means Ip ≠ In. The average is what the external circuit must supply; the difference is what becomes a differential error.',
      },
    ],
    engineeringExplanation: 'IB is cancelled by matching the resistances seen by both inputs; IOS cannot be cancelled that way — it can only be reduced by choosing a better device or smaller resistors.',
    provenance: 'source',
  },
  {
    id: `${T}-c4`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'State the supplied power-supply current relations for an op-amp, including the no-load case.',
    hint: 'Four statements: two about direction, two about magnitude.',
    solution: [
      {
        label: 'Answer (source)',
        content:
          'ICC always flows in the VCC terminal. IEE always flows out of the VEE terminal. ICC = Io + IEE at Vo positive, or IEE = ICC + Io at Vo negative. When Io = 0, ICC = IEE = IQ, the quiescent current required to bias the transistors inside the op-amp.',
      },
      {
        label: 'Key consequence',
        content: 'The rail carrying the load current is the one that grows; the other rail keeps carrying only IQ. The two supply currents are not equal when a load is driven.',
      },
    ],
    engineeringExplanation: 'This asymmetry is what the supplied assignment question tests. Sizing both rails identically is a real design error.',
    provenance: 'source',
  },
  {
    id: `${T}-c5`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'State the output saturation rule given in the supplied material, and give the two worked examples the source provides.',
    hint: 'The output never quite reaches the rails.',
    solution: [
      {
        label: 'Rule (source)',
        content: 'The op-amp output saturates below 2 V of VCC and VEE.',
      },
      {
        label: 'Examples (source)',
        content: 'For ±15 V the output is ±13 V. For ±9 V the output is ±7 V.',
      },
      {
        label: 'Exception (source)',
        content: 'Rail-to-rail op-amps, which are CMOS based and used with moderate loading, give VOH = VCC and VOL = VEE.',
      },
    ],
    engineeringExplanation: 'Check the saturation limit before trusting any gain calculation. A saturated output is why a measured gain so often disagrees with the resistor ratio.',
    provenance: 'source',
  },
  {
    id: `${T}-c6`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain what CMRR is, how it is expressed in dB, and why the source says it is no serious concern for the inverting amplifier.',
    hint: 'Think about the voltage at the two input pins in the inverting configuration.',
    solution: [
      {
        label: 'Definition (source)',
        content:
          'A practical op-amp responds to the differential input and also slightly to the common-mode input Vcm = (Vp + Vn)/2, giving Vo = a(Vp − Vn) + acm·Vcm. Also 1/CMRR = dVOS/dVcm, specifiable in µV/V.',
      },
      { label: 'In dB (source)', content: 'CMRRdB = 20 log CMRR, so 1/CMRR = 10^(−CMRRdB/20).' },
      {
        label: 'Inverting amplifier (source)',
        content: 'Vp is at 0 volts, so Vcm is approximately zero and the CMRR error is negligible.',
      },
      {
        label: 'Extra (source)',
        content: 'CMRR is frequency dependent and starts to roll off at 100 Hz.',
      },
    ],
    engineeringExplanation: 'The inverting topology is a free way to eliminate a whole error term. Use it whenever the signal does not require a high-impedance non-inverting input.',
    provenance: 'source',
  },
  {
    id: `${T}-c7`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain how the input bias current of a JFET-input op-amp and of a bipolar-input op-amp behave differently with temperature.',
    hint: 'One goes up, one goes down.',
    solution: [
      {
        label: 'JFET input (source)',
        content: 'IB increases exponentially with temperature. The rule of thumb is that the reverse-bias current of a pn junction doubles for every 10 °C rise.',
      },
      {
        label: 'Bipolar input (source)',
        content: 'IB tends to decrease with temperature, because β increases with temperature.',
      },
      {
        label: 'Design consequence',
        content: 'A JFET-input electrometer that is excellent at 25 °C can be unusable at 100 °C; the datasheet value alone does not describe the product.',
      },
    ],
    engineeringExplanation: 'Know the sign of the drift, not just its magnitude. It decides whether the worst case is at the hot end or the cold end.',
    provenance: 'source',
  },
  {
    id: `${T}-c8`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Justify',
    prompt: 'Why are ideal op-amp assumptions insufficient when you are asked for supply currents, power dissipation or output error?',
    hint: 'Name what the ideal model sets to zero or infinity, and note that every quantity asked about lives in that gap.',
    solution: [
      {
        label: 'Answer',
        content:
          'The ideal model has infinite input impedance, zero quiescent current, zero offset and no output limit. Supply current, dissipation, saturation and output error are all properties the ideal model sets to zero or ignores, so it cannot produce any of the answers required.',
      },
      {
        label: 'Practical list',
        content: 'Real parameters you must use instead: IQ for quiescent current, VOS and its drift for DC error, IB and IOS for bias error, CMRR for common-mode error, and the saturation limit for output swing.',
      },
    ],
    engineeringExplanation: 'Use the ideal model to get the topology and the gain. Switch to the practical model the moment the question asks for a current, a power or an error.',
    provenance: 'insight',
  },

  /* ---------------- NUMERICAL (12) ---------------- */
  {
    id: `${T}-n1`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'For the supplied problem (R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA), calculate Vo and the load current io, stating its direction.',
    hint: 'Av = −Rf/R1, then Io = Vo/RL.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA.' },
      { label: 'Equation', content: 'Av = −Rf/R1 ; Io = Vo/RL' },
      { label: 'Substitution', content: 'Av = −2, Vo = −6 V. Io = −6 V / 2 kΩ = −3 mA, i.e. 3 mA flowing into the op-amp.' },
      { label: 'Answer with unit', content: 'Vo = −6 V; io = 3 mA into the op-amp output.' },
      { label: 'Verification', content: '|−6 V| < 13 V on ±15 V rails, so the output is not saturated.' },
      { label: 'Interpretation', content: 'The negative sign sets which supply rail carries the load current in the next part of the question.' },
    ],
    engineeringExplanation: 'Always state the direction of io. It is the difference between the right answer and a mirrored one.',
    provenance: 'source',
  },
  {
    id: `${T}-n2`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'Continuing the supplied problem, calculate icc and iee. State which source relation you used and why.',
    hint: 'Vo is negative, so IEE = ICC + Io.',
    solution: [
      { label: 'Given', content: 'Vo = −6 V, Io = 3 mA, IQ = 0.5 mA.' },
      { label: 'Equation (source)', content: 'IEE = ICC + Io at Vo−, with ICC = IQ.' },
      { label: 'Substitution', content: 'ICC = 0.5 mA. IEE = 0.5 mA + 3 mA = 3.5 mA.' },
      { label: 'Answer with unit', content: 'icc = 0.5 mA, iee = 3.5 mA.' },
      { label: 'Verification', content: 'The relation checks: 3.5 = 0.5 + 3 ✓.' },
      { label: 'Interpretation', content: 'The negative rail carries seven times the current of the positive rail. Size the two supplies independently.' },
    ],
    engineeringExplanation: 'The rail that supplies the load current grows; the other keeps carrying IQ. Students who assume symmetry get both rails wrong.',
    provenance: 'source',
  },
  {
    id: `${T}-n3`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'For the supplied problem on ±15 V rails, calculate the power drawn from the supplies, the power delivered to the load, and the power dissipated inside the op-amp. State the assumption you are making.',
    hint: 'P_supply = VCC·ICC + |VEE|·IEE; P_load = |Vo|·Io; subtract.',
    solution: [
      { label: 'Given', content: 'ICC = 0.5 mA, IEE = 3.5 mA, Vo = −6 V, Io = 3 mA, rails assumed ±15 V.' },
      { label: 'Assumption', content: 'The assignment text does not give the rails; ±15 V is assumed because the source quotes it in its own saturation example. Declared explicitly.' },
      { label: 'Equation', content: 'P_supply = VCC·ICC + |VEE|·IEE ; PL = |Vo|·Io ; Pd = P_supply − PL' },
      { label: 'Substitution', content: 'P_supply = 7.5 + 52.5 = 60 mW. PL = 18 mW. Pd = 42 mW.' },
      { label: 'Answer with unit', content: '60 mW from the supplies, 18 mW to the load, 42 mW dissipated in the op-amp.' },
      { label: 'Verification', content: 'Energy balance: 18 + 42 = 60 mW ✓.' },
    ],
    engineeringExplanation: 'Write both power figures and say which definition you mean. If the examiner meant total supply power, 60 mW is the answer; if they meant device dissipation, it is 42 mW.',
    provenance: 'insight',
  },
  {
    id: `${T}-n4`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'Using the supplied device table, calculate the typical and maximum output error from VOS for a 741C with R1 = R2.',
    hint: 'Noise gain = 2; VOS typical 2 mV, maximum 6 mV.',
    solution: [
      { label: 'Given', content: 'R1 = R2 → noise gain = 2; VOS = 2 mV typical, 6 mV maximum.' },
      { label: 'Equation', content: 'Eo = (1 + R2/R1) × VOS' },
      { label: 'Substitution', content: 'Typical: 2 × 2 mV = 4 mV. Maximum: 2 × 6 mV = 12 mV.' },
      { label: 'Answer with unit', content: '±4 mV typical, ±12 mV maximum.' },
      { label: 'Verification', content: 'These are the source’s own figures for this case.' },
      { label: 'Interpretation', content: 'Even at a noise gain of only 2 the worst-case error is 12 mV — significant for any precision work.' },
    ],
    engineeringExplanation: 'Use the maximum value when the product must work across a batch; the typical value is for a feasibility estimate only.',
    provenance: 'source',
  },
  {
    id: `${T}-n5`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A 741C is used with R2 = 1000·R1. Calculate the typical and maximum output error from VOS, and comment on the result using the source’s own words.',
    hint: 'Noise gain = 1001.',
    solution: [
      { label: 'Given', content: 'Noise gain = 1001; VOS = 2 mV typical, 6 mV maximum.' },
      { label: 'Equation', content: 'Eo = 1001 × VOS' },
      { label: 'Substitution', content: 'Typical: 1001 × 2 mV ≈ 2 V. Maximum: 1001 × 6 mV ≈ 6 V.' },
      { label: 'Answer with unit', content: '±2 V typical, ±6 V maximum.' },
      { label: 'Verification', content: 'Scaling from the R1 = R2 case: 1001/2 = 500.5, and 4 mV × 500.5 = 2002 mV ✓.' },
      { label: 'Interpretation', content: 'The source calls ±6 V maximum “quite an error!”. On ±15 V rails the usable swing is ±13 V, so the worst case consumes nearly half of it before any signal is applied.' },
    ],
    engineeringExplanation: 'This is the worked illustration in the supplied material, and it is the argument for choosing a precision device at high gain.',
    provenance: 'source',
  },
  {
    id: `${T}-n6`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'R1 = 22 kΩ, R2 = 2.2 MΩ, IB = 80 nA, IOS = 20 nA. Calculate the output error with (a) Rp = 0 and (b) Rp = R1||R2. State the improvement factor.',
    hint: '(a) is dominated by the IB term; (b) collapses to R2 × IOS.',
    solution: [
      { label: 'Given', content: 'R1 = 22 kΩ, R2 = 2.2 MΩ, IB = 80 nA, IOS = 20 nA; noise gain = 101; R1||R2 = 21.78 kΩ.' },
      { label: 'Equation', content: '(a) Eo ≈ (1 + R2/R1)(R1||R2)·IB ; (b) Eo = R2 × IOS' },
      { label: 'Substitution', content: '(a) 101 × 21.78 kΩ × 80 nA ≈ 176 mV ≈ 175 mV. (b) 2.2 MΩ × 20 nA = 44 mV.' },
      { label: 'Answer with unit', content: '(a) ≈ 175 mV; (b) 44 mV; improvement factor ≈ 4.' },
      { label: 'Verification', content: 'Both match the source’s worked example.' },
      { label: 'Interpretation', content: 'One 21.8 kΩ resistor buys a factor of four. There is no cheaper error reduction in this topic.' },
    ],
    engineeringExplanation: 'The compensation resistor does not reduce IB — it stops IB from becoming a differential error.',
    provenance: 'source',
  },
  {
    id: `${T}-n7`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'In the source’s worked example, all resistances are reduced by a factor of 10 and the device is changed to one with IOS = 3 nA. Calculate the output error in both cases and the total improvement from the original 175 mV.',
    hint: 'With Rp matched, Eo = R2 × IOS.',
    solution: [
      { label: 'Given', content: 'R2 becomes 220 kΩ; IOS = 20 nA then 3 nA.' },
      { label: 'Equation', content: 'Eo = R2 × IOS (Rp matched)' },
      { label: 'Substitution', content: '(c) 220 kΩ × 20 nA = 4.4 mV. (d) 220 kΩ × 3 nA = 0.66 mV ≈ 0.7 mV.' },
      { label: 'Answer with unit', content: '4.4 mV and 0.7 mV; total improvement 175/0.7 ≈ 250×.' },
      { label: 'Verification', content: 'Each step matches the source’s stated sequence 175 → 44 → 4.4 → 0.7 mV.' },
      { label: 'Interpretation', content: 'Three independent levers, 250× improvement, no change to the topology.' },
    ],
    engineeringExplanation: 'Quote this sequence in a design viva: it shows you know there is more than one way to reduce an error, and what each costs.',
    provenance: 'source',
  },
  {
    id: `${T}-n8`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'An op-amp has VOS(25 °C) = 1 mV and TC(VOS)avg = 5 µV/°C. Calculate VOS at 70 °C.',
    hint: 'ΔT = 45 °C.',
    solution: [
      { label: 'Given', content: 'VOS(25 °C) = 1 mV, TC = 5 µV/°C, T = 70 °C.' },
      { label: 'Equation', content: 'VOS(T) = VOS(25 °C) + TC(VOS) × (T − 25 °C)' },
      { label: 'Substitution', content: 'VOS = 1 mV + 5 µV/°C × 45 °C = 1 mV + 225 µV = 1.225 mV.' },
      { label: 'Answer with unit', content: '1.225 mV.' },
      { label: 'Verification', content: '225 µV = 0.225 mV ✓ — this is the source’s own example.' },
      { label: 'Interpretation', content: 'A 22.5% increase from temperature alone, before any other error is considered.' },
    ],
    engineeringExplanation: 'Drift cannot be removed by a single trim because it moves. That is what makes TC(VOS) more important than VOS over temperature.',
    provenance: 'source',
  },
  {
    id: `${T}-n9`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A non-inverting stage has Vcm = 5 V and the device CMRR is 90 dB. Calculate the input-referred error in µV.',
    hint: 'CMRR = 10^(90/20), then error = Vcm/CMRR.',
    solution: [
      { label: 'Given', content: 'Vcm = 5 V, CMRR = 90 dB.' },
      { label: 'Equation (source)', content: '1/CMRR = 10^(−CMRRdB/20); error = Vcm/CMRR' },
      { label: 'Substitution', content: 'CMRR = 10^4.5 ≈ 31,623. Error = 5 / 31,623 V = 1.58 × 10⁻⁴ V = 158 µV.' },
      { label: 'Answer with unit', content: '158 µV.' },
      { label: 'Verification', content: '20 log₁₀(31,623) = 90.0 dB ✓.' },
      { label: 'Interpretation', content: 'Compare with the device VOS: if VOS is 30 µV, the CMRR term is five times larger and dominates the error budget.' },
    ],
    engineeringExplanation: 'Always convert dB to a linear ratio before you divide. Working in dB and then dividing by a voltage is a guaranteed wrong answer.',
    provenance: 'insight',
  },
  {
    id: `${T}-n10`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A FET-input op-amp is rated IB = 1 pA at 25 °C. Using the source rule, estimate IB at 100 °C and express it in nA.',
    hint: 'Count the 10 °C doublings first.',
    solution: [
      { label: 'Given', content: 'IB(25 °C) = 1 pA, T = 100 °C.' },
      { label: 'Equation (source)', content: 'IB(T) = IB(T₀) × 2^((T − T₀)/10)' },
      { label: 'Substitution', content: 'n = (100 − 25)/10 = 7.5. IB = 1 pA × 2^7.5 = 1 pA × 181 = 181 pA = 0.18 nA.' },
      { label: 'Answer with unit', content: '0.18 nA.' },
      { label: 'Verification', content: '2^7.5 = e^5.198 ≈ 181 ✓ — the source’s own result.' },
      { label: 'Interpretation', content: 'A 181× increase. An electrometer design that works at 25 °C may be useless at 100 °C.' },
    ],
    engineeringExplanation: 'Check the technology: bipolar inputs drift the other way, because β rises with temperature.',
    provenance: 'source',
  },
  {
    id: `${T}-n11`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'An inverting amplifier has R1 = 10 kΩ, Rf = 100 kΩ and drives a 2 kΩ load with IQ = 0.6 mA on ±15 V rails. With Vi = −1 V, calculate Vo, io, icc, iee and the power dissipated inside the op-amp.',
    hint: 'Vo is positive here, so ICC carries the load current.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ, Rf = 100 kΩ, Vi = −1 V, RL = 2 kΩ, IQ = 0.6 mA, ±15 V.' },
      { label: 'Equation', content: 'Av = −Rf/R1; Io = Vo/RL; ICC = Io + IEE (Vo+); IEE = IQ; Pd = P_supply − PL' },
      { label: 'Substitution', content: 'Av = −10, Vo = +10 V. Io = 10/2k = 5 mA. IEE = 0.6 mA, ICC = 0.6 + 5 = 5.6 mA. P_supply = 15(5.6) + 15(0.6) = 84 + 9 = 93 mW. PL = 50 mW. Pd = 43 mW.' },
      { label: 'Answer with unit', content: 'Vo = +10 V, io = 5 mA, icc = 5.6 mA, iee = 0.6 mA, Pd = 43 mW.' },
      { label: 'Verification', content: 'Saturation check: |10 V| < 13 V ✓. Energy: 50 + 43 = 93 mW ✓.' },
      { label: 'Interpretation', content: 'Note that Vo = +10 V is close to the 13 V limit — at Vi = −1.5 V this circuit would saturate.' },
    ],
    engineeringExplanation: 'The same problem with the opposite input polarity exercises the other supply relation. Practise both.',
    provenance: 'insight',
  },
  {
    id: `${T}-n12`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'An OP-77 (IB = 1.2 nA typical, IOS = 0.3 nA typical) is used with R1 = 10 kΩ and Rf = 1 MΩ with Rp matched. Calculate the output error from the bias currents, and compare it with the same circuit built with a 741 (IB = 80 nA, IOS = 20 nA).',
    hint: 'With Rp matched, Eo = Rf × IOS.',
    solution: [
      { label: 'Given', content: 'Rf = 1 MΩ. OP-77: IOS = 0.3 nA. 741: IOS = 20 nA. Rp = R1||Rf.' },
      { label: 'Equation (source)', content: 'With Rp = R1||Rf, Eo = Rf × IOS' },
      { label: 'Substitution', content: 'OP-77: 1 MΩ × 0.3 nA = 0.3 mV. 741: 1 MΩ × 20 nA = 20 mV.' },
      { label: 'Answer with unit', content: '0.3 mV for the OP-77; 20 mV for the 741 — about 67× worse.' },
      { label: 'Verification', content: 'R1||Rf = 10 kΩ||1 MΩ = 9.9 kΩ, so the matched condition is satisfied and the IB term cancels in both cases.' },
      { label: 'Interpretation', content: 'Matching Rp removes the IB advantage entirely; what remains is the IOS difference, which is where the better device earns its cost.' },
    ],
    engineeringExplanation: 'Once Rp is matched, IB stops mattering and IOS becomes the specification to buy. That is a genuinely non-obvious design conclusion.',
    provenance: 'source',
  },

  /* ---------------- CIRCUIT ANALYSIS (8) ---------------- */
  {
    id: `${T}-a1`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse the supplied inverting amplifier (R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA) on ±15 V rails: give Vo, io, icc, iee, the power drawn from the supplies and the power dissipated inside the op-amp, with the saturation check.',
    hint: 'Work in the order: gain → load current → supply currents → power → saturation check.',
    solution: [
      { label: 'Gain and output', content: 'Av = −20/10 = −2; Vo = −6 V.' },
      { label: 'Load current', content: 'Io = 6 V / 2 kΩ = 3 mA, flowing into the op-amp (Vo negative).' },
      { label: 'Supply currents', content: 'Vo negative → IEE = ICC + Io. ICC = IQ = 0.5 mA, IEE = 3.5 mA.' },
      { label: 'Power', content: 'P_supply = 15(0.5) + 15(3.5) = 60 mW. PL = 6 × 3 = 18 mW. Pd = 42 mW.' },
      { label: 'Saturation check (source)', content: 'On ±15 V rails the limit is ±13 V; |−6 V| is well inside it, so the analysis is valid.' },
      { label: 'Assumption', content: 'Rails not given in the assignment; ±15 V assumed from the source’s own example.' },
    ],
    engineeringExplanation: 'This is the complete supplied problem in one pass. Notice that the power question cannot be answered at all without declaring the rails.',
    provenance: 'source',
  },
  {
    id: `${T}-a2`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'For the same amplifier, analyse the effect of reversing the input to Vi = −3 V. Give Vo, io, icc and iee and explain which rail now carries the load current and why.',
    hint: 'Vo becomes positive, so the op-amp sources current.',
    solution: [
      { label: 'Gain and output', content: 'Av = −2; Vo = −2 × (−3 V) = +6 V.' },
      { label: 'Load current', content: 'Io = 6 V / 2 kΩ = 3 mA, flowing out of the op-amp into the load (the op-amp sources it).' },
      { label: 'Supply currents', content: 'Vo positive → ICC = Io + IEE. IEE = IQ = 0.5 mA, ICC = 3.5 mA.' },
      { label: 'Answer with unit', content: 'Vo = +6 V, io = 3 mA out, icc = 3.5 mA, iee = 0.5 mA.' },
      { label: 'Why', content: 'When the output sources current, that current is drawn from the positive rail; when it sinks current, it leaves through the negative rail. The other rail keeps carrying only IQ.' },
    ],
    engineeringExplanation: 'The two cases are mirror images. Being able to state which rail carries the load without hesitating is the practical skill here.',
    provenance: 'source',
  },
  {
    id: `${T}-a3`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse what happens to the supplied amplifier when the load is removed entirely. Give icc, iee and explain using the source relation.',
    hint: 'The source states this case explicitly.',
    solution: [
      { label: 'Given', content: 'No load, so Io = 0 mA; IQ = 0.5 mA.' },
      { label: 'Equation (source)', content: 'When Io = 0, ICC = IEE = IQ.' },
      { label: 'Substitution', content: 'ICC = IEE = 0.5 mA.' },
      { label: 'Answer with unit', content: 'icc = iee = 0.5 mA; on ±15 V rails the dissipation is 15(0.5) + 15(0.5) = 15 mW.' },
      { label: 'Interpretation', content: 'The quiescent current is the floor. Any measurement below it means the device is not powered or is faulty.' },
    ],
    engineeringExplanation: 'Measuring the no-load supply current is the quickest way to confirm a device is alive and correctly biased.',
    provenance: 'source',
  },
  {
    id: `${T}-a4`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'R1 = 22 kΩ, Rf = 2.2 MΩ, IB = 80 nA, IOS = 20 nA, Rp omitted. Analyse the output error: state which term dominates, compute it, and explain what the compensation resistor changes.',
    hint: 'With Rp = 0 the IB term is unopposed.',
    solution: [
      { label: 'Network values', content: 'R1||Rf = 21.78 kΩ; noise gain = 101.' },
      { label: 'Dominant term', content: 'IB: 101 × 21.78 kΩ × 80 nA ≈ 176 mV ≈ 175 mV.' },
      { label: 'With Rp = R1||Rf', content: 'The IB term cancels and Eo = Rf × IOS = 2.2 MΩ × 20 nA = 44 mV.' },
      { label: 'Answer with unit', content: '175 mV uncompensated, 44 mV compensated — a factor of 4.' },
      { label: 'Interpretation', content: 'Matching the resistance seen by both inputs converts an IB error into an IOS error. IB is the average of the two input currents; IOS is only their mismatch.' },
    ],
    engineeringExplanation: 'This is the source’s worked example, and it is the standard exam question on bias currents.',
    provenance: 'source',
  },
  {
    id: `${T}-a5`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'An inverting amplifier with R1 = 1 kΩ and Rf = 1 MΩ shows +40 mV at the output with the input grounded. Analyse what this tells you about the device.',
    hint: 'Divide the output error by the noise gain to get the input-referred offset.',
    solution: [
      { label: 'Given', content: 'Rf/R1 = 1000, so noise gain = 1001; Eo = 40 mV.' },
      { label: 'Equation', content: 'VOS(effective) = Eo / noise gain' },
      { label: 'Substitution', content: 'VOS(effective) = 40 mV / 1001 = 39.96 µV ≈ 40 µV.' },
      { label: 'Answer with unit', content: 'About 40 µV input-referred.' },
      { label: 'Interpretation', content: 'A 741 (VOS ≈ 2 mV) would give about 2 V here, so the device is an OP-07-class precision part (30 µV typical). The circuit is behaving correctly — 40 µV of offset amplified 1001 times is 40 mV.' },
    ],
    engineeringExplanation: 'Work backwards from the measured error to the input-referred value. It is the fastest way to decide whether a circuit is faulty or merely imperfect.',
    provenance: 'insight',
  },
  {
    id: `${T}-a6`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse an inverting amplifier with R1 = 10 kΩ, Rf = 200 kΩ, Vi = 1 V on ±15 V rails. Determine whether the expected output is achievable, and state what the output will actually be.',
    hint: 'Compute the ideal output, then compare it with the saturation limit.',
    solution: [
      { label: 'Given', content: 'R1 = 10 kΩ, Rf = 200 kΩ, Vi = 1 V, ±15 V rails.' },
      { label: 'Equation', content: 'Vo = −(Rf/R1)·Vi; saturation limit = ±(VCC − 2 V)' },
      { label: 'Substitution', content: 'Ideal Vo = −20 × 1 = −20 V. Limit on ±15 V rails = ±13 V.' },
      { label: 'Answer with unit', content: 'Not achievable. The output saturates at approximately −13 V.' },
      { label: 'Interpretation', content: 'The output no longer responds to the input, so the gain appears to collapse. Any further calculation assuming −20 V is invalid.' },
    ],
    engineeringExplanation: 'Check saturation before quoting any gain or power figure. It costs five seconds and prevents the most common wrong answer in the topic.',
    provenance: 'source',
  },
  {
    id: `${T}-a7`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt: 'Analyse whether CMRR needs to be considered for (a) an inverting amplifier and (b) a non-inverting amplifier with a 5 V common-mode input. Justify using the source statement.',
    hint: 'What is the voltage at the non-inverting pin in each case?',
    solution: [
      { label: 'Inverting', content: 'Vp = 0 V and Vn is a virtual earth, so Vcm ≈ 0 V. The source states that CMRR is no serious concern for the inverting amplifier.' },
      { label: 'Non-inverting with 5 V common mode', content: 'Both inputs sit near 5 V, so Vcm ≈ 5 V and the error is Vcm/CMRR — 158 µV at 90 dB, or 1.58 mV at 70 dB.' },
      { label: 'Answer with unit', content: '(a) negligible; (b) must be budgeted — 158 µV at 90 dB.' },
      { label: 'Extra (source)', content: 'CMRR is frequency dependent and starts to roll off at 100 Hz, so the figure at the signal frequency may be worse than the DC figure.' },
    ],
    engineeringExplanation: 'Topology choice is an error-reduction technique. Choosing inverting eliminates a whole error term for free.',
    provenance: 'source',
  },
  {
    id: `${T}-a8`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse the thermal behaviour of a 741-based amplifier with noise gain 101 over 25 °C to 70 °C, using the supplied drift figure. Give the change in output error.',
    hint: 'Find ΔVOS from TC(VOS) × 45 °C, then multiply by the noise gain.',
    solution: [
      { label: 'Given', content: 'TC(VOS) = 5 µV/°C (741 typical); ΔT = 45 °C; noise gain = 101.' },
      { label: 'Equation', content: 'ΔVOS = TC(VOS) × ΔT; ΔEo = noise gain × ΔVOS' },
      { label: 'Substitution', content: 'ΔVOS = 225 µV = 0.225 mV. ΔEo = 101 × 0.225 mV = 22.7 mV.' },
      { label: 'Answer with unit', content: '22.7 mV of output wander over the range.' },
      { label: 'Interpretation', content: 'An OP-77 with TC = 0.1 µV/°C would wander only about 0.45 mV — fifty times less.' },
    ],
    engineeringExplanation: 'A single trim cannot remove drift. Either buy a low-drift device or design in periodic auto-zero.',
    provenance: 'source',
  },

  /* ---------------- CIRCUIT DESIGN (5) ---------------- */
  {
    id: `${T}-d1`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt: 'Design an inverting amplifier with a gain of −25 driving a 2 kΩ load on ±15 V rails with IQ = 0.5 mA. Choose standard resistor values, state the maximum input before saturation, and give icc and iee at that input.',
    hint: 'Pick a ratio of 25, then work out the input at which Vo reaches −13 V.',
    solution: [
      { label: 'Requirement', content: 'Av = −25, RL = 2 kΩ, ±15 V, IQ = 0.5 mA.' },
      { label: 'Component selection', content: 'R1 = 4 kΩ (use 3.9 kΩ + 100 Ω, or 4.02 kΩ 1%) and Rf = 100 kΩ give a ratio of 25. Simplest: R1 = 4 kΩ, Rf = 100 kΩ.' },
      { label: 'Saturation limit', content: 'Vo saturates at −13 V, so Vi(max) = 13/25 = 0.52 V.' },
      { label: 'Currents at that input', content: 'Io = 13 V / 2 kΩ = 6.5 mA. Vo negative → IEE = ICC + Io, so ICC = 0.5 mA and IEE = 7.0 mA.' },
      { label: 'Answer with unit', content: 'R1 = 4 kΩ, Rf = 100 kΩ; Vi(max) = 0.52 V; icc = 0.5 mA, iee = 7.0 mA at that input.' },
      { label: 'Verification', content: 'P_supply = 15(0.5) + 15(7.0) = 112.5 mW; PL = 13 × 6.5 = 84.5 mW; Pd = 28 mW — plausible for a small package.' },
    ],
    engineeringExplanation: 'Always derive the maximum input from the saturation limit, not from the gain. It is the specification the customer will actually hit.',
    provenance: 'insight',
  },
  {
    id: `${T}-d2`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt: 'Design a gain-of-100 inverting stage whose total output error from VOS must stay below 20 mV over 25 °C to 70 °C. Select the device from the supplied table and justify the choice with numbers.',
    hint: 'Noise gain is 101; find the allowed VOS(70 °C), then check which device and drift fit.',
    solution: [
      { label: 'Requirement', content: 'Noise gain = 101; Eo < 20 mV from 25 °C to 70 °C.' },
      { label: 'Allowed offset', content: 'VOS(70 °C) < 20 mV / 101 = 198 µV.' },
      { label: '741 check', content: 'VOS(70 °C) = 2 mV + 5 µV/°C × 45 °C = 2.225 mV → 225 mV of error. Fails by a factor of 11.' },
      { label: 'OP-07 / OP-77 check', content: 'OP-07: 30 µV + negligible drift → about 3 mV. OP-77: 10 µV + 0.1 µV/°C × 45 = 14.5 µV → about 1.5 mV. Both pass comfortably.' },
      { label: 'Selection', content: 'OP-77 for the largest margin; OP-07 if cost matters. Justify from the numbers, not from preference.' },
    ],
    engineeringExplanation: 'An error budget selects the device. Choosing the device first and then hoping the budget holds is the reverse of engineering.',
    provenance: 'insight',
  },
  {
    id: `${T}-d3`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Select',
    prompt: 'You need to amplify a 10 mV signal from a high-impedance sensor with a gain of 100. Compare a 741 and an OP-77 for this application and state which you would use and why.',
    hint: 'Consider VOS, IB, IOS and what a high source impedance does to the bias-current error.',
    solution: [
      { label: 'VOS comparison (source)', content: '741: 2 mV typical, 6 mV max. OP-77: 10 µV typical, 50 µV max. On a 10 mV signal the 741’s worst-case offset is 60% of the signal itself.' },
      { label: 'Bias comparison (source)', content: '741: IB = 80 nA typical, 500 nA max. OP-77: IB = 1.2 nA typical, 2 nA max.' },
      { label: 'High source impedance', content: 'With a 100 kΩ source, the 741’s bias current alone develops 100 kΩ × 500 nA = 50 mV of error — five times the signal. The OP-77 develops 0.2 mV.' },
      { label: 'Selection', content: 'OP-77, by a wide margin. The 741 is not usable for a 10 mV high-impedance signal.' },
    ],
    engineeringExplanation: 'High source impedance turns bias current into a voltage error. Match the input technology to the source impedance first, then worry about offset.',
    provenance: 'source',
  },
  {
    id: `${T}-d4`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt: 'Design the supply and decoupling arrangement for a board containing several op-amps on ±15 V, using the guidance in the supplied material.',
    hint: 'The source names two capacitor types and their locations.',
    solution: [
      { label: 'Bulk decoupling (source)', content: '10 µF polarised capacitors at the power supply entry.' },
      { label: 'Local decoupling (source)', content: '0.1 µF ceramic capacitors at the VCC and VEE pins of the op-amp, mounted in the very close vicinity of the op-amp.' },
      { label: 'Why both', content: 'The bulk capacitor handles low-frequency supply variation and wiring inductance; the local ceramic handles the high-frequency current spikes the op-amp draws when its output switches. The local part is ineffective if it is not physically close — the trace inductance defeats it.' },
      { label: 'Current rating', content: 'Size the supply for the sum of the worst-case rail currents, remembering that ICC and IEE are unequal when loads are driven.' },
    ],
    engineeringExplanation: 'Decoupling is the cheapest reliability measure on the board. The source’s instruction to mount the ceramic “in very close vicinity” is a layout requirement, not a suggestion.',
    provenance: 'source',
  },
  {
    id: `${T}-d5`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt: 'Design an error-reduction plan for a gain-of-1000 DC amplifier. List every lever available, what each one costs, and the order in which you would apply them.',
    hint: 'The source’s worked example shows three levers in action.',
    solution: [
      { label: 'Lever 1 — compensation resistor', content: 'Fit Rp = R1||Rf. Cancels the IB term; the source’s example shows 175 mV → 44 mV. Costs one resistor.' },
      { label: 'Lever 2 — reduce resistances', content: 'Since Eo = Rf × IOS once Rp is matched, scaling all resistances down by 10 scales the error down by 10 (44 mV → 4.4 mV). Costs supply current and output drive capability.' },
      { label: 'Lever 3 — better device', content: 'A lower-IOS device reduces the residual (4.4 mV → 0.7 mV in the source example). Costs money per unit.' },
      { label: 'Lever 4 — temperature', content: 'Choose a low-TC(VOS) device if the product sees temperature, because drift cannot be trimmed out.' },
      { label: 'Order', content: 'Rp first (nearly free), then resistance scaling if the power budget allows, then the device. Topology last — if the signal allows, an inverting stage also removes the CMRR term.' },
    ],
    engineeringExplanation: 'Apply the cheapest lever first and stop when the budget is met. That is what an experienced engineer does; buying the most expensive part first is what a beginner does.',
    provenance: 'source',
  },

  /* ---------------- DEBUGGING / WHAT-IF (4) ---------------- */
  {
    id: `${T}-w1`,
    topicId: T,
    type: 'debugging',
    level: 5,
    marks: 5,
    skill: 'debugging',
    action: 'Debug',
    prompt:
      'An inverting amplifier with R1 = 10 kΩ and Rf = 200 kΩ fed with Vi = 1 V measures −13.1 V instead of −20 V, and the output stops responding when Vi is increased. The resistors measure correctly. Diagnose and fix.',
    hint: 'Compare the demanded output with what ±15 V rails can deliver.',
    solution: [
      { label: 'Symptom', content: 'Output pinned at about −13 V, unresponsive to further input increase.' },
      { label: 'Analysis', content: 'Ideal Vo = −20 V. The source states the output saturates below 2 V of the rails, giving ±13 V on ±15 V supplies.' },
      { label: 'Diagnosis', content: 'Output saturation — the circuit is demanding more swing than the supply provides. Nothing is faulty.' },
      { label: 'Fix', content: 'Reduce the gain so the maximum expected input stays inside ±13 V, raise the supply rails, or specify a rail-to-rail output device.' },
      { label: 'Prevention', content: 'Compute the maximum demanded output during design and compare it with (supply − 2 V) before finalising the gain.' },
    ],
    engineeringExplanation: 'Saturation is not a fault in the device — it is a fault in the design. The measurement is telling you the requirement and the supply disagree.',
    provenance: 'source',
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
      'A high-gain inverting stage (R1 = 22 kΩ, Rf = 2.2 MΩ, 741) shows +175 mV at the output with the input grounded. The compensation resistor was omitted because “it does not affect the gain”. Find the error and quantify the fix.',
    hint: 'The statement is true about gain and false about error.',
    solution: [
      { label: 'Check VOS alone', content: 'A 741 VOS of about 1.7 mV with a noise gain of 101 gives about 172 mV — suspiciously close to the measured 175 mV, but the dominant term is the unopposed IB term.' },
      { label: 'Analysis', content: 'With Rp = 0: 101 × 21.78 kΩ × 80 nA ≈ 176 mV. With Rp = R1||Rf: Eo = Rf × IOS = 2.2 MΩ × 20 nA = 44 mV.' },
      { label: 'Diagnosis', content: 'The missing compensation resistor lets the input bias current develop a differential error that the noise gain amplifies.' },
      { label: 'Fix', content: 'Fit Rp = R1||Rf ≈ 21.8 kΩ — a factor-of-four improvement for one resistor.' },
      { label: 'Prevention', content: 'Mark Rp as a required part on the schematic and in the BOM, not as an optional component.' },
    ],
    engineeringExplanation: '“It does not affect the gain” is true — and irrelevant. The gain and the error are different specifications with different sensitivities.',
    provenance: 'source',
  },
  {
    id: `${T}-w3`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Predict',
    prompt: 'Predict what happens to icc and iee in the supplied amplifier if Vi is changed from +3 V to −3 V, and explain why using the source relations.',
    hint: 'The output polarity reverses, so the sourcing/sinking role reverses.',
    solution: [
      { label: 'At Vi = +3 V', content: 'Vo = −6 V, the op-amp sinks 3 mA: ICC = IQ = 0.5 mA, IEE = 3.5 mA.' },
      { label: 'At Vi = −3 V', content: 'Vo = +6 V, the op-amp sources 3 mA: ICC = 3.5 mA, IEE = IQ = 0.5 mA.' },
      { label: 'Answer with unit', content: 'The two supply currents swap: icc goes 0.5 → 3.5 mA and iee goes 3.5 → 0.5 mA.' },
      { label: 'Interpretation', content: 'The source relations ICC = Io + IEE at Vo+ and IEE = ICC + Io at Vo− are mirror images. Whichever rail supplies the load current carries IQ + Io.' },
    ],
    engineeringExplanation: 'If your design only ever sources current, only the positive rail needs to be sized for load. Real signals usually do both.',
    provenance: 'source',
  },
  {
    id: `${T}-w4`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Predict',
    prompt: 'Predict the effect on the output error of halving the closed-loop gain of a DC amplifier, and state the cheapest way to reduce offset error in general.',
    hint: 'Every input-referred error is multiplied by the noise gain.',
    solution: [
      { label: 'Prediction', content: 'Halving the gain halves the noise gain (approximately), so every input-referred error — VOS, drift, bias terms — appears at half its previous value at the output.' },
      { label: 'Numbers', content: 'At a noise gain of 101 a 2 mV offset gives 202 mV; at 51 it gives 102 mV.' },
      { label: 'Cheapest reduction', content: 'Fit the compensation resistor Rp = R1||Rf — one resistor for a factor of about four — then reduce resistor values, then change the device.' },
      { label: 'Caveat', content: 'Reducing gain is only available if the system can tolerate a smaller output signal, which usually means the signal-to-noise ratio suffers downstream.' },
    ],
    engineeringExplanation: 'Gain reduction is not free — it moves the problem downstream to the next stage. Use it only when the following stage has noise to spare.',
    provenance: 'insight',
  },

  /* ---------------- VIVA (5) ---------------- */
  {
    id: `${T}-v1`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why can a small input offset voltage become a large output error?',
    hint: 'What multiplies it?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because VOS appears in series with the input, so the circuit applies its noise gain 1 + R2/R1 to it exactly as it does to the signal. At a gain of 1000, a 2 mV offset becomes about 2 V at the output. The error is not created by the gain — it is amplified by it.',
      },
    ],
    engineeringExplanation: 'The follow-up always comes: “what is the noise gain, not the signal gain?” Know the difference.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Why is the factor 1 + R2/R1 and not R2/R1?',
        expected:
          'Because the source states that the offset-free op-amp acts as a non-inverting amplifier with respect to VOS. The offset appears between the input pins, so the circuit treats it as a non-inverting input signal.',
      },
      {
        teacher: 'How would you reduce it without changing the device?',
        expected:
          'Reduce the gain if the system allows it, reduce the resistor values, or use a topology with a lower noise gain. If the offset itself must be attacked, use a device with lower VOS or add offset-null/trim.',
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
    prompt: 'Why does fitting a compensation resistor Rp = R1||Rf reduce the output error?',
    hint: 'IB is an average; IOS is a difference.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'IB is the average of the two input currents. If both inputs see the same resistance to ground, the equal parts of IB develop equal voltages at both inputs and cancel as a differential error. What remains is only the mismatch between the two currents, IOS, giving Eo = Rf × IOS. The resistor does not reduce IB — it stops IB from becoming a differential error.',
      },
    ],
    engineeringExplanation: 'The strongest answer adds the number: in the source’s example the error falls from 175 mV to 44 mV.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'What if Rp is 10% wrong?',
        expected:
          'The cancellation is imperfect and about 10% of the IB term reappears — roughly 17 mV in the source example, comparable to the IOS term. Precision resistors matter here.',
      },
      {
        teacher: 'Does it help if I only care about IOS?',
        expected:
          'No. Matching Rp removes the IB term; IOS is unaffected. To reduce the IOS term you need smaller resistors or a better device.',
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
    action: 'Explain why',
    prompt: 'Why are ICC and IEE not equal when the op-amp drives a load?',
    hint: 'Which rail provides the load current?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the load current is supplied by one rail only. The source states ICC = Io + IEE at Vo positive and IEE = ICC + Io at Vo negative, with ICC = IEE = IQ when there is no load. So the rail that supplies the load carries IQ + Io, while the other rail keeps carrying IQ.',
      },
    ],
    engineeringExplanation: 'In the supplied problem the negative rail carries seven times the positive rail. That asymmetry is the exam point.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'In your circuit Vo is −6 V. Which rail carries the load current?',
        expected:
          'The negative rail. Vo negative means the op-amp sinks current, so IEE = IQ + Io = 0.5 + 3 = 3.5 mA, while ICC = 0.5 mA.',
      },
      {
        teacher: 'How would you measure IQ?',
        expected: 'Remove the load so Io = 0; then both rails carry IQ. Measure either rail current.',
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
    prompt: 'Why does the output saturate below the supply rails, and how much headroom does the source say you lose?',
    hint: 'Two volts.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'The output stage transistors cannot swing fully to the rails because of their own saturation voltages. The supplied material states that the output saturates below 2 V of VCC and VEE: ±15 V rails give ±13 V, and ±9 V rails give ±7 V. Rail-to-rail CMOS parts with moderate loading give VOH = VCC and VOL = VEE.',
      },
    ],
    engineeringExplanation: 'Always design to the saturation limit, not to the rail voltage. It is the difference between a working product and one that clips on the largest signals.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Your customer needs 0 to 12 V out. What supply do you choose?',
        expected:
          'At least ±14 V so that the 12 V output stays inside the 2 V headroom — practically ±15 V. Or specify a rail-to-rail output device on a single 12 V or 15 V supply.',
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
    action: 'Justify',
    prompt: 'Your assignment answer says the power dissipated inside the op-amp is 42 mW. The examiner says 60 mW. Who is right?',
    hint: 'There are two different quantities and the assignment does not say which it wants.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Both numbers are correct for different quantities. 60 mW is the power drawn from the supplies (VCC·ICC + |VEE|·IEE). 42 mW is what is dissipated as heat inside the device, after subtracting the 18 mW delivered to the load. The professional answer states both, labels both, declares the assumed rails, and says which definition is being used.',
      },
    ],
    engineeringExplanation: 'When a question is ambiguous, do not pick one and hope. Answer both and state the ambiguity — that is what an engineer does, and it earns the mark either way.',
    provenance: 'insight',
    followUps: [
      {
        teacher: 'The assignment never gave the supply rails. Is your answer still valid?',
        expected:
          'The currents are valid without the rails. The power answers require the rails, so I declared ±15 V as an explicit assumption — the value the source uses in its own saturation example — and the answers scale linearly with the rails if a different supply is intended.',
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
    prompt: 'In the supplied inverting amplifier problem, the closed-loop gain is:',
    options: [
      { id: 'a', text: '−2' },
      { id: 'b', text: '+2' },
      { id: 'c', text: '−0.5' },
      { id: 'd', text: '+0.5' },
    ],
    answerId: 'a',
    hint: 'Av = −Rf/R1 = −20/10.',
    solution: [{ label: 'Answer', content: '(a) −2' }],
    engineeringExplanation: 'The sign matters — it decides which supply rail carries the load current in the next part.',
    provenance: 'source',
  },
  {
    id: `${T}-q2`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'With Vo = −6 V and RL = 2 kΩ, the load current is:',
    options: [
      { id: 'a', text: '0.33 mA' },
      { id: 'b', text: '3 mA' },
      { id: 'c', text: '12 mA' },
      { id: 'd', text: '0.3 mA' },
    ],
    answerId: 'b',
    hint: 'Volts over kΩ gives mA.',
    solution: [{ label: 'Answer', content: '(b) 3 mA' }],
    engineeringExplanation: 'Because Vo is negative, this current flows INTO the op-amp output — the op-amp sinks it.',
    provenance: 'source',
  },
  {
    id: `${T}-q3`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'With Vo negative, the correct supply-current relation from the source is:',
    options: [
      { id: 'a', text: 'ICC = Io + IEE' },
      { id: 'b', text: 'IEE = ICC + Io' },
      { id: 'c', text: 'ICC = IEE = IQ' },
      { id: 'd', text: 'ICC = IEE = Io' },
    ],
    answerId: 'b',
    hint: 'The negative rail carries the load current when the op-amp sinks.',
    solution: [
      { label: 'Answer', content: '(b) IEE = ICC + Io' },
      { label: 'Note', content: '(c) is the no-load case, not the Vo-negative case.' },
    ],
    engineeringExplanation: 'Three relations, three situations. Match the relation to the situation before substituting.',
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
    prompt: 'With IQ = 0.5 mA and Io = 3 mA at Vo negative, IEE is:',
    options: [
      { id: 'a', text: '0.5 mA' },
      { id: 'b', text: '3.0 mA' },
      { id: 'c', text: '3.5 mA' },
      { id: 'd', text: '2.5 mA' },
    ],
    answerId: 'c',
    hint: 'IEE = IQ + Io.',
    solution: [{ label: 'Answer', content: '(c) 3.5 mA' }],
    engineeringExplanation: 'The quiescent current still flows in both rails; the load current is added to one of them.',
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
    prompt: 'The output error caused by VOS is multiplied by:',
    options: [
      { id: 'a', text: 'The signal gain R2/R1' },
      { id: 'b', text: 'The noise gain 1 + R2/R1' },
      { id: 'c', text: 'The open-loop gain' },
      { id: 'd', text: 'The load resistance' },
    ],
    answerId: 'b',
    hint: 'The source says the offset-free op-amp acts as a non-inverting amplifier with respect to VOS.',
    solution: [{ label: 'Answer', content: '(b) The noise gain 1 + R2/R1' }],
    engineeringExplanation: 'Using the signal gain here is the classic error-budget mistake.',
    provenance: 'source',
  },
  {
    id: `${T}-q6`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'With Rp = R1||Rf, the output error due to bias currents becomes:',
    options: [
      { id: 'a', text: 'Rf × IB' },
      { id: 'b', text: 'Rf × IOS' },
      { id: 'c', text: 'R1 × IB' },
      { id: 'd', text: 'Zero' },
    ],
    answerId: 'b',
    hint: 'The IB term cancels; only the mismatch remains.',
    solution: [
      { label: 'Answer', content: '(b) Rf × IOS' },
      { label: 'Note', content: 'Not zero — IOS cannot be cancelled by matching resistors.' },
    ],
    engineeringExplanation: 'This is why IOS, not IB, becomes the specification to buy once the compensation resistor is fitted.',
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
    prompt: 'On ±15 V rails, the supplied material states the output saturates at about:',
    options: [
      { id: 'a', text: '±15 V' },
      { id: 'b', text: '±13 V' },
      { id: 'c', text: '±7 V' },
      { id: 'd', text: '±12 V' },
    ],
    answerId: 'b',
    hint: 'Two volts below the rails.',
    solution: [{ label: 'Answer', content: '(b) ±13 V' }],
    engineeringExplanation: '±7 V is the limit for ±9 V rails — a common distractor built from the same source line.',
    provenance: 'source',
  },
  {
    id: `${T}-q8`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'CMRR is specified in dB as:',
    options: [
      { id: 'a', text: '20 log CMRR' },
      { id: 'b', text: '10 log CMRR' },
      { id: 'c', text: 'CMRR/20' },
      { id: 'd', text: '20 ln CMRR' },
    ],
    answerId: 'a',
    hint: 'Voltage ratios use 20 log.',
    solution: [{ label: 'Answer', content: '(a) CMRRdB = 20 log CMRR' }],
    engineeringExplanation: '20 log for voltage and current ratios, 10 log for power ratios. CMRR is a voltage ratio.',
    provenance: 'source',
  },
  {
    id: `${T}-q9`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'According to the source, CMRR is no serious concern for the inverting amplifier because:',
    options: [
      { id: 'a', text: 'The gain is negative' },
      { id: 'b', text: 'Vp is at 0 volts, so Vcm is approximately zero' },
      { id: 'c', text: 'The input impedance is low' },
      { id: 'd', text: 'The feedback is negative' },
    ],
    answerId: 'b',
    hint: 'The common-mode voltage is the average of the two input pin voltages.',
    solution: [{ label: 'Answer', content: '(b) Vp is at 0 volts, so Vcm ≈ 0' }],
    engineeringExplanation: 'A topology choice that removes an error term for free. Use it whenever the signal allows.',
    provenance: 'source',
  },
  {
    id: `${T}-q10`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'For a JFET-input op-amp, the source states that the input bias current:',
    options: [
      { id: 'a', text: 'Doubles for every 10 °C rise' },
      { id: 'b', text: 'Halves for every 10 °C rise' },
      { id: 'c', text: 'Is independent of temperature' },
      { id: 'd', text: 'Falls because β increases with temperature' },
    ],
    answerId: 'a',
    hint: 'It is the reverse-bias current of a pn junction.',
    solution: [
      { label: 'Answer', content: '(a) Doubles for every 10 °C rise' },
      { label: 'Note', content: '(d) describes a bipolar-input device, not a JFET-input one.' },
    ],
    engineeringExplanation: 'Know which way your device drifts — it decides whether the worst case is hot or cold.',
    provenance: 'source',
  },
]

export const TOPIC3_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Circuit Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const
