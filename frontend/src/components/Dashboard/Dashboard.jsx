import { motion } from "framer-motion"
import PropTypes from "prop-types"
import ApplicationSankey from "./ApplicationSankey"

const Dashboard = ({ applications }) => {
  const stats = {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-[#2B2D31] p-6 rounded-lg"
        >
          <h3 className="text-[#B5BAC1] text-sm font-medium">
            Total Applications
          </h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2B2D31] p-6 rounded-lg"
        >
          <h3 className="text-[#B5BAC1] text-sm font-medium">In Progress</h3>
          <p className="text-4xl font-bold text-[#5865F2] mt-2">
            {stats.inProgress}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2B2D31] p-6 rounded-lg"
        >
          <h3 className="text-[#B5BAC1] text-sm font-medium">Interviews</h3>
          <p className="text-4xl font-bold text-[#FEE75C] mt-2">
            {stats.interviews}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#2B2D31] p-6 rounded-lg"
        >
          <h3 className="text-[#B5BAC1] text-sm font-medium">Offers</h3>
          <p className="text-4xl font-bold text-[#57F287] mt-2">
            {stats.offers}
          </p>
        </motion.div>
      </div>

      {/* Sankey Diagram */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#2B2D31] p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold text-white mb-4">Application Flow</h2>
        <div className="h-[400px]">
          <ApplicationSankey applications={applications} />
        </div>
      </motion.div>
    </motion.div>
  )
}

Dashboard.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Dashboard
