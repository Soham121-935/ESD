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
npm run mounttest  # boots the real app in jsdom and drives the UI (25 assertions)
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

**Unit 1 → Topic 1 — Electronic System Classification: complete.**
**Unit 1 → Topic 2 — System Reliability: complete.**

Topic 1 — three study modes (Beginner / Intermediate / Exam-8-mark), interactive system block
diagram, the supplied comparison matrix, a numerical solver with a temperature-margin what-if
simulator, a design challenge, two debugging cases, viva engine with follow-up chains, quiz engine,
exam mode, a 40-question filterable question bank, and local progress tracking with weak-area
analysis.

Topic 2 — interactive reliability explorer for R(t) = e^(−λt) including the source's own anchor
point (t = m → R = 37%), an interactive bathtub curve with per-region causes and improvement
actions at component and system level, a stress-severity toggle (source Graph A / Graph B), four
worked numerical problems, a reliability design challenge, two fault cases, and a 65-question bank.
Combined Unit 1 bank: 105 questions.

Topics 3–6 are routed but display a "not built yet" placeholder. They will be built topic by topic
in subsequent passes.

## Architecture

```
src/
  types.ts                 shared content + question model
  lib/progress.tsx         localStorage-backed progress, accuracy by skill
  lib/utils.ts             answer normalisation and numeric parsing
  data/unit1/unit1.ts      Unit 1 meta (six topics)
  data/unit1/topic1.ts     Topic 1 content, questions, problems, design + debug cases
  components/              reusable teaching components
  pages/                   Topic1Page, PlannedTopicPage
```

Reusable components: `LearnFlow`, `ConceptCard`, `WhyButton`, `StepBuilder`, `InteractiveCircuit`,
`ParameterSlider`, `NumericalSolver`, `TemperatureWindowSim`, `PerformanceMatrix`,
`DesignChallenge`, `DebugLab`, `QuizEngine`, `VivaEngine`, `QuestionBank`, `ProgressTracker`,
`ModeSwitcher`.
