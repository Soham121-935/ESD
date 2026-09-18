import { useMemo, useState } from 'react'
import { Callout, SourceBadge } from './Provenance'

export interface LogicFamily {
  id: string
  name: string
  /** Supply used for the quoted levels. */
  vcc: number
  vohMin: number
  volMax: number
  vihMin: number
  vilMax: number
  /** Output current capability (mA, positive magnitudes). */
  iolMax: number
  iohMax: number
  /** Input current requirement (mA). */
  iilMax: number
  iihMax: number
  note: string
}

/**
 * Engineering Insight: these numeric level and current values are standard
 * 74-series / 4000-series datasheet figures. The supplied course material gives
 * the noise-margin expressions, the fan-out idea, the unit-load facts and the
 * interfacing RULES, but not a numeric level table — so the numbers here are
 * labelled Engineering Insight and the formulas are labelled source.
 */
export const LOGIC_FAMILIES: LogicFamily[] = [
  {
    id: '74LS',
    name: '74LS TTL',
    vcc: 5,
    vohMin: 2.7,
    volMax: 0.5,
    vihMin: 2.0,
    vilMax: 0.8,
    iolMax: 8,
    iohMax: 0.4,
    iilMax: 0.4,
    iihMax: 0.02,
    note: 'Standard low-power Schottky TTL. Source: 74LS guaranteed to sink 8.0 mA (5 unit loads) with VOL = 0.5 V.',
  },
  {
    id: '74S',
    name: '74S TTL',
    vcc: 5,
    vohMin: 2.7,
    volMax: 0.5,
    vihMin: 2.0,
    vilMax: 0.8,
    iolMax: 20,
    iohMax: 1.0,
    iilMax: 2.0,
    iihMax: 0.05,
    note: 'Source: 74S00 guaranteed to sink 20 mA (12.5 unit loads) with VOL = 0.5 V.',
  },
  {
    id: '74HC',
    name: '74HC CMOS (5 V)',
    vcc: 5,
    vohMin: 4.9,
    volMax: 0.1,
    vihMin: 3.5,
    vilMax: 1.5,
    iolMax: 4,
    iohMax: 4,
    iilMax: 0.001,
    iihMax: 0.001,
    note: 'Source: 74HC/HCT are pin-compatible with TTL, comparable in speed to 74LS, with much higher output current than the 4000 series.',
  },
  {
    id: '4000B',
    name: '4000B CMOS (10 V)',
    vcc: 10,
    vohMin: 9.95,
    volMax: 0.05,
    vihMin: 7.0,
    vilMax: 3.0,
    iolMax: 0.5,
    iohMax: 0.5,
    iilMax: 0.0001,
    iihMax: 0.0001,
    note: 'Source: 4000/14000 series operate over 3 to 15 V, dissipate very little power, are slow, have low output current, and are NOT pin-compatible or electrically compatible with any TTL series.',
  },
]

/**
 * LogicInterfaceLab — pick a driver and a receiver, and see whether the
 * interface is valid: noise margins, fan-out, and the fix if it is not.
 */
export function LogicInterfaceLab() {
  const [driverId, setDriverId] = useState('74LS')
  const [receiverId, setReceiverId] = useState('74HC')
  const [loads, setLoads] = useState(1)

  const driver = LOGIC_FAMILIES.find((f) => f.id === driverId)!
  const receiver = LOGIC_FAMILIES.find((f) => f.id === receiverId)!

  const result = useMemo(() => {
    // Source expressions
    const vnh = driver.vohMin - receiver.vihMin
    const vnl = receiver.vilMax - driver.volMax
    // Fan-out
    const fanLow = receiver.iilMax > 0 ? driver.iolMax / receiver.iilMax : Infinity
    const fanHigh = receiver.iihMax > 0 ? driver.iohMax / receiver.iihMax : Infinity
    const fanOut = Math.min(fanLow, fanHigh)

    // Current check at the requested number of loads
    const iolNeeded = receiver.iilMax * loads
    const iihNeeded = receiver.iihMax * loads
    const currentOk = iolNeeded <= driver.iolMax && iihNeeded <= driver.iohMax

    return {
      vnh,
      vnl,
      fanLow,
      fanHigh,
      fanOut,
      iolNeeded,
      iihNeeded,
      currentOk,
      levelOk: vnh >= 0 && vnl >= 0,
    }
  }, [driver, receiver, loads])

  const verdict = result.levelOk && result.currentOk
  const lowLevelFail = result.vnl < 0
  const highLevelFail = result.vnh < 0

  let fix = 'No interface problem: direct connection is valid.'
  if (highLevelFail && driver.vcc === 5 && receiver.vcc === 5) {
    fix =
      'TTL driving CMOS at the same 5 V: the source states that VOH(min) of TTL is too low compared with VIH(min) of CMOS, and the solution is a pull-up resistor at the TTL output.'
  } else if (highLevelFail && receiver.vcc > driver.vcc) {
    fix =
      'Driving high-voltage CMOS: the source gives two options — use a TTL series that can operate with a high-voltage output pull-up, or use a voltage level translator.'
  } else if (!result.currentOk) {
    fix =
      'CMOS driving TTL: the source notes the fan-out problem and recommends a buffer to interface low-current CMOS to high-current TTL.'
  } else if (highLevelFail) {
    fix = 'Level incompatibility on the HIGH state — add a pull-up or a level translator.'
  } else if (lowLevelFail) {
    fix = 'Level incompatibility on the LOW state — check VOL(max) against VIL(max) and add a level translator.'
  }

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>Logic interface analyser</h3>
        <SourceBadge p="insight" label="Level values: Engineering Insight" />
      </div>
      <p className="small muted">
        The noise-margin expressions VNH = VOH(min) − VIH(min) and VNL = VIL(max) − VOL(max) are from
        the supplied material. The numeric level values are standard 74-series datasheet figures and
        are labelled Engineering Insight — the supplied PDFs give the rules, not a level table.
      </p>

      <div className="filters">
        <div className="field">
          <label htmlFor="drv">Driver (output)</label>
          <select id="drv" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {LOGIC_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="rcv">Receiver (input)</label>
          <select id="rcv" value={receiverId} onChange={(e) => setReceiverId(e.target.value)}>
            {LOGIC_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="loads">Number of inputs driven</label>
          <select
            id="loads"
            value={loads}
            onChange={(e) => setLoads(Number(e.target.value))}
          >
            {[1, 2, 4, 5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="readout-grid">
        <div className={`readout ${result.vnh >= 0 ? 'ok' : 'bad'}`}>
          <div className="rl">VNH = VOH(min) − VIH(min)</div>
          <div className="rv">
            {result.vnh.toFixed(2)}
            <span className="ru">V</span>
          </div>
        </div>
        <div className={`readout ${result.vnl >= 0 ? 'ok' : 'bad'}`}>
          <div className="rl">VNL = VIL(max) − VOL(max)</div>
          <div className="rv">
            {result.vnl.toFixed(2)}
            <span className="ru">V</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Fan-out (LOW)</div>
          <div className="rv">{Number.isFinite(result.fanLow) ? Math.floor(result.fanLow) : '∞'}</div>
        </div>
        <div className="readout">
          <div className="rl">Fan-out (HIGH)</div>
          <div className="rv">{Number.isFinite(result.fanHigh) ? Math.floor(result.fanHigh) : '∞'}</div>
        </div>
        <div className={`readout ${result.currentOk ? 'ok' : 'bad'}`}>
          <div className="rl">Current check at {loads} input{loads === 1 ? '' : 's'}</div>
          <div className="rv">{result.currentOk ? 'PASS' : 'FAIL'}</div>
        </div>
      </div>

      <div className="given-grid mt1">
        <div>
          <span className="k">Driver VOH(min) / VOL(max)</span>
          <span className="v">
            {driver.vohMin} V / {driver.volMax} V
          </span>
        </div>
        <div>
          <span className="k">Receiver VIH(min) / VIL(max)</span>
          <span className="v">
            {receiver.vihMin} V / {receiver.vilMax} V
          </span>
        </div>
        <div>
          <span className="k">IOL required / available</span>
          <span className="v">
            {result.iolNeeded.toFixed(3)} / {driver.iolMax} mA
          </span>
        </div>
        <div>
          <span className="k">IIH required / available</span>
          <span className="v">
            {result.iihNeeded.toFixed(4)} / {driver.iohMax} mA
          </span>
        </div>
      </div>

      <Callout tone={verdict ? 'ok' : 'warn'} title={verdict ? 'Interface valid' : 'Interface NOT valid'}>
        {fix}
      </Callout>

      <p className="small faint">
        Fan-out is limited by both current directions; the usable fan-out is the smaller of the two.
        The source states that 74LS circuits are guaranteed to sink 8.0 mA (5 unit loads) and that
        74S00 and 74H00 sink 20 mA (12.5 unit loads) — which fixes one TTL unit load at 1.6 mA.
      </p>
    </div>
  )
}
