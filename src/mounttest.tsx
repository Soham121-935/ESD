/**
 * Client-mount test used only by `npm run mounttest`.
 * Boots the real app (HashRouter included) inside jsdom, then drives the UI the way
 * a student would: switch modes, walk every tab, click circuit blocks, solve a solver
 * step, open a question solution, open a viva follow-up.
 *
 * Globals are installed BEFORE React is imported so React sees a real DOM.
 */
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
})

const g = globalThis as unknown as Record<string, unknown>

function def(key: string, value: unknown) {
  Object.defineProperty(g, key, { value, writable: true, configurable: true })
}

def('window', dom.window)
def('document', dom.window.document)
def('navigator', dom.window.navigator)
def('HTMLElement', dom.window.HTMLElement)
def('HTMLInputElement', dom.window.HTMLInputElement)
def('HTMLTextAreaElement', dom.window.HTMLTextAreaElement)
def('HTMLSelectElement', dom.window.HTMLSelectElement)
def('Element', dom.window.Element)
def('Node', dom.window.Node)
def('Event', dom.window.Event)
def('MouseEvent', dom.window.MouseEvent)
def('getComputedStyle', dom.window.getComputedStyle)
def('requestAnimationFrame', (cb: FrameRequestCallback) => dom.window.setTimeout(() => cb(0), 0))
def('cancelAnimationFrame', (id: number) => dom.window.clearTimeout(id))
def('IS_REACT_ACT_ENVIRONMENT', true)

const errors: string[] = []
const origError = console.error
console.error = (...args: unknown[]) => {
  const msg = args.map(String).join(' ')
  // jsdom cannot lay out SVG; React's own errors are what we care about.
  if (!msg.includes('Not implemented')) errors.push(msg)
  origError(...args)
}

const results: string[] = []
function check(name: string, fn: () => void) {
  try {
    fn()
    results.push(`OK   ${name}`)
  } catch (e) {
    results.push(`FAIL ${name}: ${(e as Error).message}`)
    process.exitCode = 1
  }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}


async function main() {
  const { createRoot } = await import('react-dom/client')
  const { act, createElement } = await import('react')
  const { default: App } = await import('./App')

  const container = dom.window.document.getElementById('root')!
  const root = createRoot(container)

  act(() => {
    root.render(createElement(App))
  })

  const q = (sel: string) => dom.window.document.querySelector(sel)
  const qa = (sel: string): Element[] => Array.from(dom.window.document.querySelectorAll(sel))
  const byText = (sel: string, text: string): Element | undefined =>
    qa(sel).find((el) => (el.textContent ?? '').trim().toLowerCase().includes(text.toLowerCase()))

  function click(el: Element | null | undefined, what: string) {
    if (!el) throw new Error(`could not find element to click: ${what}`)
    act(() => {
      el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    })
  }

  /* --- boot --- */
  check('app mounts and renders the sidebar', () => {
    assert(q('.sidebar'), 'no .sidebar')
    assert(q('.topbar'), 'no .topbar')
    const txt = container.textContent ?? ''
    assert(txt.includes('ESD Learning Lab'), 'brand missing')
    assert(txt.includes('Classification'), 'topic 1 not in sidebar')
  })

  check('topic 1 page is the default route', () => {
    const txt = container.textContent ?? ''
    assert(txt.includes('Topic 1 — Electronic System Classification'), 'topic 1 heading missing')
    assert(txt.includes('Should be affordable'), 'supplied table not rendered')
  })

  /* --- modes --- */
  for (const mode of ['Beginner', 'Intermediate', 'Exam Mode']) {
    check(`mode switch → ${mode}`, () => {
      const btn = byText('.seg button', mode)
      click(btn, `mode ${mode}`)
      const txt = container.textContent ?? ''
      if (mode === 'Exam Mode') {
        assert(txt.includes('8 Marks') || txt.includes('8 marks'), 'exam framing missing')
        assert(txt.includes('Marking scheme'), 'marking scheme missing')
      } else {
        assert(txt.includes('PROBLEM') || txt.includes('Problem'), 'problem block missing')
      }
    })
  }

  /* back to beginner */
  click(byText('.seg button', 'Beginner'), 'Beginner')

  /* --- tabs --- */
  const TABS = [
    'Theory',
    'Numericals',
    'System Analysis',
    'Design',
    'Debugging',
    'Viva',
    'Quiz',
    'Exam',
    'Question Bank',
    'Progress',
  ]
  for (const tab of TABS) {
    check(`tab → ${tab}`, () => {
      click(byText('.tabs button', tab), `tab ${tab}`)
      assert((container.textContent ?? '').length > 200, `${tab} rendered nothing`)
    })
  }

  /* --- circuit interactivity --- */
  check('block diagram responds to clicks', () => {
    click(byText('.tabs button', 'System Analysis'), 'System Analysis')
    const node = q('.circuit-node')
    assert(node, 'no circuit node')
    click(node, 'circuit node')
    assert(q('.node-detail'), 'node detail did not open')
    assert((q('.node-detail')?.textContent ?? '').includes('Role'), 'node detail has no role')
  })

  /* --- numerical solver --- */
  check('numerical solver accepts a correct step 1', () => {
    click(byText('.tabs button', 'Numericals'), 'Numericals')
    const inputs = qa('.step input[type="text"]') as HTMLInputElement[]
    assert(inputs.length >= 3, `expected 3 entries on step 1, got ${inputs.length}`)
    const set = (el: HTMLInputElement, v: string) => {
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          dom.window.HTMLInputElement.prototype,
          'value',
        )?.set
        setter?.call(el, v)
        el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
      })
    }
    set(inputs[0], '70')
    set(inputs[1], '110')
    set(inputs[2], '180')
    click(byText('.step .btn.primary', 'Check this step'), 'check step 1')
    assert(q('.step.solved'), 'step 1 was not marked solved')
  })

  check('numerical solver rejects a wrong step', () => {
    const inputs = qa('.step input[type="text"]') as HTMLInputElement[]
    // step 2 entries come after step 1's three
    const set = (el: HTMLInputElement, v: string) => {
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          dom.window.HTMLInputElement.prototype,
          'value',
        )?.set
        setter?.call(el, v)
        el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
      })
    }
    assert(inputs.length >= 6, 'step 2 entries not unlocked')
    set(inputs[3], '22') // wrong: should be -22
    set(inputs[4], '3')
    set(inputs[5], '33')
    // step 1's check button disappears once solved, so step 2's is now the only one
  click(qa('.step .btn.primary')[0], 'check step 2')
    assert(q('.errbox'), 'no error reported for the wrong entry')
    assert((q('.errbox')?.textContent ?? '').toLowerCase().includes('consumer'), 'error did not name the failing entry')
  })

  /* --- question bank --- */
  check('question bank lists all questions and opens a solution', () => {
    click(byText('.tabs button', 'Question Bank'), 'Question Bank')
    const cards = qa('.qcard')
    assert(cards.length === 40, `expected 40 question cards, got ${cards.length}`)
    click(byText('.qcard .btn', 'Full solution'), 'full solution')
    assert(q('.qcard .reveal'), 'solution did not open')
  })

  check('question bank filter narrows the set', () => {
    const select = qa('.filters select')[0] as HTMLSelectElement
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        dom.window.HTMLSelectElement.prototype,
        'value',
      )?.set
      setter?.call(select, 'mcq')
      select.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
    })
    const cards = qa('.qcard')
    assert(cards.length === 10, `MCQ filter should give 10 cards, got ${cards.length}`)
  })

  /* --- viva --- */
  check('viva engine reveals the expected answer after the student speaks', () => {
    click(byText('.tabs button', 'Viva'), 'Viva')
    const ta = q('textarea.answer') as HTMLTextAreaElement
    assert(ta, 'no answer box')
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        dom.window.HTMLTextAreaElement.prototype,
        'value',
      )?.set
      setter?.call(ta, 'Because the function is not the requirement; environment and failure cost are.')
      ta.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    })
    click(byText('.btn.primary', 'Compare with the expected answer'), 'compare')
    assert((container.textContent ?? '').includes('Expected answer'), 'expected answer not shown')
    click(byText('.btn', 'Ask the next follow-up'), 'follow-up')
    assert((container.textContent ?? '').includes('Teacher:'), 'follow-up chain not shown')
  })

  /* --- debugging --- */
  check('debug lab blocks the reveal until a hypothesis is tested', () => {
    click(byText('.tabs button', 'Debugging'), 'Debugging')
    click(byText('.btn', 'Take measurements'), 'measure')
    assert(q('.given-grid'), 'measurements not shown')
    const wrong = byText('.opt', 'coverage')
    click(wrong, 'wrong hypothesis')
    click(byText('.btn.primary', 'Check hypothesis'), 'check hypothesis')
    assert(q('.errbox'), 'wrong hypothesis was not rejected')
  })

  /* --- progress --- */
  check('progress records visited sections', () => {
    click(byText('.tabs button', 'Progress'), 'Progress')
    const dots = qa('.topic-link .dot.done, .topic-link .dot.part')
    assert(dots.length >= 1, 'no progress dot set')
    assert(
      (container.textContent ?? '').includes('sections'),
      'progress panel missing section counter',
    )
  })

  /* ---------------- Topics 2 to 6 ---------------- */

  const LIVE_TOPICS: { link: string; heading: string; tabs: string[] }[] = [
    {
      link: 'Reliability',
      heading: 'Topic 2 — System Reliability',
      tabs: ['Theory', 'Numericals', 'Bathtub Analysis', 'Design', 'Debugging', 'Viva', 'Quiz', 'Exam', 'Question Bank', 'Progress'],
    },
    {
      link: 'Op-Amp',
      heading: 'Topic 3 — Op-Amp Characteristics',
      tabs: ['Theory', 'Numericals', 'Circuit Analysis', 'Design', 'Debugging', 'Viva', 'Quiz', 'Exam', 'Question Bank', 'Progress'],
    },
    {
      link: 'TTL & CMOS',
      heading: 'Topic 4 — TTL and CMOS',
      tabs: ['Theory', 'Numericals', 'Interface Analysis', 'Design', 'Debugging', 'Viva', 'Quiz', 'Exam', 'Question Bank', 'Progress'],
    },
    {
      link: 'Performance Matrix',
      heading: 'Topic 5 — System Performance Matrix',
      tabs: ['Theory', 'Matrix Lab', 'Analysis', 'Design', 'Review Faults', 'Viva', 'Quiz', 'Exam', 'Question Bank', 'Progress'],
    },
    {
      link: 'Design Matrix',
      heading: 'Topic 6 — Design Matrix',
      tabs: ['Theory', 'Matrix Lab', 'Analysis', 'Design', 'Review Faults', 'Viva', 'Quiz', 'Exam', 'Question Bank', 'Progress'],
    },
  ]

  for (const t of LIVE_TOPICS) {
    check(`navigate to ${t.heading} from the sidebar`, () => {
      click(byText('.topic-link', t.link), `${t.heading} link`)
      assert(
        (container.textContent ?? '').includes(t.heading),
        `${t.heading} heading missing`,
      )
    })

    for (const tab of t.tabs) {
      check(`${t.heading} tab → ${tab}`, () => {
        click(byText('.tabs button', tab), `${t.heading} tab ${tab}`)
        assert((container.textContent ?? '').length > 200, `${tab} rendered nothing`)
      })
    }
  }

  check('reliability solver accepts MTBF step', () => {
    click(byText('.topic-link', 'Reliability'), 'Reliability')
    click(byText('.tabs button', 'Numericals'), 'Numericals')
    const inputs = qa('.step input[type="text"]') as HTMLInputElement[]
    assert(inputs.length >= 1, 'no solver inputs')
    const set = (el: HTMLInputElement, v: string) => {
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          dom.window.HTMLInputElement.prototype,
          'value',
        )?.set
        setter?.call(el, v)
        el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
      })
    }
    set(inputs[0], '100')
    click(byText('.step .btn.primary', 'Check this step'), 'check MTBF step')
    assert(q('.step.solved'), 'MTBF step was not solved')
  })

  check('bathtub curve region click opens the detail panel', () => {
    click(byText('.tabs button', 'Bathtub Analysis'), 'Bathtub Analysis')
    const band = qa('.circuit-shell svg g')[0]
    assert(band, 'no region band found')
    click(band, 'infant mortality band')
    const txt = container.textContent ?? ''
    assert(txt.includes('Infant mortality'), 'region detail did not open')
    assert(txt.includes('Improvement — component level'), 'improvement panel missing')
  })

  check('op-amp lab computes the supplied problem currents', () => {
    click(byText('.topic-link', 'Op-Amp'), 'Op-Amp')
    click(byText('.tabs button', 'Circuit Analysis'), 'Circuit Analysis')
    const txt = container.textContent ?? ''
    // defaults: R1 10k, Rf 20k, Vi 3V, RL 2k, IQ 0.5mA, +/-15V
    assert(txt.includes('Vo = -6.00 V'), `expected Vo = -6.00 V, got none`)
    assert(txt.includes('3.50'), 'IEE = 3.50 mA not shown')
    assert(txt.includes('0.50'), 'ICC = 0.50 mA not shown')
  })

  check('logic interface lab flags the TTL-to-CMOS HIGH-state failure', () => {
    click(byText('.topic-link', 'TTL & CMOS'), 'TTL & CMOS')
    click(byText('.tabs button', 'Interface Analysis'), 'Interface Analysis')
    const txt = container.textContent ?? ''
    assert(txt.includes('VNH'), 'noise margin read-out missing')
    assert(txt.includes('Interface NOT valid'), 'the default 74LS -> 74HC case should be invalid')
    assert(
      txt.includes('Pull-up resistor at TTL output'.slice(0, 20)) ||
        txt.includes('pull-up resistor at the TTL output'),
      'the source fix is not shown',
    )
  })

  check('matrix builder recomputes when a weight changes', () => {
    click(byText('.topic-link', 'Performance Matrix'), 'Performance Matrix')
    click(byText('.tabs button', 'Matrix Lab'), 'Matrix Lab')
    const sliders = qa('.slider input[type="range"]') as HTMLInputElement[]
    assert(sliders.length >= 4, 'no weight sliders found')
    const before = container.textContent ?? ''
    const setRange = (el: HTMLInputElement, v: string) => {
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          dom.window.HTMLInputElement.prototype,
          'value',
        )?.set
        setter?.call(el, v)
        el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
      })
    }
    setRange(sliders[0], '0')
    setRange(sliders[4], '5')
    const after = container.textContent ?? ''
    assert(before !== after, 'the matrix did not recompute when a weight changed')
  })

  check('unit 1 question bank aggregates every topic', () => {
    click(byText('.topic-link', 'Question Bank (Unit 1)'), 'unit bank link')
    const cards = qa('.qcard')
    assert(cards.length === 252, `expected 252 cards in the unit bank, got ${cards.length}`)
    const topicSelect = dom.window.document.getElementById('f-topic')
    assert(topicSelect, 'the combined bank has no topic filter')
    const opts = (topicSelect as unknown as HTMLSelectElement).options
    assert(
      opts.length === 7,
      `expected an All option plus 6 topics, got ${opts.length} options`,
    )
  })

  check('localStorage persisted the progress', () => {
    const raw = dom.window.localStorage.getItem('esd-learning-lab:v1')
    assert(raw, 'nothing written to localStorage')
    const parsed = JSON.parse(raw!)
    assert(
      parsed.activity.length >= 48,
      `expected >= 48 visited sections across 6 topics, got ${parsed.activity?.length}`,
    )
    assert(parsed.attempts.length >= 2, `expected >= 2 attempts, got ${parsed.attempts?.length}`)
  })

  console.log(results.join('\n'))
  console.log(errors.length ? `\nCONSOLE ERRORS:\n${errors.join('\n')}` : '\nNo console errors.')
  if (errors.length) process.exitCode = 1

}

main()
