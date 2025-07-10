import React, { useEffect } from 'react';
import { Button } from 'antd';
import useCanvasStore from './canvasStore';

const CanvasToggle = () => {
  const { canvasVisible, toggleCanvas } = useCanvasStore();

  useEffect(() => {
    console.log('Canvas visible:', canvasVisible);
  }, [canvasVisible]);

  return (
    <Button onClick={toggleCanvas} style={{ margin: 16 }}>
      {canvasVisible ? 'Hide Canvas' : 'Show Canvas'}
    </Button>
  );
};

export default CanvasToggle;
