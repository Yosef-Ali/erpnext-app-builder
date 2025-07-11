// Type definitions for ERPNext App Builder

export interface Message {
    id: number;
    type: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    analysis?: Analysis;
    suggestions?: string[];
    hooks?: ClaudeHook[];
    quality?: number;
    systemType?: 'info' | 'success' | 'error' | 'progress';
}

export interface Analysis {
    entities?: BusinessEntity[];
    workflows?: Workflow[];
    sections?: RequirementSection[];
    confidence?: number;
    enriched?: {
        domain?: {
            industry?: string;
        };
    };
}

export interface BusinessEntity {
    id: string;
    name: string;
    description: string;
    fields: EntityField[];
    relationships: EntityRelationship[];
}

export interface EntityField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
}

export interface EntityRelationship {
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    targetEntity: string;
    description?: string;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
}

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    type: string;
}

export interface RequirementSection {
    id: string;
    title: string;
    content: string;
    type: string;
}

export interface ClaudeHook {
    name: string;
    success: boolean;
    executionTime: number;
    aiEnhanced: boolean;
}

export interface ClaudeHooksStatus {
    [hookName: string]: {
        status: string;
        executionTime: number;
        aiEnhanced: boolean;
    };
}

export interface ChatHistoryItem {
    id: number;
    title: string;
    date: string;
    active?: boolean;
}

export interface Template {
    id: number;
    title: string;
    description: string;
    category: string;
    features: string[];
    image: string;
}

export interface WorkflowData {
    stage: string;
    prd?: string;
    analysis?: Analysis;
    prompt?: string;
    structure?: any;
    qualityReport?: QualityReport;
}

export interface QualityReport {
    overallScore: number;
    status: string;
    issues: QualityIssue[];
}

export interface QualityIssue {
    id: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
}

export interface UploadProps {
    beforeUpload: (file: File) => boolean;
    showUploadList: boolean;
    accept: string;
}

// Component Props Interfaces
export interface AppSidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    activeTab: string;
    onNavigation: (path: string, tab: string) => void;
}

export interface AppHeaderProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    onToggleDarkMode: () => void;
    isConnected: boolean;
}

export interface WelcomeSectionProps {
    onSetInputValue: (value: string) => void;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: () => void;
    isLoading: boolean;
    hasMessages?: boolean;
}

export interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    renderMessage: (msg: Message) => React.ReactNode;
}

export interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: () => void;
    isLoading: boolean;
    uploadProps: UploadProps;
}

export interface ChatContentProps {
    messages: Message[];
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    renderMessage: (msg: Message) => React.ReactNode;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: () => void;
    uploadProps: UploadProps;
    onSetInputValue: (value: string) => void;
}

export interface MessageProps {
    msg: Message;
    onSetInputValue: (value: string) => void;
}
