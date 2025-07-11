const entityExtractor = require('./mcp-server/hooks/parsers/entity-extractor.js');

const testData = {
  content: "Patient registration with dental history. Appointment booking system. Treatment management. Dentist schedule management.",
  sections: [
    {
      title: "Patient Management",
      content: "Patient registration with dental history"
    },
    {
      title: "Appointment System", 
      content: "Appointment booking system"
    }
  ]
};

console.log('Testing entity extraction...');
entityExtractor.execute(testData, {}).then(result => {
  console.log('Result:', JSON.stringify(result, null, 2));
}).catch(error => {
  console.error('Error:', error);
});