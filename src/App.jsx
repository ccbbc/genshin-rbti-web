import { useState } from 'react'
import './App.css'
import {
  buildQuizQuestions,
  deriveTypeScores,
  DIMENSION_META,
  DIMENSION_ORDER,
  getDimensionLevels,
  getDynamicTaunt,
  HIDDEN_META,
  TAUNT_BREAKPOINTS,
  TYPE_META,
  TYPE_ORDER,
} from './data/rbti'

const EMPTY_TYPE_SCORES = TYPE_ORDER.reduce((acc, code) => {
  acc[code] = 0
  return acc
}, {})

const EMPTY_DIMENSION_TOTALS = DIMENSION_ORDER.reduce((acc, code) => {
  acc[code] = 0
  return acc
}, {})

const EMPTY_DIMENSION_COUNTS = DIMENSION_ORDER.reduce((acc, code) => {
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

const NOTICE_STORAGE_KEY = 'rbti_notice_seen_v2'

function cloneMap(map) {
  return Object.keys(map).reduce((acc, key) => {
    acc[key] = map[key]
    return acc
  }, {})
}

function getTopTypes(typeScores) {
  return [...TYPE_ORDER]
    .sort((a, b) => {
      if (typeScores[b] !== typeScores[a]) return typeScores[b] - typeScores[a]
      return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b)
    })
    .slice(0, 3)
}

function resolveResult(typeScores, flags) {
  const hiddenHit = HIDDEN_PRIORITY.find((rule) => flags[rule.code] >= rule.min)
  const topTypes = getTopTypes(typeScores)

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

function buildEvidenceLine(typeScores) {
  const [first, second] = getTopTypes(typeScores)
  const gap = typeScores[first] - typeScores[second]

  if (gap <= 4) {
    return `你表面是 ${TYPE_META[first].title}，但身上还混着不少 ${TYPE_META[second].title} 的味。`
  }

  if (gap >= 16) {
    return '后台这次判得很干脆：你几乎没给自己留下狡辩空间。'
  }

  return `你不是轻微偏向，你平时就很容易散发 ${TYPE_META[first].title} 的气质。`
}

function buildFlagLine(flags) {
  const [flagCode, value] = getLeadingFlag(flags)

  if (!value) {
    return '隐藏病灶这次不算重，但不代表没有，只代表你这次装得还行。'
  }

  return `后台额外抓到的病灶是 ${HIDDEN_META[flagCode].title}（${value}级）。这部分比你主人格还像案底。`
}

function buildDimensionSummary(dimensionTotals, dimensionCounts) {
  const levels = getDimensionLevels(dimensionTotals, dimensionCounts)

  return DIMENSION_ORDER.map((code) => {
    const meta = DIMENSION_META[code]
    const level = levels[code]
    const label = level === 'L' ? meta.low : level === 'H' ? meta.high : meta.mid
    return `${meta.label}：${label}`
  }).join(' / ')
}

function getDimensionLevelLabel(meta, level) {
  if (level === 'L') return meta.low
  if (level === 'H') return meta.high
  return meta.mid
}

function buildShareText(result, typeScores, flags, dimensionTotals, dimensionCounts) {
  const topLines = getTopTypes(typeScores)
    .map((code, index) => `${index + 1}. ${code} ${TYPE_META[code].title} ${typeScores[code]}%`)
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
    `抓包证据：${buildEvidenceLine(typeScores)}`,
    `附加病灶：${buildFlagLine(flags)}`,
    `维度截图：${buildDimensionSummary(dimensionTotals, dimensionCounts)}`,
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
    typeScores: cloneMap(EMPTY_TYPE_SCORES),
    dimensionTotals: cloneMap(EMPTY_DIMENSION_TOTALS),
    dimensionCounts: cloneMap(EMPTY_DIMENSION_COUNTS),
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
  const [typeScores, setTypeScores] = useState(cloneMap(EMPTY_TYPE_SCORES))
  const [dimensionTotals, setDimensionTotals] = useState(cloneMap(EMPTY_DIMENSION_TOTALS))
  const [dimensionCounts, setDimensionCounts] = useState(cloneMap(EMPTY_DIMENSION_COUNTS))
  const [flags, setFlags] = useState(cloneMap(EMPTY_FLAGS))
  const [pickedOptions, setPickedOptions] = useState({})
  const [currentTaunt, setCurrentTaunt] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(NOTICE_STORAGE_KEY)
  })

  const totalQuestions = quizQuestions.length
  const activeQuestion = quizQuestions[questionIndex]
  const answeredCount = Object.keys(pickedOptions).length
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const topTypes = getTopTypes(typeScores)
  const dimensionLevels = getDimensionLevels(dimensionTotals, dimensionCounts)

  function closeNotice() {
    setNoticeOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(NOTICE_STORAGE_KEY, '1')
    }
  }

  function resetExperience() {
    setScreen('intro')
    setQuizQuestions([])
    setQuestionIndex(0)
    setTypeScores(cloneMap(EMPTY_TYPE_SCORES))
    setDimensionTotals(cloneMap(EMPTY_DIMENSION_TOTALS))
    setDimensionCounts(cloneMap(EMPTY_DIMENSION_COUNTS))
    setFlags(cloneMap(EMPTY_FLAGS))
    setPickedOptions({})
    setCurrentTaunt(null)
    setResult(null)
    setCopied(false)
  }

  function startQuiz() {
    const next = freshQuizState()
    closeNotice()
    setScreen('quiz')
    setQuizQuestions(next.quizQuestions)
    setQuestionIndex(next.questionIndex)
    setTypeScores(next.typeScores)
    setDimensionTotals(next.dimensionTotals)
    setDimensionCounts(next.dimensionCounts)
    setFlags(next.flags)
    setPickedOptions(next.pickedOptions)
    setCurrentTaunt(next.currentTaunt)
    setResult(next.result)
    setCopied(next.copied)
  }

  function handleOptionSelect(option) {
    const nextTotals = cloneMap(dimensionTotals)
    const nextCounts = cloneMap(dimensionCounts)
    const nextFlags = cloneMap(flags)

    nextTotals[activeQuestion.dimension] += option.value
    nextCounts[activeQuestion.dimension] += 1

    Object.entries(option.flags || {}).forEach(([code, value]) => {
      nextFlags[code] += value
    })

    const nextTypeScores = deriveTypeScores(nextTotals, nextCounts)
    const nextPicked = {
      ...pickedOptions,
      [activeQuestion.id]: option.label,
    }

    const nextCount = answeredCount + 1

    setDimensionTotals(nextTotals)
    setDimensionCounts(nextCounts)
    setTypeScores(nextTypeScores)
    setFlags(nextFlags)
    setPickedOptions(nextPicked)
    setCopied(false)

    if (nextCount === totalQuestions) {
      setResult(resolveResult(nextTypeScores, nextFlags))
      setScreen('result')
      return
    }

    const tauntStage = TAUNT_BREAKPOINTS.indexOf(nextCount)
    if (tauntStage !== -1) {
      const topType = getTopTypes(nextTypeScores)[0]
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
      await navigator.clipboard.writeText(
        buildShareText(result, typeScores, flags, dimensionTotals, dimensionCounts),
      )
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
            <h1>今日不测练度，不测欧气，只测你在提瓦特到底是什么味。</h1>
            <p className="intro-lead">
              这是一个专门给原神玩家做身份归档的小网页。你负责凭直觉三选一，后台负责把你归到最适合被群友认领和调侃的那一类。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>这玩意测什么</strong>
                <p>测你是爱清体、爱上头、爱较真、爱截图，还是表面正常其实一进提瓦特就容易开始发病。</p>
              </article>
              <article className="mini-panel">
                <strong>怎么玩</strong>
                <p>24题，3选1，中途系统只插嘴两次。你负责点，后台负责偷偷记账，最后再给你判个像样的身份。</p>
              </article>
            </div>

            <div className="intro-actions">
              <button type="button" className="primary-btn" onClick={startQuiz}>
                开始接受审问
              </button>
              <button type="button" className="ghost-btn" onClick={() => setNoticeOpen(true)}>
                查看公告
              </button>
              <span className="subtle-note">温馨提示：嘴硬不会减刑，只会增加节目效果</span>
            </div>
          </div>

          {noticeOpen && (
            <div
              className="notice-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="更新公告"
              onClick={closeNotice}
            >
              <div className="notice-card" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="notice-close" onClick={closeNotice} aria-label="关闭公告">
                  ×
                </button>
                <p className="eyebrow">更新公告</p>
                <h2>这版重做了什么</h2>
                <div className="notice-list">
                  <p>题型已经整体换成 `SBTI` 风格：24题、每题3选1，不再往长问卷方向乱长。</p>
                  <p>后台现在不再直接按“地图党/剧情党”给你贴标签，而是先累计 8 个隐藏维度，再去匹配人格模板。</p>
                  <p>人格结果也改成更像“可认领身份梗”的写法，目标是让你测完更想截图，而不是只觉得“有点准”。</p>
                  <p>结果页现在会把 8 个维度单独展开，给出一段相对正经的人格分析，不再只是被骂完就结束。</p>
                  <p>中途吐槽依旧保留 2 次，但会根据你当前最像的人格和隐藏病灶来阴阳你。</p>
                  <p>接下来继续要盯的重点，是把每个人格写得更像真正会被网友认领和传播的身份标签。</p>
                </div>
                <div className="notice-actions">
                  <button type="button" className="primary-btn" onClick={closeNotice}>
                    行，我知道了
                  </button>
                  <button type="button" className="ghost-btn" onClick={startQuiz}>
                    直接开测
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {screen === 'quiz' && activeQuestion && (
        <section className="quiz-screen">
          <header className="topbar">
            <div>
              <p className="eyebrow">RBTI 审问现场</p>
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
            <p>系统提醒：你以为自己在选选项，后台其实在偷偷给你算人格模板相似度。</p>
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
                    <span className="rank-score">{typeScores[code]}%</span>
                  </div>
                ))}
              </div>

              <h3>八维落点</h3>
              <div className="flag-grid">
                {DIMENSION_ORDER.map((code) => (
                  <div key={code} className="flag-item">
                    <span>{DIMENSION_META[code].label}</span>
                    <strong>{dimensionLevels[code]}</strong>
                  </div>
                ))}
              </div>

              <h3>系统抓包结论</h3>
              <p>{buildEvidenceLine(typeScores)}</p>
              <p>{buildFlagLine(flags)}</p>
            </aside>
          </div>

          <div className="result-grid dimension-grid">
            {DIMENSION_ORDER.map((code) => {
              const meta = DIMENSION_META[code]
              const level = dimensionLevels[code]
              return (
                <article key={code} className="result-card dimension-card">
                  <div className="dimension-head">
                    <span className="dimension-code">{code}</span>
                    <div>
                      <h3>{meta.label}</h3>
                      <p className="dimension-label">{getDimensionLevelLabel(meta, level)}</p>
                    </div>
                    <strong className="dimension-level">{level}</strong>
                  </div>
                  <p>{meta.analysis[level]}</p>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
