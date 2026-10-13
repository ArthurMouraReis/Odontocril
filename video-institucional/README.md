# Vídeo institucional — Odontocril

Produzido em código com [Remotion](https://www.remotion.dev/) (React) + FFmpeg.

## Tecvertex apresenta a Odontocril (site + sistema de gestão)

Vídeo da Tecvertex anunciando a Odontocril como primeira cliente, no estilo do comercial da Tecvertex,
mostrando o site e o sistema de gestão.

| Arquivo | Formato |
|---|---|
| `out/tecvertex-apresenta-odontocril-vertical.mp4` | 1080 × 1920, 74 s |
| `out/tecvertex-apresenta-odontocril-horizontal.mp4` | 1920 × 1080, 74 s |

| Tempo | Cena |
|---|---|
| 0–6 s | "Toda história começa com… a primeira cliente." |
| 6–12 s | A conversa no WhatsApp ("Vamos criar o site e o sistema de gestão.") |
| 12–20 s | "Bem-vinda, Odontocril." — perfil da cliente |
| 20–29 s | O site no computador (URL digitada, página carregando, clique em "Falar no WhatsApp") |
| 29–38 s | O site no celular, terminando no WhatsApp com a mensagem pronta |
| 38–46 s | **Tecvertex Gestão** — painel (valor em estoque, estoque baixo, receita, funil) |
| 46–56 s | Venda arrastada para "Ganho" → confirmação → baixa automática (Ultrassom 7 → 6) → movimentação registrada |
| 56–62 s | Alertas automáticos: o que repor, clientes sem comprar há tempo, previsão do mês |
| 62–68 s | Tecvertex × Odontocril — "Obrigado pela confiança" |
| 68–74 s | Encerramento da Tecvertex com CTA e site |

Código em `src/tecvertex/` (composições `Tecvertex-Vertical` / `Tecvertex-Horizontal`);
renderizar com `./render.sh Tecvertex-Vertical Tecvertex-Horizontal`.
Trilha: `scripts/trilha_v2.py public/audio/trilha_tecvertex.wav 74 68`.

**Telas do sistema:** são capturas reais do Tecvertex Gestão (repositório `tecvertex-`), rodando com uma
base de demonstração odontológica — produtos, clientes e valores são fictícios (aviso "Dados de
demonstração" na tela). Para refazer as capturas (`public/tecvertex/gestao/`):

```bash
# no repositório tecvertex- (npm install && npm run build)
node scripts/gestao/seed-odontocril.mjs <tecvertex-> /tmp/demo/db.json
DATA_DIR=/tmp/demo JWT_SECRET=demo PORT=3001 NODE_ENV=production node server/index.js
node scripts/gestao/capture.mjs public/tecvertex/gestao   # requer playwright-core
```
(converta os PNGs para JPEG e copie `meta.json` para `src/tecvertex/gestao-meta.json`.)

**Telas do site** (`src/tecvertex/site.tsx`) e a conversa são ilustrativas — troque pelas capturas reais
do site quando ele estiver no ar. A logo da Tecvertex (`public/tecvertex/`) foi extraída do comercial
oficial; vale substituir pelo arquivo original.

## Odontocril — versão 2 (atual) — estilo "demo de produto"

Inspirada no vídeo de referência: fundo claro, cabeçalho fixo com a logo e o indicador "Passo 1 de 3",
títulos curtos alinhados à esquerda com destaque azul e a história contada por interfaces (conversa no
WhatsApp, seleção de equipamentos com cursor, painel de assistência técnica). Trilha ritmada (120 BPM) e
sons de interface; **sem narração**, como na referência.

| Arquivo | Formato |
|---|---|
| `out/odontocril-institucional-vertical.mp4` | 1080 × 1920 (9:16) — Reels/Stories, 46 s |
| `out/odontocril-institucional-horizontal.mp4` | 1920 × 1080 (16:9) — site e apresentações, 46 s |

| Cena | Tempo | Conteúdo |
|---|---|---|
| Abertura | 0–6 s | "Você cuida do sorriso / dos pacientes / da clínica. A gente cuida dos equipamentos." |
| Passo 1 | 6–14 s | Conversa no WhatsApp: o dentista conta o que o consultório precisa |
| Passo 2 | 14–24 s | Linha de equipamentos: cursor seleciona itens e pede orçamento |
| Passo 3 | 24–32 s | Assistência técnica: equipamentos passam a "Em funcionamento" |
| No dia a dia | 32–38 s | Consultório com o refletor acendendo · Segurança, Eficiência, Pronto para atender |
| Encerramento | 38–46 s | Logo, slogan, botão "Fale com a gente no WhatsApp" e contatos |

Código: `src/v2/` (cenas em `src/v2/scenes/`, tempos em `src/v2/timeline.ts`, contatos em
`src/v2/scenes/Final.tsx`). Trilha: `scripts/trilha_v2.py`; efeitos: `scripts/sfx.py`.

A conversa e a tela de seleção são **encenações ilustrativas** do atendimento (como a referência faz com a
padaria fictícia); não representam um sistema real da empresa nem depoimentos de clientes.

## Versão 1 — institucional com narração

Arquivos `out/odontocril-institucional-v1-*.mp4` (57,6 s, narração pt-BR). Código em `src/` (fora de `v2/`);
composições `V1-Vertical` e `V1-Horizontal`. Renderizar com
`npx remotion render V1-Vertical out/v1.mp4`.

## Estrutura (versão 1)

| Cena | Tempo | Conteúdo |
|---|---|---|
| 1 · Abertura | 0–4,8 s | Consultório em traço + logo + "Tecnologia e confiança para a odontologia." |
| 2 · Empresa | 4,8–12 s | Equipamentos e assistência técnica · Tecnologia / Qualidade / Confiança |
| 3 · Produtos | 12–24 s | Consultórios e cadeiras, Ultrassom, Bombas de vácuo, Fotopolimerizadores, demais itens |
| 4 · Assistência técnica | 24–33,6 s | Selo de assistência técnica |
| 5 · Confiança | 33,6–45,6 s | Refletor acendendo · Segurança / Eficiência / Atenção aos pacientes |
| 6 · Encerramento | 45,6–57,6 s | Logo, slogan, chamada para ação e contatos |

Os cortes caem nos compassos da trilha (100 BPM, compasso de 2,4 s). As animações de texto são sincronizadas com a narração.

```
src/
  Root.tsx            composições "Vertical" e "Horizontal"
  Video.tsx           montagem das cenas, crossfades, narração e ducking da trilha
  timeline.ts         tempos das cenas e da narração (ajuste aqui)
  theme.ts            cores da marca e fontes
  media.ts            ← onde cadastrar as fotos reais da empresa
  components/         Logo animada, textos, fundos, ilustrações em traço
  scenes/             uma cena por arquivo
scripts/
  narracao.py         gera a narração (Kokoro TTS)
  trilha.py           gera a trilha instrumental
public/
  brand/              logo oficial (original + versão ampliada em camadas)
  audio/              narração (n1–n5.wav), trilha.wav, narracao.json (textos e durações)
  fonts/              Montserrat e Open Sans (SIL OFL)
  media/              fotos reais (vazia — ver abaixo)
```

## Renderizar novamente

```bash
npm install
./render.sh                # gera vertical e horizontal (versão 2) em out/
./render.sh Vertical       # apenas uma
npx remotion studio        # pré-visualização interativa no navegador
```

Se o Remotion não conseguir baixar o Chrome (rede restrita), aponte para um Chromium local:
`REMOTION_BROWSER=/caminho/para/chrome ./render.sh`.

### Trocar textos, narração ou trilha

- **Textos na tela:** em `src/scenes/*.tsx`. **Contatos:** `CONTATOS` em `src/scenes/S6Encerramento.tsx`.
- **Narração:** edite `LINES` em `scripts/narracao.py` e rode
  `python scripts/narracao.py <pasta-dos-modelos> public/audio`
  (requer `pip install kokoro-onnx soundfile` e os arquivos `kokoro-v1.0.onnx` e `voices-v1.0.bin` de
  <https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0>). As durações vão para
  `narracao.json` e o vídeo se ajusta sozinho. Para usar uma locução gravada por um profissional, basta substituir
  `public/audio/n1.wav … n5.wav` (mesmos nomes) e rodar o script de texto/duração, ou editar `narracao.json`.
- **Trilha:** `python scripts/trilha.py public/audio/trilha.wav` (requer `numpy scipy soundfile`).

## Materiais que a Odontocril precisa fornecer

Durante a produção **não foi possível acessar o site (odontocril.com.br não respondeu ao DNS) nem o Instagram**
(bloqueado pela rede do ambiente). Por isso, o único material oficial usado é a **logo enviada**. Nenhuma foto
foi inventada nem gerada por IA: os equipamentos aparecem como **ilustrações em traço, genéricas e sem marca**,
com o aviso "Imagens ilustrativas" na tela.

Para trocar as ilustrações por fotos reais, coloque os arquivos em `public/media/` e informe os nomes em
`src/media.ts` — o vídeo passa a usá-los automaticamente, com movimento de câmera suave:

| Chave em `media.ts` | Onde aparece | Sugestão |
|---|---|---|
| `consultorio` | Abertura | Consultório montado, bem iluminado (horizontal, ≥ 2000 px) |
| `cadeira` | Produtos 01 | Cadeira/consultório odontológico do catálogo |
| `ultrassom` | Produtos 02 | Ultrassom do catálogo |
| `vacuo` | Produtos 03 | Bomba de vácuo do catálogo |
| `fotopolimerizador` | Produtos 04 | Fotopolimerizador do catálogo |
| `assistencia` | Assistência técnica | Foto real da equipe técnica trabalhando (recorte quadrado) |
| `equipe` | Confiança | Consultório/equipamento em funcionamento |

Se forem fotos reais, lembre-se de remover o aviso `<IllustrativeNote />` das cenas correspondentes.

Também vale confirmar com a empresa:
- se as quatro categorias da cena 3 correspondem ao catálogo atual (foram tiradas do briefing);
- uma versão vetorial (SVG/PDF) da logo — a usada aqui foi ampliada a partir de um JPG de 523 px.

## Licenças dos recursos

- **Logo:** propriedade da Odontocril (arquivo fornecido pelo cliente). A versão em alta foi obtida por ampliação
  e separação de cores do arquivo original, sem redesenho.
- **Narração:** voz sintética `pm_alex` do Kokoro-82M (Apache 2.0), gerada por `scripts/narracao.py`.
- **Trilha:** composição original sintetizada por `scripts/trilha.py` — sem amostras de terceiros, livre de direitos.
- **Efeitos sonoros (v2):** sintetizados por `scripts/sfx.py`, livres de direitos.
- **Fontes:** Inter, Inter Tight, Instrument Serif, Montserrat e Open Sans — SIL Open Font License (`public/fonts/OFL-*.txt`).
- **Remotion:** gratuito para empresas com até 3 pessoas; acima disso exige licença
  (<https://www.remotion.dev/license>).
