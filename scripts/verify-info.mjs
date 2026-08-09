/**
 * verify-info.mjs —— 全流程验证：各页面渲染 + /info 专项检查
 */
import puppeteer from 'puppeteer-core'

const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:5173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function clickByText(page, text, exclude = '') {
  const handles = await page.$$('button, a')
  for (const h of handles) {
    const t = await h.evaluate((el) => el.innerText)
    if (t && t.includes(text) && (!exclude || !t.includes(exclude))) {
      await h.click()
      return true
    }
  }
  return false
}

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

const ok = (msg) => console.log('✔ ' + msg)

try {
  // === 1. 首页 ===
  await page.goto(BASE, { waitUntil: 'load' })
  await sleep(600)
  let h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('首页: ' + h1)
  const hasCTA1 = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a, button')).some(el => el.innerText?.includes('BOOM'))
  )
  ok('  首页 CTA 存在: ' + hasCTA1)

  // === 2. Discover 渲染 ===
  await page.goto(BASE + '/discover', { waitUntil: 'load' })
  await sleep(600)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Discover: ' + h1)
  const platformBtns = await page.evaluate(() =>
    document.querySelectorAll('main button').length
  )
  ok('  平台卡片数: ' + platformBtns + ' (预期 ≥12)')

  // === 3. Simulate 渲染 ===
  await page.goto(BASE + '/simulate', { waitUntil: 'load' })
  await sleep(600)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Simulate: ' + h1)

  // 点 Start → 走 10 skip → 验证 reveal → bridge
  // 注意：必须精确匹配 "Start →" 避免 ProgressBar 里的 "Start" 链接
  await clickByText(page, 'Start →')
  await sleep(700)
  for (let i = 0; i < 10; i++) {
    await clickByText(page, 'Skip', 'action tools')
    await sleep(480)
  }
  await sleep(2000)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Simulate 揭晓: ' + h1)

  // 点 bridge CTA
  await clickByText(page, 'See what else is hidden')
  await sleep(900)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Bridge: ' + (h1 || '(过渡屏)'))
  const hasCheckBtn = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a')).some(el => el.innerText?.includes('Check it out'))
  )
  ok('  Check 按钮: ' + hasCheckBtn)

  // === 4. /info 专项 ===
  await page.goto(BASE + '/info', { waitUntil: 'load' })
  await sleep(800)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Info 页标题: ' + h1)

  // 5 个地区区块
  const secs = await page.evaluate(() =>
    ['east-asia', 'middle-east', 'southeast-asia', 'europe', 'usa'].map((id) => {
      const el = document.getElementById(id)
      return { id, exists: !!el }
    }),
  )
  secs.forEach((s) => ok('  区块 #' + s.id + ': ' + s.exists))

  // Bubble3D 存在
  const bubble = await page.evaluate(() =>
    document.querySelector('button[aria-label="Click to pop the bubble"]') !== null
  )
  ok('  3D 泡泡存在: ' + bubble)

  // AnchorNav 已移除（只保留 ProgressBar）
  const hasAnchorNav = await page.evaluate(() => {
    const navs = document.querySelectorAll('nav')
    for (const n of navs) {
      const btns = n.querySelectorAll('button')
      if (btns.length >= 4) return true
    }
    return false
  })
  ok('  AnchorNav 已移除: ' + !hasAnchorNav)

  // Footer CTA
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await sleep(400)
  const footerLink = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a')).some(el => el.innerText?.includes('Take Action'))
  )
  ok('  Footer CTA: ' + footerLink)

  // 截图
  await page.goto(BASE + '/info', { waitUntil: 'load' })
  await sleep(600)
  await page.screenshot({ path: 'shots/info-hero.png' })
  ok('截图: shots/info-hero.png')

  // === 5. ProgressBar 步骤数 ===
  const steps = await page.evaluate(() => {
    return document.querySelectorAll('nav a, nav div.flex-1').length
  })
  ok('ProgressBar 步骤: ' + steps + ' (预期 5)')

  // === 6. /act ===
  await page.goto(BASE + '/act', { waitUntil: 'load' })
  await sleep(600)
  h1 = await page.evaluate(() => document.querySelector('h1')?.innerText)
  ok('Act 页: ' + h1)

  // ===== 总结 =====
  console.log('\n===== ' + (errors.length ? '✘ 有错误' : '✔ 全通过') + ' =====')
  if (errors.length) {
    console.log('控制台错误 (' + errors.length + '):')
    errors.forEach((e) => console.log('  ✘ ' + e))
  } else {
    console.log('✔ 零控制台错误')
  }
} catch (e) {
  console.log('✘ 失败: ' + e.message)
  console.error(e)
}

await browser.close()
