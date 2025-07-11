// DocType Generator
module.exports = {
  execute: async (analysis, context) => {
    const doctypes = [];
    
    if (analysis.entities && analysis.entities.length > 0) {
      for (const entity of analysis.entities) {
        const doctype = {
          name: entity.doctype,
          module: entity.module,
          custom: 1,
          naming: entity.doctype === 'Patient' ? 'field:patient_name' : 'autoincrement',
          fields: generateFieldsForEntity(entity),
          permissions: generatePermissions(entity),
          track_changes: 1,
          track_seen: 1,
          track_views: 1
        };
        
        doctypes.push(doctype);
      }
    }
    
    console.log('DocType Generator created:', doctypes.map(d => d.name));
    
    return doctypes;
  }
};

function generateFieldsForEntity(entity) {
  const fields = [];
  
  // Add section for basic info
  fields.push({
    fieldname: 'section_basic',
    label: 'Basic Information',
    fieldtype: 'Section Break'
  });
  
  // Generate fields based on entity type
  switch (entity.doctype) {
    case 'Patient':
      fields.push(...generatePatientFields());
      break;
    case 'Patient Appointment':
      fields.push(...generateAppointmentFields());
      break;
    case 'Clinical Procedure':
      fields.push(...generateTreatmentFields());
      break;
    case 'Healthcare Practitioner':
      fields.push(...generateDentistFields());
      break;
    case 'Healthcare Invoice':
      fields.push(...generateBillingFields());
      break;
    default:
      fields.push(...generateBasicFields(entity));
  }
  
  // Add common fields for all entities
  fields.push(
    {
      fieldname: 'column_break_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'status',
      label: 'Status',
      fieldtype: 'Select',
      options: 'Active\nInactive\nDraft',
      default: 'Active',
      in_list_view: 1,
      in_standard_filter: 1
    },
    {
      fieldname: 'section_notes',
      label: 'Additional Information',
      fieldtype: 'Section Break',
      collapsible: 1
    },
    {
      fieldname: 'notes',
      label: 'Notes',
      fieldtype: 'Text Editor'
    }
  );
  
  return fields;
}

function generatePatientFields() {
  return [
    {
      fieldname: 'patient_name',
      label: 'Patient Name',
      fieldtype: 'Data',
      reqd: 1,
      bold: 1,
      in_list_view: 1,
      in_standard_filter: 1
    },
    {
      fieldname: 'date_of_birth',
      label: 'Date of Birth',
      fieldtype: 'Date',
      reqd: 1
    },
    {
      fieldname: 'gender',
      label: 'Gender',
      fieldtype: 'Select',
      options: 'Male\nFemale\nOther',
      reqd: 1
    },
    {
      fieldname: 'column_break_patient_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'email',
      label: 'Email',
      fieldtype: 'Data',
      options: 'Email'
    },
    {
      fieldname: 'mobile',
      label: 'Mobile',
      fieldtype: 'Data',
      options: 'Phone'
    },
    {
      fieldname: 'blood_group',
      label: 'Blood Group',
      fieldtype: 'Select',
      options: '\nA+\nA-\nB+\nB-\nO+\nO-\nAB+\nAB-'
    },
    {
      fieldname: 'section_dental_history',
      label: 'Dental History',
      fieldtype: 'Section Break'
    },
    {
      fieldname: 'dental_history',
      label: 'Dental History',
      fieldtype: 'Text Editor'
    },
    {
      fieldname: 'allergies',
      label: 'Allergies',
      fieldtype: 'Small Text'
    },
    {
      fieldname: 'section_emergency',
      label: 'Emergency Contact',
      fieldtype: 'Section Break'
    },
    {
      fieldname: 'emergency_contact_name',
      label: 'Emergency Contact Name',
      fieldtype: 'Data'
    },
    {
      fieldname: 'emergency_contact_number',
      label: 'Emergency Contact Number',
      fieldtype: 'Data',
      options: 'Phone'
    }
  ];
}

function generateAppointmentFields() {
  return [
    {
      fieldname: 'appointment_date',
      label: 'Appointment Date',
      fieldtype: 'Date',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'appointment_time',
      label: 'Appointment Time',
      fieldtype: 'Time',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'patient',
      label: 'Patient',
      fieldtype: 'Link',
      options: 'Patient',
      reqd: 1,
      in_list_view: 1,
      in_standard_filter: 1
    },
    {
      fieldname: 'practitioner',
      label: 'Dentist',
      fieldtype: 'Link',
      options: 'Healthcare Practitioner',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'column_break_apt_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'appointment_type',
      label: 'Appointment Type',
      fieldtype: 'Select',
      options: 'Consultation\nCheck-up\nTreatment\nFollow-up\nEmergency',
      reqd: 1
    },
    {
      fieldname: 'duration',
      label: 'Duration (minutes)',
      fieldtype: 'Int',
      default: '30'
    },
    {
      fieldname: 'chief_complaint',
      label: 'Chief Complaint',
      fieldtype: 'Small Text'
    }
  ];
}

function generateTreatmentFields() {
  return [
    {
      fieldname: 'treatment_name',
      label: 'Treatment Name',
      fieldtype: 'Data',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'patient',
      label: 'Patient',
      fieldtype: 'Link',
      options: 'Patient',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'practitioner',
      label: 'Dentist',
      fieldtype: 'Link',
      options: 'Healthcare Practitioner',
      reqd: 1
    },
    {
      fieldname: 'treatment_date',
      label: 'Treatment Date',
      fieldtype: 'Date',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'column_break_treatment_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'procedure_type',
      label: 'Procedure Type',
      fieldtype: 'Select',
      options: 'Cleaning\nFilling\nExtraction\nRoot Canal\nCrown\nBridge\nImplant\nOrthodontics\nOther',
      reqd: 1
    },
    {
      fieldname: 'tooth_number',
      label: 'Tooth Number',
      fieldtype: 'Data'
    },
    {
      fieldname: 'cost',
      label: 'Cost',
      fieldtype: 'Currency',
      options: 'USD'
    },
    {
      fieldname: 'section_details',
      label: 'Treatment Details',
      fieldtype: 'Section Break'
    },
    {
      fieldname: 'treatment_description',
      label: 'Treatment Description',
      fieldtype: 'Text Editor'
    },
    {
      fieldname: 'follow_up_required',
      label: 'Follow-up Required',
      fieldtype: 'Check'
    },
    {
      fieldname: 'follow_up_date',
      label: 'Follow-up Date',
      fieldtype: 'Date',
      depends_on: 'follow_up_required'
    }
  ];
}

function generateDentistFields() {
  return [
    {
      fieldname: 'practitioner_name',
      label: 'Dentist Name',
      fieldtype: 'Data',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'specialization',
      label: 'Specialization',
      fieldtype: 'Select',
      options: 'General Dentistry\nOrthodontics\nEndodontics\nPeriodontics\nProsthodontics\nOral Surgery\nPediatric Dentistry',
      reqd: 1
    },
    {
      fieldname: 'license_number',
      label: 'License Number',
      fieldtype: 'Data',
      reqd: 1
    },
    {
      fieldname: 'column_break_dentist_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'email',
      label: 'Email',
      fieldtype: 'Data',
      options: 'Email'
    },
    {
      fieldname: 'mobile',
      label: 'Mobile',
      fieldtype: 'Data',
      options: 'Phone'
    },
    {
      fieldname: 'section_schedule',
      label: 'Schedule',
      fieldtype: 'Section Break'
    },
    {
      fieldname: 'working_days',
      label: 'Working Days',
      fieldtype: 'Table MultiSelect',
      options: 'Monday\nTuesday\nWednesday\nThursday\nFriday\nSaturday\nSunday'
    },
    {
      fieldname: 'consultation_duration',
      label: 'Default Consultation Duration (minutes)',
      fieldtype: 'Int',
      default: '30'
    }
  ];
}

function generateBillingFields() {
  return [
    {
      fieldname: 'invoice_number',
      label: 'Invoice Number',
      fieldtype: 'Data',
      reqd: 1,
      unique: 1,
      in_list_view: 1
    },
    {
      fieldname: 'patient',
      label: 'Patient',
      fieldtype: 'Link',
      options: 'Patient',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'invoice_date',
      label: 'Invoice Date',
      fieldtype: 'Date',
      reqd: 1,
      default: 'Today'
    },
    {
      fieldname: 'column_break_billing_1',
      fieldtype: 'Column Break'
    },
    {
      fieldname: 'total_amount',
      label: 'Total Amount',
      fieldtype: 'Currency',
      options: 'USD',
      reqd: 1,
      in_list_view: 1
    },
    {
      fieldname: 'paid_amount',
      label: 'Paid Amount',
      fieldtype: 'Currency',
      options: 'USD',
      default: '0'
    },
    {
      fieldname: 'outstanding_amount',
      label: 'Outstanding Amount',
      fieldtype: 'Currency',
      options: 'USD',
      read_only: 1
    },
    {
      fieldname: 'section_treatments',
      label: 'Treatments',
      fieldtype: 'Section Break'
    },
    {
      fieldname: 'treatments',
      label: 'Treatments',
      fieldtype: 'Table',
      options: 'Healthcare Invoice Item'
    },
    {
      fieldname: 'section_insurance',
      label: 'Insurance',
      fieldtype: 'Section Break',
      collapsible: 1
    },
    {
      fieldname: 'insurance_claim',
      label: 'Insurance Claim',
      fieldtype: 'Check'
    },
    {
      fieldname: 'insurance_company',
      label: 'Insurance Company',
      fieldtype: 'Data',
      depends_on: 'insurance_claim'
    },
    {
      fieldname: 'insurance_claim_amount',
      label: 'Insurance Claim Amount',
      fieldtype: 'Currency',
      options: 'USD',
      depends_on: 'insurance_claim'
    }
  ];
}

function generateBasicFields(entity) {
  return [
    {
      fieldname: 'naming_series',
      label: 'Series',
      fieldtype: 'Select',
      options: entity.doctype.substring(0, 3).toUpperCase() + '-.YYYY.-',
      default: entity.doctype.substring(0, 3).toUpperCase() + '-.YYYY.-'
    },
    {
      fieldname: entity.name.toLowerCase().replace(/\s+/g, '_') + '_name',
      label: entity.name + ' Name',
      fieldtype: 'Data',
      reqd: 1,
      in_list_view: 1,
      in_standard_filter: 1
    },
    {
      fieldname: 'description',
      label: 'Description',
      fieldtype: 'Text Editor'
    }
  ];
}

function generatePermissions(entity) {
  const basePermissions = [
    {
      role: 'System Manager',
      read: 1,
      write: 1,
      create: 1,
      delete: 1,
      submit: 0,
      cancel: 0,
      amend: 0
    }
  ];
  
  // Add role-specific permissions for healthcare entities
  if (entity.type === 'healthcare') {
    basePermissions.push(
      {
        role: 'Healthcare Administrator',
        read: 1,
        write: 1,
        create: 1,
        delete: 1,
        submit: 0,
        cancel: 0,
        amend: 0
      },
      {
        role: 'Physician',
        read: 1,
        write: 1,
        create: 1,
        delete: 0,
        submit: 0,
        cancel: 0,
        amend: 0
      },
      {
        role: 'Nursing User',
        read: 1,
        write: 0,
        create: 0,
        delete: 0,
        submit: 0,
        cancel: 0,
        amend: 0
      }
    );
  }
  
  return basePermissions;
}
