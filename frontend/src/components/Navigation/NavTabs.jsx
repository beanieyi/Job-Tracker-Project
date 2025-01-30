import React from "react"
import { motion } from "motion/react-client"

const NavTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "applications", label: "Applications" },
    { id: "network", label: "Network" },
    { id: "insights", label: "Insights" },
  ]

  return (
    <div className="bg-[#2B2D31] p-2 rounded-lg mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium
              ${
                activeTab === tab.id
                  ? "bg-[#5865F2] text-white"
                  : "text-[#B5BAC1] hover:bg-[#383A40] hover:text-white"
              }
              transition-all duration-200
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default NavTabs
