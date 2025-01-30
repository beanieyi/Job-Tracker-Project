import PropTypes from "prop-types"
import { ResponsiveSankey } from "@nivo/sankey"

const ApplicationSankey = ({ applications }) => {
  // Define stages in order of progression
  const stageOrder = [
    "Applied",
    "Initial Screen",
    "Technical Interview",
    "Final Interview",
    "Offer",
    "Accepted",
  ]

  const endStages = ["Rejected", "Withdrawn", "No Response"]

  // Define colors using your application's theme
  const stageColors = {
    Applied: "#5865F2", // Discord Blurple
    "Initial Screen": "#57F287", // Discord Green
    "Technical Interview": "#57F287",
    "Final Interview": "#FEE75C", // Discord Yellow
    Offer: "#57F287",
    Accepted: "#57F287",
    Rejected: "#ED4245", // Discord Red
    Withdrawn: "#4F545C", // Discord Grey
    "No Response": "#4F545C",
  }

  // Create nodes for all possible stages
  const nodes = [...stageOrder, ...endStages].map((id) => ({
    id,
    nodeColor: stageColors[id],
  }))

  // Create links based on timeline progression
  const links = []
  const addLink = (source, target, value = 1) => {
    const existingLink = links.find(
      (link) => link.source === source && link.target === target
    )
    if (existingLink) {
      existingLink.value += value
    } else {
      links.push({ source, target, value })
    }
  }

  // Process each application
  applications.forEach((app) => {
    let lastStage = "Applied"

    // Handle applications that went through the successful path
    if (app.status === "Accepted" || app.status === "Offer") {
      for (let i = 0; i < stageOrder.length - 1; i++) {
        const currentStage = stageOrder[i]
        const nextStage = stageOrder[i + 1]
        if (nextStage === app.status || nextStage === "Accepted") {
          addLink(currentStage, nextStage)
          lastStage = nextStage
        }
      }
    }
    // Handle applications that were rejected after interviews
    else if (app.status === "Rejected") {
      if (app.had_final_interview) {
        addLink("Applied", "Initial Screen")
        addLink("Initial Screen", "Technical Interview")
        addLink("Technical Interview", "Final Interview")
        addLink("Final Interview", "Rejected")
      } else if (app.had_technical) {
        addLink("Applied", "Initial Screen")
        addLink("Initial Screen", "Technical Interview")
        addLink("Technical Interview", "Rejected")
      } else {
        addLink("Applied", "Initial Screen")
        addLink("Initial Screen", "Rejected")
      }
    }
    // Handle other end states
    else if (endStages.includes(app.status)) {
      addLink("Applied", app.status)
    }
    // Handle applications in progress
    else {
      for (let i = 0; i < stageOrder.length; i++) {
        const currentStage = stageOrder[i]
        if (currentStage === app.status) {
          for (let j = 0; j < i; j++) {
            addLink(stageOrder[j], stageOrder[j + 1])
          }
          break
        }
      }
    }
  })

  return (
    <div style={{ height: 400 }}>
      <ResponsiveSankey
        data={{
          nodes,
          links,
        }}
        margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
        align="justify"
        colors={(node) => node.nodeColor || stageColors[node.id]}
        nodeOpacity={1}
        nodeThickness={30}
        nodeInnerPadding={3}
        nodeSpacing={24}
        nodeBorderRadius={2}
        linkOpacity={0.3}
        linkHoverOpacity={0.5}
        linkContract={0}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: "color" }}
        animate={false}
        theme={{
          tooltip: {
            container: {
              background: "#FFFFFF",
              borderRadius: "4px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              padding: "12px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(8px)",
            },
          },
          labels: {
            text: {
              fontSize: 14,
              fill: "#FFFFFF",
            },
          },
        }}
        nodeTooltip={({ node }) => (
          <div
            style={{
              background: "#FFFFFF",
              padding: "8px 12px",
              borderRadius: "4px",
              minWidth: "150px",
            }}
          >
            <div
              style={{
                color: stageColors[node.id],
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {node.id}
            </div>
            <div style={{ color: "#4F545C" }}>{node.value} applications</div>
          </div>
        )}
        linkTooltip={({ link }) => (
          <div
            style={{
              background: "#FFFFFF",
              padding: "8px 12px",
              borderRadius: "4px",
              minWidth: "150px",
            }}
          >
            <div style={{ color: "#4F545C", marginBottom: "4px" }}>
              {link.source.id} → {link.target.id}
            </div>
            <div style={{ color: "#2B2D31", fontWeight: "bold" }}>
              {link.value} applications
            </div>
          </div>
        )}
      />
    </div>
  )
}

ApplicationSankey.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      had_final_interview: PropTypes.bool,
      had_technical: PropTypes.bool,
    })
  ).isRequired,
}

export default ApplicationSankey
