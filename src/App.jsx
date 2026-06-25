import { useEffect, useMemo, useState } from 'react'

const aiDeck = [
  { id: 'pa', icon: '🅿️', tone: 'good', title: '刈谷PAは駐車場に余裕', text: '10分先。大型・普通車ともに空き傾向です。', actions: ['立ち寄る', 'スキップ'] },
  { id: 'view', icon: '🌇', tone: 'view', title: '岡崎付近で景色データ増加', text: '左手の夕景が高評価。安全な範囲で表示できます。', actions: ['表示する', '閉じる'] },
  { id: 'danger', icon: '⚠️', tone: 'alert', title: '前方300m、右車線に注意', text: '複数車両の挙動から、ふらつき傾向を検出しました。', actions: ['了解', '詳しく見る'] },
  { id: 'traffic', icon: '↗', tone: 'route', title: 'この先3kmで流れが悪化', text: '中央車線が詰まり始めています。推奨ルートに反映できます。', actions: ['ルート反映', 'あとで'] },
  { id: 'road', icon: '◇', tone: 'alert', title: '路肩に落下物の可能性', text: '画像解析と急ハンドル情報から候補を検出しました。', actions: ['了解', '詳しく見る'] },
]

const shareButtons = [
  ['危険を共有', 'danger'], ['渋滞を共有', 'traffic'], ['景色を共有', 'view'],
  ['休憩情報を共有', 'pa'], ['道路異常を共有', 'road'], ['音声で報告', 'voice'],
]

const future = ['安全支援', '道路管理', '観光', '店舗送客', '保険', '防災']

function App() {
  const [intro, setIntro] = useState(true)
  const [driving, setDriving] = useState(false)
  const [tick, setTick] = useState(0)
  const [step, setStep] = useState(1)
  const [cards, setCards] = useState(aiDeck.slice(0, 2))
  const [route, setRoute] = useState('自宅 → 刈谷PA → 名古屋方面')
  const [toast, setToast] = useState('')
  const [voice, setVoice] = useState(false)
  const [effects, setEffects] = useState({ route: false, pa: false, view: 34, shared: 0 })

  useEffect(() => {
    if (!driving) return undefined
    const id = setInterval(() => setTick((n) => n + 1), 1200)
    return () => clearInterval(id)
  }, [driving])

  useEffect(() => {
    if (!driving) return
    if (tick > 2) { setStep(2); setCards(aiDeck.slice(0, 2)) }
    if (tick > 6) { setStep(3); setCards([aiDeck[2], aiDeck[3], aiDeck[0]]) }
    if (tick > 11) { setStep(4); setCards([aiDeck[2], aiDeck[4], aiDeck[3]]) }
    if (tick > 17) { setStep(5); setCards([aiDeck[4], aiDeck[3], aiDeck[1]]) }
  }, [driving, tick])

  const stats = useMemo(() => ({
    posts: 128 + (tick % 12) * 4 + effects.shared * 9,
    images: 18 + (tick % 5) + Math.floor(effects.view / 20),
    roads: 42 + effects.shared * 2,
    extract: Math.min(7, 3 + Math.floor(tick / 6) + effects.shared),
  }), [tick, effects])

  const beginDrive = () => { setIntro(false); setDriving(true); setStep(2); setTick(1); flash('ドライブを開始しました') }

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const act = (label, id) => {
    if (label === '立ち寄る') { setRoute('自宅 → 刈谷PA立ち寄り → 名古屋方面'); setEffects((e) => ({ ...e, pa: true })); flash('刈谷PA立ち寄りをルートに追加しました') }
    else if (label === 'ルート反映') { setEffects((e) => ({ ...e, route: true })); flash('推奨ルートを強調しました') }
    else if (label === '表示する') { setEffects((e) => ({ ...e, view: e.view + 18 })); flash('景色ハイライトを安全表示しました') }
    else if (label === '詳しく見る') flash('生データではなく、匿名化された根拠だけ表示します')
    else flash(`${label}しました`)
    if (id === 'danger' && label === '了解') setCards((list) => list.filter((card) => card.id !== 'danger'))
  }

  const share = (kind) => {
    if (kind === 'voice') {
      setVoice(true)
      flash('録音中…')
      window.setTimeout(() => {
        setVoice(false)
        setEffects((e) => ({ ...e, shared: e.shared + 1 }))
        setCards((list) => [{ id: 'yourVoice', icon: '🎙️', tone: 'alert', title: '自車の音声報告をAI要約', text: '「前方車両が少しふらついています」として周辺へ共有しました。', actions: ['了解'] }, ...list].slice(0, 4))
        flash('あなたの車が周辺情報を共有しました')
      }, 1800)
      return
    }
    const label = shareButtons.find(([, value]) => value === kind)?.[0] ?? '情報'
    setEffects((e) => ({ ...e, shared: e.shared + 1, view: kind === 'view' ? e.view + 24 : e.view }))
    setCards((list) => [{ id: `shared-${Date.now()}`, icon: '🚗', tone: kind === 'danger' || kind === 'road' ? 'alert' : 'good', title: `${label}を取り込みました`, text: 'あなたの車の匿名データが、周辺AI要約の精度に反映されています。', actions: ['了解'] }, ...list].slice(0, 4))
    flash('あなたの車が周辺情報を共有しました')
  }

  return <main className="cockpit">
    {intro && <section className="intro"><div className="intro-card"><p>STEP 1 / 5</p><h1>CarTweet</h1><h2>車たちが裏側で会話し、<br />あなたには必要な情報だけ届く。</h2><button onClick={beginDrive}>ドライブを開始する</button></div></section>}
    {toast && <div className="toast">{toast}</div>}
    <header className="topbar">
      <div><span>STEP {step} / 5</span><strong>{route}</strong></div>
      <div><span>現在地</span><strong>東名高速 上り / 岡崎付近</strong></div>
      <div><span>時刻</span><strong>{new Date(Date.now() + tick * 60000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</strong></div>
      <div className={driving ? 'status live' : 'status'}>{driving ? '走行中・AI受信中' : '出発前'}</div>
    </header>

    <section className="main-grid">
      <section className="map panel">
        <div className="privacy mini"><b>Privacy Guard</b><span>生会話は非表示</span><span>個人情報は自動マスク</span><span>有益情報だけ要約</span><span>位置は必要範囲で利用</span></div>
        <div className="cloud">CarTweet<br />Cloud</div>
        <div className="road r1"></div><div className="road r2"></div><div className="route-label">刈谷PA方面</div><div className="loc-label">岡崎付近</div>
        <div className={`recommended ${effects.route ? 'on' : ''}`}>推奨ルート</div>
        {['A','B','C','D','E'].map((name, i) => <div key={name} className={`car c${i + 1}`}><span>車両{name}</span><i>signal</i></div>)}
        <div className="mycar"><b>あなたの車</b><small>AI filtering</small></div>
        {Array.from({ length: 18 }).map((_, i) => <i key={i} className={`particle p${i % 6}`} style={{ '--n': i }} />)}
        <div className="raw-note">匿名データのみ流通：data sending / vision data / behavior signal</div>
      </section>

      <aside className="ai panel">
        <div className="ai-head"><span>DRIVER AI SUMMARY</span><b>重要度順</b></div>
        {cards.map((card) => <article className={`ai-card ${card.tone}`} key={card.id}><div className="icon">{card.icon}</div><div className="content"><h3>{card.title}</h3><p>{card.text}</p><div>{card.actions.map((label) => <button key={label} onClick={() => act(label, card.id)}>{label}</button>)}</div></div></article>)}
      </aside>
    </section>

    <section className="bottom panel">
      <div className="stats"><b>周辺車両データ</b><span>投稿処理 {stats.posts}件/分</span><span>画像解析 {stats.images}件</span><span>路面データ {stats.roads}件</span><span>AI抽出 {stats.extract}件</span></div>
      <div className="actions">{shareButtons.map(([label, kind]) => <button className={kind === 'voice' && voice ? 'recording' : ''} onClick={() => share(kind)} key={kind}>{label}</button>)}</div>
    </section>

    {step === 5 && <section className="future panel"><h2>CarTweet Data Cloud</h2>{future.map((item) => <span key={item}>{item}</span>)}<button onClick={() => window.location.reload()}>もう一度体験する</button></section>}
  </main>
}

export default App
