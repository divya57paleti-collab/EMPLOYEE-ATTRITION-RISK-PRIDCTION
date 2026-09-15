"use client"

import { MODEL, TOTAL_N } from "@/lib/data"

export default function AboutTab() {
  return (
    <div className="tab-panel">
      <div className="about-grid">
        <div>
          <div className="about-card">
            <h3>What is Workforce Attrition Intelligence?</h3>
            <p>
              This platform is a self-contained people-analytics workspace built to help HR and leadership teams
              understand <b>why</b> employees leave and <b>who</b> is most likely to leave next. It combines an
              interactive analytics dashboard with a trained machine-learning model that scores attrition risk in
              real time — entirely in the browser, with no server round-trips.
            </p>
            <p>
              The full dataset of <b>{TOTAL_N.toLocaleString()} employee records</b> and the trained
              logistic-regression model ship with the application, so every KPI, chart, and prediction is computed
              locally the moment you interact with it.
            </p>

            <h3 style={{ marginTop: 22 }}>Methodology</h3>
            <p>The model was built following a standard supervised-learning pipeline:</p>
            <ul>
              <li>Categorical attributes are one-hot encoded; numeric attributes are standardized with a StandardScaler.</li>
              <li>
                A logistic-regression classifier is trained on {MODEL.metrics.train_size.toLocaleString()} records and
                evaluated on {MODEL.metrics.test_size.toLocaleString()} held-out records.
              </li>
              <li>Predictions return a calibrated probability plus per-feature log-odds contributions for transparency.</li>
              <li>Model coefficients and scaler parameters are serialized and re-applied client-side for live scoring.</li>
            </ul>

            <div className="callout coral">
              <b>Responsible-use note:</b> attrition predictions are directional decision support, not deterministic
              judgments about any individual. Use them to prompt supportive retention conversations — never as the sole
              basis for employment decisions.
            </div>

            <h3 style={{ marginTop: 22 }}>Feature set</h3>
            <div>
              {[...MODEL.num_cols, ...MODEL.bool_cols, ...MODEL.cat_cols].map((f) => (
                <span className="tag" key={f}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-side">
          <div className="about-card">
            <h3>At a glance</h3>
            <div className="info-list" style={{ marginTop: 8 }}>
              <div className="info-row">
                <span>Records</span>
                <span>{TOTAL_N.toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span>Model</span>
                <span>Logistic Reg.</span>
              </div>
              <div className="info-row">
                <span>Accuracy</span>
                <span>{(MODEL.metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="info-row">
                <span>ROC AUC</span>
                <span>{(MODEL.metrics.auc * 100).toFixed(1)}%</span>
              </div>
              <div className="info-row">
                <span>Features</span>
                <span>{MODEL.feature_names.length}</span>
              </div>
            </div>
          </div>

          <div className="about-card">
            <h3>Tech stack</h3>
            <div style={{ marginTop: 8 }}>
              <span className="tag">Next.js</span>
              <span className="tag">React</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Chart.js</span>
              <span className="tag">Logistic Regression</span>
              <span className="tag">Client-side ML</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 12.5 }}>
              Deployable as a static Next.js application — no database, API keys, or backend services required.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
