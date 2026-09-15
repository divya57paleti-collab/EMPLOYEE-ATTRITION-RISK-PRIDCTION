"use client"

import { useMemo } from "react"
import { Line, Bar } from "react-chartjs-2"
import { PALETTE } from "@/components/chart-setup"
import { MODEL } from "@/lib/data"
import { humanFeatureName } from "@/lib/predict"

export default function ModelTab() {
  const m = MODEL.metrics
  const cm = m.confusion_matrix // [[TN, FP],[FN, TP]]
  const tn = cm[0][0]
  const fp = cm[0][1]
  const fn = cm[1][0]
  const tp = cm[1][1]

  const metricCards = [
    { label: "Accuracy", value: (m.accuracy * 100).toFixed(1) + "%" },
    { label: "Precision", value: (m.precision * 100).toFixed(1) + "%" },
    { label: "Recall", value: (m.recall * 100).toFixed(1) + "%" },
    { label: "F1 Score", value: (m.f1 * 100).toFixed(1) + "%" },
    { label: "ROC AUC", value: (m.auc * 100).toFixed(1) + "%" },
  ]

  const roc = useMemo(() => {
    const pts = MODEL.roc_points || []
    return {
      labels: pts.map((p) => p[0]),
      data: pts.map((p) => ({ x: p[0], y: p[1] })),
    }
  }, [])

  const coefs = useMemo(() => {
    return MODEL.feature_names
      .map((f, i) => ({ f, c: MODEL.coef[i] }))
      .sort((a, b) => Math.abs(b.c) - Math.abs(a.c))
      .slice(0, 12)
  }, [])

  return (
    <div className="tab-panel">
      <div className="metric-grid">
        {metricCards.map((c) => (
          <div className="metric-card" key={c.label}>
            <div className="m-val">{c.value}</div>
            <div className="m-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card span-5">
          <h3>Confusion Matrix</h3>
          <div className="chart-sub">Held-out test set ({m.test_size.toLocaleString()} employees)</div>
          <div className="cm-grid">
            <div className="cm-cell cm-head" />
            <div className="cm-cell cm-head">Pred: Stay</div>
            <div className="cm-cell cm-head">Pred: Leave</div>
            <div className="cm-cell cm-head" style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}>
              Actual: Stay
            </div>
            <div className="cm-cell cm-tn">
              <div className="cm-n">{tn.toLocaleString()}</div>
              <div className="cm-l">True Negative</div>
            </div>
            <div className="cm-cell cm-fp">
              <div className="cm-n">{fp.toLocaleString()}</div>
              <div className="cm-l">False Positive</div>
            </div>
            <div className="cm-cell cm-head" style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}>
              Actual: Leave
            </div>
            <div className="cm-cell cm-fn">
              <div className="cm-n">{fn.toLocaleString()}</div>
              <div className="cm-l">False Negative</div>
            </div>
            <div className="cm-cell cm-tp">
              <div className="cm-n">{tp.toLocaleString()}</div>
              <div className="cm-l">True Positive</div>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 16 }}>
            The model correctly identifies <b>{tp.toLocaleString()}</b> leavers while missing{" "}
            <b>{fn.toLocaleString()}</b> — recall is the key metric for retention use-cases.
          </div>
        </div>

        <div className="chart-card span-7">
          <h3>ROC Curve</h3>
          <div className="chart-sub">True-positive vs. false-positive trade-off · AUC = {(m.auc * 100).toFixed(1)}%</div>
          <div className="chart-wrap">
            <Line
              data={{
                labels: roc.labels,
                datasets: [
                  {
                    label: "ROC",
                    data: roc.data,
                    borderColor: PALETTE.amber,
                    backgroundColor: "rgba(240,169,59,0.12)",
                    fill: true,
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2,
                  },
                  {
                    label: "Random",
                    data: [
                      { x: 0, y: 0 },
                      { x: 1, y: 1 },
                    ],
                    borderColor: "rgba(155,166,192,0.4)",
                    borderDash: [6, 6],
                    pointRadius: 0,
                    fill: false,
                    borderWidth: 1.5,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                parsing: false,
                plugins: {
                  legend: { display: true, position: "bottom", labels: { usePointStyle: true, boxWidth: 10, padding: 14 } },
                },
                scales: {
                  x: {
                    type: "linear",
                    min: 0,
                    max: 1,
                    grid: { color: PALETTE.grid },
                    title: { display: true, text: "False Positive Rate" },
                  },
                  y: {
                    min: 0,
                    max: 1,
                    grid: { color: PALETTE.grid },
                    title: { display: true, text: "True Positive Rate" },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card span-7">
          <h3>Top Model Coefficients</h3>
          <div className="chart-sub">Standardized feature weights (log-odds) — largest absolute impact</div>
          <div className="chart-wrap" style={{ minHeight: 340 }}>
            <Bar
              data={{
                labels: coefs.map((c) => humanFeatureName(c.f)),
                datasets: [
                  {
                    data: coefs.map((c) => c.c),
                    backgroundColor: coefs.map((c) => (c.c > 0 ? PALETTE.coral : PALETTE.teal)),
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: PALETTE.grid }, title: { display: true, text: "← lowers risk   ·   raises risk →" } },
                  y: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card span-5">
          <h3>Model Details</h3>
          <div className="chart-sub">Configuration and dataset split</div>
          <div className="info-list" style={{ marginTop: 8 }}>
            <div className="info-row">
              <span>Algorithm</span>
              <span>Logistic Regression</span>
            </div>
            <div className="info-row">
              <span>Features</span>
              <span>{MODEL.feature_names.length}</span>
            </div>
            <div className="info-row">
              <span>Numeric features</span>
              <span>{MODEL.num_cols.length}</span>
            </div>
            <div className="info-row">
              <span>Categorical features</span>
              <span>{MODEL.cat_cols.length}</span>
            </div>
            <div className="info-row">
              <span>Training samples</span>
              <span>{m.train_size.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span>Test samples</span>
              <span>{m.test_size.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span>Preprocessing</span>
              <span>StandardScaler</span>
            </div>
            <div className="info-row">
              <span>Intercept</span>
              <span>{MODEL.intercept.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
