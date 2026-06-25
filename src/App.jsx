import { useEffect, useMemo, useState } from 'react'

const categoryMeta = {
  danger: { label: '危険', className: 'danger', button: '危険を投稿' },
  traffic: { label: '渋滞', className: 'traffic', button: '渋滞を投稿' },
  view: { label: '景色', className: 'view', button: '景色を投稿' },
  shop: { label: '店舗', className: 'shop', button: '店舗情報を投稿' },
  road: { label: '道路異常', className: 'road', button: '道路異常を投稿' },
  casual: { label: '日常つぶやき', className: 'casual', button: '何気ないつぶやきを投稿' },
}

const templates = {
  danger: '前方の黒い車、少しふらついてる',
  traffic: 'この先、右車線が詰まり始めてる',
  view: '夕日がきれい。写真撮れた',
  shop: '近くのカフェ、駐車場空いてそう',
  road: '路肩に落下物っぽいものあり',
  casual: '今日はドライブ日和',
}

const initialPosts = [
  { car: '車A', distance: '前方300m', place: '東名高速 上り / 岡崎付近', category: 'traffic', text: '追越車線、少し流れ速いです', photo: false, time: 'たった今', likes: 18, reposts: 5, comments: 3, x: 37, y: 43 },
  { car: '車B', distance: '前方500m', place: '岡崎IC手前', category: 'danger', text: '黒のVOXY、ちょっとふらついてる。スマホ見てる？', photo: false, time: '15秒前', likes: 42, reposts: 16, comments: 9, x: 58, y: 30 },
  { car: '車C', distance: '周辺1.2km', place: '矢作川付近', category: 'view', text: '夕日がきれい。助手席側から写真撮れた', photo: true, time: '30秒前', likes: 76, reposts: 21, comments: 12, x: 23, y: 20 },
  { car: '車D', distance: '前方900m', place: '東名高速 上り', category: 'road', text: '路肩に落下物っぽいものあり', photo: false, time: '45秒前', likes: 55, reposts: 24, comments: 8, x: 70, y: 55 },
  { car: '車E', distance: '周辺2.0km', place: '刈谷PA方面', category: 'shop', text: 'この先のSA、駐車場空いてます', photo: true, time: '1分前', likes: 31, reposts: 7, comments: 5, x: 82, y: 38 },
  { car: '車F', distance: '後方500m', place: '岡崎付近', category: 'road', text: '雨で路面が滑りやすい', photo: false, time: '1分前', likes: 29, reposts: 10, comments: 4, x: 45, y: 69 },
  { car: '車G', distance: '周辺800m', place: '国道1号沿い', category: 'shop', text: '近くのラーメン屋、駐車場空いてそう', photo: false, time: '2分前', likes: 64, reposts: 11, comments: 14, x: 18, y: 61 },
  { car: '車H', distance: '前方250m', place: '東名高速 上り / 右車線', category: 'danger', text: '右車線で急ブレーキあり', photo: false, time: '2分前', likes: 88, reposts: 35, comments: 17, x: 52, y: 48 },
  { car: '車I', distance: '周辺1.5km', place: '岡崎公園方面', category: 'view', text: '桜並木がきれい。写真あり', photo: true, time: '3分前', likes: 103, reposts: 28, comments: 19, x: 30, y: 78 },
  { car: '車J', distance: '前方1.1km', place: '豊田JCT方面', category: 'traffic', text: '工事で左車線が少し狭い', photo: false, time: '3分前', likes: 37, reposts: 12, comments: 6, x: 76, y: 73 },
]

const livePool = [
  ['車K', '刈谷PA方面', 'shop', 'PAのベーカリー、まだ並び少なめ', true],
  ['車L', '東名高速 上り / 岡崎付近', 'casual', '雲の切れ間から光が差してる', false],
  ['車M', '岡崎IC手前', 'traffic', '合流で少しブレーキ多め', false],
  ['車N', '国道248号方面', 'view', '田んぼに夕焼けが反射してる', true],
  ['車O', '豊田JCT方面', 'road', '舗装の継ぎ目で少し跳ねます', false],
  ['車P', '東名高速 上り', 'danger', '車間距離が近い車がいます', false],
]

function makePost(category, isMine = false) {
  const count = Math.floor(Math.random() * 900) + 120
  return {
    car: isMine ? 'あなたの車' : livePool[Math.floor(Math.random() * livePool.length)][0],
    distance: isMine ? '現在地' : `${Math.random() > 0.5 ? '前方' : '周辺'}${count}m`,
    place: isMine ? '東名高速 上り / あなたの現在地' : livePool[Math.floor(Math.random() * livePool.length)][1],
    category,
    text: isMine ? templates[category] : livePool.filter((p) => p[2] === category)[0]?.[3] || templates[category],
    photo: category === 'view' || category === 'shop',
    time: 'たった今',
    likes: Math.floor(Math.random() * 20),
    reposts: Math.floor(Math.random() * 9),
    comments: Math.floor(Math.random() * 6),
    x: isMine ? 50 : Math.floor(Math.random() * 70) + 14,
    y: isMine ? 58 : Math.floor(Math.random() * 60) + 18,
    fresh: true,
  }
}

function App() {
  const [posts, setPosts] = useState(initialPosts)
  const [live, setLive] = useState(false)
  const [view, setView] = useState('live')

  useEffect(() => {
    if (!live) return undefined
    const id = setInterval(() => {
      const sample = livePool[Math.floor(Math.random() * livePool.length)]
      setPosts((current) => [makePost(sample[2]), ...current].slice(0, 16))
    }, 3200)
    return () => clearInterval(id)
  }, [live])

  const mapPosts = useMemo(() => posts.slice(0, 9), [posts])

  const addPost = (category) => setPosts((current) => [makePost(category, true), ...current].slice(0, 16))

  if (view === 'data') return <DataCloud onBack={() => setView('live')} />

  return (
    <main className="app-shell">
      <header className="hero">
        <div><p className="eyebrow">CAR-TO-CAR SOCIAL GRAPH</p><h1>CarTweet Live</h1><p>クルマが見た世界を、リアルタイムにつぶやく。</p></div>
        <button className={`live-button ${live ? 'is-live' : ''}`} onClick={() => setLive(!live)}>{live ? 'ライブ中' : 'ライブ開始'}</button>
      </header>

      <section className="ai-summary">
        <strong>AIリアルタイムまとめ</strong>
        <span>追越車線にふらつき車両の投稿が3件</span><span>岡崎付近で夕焼け写真の投稿が増加</span><span>刈谷PAは駐車場に余裕あり</span><span>この先3km、右車線の流れが悪化傾向</span>
      </section>

      <section className="workspace">
        <section className="map-panel panel">
          <div className="section-title"><h2>ライブマップ</h2><span>東名高速 上り / 岡崎付近</span></div>
          <div className="map-canvas">
            <span className="label label-a">東名高速 上り</span><span className="label label-b">岡崎付近</span><span className="label label-c">刈谷PA方面</span>
            <div className="road highway"></div><div className="road city-road one"></div><div className="road city-road two"></div><div className="river"></div>
            {mapPosts.map((post, index) => <MapCar key={`${post.car}-${post.time}-${index}`} post={post} />)}
            <div className="you-pulse">あなたの車</div>
          </div>
        </section>

        <section className="timeline panel">
          <div className="section-title"><h2>車専用SNSタイムライン</h2><span>{posts.length} live posts</span></div>
          <div className="posts">{posts.map((post, index) => <PostCard key={`${post.car}-${post.text}-${index}`} post={post} />)}</div>
        </section>
      </section>

      <footer className="composer panel">
        <div><strong>自車から投稿</strong><p>ワンタップで「あなたの車」から位置情報つき投稿を追加します。</p></div>
        <div className="compose-buttons">{Object.entries(categoryMeta).map(([key, meta]) => <button key={key} className={meta.className} onClick={() => addPost(key)}>{meta.button}</button>)}</div>
      </footer>
      <button className="data-switch" onClick={() => setView('data')}>データ活用を見る →</button>
    </main>
  )
}

function MapCar({ post }) {
  const meta = categoryMeta[post.category]
  return <div className={`map-car ${meta.className} ${post.car === 'あなたの車' ? 'mine' : ''}`} style={{ left: `${post.x}%`, top: `${post.y}%` }}><div className="bubble">{post.photo && <i />}<b>{meta.label}</b>{post.text}</div><div className="car-icon">▰</div></div>
}

function PostCard({ post }) {
  const meta = categoryMeta[post.category]
  return <article className={`post-card ${post.fresh ? 'fresh' : ''}`}><div className="post-head"><div><strong>{post.car}</strong><small>{post.distance} ・ {post.place}</small></div><span className={`tag ${meta.className}`}>{meta.label}</span></div><p>{post.text}</p>{post.photo && <div className="photo-thumb"><span>PHOTO</span></div>}<div className="reactions"><span>♡ {post.likes}</span><span>↻ {post.reposts}</span><span>💬 {post.comments}</span><time>{post.time}</time></div></article>
}

function DataCloud({ onBack }) {
  const data = ['危険運転', '渋滞の前兆', '道路異常', '景色/観光スポット', '店舗/SA/PA混雑', '駐車場空き状況', '天候/路面状態', '地域ごとの移動傾向']
  const services = ['リアルタイム安全支援', '道路管理/自治体向けレポート', '観光スポット発見', '店舗送客/広告', '保険リスク分析', '災害時の現地情報収集', 'トヨタ車オーナー向け体験提案']
  return <main className="app-shell data-view"><header className="hero"><div><p className="eyebrow">FUTURE DATA PLATFORM</p><h1>CarTweet Data Cloud</h1><p>全国の車のつぶやきが、リアルワールドデータになる。</p></div><button className="live-button" onClick={onBack}>Liveへ戻る</button></header><section className="cloud-grid"><ListPanel title="蓄積されるデータ" items={data} /><div className="cloud-core panel"><div className="mini-cards"><span>全国の車</span><b>→</b><span>位置情報つき投稿</span></div><div className="ai-orb">AI解析<br /><small>CarTweet Cloud</small></div><div className="service-rays"><span>安全</span><span>観光</span><span>店舗</span><span>自治体</span><span>保険</span><span>防災</span></div></div><ListPanel title="将来広がるサービス" items={services} /></section></main>
}

function ListPanel({ title, items }) { return <section className="panel list-panel"><h2>{title}</h2>{items.map((item) => <div className="list-item" key={item}>{item}</div>)}</section> }

export default App
