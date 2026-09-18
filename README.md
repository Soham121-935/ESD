# ESD Learning Lab

Engineering learning and examination laboratory for **TY E&TC — Electronic System Design
(UETPE0513)**, built from the course PDFs supplied in this repository.

Course coordinator: Prof. A. R. Nigavekar (per the supplied assignment sheet).

## Running it

```bash
npm install
npm run dev        # dev server on 0.0.0.0:5173
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run smoke      # SSR render of every page/component + data integrity checks
npm run mounttest  # boots the real app in jsdom and drives the UI (88 assertions)
npm test           # all three
```

## Source integrity

Every piece of content carries one of two provenance labels, shown in the UI:

| Label | Meaning |
| --- | --- |
| **Source material** | Supported by the supplied course PDFs. Terminology and values are preserved verbatim. |
| **Engineering Insight** | General engineering knowledge added by us. Never presented as source-derived. |

Primary sources used so far:

- `Classification & reliability.pdf` — classification table (Consumer / Industry / Military) and
  the definition of ergonomics.
- `TY ESD 2026 ISE1.pdf` — the Unit 1 assignment questions (course plan).
- `ESD_Master_Knowledge_Document_Arena_AI.pdf` — implementation blueprint and integrity rules.
- Op-amp and TTL/CMOS PDFs are in the repository and are the intended sources for Topics 3 and 4.

Rules followed: units are visible in every calculation; source assumptions are never silently
changed; where the source does not support a detail, the gap is stated rather than filled.

## Current state

**Unit 1 — all six topics are built.**

| # | Topic | Status | Questions |
| --- | --- | --- | --- |
| 1 | Electronic System Classification | complete | 40 |
| 2 | System Reliability | complete | 65 |
| 3 | Op-Amp Characteristics | complete | 52 |
| 4 | TTL and CMOS | complete | 45 |
| 5 | System Performance Matrix | complete | 25 |
| 6 | Design Matrix | complete | 25 |

**Unit 1 total: 252 questions**, plus a separate **35-question / 160-mark final test paper**.

### Unit 1 final test (Sections A–H)

A full-length paper at `/u1/test`, covering all six topics:

| Section | Content | Marks each | Questions |
| --- | --- | --- | --- |
| A | Fundamentals — definitions you must own | 2 | 10 |
| B | Numericals — one concept, one calculation, units shown | 4 | 4 |
| C | Circuit & system analysis with a verification step | 8 | 3 |
| D | Circuit design with an error budget | 8 | 3 |
| E | Component & class selection with justification | 4 | 3 |
| F | Troubleshooting — symptom → measurement → fix → verify | 4 | 4 |
| G | What-if analysis — how much margin does a change consume? | 4 | 4 |
| H | Long answers — the supplied assignment questions | 8 | 4 |

Every question carries a hint, a worked model answer, a published marking scheme and an
engineering explanation. The page has a countdown timer, self-marking (full / half / zero) that is
stored locally, and a result screen that reports accuracy by section, by topic and by skill, names
the weak areas, and links straight back to the topic that needs revision.

Topic 1 — three study modes (Beginner / Intermediate / Exam-8-mark), interactive system block
diagram, the supplied comparison matrix, a numerical solver with a temperature-margin what-if
simulator, a design challenge, two debugging cases, viva engine with follow-up chains, quiz engine,
exam mode, a 40-question filterable question bank, and local progress tracking with weak-area
analysis.

Topic 2 — interactive reliability explorer for R(t) = e^(−λt) including the source's own anchor
point (t = m → R = 37%), an interactive bathtub curve with per-region causes and improvement
actions at component and system level, a stress-severity toggle (source Graph A / Graph B), four
worked numerical problems, a reliability design challenge and two fault cases.

Topic 3 — the supplied inverting-amplifier problem (R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, 2 kΩ load,
IQ = 0.5 mA) as an interactive lab and a step-by-step solver, with the supply rails declared as an
explicit assumption because the assignment does not state them. Plus VOS / IB / IOS / drift / CMRR
budgets from the supplied device tables, six worked problems, a shunt-monitor design challenge and
two fault cases (saturation, missing compensation resistor).

Topic 4 — logic interface analyser: pick a driver and a receiver, read VNH and VNL, both fan-out
figures and a current check, with the source's interfacing rules driving the verdict. Plus fan-out
and noise-margin problems, a mixed-family board design challenge, and two fault cases (floating
inputs, the TTL→CMOS HIGH-state failure).

Topics 5 and 6 — a weighted matrix builder used for the performance matrix and the design matrix,
plus review fault sections that teach you to audit someone else's matrix. Every score in these
tables runs in the "5 is best" direction, so cost is entered as affordability and complexity as
simplicity; the builder still supports a ↓ (lower-is-better) direction for datasheet-style inputs,
and inverts those before weighting.

## Architecture

```
src/
  types.ts                 shared content + question model
  lib/progress.tsx         localStorage-backed progress, accuracy by skill
  lib/utils.ts             answer normalisation and numeric parsing
  data/unit1/unit1.ts      Unit 1 meta (six topics)
  data/unit1/topic1.ts     Topic 1 content, questions, problems, design + debug cases
  data/unit1/finalTest.ts  the Unit 1 final test paper (Sections A–H)
  components/              reusable teaching components
  pages/                   Topic pages, Unit1BankPage, Unit1TestPage, PlannedTopicPage
```

Reusable components: `LearnFlow`, `ConceptCard`, `WhyButton`, `StepBuilder`, `InteractiveCircuit`,
`ParameterSlider`, `NumericalSolver`, `TemperatureWindowSim`, `PerformanceMatrix`,
`DesignChallenge`, `DebugLab`, `QuizEngine`, `VivaEngine`, `QuestionBank`, `ProgressTracker`,
`ModeSwitcher`.
