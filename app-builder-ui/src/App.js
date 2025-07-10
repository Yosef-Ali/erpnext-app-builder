import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimplifiedPRDUpload from './components/PRDUpload/SimplifiedPRDUpload';
import Analysis from './components/Analysis/Analysis';
import Templates from './components/Templates/Templates';
import Generator from './components/Generator/Generator';
import Quality from './components/Quality/Quality';
import AppBuilderChat from './components/Chat/AppBuilderChat';
import './App.css';

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
      </Routes>
    </div>
  );
}

export default App;