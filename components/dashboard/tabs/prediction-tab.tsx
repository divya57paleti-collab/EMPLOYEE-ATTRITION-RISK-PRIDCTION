"use client"

import { useState } from "react"
import { MODEL, uniqueSorted } from "@/lib/data"
import { predict, humanFeatureName, type PredictInput, type Contribution } from "@/lib/predict"
import { Icon } from "../icons"

const depts = uniqueSorted("Department")
const workModes = uniqueSorted("Work_Mode")
const maritals = uniqueSorted("Marital_Status")
const educations = uniqueSorted("EducationLevel")
const genders = uniqueSorted("Gender")
const cities = uniqueSorted("City")

const DEFAULTS: PredictInput = {
  Age: 32,
  YearsAtCompany: 4,
  TrainingHoursLastYear: 20,
  SatisfactionScore: 3.5,
  PerformanceRating: 3,
  OverTime: false,
  Department: depts[0] ?? "",
  Work_Mode: workModes[0] ?? "",
  Marital_Status: maritals[0] ?? "",
  EducationLevel: educations[0] ?? "",
  Gender: genders[0] ?? "",
  City: cities[0] ?? "",
}

type Result = { prob: number; contributions: Contribution[] }

function verdict(prob: number) {
  if (prob >= 0.6) return { cls: "risk-high", label: "High Risk" }
  if (prob >= 0.35) return { cls: "risk-medium", label: "Medium Risk" }
  return { cls: "risk-low", label: "Low Risk" }
}

export default function PredictionTab() {
  const [form, setForm] = useState<PredictInput>(DEFAULTS)
  const [result, setResult] = useState<Result | null>(null)

  const set = <K extends keyof PredictInput>(k: K, v: PredictInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  const run = () => setResult(predict(form))

  const v = result ? verdict(result.prob) : null
  const topFactors = result
    ? [...result.contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 8)
    : []
  const maxAbs = topFactors.length ? Math.max(...topFactors.map((f) => Math.abs(f.contribution))) : 1

  return (
    <div className="tab-panel" id="predict">
      <div className="pred-layout">
        {/* FORM */}
        <div className="form-card">
          <h3>Employee Profile</h3>
          <p className="desc">Enter the attributes below and score the attrition probability in real time.</p>
          <div className="form-grid">
            <div className="field">
              <label>Age</label>
              <div className="range-row">
                <input type="range" min={18} max={65} value={form.Age} onChange={(e) => set("Age", +e.target.value)} />
                <span className="range-val">{form.Age}</span>
              </div>
            </div>
            <div className="field">
              <label>Years at Company</label>
              <div className="range-row">
                <input type="range" min={0} max={30} value={form.YearsAtCompany} onChange={(e) => set("YearsAtCompany", +e.target.value)} />
                <span className="range-val">{form.YearsAtCompany}</span>
              </div>
            </div>
            <div className="field">
              <label>Satisfaction Score</label>
              <div className="range-row">
                <input type="range" min={1} max={5} step={0.5} value={form.SatisfactionScore} onChange={(e) => set("SatisfactionScore", +e.target.value)} />
                <span className="range-val">{form.SatisfactionScore}</span>
              </div>
            </div>
            <div className="field">
              <label>Performance Rating</label>
              <div className="range-row">
                <input type="range" min={1} max={5} value={form.PerformanceRating} onChange={(e) => set("PerformanceRating", +e.target.value)} />
                <span className="range-val">{form.PerformanceRating}</span>
              </div>
            </div>
            <div className="field">
              <label>Training Hours (last year)</label>
              <div className="range-row">
                <input type="range" min={0} max={80} value={form.TrainingHoursLastYear} onChange={(e) => set("TrainingHoursLastYear", +e.target.value)} />
                <span className="range-val">{form.TrainingHoursLastYear}</span>
              </div>
            </div>
            <div className="field">
              <label>Overtime</label>
              <select value={String(form.OverTime)} onChange={(e) => set("OverTime", e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="field">
              <label>Department</label>
              <select value={form.Department} onChange={(e) => set("Department", e.target.value)}>
                {depts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Work Mode</label>
              <select value={form.Work_Mode} onChange={(e) => set("Work_Mode", e.target.value)}>
                {workModes.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Marital Status</label>
              <select value={form.Marital_Status} onChange={(e) => set("Marital_Status", e.target.value)}>
                {maritals.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Education Level</label>
              <select value={form.EducationLevel} onChange={(e) => set("EducationLevel", e.target.value)}>
                {educations.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Gender</label>
              <select value={form.Gender} onChange={(e) => set("Gender", e.target.value)}>
                {genders.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>City</label>
              <select value={form.City} onChange={(e) => set("City", e.target.value)}>
                {cities.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="predict-btn" onClick={run}>
            Calculate Attrition Risk
          </button>
        </div>

        {/* RESULT */}
        <div className="result-card">
          {!result ? (
            <div className="result-empty">
              <Icon name="target" size={44} />
              <div>
                <strong style={{ color: "var(--text-dim)" }}>No prediction yet</strong>
                <br />
                Fill in the profile and hit <em>Calculate Attrition Risk</em>.
              </div>
            </div>
          ) : (
            <>
              <div className="gauge-wrap">
                <div className="gauge-label">Predicted Attrition Probability</div>
                <div className={`gauge-verdict ${v!.cls}`}>{v!.label}</div>
                <div className="gauge-prob">{(result.prob * 100).toFixed(1)}% likelihood of leaving</div>
                <div className="gauge-track">
                  <div className="gauge-needle" style={{ left: `${Math.min(100, Math.max(0, result.prob * 100))}%` }} />
                </div>
                <div className="gauge-scale">
                  <span>0% · Low</span>
                  <span>50%</span>
                  <span>High · 100%</span>
                </div>
              </div>

              <div className="factors-title">Top Contributing Factors</div>
              {topFactors.map((f) => {
                const wPct = (Math.abs(f.contribution) / maxAbs) * 50
                const pos = f.contribution > 0
                return (
                  <div className="factor-row" key={f.feature}>
                    <div className="factor-name">{humanFeatureName(f.feature)}</div>
                    <div className="factor-bar-track">
                      <div className="factor-mid" />
                      <div
                        className={`factor-bar-fill ${pos ? "pos" : "neg"}`}
                        style={pos ? { left: "50%", width: `${wPct}%` } : { right: "50%", width: `${wPct}%` }}
                      />
                    </div>
                    <div className="factor-val" style={{ color: pos ? "var(--coral)" : "var(--teal)" }}>
                      {pos ? "+" : ""}
                      {f.contribution.toFixed(2)}
                    </div>
                  </div>
                )
              })}
              <div className="callout" style={{ marginTop: 18 }}>
                Bars to the <b style={{ color: "var(--coral)" }}>right</b> push risk up; bars to the{" "}
                <b style={{ color: "var(--teal)" }}>left</b> lower it. Values are standardized log-odds contributions
                from the model&apos;s {MODEL.feature_names.length} features.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
