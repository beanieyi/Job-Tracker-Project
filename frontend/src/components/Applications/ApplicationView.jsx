import { motion } from "framer-motion"
import PropTypes from "prop-types"

const ApplicationView = ({ applications }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Applications</h2>
        <p className="text-[#B5BAC1]">Track your job applications</p>
      </div>

      <div className="bg-[#2B2D31] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1E1F22]">
            <tr>
              <th className="px-6 py-4 text-left text-[#B5BAC1]">Position</th>
              <th className="px-6 py-4 text-left text-[#B5BAC1]">Company</th>
              <th className="px-6 py-4 text-left text-[#B5BAC1]">Status</th>
              <th className="px-6 py-4 text-left text-[#B5BAC1]">
                Date Applied
              </th>
              <th className="px-6 py-4 text-left text-[#B5BAC1]">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1F22]">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-[#383A40] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{app.position}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[#B5BAC1]">{app.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`text-sm rounded-full px-3 py-1 inline-block
                    ${
                      app.status === "Offer"
                        ? "bg-[#57F287] text-[#1E1F22]"
                        : app.status === "Rejected"
                        ? "bg-[#ED4245] text-white"
                        : app.status === "Interview"
                        ? "bg-[#FEE75C] text-[#1E1F22]"
                        : "bg-[#5865F2] text-white"
                    }`}
                  >
                    {app.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[#B5BAC1]">
                    {new Date(app.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`text-sm font-medium
                    ${
                      app.priority === "High"
                        ? "text-[#ED4245]"
                        : app.priority === "Medium"
                        ? "text-[#FEE75C]"
                        : "text-[#57F287]"
                    }`}
                  >
                    {app.priority}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

ApplicationView.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      position: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ApplicationView
