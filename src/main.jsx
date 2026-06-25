import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css';

function RootFallback({ error }) {
  return (
    <main className="app app-fallback">
      <section className="fallback-card">
        <div className="logo"><span>🚙</span><b>TweeCar</b></div>
        <h1>画面を読み込めませんでした</h1>
        <p>
          React の実行中にエラーが発生しました。GitHub Pages でも白い画面だけにならないよう、
          このフォールバック画面を表示しています。
        </p>
        {error?.message && <pre>{error.message}</pre>}
        <button type="button" onClick={() => window.location.reload()}>再読み込み</button>
      </section>
    </main>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('TweeCar render error', error, info);
  }

  render() {
    if (this.state.error) {
      return <RootFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
} else {
  document.body.innerHTML = '<main class="app app-fallback"><section class="fallback-card"><h1>TweeCar</h1><p>root 要素が見つかりません。</p></section></main>';
}
