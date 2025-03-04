import { useMemo } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';

const ApplicationSankeyDiagram = ({ applications, timelines }) => {
  
  const { nodes, links, hasValidData } = useMemo(() => {
    // Default empty data
    const emptyResult = { nodes: [], links: [], hasValidData: false };
    
    
    if (!applications || !timelines || !applications.length || !timelines.length) {
      return emptyResult;
    }

    try {
      // First, extract all unique statuses from both applications and timelines
      const allStatuses = new Set();
      
      applications.forEach(app => {
        if (app && app.status) allStatuses.add(app.status);
      });
      
      timelines.forEach(entry => {
        if (entry && entry.status) allStatuses.add(entry.status);
      });
      

      if (allStatuses.size < 2) {
        return emptyResult;
      }
      
      // Get all transitions from timelines
      const statusTransitions = {};
      
      // Group timelines by application_id
      const timelinesByApp = timelines.reduce((acc, item) => {
        if (!item || !item.application_id) return acc;
        
        if (!acc[item.application_id]) {
          acc[item.application_id] = [];
        }
        acc[item.application_id].push(item);
        return acc;
      }, {});
      
      // For each application, analyze the status flow
      Object.values(timelinesByApp).forEach(appTimelines => {
        if (!appTimelines || appTimelines.length < 2) return;
        
        // Sort by date
        const sortedTimelines = [...appTimelines].sort(
          (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
        );
        
        // Track direct transitions only
        for (let i = 0; i < sortedTimelines.length - 1; i++) {
          const sourceStatus = sortedTimelines[i].status;
          const targetStatus = sortedTimelines[i + 1].status;
          
          if (sourceStatus && targetStatus && sourceStatus !== targetStatus) {
            const key = `${sourceStatus}->${targetStatus}`;
            statusTransitions[key] = (statusTransitions[key] || 0) + 1;
          }
        }
      });
      
      // If no transitions found, return empty result
      if (Object.keys(statusTransitions).length === 0) {
        return emptyResult;
      }
      

      const nodes = Array.from(allStatuses).map(status => ({
        name: status
      }));
      
      // Create links array for Sankey diagram
      const links = Object.keys(statusTransitions).map(key => {
        const [source, target] = key.split('->');
        const sourceIndex = nodes.findIndex(node => node.name === source);
        const targetIndex = nodes.findIndex(node => node.name === target);
        
        // Ensure valid source and target indices
        if (sourceIndex === -1 || targetIndex === -1) return null;
        
        return {
          source: sourceIndex,
          target: targetIndex,
          value: statusTransitions[key]
        };
      }).filter(link => link !== null);
      
      // Final validation: need at least one valid link
      if (links.length === 0) {
        return emptyResult;
      }
      
      return { nodes, links, hasValidData: true };
    } catch (error) {
      console.error("Error processing Sankey data:", error);
      return emptyResult;
    }
  }, [applications, timelines]);

  // Custom colors for the Sankey diagram
  const customColors = [
    '#5865F2', // Discord blue
    '#36393f', // Dark gray
    '#4CAF50', // Green
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#9C27B0', // Purple
    '#2196F3', // Blue
    '#E91E63', // Pink
  ];

  return (
    <Paper 
      sx={{ 
        backgroundColor: "#282b30", 
        padding: "20px",
        marginBottom: "30px",
        borderRadius: "8px"
      }}
    >
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          color: "white", 
          fontSize: "1.2rem", 
          fontWeight: "bold",
          borderBottom: "2.5px solid #5865F2",
          paddingBottom: "10px",
          marginBottom: "20px"
        }}
      >
        Application Status Flow
      </Typography>

      <div style={{ height: 500, width: '100%' }}>
        {hasValidData ? (
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={{ nodes, links }}
              nodeWidth={20}
              nodePadding={40}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              link={{ stroke: '#ffffff33' }}
              node={{
                fill: (nodeData) => customColors[(nodeData?.index || 5) % customColors.length],
                stroke: '#282b30'
              }}
            >
              <Tooltip 
                formatter={(value, name) => [`${value} applications`, name]}
                contentStyle={{ 
                  backgroundColor: '#36393f',
                  border: '1px solid #5865F2',
                  color: 'white',
                  borderRadius: '4px'
                }}
              />
            </Sankey>
          </ResponsiveContainer>
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                color: 'white',
                padding: '20px 0' 
              }}
            >
              Not enough application status data to generate flow diagram.
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center', 
                color: '#aaa',
                maxWidth: '80%'
              }}
            >
              To see the Sankey diagram, you need at least two different application statuses 
              and one status change (e.g., from &quot;Applied&quot; to &quot;Interview&quot;).
              <br /><br />
              Try updating the status of your applications to see the visualization.
            </Typography>
          </div>
        )}
      </div>
    </Paper>
    );
};

ApplicationSankeyDiagram.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      company: PropTypes.string,
      position: PropTypes.string,
      status: PropTypes.string,
      date: PropTypes.string,
      priority: PropTypes.string
    })
  ),
  timelines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      application_id: PropTypes.number,
      status: PropTypes.string,
      date: PropTypes.string,
      notes: PropTypes.string
    })
  )
}
ApplicationSankeyDiagram.defaultProps = {
  applications: [],
  timelines: []
}

export default ApplicationSankeyDiagram;