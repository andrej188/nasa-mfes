import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'; 
import homeWrapper from 'home/homeWrapper'; 

const App = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      homeWrapper(divRef.current);
    }
  }, []);

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div ref={divRef}></div>
    </div>
  );
};

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
