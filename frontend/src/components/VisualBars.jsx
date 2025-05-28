import React from 'react';

const VisualBars = ({ array, highlight }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', marginTop: '20px' }}>
      {array.map((value, index) => (
        <div key={index} style={{ textAlign: 'center', margin: '0 4px' }}>
          <div
            style={{
              height: `${value * 5}px`,
              width: '20px',
              backgroundColor: highlight.includes(index) ? 'orange' : 'steelblue',
              transition: 'height 0.3s ease'
            }}
          />
          <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>{value}</div>
        </div>
      ))}
    </div>
  );
};

export default VisualBars;