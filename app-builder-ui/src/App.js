import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button, Space, Card, Alert } from 'antd';
import SimplifiedPRDUpload from './components/PRDUpload/SimplifiedPRDUpload';
import Analysis from './components/Analysis/Analysis';
import Templates from './components/Templates/Templates';
import Generator from './components/Generator/Generator';
import Quality from './components/Quality/Quality';
import AppBuilderChat from './components/Chat/AppBuilderChat.jsx';
import AgentDashboard from './components/AgentDashboard/AgentDashboard';
import ChatTest from './components/ChatTest.jsx';
import './App.css';

const NotFound = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <Card>
      <Alert
        message="Page Not Found"
        description="The page you're looking for doesn't exist."
        type="error"
        showIcon
        style={{ marginBottom: '24px' }}
      />
      <Space direction="vertical">
        <h3>Available Pages:</h3>
        <Space wrap>
          <Link to="/"><Button type="primary">Chat Interface</Button></Link>
          <Link to="/agents"><Button type="primary">Agent Dashboard</Button></Link>
          <Link to="/analysis"><Button>Analysis</Button></Link>
          <Link to="/templates"><Button>Templates</Button></Link>
          <Link to="/generator"><Button>Generator</Button></Link>
          <Link to="/quality"><Button>Quality</Button></Link>
          <Link to="/chat-test"><Button>Chat Test</Button></Link>
        </Space>
      </Space>
    </Card>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AppBuilderChat />} />
        <Route path="/chat" element={<AppBuilderChat />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/agents" element={<AgentDashboard />} />
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;