/**
 * verify-eggs.mjs —— 自动验证 7 个彩蛋是否按预期触发
 * 用法：node scripts/verify-eggs.mjs（需 dev server 运行在 5173）
 */
import puppeteer from 'puppeteer-core'

const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'http://localhost:5173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function clickByText(page, text) {
  const handles = await page.$$('button')
  for (const h of handles) {
    const t = await h.evaluate((el) => el.innerText)
    if (t.includes(text)) {
      await h.click()
      return true
    }
  }
  throw new Error('未找到按钮: ' + text)
}

/** 点击 N 张内容/平台卡片（排除导航和观点按钮） */
async function clickCards(page, count) {
  let clicked = 0
  while (clicked < count) {
    const handles = await page.$$('main button')
    let found = false
    for (const h of handles) {
      if (clicked >= count) break
      const t = await h.evaluate((el) => el.innerText)
      if (/Next|See my bubble|All the time|Sometimes|Rarely|Never|←/.test(t)) continue
      await h.click()
      clicked++
      found = true
      await sleep(100)
    }
    if (!found) throw new Error('没有更多可点击的卡片')
  }
}

async function toastText(page) {
  return page.evaluate(() => document.querySelector('.fixed.bottom-10')?.innerText ?? null)
}

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

const results = []
const check = (name, ok, extra = '') => {
  results.push(`${ok ? '✔' : '✘'} ${name}${extra ? ' — ' + extra : ''}`)
}

/* ① 平台 0 选择 → 点 Next → toast，且不前进 */
await page.goto(URL + '/discover', { waitUntil: 'load' })
await sleep(900)
await clickByText(page, 'Next')
await sleep(500)
const t1 = await toastText(page)
check('① 0平台点Next弹toast', !!t1 && t1.includes('ZERO apps'), t1 ?? '无toast')
const h1a = await page.evaluate(() => document.querySelector('h1')?.innerText)
check('① 仍停在平台选择页', h1a === 'Where do you get your info?', h1a)

/* ② 平台全选 12 → 点 Next → toast + 前进 */
await page.goto(URL + '/discover', { waitUntil: 'load' })
await sleep(900)
await clickCards(page, 12)
await clickByText(page, 'Next')
await sleep(500)
const t2 = await toastText(page)
check('② 全选12平台弹toast', !!t2 && t2.includes('ALL of them'), t2 ?? '无toast')
const h1b = await page.evaluate(() => document.querySelector('h1')?.innerText)
check('② 前进到内容页', h1b === 'What do you mostly scroll?', h1b)

/* ③ 内容全选 11 + All the time → 结果页 SUPERHUMAN 横幅 */
await page.goto(URL + '/discover', { waitUntil: 'load' })
await sleep(900)
await clickCards(page, 1)
await clickByText(page, 'Next')
await sleep(400)
await clickCards(page, 11)
await clickByText(page, 'All the time')
await clickByText(page, 'See my bubble')
await sleep(700)
const body3 = await page.evaluate(() => document.body.innerText)
check('③ 超人横幅出现', body3.includes('SUPERHUMAN DETECTED'))
check('③ 评级升级 Ultra-wide open', body3.includes('Ultra-wide open 🌈'))

/* ④ 内容只选 1 + Sometimes → toast */
await page.goto(URL + '/discover', { waitUntil: 'load' })
await sleep(900)
await clickCards(page, 1)
await clickByText(page, 'Next')
await sleep(400)
await clickCards(page, 1)
await clickByText(page, 'Sometimes')
await clickByText(page, 'See my bubble')
await sleep(500)
const t4 = await toastText(page)
check('④ 只选1类弹toast', !!t4 && t4.includes('ONE topic'), t4 ?? '无toast')

/* ⑤ 内容 1 + Never → toast + Sealed shut */
await page.goto(URL + '/discover', { waitUntil: 'load' })
await sleep(900)
await clickCards(page, 1)
await clickByText(page, 'Next')
await sleep(400)
await clickCards(page, 1)
await clickByText(page, 'Never')
await clickByText(page, 'See my bubble')
await sleep(700)
const t5 = await toastText(page)
check('⑤ 密室弹toast', !!t5 && t5.includes('zip code'), t5 ?? '无toast')
const body5 = await page.evaluate(() => document.body.innerText)
check('⑤ 评级 Sealed shut', body5.includes('Sealed shut 📦'))

/* ⑥ 模拟器：连续 5 赞同边（概率性，重试） */
let egg6 = false
for (let attempt = 1; attempt <= 5 && !egg6; attempt++) {
  await page.goto(URL + '/simulate', { waitUntil: 'load' })
  await sleep(800)
  await clickByText(page, 'Start')
  await sleep(500)
  for (let i = 0; i < 10; i++) {
    await clickByText(page, 'Like')
    await sleep(420)
    const t = await toastText(page)
    if (t && t.includes('chokehold')) {
      egg6 = true
      break
    }
  }
  if (!egg6) console.log(`   ⚠ 第 ${attempt} 轮未触发连赞彩蛋，重试…`)
}
check('⑥ 连赞5次弹toast（重试制）', egg6)

/* ⑦ 模拟器：10 条全跳过 → toast */
await page.goto(URL + '/simulate', { waitUntil: 'load' })
await sleep(800)
await clickByText(page, 'Start')
await sleep(500)
let egg7 = false
for (let i = 0; i < 10; i++) {
  await clickByText(page, 'Skip')
  await sleep(420)
  const t = await toastText(page)
  if (t && t.includes('ZERO likes')) {
    egg7 = true
    break
  }
}
check('⑦ 全跳过弹toast', egg7)

console.log('\n===== 彩蛋验证结果 =====')
results.forEach((r) => console.log(r))
console.log(errors.length ? '\n✘ 控制台错误:\n' + errors.join('\n') : '\n✔ 无控制台错误')
await browser.close()
