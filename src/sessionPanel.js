import React, { useState, useEffect } from 'react';

const Session = ({ session, onEnd }) => {
  const [counter, setCounter] = useState(session.counter);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onEnd(session.id);
    }
  }, [counter, session, onEnd]);

  return (
    <div>
      <p>Session ID: {session.id}</p>
      <p>Start Time: {session.startTime}</p>
      <p>End Time: {session.endTime}</p>
      <p>Counter: {counter}</p>
    </div>
  );
};

export default Session;
