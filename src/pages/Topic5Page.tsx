import { MatrixTopicPage } from './MatrixTopicPage'
import {
  PM_DESIGN,
  PM_OPTIONS,
  PM_PARAMS,
  PM_REVIEW_FAULTS,
  SOURCE_NOTE5,
  TOPIC5,
  TOPIC5_MODES,
  TOPIC5_QUESTIONS,
  TOPIC5_SECTIONS,
} from '../data/unit1/topic5'

export function Topic5Page() {
  return (
    <MatrixTopicPage
      topic={TOPIC5}
      sourceNote={SOURCE_NOTE5}
      modes={TOPIC5_MODES}
      params={PM_PARAMS}
      options={PM_OPTIONS}
      matrixTitle="Performance matrix — selecting a product class"
      matrixNote="The six parameters are drawn from the supplied classification table, with cost and maintenance inverted because lower is better. Move a weight and watch the ranking change."
      design={PM_DESIGN}
      questions={TOPIC5_QUESTIONS}
      sections={TOPIC5_SECTIONS}
      examBlurb="Unit 1 Q.3 asks: “Explain how System Performance Matrix and Design Matrix is used for decision-making during product development and system design.” The Theory tab in Exam Mode writes the complete 8-mark answer with the supplied table named as the model and the marking scheme at the end."
      reviewFaults={PM_REVIEW_FAULTS}
    />
  )
}
