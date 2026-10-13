// Base de DEMONSTRAÇÃO (dados fictícios) para capturar telas do Tecvertex Gestão no vídeo.
// Uso: node seed-odontocril.mjs <repo tecvertex-> <saida/db.json>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const [repo, out] = process.argv.slice(2);
const require = createRequire(path.join(repo, 'package.json'));
const bcrypt = require('bcryptjs');

const DAY = 86_400_000;
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString();
const dateOnly = (n) => daysAgo(n).slice(0, 10);
const state = { users: [], produtos: [], movimentos: [], clientesCrm: [], oportunidades: [], clientes: [], leads: [], links: [] };
const insert = (c, doc) => { const r = { id: crypto.randomUUID(), created_date: new Date().toISOString(), updated_date: new Date().toISOString(), ...doc }; state[c].push(r); return r; };

insert('users', { full_name: 'Equipe Odontocril', email: 'demo@odontocril.exemplo', password_hash: bcrypt.hashSync('demo123', 10), role: 'vendedor' });

const produtos = [
  ['Cadeira odontológica', 'CAD-ODT-01', 'Consultórios', 5, 17800, 25900, 'Fornecedor A', 2],
  ['Mocho odontológico', 'MOC-ODT-01', 'Consultórios', 9, 640, 1090, 'Fornecedor A', 3],
  ['Refletor LED', 'REF-LED-01', 'Consultórios', 6, 1350, 2190, 'Fornecedor B', 2],
  ['Ultrassom odontológico', 'ULT-ODT-01', 'Ultrassom', 7, 1480, 2390, 'Fornecedor C', 3],
  ['Kit de pontas para ultrassom', 'PNT-ULT-K5', 'Ultrassom', 24, 115, 229, 'Fornecedor C', 10],
  ['Bomba de vácuo', 'BVA-ODT-01', 'Bombas de vácuo', 2, 3850, 5790, 'Fornecedor D', 3],
  ['Fotopolimerizador LED', 'FOT-LED-01', 'Fotopolimerizadores', 12, 560, 949, 'Fornecedor E', 5],
  ['Radiômetro', 'RAD-FOT-01', 'Fotopolimerizadores', 0, 180, 329, 'Fornecedor E', 3],
  ['Caneta de alta rotação', 'CAN-ALT-01', 'Acessórios', 15, 360, 649, 'Fornecedor B', 6],
  ['Micromotor', 'MIC-MOT-01', 'Acessórios', 8, 520, 890, 'Fornecedor B', 4],
].map(([nome, sku, categoria, quantidade, preco_custo, preco_venda, fornecedor, estoque_minimo]) =>
  insert('produtos', { nome, sku, categoria, quantidade, preco_custo, preco_venda, fornecedor, estoque_minimo, descricao: '' }));

const crm = [
  ['Helena Martins', 'Clínica Sorriso Pleno', 'helena@exemplo.com', '(48) 90000-0001', 'Florianópolis/SC'],
  ['Rafael Cunha', 'Cunha Odontologia', 'rafael@exemplo.com', '(48) 90000-0002', 'São José/SC'],
  ['Beatriz Lopes', 'Odonto Lopes', 'beatriz@exemplo.com', '(48) 90000-0003', 'Palhoça/SC'],
  ['Thiago Ramos', 'Instituto Dental Ramos', 'thiago@exemplo.com', '(48) 90000-0004', 'Biguaçu/SC'],
  ['Camila Duarte', 'Clínica Duarte', 'camila@exemplo.com', '(48) 90000-0005', 'Florianópolis/SC'],
  ['Lucas Ferreira', 'Consultório Dr. Lucas', 'lucas@exemplo.com', '(48) 90000-0006', 'São José/SC'],
].map(([nome, empresa, email, telefone, cidade]) => insert('clientesCrm', { nome, empresa, email, telefone, cidade, documento: '', status: 'ativo', observacoes: '' }));

const P = (sku) => produtos.find((p) => p.sku === sku);
const item = (sku, quantidade) => { const p = P(sku); return { produto_id: p.id, produto_nome: p.nome, quantidade, preco_unitario: p.preco_venda }; };
const total = (itens) => itens.reduce((s, i) => s + i.quantidade * i.preco_unitario, 0);
const resp = 'Equipe Odontocril';

const ganhas = [
  [crm[0], 'Consultório completo — nova sala', [item('CAD-ODT-01', 1), item('MOC-ODT-01', 2), item('REF-LED-01', 1)], 150],
  [crm[1], 'Ultrassom + pontas', [item('ULT-ODT-01', 2), item('PNT-ULT-K5', 4)], 120],
  [crm[2], 'Fotopolimerizadores', [item('FOT-LED-01', 3)], 95],
  [crm[3], 'Bomba de vácuo — clínica', [item('BVA-ODT-01', 2)], 70],
  [crm[4], 'Cadeira odontológica', [item('CAD-ODT-01', 1)], 48],
  [crm[0], 'Canetas de alta rotação', [item('CAN-ALT-01', 4)], 30],
  [crm[5], 'Micromotor + caneta', [item('MIC-MOT-01', 1), item('CAN-ALT-01', 1)], 16],
  [crm[1], 'Fotopolimerizador LED', [item('FOT-LED-01', 2)], 7],
];
for (const [cli, titulo, itens, dias] of ganhas) {
  const op = insert('oportunidades', { titulo, cliente_crm_id: cli.id, cliente_nome: cli.nome, estagio: 'ganho', itens, valor: total(itens), responsavel: resp, previsao_fechamento: dateOnly(dias), baixa_estoque: true, data_ganho: daysAgo(dias), estornada: false, observacoes: '', created_date: daysAgo(dias + 10) });
  for (const it of itens) insert('movimentos', { produto_id: it.produto_id, produto_nome: it.produto_nome, tipo: 'saida', quantidade: it.quantidade, motivo: `Venda — ${titulo}`, oportunidade_id: op.id, usuario: resp, created_date: daysAgo(dias) });
}
const abertas = [
  [crm[4], 'Ultrassom para a clínica', 'negociacao', [item('ULT-ODT-01', 1)]],
  [crm[3], 'Consultório completo', 'proposta', [item('CAD-ODT-01', 1), item('REF-LED-01', 1)]],
  [crm[5], 'Fotopolimerizador LED', 'contato', [item('FOT-LED-01', 1)]],
  [crm[2], 'Mochos para 2 salas', 'novo', [item('MOC-ODT-01', 2)]],
  [crm[0], 'Bomba de vácuo reserva', 'novo', [item('BVA-ODT-01', 1)]],
];
abertas.forEach(([cli, titulo, estagio, itens], i) => insert('oportunidades', { titulo, cliente_crm_id: cli.id, cliente_nome: cli.nome, estagio, itens, valor: total(itens), responsavel: resp, previsao_fechamento: dateOnly(-(7 + i * 5)), baixa_estoque: false, estornada: false, observacoes: '', created_date: daysAgo(3 + i) }));
for (const [sku, qtd, dias] of [['CAD-ODT-01', 4, 160], ['FOT-LED-01', 10, 110], ['ULT-ODT-01', 6, 130], ['PNT-ULT-K5', 20, 80], ['CAN-ALT-01', 12, 40], ['MOC-ODT-01', 6, 25]]) {
  const p = P(sku);
  insert('movimentos', { produto_id: p.id, produto_nome: p.nome, tipo: 'entrada', quantidade: qtd, motivo: 'Compra de fornecedor', usuario: resp, created_date: daysAgo(dias) });
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(state, null, 2));
console.log('ok', Object.fromEntries(Object.entries(state).map(([k, v]) => [k, v.length])));
