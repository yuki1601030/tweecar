export const scenarioTabs = [
  { id: 'A', label: '状況A', startIndex: 0, copy: '高速接近車両を事前回避' },
  { id: 'B', label: '状況B', startIndex: 4, copy: 'ながら運転リスクから距離を取る' },
];

export const scenes = [
  {
    id: 'sceneA1', situation: '状況A', sceneNo: 1, image: `${import.meta.env.BASE_URL}assets/scenes/sceneA1.jpg`, title: '通常走行 / 背後で危険の兆候',
    nav: { aLane: 'fast', a: 45, b: 8, bLane: 'fast', zigzag: true, risk: 'LOW', speed: 'A車 92km/h / B車 遠方', distanceLabel: 'B車は後方数km', distance: 22 },
    ai: ['後方から速度差の大きい車両を検知中'], driver: '後ろの状況はあまり気にしていないな…',
    packets: ['B車 → Cloud：高速走行の兆候 / 車線ふらつき', 'A車AI：後方リスクを低優先で監視中'], internal: ['B車：「かなり速めに走行中」'], actions: ['next'], result: ''
  },
  {
    id: 'sceneA2', situation: '状況A', sceneNo: 2, image: `${import.meta.env.BASE_URL}assets/scenes/sceneA2.jpg`, title: '高速接近 / A車の近くにアラート',
    nav: { aLane: 'fast', a: 48, b: 26, bLane: 'fast', c: 10, zigzag: true, alert: true, risk: 'HIGH', speed: '速度差 大 / 接近中', distanceLabel: 'B車が急接近', distance: 38 },
    ai: ['後方から高速接近する車両があります', '車線変更の可能性が高く、接近速度が大きいです'], driver: 'けっこう速い車が来てるんだな…',
    packets: ['B車 → Cloud：speed=high / zigzag-lane-change', 'C車 → Cloud：急な追い抜きを検知', 'A車AI：通知準備'], internal: ['B車：「うちの運転手は140km/h出してる」', 'C車：「B車、めっちゃ速かった」'], actions: ['prev', 'listen', 'avoid', 'next'], result: ''
  },
  {
    id: 'sceneA3', situation: '状況A', sceneNo: 3, image: `${import.meta.env.BASE_URL}assets/scenes/sceneA3.jpg`, title: 'AI音声で退避を促す', voiceRequired: true,
    voice: '後ろからすっごい速い車が来ますよ。走行車線に避けるといいよ。',
    nav: { aLane: 'fast', a: 50, b: 34, bLane: 'fast', c: 12, zigzag: true, alert: true, arrow: 'left', risk: 'DANGER', speed: '高速接近 / 退避推奨', distanceLabel: 'B車が接近中', distance: 44 },
    ai: ['後ろからすっごい速い車が来ますよ。走行車線に避けるといいよ。'], driver: 'そうなの？危ないから走行車線に避けておくね',
    packets: ['A車AI：voice-alert / safe-lane-recommendation', 'B車 → Cloud：rapid-approach'], internal: ['A車：「B車が近い。安全側に避けたい」'], actions: ['prev', 'listen', 'avoid', 'next'], result: '走行車線に避けると、A車が左車線へ移動します。'
  },
  {
    id: 'sceneA4', situation: '状況A', sceneNo: 4, image: `${import.meta.env.BASE_URL}assets/scenes/sceneA4.jpg`, title: 'B車が通過 / 事前回避で安全確保',
    nav: { aLane: 'cruise', a: 54, b: 76, bLane: 'fast', safe: true, risk: 'SAFE', speed: '安全巡航中', distanceLabel: '高速接近車両は通過', distance: 82 },
    ai: ['高速接近車両は通過しました'], driver: '避けておいてよかった…', resultCards: ['事前回避で安全確保'],
    packets: ['B車 → Cloud：passed / risk-cleared', 'A車AI：avoidance-complete'], internal: ['A車：「事前に避けられてよかった」'], actions: ['prev', 'toB', 'restart'], result: ''
  },
  {
    id: 'sceneB5', situation: '状況B', sceneNo: 5, image: `${import.meta.env.BASE_URL}assets/scenes/sceneB5.jpg`, title: 'F車のながら運転リスクを裏側で検知',
    nav: { aLane: 'cruise', a: 68, e: 40, f: 24, phone: true, risk: 'LOW', speed: 'A車 88km/h / 後方監視', distanceLabel: 'F車は後方', distance: 34 },
    ai: ['後方車両の挙動データを確認中'], driver: '後ろの状況までは見切れていないな…',
    packets: ['F車 → Cloud：driver-distraction signal', 'E車 → Cloud：車間距離が不安定'], internal: ['F車：「ドライバーがスマホを見ている可能性」'], actions: ['prev', 'next'], result: ''
  },
  {
    id: 'sceneB6', situation: '状況B', sceneNo: 6, image: `${import.meta.env.BASE_URL}assets/scenes/sceneB6.jpg`, title: 'F車の危険度が上昇',
    nav: { aLane: 'cruise', a: 66, e: 38, f: 26, phone: true, alert: true, risk: 'HIGH', speed: '注意低下の可能性', distanceLabel: 'F車との距離が近い', distance: 30 },
    ai: ['後方車両に注意が必要です', '運転者の注意低下が検知されている可能性があります'], driver: '追突されるリスクあるやん…',
    packets: ['F車 → Cloud：distraction probability up', 'A車AI：summary-ready / raw-post-hidden'], internal: ['A車：「F車うちの後ろじゃん、追突されるリスクあるやん！」'], actions: ['prev', 'listen', 'distance', 'next'], result: ''
  },
  {
    id: 'sceneB7', situation: '状況B', sceneNo: 7, image: `${import.meta.env.BASE_URL}assets/scenes/sceneB7.jpg`, title: 'AI音声で安全距離を促す', voiceRequired: true,
    voice: '後ろの車の運転手が、スマホを見ながら運転している可能性があります。安全のため、距離を取ってください。',
    nav: { aLane: 'cruise', a: 66, e: 36, f: 27, phone: true, alert: true, arrow: 'right', risk: 'DANGER', speed: 'F車注意 / 距離確保推奨', distanceLabel: 'F車との距離', distance: 36 },
    ai: ['後ろの車の運転手が、スマホを見ながら運転している可能性があります。安全のため、距離を取ってください。'], driver: '危な！一旦距離取っておこうかな',
    packets: ['A車AI：voice-alert / distance-recommendation', 'Cloud → A車AI：masked-risk-summary'], internal: ['A車：「F車と距離を取りたい」'], actions: ['prev', 'listen', 'distance', 'next'], result: '距離を取ると、A車が移動し車間距離メーターが広がります。'
  },
  {
    id: 'sceneB8', situation: '状況B', sceneNo: 8, image: `${import.meta.env.BASE_URL}assets/scenes/sceneB8.jpg`, title: '危険回避完了 / 快適に走行継続',
    nav: { aLane: 'fast', a: 78, e: 36, f: 12, phone: true, safe: true, risk: 'SAFE', speed: '安全な間隔を確保', distanceLabel: 'F車は後方へ離脱', distance: 88 },
    ai: ['必要な情報だけを事前に通知しました'], driver: '注意してくれて助かったよ', resultCards: ['危険回避完了', '安全な間隔を確保', '快適に走行継続'],
    packets: ['A車AI：avoidance-complete / safe-distance-expanded', 'Privacy Guard：personal-data-masked / raw-post-hidden'], internal: ['F車：「ドライバー状態はマスクして共有」'], actions: ['prev', 'toA', 'restart'], result: ''
  },
];
