"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
)

ChartJS.defaults.color = "#9ba6c0"
ChartJS.defaults.font.family = "var(--font-inter), sans-serif"
ChartJS.defaults.font.size = 11
ChartJS.defaults.borderColor = "rgba(33,45,72,0.6)"

export const PALETTE = {
  amber: "#f0a93b",
  teal: "#38d9c4",
  coral: "#f0685e",
  violet: "#9b8cf0",
  blue: "#5b9ef0",
  grid: "rgba(33,45,72,0.55)",
}

export { ChartJS }
