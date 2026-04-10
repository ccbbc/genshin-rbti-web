export const TYPE_ORDER = [
  'FARM',
  'ABYS',
  'PULL',
  'LORE',
  'MAPR',
  'POTR',
  'COOP',
  'SNAP',
  'XPRS',
  'SAVE',
  'DAIL',
  'CHAO',
]

export const DIMENSION_ORDER = ['RE', 'GA', 'PR', 'LO', 'EX', 'SO', 'XP', 'CH']

export const DIMENSION_META = {
  RE: {
    label: '树脂纪律',
    low: '随缘活着',
    mid: '看情况清',
    high: '体力守门员',
    analysis: {
      L: '对体力这事比较随缘，不太会长期被“别溢出”绑架。',
      M: '对日常流程有基本管理，通常不会太松，也不会太紧。',
      H: '对体力和日常刷新很敏感，账号状态基本都在心里有数。',
    },
  },
  GA: {
    label: '卡池冲动',
    low: '相当克制',
    mid: '偶尔上头',
    high: '按钮磁铁',
    analysis: {
      L: '抽卡前相对克制，不太会被一时情绪直接推着走。',
      M: '会心动，也会犹豫，大多数时候还能给自己留一点缓冲。',
      H: '对卡池反应很快，往往脑子还在想，手已经准备点了。',
    },
  },
  PR: {
    label: '强度执念',
    low: '能玩就行',
    mid: '看情况卷',
    high: '少一星难眠',
    analysis: {
      L: '对练度和结果要求偏宽，能顺手玩下去就已经够了。',
      M: '会在意环境和配装，但通常还能把自己从焦虑里拉出来。',
      H: '很难接受“差一点”，强度对你来说不只是效率问题。',
    },
  },
  LO: {
    label: '设定投入',
    low: '能跳就跳',
    mid: '主线认真',
    high: '文本洁癖',
    analysis: {
      L: '对文本投入偏低，更在意流程顺不顺，不太爱在设定里停太久。',
      M: '主线和关键设定会认真看，但不会什么都抠得很细。',
      H: '对设定连续性和文本细节很敏感，听到聊歪会明显难受。',
    },
  },
  EX: {
    label: '探索执念',
    low: '差不多就行',
    mid: '有空会清',
    high: '99% 不算人',
    analysis: {
      L: '对探索完成度要求不高，差一点通常也不会太放在心上。',
      M: '会想补地图，但大多时候还能接受先留着。',
      H: '很难忍受“差一点”，探索在你这里通常要有个干净结果。',
    },
  },
  SO: {
    label: '联机热心',
    low: '单机安静',
    mid: '看熟不熟',
    high: '世界售后',
    analysis: {
      L: '更习惯一个人处理内容，联机不是刚需。',
      M: '对联机持开放态度，但会看人和场合，不会谁都接。',
      H: '对别人的求助反应很快，很容易自然接过“那我来吧”这个位置。',
    },
  },
  XP: {
    label: 'XP浓度',
    low: '比较理性',
    mid: '偶尔为爱',
    high: '顺眼就冲',
    analysis: {
      L: '对角色判断偏实际，通常会先想值不值，再想喜不喜欢。',
      M: '会在理性和偏爱之间来回权衡，两边都不是完全压倒性的。',
      H: '对角色的喜欢优先级很高，很多时候“顺眼”就已经足够。',
    },
  },
  CH: {
    label: '抽象指数',
    low: '比较正常',
    mid: '偶尔犯病',
    high: '自带节目',
    analysis: {
      L: '整体偏稳，不太主动制造节目效果。',
      M: '平时看着正常，但状态一上来就容易开始整点怪的。',
      H: '抽象和整活气质很明显，很多场合到你这儿都会自己长出节目效果。',
    },
  },
}

export const TYPE_META = {
  FARM: {
    title: '清体苦修人',
    summary: '你不是在玩原神，你是在按时给树脂上香。',
    body: '你对账号最大的责任感，不是来自角色厨力，也不是来自深渊压力，而是来自“体力别白给”。你嘴上说只是顺手上线，后台看到的是一位长期履职的提瓦特值班人员。',
    verdict: '系统备注：树脂一满，你心里就像水壶烧开。',
    shareLine: '我测出来是清体苦修人，后台说我和树脂已经建立长期稳定关系。',
  },
  ABYS: {
    title: '满星索命鬼',
    summary: '少一颗星对别人叫失误，对你叫今晚白活。',
    body: '你对强度和配装的关注，不是爱好，是生存本能。你未必天天打深渊，但只要差一点，你就会自动进入复盘、对轴、怪自己、再来一把的循环。',
    verdict: '系统备注：你可能不爱奖励，但你很恨“差一点”。',
    shareLine: '我测出来是满星索命鬼，系统说我玩深渊主要是为了跟自己算账。',
  },
  PULL: {
    title: '卡池渡劫人',
    summary: '你抽的不是卡，是一口一口咽下去的命。',
    body: '你最擅长的不是规划，而是在“这次真的随缘”和“再来十发试试”之间横跳。卡池对你来说像情绪摇号机，痛也是真的，忍不住也是真的。',
    verdict: '系统备注：你嘴上说看情况，手已经把祈愿页点开了。',
    shareLine: '我测出来是卡池渡劫人，后台说我活得像一份祈愿记录。',
  },
  LORE: {
    title: '提瓦特判官',
    summary: '别人过剧情，你在给提瓦特做案情复盘。',
    body: '你不一定每段都看得泪流满面，但你很难接受别人跳过以后还理直气壮地乱聊设定。你对文本的态度不是“爱看”，而是“别乱讲”。',
    verdict: '系统备注：你最容易在一句设定聊歪里原地升堂。',
    shareLine: '我测出来是提瓦特判官，系统说我不是剧情党，我是设定纠察队。',
  },
  MAPR: {
    title: '百分比猎犬',
    summary: '地图差 1%，你心里就会一直差那 1%。',
    body: '你对世界探索的爱，往往表现为见不得任何遗漏。别人看风景，你看残缺；别人说先放着，你说不行。100% 对你来说不是数字，是气终于顺了。',
    verdict: '系统备注：你最擅长和最后一个神瞳对峙。',
    shareLine: '我测出来是百分比猎犬，后台说我看到 99% 就像看到旧仇还活着。',
  },
  POTR: {
    title: '壶区开发商',
    summary: '别人住壶，你在提瓦特搞地产项目。',
    body: '你不一定天天在壶里蹲着，但只要认真摆起来，就会自动进入细节模式。别人放家具，你在调动线、空位、角度和气氛，像一个嘴上说随便、手上完全不随便的人。',
    verdict: '系统备注：你装修时的认真程度，经常超过打本。',
    shareLine: '我测出来是壶区开发商，系统说我在原神最稳定的输出叫施工。',
  },
  COOP: {
    title: '世界售后员',
    summary: '别人申请进世界像串门，你进别人世界像出警。',
    body: '你看到“救一下”“有人吗”“带带我”这种话，很难做到彻底无视。你未必是最强的，但你很容易变成那个会说“来，我帮你”的人。',
    verdict: '系统备注：你在联机里有点服务行业天赋。',
    shareLine: '我测出来是世界售后员，后台说我最大的毛病是见不得别人一个人受苦。',
  },
  SNAP: {
    title: '出片仙人',
    summary: '你对角色的爱，至少有一半得通过截图落地。',
    body: '你玩着玩着就会开始找机位、看天气、挑角度。别人抽到角色先问强不强，你先想今天这套光好不好。你不是不在乎数值，你只是更在乎那张图发出去够不够杀。',
    verdict: '系统备注：你最强的配队可能是角色、机位和顺光。',
    shareLine: '我测出来是出片仙人，系统说我最后多半会在提瓦特搞摄影棚。',
  },
  XPRS: {
    title: 'XP护法',
    summary: '版本会过去，但你喜欢的人得先接回家。',
    body: '你对角色的核心判断标准，不是榜单，不是风评，也不是别人替你算的性价比。你当然知道环境会变，但你更知道自己喜欢什么。',
    verdict: '系统备注：你的道理通常排在“我喜欢”后面。',
    shareLine: '我测出来是XP护法，后台说我抽卡的底层逻辑叫顺眼最重要。',
  },
  SAVE: {
    title: '原石铁算盘',
    summary: '你最大的能力不是忍，是把冲动算出一张表。',
    body: '你看原石像看存款，看卡池像看预算。别人是一时上头，你是先算版本、算保底、算未来安排，再决定今天能不能冲动。',
    verdict: '系统备注：你的欲望也得先过审批。',
    shareLine: '我测出来是原石铁算盘，系统说我抽卡前得先开一场财务会。',
  },
  DAIL: {
    title: '委托打卡机',
    summary: '你把原神玩成了一套稳定运行的生活插件。',
    body: '你未必最疯，也未必最爱，但你最稳。委托、活动、体力、下线，这一整套流程在你这里像到点自动执行。别人靠激情上线，你靠习惯续命。',
    verdict: '系统备注：你不是在冒险，你是在按时打卡。',
    shareLine: '我测出来是委托打卡机，后台说我账号活得像一张排班表。',
  },
  CHAO: {
    title: '发病艺术家',
    summary: '你上线不一定为了通关，但一定不想白来。',
    body: '你对正常玩法没有敌意，但你对抽象玩法有天然亲近。别人问这样能不能玩，你问这样会不会更有节目。你身上那点乐子人气质，基本藏不住。',
    verdict: '系统备注：你不是偶尔发病，你是病好了也会整两下。',
    shareLine: '我测出来是发病艺术家，系统说提瓦特不是我家，是我的节目现场。',
  },
}

export const HIDDEN_META = {
  QIQI: {
    title: '歪池冤魂',
    summary: '你可能早就不提了，但常驻的伤一直在。',
    body: '你对卡池最深的记忆，不一定是出金，而是那种“怎么又来一次”的熟悉空白。你嘴上说都过去了，真聊到歪池的时候还是会自动返场。',
    verdict: '系统备注：这不是抽卡经历，这是旧伤回访。',
    shareLine: '我测出了隐藏人格歪池冤魂，系统说我已经把常驻创伤养成生活习惯了。',
  },
  RESI: {
    title: '树脂蒸发仙人',
    summary: '别人清体靠自觉，你清体靠缘分。',
    body: '你不是故意摆烂，你只是对“该上线了”这件事长期保持松弛。树脂满、周本拖、活动忘，在你这里都属于正常人生波动。',
    verdict: '系统备注：你不是佛，你是懒得装佛。',
    shareLine: '我测出了隐藏人格树脂蒸发仙人，后台说我和体力的关系主打一个各过各的。',
  },
  PAIM: {
    title: '派蒙本蒙',
    summary: '系统想读懂你，你先把系统吵烦了。',
    body: '你会选最偏的答案，说最怪的话，让一本正经的测试很难按原计划进行。你不一定最稳定，但你很容易把场面变得有节目。',
    verdict: '系统备注：你不是被测试的对象，你是测试里的变量。',
    shareLine: '我测出了隐藏人格派蒙本蒙，系统说它差点被我答题风格烦死。',
  },
  OTTO: {
    title: '词条受害者',
    summary: '你和双爆的关系，通常止步于“看起来挺好”。',
    body: '你见过太多很有希望的胚子最后长歪，也经历过太多“这件有了吧”然后当场破灭的夜晚。久而久之，你已经很难相信好运会真的落到自己头上。',
    verdict: '系统备注：副词条对你造成的是慢性精神工伤。',
    shareLine: '我测出了隐藏人格词条受害者，后台说我刷本已经不是养号，是还债。',
  },
}

export const TAUNT_BREAKPOINTS = [8, 16]

const TYPE_TAUNTS = {
  FARM: [
    { title: '后台已经闻到清体味了', body: '你这一路答下来，明显属于“可以嘴硬，但最好别溢出”的那种人。' },
    { title: '系统确认你和树脂关系稳定', body: '都到这了，你还藏不住那股“今天不清一下心里不舒服”的味。' },
  ],
  ABYS: [
    { title: '后台检测到满星执念', body: '你前面的选择已经透着一股“差一点也不行”的气。' },
    { title: '系统确认你很会和自己较劲', body: '别人打深渊拿奖励，你打深渊主要是想证明点什么。' },
  ],
  PULL: [
    { title: '后台弹出了卡池预警', body: '你嘴上说看情况，后台看到的却是高频祈愿高危人群。' },
    { title: '系统确认你手比脑子更快', body: '你的理性偶尔在线，但通常赶不上按钮。' },
  ],
  LORE: [
    { title: '后台看出你爱较真设定', body: '你不是非要当剧情警察，只是听到聊歪会难受。' },
    { title: '系统提醒你少纠正别人两句', body: '你身上那股“这设定不是这么讲的”已经藏不太住了。' },
  ],
  MAPR: [
    { title: '后台发现你对百分比过敏', body: '99% 在别人眼里是差不多，在你眼里是没完。' },
    { title: '系统确认你会惦记最后一点', body: '你嘴上能说算了，心里一般算不了。' },
  ],
  POTR: [
    { title: '后台看出你有点壶味', body: '你不一定天天施工，但你只要进壶，认真程度就会上来。' },
    { title: '系统确认你很容易开始改布局', body: '别人看家具，你看整体。这个习惯挺明显的。' },
  ],
  COOP: [
    { title: '后台发现你见不得别人受苦', body: '你在联机里多少有点“来，我帮你”的条件反射。' },
    { title: '系统确认你适合做世界售后', body: '你不一定最强，但你真的挺容易接活。' },
  ],
  SNAP: [
    { title: '后台正在替你调机位', body: '你前面的答案一看就不是单纯打游戏，是会顺手找角度的人。' },
    { title: '系统确认你对画面很上心', body: '你可能嘴上不说，但你真的挺在意这张图拍得好不好。' },
  ],
  XPRS: [
    { title: '后台已经听见你在说XP了', body: '你很多选择都在表达同一件事：我喜欢比什么都重要。' },
    { title: '系统确认你会为喜欢破例', body: '别人给你算环境，你心里先看顺不顺眼。' },
  ],
  SAVE: [
    { title: '后台发现你很会做预算', body: '你看起来像那种抽卡前会先把后面几版都顺手算了的人。' },
    { title: '系统确认你原石不爱乱花', body: '你的冲动一般得先经过一点计算。' },
  ],
  DAIL: [
    { title: '后台正在给你办打卡证', body: '你这一路答下来，很像把原神过成日常安排的人。' },
    { title: '系统确认你靠习惯供电', body: '别人靠上头上线，你更像是到点自动登录。' },
  ],
  CHAO: [
    { title: '后台怀疑你不是来正经玩的', body: '你很多选择都透着一股“先看看能不能整点活”的味。' },
    { title: '系统确认你自带一点节目效果', body: '你可能没想过搞事情，但事情通常会自己靠近你。' },
  ],
}

const FLAG_TAUNTS = {
  OTTO: [
    { title: '后台先闻到了词条火药味', body: '你和圣遗物的关系看起来不太和睦。' },
    { title: '系统确认你受过副词条的苦', body: '双爆在你这里通常只是故事的开始。' },
  ],
  QIQI: [
    { title: '后台检测到歪池旧伤', body: '有些创伤你不提，不代表后台看不出来。' },
    { title: '系统确认你对常驻记忆深刻', body: '你聊卡池时，多半很难彻底平静。' },
  ],
  RESI: [
    { title: '后台发现你的体力经常自由生长', body: '别人怕溢出，你更像靠缘分处理。' },
    { title: '系统确认你对提醒有天然免疫', body: '该上线这件事在你这里，通常没有很高优先级。' },
  ],
  PAIM: [
    { title: '后台发现你挺会选怪答案', body: '系统本来想归类你，结果先被你答题方式打乱了。' },
    { title: '系统确认你本人就是变量', body: '你不是在做测试，你是在给测试添一点节目效果。' },
  ],
}

const TYPE_PROFILES = {
  FARM: 'HMLMMLLL',
  ABYS: 'MMHMLLLM',
  PULL: 'LHHLLLMM',
  LORE: 'LLMHMMLM',
  MAPR: 'MLMLHLLL',
  POTR: 'LLLMMMHL',
  COOP: 'LLMLLMHM',
  SNAP: 'LLLMMMHH',
  XPRS: 'LMLLLMHM',
  SAVE: 'MLMMLLLL',
  DAIL: 'MMLMMMLL',
  CHAO: 'LLLLLMMH',
}

function pickByStage(list, stage) {
  return list[Math.min(stage, list.length - 1)]
}

function valueToLevelByAverage(average) {
  if (average < 1.67) return 'L'
  if (average > 2.33) return 'H'
  return 'M'
}

function levelToNumber(level) {
  return { L: 1, M: 2, H: 3 }[level]
}

export function getDimensionLevels(dimensionTotals, dimensionCounts) {
  return DIMENSION_ORDER.reduce((acc, code) => {
    const count = dimensionCounts[code] || 0
    if (!count) {
      acc[code] = 'M'
      return acc
    }

    acc[code] = valueToLevelByAverage(dimensionTotals[code] / count)
    return acc
  }, {})
}

export function deriveTypeScores(dimensionTotals, dimensionCounts) {
  const levels = getDimensionLevels(dimensionTotals, dimensionCounts)
  const vector = DIMENSION_ORDER.map((code) => levelToNumber(levels[code]))
  const maxDistance = DIMENSION_ORDER.length * 2

  return TYPE_ORDER.reduce((acc, code) => {
    const template = TYPE_PROFILES[code]
    let distance = 0

    template.split('').forEach((level, index) => {
      distance += Math.abs(levelToNumber(level) - vector[index])
    })

    acc[code] = Math.max(0, Math.round((1 - distance / maxDistance) * 100))
    return acc
  }, {})
}

export function getDynamicTaunt(stage, topType, flags) {
  const flagPriority = ['OTTO', 'QIQI', 'RESI', 'PAIM']
  const flagHit = flagPriority.find((code) => (stage === 0 ? flags[code] >= 3 : flags[code] >= 5))

  if (flagHit) return pickByStage(FLAG_TAUNTS[flagHit], stage)
  return pickByStage(TYPE_TAUNTS[topType] || TYPE_TAUNTS.DAIL, stage)
}

const QUESTIONS = [
  { id: 'q1', section: '日常 / 树脂', dimension: 'RE', prompt: '刚上线，你第一眼一般看哪？', hint: '三选一，别想太久。', options: [
    { label: '树脂和委托', value: 3 },
    { label: '活动和邮件', value: 2 },
    { label: '随便点，想到哪看哪', value: 1, flags: { RESI: 1 } },
  ]},
  { id: 'q2', section: '卡池 / 原石', dimension: 'GA', prompt: '新角色PV一出，你第一反应通常是？', hint: '最像你的那个。', options: [
    { label: '先看我现在能不能抽', value: 3, flags: { QIQI: 1 } },
    { label: '先看看大家怎么说', value: 2 },
    { label: '先放着，之后再研究', value: 1 },
  ]},
  { id: 'q3', section: '深渊 / 养成', dimension: 'PR', prompt: '深渊少一星，对你来说更像什么？', hint: '别选体面答案。', options: [
    { label: '得补回来，不然难受', value: 3 },
    { label: '差不多就行，奖励拿到就好', value: 2 },
    { label: '看心情，有时候懒得补', value: 1, flags: { RESI: 1 } },
  ]},
  { id: 'q4', section: '剧情 / 设定', dimension: 'LO', prompt: '你看剧情时，一般是哪种状态？', hint: '很容易分人。', options: [
    { label: '认真看，漏一句都难受', value: 3 },
    { label: '主线认真，支线看心情', value: 2 },
    { label: '能跳就跳，后面再说', value: 1, flags: { RESI: 1 } },
  ]},
  { id: 'q5', section: '地图 / 探索', dimension: 'EX', prompt: '地图卡在99%时，你更像哪种人？', hint: '别装不在乎。', options: [
    { label: '不找出来心里一直惦记', value: 3 },
    { label: '嘴上算了，回头还是会查', value: 2 },
    { label: '99就99吧，也不是不能活', value: 1 },
  ]},
  { id: 'q6', section: '联机 / 社交', dimension: 'SO', prompt: '有人申请进你世界，你一般是什么反应？', hint: '默认设置很说明问题。', options: [
    { label: '放进来吧，大概率是来求助的', value: 3 },
    { label: '看情况，我先看看', value: 2 },
    { label: '不太想，我更喜欢自己待着', value: 1 },
  ]},
  { id: 'q7', section: '角色 / XP', dimension: 'XP', prompt: '别人说“这个角色一般”，你更像哪种反应？', hint: '这题也很直白。', options: [
    { label: '我喜欢就行', value: 3 },
    { label: '我再看看，别太冲动', value: 2 },
    { label: '那我就先放一放', value: 1 },
  ]},
  { id: 'q8', section: '日常 / 发病', dimension: 'CH', prompt: '你在原神里最常见的状态是？', hint: '别装正经。', options: [
    { label: '正常玩两下，很快就想整点活', value: 3, flags: { PAIM: 1 } },
    { label: '大多数时候还算正常', value: 2 },
    { label: '基本就按部就班地玩', value: 1 },
  ]},
  { id: 'q9', section: '日常 / 树脂', dimension: 'RE', prompt: '树脂快满了，你更像哪种人？', hint: '这一题会露馅。', options: [
    { label: '会惦记，最好上去清一下', value: 3 },
    { label: '看情况，晚点处理也行', value: 2 },
    { label: '经常满了才想起来', value: 1, flags: { RESI: 1 } },
  ]},
  { id: 'q10', section: '卡池 / 原石', dimension: 'GA', prompt: '卡池开之前，你更像哪种人？', hint: '主要抓嘴硬。', options: [
    { label: '嘴上说随缘，实际一直在想', value: 3, flags: { QIQI: 1 } },
    { label: '先算算，别把自己抽没了', value: 2 },
    { label: '先等等，没那么容易动心', value: 1 },
  ]},
  { id: 'q11', section: '深渊 / 养成', dimension: 'PR', prompt: '双爆胚子掉出来时，你最像哪种反应？', hint: '工伤在这里很明显。', options: [
    { label: '先别高兴，等+20再说', value: 3, flags: { OTTO: 1 } },
    { label: '能用就行，别想太多', value: 2 },
    { label: '我已经不信这种东西了', value: 1, flags: { OTTO: 2 } },
  ]},
  { id: 'q12', section: '剧情 / 设定', dimension: 'LO', prompt: '朋友跳完剧情还来聊设定，你最像哪种反应？', hint: '血压题。', options: [
    { label: '忍不住想纠正', value: 3 },
    { label: '听听就算了', value: 2 },
    { label: '直接开始整活', value: 1, flags: { PAIM: 1 } },
  ]},
  { id: 'q13', section: '地图 / 探索', dimension: 'EX', prompt: '新地图一开，你一般先干嘛？', hint: '开图习惯很直白。', options: [
    { label: '先开锚点找神瞳', value: 3 },
    { label: '先乱逛，顺便看风景', value: 2 },
    { label: '先推主线，地图之后再说', value: 1 },
  ]},
  { id: 'q14', section: '联机 / 社交', dimension: 'SO', prompt: '群友说“救一下”，你一般会？', hint: '售后属性题。', options: [
    { label: '来，我帮你', value: 3 },
    { label: '看情况，有空就去', value: 2 },
    { label: '装没看见', value: 1 },
  ]},
  { id: 'q15', section: '角色 / XP', dimension: 'XP', prompt: '你抽角色最看重什么？', hint: '凭直觉选。', options: [
    { label: '我喜不喜欢', value: 3 },
    { label: '喜欢和强度都看', value: 2 },
    { label: '主要看值不值', value: 1 },
  ]},
  { id: 'q16', section: '日常 / 发病', dimension: 'CH', prompt: '朋友说你玩原神挺正常的，你更像哪种反应？', hint: '别想太久。', options: [
    { label: '那是他没见过我发病的时候', value: 3, flags: { PAIM: 1 } },
    { label: '还行，大部分时候是正常的', value: 2 },
    { label: '本来就挺正常', value: 1 },
  ]},
  { id: 'q17', section: '日常 / 树脂', dimension: 'RE', prompt: '你最常说的一句原神废话是？', hint: '群友一般都听过。', options: [
    { label: '等我清个体', value: 3 },
    { label: '我先把日常做了', value: 2 },
    { label: '我就上线看一眼', value: 1, flags: { RESI: 1 } },
  ]},
  { id: 'q18', section: '卡池 / 原石', dimension: 'GA', prompt: '歪常驻那一刻，你最像哪种反应？', hint: '旧伤题。', options: [
    { label: '先骂两句，再想怎么补', value: 3, flags: { QIQI: 1 } },
    { label: '认了，继续攒', value: 2 },
    { label: '先发群里，大家一起看笑话', value: 1, flags: { QIQI: 1, PAIM: 1 } },
  ]},
  { id: 'q19', section: '深渊 / 养成', dimension: 'PR', prompt: '群里发低配满星，你一般会？', hint: '作业党很好认。', options: [
    { label: '先抄，先过了再说', value: 3 },
    { label: '先存着，回头参考', value: 2 },
    { label: '懒得看，我自己来', value: 1 },
  ]},
  { id: 'q20', section: '剧情 / 设定', dimension: 'LO', prompt: '如果真给剧情跳过，你最真实的态度是？', hint: '说实话就行。', options: [
    { label: '给就给，反正我自己不会跳', value: 3 },
    { label: '有最好，省得有些地方磨人', value: 2 },
    { label: '赶紧给，我很多时候真懒得看', value: 1 },
  ]},
  { id: 'q21', section: '地图 / 探索', dimension: 'EX', prompt: '你在大世界乱逛时，通常更像在干嘛？', hint: '重点不一样，味也不一样。', options: [
    { label: '翻箱倒柜，不想漏东西', value: 3 },
    { label: '顺手跑跑，来都来了', value: 2 },
    { label: '看看风景，差不多就走', value: 1 },
  ]},
  { id: 'q22', section: '联机 / 社交', dimension: 'SO', prompt: '你在联机里更像哪种角色？', hint: '三种都很明显。', options: [
    { label: '带人过本的', value: 3 },
    { label: '看心情参与的', value: 2 },
    { label: '基本不联机的', value: 1 },
  ]},
  { id: 'q23', section: '角色 / XP', dimension: 'XP', prompt: '朋友劝你“别抽了”，你更像哪种反应？', hint: '这题很分人。', options: [
    { label: '你别管，我就是喜欢', value: 3 },
    { label: '我再算一下', value: 2 },
    { label: '那就先忍一忍', value: 1 },
  ]},
  { id: 'q24', section: '日常 / 发病', dimension: 'CH', prompt: '如果结果页只能留一句最像你的话，你选哪句？', hint: '这题也在给你做归类。', options: [
    { label: '正常玩一会儿就想开始整活', value: 3, flags: { PAIM: 1 } },
    { label: '表面正常，偶尔发病', value: 2 },
    { label: '我其实一直都挺稳定的', value: 1 },
  ]},
]

export function buildQuizQuestions() {
  return QUESTIONS.map((question) => ({
    ...question,
    options: question.options.map((option) => ({
      ...option,
      flags: { ...(option.flags || {}) },
    })),
  }))
}
