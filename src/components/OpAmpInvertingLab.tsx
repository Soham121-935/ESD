import { useState } from 'react'
import { ParameterSlider } from './ParameterSlider'
import { Callout, SourceBadge } from './Provenance'

/**
 * OpAmpInvertingLab — the supplied inverting-amplifier problem made interactive.
 *
 * Source relations used (OPAMP Fundas, p. 2):
 *   ICC always flows into the VCC terminal
 *   IEE always flows out of the VEE terminal
 *   ICC = Io + IEE   @ Vo positive
 *   IEE = ICC + Io   @ Vo negative
 *   When Io = 0 then ICC = IEE = IQ
 * Output saturation (same source): the output saturates below 2 V of VCC and VEE.
 */
export function OpAmpInvertingLab() {
  const [r1, setR1] = useState(10)
  const [rf, setRf] = useState(20)
  const [vi, setVi] = useState(3)
  const [rl, setRl] = useState(2)
  const [iq, setIq] = useState(0.5)
  const [vcc, setVcc] = useState(15)
  const [vos, setVos] = useState(2)
  const [ib, setIb] = useState(80)
  const [ios, setIos] = useState(20)

  /* --- ideal closed-loop behaviour --- */
  const gain = -rf / r1
  const voIdeal = gain * vi
  const vSat = Math.max(0, vcc - 2) // source: output saturates 2 V below the rails
  const saturated = Math.abs(voIdeal) > vSat
  const vo = saturated ? Math.sign(voIdeal) * vSat : voIdeal

  /* --- load current --- */
  const ioMag = Math.abs(vo) / rl // mA, because RL is in kΩ and Vo in V
  const ioSigned = vo / rl // mA; negative means current flows INTO the op-amp

  /* --- supply currents from the source relations --- */
  const voNegative = vo < 0
  const icc = voNegative ? iq : iq + ioMag
  const iee = voNegative ? iq + ioMag : iq

  /* --- power --- */
  const pSupply = vcc * icc + vcc * iee // mW: V × mA
  const pLoad = (Math.abs(vo) * ioMag) // mW
  const pDiss = pSupply - pLoad

  /* --- error terms (Opamp performance parameters, source) --- */
  const noiseGain = 1 + rf / r1
  const eoVos = noiseGain * vos // mV
  const rpBias = (r1 * rf) / (r1 + rf) // kΩ, matched compensation resistor
  // kΩ × nA = 1e3 Ω × 1e-9 A = 1e-6 V = 1 µV. Convert to mV: divide by 1000.
  const eoIb = (rpBias * ib) / 1000
  const eoIosMv = (rf * ios) / 1000

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>Inverting amplifier — live analysis</h3>
        <SourceBadge p="source" label="Current relations: source" />
      </div>
      <p className="small muted">
        The supplied problem starts at R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, RL = 2 kΩ, IQ = 0.5 mA.
        Move anything and watch the currents, the power and the output error follow.
      </p>

      <div className="circuit-shell">
        <svg viewBox="0 0 760 330" role="img" aria-label="Inverting amplifier circuit">
          {/* ground rail */}
          <line x1="60" y1="282" x2="700" y2="282" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Vi source */}
          <circle cx="52" cy="170" r="16" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="52" y="166" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: 'var(--text)' }}>
            +
          </text>
          <text x="52" y="178" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: 'var(--text)' }}>
            −
          </text>
          <text x="52" y="140" textAnchor="middle" className="circuit-elabel">
            Vi = {vi.toFixed(1)} V
          </text>
          <line x1="52" y1="200" x2="52" y2="282" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Vi → R1 */}
          <line x1="68" y1="170" x2="118" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* R1 */}
          <rect x="118" y="158" width="82" height="24" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.4" />
          <text x="159" y="174" textAnchor="middle" style={{ fontSize: 11, fill: 'var(--text)', fontWeight: 600 }}>
            R1 = {r1.toFixed(1)} kΩ
          </text>

          {/* node n → op-amp inverting input */}
          <line x1="200" y1="170" x2="300" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="238" cy="170" r="3.5" fill="var(--accent)" />
          <text x="238" y="158" textAnchor="middle" className="circuit-elabel">
            n
          </text>

          {/* Rf feedback path */}
          <path
            d="M 238 170 V 78 H 560 V 170"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <rect x="360" y="66" width="82" height="24" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.4" />
          <text x="401" y="82" textAnchor="middle" style={{ fontSize: 11, fill: 'var(--text)', fontWeight: 600 }}>
            Rf = {rf.toFixed(1)} kΩ
          </text>

          {/* op-amp triangle */}
          <path d="M 300 112 L 300 232 L 452 172 Z" fill="#fff" stroke="#cbd5e1" strokeWidth="1.6" />
          <text x="314" y="160" style={{ fontSize: 15, fontWeight: 700, fill: 'var(--text)' }}>−</text>
          <text x="314" y="196" style={{ fontSize: 15, fontWeight: 700, fill: 'var(--text)' }}>+</text>

          {/* supply rails */}
          <line x1="386" y1="112" x2="386" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="396" y="66" className="circuit-elabel">
            +VCC = {vcc.toFixed(0)} V
          </text>
          <text x="396" y="80" style={{ fontSize: 10, fontFamily: 'var(--mono)', fill: 'var(--accent)' }}>
            ICC = {icc.toFixed(2)} mA →
          </text>
          <line x1="386" y1="232" x2="386" y2="282" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="396" y="252" className="circuit-elabel">
            −VEE = −{vcc.toFixed(0)} V
          </text>
          <text x="396" y="266" style={{ fontSize: 10, fontFamily: 'var(--mono)', fill: 'var(--accent)' }}>
            IEE = {iee.toFixed(2)} mA ←
          </text>

          {/* non-inverting input → Rp → ground */}
          <line x1="300" y1="196" x2="262" y2="196" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="262" y1="196" x2="262" y2="242" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="243" y="242" width="38" height="20" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.4" />
          <text x="262" y="256" textAnchor="middle" style={{ fontSize: 9.5, fill: 'var(--text-dim)' }}>
            Rp
          </text>
          <line x1="262" y1="262" x2="262" y2="282" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="286" y="222" className="circuit-elabel">
            Rp = {rpBias.toFixed(2)} kΩ
          </text>

          {/* output → Vo node → RL → ground */}
          <line x1="452" y1="172" x2="560" y2="172" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="560" cy="172" r="3.5" fill="var(--accent)" />
          <line x1="560" y1="172" x2="560" y2="238" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="534" y="238" width="52" height="20" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.4" />
          <text x="560" y="252" textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-dim)' }}>
            RL = {rl.toFixed(1)} kΩ
          </text>
          <line x1="560" y1="258" x2="560" y2="282" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Vo label */}
          <text x="600" y="168" style={{ fontSize: 12, fontWeight: 700, fill: saturated ? 'var(--red)' : 'var(--text)' }}>
            Vo = {vo.toFixed(2)} V
          </text>
          <text x="600" y="184" className="circuit-elabel">
            Av = {gain.toFixed(2)}
          </text>

          {/* Io arrow */}
          <text x="600" y="216" style={{ fontSize: 10, fontFamily: 'var(--mono)', fill: 'var(--accent)' }}>
            Io = {Math.abs(ioSigned).toFixed(2)} mA {voNegative ? 'IN' : 'OUT'}
          </text>

          {/* ground symbols */}
          {[52, 262, 560].map((x) => (
            <g key={x}>
              <line x1={x - 9} y1="282" x2={x + 9} y2="282" stroke="#94a3b8" strokeWidth="2" />
              <line x1={x - 5} y1="286" x2={x + 5} y2="286" stroke="#94a3b8" strokeWidth="1.6" />
              <line x1={x - 2} y1="290" x2={x + 2} y2="290" stroke="#94a3b8" strokeWidth="1.2" />
            </g>
          ))}
        </svg>
      </div>

      <div className="row" style={{ gap: '1.4rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ flex: '1 1 250px', minWidth: 240 }}>
          <div className="block-kind mb1">Supplied problem values</div>
          <ParameterSlider label="R1" value={r1} min={1} max={100} step={0.5} unit="kΩ" onChange={setR1} />
          <ParameterSlider label="Rf" value={rf} min={1} max={500} step={1} unit="kΩ" onChange={setRf} />
          <ParameterSlider label="Vi" value={vi} min={-10} max={10} step={0.1} unit="V" onChange={setVi} />
          <ParameterSlider label="RL (load)" value={rl} min={0.5} max={20} step={0.1} unit="kΩ" onChange={setRl} />
          <ParameterSlider label="IQ (quiescent)" value={iq} min={0.1} max={5} step={0.05} unit="mA" onChange={setIq} />
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 240 }}>
          <div className="block-kind mb1">Engineering Insight controls</div>
          <ParameterSlider
            label="Supply ±V"
            value={vcc}
            min={5}
            max={18}
            step={1}
            unit="V"
            onChange={setVcc}
            note="Not stated in the assignment text — see the note under the read-outs."
          />
          <ParameterSlider label="VOS" value={vos} min={0} max={10} step={0.1} unit="mV" onChange={setVos} />
          <ParameterSlider label="IB" value={ib} min={0} max={500} step={5} unit="nA" onChange={setIb} />
          <ParameterSlider label="IOS" value={ios} min={0} max={200} step={1} unit="nA" onChange={setIos} />
        </div>
      </div>

      <div className="readout-grid">
        <div className="readout">
          <div className="rl">Closed-loop gain</div>
          <div className="rv">{gain.toFixed(2)}</div>
        </div>
        <div className={`readout ${saturated ? 'bad' : 'ok'}`}>
          <div className="rl">Vo</div>
          <div className="rv">
            {vo.toFixed(2)}
            <span className="ru">V</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Io (load)</div>
          <div className="rv">
            {Math.abs(ioSigned).toFixed(2)}
            <span className="ru">mA</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">ICC</div>
          <div className="rv">
            {icc.toFixed(2)}
            <span className="ru">mA</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">IEE</div>
          <div className="rv">
            {iee.toFixed(2)}
            <span className="ru">mA</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Power from supplies</div>
          <div className="rv">
            {pSupply.toFixed(1)}
            <span className="ru">mW</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Power in load</div>
          <div className="rv">
            {pLoad.toFixed(1)}
            <span className="ru">mW</span>
          </div>
        </div>
        <div className="readout warn">
          <div className="rl">Dissipated in op-amp</div>
          <div className="rv">
            {pDiss.toFixed(1)}
            <span className="ru">mW</span>
          </div>
        </div>
      </div>

      <div className="readout-grid">
        <div className="readout">
          <div className="rl">Noise gain 1 + Rf/R1</div>
          <div className="rv">{noiseGain.toFixed(2)}</div>
        </div>
        <div className="readout">
          <div className="rl">Output error from VOS</div>
          <div className="rv">
            {eoVos.toFixed(2)}
            <span className="ru">mV</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Output error from IB (Rp = 0)</div>
          <div className="rv">
            {eoIb.toFixed(2)}
            <span className="ru">mV</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Output error from IOS (Rp matched)</div>
          <div className="rv">
            {eoIosMv.toFixed(4)}
            <span className="ru">mV</span>
          </div>
        </div>
      </div>

      {saturated && (
        <Callout tone="warn" title="Output saturated">
          The ideal output would be {(gain * vi).toFixed(2)} V, but the source states that the output
          saturates below 2 V of VCC/VEE. With ±{vcc.toFixed(0)} V rails the usable output is
          ±{vSat.toFixed(0)} V. Reduce Vi, reduce the gain, or raise the supply rails.
        </Callout>
      )}

      <Callout>
        <strong>Which supply carries the load current?</strong> Vo = {vo.toFixed(2)} V, so the output
        is {voNegative ? 'negative and the op-amp SINKS' : 'positive and the op-amp SOURCES'}{' '}
        {Math.abs(ioSigned).toFixed(2)} mA. The source relation{' '}
        {voNegative ? 'IEE = ICC + Io (at Vo−)' : 'ICC = Io + IEE (at Vo+)'} gives ICC ={' '}
        {icc.toFixed(2)} mA and IEE = {iee.toFixed(2)} mA, with the quiescent current IQ ={' '}
        {iq.toFixed(2)} mA flowing in both rails.
      </Callout>
    </div>
  )
}
