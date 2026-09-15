"use client"

import { useMemo, useState } from "react"
import { ALL_ROWS, type EmployeeRow, fmtNum } from "@/lib/data"
import { Icon } from "../icons"

const COLUMNS: { key: keyof EmployeeRow; label: string; numeric?: boolean }[] = [
  { key: "EmployeeID", label: "ID" },
  { key: "Full_Name", label: "Name" },
  { key: "Department", label: "Department" },
  { key: "JobTitle", label: "Job Title" },
  { key: "City", label: "City" },
  { key: "Age", label: "Age", numeric: true },
  { key: "Salary", label: "Salary", numeric: true },
  { key: "YearsAtCompany", label: "Tenure", numeric: true },
  { key: "SatisfactionScore", label: "Satisfaction", numeric: true },
  { key: "OverTime", label: "Overtime" },
  { key: "Work_Mode", label: "Work Mode" },
  { key: "Attrition", label: "Attrition" },
]

const PAGE_SIZE = 25

export default function ExplorerTab() {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<keyof EmployeeRow>("EmployeeID")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = ALL_ROWS
    if (q) {
      rows = rows.filter((r) =>
        [r.Full_Name, r.Department, r.JobTitle, r.City, r.EmployeeID]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      )
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === null || av === undefined) return 1
      if (bv === null || bv === undefined) return -1
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return sorted
  }, [query, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: keyof EmployeeRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(0)
  }

  const cell = (r: EmployeeRow, key: keyof EmployeeRow) => {
    const v = r[key]
    if (key === "Attrition") {
      return <span className={`badge ${v ? "badge-yes" : "badge-no"}`}>{v ? "Left" : "Stayed"}</span>
    }
    if (key === "OverTime") return v ? "Yes" : "No"
    if (key === "Salary") return "₹" + fmtNum(v as number)
    if (key === "SatisfactionScore" && typeof v === "number") return v.toFixed(1)
    if (v === null || v === undefined) return "—"
    return String(v)
  }

  return (
    <div className="tab-panel">
      <div className="explorer-toolbar">
        <div className="search-box">
          <Icon name="search" size={15} />
          <input
            type="text"
            placeholder="Search by name, department, job title, city or ID…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <span className="filter-count">
          <b style={{ color: "var(--teal)" }}>{fmtNum(filtered.length)}</b> records
        </span>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c.key} onClick={() => toggleSort(c.key)}>
                    {c.label}
                    <span className="arrow">{sortKey === c.key ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r, i) => (
                <tr key={(r.EmployeeID ?? "") + "-" + i}>
                  {COLUMNS.map((c) => (
                    <td key={c.key}>{cell(r, c.key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Showing {safePage * PAGE_SIZE + 1}–{Math.min(filtered.length, (safePage + 1) * PAGE_SIZE)} of{" "}
            {fmtNum(filtered.length)}
          </span>
          <div className="pagination">
            <button disabled={safePage === 0} onClick={() => setPage(0)} aria-label="First page">
              «
            </button>
            <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)} aria-label="Previous page">
              ‹
            </button>
            <span>
              Page {safePage + 1} / {pageCount}
            </span>
            <button disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} aria-label="Next page">
              ›
            </button>
            <button disabled={safePage >= pageCount - 1} onClick={() => setPage(pageCount - 1)} aria-label="Last page">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
