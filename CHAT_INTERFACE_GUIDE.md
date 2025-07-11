# 📝 **Chat Interface Architecture & Development Guide**

## 🏗️ **Core Chat Interface Structure**

### **Main Components Hierarchy:**
```
AppBuilderChat.jsx (Root Container)
├── AppSidebar.js (Navigation)
├── AppHeader.js (Top Bar)
└── ChatContent.js (Main Content Controller)
    ├── ChatViewSwitcher.js (Mode Controls)
    ├── WelcomeSection.js (Welcome Mode)
    ├── MessageList.js (Chat Messages)
    ├── ChatInput.js (Input Component)
    └── ResultCanvas.js (Output Area)
```

---

## 🎯 **Three View Modes System**

### **😊 Welcome Mode:**
- **Container**: Full width, centered content
- **Chat Input**: 800px max-width, elevated style
- **Templates**: 1200px max-width (wider than input)
- **Logic**: Shows when `viewMode === 'welcome'`

### **💬 Chat Only Mode:**
- **Container**: Centered 800px max-width
- **Layout**: MessageList + ChatInput in flex column
- **Logic**: Shows when `viewMode === 'chat'`

### **🔲 Chat + Canvas Mode:**
- **Layout**: 30% Chat + 70% Canvas split
- **Sidebar**: Auto-collapses for more space
- **Logic**: Shows when `viewMode === 'chat+canvas'`

---

## 🤖 **Dynamic Switching Intelligence**

### **Auto-Switching Triggers:**
```javascript
// 1. Welcome → Chat (First Message)
if (viewMode === 'welcome' && hasMessages) {
  smartSwitch('chat', 'first_message');
}

// 2. Chat → Canvas (Generation Keywords)
generationKeywords = ['generate app', 'create doctype', 'build workflow']
if (keywords.detected && viewMode !== 'chat+canvas') {
  smartSwitch('chat+canvas', 'generation_requested');
}

// 3. Canvas → Chat (Chat Focus Keywords)  
chatKeywords = ['back to chat', 'hide output', 'chat only']
if (keywords.detected && viewMode === 'chat+canvas') {
  smartSwitch('chat', 'chat_focused');
}
```

### **User Preference System:**
- **Manual Override**: `setViewMode(mode, true)` marks as user action
- **Preference Memory**: Remembers user's manual choices
- **Smart Respect**: Only auto-switches for strong signals
- **Toggle Control**: Users can disable dynamic switching

---

## 🔧 **State Management (chatViewStore.js)**

### **Store Structure:**
```javascript
{
  viewMode: 'welcome' | 'chat' | 'chat+canvas',
  userPreference: null | 'welcome' | 'chat' | 'chat+canvas',
  lastActivity: 'manual' | 'auto',
  dynamicSwitchingEnabled: boolean
}
```

### **Key Functions:**
- `setViewMode(mode, isUserAction)` - Set mode with action tracking
- `smartSwitch(mode, context)` - Intelligent switching with respect for user preference
- `setDynamicSwitching(enabled)` - Toggle auto-switching on/off

---

## 🎨 **Chat Input Component Design**

### **Unified Style Template:**
```javascript
// Container: Elevated, rounded, with shadow
background: token.colorBgElevated,
borderRadius: '16px',
border: `1px solid ${token.colorBorderSecondary}`,
boxShadow: token.boxShadowTertiary

// Input: TextArea with auto-resize
autoSize: { minRows: 1, maxRows: 4 }

// Buttons: Attachment + Primary Send/Run button
```

### **Used In All Modes:**
- Welcome: Centered in WelcomeSection
- Chat: Bottom of MessageList container
- Canvas: Bottom of chat column (30% side)

---

## 🎯 **Future Development Areas**

### **1. Message System Enhancement:**
```javascript
// Message Types to Add:
- user: User input messages
- assistant: AI responses  
- system: Status/error messages
- file: File attachments
- generated: Generated code/content
- progress: Generation progress updates
```

### **2. Canvas/Output Area Features:**
- **Code Preview**: Syntax highlighted generated code
- **Live Preview**: Real-time ERPNext structure preview
- **File Tree**: Generated app file structure
- **Download**: Export generated app
- **Edit Mode**: In-place code editing

### **3. Real-time Features:**
- **Streaming Responses**: Character-by-character AI responses
- **Progress Indicators**: Generation progress with steps
- **Live Updates**: Real-time canvas updates during generation
- **WebSocket**: Real-time server communication

### **4. Advanced Interactions:**
- **Message Actions**: Edit, regenerate, copy, delete messages
- **Context Menu**: Right-click options on messages
- **Drag & Drop**: File upload to chat
- **Keyboard Shortcuts**: Quick actions and navigation

### **5. Smart Features:**
- **Auto-save**: Save conversation state
- **Message Search**: Find previous conversations
- **Template Suggestions**: Context-aware template recommendations
- **Quick Actions**: Pre-defined common requests

---

## 🔌 **Integration Points for Backend**

### **MCP Server Endpoints to Connect:**
```javascript
// Chat Processing
POST /chat/message - Send user message, get AI response
POST /chat/stream - Streaming chat responses
GET /chat/history - Get conversation history

// Generation Workflow  
POST /generate/start - Start app generation
GET /generate/status - Check generation progress
GET /generate/result - Get generated files

// File Handling
POST /upload/prd - Upload PRD document
POST /upload/file - Upload any file to chat
```

### **State Synchronization:**
- **Local State**: UI state, view modes, preferences
- **Server State**: Messages, generation status, file uploads
- **Real-time Sync**: WebSocket for live updates

---

## 🚀 **Development Workflow for New Features**

### **Adding New Chat Features:**
1. **Update Message Types**: Add new message type to store
2. **Enhance MessageList**: Add rendering for new message type
3. **Update Dynamic Logic**: Add switching logic if needed
4. **Test All Modes**: Ensure feature works in all 3 view modes

### **Adding Canvas Features:**
1. **Update ResultCanvas**: Add new display component
2. **State Management**: Add canvas-specific state
3. **Auto-switching**: Add triggers for canvas mode
4. **Integration**: Connect to backend data

### **Performance Considerations:**
- **Virtual Scrolling**: For long message lists
- **Code Splitting**: Lazy load canvas components  
- **Debouncing**: For auto-switching triggers
- **Memoization**: Optimize re-renders

---

## 📂 **Key Files Location:**
```
app-builder-ui/src/components/Chat/
├── AppBuilderChat.jsx              # Main chat container
├── components/
│   ├── ChatContent.js              # Core content with dynamic logic
│   ├── ChatViewSwitcher.js         # Mode switcher with controls
│   ├── chatViewStore.js            # Enhanced state management
│   ├── ChatInput.js                # Unified input component
│   ├── WelcomeSection.js           # Welcome page with templates
│   ├── MessageList.js              # Chat message display
│   ├── ChatStartBanner.js          # Conversation started banner
│   └── ResultCanvas.js             # Output/canvas area
```

---

## 🔄 **Dynamic Switching Keywords Reference:**

### **Generation Triggers (→ Canvas Mode):**
- "generate app", "create app", "build app"
- "show output", "show result", "show generated"
- "create doctype", "generate doctype"
- "build workflow", "create workflow"
- "app generation", "erpnext app", "generate code"

### **Chat Focus Triggers (→ Chat Mode):**
- "back to chat", "hide output", "close canvas"
- "chat only", "focus on chat", "minimize output"

### **Loading State Detection:**
- Auto-switches to canvas when `isLoading === true` + generation keywords detected

---

**🎯 Current Status**: Solid foundation ready for feature expansion  
**⚡ Next Priority**: Backend integration + real message processing  
**🔄 Architecture**: Flexible, scalable, user-centric design  
**📅 Last Updated**: Current development session