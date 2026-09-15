"use client"

import { useMemo } from "react"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { PALETTE } from "@/components/chart-setup"
import { type EmployeeRow, TOTAL_N, isAttrited, pct, fmtNum } from "@/lib/data"
import { Icon } from "../icons"

type Props = {
  rows: EmployeeRow[]
  filters: { dept: string; workMode: string; overtime: string; status: string }
  options: { depts: string[]; workModes: string[]; statuses: string[] }
  setDept: (v: string) => void
  setWorkMode: (v: string) => void
  setOvertime: (v: string) => void
  setStatus: (v: string) => void
  reset: () => void
}

const chartOpts = (opts: object = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { padding: 10, backgroundColor: "#0d1424", borderColor: "#212d48", borderWidth: 1 } },
  ...opts,
})

function rate(rows: EmployeeRow[], pred: (r: EmployeeRow) => boolean) {
  const grp = rows.filter(pred)
  if (!grp.length) return 0
  return (grp.filter(isAttrited).length / grp.length) * 100
}

export default function OverviewTab({ rows, filters, options, setDept, setWorkMode, setOvertime, setStatus, reset }: Props) {
  const kpis = useMemo(() => {
    const n = rows.length
    const attrited = rows.filter(isAttrited)
    const attrRate = n ? (attrited.length / n) * 100 : 0
    const avgSat = n ? rows.reduce((s, r) => s + (r.SatisfactionScore ?? 0), 0) / n : 0
    const avgTenure = n ? rows.reduce((s, r) => s + (r.YearsAtCompany ?? 0), 0) / n : 0
    const otCount = rows.filter((r) => r.OverTime === true).length
    const otRate = n ? (otCount / n) * 100 : 0
    // at-risk = low satisfaction + overtime (heuristic display metric)
    const atRisk = rows.filter((r) => (r.SatisfactionScore ?? 5) <= 2.5 || r.OverTime === true).length
    return { n, attrCount: attrited.length, attrRate, avgSat, avgTenure, otRate, atRisk }
  }, [rows])

  // Attrition by department
  const deptChart = useMemo(() => {
    const map: Record<string, { n: number; a: number }> = {}
    rows.forEach((r) => {
      const d = r.Department || "Unknown"
      map[d] = map[d] || { n: 0, a: 0 }
      map[d].n++
      if (isAttrited(r)) map[d].a++
    })
    const entries = Object.entries(map).sort((a, b) => b[1].a / b[1].n - a[1].a / a[1].n)
    return {
      labels: entries.map((e) => e[0]),
      data: entries.map((e) => (e[1].a / e[1].n) * 100),
    }
  }, [rows])

  // Attrition by salary band
  const salaryChart = useMemo(() => {
    const bands = [
      { label: "< 5L", min: 0, max: 500000 },
      { label: "5–8L", min: 500000, max: 800000 },
      { label: "8–12L", min: 800000, max: 1200000 },
      { label: "12–18L", min: 1200000, max: 1800000 },
      { label: "18L+", min: 1800000, max: Infinity },
    ]
    return {
      labels: bands.map((b) => b.label),
      data: bands.map((b) => rate(rows, (r) => (r.Salary ?? 0) >= b.min && (r.Salary ?? 0) < b.max)),
    }
  }, [rows])

  // Attrition by tenure bucket
  const tenureChart = useMemo(() => {
    const buckets = [
      { label: "0–1y", min: 0, max: 2 },
      { label: "2–3y", min: 2, max: 4 },
      { label: "4–6y", min: 4, max: 7 },
      { label: "7–10y", min: 7, max: 11 },
      { label: "10y+", min: 11, max: Infinity },
    ]
    return {
      labels: buckets.map((b) => b.label),
      data: buckets.map((b) => rate(rows, (r) => (r.YearsAtCompany ?? 0) >= b.min && (r.YearsAtCompany ?? 0) < b.max)),
    }
  }, [rows])

  // Overtime doughnut
  const otChart = useMemo(() => {
    const ot = rate(rows, (r) => r.OverTime === true)
    const noOt = rate(rows, (r) => r.OverTime === false)
    return { ot, noOt }
  }, [rows])

  // Work mode
  const workChart = useMemo(() => {
    const modes = options.workModes
    return { labels: modes, data: modes.map((m) => rate(rows, (r) => r.Work_Mode === m)) }
  }, [rows, options.workModes])

  // Satisfaction vs attrition
  const satChart = useMemo(() => {
    const levels = [1, 2, 3, 4, 5]
    return {
      labels: levels.map((l) => `${l}`),
      data: levels.map((l) => rate(rows, (r) => Math.round(r.SatisfactionScore ?? 0) === l)),
    }
  }, [rows])

  const kpiCards = [
    { label: "HEADCOUNT", value: fmtNum(kpis.n), meta: `of ${TOTAL_N.toLocaleString()} total`, accent: "var(--teal)", icon: "users" as const },
    { label: "ATTRITION RATE", value: pct(kpis.attrRate), meta: `${fmtNum(kpis.attrCount)} left`, accent: "var(--coral)", icon: "trend-down" as const },
    { label: "AT-RISK EMPLOYEES", value: fmtNum(kpis.atRisk), meta: "low satisfaction / overtime", accent: "var(--amber)", icon: "alert" as const },
    { label: "AVG SATISFACTION", value: kpis.avgSat.toFixed(2), meta: "out of 5.0", accent: "var(--violet)", icon: "smile" as const },
    { label: "AVG TENURE", value: `${kpis.avgTenure.toFixed(1)}y`, meta: "years at company", accent: "var(--blue)", icon: "clock" as const },
    { label: "OVERTIME EXPOSURE", value: pct(kpis.otRate), meta: "of workforce", accent: "var(--amber)", icon: "zap" as const },
  ]

  const activeFilters = [filters.dept, filters.workMode, filters.overtime, filters.status].filter((f) => f !== "All").length

  return (
    <div className="tab-panel">
      {/* KPIs */}
      <div className="kpi-grid">
        {kpiCards.map((k) => (
          <div className="kpi-card" key={k.label} style={{ ["--kpi-accent" as string]: k.accent }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-meta" style={{ color: k.accent }}>
              <Icon name={k.icon} size={13} />
              <span style={{ color: "var(--text-dim)" }}>{k.meta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Department</label>
          <select value={filters.dept} onChange={(e) => setDept(e.target.value)}>
            <option>All</option>
            {options.depts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Work Mode</label>
          <select value={filters.workMode} onChange={(e) => setWorkMode(e.target.value)}>
            <option>All</option>
            {options.workModes.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Overtime</label>
          <select value={filters.overtime} onChange={(e) => setOvertime(e.target.value)}>
            <option value="All">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Employment Status</label>
          <select value={filters.status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {options.statuses.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="filter-actions">
          <span className="filter-count">
            <b>{fmtNum(rows.length)}</b> matching · {activeFilters} filter{activeFilters === 1 ? "" : "s"}
          </span>
          <button className="btn btn-ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card span-8">
          <h3>Attrition Rate by Department</h3>
          <div className="chart-sub">Share of employees who left, per department</div>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: deptChart.labels,
                datasets: [
                  {
                    data: deptChart.data,
                    backgroundColor: PALETTE.amber,
                    borderRadius: 5,
                    maxBarThickness: 44,
                  },
                ],
              }}
              options={chartOpts({
                scales: {
                  y: { grid: { color: PALETTE.grid }, ticks: { callback: (v: number) => v + "%" } },
                  x: { grid: { display: false } },
                },
              })}
            />
          </div>
        </div>

        <div className="chart-card span-4">
          <h3>Overtime &amp; Attrition</h3>
          <div className="chart-sub">Attrition rate by overtime status</div>
          <div className="chart-wrap">
            <Doughnut
              data={{
                labels: ["Works Overtime", "No Overtime"],
                datasets: [
                  {
                    data: [otChart.ot, otChart.noOt],
                    backgroundColor: [PALETTE.coral, PALETTE.teal],
                    borderColor: "#0d1424",
                    borderWidth: 3,
                  },
                ],
              }}
              options={chartOpts({
                cutout: "62%",
                plugins: {
                  legend: { display: true, position: "bottom", labels: { padding: 14, boxWidth: 10, usePointStyle: true } },
                  tooltip: { callbacks: { label: (c: { label: string; parsed: number }) => `${c.label}: ${c.parsed.toFixed(1)}%` } },
                },
              })}
            />
          </div>
        </div>

        <div className="chart-card span-6">
          <h3>Attrition by Tenure</h3>
          <div className="chart-sub">Flight risk across years at company</div>
          <div className="chart-wrap">
            <Line
              data={{
                labels: tenureChart.labels,
                datasets: [
                  {
                    data: tenureChart.data,
                    borderColor: PALETTE.teal,
                    backgroundColor: "rgba(56,217,196,0.12)",
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: PALETTE.teal,
                    pointRadius: 4,
                  },
                ],
              }}
              options={chartOpts({
                scales: {
                  y: { grid: { color: PALETTE.grid }, ticks: { callback: (v: number) => v + "%" } },
                  x: { grid: { display: false } },
                },
              })}
            />
          </div>
        </div>

        <div className="chart-card span-6">
          <h3>Attrition by Salary Band</h3>
          <div className="chart-sub">Compensation vs. likelihood to leave</div>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: salaryChart.labels,
                datasets: [
                  {
                    data: salaryChart.data,
                    backgroundColor: PALETTE.violet,
                    borderRadius: 5,
                    maxBarThickness: 48,
                  },
                ],
              }}
              options={chartOpts({
                scales: {
                  y: { grid: { color: PALETTE.grid }, ticks: { callback: (v: number) => v + "%" } },
                  x: { grid: { display: false } },
                },
              })}
            />
          </div>
        </div>

        <div className="chart-card span-6">
          <h3>Satisfaction vs. Attrition</h3>
          <div className="chart-sub">Attrition rate by satisfaction score</div>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: satChart.labels,
                datasets: [
                  {
                    data: satChart.data,
                    backgroundColor: satChart.data.map((v) =>
                      v > 25 ? PALETTE.coral : v > 15 ? PALETTE.amber : PALETTE.teal,
                    ),
                    borderRadius: 5,
                    maxBarThickness: 54,
                  },
                ],
              }}
              options={chartOpts({
                scales: {
                  y: { grid: { color: PALETTE.grid }, ticks: { callback: (v: number) => v + "%" } },
                  x: { grid: { display: false }, title: { display: true, text: "Satisfaction score (1–5)" } },
                },
              })}
            />
          </div>
        </div>

        <div className="chart-card span-6">
          <h3>Attrition by Work Mode</h3>
          <div className="chart-sub">Remote, hybrid and on-site comparison</div>
          <div className="chart-wrap">
            <Bar
              data={{
                labels: workChart.labels,
                datasets: [
                  {
                    data: workChart.data,
                    backgroundColor: PALETTE.blue,
                    borderRadius: 5,
                    maxBarThickness: 60,
                  },
                ],
              }}
              options={chartOpts({
                indexAxis: "y" as const,
                scales: {
                  x: { grid: { color: PALETTE.grid }, ticks: { callback: (v: number) => v + "%" } },
                  y: { grid: { display: false } },
                },
              })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
