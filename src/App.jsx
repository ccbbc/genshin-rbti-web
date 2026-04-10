import { useState } from 'react'
import './App.css'
import {
  buildQuizQuestions,
  getDynamicTaunt,
  HIDDEN_META,
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

function getLeadingFlag(flags) {
  return [...Object.entries(flags)].sort((a, b) => b[1] - a[1])[0]
}

function buildEvidenceLine(scores) {
  const [first, second] = getTopTypes(scores)
  const gap = scores[first] - scores[second]

  if (gap <= 1) {
    return `你表面是 ${TYPE_META[first].title}，骨子里还混着 ${TYPE_META[second].title} 的病。`
  }

  if (gap >= 4) {
    return '后台给出的结论非常坚定：你几乎没给自己留下狡辩空间。'
  }

  return `你不是轻微倾向，你是真的会在日常里稳定散发 ${TYPE_META[first].title} 的味。`
}

function buildFlagLine(flags) {
  const [flagCode, value] = getLeadingFlag(flags)

  if (!value) {
    return '隐藏病灶暂时不重，但不代表你没有，只代表你这次还算会装。'
  }

  return `后台额外抓到的病灶是 ${HIDDEN_META[flagCode].title}（${value} 级）。这部分比你主人格还像案底。`
}

function buildShareText(result, scores, flags) {
  const topLines = getTopTypes(scores)
    .map((code, index) => `${index + 1}. ${code} ${TYPE_META[code].title} ${scores[code]} 分`)
    .join('\n')

  const hiddenLines = Object.entries(flags)
    .filter(([, value]) => value > 0)
    .map(([code, value]) => `${code}:${value}`)
    .join(' / ')

  return [
    `我在 RBTI 里被判成了 ${result.code} ${result.meta.title}`,
    result.meta.shareLine,
    '',
    `系统锐评：${result.meta.summary}`,
    `抓包证据：${buildEvidenceLine(scores)}`,
    `附加病灶：${buildFlagLine(flags)}`,
    '',
    '后台判我最像这仨：',
    topLines,
    hiddenLines ? `隐藏病灶记录：${hiddenLines}` : null,
    '',
    '这测试不是在懂你，是在公开处刑你。',
  ]
    .filter(Boolean)
    .join('\n')
}

function freshQuizState() {
  return {
    questionIndex: 0,
    quizQuestions: buildQuizQuestions(),
    scores: cloneMap(EMPTY_SCORES),
    flags: cloneMap(EMPTY_FLAGS),
    pickedOptions: {},
    currentTaunt: null,
    result: null,
    copied: false,
  }
}

function App() {
  const [screen, setScreen] = useState('intro')
  const [quizQuestions, setQuizQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [scores, setScores] = useState(cloneMap(EMPTY_SCORES))
  const [flags, setFlags] = useState(cloneMap(EMPTY_FLAGS))
  const [pickedOptions, setPickedOptions] = useState({})
  const [currentTaunt, setCurrentTaunt] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const totalQuestions = quizQuestions.length
  const activeQuestion = quizQuestions[questionIndex]
  const answeredCount = Object.keys(pickedOptions).length
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const topTypes = getTopTypes(scores)

  function resetExperience() {
    setScreen('intro')
    setQuizQuestions([])
    setQuestionIndex(0)
    setScores(cloneMap(EMPTY_SCORES))
    setFlags(cloneMap(EMPTY_FLAGS))
    setPickedOptions({})
    setCurrentTaunt(null)
    setResult(null)
    setCopied(false)
  }

  function startQuiz() {
    const next = freshQuizState()
    setScreen('quiz')
    setQuizQuestions(next.quizQuestions)
    setQuestionIndex(next.questionIndex)
    setScores(next.scores)
    setFlags(next.flags)
    setPickedOptions(next.pickedOptions)
    setCurrentTaunt(next.currentTaunt)
    setResult(next.result)
    setCopied(next.copied)
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
            <h1>这版先往 SBTI 的骨架上收，不再把它做成普通问卷。</h1>
            <p className="intro-lead">
              现在是 24 题、每题 3 个选项，题目更短，方向更明确。它应该更像那种“表面随手三选一，实际后台在悄悄给你往某种丢人类型上靠”的测试，而不是一份很长的原神主题调查表。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>这次改的核心</strong>
                <p>
                  重点不是继续加梗，而是把题型拉回更像 SBTI 的“三选一偏向题”。这样题面会更利落，玩家也更容易凭直觉选，不会老有在填问卷的感觉。
                </p>
              </article>
              <article className="mini-panel">
                <strong>现在的方向</strong>
                <p>
                  原神味还在，但应该更像 SBTI 那种简短、轻巧、选项有偏向性的题。不是靠长篇解释你，而是靠几道题慢慢把你往某种味道上推。
                </p>
              </article>
            </div>

            <div className="intro-actions">
              <button type="button" className="primary-btn" onClick={startQuiz}>
                开始接受审问
              </button>
              <span className="subtle-note">24 题，3 选 1，中途只插嘴 2 次</span>
            </div>
          </div>
        </section>
      )}

      {screen === 'quiz' && activeQuestion && (
        <section className="quiz-screen">
          <header className="topbar">
            <div>
              <p className="eyebrow">RBTI 随机审问版</p>
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
            <p>系统提醒：现在这版不会连着盘问同一类病，但后台会把你的病统一记账。</p>
            <button type="button" className="ghost-btn" onClick={resetExperience}>
              先不测了，我想逃
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
              行，你继续嘴硬
            </button>
          </div>
        </section>
      )}

      {screen === 'result' && result && (
        <section className="result-screen">
          <div className="result-hero">
            <div className="result-card main-result">
              <p className="eyebrow">
                {result.kind === 'hidden' ? '隐藏人格已经接管现场' : '后台最终判词'}
              </p>
              <h2>
                {result.code}
                <span>{result.meta.title}</span>
              </h2>
              <p className="summary-pill">{result.meta.summary}</p>
              <p className="result-body">{result.meta.body}</p>
              <p className="result-body">{result.meta.verdict}</p>
              <blockquote>{result.meta.shareLine}</blockquote>

              <div className="result-actions">
                <button type="button" className="primary-btn" onClick={copyResult}>
                  {copied ? '结果文案已复制' : '复制群聊处刑文案'}
                </button>
                <button type="button" className="ghost-btn" onClick={startQuiz}>
                  再测一次
                </button>
              </div>
            </div>

            <aside className="result-card side-panel">
              <h3>后台抓到的主犯</h3>
              <div className="rank-list">
                {topTypes.map((code, index) => (
                  <div key={code} className="rank-item">
                    <span className="rank-index">{index + 1}</span>
                    <div>
                      <strong>{code}</strong>
                      <p>{TYPE_META[code].title}</p>
                    </div>
                    <span className="rank-score">{scores[code]} 分</span>
                  </div>
                ))}
              </div>

              <h3>系统抓包结论</h3>
              <p>{buildEvidenceLine(scores)}</p>
              <p>{buildFlagLine(flags)}</p>
            </aside>
          </div>

          <div className="result-grid">
            <article className="result-card">
              <h3>这版在改什么</h3>
              <p>
                这次优先修的是题型，不是题量。之前更像“原神问卷”，现在更想往“原神味的 SBTI”上靠，也就是题目更短、选项更有方向、做题更靠直觉。
              </p>
            </article>
            <article className="result-card">
              <h3>接下来还要看什么</h3>
              <p>
                这一版先把骨架掰正，后面最重要的还是两件事：题目是不是像 SBTI 那样轻巧但有梗，以及结果人格能不能像原版那样又损又让人想转发。
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
