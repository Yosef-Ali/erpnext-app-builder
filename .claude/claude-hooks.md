# Claude Hooks System Documentation

## Overview

Claude Hooks is an advanced AI-driven processing system that enhances ERPNext app generation through intelligent pattern recognition, context awareness, and automated optimization.

## Architecture

### 1. Hook Types

#### Parser Hooks
Extract and analyze information from PRDs:
- **prd-section**: Splits PRD into logical sections
- **entity-extractor**: Identifies business entities (Patient, Appointment, etc.)
- **workflow-detector**: Finds business processes and state transitions
- **requirement-identifier**: Extracts functional/non-functional requirements

#### Validator Hooks
Ensure ERPNext compliance and best practices:
- **schema**: Validates DocType naming and structure
- **relationship**: Verifies entity relationships and foreign keys
- **permission**: Checks role-based access control
- **workflow**: Validates state transitions and actions

#### Generator Hooks
Create ERPNext components:
- **doctype**: Generates DocType definitions with fields
- **workflow**: Creates workflow configurations
- **permission**: Generates permission rules
- **report**: Creates report definitions

#### Optimizer Hooks
Improve performance and UX:
- **field-optimizer**: Optimizes field types and indexes
- **query-optimizer**: Improves database queries
- **ui-optimizer**: Enhances form layouts

### 2. Hook Execution Pipeline

```javascript
// Hook execution flow
const pipeline = [
  { type: 'parser', name: 'prd-section' },
  { type: 'parser', name: 'entity-extractor' },
  { type: 'parser', name: 'workflow-detector' },
  { type: 'parser', name: 'requirement-identifier' }
];

// Each hook receives previous results
for (const step of pipeline) {
  result = await hooks.execute(step.type, step.name, result, context);
}
```

### 3. AI Enhancement Layer

Each hook can be AI-enhanced for better accuracy:

```javascript
// AI pattern matching for entity extraction
const dentalPatterns = [
  { pattern: /patient(?:s)?/gi, entity: 'Patient' },
  { pattern: /appointment(?:s)?/gi, entity: 'Appointment' },
  { pattern: /treatment(?:s)?/gi, entity: 'Treatment' }
];
```

## Hook Implementation

### Creating a Custom Hook

```javascript
module.exports = {
  version: '1.0.0',
  description: 'Extracts business entities from PRD',
  
  execute: async (data, context) => {
    // Hook logic here
    const entities = extractEntities(data.content);
    
    return {
      ...data,
      entities,
      context: {
        ...context,
        entityCount: entities.length
      }
    };
  }
};
```

### Hook Registration

```javascript
// Register in hooks registry
hooksRegistry.register('parser', 'entity-extractor', entityExtractorHook);
```

## Best Practices

1. **Single Responsibility**: Each hook should do one thing well
2. **Immutable Data**: Don't modify input data directly
3. **Error Handling**: Gracefully handle errors and edge cases
4. **Performance**: Optimize for speed, especially in parsers
5. **Testing**: Write tests for each hook

## Integration with Context Engineering

Hooks work with the Context Engine to provide intelligent suggestions:

1. **Pattern Recognition**: Hooks identify patterns in PRDs
2. **Context Building**: Results feed into context engine
3. **Template Matching**: Context engine suggests relevant templates
4. **Continuous Learning**: System improves over time

## Available Hooks

### Parser Hooks
- `prd-section`: Parses PRD structure
- `entity-extractor`: Extracts business entities
- `workflow-detector`: Identifies workflows
- `requirement-identifier`: Finds requirements

### Validator Hooks  
- `schema`: Validates ERPNext schemas
- `relationship`: Checks relationships
- `permission`: Validates permissions
- `workflow`: Checks workflow logic

### Generator Hooks
- `doctype`: Generates DocTypes
- `workflow`: Creates workflows
- `permission`: Generates permissions
- `report`: Creates reports

### Optimizer Hooks
- `naming-convention`: Fixes naming issues
- `field-optimization`: Optimizes fields
- `performance`: Improves performance
- `best-practices`: Applies ERPNext best practices
