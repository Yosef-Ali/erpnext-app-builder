// Comprehensive Template Management System
class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.categories = new Map();
    this.industryMappings = new Map();
    this.templateCache = new Map();
    this.loadTemplates();
    this.initializeCategories();
    this.setupIndustryMappings();
  }

  loadTemplates() {
    // Core ERPNext Templates
    this.loadCoreTemplates();
    
    // Industry-specific Templates
    this.loadIndustryTemplates();
    
    // Functional Templates
    this.loadFunctionalTemplates();
    
    // Integration Templates
    this.loadIntegrationTemplates();
  }

  loadCoreTemplates() {
    // Sales Management Template
    this.templates.set('sales_management', {
      id: 'sales_management',
      name: 'Sales Management',
      description: 'Complete sales process management with CRM integration',
      category: 'core',
      industry: 'general',
      version: '1.0.0',
      rating: 4.8,
      downloads: 2500,
      features: [
        'Lead Management',
        'Opportunity Tracking',
        'Quotation Generation',
        'Sales Order Processing',
        'Invoice Management',
        'Customer Relationship Management'
      ],
      doctypes: [
        {
          name: 'Lead',
          module: 'CRM',
          fields: [
            { fieldname: 'lead_name', fieldtype: 'Data', label: 'Lead Name', reqd: 1 },
            { fieldname: 'company_name', fieldtype: 'Data', label: 'Company Name' },
            { fieldname: 'email_id', fieldtype: 'Data', label: 'Email', options: 'Email' },
            { fieldname: 'phone', fieldtype: 'Data', label: 'Phone' },
            { fieldname: 'source', fieldtype: 'Select', label: 'Source', options: 'Website\\nCampaign\\nReferral\\nCold Call' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Open\\nReplied\\nOpportunity\\nQuotation\\nLost Quotation\\nInterested\\nConverted\\nDo Not Contact' }
          ],
          permissions: [
            { role: 'Sales User', read: 1, write: 1, create: 1 },
            { role: 'Sales Manager', read: 1, write: 1, create: 1, delete: 1 }
          ]
        },
        {
          name: 'Opportunity',
          module: 'CRM',
          fields: [
            { fieldname: 'opportunity_from', fieldtype: 'Select', label: 'Opportunity From', options: 'Lead\\nCustomer' },
            { fieldname: 'party_name', fieldtype: 'Dynamic Link', label: 'Party Name', options: 'opportunity_from' },
            { fieldname: 'opportunity_type', fieldtype: 'Select', label: 'Type', options: 'Sales\\nMaintenance\\nSupport' },
            { fieldname: 'source', fieldtype: 'Select', label: 'Source', options: 'Advertisement\\nBlog Post\\nCampaign\\nCold Calling\\nCustomer\\nExhibition\\nExisting Customer\\nGoogle\\nPartner\\nPublic Relations\\nReferral\\nSales Mail Alias\\nSupplier Reference\\nWebsite\\nWord of mouth' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Open\\nQuotation\\nReplied\\nClosed' }
          ]
        }
      ],
      workflows: [
        {
          name: 'Lead Qualification',
          document_type: 'Lead',
          states: [
            { state: 'Open', doc_status: 0 },
            { state: 'Qualified', doc_status: 0 },
            { state: 'Converted', doc_status: 1 },
            { state: 'Lost', doc_status: 2 }
          ],
          transitions: [
            { from: 'Open', to: 'Qualified', action: 'Qualify' },
            { from: 'Qualified', to: 'Converted', action: 'Convert' },
            { from: 'Open', to: 'Lost', action: 'Mark as Lost' }
          ]
        }
      ],
      reports: [
        {
          name: 'Lead Conversion Report',
          ref_doctype: 'Lead',
          report_type: 'Query Report',
          query: 'SELECT name, lead_name, company_name, status, creation FROM tabLead'
        }
      ],
      compatibility: {
        erpnext_version: '>=13.0.0',
        frappe_version: '>=13.0.0'
      }
    });

    // Purchase Management Template
    this.templates.set('purchase_management', {
      id: 'purchase_management',
      name: 'Purchase Management',
      description: 'End-to-end procurement process management',
      category: 'core',
      industry: 'general',
      version: '1.0.0',
      rating: 4.7,
      downloads: 2100,
      features: [
        'Supplier Management',
        'Request for Quotation',
        'Purchase Order Processing',
        'Goods Receipt',
        'Purchase Invoice Management',
        'Supplier Performance Tracking'
      ],
      doctypes: [
        {
          name: 'Request for Quotation',
          module: 'Buying',
          fields: [
            { fieldname: 'suppliers', fieldtype: 'Table', label: 'Suppliers', options: 'Request for Quotation Supplier' },
            { fieldname: 'items', fieldtype: 'Table', label: 'Items', options: 'Request for Quotation Item' },
            { fieldname: 'message_for_supplier', fieldtype: 'Text', label: 'Message for Supplier' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Draft\\nSubmitted\\nReceived\\nCancelled' }
          ]
        }
      ],
      workflows: [
        {
          name: 'Purchase Order Approval',
          document_type: 'Purchase Order',
          states: [
            { state: 'Draft', doc_status: 0 },
            { state: 'To Receive and Bill', doc_status: 1 },
            { state: 'Completed', doc_status: 1 },
            { state: 'Cancelled', doc_status: 2 }
          ]
        }
      ]
    });

    // Inventory Management Template
    this.templates.set('inventory_management', {
      id: 'inventory_management',
      name: 'Inventory Management',
      description: 'Comprehensive stock and warehouse management',
      category: 'core',
      industry: 'general',
      version: '1.0.0',
      rating: 4.9,
      downloads: 3200,
      features: [
        'Multi-warehouse Support',
        'Stock Movement Tracking',
        'Reorder Level Management',
        'Serial Number Tracking',
        'Batch Management',
        'Stock Reconciliation'
      ],
      doctypes: [
        {
          name: 'Stock Entry',
          module: 'Stock',
          fields: [
            { fieldname: 'stock_entry_type', fieldtype: 'Select', label: 'Type', options: 'Material Issue\\nMaterial Receipt\\nMaterial Transfer\\nManufacture\\nRepack\\nSend to Subcontractor' },
            { fieldname: 'from_warehouse', fieldtype: 'Link', label: 'From Warehouse', options: 'Warehouse' },
            { fieldname: 'to_warehouse', fieldtype: 'Link', label: 'To Warehouse', options: 'Warehouse' },
            { fieldname: 'items', fieldtype: 'Table', label: 'Items', options: 'Stock Entry Detail' }
          ]
        }
      ]
    });
  }

  loadIndustryTemplates() {
    // Retail Industry Templates
    this.loadRetailTemplates();
    
    // Manufacturing Industry Templates
    this.loadManufacturingTemplates();
    
    // Healthcare Industry Templates
    this.loadHealthcareTemplates();
    
    // Education Industry Templates
    this.loadEducationTemplates();
    
    // Services Industry Templates
    this.loadServicesTemplates();
  }

  loadRetailTemplates() {
    // Point of Sale Template
    this.templates.set('retail_pos', {
      id: 'retail_pos',
      name: 'Point of Sale System',
      description: 'Complete POS solution with real-time inventory integration',
      category: 'industry',
      industry: 'retail',
      version: '2.0.0',
      rating: 4.8,
      downloads: 1850,
      features: [
        'Touch-friendly POS Interface',
        'Barcode Scanning',
        'Multiple Payment Methods',
        'Customer Display',
        'Receipt Printing',
        'Offline Mode Support',
        'Real-time Inventory Updates'
      ],
      doctypes: [
        {
          name: 'POS Profile',
          module: 'Accounts',
          fields: [
            { fieldname: 'name', fieldtype: 'Data', label: 'POS Profile Name', reqd: 1 },
            { fieldname: 'customer', fieldtype: 'Link', label: 'Customer', options: 'Customer' },
            { fieldname: 'warehouse', fieldtype: 'Link', label: 'Warehouse', options: 'Warehouse', reqd: 1 },
            { fieldname: 'company', fieldtype: 'Link', label: 'Company', options: 'Company', reqd: 1 },
            { fieldname: 'country', fieldtype: 'Link', label: 'Country', options: 'Country' },
            { fieldname: 'currency', fieldtype: 'Link', label: 'Currency', options: 'Currency' },
            { fieldname: 'write_off_account', fieldtype: 'Link', label: 'Write Off Account', options: 'Account' },
            { fieldname: 'write_off_cost_center', fieldtype: 'Link', label: 'Write Off Cost Center', options: 'Cost Center' }
          ]
        },
        {
          name: 'POS Invoice',
          module: 'Accounts',
          fields: [
            { fieldname: 'pos_profile', fieldtype: 'Link', label: 'POS Profile', options: 'POS Profile' },
            { fieldname: 'customer', fieldtype: 'Link', label: 'Customer', options: 'Customer', reqd: 1 },
            { fieldname: 'items', fieldtype: 'Table', label: 'Items', options: 'POS Invoice Item' },
            { fieldname: 'payments', fieldtype: 'Table', label: 'Payments', options: 'POS Invoice Payment' },
            { fieldname: 'is_pos', fieldtype: 'Check', label: 'Is POS', default: 1 }
          ]
        }
      ],
      customizations: [
        {
          doctype: 'Item',
          custom_fields: [
            { fieldname: 'barcode', fieldtype: 'Data', label: 'Barcode', unique: 1 },
            { fieldname: 'pos_display', fieldtype: 'Check', label: 'Show in POS', default: 1 }
          ]
        }
      ]
    });

    // E-commerce Integration Template
    this.templates.set('ecommerce_integration', {
      id: 'ecommerce_integration',
      name: 'E-commerce Integration',
      description: 'Seamless integration with e-commerce platforms',
      category: 'industry',
      industry: 'retail',
      version: '1.5.0',
      rating: 4.6,
      downloads: 920,
      features: [
        'Multi-channel Inventory Sync',
        'Order Import/Export',
        'Product Catalog Sync',
        'Price Management',
        'Shipping Integration',
        'Tax Calculation'
      ],
      doctypes: [
        {
          name: 'E-commerce Settings',
          module: 'E-commerce',
          fields: [
            { fieldname: 'enable_sync', fieldtype: 'Check', label: 'Enable Sync' },
            { fieldname: 'platform', fieldtype: 'Select', label: 'Platform', options: 'Shopify\\nWooCommerce\\nMagento\\nAmazon\\neBay' },
            { fieldname: 'api_key', fieldtype: 'Data', label: 'API Key' },
            { fieldname: 'api_secret', fieldtype: 'Password', label: 'API Secret' },
            { fieldname: 'store_url', fieldtype: 'Data', label: 'Store URL' }
          ]
        }
      ]
    });
  }

  loadManufacturingTemplates() {
    // Production Planning Template
    this.templates.set('production_planning', {
      id: 'production_planning',
      name: 'Production Planning & Control',
      description: 'Advanced manufacturing planning and execution',
      category: 'industry',
      industry: 'manufacturing',
      version: '1.8.0',
      rating: 4.7,
      downloads: 1450,
      features: [
        'Bill of Materials Management',
        'Production Planning',
        'Work Order Management',
        'Capacity Planning',
        'Material Requirement Planning',
        'Shop Floor Control'
      ],
      doctypes: [
        {
          name: 'Production Plan',
          module: 'Manufacturing',
          fields: [
            { fieldname: 'company', fieldtype: 'Link', label: 'Company', options: 'Company', reqd: 1 },
            { fieldname: 'from_date', fieldtype: 'Date', label: 'From Date', reqd: 1 },
            { fieldname: 'to_date', fieldtype: 'Date', label: 'To Date', reqd: 1 },
            { fieldname: 'po_items', fieldtype: 'Table', label: 'Items', options: 'Production Plan Item' },
            { fieldname: 'mr_items', fieldtype: 'Table', label: 'Material Request Planning', options: 'Production Plan Material Request' }
          ]
        },
        {
          name: 'Work Order',
          module: 'Manufacturing',
          fields: [
            { fieldname: 'item_code', fieldtype: 'Link', label: 'Item Code', options: 'Item', reqd: 1 },
            { fieldname: 'bom_no', fieldtype: 'Link', label: 'BOM No', options: 'BOM' },
            { fieldname: 'qty', fieldtype: 'Float', label: 'Qty to Manufacture', reqd: 1 },
            { fieldname: 'produced_qty', fieldtype: 'Float', label: 'Manufactured Qty', read_only: 1 },
            { fieldname: 'wip_warehouse', fieldtype: 'Link', label: 'Work-in-Progress Warehouse', options: 'Warehouse' },
            { fieldname: 'fg_warehouse', fieldtype: 'Link', label: 'Target Warehouse', options: 'Warehouse' }
          ]
        }
      ],
      workflows: [
        {
          name: 'Work Order Status',
          document_type: 'Work Order',
          states: [
            { state: 'Draft', doc_status: 0 },
            { state: 'Not Started', doc_status: 1 },
            { state: 'In Process', doc_status: 1 },
            { state: 'Completed', doc_status: 1 },
            { state: 'Stopped', doc_status: 1 },
            { state: 'Cancelled', doc_status: 2 }
          ]
        }
      ]
    });

    // Quality Management Template
    this.templates.set('quality_management', {
      id: 'quality_management',
      name: 'Quality Management System',
      description: 'Comprehensive quality control and assurance',
      category: 'industry',
      industry: 'manufacturing',
      version: '1.2.0',
      rating: 4.5,
      downloads: 780,
      features: [
        'Quality Inspection',
        'Non-Conformance Management',
        'Corrective Actions',
        'Quality Metrics',
        'Supplier Quality Rating',
        'Calibration Management'
      ],
      doctypes: [
        {
          name: 'Quality Inspection',
          module: 'Manufacturing',
          fields: [
            { fieldname: 'inspection_type', fieldtype: 'Select', label: 'Inspection Type', options: 'Incoming\\nOutgoing\\nIn Process' },
            { fieldname: 'reference_type', fieldtype: 'Select', label: 'Reference Type', options: 'Purchase Receipt\\nPurchase Invoice\\nDelivery Note\\nSales Invoice\\nStock Entry\\nJob Card' },
            { fieldname: 'reference_name', fieldtype: 'Dynamic Link', label: 'Reference Name', options: 'reference_type' },
            { fieldname: 'item_code', fieldtype: 'Link', label: 'Item Code', options: 'Item' },
            { fieldname: 'sample_size', fieldtype: 'Float', label: 'Sample Size' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Accepted\\nRejected\\nIn Process' }
          ]
        }
      ]
    });
  }

  loadHealthcareTemplates() {
    // Patient Management Template
    this.templates.set('patient_management', {
      id: 'patient_management',
      name: 'Patient Management System',
      description: 'Comprehensive healthcare patient management',
      category: 'industry',
      industry: 'healthcare',
      version: '2.1.0',
      rating: 4.9,
      downloads: 650,
      features: [
        'Patient Registration',
        'Appointment Scheduling',
        'Medical Records',
        'Prescription Management',
        'Insurance Processing',
        'Billing Integration'
      ],
      doctypes: [
        {
          name: 'Patient',
          module: 'Healthcare',
          fields: [
            { fieldname: 'patient_name', fieldtype: 'Data', label: 'Patient Name', reqd: 1 },
            { fieldname: 'patient_id', fieldtype: 'Data', label: 'Patient ID', unique: 1 },
            { fieldname: 'gender', fieldtype: 'Select', label: 'Gender', options: 'Male\\nFemale\\nOther' },
            { fieldname: 'dob', fieldtype: 'Date', label: 'Date of Birth' },
            { fieldname: 'blood_group', fieldtype: 'Select', label: 'Blood Group', options: 'A+\\nA-\\nB+\\nB-\\nAB+\\nAB-\\nO+\\nO-' },
            { fieldname: 'emergency_contact', fieldtype: 'Data', label: 'Emergency Contact' },
            { fieldname: 'insurance_details', fieldtype: 'Table', label: 'Insurance Details', options: 'Patient Insurance' }
          ]
        },
        {
          name: 'Patient Appointment',
          module: 'Healthcare',
          fields: [
            { fieldname: 'patient', fieldtype: 'Link', label: 'Patient', options: 'Patient', reqd: 1 },
            { fieldname: 'practitioner', fieldtype: 'Link', label: 'Healthcare Practitioner', options: 'Healthcare Practitioner' },
            { fieldname: 'appointment_date', fieldtype: 'Date', label: 'Date', reqd: 1 },
            { fieldname: 'appointment_time', fieldtype: 'Time', label: 'Time', reqd: 1 },
            { fieldname: 'duration', fieldtype: 'Int', label: 'Duration (mins)', default: 30 },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Open\\nScheduled\\nChecked In\\nClosed\\nCancelled' }
          ]
        }
      ]
    });
  }

  loadEducationTemplates() {
    // Student Information System Template
    this.templates.set('student_information', {
      id: 'student_information',
      name: 'Student Information System',
      description: 'Complete student lifecycle management',
      category: 'industry',
      industry: 'education',
      version: '1.6.0',
      rating: 4.6,
      downloads: 890,
      features: [
        'Student Admission',
        'Course Management',
        'Grade Recording',
        'Attendance Tracking',
        'Fee Management',
        'Parent Portal'
      ],
      doctypes: [
        {
          name: 'Student',
          module: 'Education',
          fields: [
            { fieldname: 'student_name', fieldtype: 'Data', label: 'Student Name', reqd: 1 },
            { fieldname: 'student_email_id', fieldtype: 'Data', label: 'Student Email Address', options: 'Email' },
            { fieldname: 'student_mobile_number', fieldtype: 'Data', label: 'Mobile Number' },
            { fieldname: 'date_of_birth', fieldtype: 'Date', label: 'Date of Birth' },
            { fieldname: 'gender', fieldtype: 'Select', label: 'Gender', options: 'Male\\nFemale\\nOther' },
            { fieldname: 'blood_group', fieldtype: 'Select', label: 'Blood Group', options: 'A+\\nA-\\nB+\\nB-\\nAB+\\nAB-\\nO+\\nO-' }
          ]
        },
        {
          name: 'Program Enrollment',
          module: 'Education',
          fields: [
            { fieldname: 'student', fieldtype: 'Link', label: 'Student', options: 'Student', reqd: 1 },
            { fieldname: 'program', fieldtype: 'Link', label: 'Program', options: 'Program', reqd: 1 },
            { fieldname: 'academic_year', fieldtype: 'Link', label: 'Academic Year', options: 'Academic Year', reqd: 1 },
            { fieldname: 'enrollment_date', fieldtype: 'Date', label: 'Enrollment Date', reqd: 1 },
            { fieldname: 'student_batch_name', fieldtype: 'Link', label: 'Student Batch', options: 'Student Batch' }
          ]
        }
      ]
    });
  }

  loadServicesTemplates() {
    // Project Management Template
    this.templates.set('project_management', {
      id: 'project_management',
      name: 'Project Management Suite',
      description: 'Comprehensive project and task management',
      category: 'industry',
      industry: 'services',
      version: '1.9.0',
      rating: 4.8,
      downloads: 1650,
      features: [
        'Project Planning',
        'Task Management',
        'Time Tracking',
        'Resource Allocation',
        'Gantt Charts',
        'Project Reporting'
      ],
      doctypes: [
        {
          name: 'Project',
          module: 'Projects',
          fields: [
            { fieldname: 'project_name', fieldtype: 'Data', label: 'Project Name', reqd: 1 },
            { fieldname: 'customer', fieldtype: 'Link', label: 'Customer', options: 'Customer' },
            { fieldname: 'expected_start_date', fieldtype: 'Date', label: 'Expected Start Date' },
            { fieldname: 'expected_end_date', fieldtype: 'Date', label: 'Expected End Date' },
            { fieldname: 'project_type', fieldtype: 'Link', label: 'Project Type', options: 'Project Type' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Open\\nCompleted\\nCancelled' },
            { fieldname: 'priority', fieldtype: 'Select', label: 'Priority', options: 'Low\\nMedium\\nHigh' }
          ]
        },
        {
          name: 'Task',
          module: 'Projects',
          fields: [
            { fieldname: 'subject', fieldtype: 'Data', label: 'Subject', reqd: 1 },
            { fieldname: 'project', fieldtype: 'Link', label: 'Project', options: 'Project' },
            { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Open\\nWorking\\nPending Review\\nOverdue\\nTemplate\\nCompleted\\nCancelled' },
            { fieldname: 'priority', fieldtype: 'Select', label: 'Priority', options: 'Low\\nMedium\\nHigh\\nUrgent' },
            { fieldname: 'exp_start_date', fieldtype: 'Date', label: 'Expected Start Date' },
            { fieldname: 'exp_end_date', fieldtype: 'Date', label: 'Expected End Date' }
          ]
        }
      ]
    });
  }

  loadFunctionalTemplates() {
    // HR Management Template
    this.templates.set('hr_management', {
      id: 'hr_management',
      name: 'Human Resource Management',
      description: 'Complete HR lifecycle management',
      category: 'functional',
      industry: 'general',
      version: '2.2.0',
      rating: 4.7,
      downloads: 1980,
      features: [
        'Employee Onboarding',
        'Attendance Management',
        'Payroll Processing',
        'Leave Management',
        'Performance Appraisal',
        'Training Management'
      ],
      doctypes: [
        {
          name: 'Employee',
          module: 'Human Resources',
          fields: [
            { fieldname: 'employee_name', fieldtype: 'Data', label: 'Employee Name', reqd: 1 },
            { fieldname: 'employee_number', fieldtype: 'Data', label: 'Employee Number', unique: 1 },
            { fieldname: 'gender', fieldtype: 'Select', label: 'Gender', options: 'Male\\nFemale\\nOther' },
            { fieldname: 'date_of_birth', fieldtype: 'Date', label: 'Date of Birth' },
            { fieldname: 'date_of_joining', fieldtype: 'Date', label: 'Date of Joining' },
            { fieldname: 'department', fieldtype: 'Link', label: 'Department', options: 'Department' },
            { fieldname: 'designation', fieldtype: 'Link', label: 'Designation', options: 'Designation' }
          ]
        }
      ]
    });

    // Financial Management Template
    this.templates.set('financial_management', {
      id: 'financial_management',
      name: 'Financial Management System',
      description: 'Advanced accounting and financial management',
      category: 'functional',
      industry: 'general',
      version: '1.7.0',
      rating: 4.9,
      downloads: 2650,
      features: [
        'Chart of Accounts',
        'Journal Entries',
        'Payment Processing',
        'Financial Reporting',
        'Budget Management',
        'Cost Center Tracking'
      ]
    });
  }

  loadIntegrationTemplates() {
    // API Integration Template
    this.templates.set('api_integration', {
      id: 'api_integration',
      name: 'API Integration Framework',
      description: 'RESTful API integration capabilities',
      category: 'integration',
      industry: 'general',
      version: '1.4.0',
      rating: 4.5,
      downloads: 760,
      features: [
        'REST API Endpoints',
        'Webhook Management',
        'Data Synchronization',
        'Authentication',
        'Rate Limiting',
        'API Documentation'
      ]
    });

    // Report Builder Template
    this.templates.set('report_builder', {
      id: 'report_builder',
      name: 'Advanced Report Builder',
      description: 'Drag-and-drop report creation tool',
      category: 'integration',
      industry: 'general',
      version: '1.1.0',
      rating: 4.3,
      downloads: 540,
      features: [
        'Visual Report Builder',
        'Custom Charts',
        'Scheduled Reports',
        'Export Formats',
        'Dashboard Integration',
        'Real-time Data'
      ]
    });
  }

  initializeCategories() {
    this.categories.set('core', {
      name: 'Core ERPNext',
      description: 'Essential ERPNext functionality',
      icon: 'database',
      color: '#1677ff'
    });

    this.categories.set('industry', {
      name: 'Industry Specific',
      description: 'Templates tailored for specific industries',
      icon: 'industry',
      color: '#52c41a'
    });

    this.categories.set('functional', {
      name: 'Functional Areas',
      description: 'Department and function specific templates',
      icon: 'function',
      color: '#faad14'
    });

    this.categories.set('integration', {
      name: 'Integration & Tools',
      description: 'Integration and utility templates',
      icon: 'integration',
      color: '#722ed1'
    });
  }

  setupIndustryMappings() {
    this.industryMappings.set('retail', [
      'retail_pos',
      'ecommerce_integration',
      'inventory_management',
      'sales_management'
    ]);

    this.industryMappings.set('manufacturing', [
      'production_planning',
      'quality_management',
      'inventory_management',
      'purchase_management'
    ]);

    this.industryMappings.set('healthcare', [
      'patient_management',
      'hr_management',
      'financial_management'
    ]);

    this.industryMappings.set('education', [
      'student_information',
      'hr_management',
      'financial_management',
      'project_management'
    ]);

    this.industryMappings.set('services', [
      'project_management',
      'hr_management',
      'financial_management',
      'api_integration'
    ]);
  }

  // Public Methods
  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category) {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  getTemplatesByIndustry(industry) {
    const templateIds = this.industryMappings.get(industry) || [];
    return templateIds.map(id => this.templates.get(id)).filter(Boolean);
  }

  searchTemplates(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.templates.values()).filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  getRecommendedTemplates(requirements) {
    const { industry, entities, workflows, features } = requirements;
    const recommendations = [];

    // Industry-based recommendations
    if (industry) {
      const industryTemplates = this.getTemplatesByIndustry(industry);
      recommendations.push(...industryTemplates.map(t => ({
        ...t,
        score: 0.9,
        reason: 'Industry match'
      })));
    }

    // Entity-based recommendations
    if (entities && entities.length > 0) {
      for (const template of this.templates.values()) {
        if (template.doctypes) {
          const entityMatches = entities.filter(entity => 
            template.doctypes.some(dt => 
              dt.name.toLowerCase().includes(entity.toLowerCase()) ||
              entity.toLowerCase().includes(dt.name.toLowerCase())
            )
          );
          
          if (entityMatches.length > 0) {
            const score = entityMatches.length / entities.length;
            recommendations.push({
              ...template,
              score: score * 0.8,
              reason: `Entity match: ${entityMatches.join(', ')}`
            });
          }
        }
      }
    }

    // Remove duplicates and sort by score
    const uniqueRecommendations = recommendations.filter((template, index, self) =>
      index === self.findIndex(t => t.id === template.id)
    );

    return uniqueRecommendations.sort((a, b) => b.score - a.score);
  }

  getCompatibilityInfo(templateId, erpnextVersion = '13.0.0') {
    const template = this.getTemplate(templateId);
    if (!template || !template.compatibility) {
      return { compatible: true, warnings: [] };
    }

    const warnings = [];
    const compatibility = template.compatibility;

    // Check ERPNext version compatibility
    if (compatibility.erpnext_version) {
      const requiredVersion = compatibility.erpnext_version.replace('>=', '');
      if (this.compareVersions(erpnextVersion, requiredVersion) < 0) {
        warnings.push(`Requires ERPNext ${compatibility.erpnext_version}, current: ${erpnextVersion}`);
      }
    }

    return {
      compatible: warnings.length === 0,
      warnings
    };
  }

  generateTemplateManifest(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    return {
      app_name: template.id,
      app_title: template.name,
      app_description: template.description,
      app_version: template.version,
      required_apps: ['frappe', 'erpnext'],
      doctypes: template.doctypes || [],
      workflows: template.workflows || [],
      reports: template.reports || [],
      customizations: template.customizations || [],
      hooks: template.hooks || {},
      fixtures: this.generateFixtures(template)
    };
  }

  generateFixtures(template) {
    const fixtures = [];

    // Generate Custom Field fixtures
    if (template.customizations) {
      for (const customization of template.customizations) {
        for (const field of customization.custom_fields || []) {
          fixtures.push({
            doctype: 'Custom Field',
            data: {
              dt: customization.doctype,
              fieldname: field.fieldname,
              fieldtype: field.fieldtype,
              label: field.label,
              ...field
            }
          });
        }
      }
    }

    return fixtures;
  }

  // Utility Methods
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  getStatus() {
    return {
      totalTemplates: this.templates.size,
      categories: this.categories.size,
      industryMappings: this.industryMappings.size,
      templatesByCategory: Object.fromEntries(
        Array.from(this.categories.keys()).map(category => [
          category,
          this.getTemplatesByCategory(category).length
        ])
      )
    };
  }
}

module.exports = { TemplateManager };