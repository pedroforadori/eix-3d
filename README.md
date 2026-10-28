# Eix 3D: protótipo de fluxos do ar-condicionado

Site estático, sem build e sem `npm install`. three.js 0.160.0 e MindAR 1.2.5 vêm do CDN jsDelivr (importmap no fim de cada HTML; os módulos em `js/` usam o mesmo importmap).

## Arquivos

- `index.html`: tour 3D (planta em corte, 5 passos). Só a marcação; o código fica em `js/tour/`.
- `ar.html`: fluxos em cima das fotos, modo "Sem câmera" (foto em 3D) e "Usar câmera" (MindAR). Só a marcação; o código fica em `js/ar/`.
- `css/`: `base.css` (tokens e layout comum), `nav.css` (troca de página e hambúrguer), `tour.css` e `ar.css` (só de cada página).
- `js/shared/`: o que as duas páginas usam: `palette.js` (cores dos fluxos, que repetem os tokens do `base.css`; mude nos dois), `particles.js` (partículas correndo por curvas), `page-nav.js`, `hash.js` (links diretos `#passo-3`, `#foto-2`), `i18n.js` (troca PT/EN: a escolha fica no navegador, padrão EN, `?lang=pt` força pelo link) com os textos fixos em `strings.js`, e `dom.js`. Os textos dos passos e das fotos ficam em `{ pt, en }` dentro de `steps.js` e `targets.js`.
- `js/tour/`: `steps.js` (textos, câmeras e flags de cada passo), `building.js` (geometria; constantes `FLOOR`, `CEIL`, `ROOF`), `flows.js` (os 5 fluxos), `labels.js`, `camera-rig.js`, `panel.js` e `main.js`, que liga tudo.
- `js/ar/`: `targets.js` (tudo de cada foto: arquivo, textos, legenda e `flows()`, com coordenadas em pixels da foto original de 474 px de largura e `z` = quanto o fluxo sai da foto, em larguras da foto), `overlay.js`, `panel.js`, `demo-view.js` e `camera-view.js` (os dois modos, ambos com `start()`/`stop()`) e `main.js`.
- `alvos.mind`: arquivo de rastreamento das 4 fotos, nesta ordem: 1-telhado, 2-chiller, 3-sala, 4-corredor-quente. A ordem tem que bater com `TARGETS` em `js/ar/targets.js`.
- `alvos/`: as fotos. São as mesmas que vão nos slides do Carlos, sem cortar.
- `_headers`: pede para buscadores não indexarem (Netlify).

## Rodar local

- Notebook: VS Code com a extensão Live Server (ou `npx serve .`). Em `localhost` a câmera funciona.
- Celular: a câmera exige HTTPS. No VS Code, aba Ports, "Forward a Port" na porta do Live Server e deixe a visibilidade como Public. O VS Code gera um link https para abrir no celular.
- Abrir o HTML com duplo clique (file://) não funciona: o navegador bloqueia os módulos e as imagens.

## Trocar ou adicionar fotos

1. Coloque a foto em `alvos/`.
2. Gere um novo `alvos.mind` com todas as fotos, na ordem certa, no compilador do MindAR: https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Adicione ou ajuste a entrada em `TARGETS` em `js/ar/targets.js` (mesma posição da foto no compilador) e desenhe os fluxos em `flows()`. Abas, legenda e os dois modos se ajustam sozinhos.

Fotos com bastante detalhe e contraste rastreiam melhor. Fotos lisas (céu, parede branca) rastreiam mal.

## Deploy

Netlify: Sites, Add new site, Deploy manually, e arraste esta pasta. Para atualizar, arraste de novo em Deploys (o link continua o mesmo).

## Pendências

- Testar no celular de verdade, apontando para a tela do notebook (reflexo e brilho).
- Gravar um vídeo de 30 a 60 s do modo sem câmera como plano B do pitch.
- As fotos são da internet (York, Vertiv etc.): ok para o pitch interno, não para uso público.
- Prazo: 29/10, meia-noite.
