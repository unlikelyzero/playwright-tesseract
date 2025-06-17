// Initialize Cytoscape.js
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [
    // Nodes
    { data: { id: 'n1', label: 'Node 1' }, position: { x: 150, y: 150 } },
    { data: { id: 'n2', label: 'Node 2' }, position: { x: 450, y: 150 } },
    { data: { id: 'n3', label: 'Node 3' }, position: { x: 300, y: 400 } },
    // Edges
    { data: { id: 'e1', source: 'n1', target: 'n2', label: 'Connection 1' } },
    { data: { id: 'e2', source: 'n2', target: 'n3', label: 'Connection 2' } },
    { data: { id: 'e3', source: 'n3', target: 'n1', label: 'Connection 3' } }
  ],
  style: [
    {
      selector: 'core',
      style: {
        'background-color': '#f5f5f5'
      }
    },
    {
      selector: 'node',
      style: {
        'background-color': '#ffffff',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'font-size': '20px',
        'font-family': 'Arial, Helvetica, sans-serif',
        'font-weight': 'bold',
        'color': '#000000',
        'text-outline-width': 0,
        'width': '80px',
        'height': '80px',
        'border-width': 2,
        'border-color': '#333333'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#333333',
        'target-arrow-color': '#333333',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'text-margin-y': -10,
        'font-size': '18px',
        'font-family': 'Arial, Helvetica, sans-serif',
        'font-weight': 'bold',
        'color': '#000000',
        'text-background-color': '#ffffff',
        'text-background-opacity': 1,
        'text-background-padding': '8px',
        'text-border-width': 0,
        'text-wrap': 'wrap',
        'text-max-width': '90px',
        'control-point-distances': [50],
        'control-point-weights': [0.5]
      }
    }
  ],
  layout: {
    name: 'preset'
  }
});

// Add a message area below the graph
const messageDiv = document.createElement('div');
messageDiv.id = 'message';
messageDiv.style.marginTop = '20px';
messageDiv.style.fontSize = '18px';
messageDiv.style.fontWeight = 'bold';
messageDiv.style.color = '#007700';
document.body.appendChild(messageDiv);

// Helper to position overlay button over 'Connection 1' label
function addConnection1Overlay() {
  // Remove any existing overlay
  const oldBtn = document.getElementById('connection1-overlay');
  if (oldBtn) oldBtn.remove();

  // Get node positions
  const n1 = cy.getElementById('n1').position();
  const n2 = cy.getElementById('n2').position();
  // Midpoint for label
  const labelX = (n1.x + n2.x) / 2;
  const labelY = (n1.y + n2.y) / 2 - 20; // adjust for label offset

  // Get canvas position
  const cyDiv = document.getElementById('cy');
  const rect = cyDiv.getBoundingClientRect();

  // Create overlay button
  const btn = document.createElement('button');
  btn.id = 'connection1-overlay';
  btn.style.position = 'absolute';
  btn.style.left = `${rect.left + labelX - 40}px`;
  btn.style.top = `${rect.top + labelY - 15}px`;
  btn.style.width = '80px';
  btn.style.height = '30px';
  btn.style.opacity = '0';
  btn.style.zIndex = '10';
  btn.style.pointerEvents = 'auto';
  btn.title = 'Click Connection 1';
  btn.onclick = () => {
    messageDiv.textContent = 'Connection 1 clicked!';
  };
  document.body.appendChild(btn);
}

cy.on('render', addConnection1Overlay);
window.addEventListener('resize', addConnection1Overlay); 