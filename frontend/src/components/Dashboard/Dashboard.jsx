import React from "react"
import { Sankey } from "recharts"
import { useState, useEffect } from "react"

// Discord theme colors
const theme = {
  blurple: "#5865F2",
  green: "#57F287",
  yellow: "#FEE75C",
  red: "#ED4245",
  background: "#313338",
  cardBg: "#2B2D31",
  textPrimary: "#FFFFFF",
  textSecondary: "#B5BAC1",
}

const Dashboard = ({ applications }) => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    interviews: 0,
    offers: 0,
  })

  useEffect(() => {
    if (applications) {
      const newStats = {
        total: applications.length,
        inProgress: applications.filter((app) =>
          ["Initial Screen", "Technical Interview", "Final Interview"].includes(
            app.status
          )
        ).length,
        interviews: applications.filter((app) =>
          ["Technical Interview", "Final Interview"].includes(app.status)
        ).length,
        offers: applications.filter((app) =>
          ["Offer", "Accepted"].includes(app.status)
        ).length,
      }
      setStats(newStats)
    }
  }, [applications])

  return (
    <div className="min-h-screen bg-[#313338] p-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-blurple rounded-full flex items-center justify-center text-2xl text-white font-bold">
          AJ
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Alex Johnson</h1>
          <p className="text-[#B5BAC1]">Frontend Developer</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Total Applications */}
        <div className="bg-[#2B2D31] rounded-lg p-6">
          <h3 className="text-[#B5BAC1] text-sm font-medium">
            Total Applications
          </h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>

        {/* In Progress */}
        <div className="bg-[#2B2D31] rounded-lg p-6">
          <h3 className="text-[#B5BAC1] text-sm font-medium">In Progress</h3>
          <p className="text-4xl font-bold text-[#5865F2] mt-2">
            {stats.inProgress}
          </p>
        </div>

        {/* Interviews */}
        <div className="bg-[#2B2D31] rounded-lg p-6">
          <h3 className="text-[#B5BAC1] text-sm font-medium">Interviews</h3>
          <p className="text-4xl font-bold text-[#FEE75C] mt-2">
            {stats.interviews}
          </p>
        </div>

        {/* Offers */}
        <div className="bg-[#2B2D31] rounded-lg p-6">
          <h3 className="text-[#B5BAC1] text-sm font-medium">Offers</h3>
          <p className="text-4xl font-bold text-[#57F287] mt-2">
            {stats.offers}
          </p>
        </div>
      </div>

      {/* Application Pipeline Section */}
      <div className="bg-[#2B2D31] rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">
          Application Pipeline
        </h2>
        <div className="text-[#B5BAC1] text-sm mb-4">
          Flow of applications through different stages
        </div>
        <div className="h-96">
          {/* Sankey diagram will be implemented here */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
