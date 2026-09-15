import employeeData from "@/data/employees.json"
import modelData from "@/data/model.json"

export type EmployeeRow = {
  EmployeeID: string | null
  Full_Name: string | null
  Gender: string | null
  Age: number | null
  Department: string | null
  JobTitle: string | null
  City: string | null
  Salary: number | null
  Marital_Status: string | null
  EducationLevel: string | null
  PerformanceRating: number | null
  Attrition: boolean | null
  YearsAtCompany: number | null
  OverTime: boolean | null
  TrainingHoursLastYear: number | null
  Work_Mode: string | null
  SatisfactionScore: number | null
  Employment_Status: string | null
  HireDate: string | null
}

export type ModelShape = {
  feature_names: string[]
  coef: number[]
  intercept: number
  scaler_mean: number[]
  scaler_scale: number[]
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1: number
    auc: number
    confusion_matrix: number[][]
    train_size: number
    test_size: number
  }
  num_cols: string[]
  bool_cols: string[]
  cat_cols: string[]
  cat_values: Record<string, string[]>
  num_medians: Record<string, number>
  roc_points: number[][]
}

const HEADERS = employeeData.headers as (keyof EmployeeRow)[]

export const ALL_ROWS: EmployeeRow[] = (employeeData.rows as unknown[][]).map((r) => {
  const o = {} as Record<string, unknown>
  HEADERS.forEach((h, i) => {
    o[h] = r[i]
  })
  return o as EmployeeRow
})

export const TOTAL_N = ALL_ROWS.length
export const MODEL = modelData as ModelShape

export function uniqueSorted(field: keyof EmployeeRow): string[] {
  const s = new Set<string>()
  ALL_ROWS.forEach((r) => {
    const v = r[field]
    if (v !== null && v !== undefined && v !== "") s.add(String(v))
  })
  return Array.from(s).sort()
}

export function fmtNum(n: number | null | undefined, d = 0): string {
  if (n === null || n === undefined || isNaN(n)) return "—"
  return n.toLocaleString("en-IN", { maximumFractionDigits: d })
}

export function pct(n: number | null | undefined, d = 1): string {
  if (n === null || n === undefined || isNaN(n)) return "—"
  return n.toFixed(d) + "%"
}

export const isAttrited = (r: EmployeeRow) => r.Attrition === true
