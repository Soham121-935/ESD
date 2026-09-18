import { MatrixTopicPage } from './MatrixTopicPage'
import {
  DESIGN_OPTIONS,
  DESIGN_PARAMS,
  DM_DESIGN,
  DM_REVIEW_FAULTS,
  SOURCE_NOTE6,
  TOPIC6,
  TOPIC6_MODES,
  TOPIC6_QUESTIONS,
  TOPIC6_SECTIONS,
} from '../data/unit1/topic6'

export function Topic6Page() {
  return (
    <MatrixTopicPage
      topic={TOPIC6}
      sourceNote={SOURCE_NOTE6}
      modes={TOPIC6_MODES}
      params={DESIGN_PARAMS}
      options={DESIGN_OPTIONS}
      matrixTitle="Design matrix — transmitter architecture"
      matrixNote="Three candidate architectures scored on six design parameters. Power, cost and complexity are inverted because lower is better. Set the power weight to its maximum and watch the redundant architecture fall away."
      design={DM_DESIGN}
      questions={TOPIC6_QUESTIONS}
      sections={TOPIC6_SECTIONS}
      examBlurb="Unit 1 Q.3 asks: “Explain how System Performance Matrix and Design Matrix is used for decision-making during product development and system design.” The Theory tab in Exam Mode writes the complete 8-mark answer with both matrices defined, distinguished and constructed, plus the marking scheme."
      reviewFaults={DM_REVIEW_FAULTS}
    />
  )
}
