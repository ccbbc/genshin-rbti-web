import { useState } from 'react'
import './App.css'
import {
  getDynamicTaunt,
  HIDDEN_META,
  QUESTIONS,
  TAUNT_BREAKPOINTS,
  TYPE_META,
  TYPE_ORDER,
} from './data/rbti'

const EMPTY_SCORES = TYPE_ORDER.reduce((acc, code) => {
  acc[code] = 0
  return acc
}, {})

const EMPTY_FLAGS = {
  QIQI: 0,
  RESI: 0,
  PAIM: 0,
  OTTO: 0,
}

const HIDDEN_PRIORITY = [
  { code: 'OTTO', min: 5 },
  { code: 'QIQI', min: 5 },
  { code: 'RESI', min: 5 },
  { code: 'PAIM', min: 4 },
]

function cloneMap(map) {
  return Object.keys(map).reduce((acc, key) => {
    acc[key] = map[key]
    return acc
  }, {})
}

function getTopTypes(scores) {
  return [...TYPE_ORDER]
    .sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a]
      return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b)
    })
    .slice(0, 3)
}

function resolveResult(scores, flags) {
  const hiddenHit = HIDDEN_PRIORITY.find((rule) => flags[rule.code] >= rule.min)
  const topTypes = getTopTypes(scores)

  if (hiddenHit) {
    return {
      kind: 'hidden',
      code: hiddenHit.code,
      meta: HIDDEN_META[hiddenHit.code],
      topTypes,
    }
  }

  const mainCode = topTypes[0]
  return {
    kind: 'main',
    code: mainCode,
    meta: TYPE_META[mainCode],
    topTypes,
  }
}

function buildShareText(result, scores, flags) {
  const topLines = getTopTypes(scores)
    .map((code, index) => `${index + 1}. ${code} ${TYPE_META[code].title} ${scores[code]}分`)
    .join('\n')

  const hiddenLines = Object.entries(flags)
    .filter(([, value]) => value > 0)
    .map(([code, value]) => `${code} ${value}`)
    .join(' / ')

  return [
    `我在 RBTI 里测出来是 ${result.code}（${result.meta.title}）`,
    result.meta.shareLine,
    '',
    `系统判词：${result.meta.summary}`,
    '',
    '后台判你最像这仨：',
    topLines,
    hiddenLines ? '' : null,
    hiddenLines ? `隐藏病灶：${hiddenLines}` : null,
    '',
    'MBTI 过时了，RBTI 来了。',
  ]
    .filter(Boolean)
    .join('\n')
}

function App() {
  const [screen, setScreen] = useState('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [scores, setScores] = useState(cloneMap(EMPTY_SCORES))
  const [flags, setFlags] = useState(cloneMap(EMPTY_FLAGS))
  const [pickedOptions, setPickedOptions] = useState({})
  const [currentTaunt, setCurrentTaunt] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const totalQuestions = QUESTIONS.length
  const activeQuestion = QUESTIONS[questionIndex]
  const answeredCount = Object.keys(pickedOptions).length
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  function resetExperience() {
    setScreen('intro')
    setQuestionIndex(0)
    setScores(cloneMap(EMPTY_SCORES))
    setFlags(cloneMap(EMPTY_FLAGS))
    setPickedOptions({})
    setCurrentTaunt(null)
    setResult(null)
    setCopied(false)
  }

  function startQuiz() {
    setScreen('quiz')
    setQuestionIndex(0)
    setScores(cloneMap(EMPTY_SCORES))
    setFlags(cloneMap(EMPTY_FLAGS))
    setPickedOptions({})
    setCurrentTaunt(null)
    setResult(null)
    setCopied(false)
  }

  function handleOptionSelect(option) {
    const nextScores = cloneMap(scores)
    const nextFlags = cloneMap(flags)

    Object.entries(option.scores || {}).forEach(([code, value]) => {
      nextScores[code] += value
    })

    Object.entries(option.flags || {}).forEach(([code, value]) => {
      nextFlags[code] += value
    })

    const nextPicked = {
      ...pickedOptions,
      [activeQuestion.id]: option.label,
    }

    const nextCount = answeredCount + 1

    setScores(nextScores)
    setFlags(nextFlags)
    setPickedOptions(nextPicked)
    setCopied(false)

    if (nextCount === totalQuestions) {
      setResult(resolveResult(nextScores, nextFlags))
      setScreen('result')
      return
    }

    const tauntStage = TAUNT_BREAKPOINTS.indexOf(nextCount)
    if (tauntStage !== -1) {
      const topType = getTopTypes(nextScores)[0]
      setCurrentTaunt(getDynamicTaunt(tauntStage, topType, nextFlags))
      setQuestionIndex(questionIndex + 1)
      setScreen('taunt')
      return
    }

    setQuestionIndex(questionIndex + 1)
  }

  async function copyResult() {
    if (!result) return

    try {
      await navigator.clipboard.writeText(buildShareText(result, scores, flags))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="app-shell">
      <div className="noise" aria-hidden="true" />

      {screen === 'intro' && (
        <section className="intro-screen">
          <div className="intro-card">
            <p className="eyebrow">提瓦特电子审判处</p>
            <h1>MBTI 过时了，RBTI 来了。</h1>
            <p className="intro-lead">
              这玩意不是心理测试，是把你的原神日常拿出来公开尸检。树脂、原石、深渊、剧诗、开图、嘴硬，都会把你在提瓦特到底是什么成分抖出来。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>先说清楚</strong>
                <p>
                  这版明显更往中文原神社区的整活口吻改了，不走温柔分析路线，走的是“系统一边装正经，一边把你挂出来示众”的路线。
                </p>
              </article>
              <article className="mini-panel">
                <strong>试玩机制</strong>
                <p>
                  当前版本 36 题，中途系统只会嘴你两次，而且会看你实时答题倾向来阴阳你，不再是固定播报。你要是被骂得太准，先别怪网页。
                </p>
              </article>
            </div>

            <div className="intro-actions">
              <button type="button" className="primary-btn" onClick={startQuiz}>
                开始验尸
              </button>
              <span className="subtle-note">预计耗时 8 到 12 分钟</span>
            </div>
          </div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="quiz-screen">
          <header className="topbar">
            <div>
              <p className="eyebrow">RBTI 内测版</p>
              <h2>{activeQuestion.section}</h2>
            </div>
            <div className="progress-meta">
              <span>
                {answeredCount + 1} / {totalQuestions}
              </span>
              <span>{progress}%</span>
            </div>
          </header>

          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          <article className="question-card">
            <div className="question-number">第 {questionIndex + 1} 题</div>
            <h3>{activeQuestion.prompt}</h3>
            <p className="question-hint">{activeQuestion.hint}</p>

            <div className="option-list">
              {activeQuestion.options.map((option, index) => (
                <button
                  key={option.label}
                  type="button"
                  className="option-btn"
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="option-code">{String.fromCharCode(65 + index)}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </article>

          <footer className="quiz-footer">
            <p>系统提醒：每一道选择都会留下案底，你现在嘴硬，结果页会替你结案。</p>
            <button type="button" className="ghost-btn" onClick={resetExperience}>
              不测了，先跑
            </button>
          </footer>
        </section>
      )}

      {screen === 'taunt' && currentTaunt && (
        <section className="taunt-screen">
          <div className="taunt-card">
            <p className="eyebrow">系统插嘴</p>
            <h2>{currentTaunt.title}</h2>
            <p>{currentTaunt.body}</p>
            <button type="button" className="primary-btn" onClick={() => setScreen('quiz')}>
              行，继续骂
            </button>
          </div>
        </section>
      )}

      {screen === 'result' && result && (
        <section className="result-screen">
          <div className="result-hero">
            <div className="result-card main-result">
              <p className="eyebrow">
                {result.kind === 'hidden' ? '隐藏人格接管现场' : '系统最终判词'}
              </p>
              <h2>
                {result.code}
                <span>{result.meta.title}</span>
              </h2>
              <p className="summary-pill">{result.meta.summary}</p>
              <p className="result-body">{result.meta.body}</p>
              <blockquote>{result.meta.shareLine}</blockquote>

              <div className="result-actions">
                <button type="button" className="primary-btn" onClick={copyResult}>
                  {copied ? '结果文案已复制' : '复制结果文案'}
                </button>
                <button type="button" className="ghost-btn" onClick={startQuiz}>
                  再测一次
                </button>
              </div>
            </div>

            <aside className="result-card side-panel">
              <h3>后台判你最像这仨</h3>
              <div className="rank-list">
                {getTopTypes(scores).map((code, index) => (
                  <div key={code} className="rank-item">
                    <span className="rank-index">{index + 1}</span>
                    <div>
                      <strong>{code}</strong>
                      <p>{TYPE_META[code].title}</p>
                    </div>
                    <span className="rank-score">{scores[code]}分</span>
                  </div>
                ))}
              </div>

              <h3>隐藏病灶</h3>
              <div className="flag-grid">
                {Object.entries(flags).map(([code, value]) => (
                  <div key={code} className="flag-item">
                    <span>{code}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="result-grid">
            <article className="result-card">
              <h3>友情提示</h3>
              <p>
                这玩意只适合拿来发群、互损、钓评论，不适合拿去相亲、招人、查成分、判断谁更懂原神，也不适合拿去给自己上价值。
              </p>
            </article>
            <article className="result-card">
              <h3>调研建议</h3>
              <p>
                这版现在最值得看三件事：36 题会不会掉人、中途动态吐槽会不会让人继续点、以及哪种人格最容易被玩家拿去评论区对号入座。
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
