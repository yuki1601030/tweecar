import { useEffect, useMemo, useState } from 'react'

const vehicleSignals = [
  { car: '車A', kind: '状況データ', payload: '0xA7F9 / ENC', rate: '18 pkt/s', x: 34, y: 42, tone: 'traffic' },
  { car: '車B', kind: '画像・位置情報', payload: 'IMG••• GPS≈300m', rate: '12 pkt/s', x: 58, y: 30, tone: 'danger' },
  { car: '車C', kind: '道路状態', payload: 'RDS:MASKED', rate: '9 pkt/s', x: 25, y: 22, tone: 'road' },
  { car: '車D', kind: '挙動データ', payload: 'GYRO••• SPD••', rate: '21 pkt/s', x: 72, y: 55, tone: 'danger' },
  { car: '車E', kind: '写真データ', payload: 'PIX:AI-REDACT', rate: '7 pkt/s', x: 82, y: 38, tone: 'view' },
  { car: '車F', kind: '路面データ', payload: 'µFRIC•••', rate: '11 pkt/s', x: 45, y: 69, tone: 'road' },
  { car: '車G', kind: '混雑データ', payload: 'OCC≈LOW', rate: '14 pkt/s', x: 18, y: 61, tone: 'shop' },
  { car: '車H', kind: '急制動イベント', payload: 'EVT:BRK•••', rate: '16 pkt/s', x: 52, y: 48, tone: 'danger' },
]

const driverSummaries = [
  { type: '危険情報', level: '注意', text: '前方300m、右車線にふらつき傾向の車両があります', source: '周辺車両 3台の挙動データから抽出' },
  { type: '休憩候補', level: '快適', text: 'この先のSAは駐車場に余裕があります', source: '匿名の混雑データをエリア単位で集計' },
  { type: '景色', level: '発見', text: '岡崎付近で夕焼けの投稿が増えています', source: 'AIが個人情報をマスクした写真傾向' },
  { type: '道路状態', level: '注意', text: '路肩に落下物の可能性があります', source: '道路状態データ 42件から候補を検出' },
]

const privacyItems = [
  '生ツイートは人間には非表示',
  '個人情報はAIが自動マスク',
  '自車に有益な情報だけを要約',
  '位置情報は必要範囲に丸めて利用',
]

const counters = [
  ['周辺車両からの投稿', '128件/分'],
  ['写真データ', '18件'],
  ['道路状態データ', '42件'],
  ['AIが運転者向けに抽出した情報', '3件'],
]

function App() {
  const [live, setLive] = useState(false)
  const [pulse, setPulse] = useState(128)
  const [view, setView] = useState('live')

  useEffect(() => {
    if (!live) return undefined
    const id = setInterval(() => setPulse((current) => (current >= 146 ? 121 : current + 3)), 1800)
    return () => clearInterval(id)
  }, [live])

  const dataCounters = useMemo(() => counters.map((counter, index) => (
    index === 0 ? [counter[0], `${pulse}件/分`] : counter
  )), [pulse])

  if (view === 'data') return <DataCloud onBack={() => setView('live')} />

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">PRIVATE CAR-TO-CAR SOCIAL GRAPH</p>
          <h1>CarTweet AI Relay</h1>
          <p>車同士の非公開SNSを、自車AIが運転者向けに安全翻訳する。</p>
        </div>
        <button className={`live-button ${live ? 'is-live' : ''}`} onClick={() => setLive(!live)}>{live ? 'クラウド受信中' : '受信開始'}</button>
      </header>

      <section className="worldview panel">
        <strong>CarTweetは人間向けSNSではありません。</strong>
        <span>車が街や道路を大量に観測し、クラウド上で非公開に投稿。</span>
        <span>人間には生投稿を見せず、自車AIが安全・快適・便利につながる情報だけを要約します。</span>
      </section>

      <section className="workspace">
        <section className="map-panel panel">
          <div className="section-title">
            <h2>車同士の非公開SNSレイヤー</h2>
            <span>東名高速 上り / 岡崎付近</span>
          </div>
          <div className="map-canvas">
            <span className="label label-a">東名高速 上り</span><span className="label label-b">岡崎付近</span><span className="label label-c">刈谷PA方面</span>
            <div className="road highway"></div><div className="road city-road one"></div><div className="road city-road two"></div><div className="river"></div>
            <div className="cloud-node">CarTweet<br />Cloud</div>
            {vehicleSignals.map((signal, index) => <SignalCar key={signal.car} signal={signal} index={index} />)}
            <div className="you-pulse">自車AI</div>
          </div>
          <div className="private-note">生の投稿本文は人間には表示されません。車専用の非公開会話として暗号化・匿名化されます。</div>
        </section>

        <aside className="driver-panel panel">
          <div className="section-title stacked">
            <div><h2>運転者向けAI要約</h2><span>自車に関係ある情報だけを短く表示</span></div>
          </div>
          <div className="summary-list">
            {driverSummaries.map((summary) => <SummaryCard key={summary.text} summary={summary} />)}
          </div>
          <PrivacyGuard />
        </aside>
      </section>

      <section className="metrics panel">
        {dataCounters.map(([label, value]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </section>
      <button className="data-switch" onClick={() => setView('data')}>データ活用を見る →</button>
    </main>
  )
}

function SignalCar({ signal, index }) {
  return <div className={`map-car ${signal.tone}`} style={{ left: `${signal.x}%`, top: `${signal.y}%`, '--delay': `${index * .18}s` }}><div className="signal-line" /><div className="packet"><b>{signal.car} → Cloud</b><span>{signal.kind} 送信</span><code>{signal.payload}</code><small>{signal.rate}</small></div><div className="car-icon">▰</div></div>
}

function SummaryCard({ summary }) {
  return <article className="summary-card"><div><span className="summary-type">{summary.type}</span><b>{summary.level}</b></div><p>{summary.text}</p><small>{summary.source}</small></article>
}

function PrivacyGuard() {
  return <section className="privacy-card"><h3>Privacy Guard</h3>{privacyItems.map((item) => <div key={item}>✓ {item}</div>)}</section>
}

function DataCloud({ onBack }) {
  const data = ['匿名化された車両投稿', 'AIマスク済み写真傾向', '丸めた位置情報', '道路状態/混雑/危険兆候', '地域ごとの移動傾向']
  const services = ['リアルタイム安全支援', '道路管理/自治体向けレポート', '観光スポット発見', '店舗/SA/PA混雑予測', '災害時の現地情報収集']
  return <main className="app-shell data-view"><header className="hero"><div><p className="eyebrow">REAL WORLD DATA PLATFORM</p><h1>CarTweet Data Cloud</h1><p>車同士の非公開SNSが、プライバシー保護されたリアルワールドデータ基盤になる。</p></div><button className="live-button" onClick={onBack}>Liveへ戻る</button></header><section className="cloud-grid"><ListPanel title="蓄積されるデータ" items={data} /><div className="cloud-core panel"><div className="mini-cards"><span>全国の車</span><b>→</b><span>非公開投稿</span></div><div className="ai-orb">AI解析<br /><small>Privacy by Design</small></div><div className="service-rays"><span>安全</span><span>観光</span><span>店舗</span><span>自治体</span><span>防災</span></div></div><ListPanel title="将来広がるサービス" items={services} /></section></main>
}

function ListPanel({ title, items }) { return <section className="panel list-panel"><h2>{title}</h2>{items.map((item) => <div className="list-item" key={item}>{item}</div>)}</section> }

export default App
