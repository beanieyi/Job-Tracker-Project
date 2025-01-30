import { useState } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For development, accept any credentials
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onLogin()
    } catch (err) {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2B2D31] p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Welcome to Job Tracker
        </h2>
        <p className="text-[#B5BAC1] mb-6">
          Use any email and password to log in during development.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#B5BAC1] text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#383A40] border border-[#222327] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              placeholder="Enter any email"
              required
            />
          </div>

          <div>
            <label className="block text-[#B5BAC1] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#383A40] border border-[#222327] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              placeholder="Enter any password"
              required
            />
          </div>

          {error && <div className="text-[#ED4245] text-sm">{error}</div>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-2 px-4 bg-[#5865F2] text-white rounded-md font-medium
              hover:bg-[#4752C4] transition-colors duration-200
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Enter Dashboard"}
          </motion.button>
        </form>

        <div className="mt-4 text-sm text-[#B5BAC1] text-center">
          Development mode: All credentials accepted
        </div>
      </motion.div>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default Login
