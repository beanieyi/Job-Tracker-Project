import React, { useState } from "react"
import { motion } from "motion/react-client"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // This will be replaced with actual backend integration
      // For now, we'll simulate a login
      if (email && password) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
        onLogin({ email })
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2B2D31] p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Welcome back!</h2>

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
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
