// Workflow Detector Hook - Enhanced for Dental Clinic
module.exports = {
  version: '1.1.0',
  description: 'Detects workflow patterns in PRD with dental clinic focus',
  
  execute: async (data, context) => {
    const { content, sections, entities } = data;
    const workflows = [];
    
    // Get text to analyze
    const text = sections ? sections.map(s => s.content).join(' ') : content;
    const textLower = text.toLowerCase();
    
    // Healthcare/Dental specific workflows
    const dentalWorkflows = [
      {
        name: 'appointment-workflow',
        displayName: 'Appointment Workflow',
        doctype: 'Patient Appointment',
        keywords: ['appointment', 'booking', 'scheduling', 'reminder'],
        states: ['Scheduled', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled'],
        type: 'healthcare'
      },
      {
        name: 'treatment-workflow', 
        displayName: 'Treatment Workflow',
        doctype: 'Clinical Procedure',
        keywords: ['treatment', 'procedure', 'dental', 'follow-up'],
        states: ['Planned', 'Approved', 'In Progress', 'Completed', 'Follow-up Required'],
        type: 'healthcare'
      },
      {
        name: 'billing-workflow',
        displayName: 'Billing Workflow',
        doctype: 'Healthcare Invoice',
        keywords: ['billing', 'payment', 'insurance', 'claim', 'invoice'],
        states: ['Draft', 'Submitted', 'Insurance Pending', 'Partially Paid', 'Paid', 'Overdue'],
        type: 'healthcare'
      }
    ];
    
    // Check for dental workflows
    for (const workflow of dentalWorkflows) {
      const matchCount = workflow.keywords.filter(keyword => textLower.includes(keyword)).length;
      
      // Need at least 2 keyword matches for confidence
      if (matchCount >= 2) {
        // Check if we have the corresponding entity
        const hasEntity = entities && entities.some(e => 
          e.doctype === workflow.doctype || 
          workflow.keywords.some(k => e.name.toLowerCase().includes(k))
        );
        
        workflows.push({
          name: workflow.name,
          displayName: workflow.displayName,
          doctype: workflow.doctype,
          type: workflow.type,
          states: workflow.states,
          confidence: matchCount / workflow.keywords.length,
          matched_keywords: workflow.keywords.filter(k => textLower.includes(k)),
          hasEntity: hasEntity
        });
      }
    }
    
    console.log('Workflow Detector found workflows:', workflows.map(w => w.displayName));
    
    return {
      ...data,
      workflows,
      context: {
        ...context,
        workflowCount: workflows.length,
        hasWorkflows: workflows.length > 0,
        primaryWorkflow: workflows.length > 0 ? workflows[0].name : null
      }
    };
  }
};
