import PropTypes from "prop-types"
import { ResponsiveContainer, Sankey, Tooltip } from "recharts"

const ApplicationSankey = ({ applications }) => {
  // Transform data for Sankey diagram
  const nodes = [
    { name: "Applied" },
    { name: "Initial Screen" },
    { name: "Technical Interview" },
    { name: "Final Interview" },
    { name: "Offer" },
    { name: "Accepted" },
    { name: "Rejected" },
    { name: "Withdrawn" },
  ]

  // Count application flow
  const links = applications.reduce((acc, app) => {
    const statusIndex = nodes.findIndex((node) => node.name === app.status)
    if (statusIndex >= 0) {
      acc.push({
        source: 0, // Applied is always the source
        target: statusIndex,
        value: 1,
      })
    }
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={{
          nodes: nodes.map((node) => ({
            ...node,
            fill:
              node.name === "Accepted"
                ? "#57F287"
                : node.name === "Rejected"
                ? "#ED4245"
                : node.name === "Offer"
                ? "#FEE75C"
                : "#5865F2",
          })),
          links,
        }}
        nodePadding={50}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        link={{ stroke: "#2B2D31" }}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  )
}

ApplicationSankey.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ApplicationSankey
