'use client';

import Snowfall from 'react-snowfall';

export default function GlobalSnowfall() {
  return (
    <Snowfall
      color="#000000" 
      snowflakeCount={120}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
