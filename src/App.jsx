import { useMemo, useState } from 'react';
import { scenarioTabs, scenes } from './data/scenes';

function SceneHeader({ scene, current, setScene }) {
  return <section className="scene-stage">
    <div className="stage-topline">
      <div className="logo"><span>🚙</span><b>TweeCar</b></div>
      <div><p className="eyebrow">{scene.situation}・シーン{scene.sceneNo}</p><h1>{scene.title}</h1></div>
      <div className="short-copy">クルマだけが読めるSNS。<br />あなたには、必要な情報だけ届く。</div>
    </div>
    <div className="scenario-tabs">{scenarioTabs.map(tab => <button key={tab.id} className={scene.situation.endsWith(tab.id) ? 'active' : ''} onClick={() => setScene(tab.startIndex)}><b>{tab.label}</b><span>{tab.copy}</span></button>)}</div>
    <SceneImageViewer scene={scene} />
    <div className="thumb-strip">{scenes.map((item, index) => <button key={item.id} className={`thumb ${index === current ? 'selected' : ''}`} onClick={() => setScene(index)}><span>{item.id}</span><img src={item.image} alt={`${item.situation} シーン${item.sceneNo}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><em>{item.situation.replace('状況', '')}-{item.sceneNo}</em></button>)}</div>
  </section>;
}

function SceneImageViewer({ scene }) {
  return <div className="image-viewer" key={scene.id}>
    <img src={scene.image} alt={`${scene.situation} シーン${scene.sceneNo} の状況画像`} onLoad={(e) => e.currentTarget.parentElement?.classList.remove('missing')} onError={(e) => e.currentTarget.parentElement?.classList.add('missing')} />
    <div className="missing-note"><b>{scene.id}.jpg</b><span>public/assets/scenes/ に用意画像を配置すると、ここに大きく表示されます。</span></div>
    <div className="scene-badge">{scene.situation}・Scene {scene.sceneNo}</div>
  </div>;
}

function PrivacyGuard() { return <aside className="privacy-card"><span>🛡️</span><b>Privacy Guard</b><ul><li>生ツイートは非表示</li><li>個人情報は自動マスク</li><li>必要情報だけ要約</li><li>位置情報は安全範囲で利用</li></ul></aside>; }

const lanePos = { fast: 30, cruise: 70 };
function Vehicle({ id, lane, bottom, moved }) { if (bottom == null) return null; return <div className={`vehicle ${id.toLowerCase()} ${moved ? 'moved' : ''}`} style={{ left: `calc(${lanePos[lane] ?? lanePos.cruise}% - 38px)`, bottom: `${bottom}%` }}><span>{id}</span></div>; }

function NavPanel({ scene, acted }) {
  const nav = scene.nav || {};
  const aLane = acted && scene.id === 'sceneA3' ? 'cruise' : acted && scene.id === 'sceneB7' ? 'fast' : nav.aLane;
  const distance = acted && scene.id === 'sceneB7' ? 82 : nav.distance;
  return <section className="nav-panel">
    <div className="panel-head"><span>DRIVER NAV</span><b>高速道路走行中</b><em className={`risk ${(nav.risk || 'low').toLowerCase()}`}>{nav.risk || 'LOW'}</em></div>
    <div className="road-map">
      <div className="lane fast"><span>追越車線</span></div><div className="lane cruise"><span>走行車線</span></div><div className="divider" />
      {nav.arrow && <div className={`lane-arrow ${nav.arrow}`}>{nav.arrow === 'left' ? '↘' : '↙'}</div>}
      {nav.zigzag && <div className="zigzag" style={{ bottom: `${(nav.b || 10) - 4}%` }} />}
      {nav.alert && <div className="proximity-alert">接近アラート</div>}
      <Vehicle id="A" lane={aLane} bottom={nav.a} moved={acted}/><Vehicle id="B" lane={nav.bLane || 'fast'} bottom={nav.b}/><Vehicle id="C" lane="cruise" bottom={nav.c}/><Vehicle id="E" lane="cruise" bottom={nav.e}/><Vehicle id="F" lane="cruise" bottom={nav.f}/>
      {nav.phone && <div className="phone-warning" style={{ bottom: `${(nav.f || 20) + 10}%` }}>📱</div>}
      <div className="hud-card speed"><b>{nav.speed}</b><span>{nav.distanceLabel}</span></div>
      <div className="distance-card"><b>{nav.distanceLabel}</b><div className="meter"><i style={{ width: `${distance}%` }} /></div></div>
    </div>
  </section>;
}

function Wave({ active }) { return <div className={`wave ${active ? 'active' : ''}`}>{Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * .05}s` }} />)}</div>; }
function ConversationPanel({ scene, speaking }) { const aiLines = Array.isArray(scene.ai) ? scene.ai : []; const resultCards = Array.isArray(scene.resultCards) ? scene.resultCards : []; return <section className="conversation-panel"><div className="panel-head"><span>VOICE CONVERSATION</span><b>{speaking ? 'AIが発話中...' : '待機中'}</b></div><div className="bubble ai"><span className="ico">🤖</span><div>{aiLines.map((line, i) => <p key={i}>{line}</p>)}<Wave active={speaking}/></div><span className="speaker">🔊</span></div><div className="bubble driver"><span className="ico">👤</span><div><p>{scene.driver}</p></div></div>{resultCards.length > 0 && <div className="result-cards">{resultCards.map(card => <span key={card}>{card}</span>)}</div>}</section>; }

function InternalData({ scene, behind, setBehind }) { const rows = behind ? scene.internal : scene.packets; const safeRows = Array.isArray(rows) ? rows : []; return <aside className="internal-data"><div className="panel-head"><span>Behind the scenes</span><button onClick={() => setBehind(!behind)} className={behind ? 'on' : ''}>{behind ? <span>👁️</span> : <span>🙈</span>}内部データを見る</button></div><div className="data-list">{safeRows.map((row, i) => <p key={i} className={behind ? 'raw' : ''}>{row}</p>)}</div></aside>; }

function DriveConsole({ scene, current, setScene }) {
  const [speaking, setSpeaking] = useState(false); const [actedId, setActedId] = useState(''); const [behind, setBehind] = useState(false); const [message, setMessage] = useState('');
  const acted = actedId === scene.id;
  const speak = () => { if (speaking) return; const aiLines = Array.isArray(scene.ai) ? scene.ai : []; const text = scene.voice || aiLines.join('。'); setSpeaking(true); setMessage(''); if (!('speechSynthesis' in window)) { setMessage('このブラウザでは音声読み上げに対応していません'); setSpeaking(false); return; } window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = 0.9; utterance.volume = 1; utterance.onend = () => { setSpeaking(false); setMessage('読み上げ完了'); }; utterance.onerror = () => { setSpeaking(false); setMessage('音声読み上げを完了できませんでした'); }; window.speechSynthesis.speak(utterance); };
  const go = (n) => { window.speechSynthesis?.cancel(); setSpeaking(false); setMessage(''); setActedId(''); setScene(Math.max(0, Math.min(scenes.length - 1, n))); };
  const actions = useMemo(() => Array.isArray(scene.actions) ? scene.actions : [], [scene]);
  return <section className="drive-console"><PrivacyGuard/><div className="console-grid"><NavPanel scene={scene} acted={acted}/><ConversationPanel scene={scene} speaking={speaking}/><InternalData scene={scene} behind={behind} setBehind={setBehind}/></div><div className="action-bar"><button onClick={speak} className="warn" disabled={speaking}><span>🎙️</span>{speaking ? '読み上げ中...' : '注意を聞く'}</button>{actions.includes('avoid') && <button className="good" onClick={() => { setActedId(scene.id); setMessage('A車が走行車線へ移動しました'); }}><span>🚙</span>走行車線に避ける</button>}{actions.includes('distance') && <button className="good" onClick={() => { setActedId(scene.id); setMessage('F車との距離を広げました'); }}><span>🚙</span>距離を取る</button>}<button onClick={() => go(current - 1)}>前のシーンへ</button><button className="primary" onClick={() => go(current + 1)}>次のシーンへ</button><button onClick={() => go(0)}>状況Aへ</button><button onClick={() => go(4)}>状況Bへ</button><button onClick={() => go(scene.situation === '状況A' ? 0 : 4)}>もう一度体験する</button><span className="feedback">{message || scene.result}</span></div></section>;
}

export default function App() {
  const [current, setCurrent] = useState(0); const [intro, setIntro] = useState(true); const safeCurrent = Math.max(0, Math.min(scenes.length - 1, current)); const scene = scenes[safeCurrent] || scenes[0];
  if (!scene) {
    return <main className="app app-fallback"><section className="fallback-card"><h1>TweeCar</h1><p>シーンデータを読み込めませんでした。</p></section></main>;
  }
  return <main className="app"><SceneHeader scene={scene} current={safeCurrent} setScene={setCurrent}/><DriveConsole scene={scene} current={safeCurrent} setScene={setCurrent}/>{intro && <div className="intro"><div><h2>TweeCar</h2><p>クルマたちは裏側で情報を共有し、<br/>あなたには必要な情報だけ届きます。</p><button onClick={() => setIntro(false)}>体験を始める</button></div></div>}</main>;
}
