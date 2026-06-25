import { useEffect, useMemo, useState } from 'react';
import { scenarioTabs, scenes } from './data/scenes';

function ScenePanel({ scene, current, setScene }) {
  const [imageFailed, setImageFailed] = useState(false);
  const go = (index) => setScene(Math.max(0, Math.min(scenes.length - 1, index)));

  useEffect(() => {
    setImageFailed(false);
  }, [scene.id, scene.image]);

  return <section className="scene-panel">
    <div className="scene-panel__head">
      <div className="brand"><span>🚙</span><b>TweeCar</b></div>
      <div>
        <p className="eyebrow">シーン説明エリア</p>
        <h1>{scene.group || scene.situation} {scene.label || `シーン${scene.sceneNo}`}</h1>
      </div>
    </div>
    <div className="scene-title-card">
      <p>{scene.title}</p>
      <span>{scene.id}</span>
    </div>
    <div className="scene-photo-wrap" key={scene.id}>
      {!imageFailed && <img
        src={scene.image}
        alt={scene.title}
        className="scene-photo"
        onError={() => {
          console.error('画像読み込み失敗:', scene.image);
          setImageFailed(true);
        }}
      />}
      {imageFailed && <div className="scene-image-debug" role="alert">
        <strong>画像を読み込めません</strong>
        <span>参照パス：{scene.assetPath}</span>
        <small>GitHub上の public/assets/scenes/ のファイル名を確認してください</small>
      </div>}
      <div className="scene-chip">{scene.title}</div>
    </div>
    <div className="scene-controls">
      <button onClick={() => go(current - 1)} disabled={current === 0}>← 前へ</button>
      <button className="primary" onClick={() => go(current + 1)} disabled={current === scenes.length - 1}>次へ →</button>
    </div>
    <div className="scenario-tabs" aria-label="シーン一覧">{scenarioTabs.map(tab => <button key={tab.id} className={(scene.group || scene.situation).endsWith(tab.id) ? 'active' : ''} onClick={() => setScene(tab.startIndex)}><b>{tab.label}</b><span>{tab.copy}</span></button>)}</div>
    <div className="thumb-strip">{scenes.map((item, index) => <button key={item.id} className={`thumb ${index === current ? 'selected' : ''}`} onClick={() => setScene(index)}><img src={item.image} alt={item.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span>{(item.group || item.situation).replace('状況', '')}-{item.sceneNo}</span></button>)}</div>
  </section>;
}

const lanePos = { fast: 29, cruise: 67 };
function MiniCar({ id, lane, top, danger }) {
  if (top == null) return null;
  return <div className={`mini-car ${id.toLowerCase()} ${danger ? 'danger' : ''}`} style={{ left: `${lanePos[lane] ?? lanePos.cruise}%`, top: `${top}%` }}><span>{id}</span></div>;
}

function Wave({ active }) { return <div className={`voice-wave ${active ? 'active' : ''}`}>{Array.from({ length: 16 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * .04}s` }} />)}</div>; }

function NavPanel({ scene, speaking, acted, onSpeak }) {
  const nav = scene.nav || {};
  const aLane = acted && scene.id === 'sceneA3' ? 'cruise' : acted && scene.id === 'sceneB7' ? 'fast' : nav.aLane;
  const distance = acted && scene.id === 'sceneB7' ? 88 : nav.distance;
  return <section className="nav-screen">
    <div className="nav-top"><span>DRIVER NAV</span><em className={(nav.risk || 'LOW').toLowerCase()}>{nav.risk || 'LOW'}</em></div>
    <div className="nav-map">
      <div className="route-line" />
      <div className="lane-mark left" /><div className="lane-mark right" />
      <MiniCar id="A" lane={aLane} top={58} />
      <MiniCar id="B" lane={nav.bLane || 'fast'} top={nav.b ? Math.max(12, 70 - nav.b) : null} danger={nav.alert} />
      <MiniCar id="F" lane="cruise" top={nav.f ? Math.max(16, 80 - nav.f) : null} danger={nav.phone} />
      {nav.alert && <div className="map-alert">⚠ 接近注意</div>}
      {nav.phone && <div className="map-phone">📱</div>}
      {nav.arrow && <div className={`avoid-arrow ${nav.arrow}`}>↗</div>}
    </div>
    <div className="nav-bottom">
      <div><b>{nav.speed}</b><span>{nav.distanceLabel}</span><div className="meter"><i style={{ width: `${distance || 30}%` }} /></div></div>
      <button className="cars-button" onClick={onSpeak} disabled={speaking}><span>CARS</span>{speaking ? '読み上げ中...' : '聞く'}</button>
    </div>
  </section>;
}

function ConversationPanel({ scene, speaking }) {
  const aiLines = Array.isArray(scene.ai) ? scene.ai : [];
  return <aside className="conversation-card">
    <div className="talk-status"><span className={speaking ? 'live' : ''}>●</span>{speaking ? 'AIが音声案内中' : 'AIアシスト待機中'}</div>
    <div className="bubble ai"><b>AI</b><div>{aiLines.map((line, i) => <p key={i}>{line}</p>)}<Wave active={speaking}/></div></div>
    <div className="bubble driver"><b>DRIVER</b><p>{scene.driver}</p></div>
  </aside>;
}

function DriveExperience({ scene, current, setScene }) {
  const [speaking, setSpeaking] = useState(false);
  const [actedId, setActedId] = useState('');
  const [message, setMessage] = useState('');
  const acted = actedId === scene.id;
  const actions = useMemo(() => Array.isArray(scene.actions) ? scene.actions : [], [scene.actions]);
  const go = (n) => { window.speechSynthesis?.cancel(); setSpeaking(false); setMessage(''); setActedId(''); setScene(Math.max(0, Math.min(scenes.length - 1, n))); };
  const speak = () => {
    if (speaking) return;
    const text = scene.voice || (Array.isArray(scene.ai) ? scene.ai.join('。') : '');
    setSpeaking(true); setMessage('');
    if (!('speechSynthesis' in window)) { setSpeaking(false); setMessage('このブラウザでは音声読み上げに対応していません'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; utterance.rate = 0.9; utterance.volume = 1;
    utterance.onend = () => { setSpeaking(false); setMessage('読み上げ完了'); };
    utterance.onerror = () => { setSpeaking(false); setMessage('音声読み上げを完了できませんでした'); };
    window.speechSynthesis.speak(utterance);
  };
  return <section className={`drive-experience ${scene.nav?.risk?.toLowerCase() || 'low'}`}>
    <div className="windshield">
      <div className="road-perspective"><span /><span /></div>
      <div className="dashboard" />
      <div className="steering" />
      <div className="drive-label"><span>運転体験エリア</span><b>A車の運転席</b></div>
      <ConversationPanel scene={scene} speaking={speaking}/>
      {(speaking || scene.nav?.alert) && <div className="attention-card">⚠ {scene.voice || scene.ai?.[0]}</div>}
      <NavPanel scene={scene} speaking={speaking} acted={acted} onSpeak={speak}/>
    </div>
    <div className="drive-actions">
      <button className="cars-action" onClick={speak} disabled={speaking}>🎙️ {speaking ? '読み上げ中...' : 'CARSを聞く'}</button>
      {actions.includes('avoid') && <button onClick={() => { setActedId(scene.id); setMessage('走行車線へ避けました'); }}>回避する</button>}
      {actions.includes('distance') && <button onClick={() => { setActedId(scene.id); setMessage('安全距離を広げました'); }}>距離を取る</button>}
      <button onClick={() => go(current - 1)}>前のシーンへ</button>
      <button onClick={() => go(current + 1)}>次のシーンへ</button>
      <button onClick={() => go(scene.situation === '状況A' ? 0 : 4)}>もう一度体験する</button>
      <span>{message || scene.result}</span>
    </div>
  </section>;
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const safeCurrent = Math.max(0, Math.min(scenes.length - 1, current));
  const scene = scenes[safeCurrent] || scenes[0];
  return <main className="app-shell"><ScenePanel scene={scene} current={safeCurrent} setScene={setCurrent}/><DriveExperience scene={scene} current={safeCurrent} setScene={setCurrent}/></main>;
}
