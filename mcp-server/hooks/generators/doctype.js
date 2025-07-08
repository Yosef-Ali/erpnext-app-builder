// DocType Generator
module.exports = {
  execute: async (analysis, context) => {
    const doctypes = [];
    
    if (analysis.entities) {
      for (const entity of analysis.entities) {
        doctypes.push({
          doctype: entity.doctype,
          module: entity.module,
          custom: 1,
          fields: generateBasicFields(entity),
          permissions: generateBasicPermissions()
        });
      }
    }
    
    return doctypes;
  }
};

function generateBasicFields(entity) {
  return [
    {
      fieldname: 'naming_series',
      label: 'Series',
      fieldtype: 'Select',
      options: entity.doctype.toUpperCase().substring(0, 3) + '-.####'
    },
    {
      fieldname: entity.name.toLowerCase() + '_name',
      label: entity.name + ' Name',
      fieldtype: 'Data',
      reqd: 1
    }
  ];
}

function generateBasicPermissions() {
  return [
    {
      role: 'System Manager',
      read: 1,
      write: 1,
      create: 1,
      delete: 1
    }
  ];
}
