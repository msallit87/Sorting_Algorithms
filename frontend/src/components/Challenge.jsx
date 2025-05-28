import React, { useState } from 'react';

const Challenge = ({ currentStep, onGuess }) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(guess);
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label>What happens next?</label><br/>
      <input
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="e.g. compare [1,2]"
        style={{ padding: '0.5rem', width: '250px' }}
      />
      <button style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }} type="submit">
        Guess
      </button>
    </form>
  );
};

export default Challenge;