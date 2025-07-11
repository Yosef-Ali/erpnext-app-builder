# App Builder Enhanced Architecture

## New Components to Add

### 1. State Management (Zustand)
- Global state for workflow
- Generated apps history
- Templates management
- User preferences

### 2. Form Validation (Zod)
- PRD input validation
- Template schema validation
- Generated app structure validation
- API response validation

### 3. Storage System
- PostgreSQL for structured data
- MinIO/S3 for file storage
- Redis for caching
- Local storage fallback

### 4. Industry Templates Repository
- Pre-built industry templates
- Versioning system
- Template marketplace
- Custom template builder

## Implementation Plan

### Phase 1: State Management
```javascript
// stores/appBuilderStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppBuilderStore = create(
  persist(
    (set, get) => ({
      // Workflow state
      currentWorkflow: null,
      workflowStage: null,
      
      // Generated apps
      generatedApps: [],
      currentApp: null,
      
      // Templates
      templates: [],
      customTemplates: [],
      
      // Actions
      setWorkflow: (workflow) => set({ currentWorkflow: workflow }),
      addGeneratedApp: (app) => set(state => ({ 
        generatedApps: [...state.generatedApps, app] 
      })),
    }),
    {
      name: 'app-builder-storage',
    }
  )
)
```

### Phase 2: Validation Schemas
```javascript
// schemas/validation.js
import { z } from 'zod'

export const PRDSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(50),
  industry: z.string().optional(),
  type: z.enum(['text', 'markdown', 'pdf'])
})

export const AppStructureSchema = z.object({
  app_name: z.string().regex(/^[a-z_]+$/),
  doctypes: z.array(DocTypeSchema),
  workflows: z.array(WorkflowSchema),
  permissions: z.array(PermissionSchema)
})
```

### Phase 3: Storage Architecture
```yaml
# docker-compose.storage.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appbuilder
      POSTGRES_USER: appbuilder
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
      
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

### Phase 4: Database Schema
```sql
-- Generated Apps Table
CREATE TABLE generated_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  prd_content TEXT,
  app_structure JSONB,
  quality_score DECIMAL(3,2),
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates Table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  industry VARCHAR(100),
  description TEXT,
  structure JSONB,
  features JSONB,
  preview_image VARCHAR(500),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1),
  version VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Template Usage History
CREATE TABLE template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  app_id UUID REFERENCES generated_apps(id),
  used_at TIMESTAMP DEFAULT NOW()
);
```

## Benefits

1. **Persistence**: Apps and templates survive refreshes
2. **History**: Track all generated apps
3. **Validation**: Ensure data integrity
4. **Scalability**: Ready for multi-user
5. **Performance**: Caching and optimized queries
