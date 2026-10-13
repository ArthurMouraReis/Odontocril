// Captura telas reais do Tecvertex Gestão (base de demonstração) para o vídeo.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const meta = {};
const VW = 1920, VH = 1080;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1.5 });
const box = async (loc) => { const r = await loc.first().boundingBox({ timeout: 4000 }).catch(() => null); return r && { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
const shot = async (name) => { await p.mouse.move(VW - 2, VH - 2); await p.waitForTimeout(400); await p.screenshot({ path: `${out}/${name}.png` }); };
const go = async (url) => { await p.goto('http://localhost:3001' + url); await p.waitForLoadState('networkidle'); await p.waitForTimeout(1600); };

await go('/login');
await p.fill('input[type=email]', 'demo@odontocril.exemplo');
await p.fill('input[type=password]', 'demo123');
await p.keyboard.press('Enter');
await p.waitForURL(/\/app/);

await go('/app');
meta.dash = { kpi: await box(p.getByText('Valor em estoque', { exact: false })), insights: await box(p.getByText('Insights da IA')), repor: await box(p.getByText('Produtos para repor')), previsao: await box(p.getByText('Previsão próximo mês')) };
await shot('dash');

await go('/app/estoque');
meta.estoque_before = { row: await box(p.locator('tr', { hasText: 'Ultrassom odontológico' })) };
await shot('estoque_before');

await go('/app/crm');
const card = p.locator('[data-rfd-draggable-id]', { hasText: 'Ultrassom para a clínica' });
meta.funil = { card: await box(card), ganho: await box(p.locator('text=Ganho').first()) };
await card.first().screenshot({ path: `${out}/card.png` });
await shot('funil_before');
// arrasta com o mouse até a coluna Ganho
const c = meta.funil.card, g = meta.funil.ganho;
const from = { x: c.x + c.w / 2, y: c.y + c.h / 2 };
const to = { x: g.x + 90, y: c.y + c.h / 2 + 10 };
meta.funil.from = from; meta.funil.to = to;
await p.mouse.move(from.x, from.y);
await p.mouse.down();
await p.waitForTimeout(150);
for (let i = 1; i <= 30; i++) { await p.mouse.move(from.x + ((to.x - from.x) * i) / 30, from.y + ((to.y - from.y) * i) / 30); await p.waitForTimeout(16); }
await p.waitForTimeout(250);
await p.screenshot({ path: `${out}/funil_dragging.png` });
await p.mouse.up();
await p.waitForTimeout(900);
const confirmBtn = p.locator('button', { hasText: 'Marcar como ganho' });
meta.funil.dialog = await box(p.locator('[role=dialog]'));
meta.funil.confirm = await box(confirmBtn);
await shot('funil_confirm');
await confirmBtn.first().click();
await p.waitForTimeout(700);
meta.funil.toast = await box(p.locator('text=Venda ganha'));
meta.funil.after = await box(card);
await p.screenshot({ path: `${out}/funil_after.png` });

await go('/app/estoque');
meta.estoque_after = { row: await box(p.locator('tr', { hasText: 'Ultrassom odontológico' })) };
await shot('estoque_after');

await go('/app/estoque/movimentos');
meta.mov = { first: await box(p.locator('tr', { hasText: 'Ultrassom para a clínica' })) };
await shot('mov_after');

fs.writeFileSync(`${out}/meta.json`, JSON.stringify({ viewport: { w: VW, h: VH }, ...meta }, null, 2));
console.log(JSON.stringify(meta, null, 1));
await b.close();
