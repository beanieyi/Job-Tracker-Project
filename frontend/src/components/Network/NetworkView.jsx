import React from "react"
import { motion } from "motion/react-client"
import { LinkedinIcon, MailIcon, PhoneIcon } from "lucide-react"

const NetworkView = ({ contacts }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Professional Network</h2>
        <p className="text-[#B5BAC1]">
          Keep track of your professional connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#2B2D31] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {contact.name}
                  </h3>
                  <p className="text-[#B5BAC1] text-sm">{contact.role}</p>
                </div>
                <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center">
                  {contact.name.charAt(0)}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[#B5BAC1] font-medium">{contact.company}</p>
              </div>

              <div className="mt-6 flex gap-4">
                {contact.email && (
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={`mailto:${contact.email}`}
                    className="text-[#B5BAC1] hover:text-[#5865F2]"
                  >
                    <MailIcon size={20} />
                  </motion.a>
                )}

                {contact.linkedin && (
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B5BAC1] hover:text-[#5865F2]"
                  >
                    <LinkedinIcon size={20} />
                  </motion.a>
                )}

                {contact.phone && (
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={`tel:${contact.phone}`}
                    className="text-[#B5BAC1] hover:text-[#5865F2]"
                  >
                    <PhoneIcon size={20} />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default NetworkView
