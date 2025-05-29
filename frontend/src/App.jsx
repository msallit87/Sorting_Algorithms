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
  const [feedback, setFeedback] = useState('');
  const [stepHistory, setStepHistory] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Single base‐URL for both dev and prod:
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  // Validate and parse user input
  const parseInput = () => {
    const parts = array
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
    const nums = parts.map(Number);
    if (parts.length === 0 || nums.some(isNaN)) {
      alert('Please enter a valid comma-separated list of numbers.');
      throw new Error('Invalid input');
    }
    return nums;
  };

  // Stream AI suggestion
  const handleAISuggestion = async () => {
    let parsedArray;
    try {
      parsedArray = parseInput();
    } catch {
      return;
    }
    // Clear out the old sort animation & history:
     setSteps([]);
     setMetrics(null);
     setCurrentArray([]);
     setCurrentStep(0);
     setHighlight([]);
     setStepHistory([]);
     setExplanation('');
     setAiSuggestion('');
     setIsLoadingAI(true);

    try {
      const res = await fetch(`${API_BASE}/ai-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array: parsedArray }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk
            .split('\n')
            .filter(line => line.startsWith('data:'))
            .forEach(line => {
              if (line === 'data: [DONE]') return;
              try {
                const parsed = JSON.parse(line.replace('data: ', ''));
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) setAiSuggestion(prev => prev + delta);
              } catch (e) {
                console.error('Chunk parse err:', e, line);
              }
            });
        }
      }
    } catch (e) {
      console.error('AI error:', e);
      setAiSuggestion('Error fetching suggestion.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Run the sort
  const handleSort = async () => {
    let parsedArray;
    try {
      parsedArray = parseInput();
    } catch {
      return;
    }
    setAiSuggestion('');
    try {
      const { data } = await axios.post(
        `${API_BASE}/sort/${algorithm}`,
        { array: parsedArray }
      );
      setSteps(data.steps);
      setMetrics(data.metrics);
      setCurrentArray(parsedArray);
      setCurrentStep(0);
      setExplanation('');
      setFeedback('');
      setHighlight([]);
      setStepHistory([]);
    } catch (e) {
      console.error('Sort API error:', e);
      setSteps([]);
      setMetrics(null);
      alert('Failed to sort. Check console for details.');
    }
  };

  // Narrative autoplay
  useEffect(() => {
    if (steps.length && currentStep < steps.length && !challengeMode) {
      const t = setTimeout(() => {
        const step = steps[currentStep];
        setExplanation(step.explanation || '');
        if (step.type === 'swap' && step.array) {
          setCurrentArray(step.array);
          setHighlight(step.indices);
        } else if (step.type === 'compare') {
          setHighlight(step.indices || []);
        } else {
          setHighlight([]);
        }
        setStepHistory(h => [...h, step]);
        setCurrentStep(i => i + 1);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [steps, currentStep, challengeMode]);

  const formatStep = step => {
    const [a, b] = step.indices || step.values || [];
    const av = currentArray[a] ?? a;
    const bv = currentArray[b] ?? b;
    switch (step.type) {
      case 'compare':
        return `Compare index ${a} (${av}) vs ${b} (${bv})`;
      case 'swap':
        return `Swap index ${a} (${av}) ↔ ${b} (${bv})`;
      case 'insert':
        return `Insert ${av} at index ${a}`;
      default:
        return step.type;
    }
  };

  const handleGuess = guess => {
    const expected = steps[currentStep];
    const clean = guess.replace(/\s/g, '').toLowerCase();
    const expStr = `${expected.type}[${(expected.indices || expected.values || []).join(',')}]`;
    if (clean === expStr) {
      setFeedback('Correct!');
      setStepHistory(h => [...h, expected]);
      setCurrentStep(i => i + 1);
    } else {
      setFeedback(`Incorrect. Expected: ${expStr}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', margin: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Sorting Visualizer</h1>

      <input
        type="text"
        placeholder="e.g. 5,3,1,4"
        value={array}
        onChange={e => setArray(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />

      <select
        value={algorithm}
        onChange={e => setAlgorithm(e.target.value)}
        style={{ marginLeft: '1rem', padding: '0.5rem' }}
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
          onChange={() => setChallengeMode(m => !m)}
        /> Challenge
      </label>

      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={ttsEnabled}
          onChange={() => setTtsEnabled(t => !t)}
        /> Narrative
      </label>

      <button
        onClick={handleAISuggestion}
        disabled={isLoadingAI}
        style={{
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          opacity: isLoadingAI ? 0.6 : 1,
          cursor: isLoadingAI ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoadingAI ? 'Optimizing…' : 'AI-Suggest Best Sorting Algorithm'}
      </button>

      <button
        onClick={handleSort}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
      >
        Sort
      </button>

      {aiSuggestion && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5' }}>
          <h3>AI-Suggest Best Sorting Algorithm:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{aiSuggestion}</pre>
        </div>
      )}

      {metrics && (
        <div style={{ marginTop: '1rem' }}>
          {metrics.comparisons != null && <p><strong>Comparisons:</strong> {metrics.comparisons}</p>}
          {metrics.swaps != null && <p><strong>Swaps:</strong> {metrics.swaps}</p>}
          {metrics.time != null && <p><strong>Time:</strong> {metrics.time.toFixed(2)} ms</p>}
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
          <h3>Steps</h3>
          <ul>{stepHistory.map((s, i) => <li key={i}>{formatStep(s)}</li>)}</ul>
        </div>
      )}

      {challengeMode && steps.length > 0 && currentStep < steps.length && (
        <Challenge currentStep={steps[currentStep]} onGuess={handleGuess} />
      )}

      {feedback && (
        <div style={{ marginTop: '1rem', color: feedback.startsWith('Correct') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default App;
