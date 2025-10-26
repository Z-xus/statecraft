import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const DFANode = ({ data, isConnectable }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '50%',
      border: data.isCurrentNode ? '2px solid #0070f3' : '2px solid #777',
      background: data.isAcceptState ? '#6ede87' : (data.isCurrentNode ? '#e0f7fa' : '#ffffff'),
      color: '#333',
      width: '80px',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      boxShadow: data.isCurrentNode ? '0 0 35px rgba(0, 0, 243, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
    }}>
      {/* Start state arrow */}
      {data.isStartState && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-260%)',
          fontSize: '24px',
          color: '#777',
          textShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        }}>
          →
        </div>
      )}

      {/* Double border for accept state */}
      {data.isAcceptState && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          left: '4px',
          bottom: '4px',
          borderRadius: '50%',
          border: '2px solid #777',
          pointerEvents: 'none',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
        }} />
      )}

      {/* Node content */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ borderRadius: '50%', borderColor: '#333' }}
      />
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
      }}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ borderRadius: '50%', borderColor: '#333' }}
      />
    </div>
  );
};

export default memo(DFANode);