"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ALL_ROWS, TOTAL_N, uniqueSorted, type EmployeeRow } from "@/lib/data"
import OverviewTab from "./tabs/overview-tab"
import PredictionTab from "./tabs/prediction-tab"
import ModelTab from "./tabs/model-tab"
import ExplorerTab from "./tabs/explorer-tab"
import AboutTab from "./tabs/about-tab"
import { Icon } from "./icons"

type TabId = "overview" | "predict" | "model" | "explorer" | "about"

const TABS: { id: TabId; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { id: "overview", label: "Dashboard", icon: "grid" },
  { id: "predict", label: "Risk Prediction", icon: "target" },
  { id: "model", label: "Model Performance", icon: "activity" },
  { id: "explorer", label: "Data Explorer", icon: "table" },
  { id: "about", label: "About", icon: "info" },
]

const TAB_META: Record<TabId, { title: string; sub: string }> = {
  overview: { title: "Workforce Overview", sub: "Attrition health across the organization" },
  predict: { title: "Attrition Risk Prediction", sub: "Score an employee profile in real time" },
  model: { title: "Model Performance", sub: "How the logistic-regression classifier performs" },
  explorer: { title: "Data Explorer", sub: `Browse all ${TOTAL_N.toLocaleString()} employee records` },
  about: { title: "About this Platform", sub: "Data, methodology and disclaimers" },
}

export default function DashboardApp() {
  const [tab, setTab] = useState<TabId>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [dept, setDept] = useState("All")
  const [workMode, setWorkMode] = useState("All")
  const [overtime, setOvertime] = useState("All")
  const [status, setStatus] = useState("All")

  const depts = useMemo(() => uniqueSorted("Department"), [])
  const workModes = useMemo(() => uniqueSorted("Work_Mode"), [])
  const statuses = useMemo(() => uniqueSorted("Employment_Status"), [])

  const filtered: EmployeeRow[] = useMemo(() => {
    return ALL_ROWS.filter((r) => {
      if (dept !== "All" && r.Department !== dept) return false
      if (workMode !== "All" && r.Work_Mode !== workMode) return false
      if (overtime !== "All" && String(r.OverTime) !== overtime) return false
      if (status !== "All" && r.Employment_Status !== status) return false
      return true
    })
  }, [dept, workMode, overtime, status])

  const resetFilters = () => {
    setDept("All")
    setWorkMode("All")
    setOvertime("All")
    setStatus("All")
  }

  const meta = TAB_META[tab]

  return (
    <div id="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">WA</div>
          <div className="brand-text">
            <h1>Workforce Attrition</h1>
            <p>INTELLIGENCE PLATFORM</p>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-label">Analytics</div>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-item ${tab === t.id ? "active" : ""}`}
              onClick={() => {
                setTab(t.id)
                setSidebarOpen(false)
              }}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          ))}
          <div className="nav-label" style={{ marginTop: 14 }}>
            Navigate
          </div>
          <Link href="/" className="nav-item">
            <Icon name="home" />
            Back to site
          </Link>
        </nav>
        <div className="sidebar-footer">
          <b>{TOTAL_N.toLocaleString()}</b> records loaded
          <br />
          Model: <b>Logistic Regression</b>
          <br />
          <span style={{ color: "var(--text-faint)" }}>Runs fully client-side</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle menu">
              <Icon name="menu" />
            </button>
            <div>
              <h2>{meta.title}</h2>
              <div className="sub">{meta.sub}</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="pill">
              <span className="dot" />
              Live · client-side
            </span>
            <Link href="/dashboard#predict" className="btn btn-primary" onClick={() => setTab("predict")}>
              Predict risk
            </Link>
          </div>
        </header>

        <div className="content">
          {tab === "overview" && (
            <OverviewTab
              rows={filtered}
              filters={{ dept, workMode, overtime, status }}
              options={{ depts, workModes, statuses }}
              setDept={setDept}
              setWorkMode={setWorkMode}
              setOvertime={setOvertime}
              setStatus={setStatus}
              reset={resetFilters}
            />
          )}
          {tab === "predict" && <PredictionTab />}
          {tab === "model" && <ModelTab />}
          {tab === "explorer" && <ExplorerTab />}
          {tab === "about" && <AboutTab />}
        </div>
      </main>
    </div>
  )
}
