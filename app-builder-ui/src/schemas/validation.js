import { z } from 'zod';

// PRD Validation Schema
export const PRDSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(50, 'PRD content must be at least 50 characters')
    .max(50000, 'PRD content must be less than 50,000 characters'),
  industry: z.string().optional(),
  type: z.enum(['text', 'markdown', 'pdf']).default('text'),
  tags: z.array(z.string()).optional()
});

// DocType Field Schema
const FieldSchema = z.object({
  fieldname: z.string()
    .regex(/^[a-z][a-z0-9_]*$/, 'Field name must be lowercase with underscores'),
  fieldtype: z.enum([
    'Data', 'Text', 'Small Text', 'Text Editor', 
    'Link', 'Select', 'Date', 'Datetime', 'Time',
    'Currency', 'Float', 'Int', 'Check', 'Table',
    'Attach', 'Attach Image', 'Color', 'Password'
  ]),
  label: z.string().min(1),
  reqd: z.number().min(0).max(1).optional(),
  unique: z.number().min(0).max(1).optional(),
  options: z.string().optional(),
  default: z.any().optional(),
  description: z.string().optional(),
  in_list_view: z.number().min(0).max(1).optional(),
  in_standard_filter: z.number().min(0).max(1).optional()
});

// DocType Schema
export const DocTypeSchema = z.object({
  name: z.string()
    .regex(/^[A-Z][a-zA-Z0-9 ]+$/, 'DocType name must start with capital letter'),
  module: z.string(),
  custom: z.number().min(0).max(1).default(1),
  naming: z.enum(['autoincrement', 'field:fieldname', 'format:{prefix}-{####}']).optional(),
  fields: z.array(FieldSchema),
  permissions: z.array(z.object({
    role: z.string(),
    read: z.number().min(0).max(1),
    write: z.number().min(0).max(1),
    create: z.number().min(0).max(1),
    delete: z.number().min(0).max(1),
    submit: z.number().min(0).max(1).optional(),
    cancel: z.number().min(0).max(1).optional(),
    amend: z.number().min(0).max(1).optional()
  })),
  track_changes: z.number().min(0).max(1).optional(),
  track_seen: z.number().min(0).max(1).optional(),
  track_views: z.number().min(0).max(1).optional()
});

// Workflow Schema
export const WorkflowSchema = z.object({
  name: z.string(),
  document_type: z.string(),
  is_active: z.number().min(0).max(1).default(1),
  states: z.array(z.object({
    state: z.string(),
    style: z.enum(['Primary', 'Success', 'Info', 'Warning', 'Danger']),
    doc_status: z.enum(['0', '1', '2'])
  })),
  transitions: z.array(z.object({
    state: z.string(),
    action: z.string(),
    next_state: z.string(),
    allowed: z.string(),
    allow_self_approval: z.number().min(0).max(1).default(0)
  }))
});

// App Structure Schema
export const AppStructureSchema = z.object({
  app_name: z.string()
    .regex(/^[a-z_]+$/, 'App name must be lowercase with underscores'),
  app_title: z.string(),
  app_description: z.string(),
  app_publisher: z.string(),
  app_email: z.string().email(),
  app_license: z.string().default('MIT'),
  doctypes: z.array(DocTypeSchema),
  workflows: z.array(WorkflowSchema),
  permissions: z.array(z.any()).optional(),
  scripts: z.object({
    client: z.array(z.any()).optional(),
    server: z.array(z.any()).optional()
  }).optional()
});

// Template Schema
export const TemplateSchema = z.object({
  name: z.string().min(3).max(100),
  category: z.enum(['healthcare', 'retail', 'education', 'manufacturing', 'services', 'other']),
  industry: z.string(),
  description: z.string().max(500),
  features: z.array(z.string()),
  structure: AppStructureSchema,
  preview_image: z.string().url().optional(),
  version: z.string().default('1.0.0'),
  tags: z.array(z.string()).optional()
});

// Generated App Schema
export const GeneratedAppSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  industry: z.string(),
  prd_content: z.string(),
  app_structure: AppStructureSchema,
  quality_score: z.number().min(0).max(1),
  quality_report: z.any().optional(),
  template_used: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(['draft', 'generated', 'validated', 'deployed']).default('draft')
});

// API Response Schemas
export const AnalysisResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    entities: z.array(z.object({
      name: z.string(),
      doctype: z.string(),
      module: z.string(),
      confidence: z.number(),
      type: z.string()
    })),
    workflows: z.array(z.object({
      name: z.string(),
      type: z.string(),
      states: z.array(z.string()),
      confidence: z.number()
    })),
    requirements: z.any(),
    enriched: z.any(),
    context: z.any()
  }).optional(),
  error: z.string().optional()
});

export const StructureResponseSchema = z.object({
  success: z.boolean(),
  structure: AppStructureSchema.optional(),
  error: z.string().optional()
});

export const QualityResponseSchema = z.object({
  success: z.boolean(),
  report: z.object({
    overallScore: z.number(),
    status: z.string(),
    scores: z.record(z.number()),
    issues: z.array(z.any()),
    suggestions: z.array(z.any())
  }).optional(),
  error: z.string().optional()
});

// Form Input Schemas (for react-hook-form)
export const PromptInputSchema = z.object({
  prompt: z.string()
    .min(3, 'Please enter at least 3 characters')
    .max(200, 'Please keep prompts under 200 characters')
});

export const AppDetailsFormSchema = z.object({
  app_name: z.string()
    .regex(/^[a-z_]+$/, 'Use lowercase letters and underscores only'),
  app_title: z.string().min(3).max(50),
  app_description: z.string().min(10).max(200),
  app_publisher: z.string().min(3).max(50),
  app_email: z.string().email('Please enter a valid email'),
  app_license: z.string()
});

// Validation helper functions
export const validatePRD = (data) => {
  return PRDSchema.safeParse(data);
};

export const validateAppStructure = (data) => {
  return AppStructureSchema.safeParse(data);
};

export const validateTemplate = (data) => {
  return TemplateSchema.safeParse(data);
};

// Type exports (for TypeScript)
export type PRD = z.infer<typeof PRDSchema>;
export type DocType = z.infer<typeof DocTypeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type AppStructure = z.infer<typeof AppStructureSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type GeneratedApp = z.infer<typeof GeneratedAppSchema>;
