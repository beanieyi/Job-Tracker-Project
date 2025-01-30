import { motion } from "framer-motion"
import PropTypes from "prop-types"
import {
  TrendingUpIcon,
  DollarSignIcon,
  BriefcaseIcon,
  CodeIcon,
} from "lucide-react"

const InsightView = ({ roleInsights }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Role Insights</h2>
        <p className="text-[#B5BAC1]">Market analysis and role requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roleInsights.map((role) => (
          <motion.div
            key={role.role_title}
            initial={{ scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className="bg-[#2B2D31] rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {role.role_title}
              </h3>
              <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center">
                <BriefcaseIcon size={20} className="text-white" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CodeIcon size={16} className="text-[#B5BAC1]" />
                <h4 className="text-[#B5BAC1] font-medium">Common Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.common_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#383A40] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSignIcon size={16} className="text-[#57F287]" />
                  <h4 className="text-[#B5BAC1] font-medium">Salary</h4>
                </div>
                <p className="text-white">{role.average_salary}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUpIcon size={16} className="text-[#FEE75C]" />
                  <h4 className="text-[#B5BAC1] font-medium">Demand</h4>
                </div>
                <p className="text-white">{role.demand_trend}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

InsightView.propTypes = {
  roleInsights: PropTypes.arrayOf(
    PropTypes.shape({
      role_title: PropTypes.string.isRequired,
      common_skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      average_salary: PropTypes.string.isRequired,
      demand_trend: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default InsightView
