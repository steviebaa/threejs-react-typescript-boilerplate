import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import {World} from '@core/scene/World';
import {Waves} from '@controllers/Waves';

export const App: React.FC = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Initialize the world once the DOM element is available
    const world = new World({
      renderer: {containerId: 'app'},
      scene: {axesHelper: false},
    });

    // Load project into the world
    Waves.load(world);
  }, [sceneRef.current]);

  return (
    <div id="scene" ref={sceneRef}>
      <h1>Three.js React TypeScript Boilerplate</h1>
    </div>
  );
};

// Inject the app into the DOM
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
