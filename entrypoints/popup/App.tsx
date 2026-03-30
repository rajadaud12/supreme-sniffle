import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Play, ScanLine } from 'lucide-react';
import { askOllama } from '../../assets/utils/brain';

type Status = 'idle' | 'scanning' | 'thinking' | 'filling' | 'success' | 'error';

export default function App() {
  const [intent, setIntent] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!intent.trim()) return;
    
    setStatus('scanning');
    setError('');

    try {
      // 1. Send message to content script to scan the form
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab found');

      const fields = await chrome.tabs.sendMessage(tab.id, { action: 'SCAN_FORM' });
      
      if (!fields || fields.length === 0) {
        setStatus('error');
        setError('No form fields detected on this page.');
        return;
      }

      // 2. Ask Deepseek via Ollama
      setStatus('thinking');
      const mapping = await askOllama(fields, intent);

      // 3. Send mapping to content script to fill the form
      setStatus('filling');
      await chrome.tabs.sendMessage(tab.id, { action: 'FILL_FORM', data: mapping });

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <main>
      <header>
        <div className="status-badge">
          {status === 'idle' && <><ScanLine size={12} /> Ready</>}
          {status === 'scanning' && <><div className="loader" /> Scanning DOM...</>}
          {status === 'thinking' && <><div className="loader" /> Deepseek is thinking...</>}
          {status === 'filling' && <><div className="loader" /> Injecting values...</>}
          {status === 'success' && <><CheckCircle2 size={12} color="#10b981" /> Success!</>}
          {status === 'error' && <><AlertCircle size={12} color="#ef4444" /> Error</>}
        </div>
        <h1 className="title">Agentic Solver</h1>
      </header>

      <section className="glass-card">
        <label className="input-group">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-dim)', marginBottom: '4px' }}>
            What should I do?
          </span>
          <textarea
            placeholder="e.g. Fill this job application as a Senior Frontend Engineer with 6 years of experience..."
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            disabled={status !== 'idle' && status !== 'error' && status !== 'success'}
          />
        </label>
      </section>

      <button
        className={`btn-primary ${status !== 'idle' ? 'shimmer' : ''}`}
        onClick={handleAction}
        disabled={!intent.trim() || (status !== 'idle' && status !== 'error' && status !== 'success')}
      >
        {status === 'idle' || status === 'error' || status === 'success' ? (
          <>
            <Play size={18} fill="currentColor" />
            <span>Analyze & Fill</span>
          </>
        ) : (
          <>
            <Loader2 className="loader" size={18} />
            <span>Processing...</span>
          </>
        )}
      </button>

      {error && (
        <div style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginTop: '-8px' }}>
          {error}
        </div>
      )}

      <footer>
        AI-Powered Form Intelligence • Deepseek v3.1
      </footer>
    </main>
  );
}
