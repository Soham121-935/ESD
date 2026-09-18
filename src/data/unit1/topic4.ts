import type {
  DebugFault,
  DesignChallengeSpec,
  ModeContent,
  NumericalProblem,
  Question,
  TopicMeta,
} from '../../types'

export const TOPIC4: TopicMeta = {
  id: 'u1t4',
  index: 4,
  title: 'TTL and CMOS',
  shortTitle: 'TTL & CMOS',
  hook: 'Two families, two sets of rules — and the interface between them is where designs fail.',
  status: 'live',
}

export const SOURCE_NOTE4 = {
  primary:
    'Supplied course material: “TTL CMOS characteristics” (ARN) — TTL families, input characteristics, output characteristics, VOH/VOL, tri-state, increasing fan-out, open-collector, unused inputs, and the CMOS family notes. “logic family presentation” — current and voltage parameter definitions, fan-out, noise-immunity expressions VNH = VOH(min) − VIH(min) and VNL = VIL(max) − VOL(max), open-collector/open-drain, tri-state, and the TTL↔CMOS interfacing rules.',
  coverage:
    'The supplied material gives the expressions, the rules and selected device facts (unit loads, IIH limits, clamp behaviour, family comparisons). It does NOT contain a numeric logic-level table. Every level number used in this topic — VOH(min), VOL(max), VIH(min), VIL(max) and the current ratings — is a standard 74-series datasheet value and is labelled Engineering Insight.',
}

/* ------------------------------------------------------------------ */
/* Source notes                                                        */
/* ------------------------------------------------------------------ */

export const TTL_FAMILY_NOTES: string[] = [
  'The key performance factors that distinguish the families are power consumption, speed, and the ability to drive wiring capacitance.',
  'In TTL, H-TTL and LP-TTL the transistors are turned on with enough base current for the lowest expected current gain, so the average transistor saturates. Removing the stored base charge causes considerable turn-off delay.',
  'Gold doping speeds up charge recombination but decreases current gain.',
  'Schottky clamped transistors use a surface-barrier diode with a low forward drop (0.3 V) as a bypass between base and collector (Baker clamp). The transistor never fully saturates and recovers quickly.',
  'Because gold doping is not required, Schottky transistors have higher current gain, need less base current and turn on faster.',
  'S-TTL achieves roughly twice the speed of H-TTL at about the same power. LS-TTL uses much less power than H-TTL at about the same speed.',
  'Compared with S-TTL, LS-TTL operates at about half the speed while using only about 20% as much power.',
]

export const INPUT_NOTES: string[] = [
  'For input voltages between 2.0 V and 5.5 V the current is only the input leakage current IIH, guaranteed not to exceed 40 µA or 50 µA depending on the family, for a single input.',
  'As the input falls below 2.0 V current starts flowing out of the input and increases rapidly — this is the transition region, with a slope of about 200 Ω.',
  'Between about 1.0 V and −0.5 V the slope equals the gate pull-up resistor, about 2 kΩ.',
  'Below about −0.7 V the input clamping diode conducts and the current increases rapidly.',
  'LS-TTL: input diode breakdown is typically greater than 15 V, and leakage above 1.5 V is negligible. Below 1.3 V gate current starts flowing out.',
  'LS-TTL clamping diodes are intended only for the suppression of transients and should not be used as steady-state clamps in interface applications. A clamp current above 2.0 mA lasting more than 500 ns can activate a parasitic lateral npn transistor and cause logic errors.',
  'The effective capacitance of a TTL input is 5.0 pF for DIP and 4.0 pF for Flatpak; each additional internal function adds 1.5 pF.',
]

export const OUTPUT_NOTES: string[] = [
  'With no load current the output LOW level is the offset voltage of about 90 mV.',
  'The saturation resistance is 8 Ω at 25 °C, rising to 9 Ω at 125 °C and falling to 6 Ω at −55 °C.',
  'At low temperature β decreases, so the output transistor pulls out of saturation for currents above 25 mA.',
  '74S00 and 74H00 are guaranteed to sink 20 mA (12.5 unit loads) with VOL specifications of 0.5 V and 0.4 V respectively.',
  '74LS circuits are guaranteed to sink 8.0 mA (5 unit loads) with a VOL specification of 0.5 V.',
  'With no load current VOH is about 3.5 V at 25 °C; above about 6 mA of IOH the pull-up transistor saturates and the slope is the 130 Ω current-limiting resistor plus the saturation resistance.',
  'The maximum IOH correlates with the short-circuit output current and is regarded as a measure of the ability to charge line capacitance.',
  'LS circuits provide a higher output voltage at low IOH because of the 5.0 kΩ resistor from Q3 to the output, giving greater protection against negative-going noise on a quiescent HIGH signal.',
]

export const UNUSED_INPUT_RULES: string[] = [
  'Theoretically an unconnected input assumes the HIGH logic level, but practically it is in an undefined state because it acts as an antenna for noise.',
  'Only a few hundred millivolts of noise can take an unconnected input to the LOW state.',
  'On devices with memory (flip-flops, latches, registers, counters) it is particularly important to terminate unused inputs such as MR, PE, PL and CP — a noise spike might change the stored contents.',
  'It is poor design practice to leave unused inputs floating.',
  'For a permanent HIGH, unused inputs can be tied to VCC. A current-limiting resistor in the range 1 kΩ to 5 kΩ is recommended for emitter-type inputs, since these break down at some unspecified voltage above 5.5 V.',
  'One resistor can serve several inputs provided the cumulative IIH current does not drop the voltage below 2.4 V.',
  'LS-TTL diode-type inputs have breakdown voltages above 15 V, so protective resistors are not normally required.',
  'An unused input may also be tied to a used input with the same logic function (NAND, AND) provided the driver can handle the added IIH — not recommended for diode-type LS inputs in a noisy environment.',
]

/* ------------------------------------------------------------------ */
/* Mode content                                                        */
/* ------------------------------------------------------------------ */

const BEGINNER: ModeContent = {
  framing:
    'Start with a simple failure: a TTL gate driving a CMOS input, wired correctly, that sometimes reads the wrong logic level.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — The gate that sometimes reads HIGH as LOW',
      provenance: 'insight',
      body: [
        'A 74LS gate drives a 5 V 74HC CMOS input. The wiring is correct, the supply is clean, and the signal is a clean 0/5 V square wave — yet the CMOS input occasionally reads a logic 1 as a logic 0.',
        'Both devices are powered from the same 5 V rail. Nothing is broken. The two families simply do not agree on what “HIGH” means.',
      ],
      bullets: [
        'What is required? A reliable logic HIGH and a reliable logic LOW across the interface.',
        'What is given? A TTL output and a CMOS input on the same 5 V supply.',
        'What has to be checked? The four voltage levels and the two current directions — in that order.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — The eight parameters that define an interface',
      provenance: 'source',
      body: [
        'The supplied presentation lists the current and voltage parameters that decide whether two devices can be connected.',
      ],
      bullets: [
        'VIH(min) — the lowest input voltage the receiver accepts as HIGH.',
        'VIL(max) — the highest input voltage the receiver accepts as LOW.',
        'VOH(min) — the lowest output voltage the driver guarantees in the HIGH state.',
        'VOL(max) — the highest output voltage the driver guarantees in the LOW state.',
        'IIH / IIL — the input currents the receiver draws in the HIGH and LOW states.',
        'IOH / IOL — the output currents the driver can supply in the HIGH and LOW states.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Noise margin',
      provenance: 'source',
      body: [
        'The difference between what the driver guarantees and what the receiver demands is the noise margin — the amount of noise the interface can tolerate before a level is misread.',
      ],
      quote:
        'High-state noise margin: VNH = VOH(min) − VIH(min). Low-state noise margin: VNL = VIL(max) − VOL(max).',
      sourceRef: 'logic family presentation — Noise Immunity',
      bullets: [
        'A negative margin means the interface is not guaranteed to work at all — it may work on the bench with a particular pair of devices and fail in production.',
        'Noise margin is a voltage budget. Any ringing, crosstalk or ground bounce eats into it.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why can TTL not drive CMOS directly at 5 V?',
      provenance: 'source',
      body: [
        'The supplied presentation is explicit about this case.',
      ],
      quote:
        '“TTL Driving CMOS — Current: no problem. Output voltages: VOH(min) of TTL is too low when compared with VIH(min) of CMOS. Solution: Pull-up resistor at TTL output.”',
      sourceRef: 'logic family presentation — TTL Driving CMOS',
      bullets: [
        'The failure is in the HIGH state only. A TTL output sinks current well, so the LOW state is normally fine.',
        'The fix is one resistor from the TTL output to VCC, which pulls the HIGH level up to the rail.',
        'Current is not the problem in this direction — a CMOS input draws almost nothing.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Check an interface in four steps',
      provenance: 'insight',
      body: [
        'Always in the same order. Voltage first, because a voltage failure cannot be fixed by adding current capability.',
      ],
      bullets: [
        'Step 1 — HIGH state voltage: VNH = VOH(min) − VIH(min). Must be ≥ 0.',
        'Step 2 — LOW state voltage: VNL = VIL(max) − VOL(max). Must be ≥ 0.',
        'Step 3 — LOW state current: fan-out(LOW) = IOL(max) / IIL(max).',
        'Step 4 — HIGH state current: fan-out(HIGH) = IOH(max) / IIH(max). The usable fan-out is the SMALLER of the two.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Interface analyser',
      provenance: 'insight',
      body: [
        'Choose a driver and a receiver and read the two noise margins and both fan-out figures directly. Try 74LS → 74HC and see the HIGH-state failure for yourself.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — 74LS driving 74HC at 5 V',
      provenance: 'insight',
      body: [
        'Standard datasheet levels (Engineering Insight; the source gives the expressions, not the numbers).',
      ],
      bullets: [
        '74LS output: VOH(min) = 2.7 V, VOL(max) = 0.5 V.',
        '74HC input at 5 V: VIH(min) = 3.5 V, VIL(max) = 1.5 V.',
        'Step 1 — VNH = 2.7 V − 3.5 V = −0.8 V. NEGATIVE. The HIGH state is not guaranteed.',
        'Step 2 — VNL = 1.5 V − 0.5 V = +1.0 V. The LOW state is fine.',
        'Step 3 — Current: a 74HC input draws about 1 µA, and a 74LS output can sink 8 mA, so current is not the problem.',
        'Step 4 — Fix: a pull-up resistor from the TTL output to 5 V. The output now reaches the rail in the HIGH state, giving VNH ≈ 5.0 − 3.5 = +1.5 V.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF?',
      provenance: 'insight',
      body: ['Change one thing at a time and predict the direction first.'],
      bullets: [
        'What if the receiver is 74HCT instead of 74HC? HCT inputs have TTL-compatible thresholds, so the interface works without a pull-up — that is exactly what the HCT family exists for.',
        'What if the CMOS runs at 10 V? Now the HIGH level fails by even more, and the source gives two options: a TTL series that can operate with a high-voltage output pull-up, or a voltage level translator.',
        'What if ten CMOS inputs are driven instead of one? Current is still not the problem in this direction, but the pull-up resistor must now supply all the leakage and still hold the HIGH level.',
        'What if you drive ten TTL inputs from one CMOS output instead? Now current IS the problem — see the next tab.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Never tie totem-pole outputs together',
      provenance: 'source',
      body: [
        'The supplied presentation states that conventional CMOS outputs and TTL totem-pole outputs should never be tied together: the output voltage lands in the indeterminate range and the ICs can be damaged.',
        'This is the reason open-collector, open-drain and tri-state outputs exist — each offers a safe way to connect more than one output to a node.',
      ],
      bullets: [
        'Open collector / open drain — the active pull-up transistor is removed; the HIGH state is created by an external resistor Rp. Enables wired-AND.',
        'Tri-state — a HIGH-impedance state in which both pull-up and pull-down are disabled, so several outputs can share a bus provided only one is enabled at a time.',
      ],
    },
  ],
}

const INTERMEDIATE: ModeContent = {
  framing:
    'You can check the levels. Now design the interface: choose the pull-up, size the bus, and decide between open-drain and tri-state.',
  blocks: [
    {
      kind: 'problem',
      title: 'PROBLEM — One CMOS output, twelve TTL inputs',
      provenance: 'insight',
      body: [
        'A 5 V 74HC output must drive twelve 74LS inputs. The voltage levels are fine — 74HC drives 5 V CMOS levels into TTL thresholds comfortably. The design fails anyway.',
        'It fails on current. TTL inputs sink real current in the LOW state, and twelve of them add up.',
      ],
      bullets: [
        'Required: a reliable interface for twelve TTL loads.',
        'Given: a 74HC output and twelve 74LS inputs on 5 V.',
        'Which check is binding? Fan-out in the LOW state.',
      ],
    },
    {
      kind: 'concept',
      title: 'CONCEPT — Fan-out is a current ratio, in both directions',
      provenance: 'source',
      body: [
        'Fan-out is the maximum number of logic inputs an output can drive reliably. It must be checked in both logic states, because the currents are very different.',
      ],
      quote:
        'fan-out(LOW) = IOL(max)/IIL(max). fan-out(HIGH) = IOH(max)/IIH(max). Example, 74ALS00: IOL(max) = 8 mA, IIL(max) = 0.1 mA → fan-out(LOW) = 80. IOH(max) = 0.4 mA, IIH(max) = 20 µA → fan-out(HIGH) = 20.',
      sourceRef: 'logic family presentation — TTL Data Sheets',
      bullets: [
        'The usable fan-out is the smaller of the two figures — in the example above, 20, not 80.',
        'The asymmetry exists because TTL inputs sink far more current when LOW than they source when HIGH.',
      ],
    },
    {
      kind: 'why',
      title: 'WHY? — Why is fan-out limited at all?',
      provenance: 'insight',
      body: [
        'Because every input draws current, and the output transistor has a finite current capability with a guaranteed output voltage.',
        'Exceed IOL and VOL rises: the LOW level creeps up until the receiver no longer sees a valid LOW. Exceed IOH and VOH falls, until the receiver no longer sees a valid HIGH. The fan-out number is simply the point at which the guaranteed output level meets the required input level.',
      ],
      bullets: [
        'Fan-out is therefore a restatement of the voltage noise margin, expressed in units of current.',
        'Wiring capacitance is a separate limit: the source names “ability to drive wiring capacitance” as one of the three key family performance factors, because it sets the speed at which a node can be switched, not the DC level.',
      ],
    },
    {
      kind: 'how',
      title: 'HOW? — Design the pull-up for an open-collector or TTL-to-CMOS interface',
      provenance: 'insight',
      body: [
        'Two inequalities fix the resistor between a minimum and a maximum. Both must be satisfied.',
      ],
      bullets: [
        'Upper limit (must be small enough to supply current in the HIGH state): Rp(max) = (VCC − VIH(min)) / (n × IIH + leakage). A larger resistor cannot hold the HIGH level.',
        'Lower limit (must be large enough not to exceed the driver’s sink capability in the LOW state): Rp(min) = (VCC − VOL(max)) / (IOL − n × IIL). A smaller resistor forces too much current through the sinking transistor and raises VOL.',
        'Choose a standard value between the two limits, nearer Rp(min) for speed (lower RC time constant) and nearer Rp(max) for power.',
        'Always check the resulting HIGH-state rise time against the input capacitance: with 5 pF per TTL input, ten inputs plus wiring can be 100 pF or more, and that with a 10 kΩ pull-up gives a time constant of about 1 µs.',
      ],
    },
    {
      kind: 'diagram',
      title: 'ENGINEERING DIAGRAM — Interface analyser with load count',
      provenance: 'insight',
      body: [
        'Set the driver to 74HC, the receiver to 74LS and the load count to 12, then to 4. Watch the current check change from FAIL to PASS and read the fan-out figures that explain it.',
      ],
    },
    {
      kind: 'calculation',
      title: 'STEP-BY-STEP CALCULATION — Twelve TTL loads from one CMOS output',
      provenance: 'insight',
      body: [
        '74HC output at 5 V: IOL(max) = 4 mA, IOH(max) = 4 mA. 74LS input: IIL(max) = 0.4 mA, IIH(max) = 20 µA.',
      ],
      bullets: [
        'Step 1 — LOW state: twelve inputs need 12 × 0.4 mA = 4.8 mA. The 74HC output guarantees 4 mA. FAILS.',
        'Step 2 — Fan-out(LOW) = 4 mA / 0.4 mA = 10 inputs. Twelve exceeds it.',
        'Step 3 — HIGH state: twelve inputs need 12 × 20 µA = 0.24 mA against 4 mA available. Comfortable.',
        'Step 4 — Fix: the source recommends a buffer to interface low-current CMOS to high-current TTL. A 74HC buffer or a dedicated line driver raises the available sink current; alternatively split the load across two outputs.',
        'Step 5 — Note the source exception: except for the 4000B series, 74HC/74HCT have no trouble driving a single TTL load of any series. The problem appears only as the load count grows.',
      ],
    },
    {
      kind: 'whatif',
      title: 'WHAT IF? — Design sensitivity',
      provenance: 'insight',
      body: ['Each of these is a review question. Answer with a number or a named failure mode.'],
      bullets: [
        'What if the load is reduced to eight TTL inputs? 8 × 0.4 = 3.2 mA against 4 mA — passes, with a little margin.',
        'What if a 74S input is used instead of 74LS? 74S inputs draw up to 2 mA each when LOW, so even two of them exceed a 74HC output.',
        'What if the pull-up is too large? The node still reaches a valid HIGH eventually, but the rise time grows with RC — at high speed the signal may never reach a valid level before it is sampled.',
        'What if the pull-up is too small? The sinking transistor must absorb VCC/Rp plus the input currents; VOL rises and the LOW-state margin disappears.',
        'What if several tri-state outputs are enabled at once? Two active drivers fight, the voltage lands in the indeterminate range, and the source warns that this can damage the ICs.',
      ],
    },
    {
      kind: 'insight',
      title: 'ENGINEERING INSIGHT — Floating inputs and unused inputs',
      provenance: 'source',
      body: [
        'The supplied TTL/CMOS notes are unusually direct about this: an unconnected input theoretically assumes the HIGH level, but practically it is in an undefined state because it acts as an antenna for noise.',
      ],
      bullets: [
        'Only a few hundred millivolts of noise can drive a floating input to the LOW state.',
        'On devices with memory — flip-flops, latches, registers, counters — a noise spike on an unused control input such as MR, PE, PL or CP can change the stored contents.',
        'For a permanent HIGH, tie unused inputs to VCC. For emitter-type inputs the source recommends a 1 kΩ to 5 kΩ current-limiting resistor, because these break down at some unspecified voltage above 5.5 V.',
        'One resistor can serve several inputs provided the cumulative IIH does not pull the voltage below 2.4 V.',
        'LS-TTL diode inputs break down above 15 V, so protective resistors are not normally required.',
      ],
      sourceRef: 'TTL CMOS characteristics (ARN) — UNUSED INPUTS',
    },
  ],
}

const EXAM: ModeContent = {
  framing:
    'Exam Mode answers the assignment question: “Explain the need for TTL-CMOS interfacing. Discuss TTL-to-CMOS and CMOS-to-TTL interfacing techniques with suitable circuits.” (8 marks)',
  blocks: [
    {
      kind: 'problem',
      title: 'EXAM QUESTION — 8 Marks',
      provenance: 'source',
      body: [
        'Q. Explain the need for TTL-CMOS interfacing. Discuss TTL-to-CMOS and CMOS-to-TTL interfacing techniques with suitable circuits.',
      ],
      sourceRef: 'TY ESD 2026 ISE1 — Unit 1, Q.5',
    },
    {
      kind: 'concept',
      title: 'Model answer — (1) Why interfacing is needed (2 marks)',
      provenance: 'source',
      body: [
        'Different logic families use different supply voltages and guarantee different output levels while demanding different input levels. Connecting them directly can leave the HIGH or LOW state outside the receiver’s guaranteed region, so the circuit becomes unreliable or fails outright.',
        'The three quantities that must be checked are the voltage levels (through the noise margins), the current capability (through fan-out) and, for mixed supply voltages, the need for level translation.',
      ],
      bullets: [
        'VNH = VOH(min) − VIH(min) and VNL = VIL(max) − VOL(max) — the source expressions.',
        'fan-out(LOW) = IOL(max)/IIL(max) and fan-out(HIGH) = IOH(max)/IIH(max); the usable fan-out is the smaller.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (2) TTL driving CMOS (3 marks)',
      provenance: 'source',
      body: [
        'Current: no problem — a CMOS input draws almost nothing.',
        'Voltage: VOH(min) of TTL is too low compared with VIH(min) of CMOS, so the HIGH state is not guaranteed.',
        'Solution 1 — a pull-up resistor from the TTL output to VCC, which raises the HIGH level to the rail.',
        'Solution 2 — use the 74HCT family, whose inputs have TTL-compatible thresholds.',
        'Driving high-voltage CMOS — either use a TTL series from certain manufacturers that can operate with a high-voltage output pull-up, or use a voltage level translator.',
        'Draw the circuit: TTL gate output → pull-up resistor to VCC → CMOS input, with the resistor value bounded by the sink capability in the LOW state and by the leakage requirement in the HIGH state.',
      ],
    },
    {
      kind: 'concept',
      title: 'Model answer — (3) CMOS driving TTL (2 marks)',
      provenance: 'source',
      body: [
        'Driving TTL in the HIGH state: no problem.',
        'Driving TTL in the LOW state: except for the 4000B series, 74HC/74HCT have no trouble driving a single TTL load of any series.',
        'The concern is fan-out: TTL inputs sink significant current when LOW, so as the load count grows the CMOS output runs out of sink capability.',
        'Solution — use a buffer to interface low-current CMOS to high-current TTL.',
        'High-voltage CMOS driving TTL — use a TTL series that can withstand high-voltage inputs, or use a voltage level translator.',
      ],
    },
    {
      kind: 'diagram',
      title: 'Model answer — (4) Diagrams (1 mark)',
      provenance: 'insight',
      body: [
        'Draw two circuits: (a) TTL → CMOS with a pull-up resistor Rp from the TTL output to VCC; (b) CMOS → TTL with a buffer or line driver when the load count exceeds the fan-out.',
        'Exam tip: label Rp and say in words what bounds its value — too large and the HIGH state is not held, too small and the LOW-state sink current is exceeded.',
      ],
    },
    {
      kind: 'calculation',
      title: 'Marking scheme and common mistakes',
      provenance: 'insight',
      body: [
        '2 marks — the need for interfacing, with the noise-margin expressions.',
        '3 marks — TTL → CMOS, naming the HIGH-state problem and giving the pull-up (and/or HCT) solution.',
        '2 marks — CMOS → TTL, naming the fan-out problem and giving the buffer solution.',
        '1 mark — labelled circuits.',
      ],
      bullets: [
        'Common mistake 1: saying “TTL cannot drive CMOS because of current”. It is the opposite — current is fine, the HIGH-state voltage is the problem.',
        'Common mistake 2: forgetting that fan-out must be checked in both states and taking the smaller.',
        'Common mistake 3: not mentioning level translation when the two families run on different supply voltages.',
      ],
    },
  ],
}

export const TOPIC4_MODES: Record<'beginner' | 'intermediate' | 'exam', ModeContent> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  exam: EXAM,
}

/* ------------------------------------------------------------------ */
/* Numerical problems                                                  */
/* ------------------------------------------------------------------ */

export const LOGIC_PROBLEMS: NumericalProblem[] = [
  {
    id: 'u1t4-p1',
    title: 'Problem 1 — Noise margins for a 74LS → 74HC interface',
    provenance: 'insight',
    situation:
      'A 74LS TTL gate drives one 74HC CMOS input, both on a 5 V supply. Check whether the interface is valid by computing both noise margins.',
    given: [
      { symbol: '74LS VOH(min) / VOL(max)', value: '2.7 V / 0.5 V' },
      { symbol: '74HC VIH(min) / VIL(max) at 5 V', value: '3.5 V / 1.5 V' },
      { symbol: 'Source expressions', value: 'VNH = VOH(min) − VIH(min), VNL = VIL(max) − VOL(max)' },
    ],
    required: ['High-state noise margin VNH', 'Low-state noise margin VNL', 'Whether the interface is valid'],
    assumptions: [
      'The noise-margin expressions are from the supplied material.',
      'Engineering Insight: the numeric level values are standard 74-series datasheet figures; the supplied PDFs give the expressions but not a level table.',
    ],
    steps: [
      {
        id: 'vnh',
        ask: 'Step 1 — Compute the high-state noise margin VNH = VOH(min) − VIH(min).',
        concept: 'The high-state margin is how far the guaranteed HIGH output sits above the minimum voltage the input needs.',
        equation: 'VNH = VOH(min) − VIH(min)',
        substitution: 'VNH = 2.7 V − 3.5 V = −0.8 V',
        entries: [{ id: 'vnh1', label: 'VNH', unit: 'V', answer: -0.8, tolerance: 0.05 }],
        hints: [
          'Subtract the receiver’s VIH(min) from the driver’s VOH(min).',
          '2.7 − 3.5 = −0.8 V. A negative margin means the HIGH state is not guaranteed.',
        ],
        interpretation:
          'Negative by 0.8 V. This is exactly the case the source describes: “VOH(min) of TTL is too low when compared with VIH(min) of CMOS.”',
        whatIf:
          'With a pull-up resistor the HIGH output reaches ≈ 5.0 V, giving VNH ≈ 1.5 V. With a 74HCT input (VIH(min) = 2.0 V) no pull-up is needed.',
      },
      {
        id: 'vnl',
        ask: 'Step 2 — Compute the low-state noise margin VNL = VIL(max) − VOL(max).',
        concept: 'The low-state margin is how far the guaranteed LOW output sits below the maximum voltage the input will still accept as LOW.',
        equation: 'VNL = VIL(max) − VOL(max)',
        substitution: 'VNL = 1.5 V − 0.5 V = +1.0 V',
        entries: [{ id: 'vnl1', label: 'VNL', unit: 'V', answer: 1.0, tolerance: 0.05 }],
        hints: [
          'Subtract the driver’s VOL(max) from the receiver’s VIL(max).',
          '1.5 − 0.5 = 1.0 V. The LOW state has plenty of margin.',
        ],
        interpretation:
          'The LOW state is comfortable. The source is right to say that in this direction “current: no problem” — and neither is the LOW level.',
        whatIf:
          'If the TTL output were heavily loaded and VOL rose to 0.8 V, VNL would fall to 0.7 V — still positive, but the margin is being eaten.',
      },
      {
        id: 'verdict',
        ask: 'Step 3 — Is the direct interface valid? Enter 1 for valid, 0 for not valid.',
        concept: 'Both margins must be non-negative before a direct connection is guaranteed.',
        equation: 'Valid if VNH ≥ 0 AND VNL ≥ 0',
        substitution: 'VNH = −0.8 V (fails), VNL = +1.0 V (passes). Not valid.',
        entries: [{ id: 'v1', label: 'Valid? (1/0)', unit: 'boolean', answer: 0, tolerance: 0 }],
        hints: [
          'One negative margin is enough to reject the interface.',
          'VNH is negative, so enter 0.',
        ],
        interpretation:
          'Not valid. It may appear to work with a particular pair of devices at room temperature, which is the worst kind of fault — it escapes the bench test and appears in the field.',
        whatIf:
          'Add a pull-up to VCC and the interface becomes valid. That is the source’s stated solution.',
      },
    ],
    verification:
      'Both margins use the same supply and the same signal path, and only the HIGH state fails — which matches the source statement that TTL-to-CMOS fails on VOH(min) versus VIH(min), not on current.',
    interpretation:
      'The pattern to internalise: check the HIGH state and the LOW state separately. Interfaces almost always fail in one direction only.',
  },
  {
    id: 'u1t4-p2',
    title: 'Problem 2 — Fan-out for a 74HC output driving 74LS inputs',
    provenance: 'insight',
    situation:
      'A 74HC CMOS output must drive 74LS TTL inputs on a common 5 V supply. Determine the fan-out in both states and the maximum number of inputs that can be driven.',
    given: [
      { symbol: '74HC IOL(max) / IOH(max)', value: '4 mA / 4 mA' },
      { symbol: '74LS IIL(max) / IIH(max)', value: '0.4 mA / 20 µA' },
      { symbol: 'Source', value: 'fan-out(LOW) = IOL/IIL, fan-out(HIGH) = IOH/IIH' },
    ],
    required: ['Fan-out in the LOW state', 'Fan-out in the HIGH state', 'The usable fan-out'],
    assumptions: [
      'The fan-out expressions are from the supplied material.',
      'Engineering Insight: the current values are standard datasheet figures.',
    ],
    steps: [
      {
        id: 'low',
        ask: 'Step 1 — Compute fan-out(LOW) = IOL(max) / IIL(max).',
        concept: 'In the LOW state the driver must sink the current flowing out of every input.',
        equation: 'fan-out(LOW) = IOL(max) / IIL(max)',
        substitution: '4 mA / 0.4 mA = 10 inputs',
        entries: [{ id: 'l1', label: 'Fan-out (LOW)', unit: 'inputs', answer: 10, tolerance: 0.5 }],
        hints: [
          'Divide the driver’s sink capability by the current each input sources.',
          '4 / 0.4 = 10.',
        ],
        interpretation: 'Ten inputs. The LOW state is the binding constraint here, as it usually is with TTL loads.',
        whatIf: 'With 74S inputs (IIL up to 2 mA) the same output would drive only two inputs.',
      },
      {
        id: 'high',
        ask: 'Step 2 — Compute fan-out(HIGH) = IOH(max) / IIH(max), converting 20 µA to mA first.',
        concept: 'In the HIGH state the driver must source the leakage current of every input. Units must match before dividing.',
        equation: 'fan-out(HIGH) = IOH(max) / IIH(max)',
        substitution: 'IIH = 20 µA = 0.02 mA. 4 mA / 0.02 mA = 200 inputs.',
        entries: [{ id: 'h1', label: 'Fan-out (HIGH)', unit: 'inputs', answer: 200, tolerance: 5 }],
        hints: [
          'Convert 20 µA to 0.02 mA before dividing.',
          '4 / 0.02 = 200.',
        ],
        interpretation:
          'Two hundred — vastly more than the LOW state. This asymmetry is exactly why the source says the concern is the fan-out problem in the LOW state.',
        whatIf: 'The practical limit at 200 inputs would be wiring capacitance, not DC current.',
      },
      {
        id: 'use',
        ask: 'Step 3 — What is the usable fan-out, and is twelve inputs acceptable? Enter the usable fan-out.',
        concept: 'The usable fan-out is the smaller of the two figures — the interface is only as good as its worst state.',
        equation: 'fan-out = min(fan-out(LOW), fan-out(HIGH))',
        substitution: 'min(10, 200) = 10. Twelve inputs exceeds it, so a buffer is required.',
        entries: [{ id: 'u1', label: 'Usable fan-out', unit: 'inputs', answer: 10, tolerance: 0.5 }],
        hints: [
          'Take the smaller of your two answers.',
          'min(10, 200) = 10, so twelve is too many.',
        ],
        interpretation:
          'Ten inputs. The source’s remedy for this situation is a buffer: “Use buffer to interface low-current CMOS to high-current TTL.”',
        whatIf:
          'Splitting the load across two outputs gives 6 each, comfortably inside the limit, and preserves the speed that a buffer would add delay to.',
      },
    ],
    verification:
      'Ten inputs need 10 × 0.4 mA = 4.0 mA in the LOW state, exactly the 74HC guarantee, and 10 × 20 µA = 0.2 mA in the HIGH state, well inside 4 mA.',
    interpretation:
      'Fan-out must always be evaluated in both states and the smaller number used. The DC current limit and the capacitive speed limit are two different constraints.',
  },
]

/* ------------------------------------------------------------------ */
/* Design challenge                                                    */
/* ------------------------------------------------------------------ */

export const LOGIC_DESIGN: DesignChallengeSpec = {
  id: 'u1t4-design-mixed-bus',
  title: 'Design Challenge — Mixed TTL/CMOS interface on one 5 V board',
  provenance: 'insight',
  requirement:
    'A board has one 74LS TTL counter output that must drive four 74HC CMOS inputs, and one 74HC output that must drive six 74LS inputs. Everything runs on a single 5 V supply. Design both interfaces, specify any added components, and state what must never be done on this board.',
  constraints: [
    'Interface A: one 74LS output → four 74HC inputs, 5 V.',
    'Interface B: one 74HC output → six 74LS inputs, 5 V.',
    'Single 5 V supply; no level translators available.',
    'Board has a shared status line that more than one device may need to assert.',
    'Unused inputs exist on several packages.',
  ],
  assumptions: [
    'The interfacing rules and noise-margin expressions are source-derived.',
    'Engineering Insight: the numeric levels, currents and the resistor arithmetic are standard practice.',
  ],
  checks: [
    {
      id: 'a',
      label: 'Interface A — TTL driving CMOS',
      ask: 'What must be added to interface A, and why? Name the component and the reason.',
      accepted: [
        'pull-up resistor',
        'a pull-up resistor from the ttl output to vcc',
        'pull-up to vcc because voh(min) of ttl is too low for vih(min) of cmos',
      ],
      hints: [
        'Hint 1 — Check the HIGH state: 74LS VOH(min) = 2.7 V, 74HC VIH(min) = 3.5 V.',
        'Hint 2 — VNH = 2.7 − 3.5 = −0.8 V. The source names this exact failure.',
        'Hint 3 — The source’s stated solution is a pull-up resistor at the TTL output.',
      ],
      rationale:
        'A pull-up resistor from the 74LS output to 5 V. The source states that VOH(min) of TTL is too low compared with VIH(min) of CMOS and that the solution is a pull-up resistor at the TTL output. With the pull-up the HIGH level reaches ≈ 5 V, giving VNH ≈ 1.5 V.',
    },
    {
      id: 'rp',
      label: 'Pull-up value',
      ask: 'Pick a standard pull-up value for four CMOS inputs. Give one value in kΩ.',
      unit: 'kΩ',
      accepted: ['10k', '10 k', '4.7k', '4.7 k', '2.2k', '2.2 k', '1k', '1 k'],
      hints: [
        'Hint 1 — Too large and the resistor cannot supply the leakage current; too small and the LOW-state sink current is exceeded.',
        'Hint 2 — CMOS inputs leak only about 1 µA each, so the HIGH-state requirement is tiny: Rp(max) is very large.',
        'Hint 3 — The binding limit is the LOW state: Rp(min) = (VCC − VOL)/(IOL − n·IIL) ≈ 5/8 mA ≈ 625 Ω. Any standard value from 1 kΩ upward is safe; 4.7 kΩ or 10 kΩ are the usual choices.',
      ],
      rationale:
        'The HIGH-state limit is enormous because CMOS inputs draw about 1 µA. The LOW-state limit is about 625 Ω, so any standard value above that works. Choose 4.7 kΩ: well clear of the sink limit, low enough for a reasonable rise time with the load capacitance, and low enough not to waste much current when the line is LOW (about 1 mA).',
    },
    {
      id: 'b',
      label: 'Interface B — CMOS driving TTL',
      ask: 'Is interface B valid for six loads? State the check you performed and the answer.',
      accepted: [
        'yes, valid',
        'valid — 6 x 0.4 ma = 2.4 ma within the 4 ma iol',
        'valid, fan-out low is 10 so 6 is acceptable',
      ],
      hints: [
        'Hint 1 — The voltage levels are fine; check the current in the LOW state.',
        'Hint 2 — Six 74LS inputs draw 6 × 0.4 mA = 2.4 mA when LOW.',
        'Hint 3 — 74HC guarantees IOL = 4 mA, so 2.4 mA is within capability. Fan-out(LOW) = 10, so six is acceptable.',
      ],
      rationale:
        'Valid. Six inputs need 6 × 0.4 mA = 2.4 mA in the LOW state against a 4 mA guarantee, and 6 × 20 µA = 0.12 mA in the HIGH state against 4 mA. The source notes that 74HC has no trouble driving a single TTL load and that the concern is fan-out as the load count grows — at six loads we are still inside the limit of ten.',
    },
    {
      id: 'bus',
      label: 'The shared status line',
      ask: 'Several devices may need to assert a shared status line. What output type must be used, and why can totem-pole outputs not simply be tied together?',
      accepted: [
        'open-collector or open-drain with a pull-up',
        'open drain (or open collector) with a single pull-up — wired-and',
        'tri-state with only one device enabled at a time',
      ],
      hints: [
        'Hint 1 — What happens when two totem-pole outputs are tied together and one drives HIGH while the other drives LOW?',
        'Hint 2 — The source states that conventional CMOS outputs and TTL totem-pole outputs should never be tied together: the voltage lands in the indeterminate range and the ICs can be damaged.',
        'Hint 3 — The source’s stated solutions are open-collector/open-drain with an external pull-up (wired-AND) or tri-state with only one device enabled at a time.',
      ],
      rationale:
        'Use open-drain (or open-collector) outputs with a single pull-up resistor, giving a wired-AND function, or tri-state outputs with a control scheme that guarantees only one device is enabled at a time. Totem-pole outputs must never be tied together: with one driving HIGH and another driving LOW the voltage lands in the indeterminate range and the devices can be damaged.',
    },
    {
      id: 'unused',
      label: 'Unused inputs',
      ask: 'What do you do with the unused inputs, and why is leaving them open unacceptable?',
      accepted: [
        'tie to vcc (through a 1k to 5k resistor for emitter-type inputs) or to a used input with the same function',
        'tie high through a current-limiting resistor; never leave floating',
        'terminate them — floating inputs act as antennas for noise',
      ],
      hints: [
        'Hint 1 — What does the source say an unconnected input actually does?',
        'Hint 2 — Theoretically it assumes HIGH; practically it is undefined because it acts as an antenna for noise, and a few hundred millivolts can take it LOW.',
        'Hint 3 — The source gives two acceptable terminations: tie to VCC (with a 1 kΩ to 5 kΩ resistor for emitter-type inputs) or tie to a used input with the same function.',
      ],
      rationale:
        'Tie unused inputs to VCC through a 1 kΩ to 5 kΩ current-limiting resistor for emitter-type inputs (which break down above 5.5 V), or tie them to a used input with the same logic function provided the driver can handle the added IIH. Never leave them floating: the source warns that an unconnected input acts as an antenna for noise, that a few hundred millivolts can drive it LOW, and that on devices with memory a spike on MR, PE, PL or CP can change the stored contents.',
    },
  ],
  solution: [
    { label: 'Requirement', content: 'One 74LS output → four 74HC inputs; one 74HC output → six 74LS inputs; a shared status line; unused inputs on several packages; single 5 V rail.' },
    { label: 'Interface A', content: 'Add a 4.7 kΩ pull-up from the 74LS output to +5 V. VNH improves from −0.8 V to about +1.5 V.' },
    { label: 'Interface B', content: 'Direct connection is valid: 2.4 mA of sink current against a 4 mA guarantee, and 0.12 mA of source current against 4 mA.' },
    { label: 'Shared status line', content: 'Open-drain outputs with a single pull-up (wired-AND), or tri-state with guaranteed single-enable control. Never tie totem-pole outputs together.' },
    { label: 'Unused inputs', content: 'Tie to VCC through 1 kΩ to 5 kΩ for emitter-type inputs, or to a used input with the same function. One resistor may serve several inputs provided the cumulative IIH does not pull the voltage below 2.4 V.' },
    { label: 'Verification', content: 'Both noise margins non-negative in both states; both fan-out checks inside limits; status line has exactly one pull-up; no floating inputs anywhere on the board.' },
    { label: 'Possible failure modes', content: 'Two tri-state drivers enabled simultaneously; a pull-up omitted after a design change; an unused reset pin left floating and picking up a spike; a pull-up so large that the rise time exceeds the sampling period.' },
    { label: 'Alternative', content: 'Use 74HCT parts throughout, whose inputs have TTL-compatible thresholds — the pull-up then becomes unnecessary and the board becomes a single-family design.' },
  ],
  failureModes: [
    'Assuming TTL-to-CMOS fails on current — it fails on the HIGH-state voltage.',
    'Sizing a pull-up without checking the LOW-state sink current.',
    'Taking the larger of the two fan-out figures instead of the smaller.',
    'Tying totem-pole outputs together to create a wired-AND.',
    'Leaving unused control inputs (MR, PE, PL, CP) floating on memory devices.',
  ],
  interpretation:
    'Mixed-family boards are not hard — they are just un-checked. Every interface needs the same four checks: HIGH voltage, LOW voltage, HIGH current, LOW current. Most board-level logic faults are one of those four being skipped.',
}

/* ------------------------------------------------------------------ */
/* Debugging cases                                                     */
/* ------------------------------------------------------------------ */

export const DEBUG_CASES4: DebugFault[] = [
  {
    id: 'u1t4-debug-floating',
    title: 'Fault 1 — The counter that counts when nobody is counting',
    provenance: 'insight',
    symptom:
      'A 74LS counter with its clock input tied to a push button counts correctly most of the time, but the displayed count occasionally jumps by two or three when a nearby relay switches, or when a hand is brought close to the board. The clock signal has been checked with a scope and is clean.',
    measurements: [
      { label: 'Clock signal at the counter pin', value: 'Clean 0 / 4.8 V transitions, verified on a scope' },
      { label: 'Unused inputs on the package', value: 'Clear (MR), load (PE), and a second clock input (CP) — all unconnected' },
      { label: 'Supply', value: '5.02 V, decoupled' },
      { label: 'Fault correlation', value: 'Always coincides with a relay switching or a hand near the board' },
      { label: 'Temperature', value: 'Normal' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The clock signal is noisy' },
      { id: 'h2', text: 'Unused control inputs are floating and acting as antennas, so external noise is changing the counter state' },
      { id: 'h3', text: 'The counter IC is faulty' },
      { id: 'h4', text: 'The supply is drooping when the relay switches' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Add more decoupling capacitors to the supply' },
      { id: 'f2', text: 'Terminate the unused inputs — tie them to VCC through a 1 kΩ to 5 kΩ resistor, or to a used input with the same function' },
      { id: 'f3', text: 'Add a Schmitt trigger to the clock input' },
      { id: 'f4', text: 'Replace the counter IC' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — The clock is clean and the fault correlates with external events, not with the clock. Which pins are not being driven at all?',
      'Hint 2 — The source says an unconnected input theoretically assumes HIGH but practically is undefined because it acts as an antenna for noise.',
      'Hint 3 — The source adds that only a few hundred millivolts of noise can take an unconnected input LOW, and that on devices with memory it is particularly important to terminate MR, PE, PL and CP.',
    ],
    rootCause:
      'Floating unused control inputs. The source states that an unconnected input theoretically assumes the HIGH logic level but practically sits in an undefined state because it acts as an antenna for noise, and that only a few hundred millivolts is enough to drive it to the LOW state. On a device with memory — a counter — a noise spike on the clear, load or clock input changes the stored count, which is exactly the symptom. The relay and the hand are both coupling noise into a high-impedance pin.',
    prevention:
      'Terminate every unused input. The source gives two acceptable methods: tie it to VCC (with a 1 kΩ to 5 kΩ current-limiting resistor for emitter-type inputs, which break down above 5.5 V), or tie it to a used input with the same logic function provided the driver can handle the added IIH. One resistor may serve several inputs provided the cumulative IIH does not pull the voltage below 2.4 V. Make “no floating inputs” a schematic review checklist item.',
  },
  {
    id: 'u1t4-debug-ttlcmos',
    title: 'Fault 2 — The interface that works on the bench and fails in the field',
    provenance: 'insight',
    symptom:
      'A prototype connects a 74LS gate directly to a 74HC CMOS input on the same 5 V supply. It works perfectly for weeks on the bench. In the first production batch, about one unit in five misreads logic HIGH as LOW, and the fault gets worse as the enclosure warms up.',
    measurements: [
      { label: 'Measured HIGH level from the 74LS output', value: '2.9 V on the bench unit; 2.65 V on a failing unit' },
      { label: '74HC datasheet VIH(min) at 5 V', value: '3.5 V' },
      { label: '74LS datasheet VOH(min)', value: '2.7 V' },
      { label: 'LOW level measured', value: '0.4 V — comfortably valid' },
      { label: 'Load count', value: '1 input — current is not an issue' },
    ],
    hypotheses: [
      { id: 'h1', text: 'The CMOS input is drawing too much current' },
      { id: 'h2', text: 'The TTL VOH(min) is below the CMOS VIH(min), so the HIGH state was never guaranteed — the bench unit simply had a better-than-minimum output' },
      { id: 'h3', text: 'The supply voltage is wrong' },
      { id: 'h4', text: 'The CMOS device is from a bad batch' },
    ],
    correctHypothesisId: 'h2',
    fixes: [
      { id: 'f1', text: 'Increase the supply voltage to 6 V' },
      { id: 'f2', text: 'Add a pull-up resistor from the TTL output to VCC, or replace the receiver with a 74HCT part whose inputs have TTL-compatible thresholds' },
      { id: 'f3', text: 'Add a series termination resistor at the driver' },
      { id: 'f4', text: 'Replace the CMOS devices' },
    ],
    correctFixId: 'f2',
    hints: [
      'Hint 1 — Compute VNH = VOH(min) − VIH(min) using the guaranteed values, not the measured ones.',
      'Hint 2 — 2.7 V − 3.5 V = −0.8 V. What does a negative margin mean for a production batch?',
      'Hint 3 — The source states this case exactly: “VOH(min) of TTL is too low when compared with VIH(min) of CMOS. Solution: Pull-up resistor at TTL output.”',
    ],
    rootCause:
      'The HIGH-state noise margin is negative. The guaranteed TTL output of 2.7 V is below the 3.5 V the CMOS input requires, so the interface is not guaranteed at any temperature. The bench unit worked because its particular output happened to reach 2.9 V — still below 3.5 V, and only tolerated because that particular CMOS input switched slightly early. As devices vary across a batch and the output level falls slightly with temperature, units begin to fail. The design was never valid; it was lucky.',
    prevention:
      'Design to the guaranteed limits, never to a measured sample. Compute VNH and VNL for every interface before layout, and treat a negative margin as a defect. The source’s fix is a pull-up resistor at the TTL output; the cleaner alternative is to use 74HCT receivers whose input thresholds are TTL-compatible, which removes the problem by part-number choice rather than by adding a component.',
  },
]

/* ------------------------------------------------------------------ */
/* Question bank                                                       */
/* ------------------------------------------------------------------ */

const T = 'u1t4'

export const TOPIC4_QUESTIONS: Question[] = [
  /* ---------------- CONCEPTUAL (7) ---------------- */
  {
    id: `${T}-c1`,
    topicId: T,
    type: 'conceptual',
    level: 1,
    marks: 3,
    skill: 'concept',
    action: 'State',
    prompt: 'State the four voltage parameters and the four current parameters that define a logic interface, as listed in the supplied material.',
    hint: 'Two letters for each: VIH, VIL, VOH, VOL, IIH, IIL, IOH, IOL.',
    solution: [
      {
        label: 'Voltage (source)',
        content: 'VIH(min) — high level input voltage. VIL(max) — low level input voltage. VOH(min) — high level output voltage. VOL(max) — low level output voltage.',
      },
      {
        label: 'Current (source)',
        content: 'IIH — high level input current. IIL — low level input current. IOH — high level output current. IOL — low level output current.',
      },
      {
        label: 'Why “min” and “max” matter',
        content: 'Outputs are guaranteed at worst case, so you take the worst output (VOH min, VOL max) and the most demanding input (VIH min, VIL max).',
      },
    ],
    engineeringExplanation: 'Half of interface errors come from using typical instead of worst-case limits. The subscripts min and max are the whole point.',
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
    prompt: 'Explain what a noise margin is, give both expressions from the supplied material, and state what a negative value means.',
    hint: 'One expression per logic state.',
    solution: [
      { label: 'Expressions (source)', content: 'VNH = VOH(min) − VIH(min). VNL = VIL(max) − VOL(max).' },
      {
        label: 'Meaning',
        content: 'The noise margin is the amount of noise the interface can tolerate before a level is misread. It is a voltage budget shared by ringing, crosstalk and ground bounce.',
      },
      {
        label: 'Negative value',
        content: 'A negative margin means the driver’s guaranteed output does not reach the receiver’s required input. The interface is not guaranteed to work, even though a particular pair of devices may work on the bench.',
      },
    ],
    engineeringExplanation: 'A negative margin is a design defect, not a marginal design. It fails in production, which is the expensive place to fail.',
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
    prompt: 'Define fan-out, give both expressions, and state which one limits a practical interface.',
    hint: 'It is a current ratio, checked in both states.',
    solution: [
      { label: 'Definition (source)', content: 'Fan-out is the maximum number of logic inputs an output can drive reliably.' },
      { label: 'Expressions (source)', content: 'fan-out(LOW) = IOL(max)/IIL(max). fan-out(HIGH) = IOH(max)/IIH(max).' },
      {
        label: 'Which limits',
        content: 'The usable fan-out is the smaller of the two. With TTL loads the LOW state normally limits, because TTL inputs sink far more current when LOW than they source when HIGH.',
      },
    ],
    engineeringExplanation: 'In the source’s own 74ALS00 example the two figures are 80 and 20 — and the answer is 20.',
    provenance: 'source',
  },
  {
    id: `${T}-c4`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 4,
    skill: 'concept',
    action: 'Explain',
    prompt: 'Explain why Schottky clamping speeds up TTL, and state the two consequences the supplied material draws from it.',
    hint: 'A surface-barrier diode between base and collector.',
    solution: [
      {
        label: 'Mechanism (source)',
        content: 'A Schottky clamped transistor uses a surface-barrier diode with a low forward drop (0.3 V) as a bypass between base and collector — the Baker clamp. When the transistor starts to saturate, the excess input current is routed through the diode into the collector instead of into the base, so the transistor never fully saturates and recovers quickly when the base current is interrupted.',
      },
      {
        label: 'Consequences (source)',
        content: 'Because gold doping is not required, the transistors have higher current gain, need less base current and turn on faster. S-TTL achieves roughly twice the speed of H-TTL at about the same power.',
      },
    ],
    engineeringExplanation: 'Understand the mechanism, not just the name: stored base charge is the enemy, and the clamp prevents it from accumulating.',
    provenance: 'source',
  },
  {
    id: `${T}-c5`,
    topicId: T,
    type: 'conceptual',
    level: 2,
    marks: 3,
    skill: 'concept',
    action: 'Compare',
    prompt: 'Compare the 4000/14000 series and the 74HC/HCT series, using the points the supplied material makes.',
    hint: 'Supply range, speed, output current, and compatibility with TTL.',
    solution: [
      {
        label: '4000/14000 (source)',
        content: 'Very low power dissipation, operates over a wide supply range of 3 to 15 V, very slow compared with TTL, very low output current capability, and not pin-compatible or electrically compatible with any TTL series.',
      },
      {
        label: '74HC/HCT (source)',
        content: 'A ten-fold increase in switching speed, comparable to 74LS, and a much higher output current capability than the first 7400 CMOS series. 74HC/HCT parts are pin-compatible with, and functionally equivalent to, TTL ICs with the same device number.',
      },
      {
        label: 'Engineering consequence',
        content: '4000-series parts on a mixed board need level translation and cannot drive TTL loads; 74HC/HCT can be dropped into a TTL design with far fewer interface problems.',
      },
    ],
    engineeringExplanation: 'This comparison is the fastest way to justify a family choice in a design review.',
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
    prompt: 'Explain what an open-collector or open-drain output is, why it exists, and what it requires externally.',
    hint: 'The active pull-up transistor is removed.',
    solution: [
      {
        label: 'Definition (source)',
        content: 'The solution is to remove the active pull-up transistor. In CMOS output circuits this gives open-drain outputs; in TTL totem-pole output circuits it gives open-collector outputs.',
      },
      {
        label: 'Why (source)',
        content: 'Conventional CMOS outputs and TTL totem-pole outputs should never be tied together — the output voltage lands in the indeterminate range and the ICs can be damaged. Removing the pull-up makes it safe to connect outputs together.',
      },
      {
        label: 'External requirement (source)',
        content: 'The output LOW state is no problem, but the output HIGH state needs an external pull-up resistor Rp.',
      },
      { label: 'Application (source)', content: 'Wired-AND connection, and buffer/driver use.' },
    ],
    engineeringExplanation: 'Open-drain is the standard way to share a line. The pull-up sets both the HIGH level and the rise time, so it must be designed, not guessed.',
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
    prompt: 'Explain what a tri-state output is and why it is useful on a data bus.',
    hint: 'A third state in which both output transistors are off.',
    solution: [
      {
        label: 'Definition (source)',
        content: 'A LOW signal on the enable turns off both pull-up and pull-down circuitry, disabling the output. In the disabled condition the outputs are tested for leakage at 2.4 V (IOZH) and at 0.4 V or 0.5 V (IOZL) to ensure they do not load the bus.',
      },
      {
        label: 'Why useful',
        content: 'In the high-impedance state the output draws almost no current, so many outputs can share one bus provided only one is enabled at a time. This is what makes a bidirectional data bus possible without bus contention.',
      },
      {
        label: 'Caution',
        content: 'The source warns that tying active (totem-pole) outputs together puts the voltage in the indeterminate range and can damage the ICs. Tri-state is only safe if the enable logic guarantees that never happens.',
      },
    ],
    engineeringExplanation: 'Tri-state buys you a shared bus at the cost of a control scheme that must guarantee single enable. That control scheme is where these designs fail.',
    provenance: 'source',
  },

  /* ---------------- NUMERICAL (8) ---------------- */
  {
    id: `${T}-n1`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 3,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A driver guarantees VOH(min) = 2.7 V and a receiver requires VIH(min) = 2.0 V. Calculate the high-state noise margin.',
    hint: 'VNH = VOH(min) − VIH(min).',
    solution: [
      { label: 'Given', content: 'VOH(min) = 2.7 V, VIH(min) = 2.0 V.' },
      { label: 'Equation (source)', content: 'VNH = VOH(min) − VIH(min)' },
      { label: 'Substitution', content: 'VNH = 2.7 − 2.0 = 0.7 V' },
      { label: 'Answer with unit', content: 'VNH = 0.7 V' },
      { label: 'Verification', content: 'Positive, so the HIGH state is guaranteed for this pair.' },
      { label: 'Interpretation', content: '0.7 V of noise can be tolerated on a quiescent HIGH before the receiver misreads it.' },
    ],
    engineeringExplanation: 'The classic TTL-to-TTL margin. Everything that reduces VOH — loading, temperature, supply tolerance — eats directly into it.',
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
    prompt: 'A driver guarantees VOL(max) = 0.5 V and a receiver accepts VIL(max) = 0.8 V. Calculate the low-state noise margin.',
    hint: 'VNL = VIL(max) − VOL(max).',
    solution: [
      { label: 'Given', content: 'VOL(max) = 0.5 V, VIL(max) = 0.8 V.' },
      { label: 'Equation (source)', content: 'VNL = VIL(max) − VOL(max)' },
      { label: 'Substitution', content: 'VNL = 0.8 − 0.5 = 0.3 V' },
      { label: 'Answer with unit', content: 'VNL = 0.3 V' },
      { label: 'Verification', content: 'Positive, so the LOW state is guaranteed.' },
      { label: 'Interpretation', content: 'The LOW-state margin of 0.3 V is the smaller of the two TTL margins — which is why ground bounce is the classic TTL problem.' },
    ],
    engineeringExplanation: 'TTL noise margins are asymmetric: 0.7 V HIGH but only 0.3 V LOW. Design the grounding with the smaller one in mind.',
    provenance: 'insight',
  },
  {
    id: `${T}-n3`,
    topicId: T,
    type: 'numerical',
    level: 2,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A 74LS output drives a 74HC input on 5 V. VOH(min) = 2.7 V, VIH(min) = 3.5 V, VOL(max) = 0.5 V, VIL(max) = 1.5 V. Calculate both margins and state the verdict.',
    hint: 'Compute VNH and VNL separately.',
    solution: [
      { label: 'Given', content: 'VOH(min) = 2.7 V, VIH(min) = 3.5 V, VOL(max) = 0.5 V, VIL(max) = 1.5 V.' },
      { label: 'Equation (source)', content: 'VNH = VOH(min) − VIH(min); VNL = VIL(max) − VOL(max)' },
      { label: 'Substitution', content: 'VNH = 2.7 − 3.5 = −0.8 V. VNL = 1.5 − 0.5 = +1.0 V.' },
      { label: 'Answer with unit', content: 'VNH = −0.8 V (fails); VNL = +1.0 V (passes). Interface NOT valid.' },
      { label: 'Verification', content: 'Only the HIGH state fails, matching the source statement about TTL driving CMOS.' },
      { label: 'Fix', content: 'Pull-up resistor at the TTL output (source), or use a 74HCT receiver.' },
    ],
    engineeringExplanation: 'This is the canonical TTL-to-CMOS failure. Quote it with the numbers whenever the topic comes up.',
    provenance: 'source',
  },
  {
    id: `${T}-n4`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'Using the supplied fan-out expressions and the 74ALS00 example (IOL(max) = 8 mA, IIL(max) = 0.1 mA, IOH(max) = 0.4 mA, IIH(max) = 20 µA), calculate both fan-outs and the usable fan-out.',
    hint: 'Convert 20 µA to mA before dividing.',
    solution: [
      { label: 'Given', content: 'IOL = 8 mA, IIL = 0.1 mA, IOH = 0.4 mA, IIH = 20 µA.' },
      { label: 'Equation (source)', content: 'fan-out(LOW) = IOL/IIL; fan-out(HIGH) = IOH/IIH' },
      { label: 'Substitution', content: 'LOW: 8/0.1 = 80. HIGH: 0.4/0.02 = 20.' },
      { label: 'Answer with unit', content: 'fan-out(LOW) = 80, fan-out(HIGH) = 20, usable fan-out = 20 inputs.' },
      { label: 'Verification', content: 'Matches the source’s own worked result.' },
      { label: 'Interpretation', content: 'The smaller figure governs. Quoting 80 would over-load the output by a factor of four in the HIGH state.' },
    ],
    engineeringExplanation: 'The source picks this example precisely because the two numbers differ by 4×. It is teaching you to take the minimum.',
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
    prompt: 'How much sink current do six 74LS inputs require in the LOW state, if IIL(max) = 0.4 mA each? Is a 74HC output with IOL(max) = 4 mA sufficient?',
    hint: 'Multiply, then compare.',
    solution: [
      { label: 'Given', content: 'Six inputs, IIL = 0.4 mA each, driver IOL = 4 mA.' },
      { label: 'Equation', content: 'I_required = n × IIL' },
      { label: 'Substitution', content: '6 × 0.4 mA = 2.4 mA required, against 4 mA available.' },
      { label: 'Answer with unit', content: '2.4 mA required; 4 mA available — sufficient.' },
      { label: 'Verification', content: 'Fan-out(LOW) = 4/0.4 = 10, and six is less than ten.' },
      { label: 'Interpretation', content: 'Sufficient, but note the margin: at eleven inputs the interface would fail. The source’s caution about CMOS driving TTL is a fan-out caution.' },
    ],
    engineeringExplanation: 'Always leave margin for the fan-out, because IIL rises with temperature and varies between manufacturers.',
    provenance: 'insight',
  },
  {
    id: `${T}-n6`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'The source states that 74S00 sinks 20 mA (12.5 unit loads) and that 74LS sinks 8.0 mA (5 unit loads). Show that both statements imply the same unit load, and state its value.',
    hint: 'Divide each current by its unit-load count.',
    solution: [
      { label: 'Given (source)', content: '74S00: 20 mA = 12.5 unit loads. 74LS: 8.0 mA = 5 unit loads.' },
      { label: 'Equation', content: '1 unit load = IOL / (number of unit loads)' },
      { label: 'Substitution', content: '74S: 20 mA / 12.5 = 1.6 mA. 74LS: 8.0 mA / 5 = 1.6 mA.' },
      { label: 'Answer with unit', content: 'One TTL unit load = 1.6 mA in the LOW state.' },
      { label: 'Verification', content: 'Both currents give the same value, confirming the definition.' },
      { label: 'Interpretation', content: 'A TTL input that presents one unit load sinks 1.6 mA when LOW. Counting unit loads is the traditional way to add up a TTL load.' },
    ],
    engineeringExplanation: 'The source never states the unit load explicitly — it gives you two data points that let you derive it. That is deliberate.',
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
    prompt: 'A TTL output with an open-collector stage drives four CMOS inputs with a 4.7 kΩ pull-up to 5 V. Estimate the current through the pull-up in the LOW state and the resulting rise-time constant if the node has 60 pF of capacitance.',
    hint: 'LOW-state current ≈ VCC/Rp; time constant τ = R × C.',
    solution: [
      { label: 'Given', content: 'VCC = 5 V, Rp = 4.7 kΩ, C = 60 pF, VOL ≈ 0.1 V.' },
      { label: 'Equation (Engineering Insight)', content: 'I_LOW = (VCC − VOL)/Rp ; τ = Rp × C' },
      { label: 'Substitution', content: 'I_LOW = (5 − 0.1)/4.7 kΩ ≈ 1.04 mA. τ = 4.7 kΩ × 60 pF = 282 ns.' },
      { label: 'Answer with unit', content: 'About 1.04 mA in the LOW state; rise-time constant about 282 ns.' },
      { label: 'Verification', content: '1.04 mA is well inside the 8 mA sink capability of a 74LS output, and 282 ns is acceptable for slow status lines but not for a fast clock.' },
      { label: 'Interpretation', content: 'The pull-up sets both the static current and the speed. Lower Rp for speed, higher Rp for power — that is the trade-off.' },
    ],
    engineeringExplanation: 'Always check the RC time constant, not just the DC level. A pull-up that is electrically correct can still be too slow.',
    provenance: 'insight',
  },
  {
    id: `${T}-n8`,
    topicId: T,
    type: 'numerical',
    level: 3,
    marks: 4,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'Ten TTL inputs are tied to VCC through one shared resistor. Each draws IIH = 20 µA and the resistors must not let the voltage fall below 2.4 V. Calculate the maximum allowable resistor value.',
    hint: 'The drop across the resistor must not exceed 5 − 2.4 = 2.6 V.',
    solution: [
      { label: 'Given (source rule)', content: 'Cumulative IIH must not pull the voltage below 2.4 V; VCC = 5 V; ten inputs at 20 µA.' },
      { label: 'Equation (Engineering Insight)', content: 'R ≤ (VCC − 2.4 V) / (n × IIH)' },
      { label: 'Substitution', content: 'Total current = 10 × 20 µA = 200 µA = 0.2 mA. R ≤ 2.6 V / 0.2 mA = 13 kΩ.' },
      { label: 'Answer with unit', content: 'Maximum about 13 kΩ — so a 10 kΩ resistor is acceptable, a 22 kΩ is not.' },
      { label: 'Verification', content: 'At 10 kΩ the drop is 0.2 mA × 10 kΩ = 2.0 V, leaving 3.0 V — above the 2.4 V floor.' },
      { label: 'Interpretation', content: 'The source warns about exactly this when allowing one resistor to serve several inputs. Check the cumulative current, not the per-input current.' },
    ],
    engineeringExplanation: 'A shared pull-up is good practice, but the calculation must use the total current. This is a common review finding.',
    provenance: 'source',
  },

  /* ---------------- INTERFACE ANALYSIS (6) ---------------- */
  {
    id: `${T}-a1`,
    topicId: T,
    type: 'circuit-analysis',
    level: 3,
    marks: 5,
    skill: 'analysis',
    action: 'Analyze',
    prompt:
      'Analyse a 74LS → 74HC interface on 5 V: state which state fails, quote the source rule that describes it, and give the fix.',
    hint: 'Compute VNH and VNL, then match against the source’s interfacing rule.',
    solution: [
      { label: 'Margins', content: 'VNH = 2.7 − 3.5 = −0.8 V (fails). VNL = 1.5 − 0.5 = +1.0 V (passes).' },
      { label: 'Failing state', content: 'The HIGH state. The LOW state is fine.' },
      { label: 'Source rule', content: '“TTL Driving CMOS — Current: no problem. Output voltages: VOH(min) of TTL is too low when compared with VIH(min) of CMOS. Solution: Pull-up resistor at TTL output.”' },
      { label: 'Fix', content: 'Add a pull-up resistor from the TTL output to VCC; the HIGH level then reaches the rail and VNH becomes about +1.5 V.' },
      { label: 'Alternative', content: 'Use a 74HCT receiver, whose input thresholds are TTL compatible.' },
    ],
    engineeringExplanation: 'Knowing which state fails tells you which fix to apply. A buffer would be the wrong answer here — current is not the problem.',
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
      'Analyse a 74HC → 74LS interface on 5 V driving twelve inputs: state which check fails, quote the source rule, and give the fix.',
    hint: 'Levels are fine; count the current.',
    solution: [
      { label: 'Levels', content: '74HC drives 5 V CMOS levels; 74LS accepts VIH(min) = 2.0 V and VIL(max) = 0.8 V. Both margins are comfortably positive.' },
      { label: 'Current', content: 'Twelve inputs need 12 × 0.4 mA = 4.8 mA in the LOW state against a 4 mA guarantee. Fan-out(LOW) = 10, so twelve exceeds it.' },
      { label: 'Source rule', content: '“CMOS Driving TTL — Driving TTL in the HIGH State: no problem. Driving TTL in the LOW State: … concern fan-out problem — use buffer to interface low-current CMOS to high-current TTL.”' },
      { label: 'Fix', content: 'Insert a buffer or line driver, or split the load across two outputs (six each).' },
      { label: 'Note', content: 'The source adds that, except for the 4000B series, 74HC/74HCT have no trouble driving a single TTL load of any series.' },
    ],
    engineeringExplanation: 'The opposite failure to TTL→CMOS. Naming the direction correctly is half the marks.',
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
    prompt: 'Analyse a 5 V TTL output driving 10 V CMOS: state the two options the source gives for this case.',
    hint: 'It is called “driving high-voltage CMOS”.',
    solution: [
      { label: 'Problem', content: 'The HIGH level fails by a wide margin: a 5 V TTL output cannot reach the VIH(min) of a 10 V CMOS input.' },
      { label: 'Option 1 (source)', content: 'Use a TTL series from certain manufacturers that can operate with a high-voltage output pull-up.' },
      { label: 'Option 2 (source)', content: 'Utilise a voltage level translator.' },
      { label: 'Engineering note', content: 'A pull-up to 10 V pulls the TTL output above its own supply when HIGH, so only parts specifically rated for it may be used — otherwise the output clamp diodes conduct and the part can be damaged.' },
    ],
    engineeringExplanation: 'Never pull a 5 V output up to a higher rail unless the datasheet explicitly permits it. That is what the level translator is for.',
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
      'Analyse why TTL totem-pole outputs and conventional CMOS outputs must never be tied together, and explain how open-collector and tri-state each solve the problem. State the advantage and the cost of each.',
    hint: 'What is the voltage when one output drives HIGH and another drives LOW?',
    solution: [
      { label: 'Fault (source)', content: 'The output voltage lands in the indeterminate range and the ICs can be damaged, because one output sources while the other sinks — a direct low-resistance path between the rails.' },
      { label: 'Open-collector / open-drain (source)', content: 'Removes the active pull-up transistor; the HIGH state is created by an external pull-up resistor Rp. Advantage: outputs can be tied together safely, giving wired-AND. Cost: an external resistor, a slower rise time set by RC, and extra current when the line is LOW.' },
      { label: 'Tri-state (source)', content: 'Both pull-up and pull-down are disabled, giving a high-impedance state. Advantage: full active drive in both directions when enabled, so the bus is fast. Cost: the enable control must guarantee that only one device drives at a time, and the disabled output still contributes leakage.' },
      { label: 'Selection', content: 'Open-drain for a slow shared status or interrupt line with several possible sources; tri-state for a fast bidirectional data bus.' },
    ],
    engineeringExplanation: 'Both solve bus contention. Choose on speed and on how many devices may need to assert the line.',
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
    prompt:
      'Analyse the input behaviour of a TTL gate: describe the current in each of the four voltage regions the supplied material identifies.',
    hint: '2.0–5.5 V, below 2.0 V, 1.0 to −0.5 V, below −0.7 V.',
    solution: [
      { label: '2.0 V to 5.5 V (source)', content: 'Only the input leakage current IIH flows, guaranteed not to exceed 40 µA or 50 µA depending on the family, for a single input.' },
      { label: 'Below 2.0 V (source)', content: 'Current starts flowing out of the input and increases rapidly — the transition region, with a slope of about 200 Ω.' },
      { label: '1.0 V to −0.5 V (source)', content: 'The slope equals the gate pull-up resistor, about 2 kΩ.' },
      { label: 'Below about −0.7 V (source)', content: 'The input clamping diode conducts and the current increases rapidly.' },
      { label: 'Design use', content: 'This is why a TTL input left open floats at a poorly defined HIGH and why negative undershoot is absorbed by the clamp diode rather than by the input structure.' },
    ],
    engineeringExplanation: 'Learn the four regions. They explain floating-input behaviour, undershoot clamping and why an input can source significant current when held LOW.',
    provenance: 'source',
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
      'Analyse the trade-offs in choosing a pull-up resistor Rp for an open-collector line: state the two inequalities that bound it and what each one protects against.',
    hint: 'One bound is set by the HIGH state, one by the LOW state.',
    solution: [
      { label: 'Upper bound (HIGH state)', content: 'Rp must be small enough to supply the total HIGH-state leakage and still hold a valid HIGH: Rp(max) = (VCC − VIH(min))/(n·IIH + leakage). Too large and the HIGH level is never reached.' },
      { label: 'Lower bound (LOW state)', content: 'Rp must be large enough that the sinking transistor is not overloaded: Rp(min) = (VCC − VOL(max))/(IOL − n·IIL). Too small and VOL rises above its guaranteed maximum.' },
      { label: 'Speed', content: 'The rise time is set by Rp × C. Lower Rp is faster but burns more current when the line is LOW.' },
      { label: 'Selection', content: 'Choose a standard value between the bounds, nearer Rp(min) when speed matters and nearer Rp(max) when power matters.' },
    ],
    engineeringExplanation: 'Designing a pull-up is a two-sided calculation. Most field problems come from respecting only one side.',
    provenance: 'insight',
  },

  /* ---------------- DESIGN (4) ---------------- */
  {
    id: `${T}-d1`,
    topicId: T,
    type: 'circuit-design',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Design',
    prompt: 'Design the interface between a 5 V 74LS output and four 5 V 74HC inputs. Specify every added component with a value and justify it.',
    hint: 'Fix the HIGH state, then check that the fix does not break the LOW state.',
    solution: [
      { label: 'Problem', content: 'VNH = 2.7 − 3.5 = −0.8 V. The HIGH state is not guaranteed.' },
      { label: 'Fix', content: 'One pull-up resistor from the 74LS output to +5 V.' },
      { label: 'Value', content: 'Rp(min) ≈ (5 − 0.5)/(8 mA − 4 × 1 µA) ≈ 563 Ω. Rp(max) is very large because CMOS inputs leak about 1 µA. Choose 4.7 kΩ.' },
      { label: 'Check', content: 'LOW state: (5 − 0.1)/4.7 kΩ ≈ 1.04 mA through the pull-up, well inside the 8 mA sink capability, so VOL stays valid. HIGH state: node reaches ≈ 5 V, so VNH ≈ 1.5 V.' },
      { label: 'Speed', content: 'With four inputs at about 5 pF plus wiring, say 40 pF: τ = 4.7 kΩ × 40 pF ≈ 188 ns — fine for a status line, too slow for a fast clock.' },
    ],
    engineeringExplanation: 'State both bounds even when one is not binding. It shows the check was done rather than guessed.',
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
    prompt: 'Design a shared fault line asserted by five open-drain devices on a 5 V board. Specify the output type, the resistor, and the control rule.',
    hint: 'One resistor for the whole line, sized from the worst-case LOW-state current.',
    solution: [
      { label: 'Topology', content: 'Open-drain (or open-collector) outputs wired-AND, with a single pull-up resistor to 5 V.' },
      { label: 'Why not totem-pole (source)', content: 'Conventional CMOS outputs and TTL totem-pole outputs should never be tied together — the output voltage lands in the indeterminate range and the ICs can be damaged.' },
      { label: 'Resistor', content: 'Rp(min) = (VCC − VOL)/(IOL of the strongest single driver). With IOL = 8 mA: (5 − 0.4)/8 mA ≈ 575 Ω. Choose 4.7 kΩ: LOW-state current about 1 mA, comfortably safe.' },
      { label: 'Speed', content: 'Five devices plus wiring, say 60 pF: τ ≈ 282 ns. Acceptable for a fault line that is polled, not clocked.' },
      { label: 'Control rule', content: 'Any device may assert the line by pulling LOW; the line is HIGH only when no device asserts it. No enable arbitration is needed, which is the advantage over tri-state.' },
    ],
    engineeringExplanation: 'Wired-AND with open drain needs no arbitration — that is why it is used for interrupts and fault lines, while tri-state is used for data buses.',
    provenance: 'source',
  },
  {
    id: `${T}-d3`,
    topicId: T,
    type: 'component-selection',
    level: 4,
    marks: 5,
    skill: 'design',
    action: 'Select',
    prompt: 'You must add a CMOS counter to an existing 74LS TTL board running on 5 V, with no space for extra resistors. Select the family and justify it against the alternatives.',
    hint: 'One CMOS family has TTL-compatible input thresholds.',
    solution: [
      { label: 'Selection', content: '74HCT.' },
      { label: 'Why', content: 'HCT inputs have TTL-compatible thresholds, so a 74LS output driving an HCT input has a positive HIGH-state margin without a pull-up. The source’s TTL→CMOS problem — VOH(min) too low for VIH(min) — is designed out by the part number.' },
      { label: 'Contrast with 74HC', content: '74HC inputs require VIH(min) ≈ 3.5 V at 5 V, giving VNH = −0.8 V and requiring a pull-up.' },
      { label: 'Contrast with 4000B', content: 'The source states the 4000 series is not pin-compatible or electrically compatible with any TTL series, is slow and has low output current — unsuitable for a 5 V TTL board.' },
      { label: 'Bonus', content: '74HC/HCT are pin-compatible with, and functionally equivalent to, TTL ICs with the same device number, so the board layout barely changes.' },
    ],
    engineeringExplanation: 'Choosing the right family removes a problem instead of adding a component. That is usually the better engineering answer.',
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
    prompt:
      'Design the termination of the unused inputs on a board containing counters, latches and NAND gates in 74LS. Give the rule for each type and the constraint the source places on shared resistors.',
    hint: 'Memory devices first, then logic inputs, then the resistor-sharing rule.',
    solution: [
      { label: 'Memory devices (source)', content: 'On flip-flops, latches, registers and counters it is particularly important to terminate MR, PE, PL and CP properly, because a noise spike on these inputs might change the stored contents.' },
      { label: 'Logic inputs (source)', content: 'For a permanent HIGH, tie unused inputs to VCC. A current-limiting resistor of 1 kΩ to 5 kΩ is recommended for emitter-type inputs, since these break down at some unspecified voltage above 5.5 V.' },
      { label: 'LS-TTL exception (source)', content: 'Diode-type LS-TTL inputs have breakdown voltages above 15 V, so protective resistors are not normally required.' },
      { label: 'Sharing (source)', content: 'One resistor can serve several inputs provided the cumulative IIH current does not cause the voltage to drop below 2.4 V.' },
      { label: 'Tying to a used input (source)', content: 'An unused input may be tied to a used input with the same logic function (NAND, AND) provided the driver can handle the added IIH — not recommended for diode-type LS inputs in a noisy environment.' },
    ],
    engineeringExplanation: 'Unused-input termination is a review checklist item, not a detail. Every floating pin is a future intermittent fault.',
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
      'A 74LS counter counts correctly on the bench but jumps by two or three when a nearby relay switches or a hand approaches the board. The clock has been scoped and is clean. Diagnose and fix.',
    hint: 'Which pins are not being driven at all?',
    solution: [
      { label: 'Symptom', content: 'Spurious counts correlated with external electrical noise, not with the clock.' },
      { label: 'Analysis', content: 'Unused inputs (MR, PE, a second CP) are unconnected. The source states an unconnected input theoretically assumes HIGH but practically is undefined because it acts as an antenna for noise, and that only a few hundred millivolts can drive it LOW.' },
      { label: 'Diagnosis', content: 'Floating unused control inputs are picking up noise and changing the stored count.' },
      { label: 'Fix', content: 'Terminate every unused input: tie to VCC through a 1 kΩ to 5 kΩ resistor for emitter-type inputs, or tie to a used input with the same function.' },
      { label: 'Prevention', content: 'Make “no floating inputs” a schematic review checklist item.' },
    ],
    engineeringExplanation: 'Intermittent faults correlated with external events are almost always floating inputs or inadequate grounding — not faulty silicon.',
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
      'A 74LS output drives a 74HC input directly on 5 V. It worked for weeks on the bench; one unit in five in production misreads HIGH as LOW, worse when warm. Find the design error.',
    hint: 'Compare the guaranteed levels, not the measured ones.',
    solution: [
      { label: 'Measured vs guaranteed', content: 'The bench unit measured 2.9 V; the guaranteed VOH(min) is 2.7 V, and the required VIH(min) is 3.5 V.' },
      { label: 'Analysis', content: 'VNH = 2.7 − 3.5 = −0.8 V using guaranteed values. The interface was never valid — the bench unit was lucky.' },
      { label: 'Why batch and temperature matter', content: 'Output level varies between devices and falls slightly with temperature, so units cross the switching threshold of the particular CMOS input they were paired with.' },
      { label: 'Fix (source)', content: 'Pull-up resistor at the TTL output, or use a 74HCT receiver with TTL-compatible thresholds.' },
      { label: 'Prevention', content: 'Design to worst-case guaranteed limits and treat a negative noise margin as a defect.' },
    ],
    engineeringExplanation: 'A prototype that works is not evidence that a design is correct. Margins are computed, not observed.',
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
    prompt: 'Predict what happens if a pull-up resistor on a shared open-drain line is changed from 4.7 kΩ to 47 kΩ, and then to 470 Ω.',
    hint: 'One extreme breaks the HIGH level and the speed; the other breaks the LOW level and the power.',
    solution: [
      { label: '47 kΩ (too large)', content: 'The HIGH level may still be reached at DC, but the rise time becomes about ten times longer — roughly 2.8 µs with 60 pF — so a signal sampled quickly may never be seen as HIGH. Noise immunity also falls because the node is weakly held.' },
      { label: '470 Ω (too small)', content: 'LOW-state current becomes about (5 − 0.1)/470 ≈ 10.4 mA, which exceeds the 8 mA sink capability of a 74LS output. VOL rises above its guaranteed maximum and the LOW-state noise margin disappears.' },
      { label: 'Answer', content: 'Too large: slow and weakly held HIGH. Too small: invalid LOW and wasted power. Both bounds must be respected.' },
    ],
    engineeringExplanation: 'Every pull-up is a two-sided design. Being “roughly right” on one side is still a defect.',
    provenance: 'insight',
  },
  {
    id: `${T}-w4`,
    topicId: T,
    type: 'whatif',
    level: 3,
    marks: 4,
    skill: 'analysis',
    action: 'Predict',
    prompt: 'Predict what happens on a tri-state bus if two devices are enabled simultaneously while driving opposite levels, and state how the design should prevent it.',
    hint: 'The source warns about tying active outputs together.',
    solution: [
      { label: 'Prediction', content: 'One output sources while the other sinks, so the bus voltage lands in the indeterminate range between valid LOW and valid HIGH. Large current flows between the rails through the two output transistors.' },
      { label: 'Consequence (source)', content: 'The output voltage is in the indeterminate range and the ICs can be damaged.' },
      { label: 'Logic effect', content: 'Every receiver on the bus sees an invalid level, so the data transfer is corrupted — often intermittently, depending on the exact drive strengths.' },
      { label: 'Prevention', content: 'Design the enable logic so that only one driver can be active: decode the enables from a single source, insert a dead time between one device releasing the bus and the next taking it, and never rely on software timing alone.' },
    ],
    engineeringExplanation: 'Bus contention is a destructive fault, not just a data error. Dead-time in the enable decoding is the standard defence.',
    provenance: 'source',
  },

  /* ---------------- VIVA (4) ---------------- */
  {
    id: `${T}-v1`,
    topicId: T,
    type: 'viva',
    level: 3,
    marks: 3,
    skill: 'viva',
    action: 'Explain why',
    prompt: 'Why can a TTL output fail to reliably drive a CMOS input even when both run on the same 5 V supply?',
    hint: 'Which state fails, and which parameter is short?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Because the guaranteed HIGH output of TTL (VOH(min) ≈ 2.7 V) is below the minimum HIGH input CMOS requires (VIH(min) ≈ 3.5 V at 5 V). The high-state noise margin VNH = VOH(min) − VIH(min) is therefore negative. The source states this exactly: current is no problem; VOH(min) of TTL is too low compared with VIH(min) of CMOS. The fix is a pull-up resistor at the TTL output, or a 74HCT receiver.',
      },
    ],
    engineeringExplanation: 'The strong answer adds that it worked on the bench because the particular device exceeded its guaranteed minimum — which is why margins are computed, not measured.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'Current is fine, you say. How do you know?',
        expected: 'A CMOS input draws about 1 µA, while a TTL output can sink 8 mA — the current ratio is enormous, so the failure is purely a voltage-level one.',
      },
      {
        teacher: 'What if I just use a bigger pull-down instead?',
        expected: 'That does not help. The HIGH state is the one that falls short; the node must be pulled UP, not down.',
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
    prompt: 'Why is fan-out limited, and why must you check it in both logic states?',
    hint: 'What happens to the output voltage when you exceed the current capability?',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Every input draws current, and the output transistor can only supply a finite current while still guaranteeing its output voltage. Exceed IOL and VOL rises until the receiver no longer sees a valid LOW; exceed IOH and VOH falls until the receiver no longer sees a valid HIGH. Because the two currents are very different — TTL inputs sink far more when LOW than they source when HIGH — you must compute fan-out(LOW) = IOL/IIL and fan-out(HIGH) = IOH/IIH and take the smaller.',
      },
    ],
    engineeringExplanation: 'Fan-out is the voltage noise margin expressed in current units. That single sentence shows you understand it rather than memorised it.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'In the source’s 74ALS00 example the figures are 80 and 20. What do you use?',
        expected: '20 — the smaller. Quoting 80 would overload the output by four times in the HIGH state.',
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
    prompt: 'Why should CMOS inputs never be left floating?',
    hint: 'The source calls it an antenna.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'A CMOS input is an extremely high-impedance node, so a floating pin picks up whatever electric field is around it and settles at an unpredictable voltage — it may sit in the indeterminate region between valid LOW and valid HIGH, where both output transistors can conduct partially, drawing excess current and possibly oscillating. The source makes the same point for TTL: an unconnected input theoretically assumes HIGH but practically is undefined because it acts as an antenna for noise, and a few hundred millivolts can drive it LOW.',
      },
    ],
    engineeringExplanation: 'Add the consequence: on a memory device a spike on MR, PE, PL or CP can change the stored contents — which is why the source singles those pins out.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'How do you terminate them?',
        expected:
          'Tie to VCC, with a 1 kΩ to 5 kΩ current-limiting resistor for emitter-type TTL inputs because they break down above 5.5 V; or tie to a used input with the same logic function provided the driver can handle the added IIH.',
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
    action: 'Justify',
    prompt: 'Why is an open-collector output useful, and what does it cost you?',
    hint: 'Think about sharing a line, then about speed and power.',
    solution: [
      {
        label: 'Expected answer',
        content:
          'Removing the active pull-up transistor means several outputs can be tied to one line safely — the source notes that conventional CMOS and TTL totem-pole outputs must never be tied together because the voltage lands in the indeterminate range and the ICs can be damaged. The tied open-collector or open-drain outputs give a wired-AND function, which is ideal for interrupt and fault lines. The cost is an external pull-up resistor, a rise time set by RC rather than by an active transistor, and continuous current through the resistor whenever the line is LOW.',
      },
    ],
    engineeringExplanation: 'Say what it costs, not only what it buys. Every reviewer listens for the cost.',
    provenance: 'source',
    followUps: [
      {
        teacher: 'When would you choose tri-state instead?',
        expected: 'For a fast bidirectional data bus, where active drive in both directions matters — but then the enable logic must guarantee only one driver is active at a time.',
      },
    ],
  },

  /* ---------------- MCQ (12) ---------------- */
  {
    id: `${T}-q1`,
    topicId: T,
    type: 'mcq',
    level: 1,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'The high-state noise margin is:',
    options: [
      { id: 'a', text: 'VOH(min) − VIH(min)' },
      { id: 'b', text: 'VIH(min) − VOH(min)' },
      { id: 'c', text: 'VIL(max) − VOL(max)' },
      { id: 'd', text: 'VOH(min) + VIH(min)' },
    ],
    answerId: 'a',
    hint: 'Driver output minus receiver requirement.',
    solution: [{ label: 'Answer', content: '(a) VNH = VOH(min) − VIH(min)' }],
    engineeringExplanation: '(c) is the LOW-state margin. Learning them as a pair prevents swapping them under pressure.',
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
    prompt: 'The low-state noise margin is:',
    options: [
      { id: 'a', text: 'VOL(max) − VIL(max)' },
      { id: 'b', text: 'VIL(max) − VOL(max)' },
      { id: 'c', text: 'VOH(min) − VIH(min)' },
      { id: 'd', text: 'VIL(max) + VOL(max)' },
    ],
    answerId: 'b',
    hint: 'Receiver acceptance limit minus driver output limit.',
    solution: [{ label: 'Answer', content: '(b) VNL = VIL(max) − VOL(max)' }],
    engineeringExplanation: 'Both margins are “what is guaranteed minus what is required”, which is why both must be positive.',
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
    prompt: 'Fan-out in the LOW state is given by:',
    options: [
      { id: 'a', text: 'IOH(max)/IIH(max)' },
      { id: 'b', text: 'IOL(max)/IIL(max)' },
      { id: 'c', text: 'IOL(max)/IIH(max)' },
      { id: 'd', text: 'VOH(min)/VIH(min)' },
    ],
    answerId: 'b',
    hint: 'Match the state: LOW output current against LOW input current.',
    solution: [{ label: 'Answer', content: '(b) IOL(max)/IIL(max)' }],
    engineeringExplanation: 'Keep the states matched. Mixing them is the most common arithmetic slip in this topic.',
    provenance: 'source',
  },
  {
    id: `${T}-q4`,
    topicId: T,
    type: 'mcq',
    level: 2,
    marks: 1,
    skill: 'concept',
    action: 'Select',
    prompt: 'When TTL drives CMOS at the same 5 V supply, the source identifies the problem as:',
    options: [
      { id: 'a', text: 'Excessive current demand' },
      { id: 'b', text: 'VOH(min) of TTL too low compared with VIH(min) of CMOS' },
      { id: 'c', text: 'VOL(max) of TTL too high' },
      { id: 'd', text: 'Excessive propagation delay' },
    ],
    answerId: 'b',
    hint: 'The source says current is no problem in this direction.',
    solution: [{ label: 'Answer', content: '(b) VOH(min) of TTL too low compared with VIH(min) of CMOS' }],
    engineeringExplanation: 'The fix follows from the diagnosis: a pull-up resistor lifts the HIGH level, which a buffer would not do.',
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
    prompt: 'When CMOS drives TTL, the source identifies the concern as:',
    options: [
      { id: 'a', text: 'The HIGH-state voltage level' },
      { id: 'b', text: 'The fan-out problem in the LOW state' },
      { id: 'c', text: 'Input leakage in the HIGH state' },
      { id: 'd', text: 'Propagation delay' },
    ],
    answerId: 'b',
    hint: 'TTL inputs sink real current when LOW.',
    solution: [
      { label: 'Answer', content: '(b) The fan-out problem in the LOW state' },
      { label: 'Fix (source)', content: 'Use a buffer to interface low-current CMOS to high-current TTL.' },
    ],
    engineeringExplanation: 'Note the exception the source gives: except for 4000B, 74HC/74HCT have no trouble driving a single TTL load.',
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
    prompt: 'The recommended fix for TTL driving high-voltage CMOS, per the source, is:',
    options: [
      { id: 'a', text: 'A larger pull-up resistor' },
      { id: 'b', text: 'A TTL series rated for a high-voltage output pull-up, or a voltage level translator' },
      { id: 'c', text: 'A series termination resistor' },
      { id: 'd', text: 'Slowing the clock' },
    ],
    answerId: 'b',
    hint: 'The source gives exactly two options for high-voltage CMOS.',
    solution: [{ label: 'Answer', content: '(b)' }],
    engineeringExplanation: 'Never pull a 5 V output above its own supply unless the datasheet explicitly permits it — the clamp diodes will conduct.',
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
    prompt: 'An open-collector or open-drain output:',
    options: [
      { id: 'a', text: 'Needs an external pull-up resistor to produce the HIGH state' },
      { id: 'b', text: 'Drives HIGH actively and needs a pull-down' },
      { id: 'c', text: 'Cannot be connected to any other output' },
      { id: 'd', text: 'Is always faster than a totem-pole output' },
    ],
    answerId: 'a',
    hint: 'The active pull-up transistor has been removed.',
    solution: [{ label: 'Answer', content: '(a)' }],
    engineeringExplanation: 'The pull-up sets the HIGH level, the rise time and the LOW-state current — all three must be checked.',
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
    prompt: 'According to the source, tying TTL totem-pole outputs together:',
    options: [
      { id: 'a', text: 'Increases fan-out safely' },
      { id: 'b', text: 'Puts the output voltage in the indeterminate range and can damage the ICs' },
      { id: 'c', text: 'Creates a wired-AND function' },
      { id: 'd', text: 'Reduces power consumption' },
    ],
    answerId: 'b',
    hint: 'The source is explicit that this must never be done.',
    solution: [{ label: 'Answer', content: '(b)' }],
    engineeringExplanation: 'Wired-AND requires open-collector or open-drain, not totem-pole. That distinction is the whole reason the output types exist.',
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
    prompt: 'For a permanent HIGH on an unused emitter-type TTL input, the source recommends:',
    options: [
      { id: 'a', text: 'Leaving it unconnected' },
      { id: 'b', text: 'Tying it to VCC through a 1 kΩ to 5 kΩ current-limiting resistor' },
      { id: 'c', text: 'Tying it directly to ground' },
      { id: 'd', text: 'Connecting it to the output of the same gate' },
    ],
    answerId: 'b',
    hint: 'These inputs break down above 5.5 V.',
    solution: [{ label: 'Answer', content: '(b)' }],
    engineeringExplanation: 'LS-TTL diode inputs break down above 15 V, so protective resistors are not normally needed for those — but emitter-type inputs do need them.',
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
    prompt: 'The 4000/14000 CMOS series, per the source:',
    options: [
      { id: 'a', text: 'Is pin-compatible with TTL' },
      { id: 'b', text: 'Operates over 3 to 15 V but is slow and has low output current' },
      { id: 'c', text: 'Is faster than 74HC' },
      { id: 'd', text: 'Matches 74LS in speed' },
    ],
    answerId: 'b',
    hint: 'Wide supply range, low power, slow.',
    solution: [
      { label: 'Answer', content: '(b)' },
      { label: 'Also (source)', content: 'Not pin-compatible or electrically compatible with any TTL series.' },
    ],
    engineeringExplanation: 'If a design mixes 4000-series CMOS with TTL, both level translation and buffering are needed.',
    provenance: 'source',
  },
  {
    id: `${T}-q11`,
    topicId: T,
    type: 'mcq',
    level: 3,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'If 74S00 sinks 20 mA at 12.5 unit loads, one TTL unit load is:',
    options: [
      { id: 'a', text: '1.6 mA' },
      { id: 'b', text: '0.4 mA' },
      { id: 'c', text: '20 mA' },
      { id: 'd', text: '8 mA' },
    ],
    answerId: 'a',
    hint: 'Divide the current by the unit-load count.',
    solution: [{ label: 'Answer', content: '(a) 20 mA / 12.5 = 1.6 mA' }],
    engineeringExplanation: 'Cross-check with the 74LS figure the source also gives: 8.0 mA / 5 = 1.6 mA. Same answer.',
    provenance: 'source',
  },
  {
    id: `${T}-q12`,
    topicId: T,
    type: 'mcq',
    level: 3,
    marks: 1,
    skill: 'numerical',
    action: 'Calculate',
    prompt: 'A driver with IOL(max) = 4 mA drives inputs with IIL(max) = 0.4 mA. The fan-out is:',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '10' },
      { id: 'c', text: '16' },
      { id: 'd', text: '0.1' },
    ],
    answerId: 'b',
    hint: 'Fan-out(LOW) = IOL/IIL.',
    solution: [{ label: 'Answer', content: '(b) 4/0.4 = 10' }],
    engineeringExplanation: 'Remember that the HIGH-state figure must also be computed; the usable fan-out is the smaller of the two.',
    provenance: 'insight',
  },
]

export const TOPIC4_SECTIONS = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Interface Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
] as const
