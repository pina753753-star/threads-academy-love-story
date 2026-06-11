import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const characters = [
  { id: 'watage', name: 'わたげ', color: '#ffb7d5', profile: '春風みたいにやわらかく、誰かの背中をそっと押してくれる先輩。' },
  { id: 'komorin', name: 'こもりん', color: '#9ad7ff', profile: '図書室の窓際が定位置。静かな言葉で核心を突くミステリアスな同級生。' },
  { id: 'yukke', name: 'ゆっけ', color: '#ffd166', profile: '学食の人気者。冗談で場を明るくしながら、本音はなかなか見せない。' },
  { id: 'yohaku', name: 'よはく', color: '#d7c8ff', profile: '美術室に残る余白を愛する後輩。沈黙の時間にも優しさを宿す。' },
  { id: 'nagi', name: 'なぎ', color: '#8ee6c8', profile: '放課後の中庭で深呼吸している生徒会役員。穏やかな判断力で支えてくれる。' },
  { id: 'ran', name: 'らん', color: '#ff9f80', profile: '陸上部のエース。まっすぐな情熱と少し不器用な照れ笑いが魅力。' },
]

const weeks = [
  {
    id: 1,
    title: '第1週：桜の入学式',
    intro: '桜が散らない不思議な春。転校初日、あなたはThreads学園の門をくぐる。',
    choices: [
      { characterId: 'watage', label: '校門で迷う新入生を一緒に案内する', text: 'わたげが「春は迷ってもいいんだよ」と微笑んだ。', points: 2 },
      { characterId: 'komorin', label: '図書室で古い学園日誌を探す', text: 'こもりんは日誌の余白に残った小さなメモを見つけた。', points: 2 },
      { characterId: 'yukke', label: '学食のおすすめメニューを聞く', text: 'ゆっけの笑い声で緊張がほどけていく。', points: 2 },
    ],
  },
  {
    id: 2,
    title: '第2週：放課後の約束',
    intro: '部活勧誘の声が響く夕方。あなたは誰との時間を選ぶ？',
    choices: [
      { characterId: 'yohaku', label: '美術室で未完成のキャンバスを見る', text: 'よはくは「描かない場所にも気持ちはある」と教えてくれた。', points: 2 },
      { characterId: 'nagi', label: '中庭で生徒会の手伝いをする', text: 'なぎの穏やかな声が、ざわめく心を凪に変えた。', points: 2 },
      { characterId: 'ran', label: 'グラウンドでタイム計測を手伝う', text: 'らんは夕焼けの中で、まっすぐこちらへ走ってきた。', points: 2 },
    ],
  },
  {
    id: 3,
    title: '第3週：Threads祭の準備',
    intro: '学園祭の準備が始まり、クラスのThreadsが色とりどりにつながっていく。',
    choices: [
      { characterId: 'watage', label: '桜飾りのアーチを仕上げる', text: 'わたげは花びらを一枚、あなたの手帳に挟んだ。', points: 2 },
      { characterId: 'yukke', label: '模擬店の試作を一緒に味見する', text: 'ゆっけは照れ隠しみたいに、甘すぎる感想を冗談にした。', points: 2 },
      { characterId: 'nagi', label: '迷子になりそうな準備表を整理する', text: 'なぎは「君がいると、春が整う気がする」と言った。', points: 2 },
    ],
  },
  {
    id: 4,
    title: '最終週：散らない桜の下で',
    intro: '春が終わらない理由を探す最後の週。いちばん向き合いたい相手は誰？',
    choices: characters.map((character) => ({
      characterId: character.id,
      label: `${character.name}に本当の気持ちを伝える`,
      text: `${character.name}は、散らない桜の下であなたの言葉を待っている。`,
      points: 1,
    })),
  },
]

const initialAffection = characters.reduce((score, character) => ({ ...score, [character.id]: 0 }), {})

function App() {
  const [screen, setScreen] = useState('start')
  const [weekIndex, setWeekIndex] = useState(0)
  const [affection, setAffection] = useState(initialAffection)
  const [log, setLog] = useState([])
  const [ending, setEnding] = useState(null)

  const lead = useMemo(() => getLeadCharacter(affection), [affection])
  const currentWeek = weeks[weekIndex]

  const startGame = () => {
    setScreen('week')
    setWeekIndex(0)
    setAffection(initialAffection)
    setLog([])
    setEnding(null)
  }

  const chooseOption = (choice) => {
    const nextAffection = {
      ...affection,
      [choice.characterId]: affection[choice.characterId] + choice.points,
    }
    const chosenCharacter = characters.find((character) => character.id === choice.characterId)
    const nextLog = [
      ...log,
      {
        week: currentWeek.title,
        characterName: chosenCharacter.name,
        text: choice.text,
      },
    ]

    setAffection(nextAffection)
    setLog(nextLog)

    if (weekIndex === weeks.length - 1) {
      setEnding(buildEnding(nextAffection, choice.characterId))
      setScreen('ending')
      return
    }

    setWeekIndex(weekIndex + 1)
    setScreen('week')
  }

  return (
    <main className={`app-shell ${ending?.type === 'bad' ? 'bad-ending-mode' : ''}`}>
      <div className="phone-frame">
        <div className="sakura-layer" aria-hidden="true" />
        {screen === 'start' && <StartScreen onStart={startGame} />}
        {screen === 'week' && (
          <WeekScreen
            affection={affection}
            choices={currentWeek.choices}
            intro={currentWeek.intro}
            lead={lead}
            onChoose={chooseOption}
            title={currentWeek.title}
            weekNumber={weekIndex + 1}
          />
        )}
        {screen === 'ending' && (
          <EndingScreen affection={affection} ending={ending} log={log} onRestart={startGame} />
        )}
      </div>
    </main>
  )
}

function StartScreen({ onStart }) {
  return (
    <section className="screen start-screen">
      <p className="eyebrow">スマホ乙女ゲーム</p>
      <h1>Threads学園 恋物語</h1>
      <p className="subtitle">〜桜の散らない春〜</p>
      <div className="hero-card">
        <CharacterArt character={characters[0]} />
        <p>
          いつまでも桜が散らないThreads学園。6人との出会いを重ね、あなた自身の春の結末を選ぼう。
        </p>
      </div>
      <button className="primary-button" onClick={onStart} type="button">
        はじめから
      </button>
      <p className="hint">画像は後から public/images に追加できます。使用時は /images/ファイル名 で指定します。</p>
    </section>
  )
}

function WeekScreen({ affection, choices, intro, lead, onChoose, title, weekNumber }) {
  return (
    <section className="screen game-screen">
      <header className="top-bar">
        <span>Week {weekNumber}</span>
        <span>注目ルート：{lead.name}</span>
      </header>
      <CharacterArt character={lead} />
      <div className="story-panel">
        <p className="eyebrow">週間選択</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <AffectionMeter affection={affection} />
      <div className="choice-list">
        {choices.map((choice) => {
          const character = characters.find((item) => item.id === choice.characterId)
          return (
            <button className="choice-button" key={`${choice.characterId}-${choice.label}`} onClick={() => onChoose(choice)} type="button">
              <span>{character.name}</span>
              {choice.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function EndingScreen({ affection, ending, log, onRestart }) {
  const character = characters.find((item) => item.id === ending.characterId)

  return (
    <section className="screen ending-screen">
      <p className="eyebrow">{ending.label}</p>
      <h2>{ending.title}</h2>
      <CharacterArt character={character} />
      <p className="ending-copy">{ending.copy}</p>
      <AffectionMeter affection={affection} />
      <details className="memory-log">
        <summary>これまでの思い出</summary>
        {log.map((item) => (
          <p key={`${item.week}-${item.characterName}`}>【{item.week} / {item.characterName}】{item.text}</p>
        ))}
      </details>
      <button className="primary-button" onClick={onRestart} type="button">
        もう一度遊ぶ
      </button>
    </section>
  )
}

function CharacterArt({ character }) {
  const imagePath = character.image ? `/images/${character.image}` : null

  return (
    <div className="character-art" style={{ '--accent': character.color }}>
      {imagePath ? <img alt={character.name} src={imagePath} /> : <span>{character.name}</span>}
    </div>
  )
}

function AffectionMeter({ affection }) {
  return (
    <div className="affection-board" aria-label="攻略対象ごとの好感度">
      {characters.map((character) => (
        <div className="affection-row" key={character.id}>
          <span>{character.name}</span>
          <meter max="7" min="0" value={affection[character.id]} />
          <strong>{affection[character.id]}</strong>
        </div>
      ))}
    </div>
  )
}

function getLeadCharacter(affection) {
  return characters.reduce((lead, character) => {
    if (affection[character.id] > affection[lead.id]) {
      return character
    }
    return lead
  }, characters[0])
}

function buildEnding(affection, finalCharacterId) {
  const finalScore = affection[finalCharacterId]
  const character = characters.find((item) => item.id === finalCharacterId)

  if (finalScore >= 5) {
    return {
      characterId: finalCharacterId,
      type: 'happy',
      label: 'Happy End',
      title: `${character.name}ルート：桜の散らない春`,
      copy: `${character.name}と心を重ねた瞬間、桜は初めて未来へ向かって舞い上がった。ふたりのThreadsは、春の先まで続いていく。`,
    }
  }

  if (finalScore >= 2) {
    return {
      characterId: finalCharacterId,
      type: 'friendship',
      label: 'Friendship End',
      title: `${character.name}ルート：また明日、学園で`,
      copy: `恋には少し届かなかったけれど、${character.name}との絆は確かな居場所になった。明日も同じ桜の下で笑い合える。`,
    }
  }

  return {
    characterId: finalCharacterId,
    type: 'bad',
    label: 'Bad End',
    title: `${character.name}ルート：ほどけたThreads`,
    copy: `言葉にできないまま春は影を落とした。新しい画像は使わず、記憶だけがモノクロの桜として残る。`,
  }
}

createRoot(document.getElementById('root')).render(<App />)
