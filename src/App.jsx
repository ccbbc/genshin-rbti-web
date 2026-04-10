import { useState } from 'react'
import './App.css'
import {
  HIDDEN_META,
  QUESTIONS,
  TAUNTS,
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
    .map((code, index) => {
      const item = TYPE_META[code]
      return `${index + 1}. ${code} ${item.title} ${scores[code]}分`
    })
    .join('\n')

  const hiddenLines = Object.entries(flags)
    .filter(([, value]) => value > 0)
    .map(([code, value]) => `${code} ${value}`)
    .join(' / ')

  return [
    `我在 RBTI 里测出来是 ${result.code}（${result.meta.title}）`,
    result.meta.shareLine,
    '',
    `系统结论：${result.meta.summary}`,
    '',
    '前三人格倾向：',
    topLines,
    hiddenLines ? '' : null,
    hiddenLines ? `隐藏波动：${hiddenLines}` : null,
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
  const [tauntIndex, setTauntIndex] = useState(0)
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
    setTauntIndex(0)
    setResult(null)
    setCopied(false)
  }

  function startQuiz() {
    setScreen('quiz')
    setQuestionIndex(0)
    setScores(cloneMap(EMPTY_SCORES))
    setFlags(cloneMap(EMPTY_FLAGS))
    setPickedOptions({})
    setTauntIndex(0)
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

    if (nextCount % 6 === 0) {
      setTauntIndex(nextCount / 6 - 1)
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
            <p className="eyebrow">提瓦特人格审判中心</p>
            <h1>MBTI 过时了，RBTI 来了。</h1>
            <p className="intro-lead">
              别装了，你的树脂、原石、深渊和嘴硬程度，早就把你在提瓦特到底是个什么东西供出来了。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>这不是心理测试</strong>
                <p>这是一份原神玩家赛博审判书。系统会根据你的抽卡创伤、树脂焦虑和整活浓度，对你的人格进行不太温柔的归档。</p>
              </article>
              <article className="mini-panel">
                <strong>试玩版说明</strong>
                <p>当前版本共 36 题，每 6 题插播一次系统吐槽。结果仅供娱乐，但如果它骂你骂得太准，也请先别急着怪网页。</p>
              </article>
            </div>

            <div className="intro-actions">
              <button type="button" className="primary-btn" onClick={startQuiz}>
                开始受审
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
              <p className="eyebrow">RBTI Beta</p>
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
            <p>系统提醒：你可以嘴硬，但每一道选择都会留下电子案底。</p>
            <button type="button" className="ghost-btn" onClick={resetExperience}>
              退出重来
            </button>
          </footer>
        </section>
      )}

      {screen === 'taunt' && (
        <section className="taunt-screen">
          <div className="taunt-card">
            <p className="eyebrow">系统插播</p>
            <h2>{TAUNTS[tauntIndex].title}</h2>
            <p>{TAUNTS[tauntIndex].body}</p>
            <button type="button" className="primary-btn" onClick={() => setScreen('quiz')}>
              继续受审
            </button>
          </div>
        </section>
      )}

      {screen === 'result' && result && (
        <section className="result-screen">
          <div className="result-hero">
            <div className="result-card main-result">
              <p className="eyebrow">
                {result.kind === 'hidden' ? '隐藏人格已接管' : '你的主人格'}
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
                  {copied ? '已复制结果文案' : '复制结果文案'}
                </button>
                <button type="button" className="ghost-btn" onClick={startQuiz}>
                  重新受审
                </button>
              </div>
            </div>

            <aside className="result-card side-panel">
              <h3>人格浓度排行榜</h3>
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

              <h3>异常波动</h3>
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
              <h3>系统备注</h3>
              <p>
                本测试仅供娱乐，不适用于择偶、招人、分手、算命、深渊配队仲裁以及任何形式的人生判决。它要是太准，你可以怪自己，不要怪前端。
              </p>
            </article>
            <article className="result-card">
              <h3>试玩建议</h3>
              <p>
                如果你准备拿这版去试水，可以先观察三件事：玩家是否愿意答完 36 题、是否愿意截图结果、以及他们最爱在评论区认领哪种人格。
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
