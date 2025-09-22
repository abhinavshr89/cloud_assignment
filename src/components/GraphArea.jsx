import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { graphData } from '../data/graphData';

export default function GraphArea() {
  const [expanded, setExpanded] = useState(new Set(["cloud"])); 
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowInstance = useRef(null);
  const [misconfigs, setMisconfigs] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [all, setAll] = useState(true);

  const toggleNode = useCallback((id) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  }, []);


  const buildGraphFromData = useCallback(() => {
    const visibleNodes = [];
    const visibleEdges = [];

    const addNode = (nodeId, x = 0, y = 0) => {
      const nodeData = graphData.nodes.find(n => n.id === nodeId);
      if (!nodeData) return;

      if (alerts && nodeData.alerts === 0) return;
      if (misconfigs && nodeData.misconfigs === 0) return;

      const hasChildren = Array.isArray(nodeData.children) && nodeData.children.length > 0;
      const isExpanded = expanded.has(nodeData.id);

      
      let labelText = nodeData.label;
      if (all) {
        labelText += `\n🔺${nodeData.alerts} ⚙️${nodeData.misconfigs}`;
      } else if (alerts) {
        labelText += `\n🔺${nodeData.alerts}`;
      } else if (misconfigs) {
        labelText += `\n⚙️${nodeData.misconfigs}`;
      }
      if (hasChildren) {
        labelText += `\n${isExpanded ? '➖' : '➕'}`;
      }
      
      visibleNodes.push({
        id: nodeData.id,
        position: { x, y },
        sourcePosition: Position.Right, 
        targetPosition: Position.Left,   
        data: { 
          label: labelText
        },
        style: {
          background: nodeData.id === 'cloud' ? '#ffffff' : nodeData.type === 'aws' ? '#ff9500' : '#10b981',
          color: nodeData.id === 'cloud' ? '#333' : 'white',
          border: '2px solid #2563eb',
          borderRadius: '50%',
          width: nodeData.id === 'cloud' ? 120 : 100,
          height: nodeData.id === 'cloud' ? 120 : 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          cursor: hasChildren ? 'pointer' : 'default',
          whiteSpace: 'pre-line',
          textAlign: 'center'
        }
      });

      if (isExpanded && nodeData.children) {
        nodeData.children.forEach((childId, index) => {
          const childX = x + 300;
          const childY = y + (index - (nodeData.children.length - 1) / 2) * 150;

          visibleEdges.push({
            id: `edge-${nodeData.id}-${childId}`,
            source: nodeData.id,
            target: childId,
            style: { strokeWidth: 3, stroke: '#2563eb' },
            animated: false,
          });

          addNode(childId, childX, childY);
        });
      }
    };
    
    addNode("cloud", 0, 0);
    return { visibleNodes, visibleEdges };
  }, [expanded, all, alerts, misconfigs]);

  
  useEffect(() => {
    const { visibleNodes, visibleEdges } = buildGraphFromData();
    setNodes(visibleNodes);
    setEdges(visibleEdges);
    
    setTimeout(() => {
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({
          padding: 0.1,
          duration: 300
        });
      }
    }, 100);
  }, [buildGraphFromData]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  // Handle node clicks for expand/collapse
  const onNodeClick = useCallback((event, node) => {
    const nodeData = graphData.nodes.find(n => n.id === node.id);
    if (nodeData && nodeData.children && nodeData.children.length > 0) {
      toggleNode(node.id);
    }
  }, [toggleNode]);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleFilterChange = (filterType) => {
    if (filterType === 'all') {
      setAll(true);
      setAlerts(false);
      setMisconfigs(false);
    } else if (filterType === 'alerts') {
      setAll(false);
      setAlerts(true);
      setMisconfigs(false);
    } else if (filterType === 'misconfigs') {
      setAll(false);
      setAlerts(false);
      setMisconfigs(true);
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Filter Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="text-sm font-bold mb-3 text-gray-700">Filter Nodes</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              all ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌐 All Nodes
          </button>
          <button
            onClick={() => handleFilterChange('alerts')}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              alerts ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔺 Alerts Only
          </button>
          <button
            onClick={() => handleFilterChange('misconfigs')}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              misconfigs ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚙️ Misconfigs Only
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onInit={onInit}
        fitView
        fitViewOptions={{
          padding: 0.1,
          duration: 300
        }}
        className='h-screen w-screen'
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}