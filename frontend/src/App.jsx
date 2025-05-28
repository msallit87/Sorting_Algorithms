import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisualBars from './components/VisualBars';
import TTS from './components/TTS';
import Challenge from './components/Challenge';

function App() {
  const [array, setArray] = useState('');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [steps, setSteps] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentArray, setCurrentArray] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [challengeMode, setChallengeMode] = useState(true);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stepHistory, setStepHistory] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAISuggestion = async () => {
    setSteps([]);
    setMetrics({});
    setCurrentArray([]);
    setCurrentStep(0);
    setExplanation('');
    setIsLoadingAI(true);
    setAiSuggestion('');

    try {
      const parsedArray = array.split(',').map(Number);
      const API_BASE =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000'
          : process.env.REACT_APP_API_BASE;

      const response = await fetch(`${API_BASE}/ai-suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ array: parsedArray })
      });

      if (!response.ok) throw new Error('Failed to fetch AI suggestion');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

          for (const line of lines) {
            if (line === 'data: [DONE]') continue;

            try {
              const parsed = JSON.parse(line.replace('data: ', ''));
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                result += delta;
                setAiSuggestion(prev => prev + delta);
              }
            } catch (err) {
              console.error('Failed to parse chunk:', line, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('AI fetch error:', err);
      setAiSuggestion('⚠️ Error fetching suggestion.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSort = async () => {
    setAiSuggestion('');
    const parsedArray = array.split(',').map(Number);
    const response = await axios.post(
      `http://localhost:8000/sort/${algorithm}`,
      { array: parsedArray }
    );

    setSteps(response.data.steps);
    setMetrics(response.data.metrics);
    setCurrentArray(parsedArray);
    setCurrentStep(0);
    setExplanation('');
    setFeedback('');
    setHighlight([]);
    setStepHistory([]);
  };

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length && !challengeMode) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        applyStep(step);
        setStepHistory(prev => [...prev, step]);
        setCurrentStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [steps, currentStep, challengeMode]);

  const applyStep = (step) => {
    setExplanation(step.explanation || '');
    if (step.type === 'swap' && step.array) {
      setCurrentArray(step.array);
      setHighlight(step.indices);
    } else if (step.type === 'compare') {
      setHighlight(step.indices || []);
    } else {
      setHighlight([]);
    }
  };

  const formatStep = (step) => {
    const [a, b] = step.indices || step.values || [];
    const av = currentArray[a] ?? a;
    const bv = currentArray[b] ?? b;
    if (step.type === 'compare') {
      return `Compare index ${a} (${av}) with index ${b} (${bv})`;
    } else if (step.type === 'swap') {
      return `Swap index ${a} (${av}) with index ${b} (${bv})`;
    } else if (step.type === 'insert') {
      return `Insert value ${av} at index ${a}`;
    } else {
      return `${step.type}`;
    }
  };

  const handleGuess = (guess) => {
    const expected = steps[currentStep];
    const guessClean = guess.replace(/\s/g, '').toLowerCase();
    const expectedStr = `${expected.type}[${(expected.indices || expected.values || []).join(',')}]`;
    if (guessClean === expectedStr) {
      setFeedback('✅ Correct!');
      applyStep(expected);
      setStepHistory(prev => [...prev, expected]);
      setCurrentStep(prev => prev + 1);
    } else {
      setFeedback(`❌ Incorrect. Expected something like: ${expectedStr}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', margin: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Sorting_Algorithms - Sorting Visualizer</h1>
      <input
        style={{ padding: '0.5rem', width: '300px' }}
        type="text"
        value={array}
        onChange={e => setArray(e.target.value)}
        placeholder="Enter comma-separated numbers"
      />
      <select
        style={{ padding: '0.5rem', marginLeft: '1rem' }}
        value={algorithm}
        onChange={e => setAlgorithm(e.target.value)}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="merge">Merge Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="quick">Quick Sort</option>
      </select>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={challengeMode}
          onChange={() => setChallengeMode(!challengeMode)}
        />
        Challenge Mode
      </label>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={ttsEnabled}
          onChange={() => setTtsEnabled(!ttsEnabled)}
        />
        Narrative Mode
      </label>
      <button
        onClick={handleAISuggestion}
        disabled={isLoadingAI}
        aria-busy={isLoadingAI}
        aria-disabled={isLoadingAI}
        style={{
          padding: '0.5rem 1rem',
          marginLeft: '1rem',
          opacity: isLoadingAI ? 0.6 : 1,
          cursor: isLoadingAI ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoadingAI ? '🔄 Optimizing...' : 'Suggest Best Sorting Algorithm (AI)'}
      </button>

      <button
        style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}
        onClick={handleSort}
      >
        Sort
      </button>

      {aiSuggestion && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '5px' }}>
          <h3>AI Suggestion:</h3>
          <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{aiSuggestion}</p>
        </div>
      )}

      {metrics && (
        <div style={{ marginTop: '1rem' }}>
          {metrics?.comparisons !== undefined && <p><strong>Comparisons:</strong> {metrics.comparisons}</p>}
          {metrics?.swaps !== undefined && <p><strong>Swaps:</strong> {metrics.swaps}</p>}
          {metrics?.time !== undefined && <p><strong>Time</strong>: {metrics.time.toFixed(2)} ms</p>}
        </div>
      )}

      <VisualBars array={currentArray} highlight={highlight} />

      {ttsEnabled && explanation && (
        <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
          {explanation}
          <TTS text={explanation} />
        </div>
      )}

      {!ttsEnabled && stepHistory.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Steps:</h3>
          <ul>
            {stepHistory.map((s, i) => (
              <li key={i}>{formatStep(s)}</li>
            ))}
          </ul>
        </div>
      )}

      {challengeMode && steps.length > 0 && currentStep < steps.length && (
        <Challenge currentStep={steps[currentStep]} onGuess={handleGuess} />
      )}

      {feedback && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold', color: feedback.startsWith('✅') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default App;
