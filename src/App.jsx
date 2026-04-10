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

const NOTICE_STORAGE_KEY = 'rbti_notice_seen_v1'

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
    return `你表面是 ${TYPE_META[first].title}，骨子里还混着 ${TYPE_META[second].title} 的味。`
  }

  if (gap >= 4) {
    return '后台这次判得很干脆：你几乎没给自己留下狡辩空间。'
  }

  return `你不是轻微倾向，你是平时就稳定散发 ${TYPE_META[first].title} 气质的人。`
}

function buildFlagLine(flags) {
  const [flagCode, value] = getLeadingFlag(flags)

  if (!value) {
    return '隐藏病灶这次不算重，但不代表你没有，只代表你这次装得还行。'
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
  const [noticeOpen, setNoticeOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(NOTICE_STORAGE_KEY)
  })

  const totalQuestions = quizQuestions.length
  const activeQuestion = quizQuestions[questionIndex]
  const answeredCount = Object.keys(pickedOptions).length
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const topTypes = getTopTypes(scores)

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
    setScores(cloneMap(EMPTY_SCORES))
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
            <h1>今日不测强度，不测练度，只测你到底有多丢人。</h1>
            <p className="intro-lead">
              这不是正经人格测试，这是提瓦特玩家电子归档系统。你负责三选一，后台负责把你归到最适合被群友嘲笑的那一类。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>这玩意测什么</strong>
                <p>测你是清体坐牢、卡池上头、深渊记仇，还是表面正常其实随时准备发病。</p>
              </article>
              <article className="mini-panel">
                <strong>怎么判</strong>
                <p>24 题，3 选 1，中途系统只插嘴两次。你负责点，后台负责记仇和归类。</p>
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
                <h2>这版又动了哪些地方</h2>
                <div className="notice-list">
                  <p>题型已经收回到更像 `SBTI` 的骨架：24 题、每题 3 个选项，不再往长问卷那个方向跑偏。</p>
                  <p>首页标语改成更整活的版本，不再把改版说明直接糊在玩家脸上。</p>
                  <p>题目方向现在更偏“轻巧三选一”，目标是让你凭直觉点，不要再像在做调查表。</p>
                  <p>中途吐槽依然保留 2 次，后台还是会根据你的实时倾向阴阳你。</p>
                  <p>接下来重点继续盯两件事：题目有没有 `SBTI` 那种轻但损的味，以及结果够不够让人想截图转发。</p>
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
            <p>系统提醒：你现在每点一下，后台都在给你补一条案底。</p>
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
              <h3>友情提示</h3>
              <p>这玩意适合发群、互损、对号入座，不适合拿去找工作、相亲和证明自己人格高贵。</p>
            </article>
            <article className="result-card">
              <h3>继续折腾</h3>
              <p>如果这次测得不服，可以再来一轮。后台不会道歉，但很欢迎你继续送素材。</p>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
