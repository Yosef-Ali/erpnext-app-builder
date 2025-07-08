import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/Layout/AppHeader';
import AppSidebar from './components/Layout/AppSidebar';
import PRDUpload from './components/PRDUpload/PRDUpload';
import Analysis from './components/Analysis/Analysis';
import Templates from './components/Templates/Templates';
import Generator from './components/Generator/Generator';
import Quality from './components/Quality/Quality';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <div className="app-container">
      <Layout style={{ minHeight: '100vh' }}>
        <AppSidebar />
        <Layout>
          <AppHeader />
          <Content className="main-content">
            <Routes>
              <Route path="/" element={<PRDUpload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/quality" element={<Quality />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;