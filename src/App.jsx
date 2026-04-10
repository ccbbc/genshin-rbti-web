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
    return `后台给出的结论非常坚定：你几乎没有给自己留下任何狡辩空间。`
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
    '这个测试不是在懂你，是在公开处刑你。',
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
  const topTypes = getTopTypes(scores)

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
            <h1>这不是人格测试，这是原神玩家公开处刑器。</h1>
            <p className="intro-lead">
              这版不再温柔分析你，而是专门抓你在树脂、抽卡、深渊、剧情、地图和社区发言里的真实嘴脸。测出来不是“你像什么”，是“你到底丢人在哪儿”。
            </p>

            <div className="intro-grid">
              <article className="mini-panel">
                <strong>这版改了什么</strong>
                <p>
                  题目整体换成了更像中文原神社区真会说出口的话，减少直给自报家门，增加嘴硬、反差、旧伤和自我打脸，尽量让系统像在现场抓包。
                </p>
              </article>
              <article className="mini-panel">
                <strong>为什么更适合传播</strong>
                <p>
                  认同感不够，玩家就只会点头；羞耻感和惊讶感不够，玩家就不会截图。这一版的目标不是“准”，而是“准到你想立刻发给朋友骂系统懂太多”。
                </p>
              </article>
            </div>

            <div className="intro-actions">
              <button type="button" className="primary-btn" onClick={startQuiz}>
                开始接受审问
              </button>
              <span className="subtle-note">36 题，系统中途只插嘴 2 次，但每次都尽量往痛处戳</span>
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
            <p>系统提醒：你每点一次选项，都在给结果页补充新的作案细节。</p>
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
              <h3>为什么上版不够爆</h3>
              <p>
                因为它更像“分类正确”而不是“抓包成功”。玩家认同不等于玩家惊讶，惊讶不够，就不会截图；羞耻感不够，也不会主动发给熟人让大家一起笑。
              </p>
            </article>
            <article className="result-card">
              <h3>这版瞄准的传播点</h3>
              <p>
                题目尽量不让人轻松自报家门，而是通过嘴硬、反差、旧伤和社区黑话把人一步步逼出原形。最理想的效果不是“有点准”，而是“这网页怎么把我偷偷观察过”。
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
