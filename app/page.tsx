import Link from "next/link"
import { ALL_ROWS, TOTAL_N, MODEL, isAttrited, pct } from "@/lib/data"

function computeLandingStats() {
  const attr = ALL_ROWS.filter(isAttrited).length
  const attrRate = (attr / TOTAL_N) * 100
  const depts = new Set(ALL_ROWS.map((r) => r.Department).filter(Boolean)).size
  const avgSat =
    ALL_ROWS.reduce((s, r) => s + (r.SatisfactionScore ?? 0), 0) /
    ALL_ROWS.filter((r) => r.SatisfactionScore != null).length
  // mini bars: attrition rate by department (top 6)
  const byDept: Record<string, { n: number; a: number }> = {}
  ALL_ROWS.forEach((r) => {
    const d = r.Department
    if (!d) return
    byDept[d] = byDept[d] || { n: 0, a: 0 }
    byDept[d].n++
    if (isAttrited(r)) byDept[d].a++
  })
  const bars = Object.entries(byDept)
    .map(([d, v]) => ({ d, rate: (v.a / v.n) * 100 }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 7)
  return { attr, attrRate, depts, avgSat, bars }
}

export default function LandingPage() {
  const s = computeLandingStats()
  const maxBar = Math.max(...s.bars.map((b) => b.rate))

  return (
    <>
      <nav className="site-nav">
        <div className="brand-lock">
          <div className="brand-mark">WA</div>
          <div className="brand-text">
            <h1>Workforce Attrition</h1>
            <p>INTELLIGENCE PLATFORM</p>
          </div>
        </div>
        <div className="links">
          <a href="#features">Features</a>
          <a href="#metrics">Model</a>
          <a href="#how">How it works</a>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <Link href="/dashboard" className="cta-lg primary" style={{ padding: "10px 18px", fontSize: 13.5 }}>
          Launch Dashboard
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
                People Analytics · {TOTAL_N.toLocaleString()} records
              </span>
              <h2>
                Predict who&apos;s about to leave — <span className="accent">before they do.</span>
              </h2>
              <p className="lead">
                Workforce Attrition Intelligence turns raw HR data into a live decision cockpit: interactive
                attrition breakdowns, department drill-downs, and a logistic-regression model that scores any
                employee&apos;s flight risk in real time — all in the browser.
              </p>
              <div className="hero-cta">
                <Link href="/dashboard" className="cta-lg primary">
                  Open the Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/dashboard#predict" className="cta-lg secondary">
                  Try risk prediction
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="num">{TOTAL_N.toLocaleString()}</div>
                  <div className="lbl">Employee records</div>
                </div>
                <div className="hero-stat">
                  <div className="num">{pct(s.attrRate)}</div>
                  <div className="lbl">Overall attrition</div>
                </div>
                <div className="hero-stat">
                  <div className="num">{(MODEL.metrics.auc * 100).toFixed(0)}%</div>
                  <div className="lbl">Model AUC</div>
                </div>
              </div>
            </div>

            <div className="hero-card">
              <div className="mini-kpis">
                <div className="mini-kpi">
                  <div className="k-lbl">HEADCOUNT</div>
                  <div className="k-val" style={{ color: "var(--teal)" }}>
                    {TOTAL_N.toLocaleString()}
                  </div>
                </div>
                <div className="mini-kpi">
                  <div className="k-lbl">ATTRITION RATE</div>
                  <div className="k-val" style={{ color: "var(--coral)" }}>
                    {pct(s.attrRate)}
                  </div>
                </div>
                <div className="mini-kpi">
                  <div className="k-lbl">DEPARTMENTS</div>
                  <div className="k-val" style={{ color: "var(--violet)" }}>
                    {s.depts}
                  </div>
                </div>
                <div className="mini-kpi">
                  <div className="k-lbl">AVG SATISFACTION</div>
                  <div className="k-val" style={{ color: "var(--amber)" }}>
                    {s.avgSat.toFixed(2)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-faint)", fontWeight: 600, letterSpacing: "0.04em" }}>
                ATTRITION RATE BY DEPARTMENT
              </div>
              <div className="mini-bars">
                {s.bars.map((b) => (
                  <div
                    key={b.d}
                    className="bar"
                    title={`${b.d}: ${b.rate.toFixed(1)}%`}
                    style={{ height: `${(b.rate / maxBar) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Capabilities</span>
            <h3>Everything HR needs to act on attrition</h3>
            <p>
              A single, fast, client-side workspace that goes from high-level workforce health to a single
              employee&apos;s risk score without ever leaving the page.
            </p>
          </div>
          <div className="feature-grid">
            {[
              {
                bg: "var(--amber-soft)",
                stroke: "var(--amber)",
                icon: (
                  <>
                    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 14l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ),
                title: "Executive KPI cockpit",
                body: "Six live KPIs — headcount, attrition rate, at-risk count, satisfaction, tenure, and overtime exposure — recompute instantly as you filter.",
              },
              {
                bg: "var(--teal-soft)",
                stroke: "var(--teal)",
                icon: (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ),
                title: "Live risk prediction",
                body: "Feed in an employee profile and the logistic-regression model returns a calibrated attrition probability with a transparent factor breakdown.",
              },
              {
                bg: "var(--violet-soft)",
                stroke: "var(--violet)",
                icon: (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" strokeLinecap="round" />
                  </>
                ),
                title: "Interactive drill-downs",
                body: "Attrition by department, salary band, tenure, overtime, work mode and satisfaction — every chart cross-filters against the same query.",
              },
              {
                bg: "var(--coral-soft)",
                stroke: "var(--coral)",
                icon: (
                  <>
                    <path d="M12 2l3 6 6 .9-4.5 4.3L18 20l-6-3.2L6 20l1.5-6.8L3 8.9 9 8z" strokeLinejoin="round" />
                  </>
                ),
                title: "Model transparency",
                body: "Accuracy, precision, recall, F1 and AUC, a full confusion matrix, ROC curve and ranked coefficients — nothing is a black box.",
              },
              {
                bg: "var(--teal-soft)",
                stroke: "var(--blue)",
                icon: (
                  <>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                  </>
                ),
                title: "Full data explorer",
                body: "Search, sort and paginate all records in a virtualized table with color-coded attrition badges for fast manual review.",
              },
              {
                bg: "var(--amber-soft)",
                stroke: "var(--amber)",
                icon: (
                  <>
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ),
                title: "Zero backend, deployable",
                body: "The dataset and trained model ship with the app. It runs anywhere as a static Next.js deployment — no database or API keys required.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-ico" style={{ background: f.bg }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2">
                    {f.icon}
                  </svg>
                </div>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS BAND */}
      <section className="section" id="metrics">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Model performance</span>
            <h3>Trained, tested and measured</h3>
            <p>
              A logistic-regression classifier trained on {MODEL.metrics.train_size.toLocaleString()} records and
              validated on {MODEL.metrics.test_size.toLocaleString()} held-out employees.
            </p>
          </div>
          <div className="stat-band">
            <div className="cell">
              <div className="big" style={{ color: "var(--amber)" }}>
                {(MODEL.metrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className="sm">Accuracy</div>
            </div>
            <div className="cell">
              <div className="big" style={{ color: "var(--teal)" }}>
                {(MODEL.metrics.precision * 100).toFixed(1)}%
              </div>
              <div className="sm">Precision</div>
            </div>
            <div className="cell">
              <div className="big" style={{ color: "var(--violet)" }}>
                {(MODEL.metrics.recall * 100).toFixed(1)}%
              </div>
              <div className="sm">Recall</div>
            </div>
            <div className="cell">
              <div className="big" style={{ color: "var(--coral)" }}>
                {(MODEL.metrics.auc * 100).toFixed(1)}%
              </div>
              <div className="sm">ROC AUC</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h3>From records to retention action</h3>
          </div>
          <div className="steps">
            {[
              { n: "01", h: "Load the workforce", p: "The full employee dataset is bundled with the app and parsed instantly on load — no upload step." },
              { n: "02", h: "Explore & filter", p: "Slice by department, work mode, overtime and more. Every KPI and chart updates in lockstep." },
              { n: "03", h: "Score the risk", p: "Enter any employee profile and get a live attrition probability with the drivers behind it." },
              { n: "04", h: "Act with confidence", p: "Prioritize retention conversations using ranked risk factors and model-backed evidence." },
            ].map((st) => (
              <div className="step" key={st.n}>
                <div className="n">{st.n}</div>
                <h4>{st.h}</h4>
                <p>{st.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <h3>Open the intelligence dashboard</h3>
            <p>
              Explore {TOTAL_N.toLocaleString()} employee records, break down attrition drivers, and score flight
              risk in real time.
            </p>
            <Link href="/dashboard" className="cta-lg primary" style={{ margin: "0 auto" }}>
              Launch Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="brand-lock">
            <div className="brand-mark" style={{ width: 30, height: 30, fontSize: 13 }}>
              WA
            </div>
            <span>Workforce Attrition Intelligence</span>
          </div>
          <div>Client-side HR analytics · Built with Next.js &amp; Chart.js</div>
        </div>
      </footer>
    </>
  )
}
