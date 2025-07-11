// Workflow Generator
module.exports = {
  execute: async (analysis, context) => {
    const workflows = [];
    
    if (analysis.workflows && analysis.workflows.length > 0) {
      for (const workflow of analysis.workflows) {
        const generatedWorkflow = generateWorkflow(workflow, analysis.entities);
        if (generatedWorkflow) {
          workflows.push(generatedWorkflow);
        }
      }
    }
    
    return workflows;
  }
};

function generateWorkflow(workflow, entities) {
  // Map workflows to appropriate doctypes
  const workflowDoctypeMap = {
    'appointment-workflow': 'Patient Appointment',
    'treatment-workflow': 'Clinical Procedure',
    'billing-workflow': 'Healthcare Invoice',
    'approval-workflow': findFirstApplicableDoctype(['Sales Order', 'Purchase Order'], entities),
    'order-workflow': 'Sales Order'
  };
  
  const doctype = workflowDoctypeMap[workflow.name] || findRelevantDoctype(workflow, entities);
  
  if (!doctype) {
    console.warn(`Could not find appropriate doctype for workflow: ${workflow.name}`);
    return null;
  }
  
  const wf = {
    name: `${doctype} Workflow`,
    document_type: doctype,
    is_active: 1,
    send_email_alert: 0,
    states: [],
    transitions: []
  };
  
  // Generate states
  if (workflow.states && workflow.states.length > 0) {
    workflow.states.forEach((state, index) => {
      wf.states.push({
        state: state,
        style: getStateStyle(state),
        doc_status: getDocStatus(state, index, workflow.states.length)
      });
    });
    
    // Generate transitions
    for (let i = 0; i < workflow.states.length - 1; i++) {
      const fromState = workflow.states[i];
      const toState = workflow.states[i + 1];
      
      wf.transitions.push({
        state: fromState,
        action: getTransitionAction(fromState, toState),
        next_state: toState,
        allowed: getTransitionRole(workflow.type),
        allow_self_approval: 0
      });
    }
    
    // Add rejection/cancellation transitions
    addSpecialTransitions(wf, workflow);
  }
  
  return wf;
}

function findFirstApplicableDoctype(doctypeList, entities) {
  if (!entities) return null;
  
  const entityDoctypes = entities.map(e => e.doctype);
  for (const doctype of doctypeList) {
    if (entityDoctypes.includes(doctype)) {
      return doctype;
    }
  }
  return null;
}

function findRelevantDoctype(workflow, entities) {
  if (!entities || entities.length === 0) return null;
  
  // Try to match based on workflow keywords
  const keywords = workflow.matched_keywords || [];
  for (const entity of entities) {
    const entityNameLower = entity.name.toLowerCase();
    if (keywords.some(keyword => entityNameLower.includes(keyword))) {
      return entity.doctype;
    }
  }
  
  // Default to first entity if no match
  return entities[0].doctype;
}

function getStateStyle(state) {
  const styles = {
    'draft': 'Warning',
    'pending': 'Warning',
    'scheduled': 'Info',
    'confirmed': 'Primary',
    'in progress': 'Primary',
    'approved': 'Success',
    'completed': 'Success',
    'paid': 'Success',
    'rejected': 'Danger',
    'cancelled': 'Danger',
    'overdue': 'Danger'
  };
  
  const stateLower = state.toLowerCase();
  for (const [key, style] of Object.entries(styles)) {
    if (stateLower.includes(key)) {
      return style;
    }
  }
  return 'Primary';
}

function getDocStatus(state, index, totalStates) {
  const stateLower = state.toLowerCase();
  
  // Draft states
  if (stateLower.includes('draft') || index === 0) {
    return '0';
  }
  
  // Submitted/Final states
  if (stateLower.includes('completed') || 
      stateLower.includes('paid') || 
      stateLower.includes('approved') ||
      index === totalStates - 1) {
    return '1';
  }
  
  // Cancelled states
  if (stateLower.includes('cancelled') || stateLower.includes('rejected')) {
    return '2';
  }
  
  // In-progress states
  return '0';
}

function getTransitionAction(fromState, toState) {
  const fromLower = fromState.toLowerCase();
  const toLower = toState.toLowerCase();
  
  if (toLower.includes('approved')) return 'Approve';
  if (toLower.includes('rejected')) return 'Reject';
  if (toLower.includes('completed')) return 'Complete';
  if (toLower.includes('cancelled')) return 'Cancel';
  if (toLower.includes('scheduled')) return 'Schedule';
  if (toLower.includes('confirmed')) return 'Confirm';
  if (toLower.includes('progress')) return 'Start';
  if (toLower.includes('paid')) return 'Mark as Paid';
  
  // Generic action based on state name
  return `Move to ${toState}`;
}

function getTransitionRole(workflowType) {
  const roleMap = {
    'healthcare': 'Healthcare Administrator',
    'business': 'Sales Manager',
    'custom': 'System Manager'
  };
  
  return roleMap[workflowType] || 'System Manager';
}

function addSpecialTransitions(workflow, originalWorkflow) {
  const states = workflow.states.map(s => s.state);
  
  // Add rejection path if approved state exists
  const approvedState = states.find(s => s.toLowerCase().includes('approved'));
  const pendingState = states.find(s => s.toLowerCase().includes('pending'));
  
  if (approvedState && pendingState) {
    workflow.transitions.push({
      state: pendingState,
      action: 'Reject',
      next_state: 'Rejected',
      allowed: getTransitionRole(originalWorkflow.type),
      allow_self_approval: 0
    });
    
    // Add rejected state if not exists
    if (!states.includes('Rejected')) {
      workflow.states.push({
        state: 'Rejected',
        style: 'Danger',
        doc_status: '2'
      });
    }
  }
  
  // Add cancellation transitions
  const nonFinalStates = states.filter(s => {
    const lower = s.toLowerCase();
    return !lower.includes('completed') && 
           !lower.includes('paid') && 
           !lower.includes('cancelled') &&
           !lower.includes('rejected');
  });
  
  for (const state of nonFinalStates) {
    workflow.transitions.push({
      state: state,
      action: 'Cancel',
      next_state: 'Cancelled',
      allowed: getTransitionRole(originalWorkflow.type),
      allow_self_approval: 0
    });
  }
  
  // Add cancelled state if not exists
  if (!states.includes('Cancelled')) {
    workflow.states.push({
      state: 'Cancelled',
      style: 'Danger',
      doc_status: '2'
    });
  }
}
