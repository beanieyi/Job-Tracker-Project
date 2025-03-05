import { useMemo } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';

const ApplicationSankeyDiagram = ({ applications, timelines }) => {
  
  const { nodes, links, hasValidData } = useMemo(() => {
    const emptyResult = { nodes: [], links: [], hasValidData: false };
    
    if (!applications || !timelines || !applications.length || !timelines.length) {
      return emptyResult;
    }

    try {
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
      
      const statusTransitions = {};
      
      const timelinesByApp = timelines.reduce((acc, item) => {
        if (!item || !item.application_id) return acc;
        
        if (!acc[item.application_id]) {
          acc[item.application_id] = [];
        }
        acc[item.application_id].push(item);
        return acc;
      }, {});
      
      Object.values(timelinesByApp).forEach(appTimelines => {
        if (!appTimelines || appTimelines.length < 2) return;
        
        const sortedTimelines = [...appTimelines].sort(
          (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
        );
        
        for (let i = 0; i < sortedTimelines.length - 1; i++) {
          const sourceStatus = sortedTimelines[i].status;
          const targetStatus = sortedTimelines[i + 1].status;
          
          if (sourceStatus && targetStatus && sourceStatus !== targetStatus) {
            const key = `${sourceStatus}->${targetStatus}`;
            statusTransitions[key] = (statusTransitions[key] || 0) + 1;
          }
        }
      });
      
      if (Object.keys(statusTransitions).length === 0) {
        return emptyResult;
      }
      
      const nodes = Array.from(allStatuses).map((status, index) => ({
        name: status,
        depth: index
      }));
      
      const links = Object.keys(statusTransitions).map(key => {
        const [source, target] = key.split('->');
        const sourceIndex = nodes.findIndex(node => node.name === source);
        const targetIndex = nodes.findIndex(node => node.name === target);
        
        if (sourceIndex === -1 || targetIndex === -1) return null;
        
        return {
          source: sourceIndex,
          target: targetIndex,
          value: statusTransitions[key]
        };
      }).filter(link => link !== null);
      
      if (links.length === 0) {
        return emptyResult;
      }
      
      return { nodes, links, hasValidData: true };
    } catch (error) {
      console.error("Error processing Sankey data:", error);
      return emptyResult;
    }
  }, [applications, timelines]);

  const colors = ['#3C898E', '#486DF0', '#6F50E5', '#FF5722', '#FFC107', '#4CAF50', '#E91E63'];

  const CustomNode = ({ x, y, width, height, index }) => (
    <rect x={x + 4} y={y - 2} width={width - 8} height={height + 4} fill={colors[index % colors.length]} rx={2.5} />
  );

  CustomNode.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

  const CustomLink = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index }) => (
    <path
      d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
      fill="none"
      stroke={colors[index % colors.length]}
      strokeOpacity={0.4}
      strokeWidth={linkWidth}
      strokeLinecap="butt"
    />
  );

  CustomLink.propTypes = {
    sourceX: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    sourceControlX: PropTypes.number.isRequired,
    targetControlX: PropTypes.number.isRequired,
    linkWidth: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

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
              node={CustomNode}
              link={CustomLink}
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
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'white', padding: '20px 0' }}>
              Not enough application status data to generate flow diagram.
            </Typography>
          </div>
        )}
      </div>
    </Paper>
  );
};

ApplicationSankeyDiagram.propTypes = {
  applications: PropTypes.array,
  timelines: PropTypes.array
};

export default ApplicationSankeyDiagram;
