import React, { useState } from 'react';
import PhaserGame from './phaserGame';

const App = () => {
  const [sessions, setSessions] = useState([]);

  const startNewSession = () => {
    const newCounter = Math.floor(Math.random() * 91) + 30; 

    setSessions([...sessions, { counter: newCounter }]);
  };
  
  const handleGameEnd = (sessionId, endTime) => {
    console.log(`Session ${sessionId} ended`);
    setSessions(sessions.map(session =>
      session.id === sessionId
        ? { ...session, endTime }
        : session
    ));
  };

  return (
    <>
      <button onClick={startNewSession}>Start New Session</button>
      {sessions.map(session => (
        <PhaserGame
          key={session.id}
          counter={session.counter}
          onGameEnd={handleGameEnd}
          endTime={session.endTime}
        />
      ))}
    </>
  );
};

export default App;