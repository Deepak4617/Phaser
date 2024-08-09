import React from 'react';
import Session from './sessionPanel';

const SessionList = ({ sessions, onEnd }) => {
  
  return (
    <div className="session-list">
      {sessions.map((session) => (
        <Session key={session.id} session={session} onEnd={onEnd} />
      ))}
    </div>
  );
};

export default SessionList;
