import React, { useMemo } from "react"
import { ResponsiveContainer, Sankey, Tooltip } from "recharts"

const ApplicationSankey = ({ applications }) => {
  const sankeyData = useMemo(() => {
    // Transform applications data into Sankey format
    const nodes = [
      { name: "Applied" },
      { name: "Initial Screen" },
      { name: "Technical Interview" },
      { name: "Final Interview" },
      { name: "Offer" },
      { name: "Accepted" },
      { name: "Rejected" },
      { name: "Withdrawn" },
      { name: "No Response" },
    ]

    // Count transitions between states
    const links = []
    const stateTransitions = {}

    applications.forEach((app) => {
      const timeline = applications
        .filter((t) => t.id === app.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      for (let i = 0; i < timeline.length - 1; i++) {
        const source = timeline[i].status
        const target = timeline[i + 1].status
        const key = `${source}-${target}`

        if (!stateTransitions[key]) {
          stateTransitions[key] = 0
        }
        stateTransitions[key]++
      }
    })

    // Convert state transitions to links
    Object.entries(stateTransitions).forEach(([key, value]) => {
      const [source, target] = key.split("-")
      links.push({
        source: nodes.findIndex((n) => n.name === source),
        target: nodes.findIndex((n) => n.name === target),
        value,
      })
    })

    return { nodes, links }
  }, [applications])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={sankeyData}
        node={{
          padding: 15,
          thickness: 20,
          fill: "#5865F2",
        }}
        link={{
          stroke: "#2B2D31",
        }}
        nodePadding={50}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  )
}

export default ApplicationSankey
