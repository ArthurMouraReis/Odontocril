# Vídeo institucional — Odontocril

Vídeo de ~58 s produzido em código com [Remotion](https://www.remotion.dev/) (React) + FFmpeg.

| Arquivo | Formato |
|---|---|
| `out/odontocril-institucional-vertical.mp4` | 1080 × 1920 (9:16) — Reels/Stories |
| `out/odontocril-institucional-horizontal.mp4` | 1920 × 1080 (16:9) — site e apresentações |

H.264 (High, yuv420p, 30 fps) + AAC 192 kbps 48 kHz, áudio normalizado em −14 LUFS / −1,5 dBTP.

## Estrutura

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
./render.sh                # gera as duas versões em out/
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
- **Fontes:** Montserrat e Open Sans — SIL Open Font License (`public/fonts/OFL-*.txt`).
- **Remotion:** gratuito para empresas com até 3 pessoas; acima disso exige licença
  (<https://www.remotion.dev/license>).
