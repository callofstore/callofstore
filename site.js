/* ============================
   CALL OF STORE - style.css
   (cola inteiro no seu CSS)
   ============================ */

/* RESET + BASE */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: #0a0a12;
  color: #e9e9ee;
  overflow-x: hidden;
}

/* VARIÁVEIS (cores/efeitos) */
:root{
  --primary-color: #ff2a2a;
  --accent-color: #ff6b6b;
  --bg-0: #070710;
  --bg-1: #0b0b16;
  --bg-2: #121226;

  --card: rgba(18,18,34,.72);
  --card-2: rgba(18,18,34,.88);
  --border: rgba(255,255,255,.10);

  --text: #e9e9ee;
  --muted: rgba(233,233,238,.70);

  --shadow: 0 10px 30px rgba(0,0,0,.45);
  --shadow-red: 0 14px 40px rgba(255,42,42,.18);

  --radius: 18px;
  --radius-lg: 24px;
}

/* SELEÇÃO */
::selection{
  background: rgba(255,42,42,.35);
  color: #fff;
}

/* LINKS */
a{ color: inherit; text-decoration: none; }
a:hover{ opacity: .95; }

/* SCROLLBAR (Chrome/Edge) */
::-webkit-scrollbar{ width: 10px; }
::-webkit-scrollbar-track{ background: rgba(255,255,255,.04); }
::-webkit-scrollbar-thumb{
  background: rgba(255,42,42,.35);
  border-radius: 999px;
  border: 2px solid rgba(0,0,0,.25);
}
::-webkit-scrollbar-thumb:hover{ background: rgba(255,42,42,.55); }

/* ============================
   FUNDO: VÍDEO + ESTRELAS
   ============================ */

.video-background{
  position: fixed;
  inset: 0;
  z-index: -3;
  overflow: hidden;
  background: radial-gradient(1200px 700px at 20% 10%, rgba(255,42,42,.18), transparent 55%),
              radial-gradient(900px 600px at 80% 20%, rgba(255,107,107,.14), transparent 60%),
              linear-gradient(135deg, var(--bg-0), var(--bg-2));
}
#bg-video{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.05) brightness(.85);
  opacity: .55;
  transform: scale(1.02);
}
.video-background::after{
  content:"";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.75));
  z-index: 1;
  pointer-events: none;
}
#stars-bg{
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  overflow: hidden;
}

/* Estrelas */
.star{
  position: absolute;
  border-radius: 50%;
  filter: blur(.2px);
  will-change: transform, opacity;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: paused; /* JS seta running */
}

/* ============================
   TRAIL DO MOUSE
   ============================ */

.trail-container{
  position: fixed;
  inset: 0;
  z-index: 99998;
  pointer-events: none;
  overflow: hidden;
}
.trail-particle{
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(0,0,0) scale(1);
  will-change: transform, opacity;
  animation: trailPop .6s ease-out forwards;
}
@keyframes trailPop{
  0%{
    opacity: 0;
    transform: translate3d(0,0,0) scale(.6);
  }
  10%{ opacity: 1; }
  100%{
    opacity: 0;
    transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--rot)) scale(1.25);
    filter: blur(.4px);
  }
}

/* Rainbow (default) */
.trail-particle.rainbow{
  background: radial-gradient(circle at 30% 30%,
    #fff, #ff2a2a 35%, #ff6b6b 55%, rgba(255,255,255,.15) 70%);
  box-shadow: 0 0 10px rgba(255,42,42,.35);
}

/* Fire (quando passa em .special-section) */
.trail-particle.fire{
  background: radial-gradient(circle at 30% 30%,
    #fff, #ff5500 40%, #ff2a2a 65%, rgba(255,255,255,.12) 78%);
  box-shadow: 0 0 14px rgba(255,85,0,.35), 0 0 22px rgba(255,42,42,.18);
}

/* ============================
   HEADER / NAV
   ============================ */

#main-header{
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(10,10,18,.35);
  border-bottom: 1px solid rgba(255,255,255,.06);
  transition: background .25s ease, box-shadow .25s ease;
}
#main-header.scrolled{
  background: rgba(10,10,18,.70);
  box-shadow: 0 12px 30px rgba(0,0,0,.35);
}
.header-container{
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand{
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: .5px;
}
.brand .logo{
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, #fff, var(--primary-color) 40%, #8a0000 85%);
  box-shadow: 0 10px 26px rgba(255,42,42,.25);
}
.brand span{
  font-size: 1.05rem;
}
nav ul{
  list-style: none;
  display: flex;
  align-items: center;
  gap: 14px;
}
nav ul li a{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  color: rgba(233,233,238,.90);
  transition: background .2s ease, transform .2s ease, color .2s ease;
}
nav ul li a:hover{
  background: rgba(255,255,255,.06);
  color: #fff;
  transform: translateY(-1px);
}
.mobile-menu{
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
  box-shadow: var(--shadow);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.mobile-menu i{
  font-size: 18px;
  color: #fff;
}

/* MENU MOBILE */
@media (max-width: 860px){
  .mobile-menu{ display: inline-flex; }
  nav ul{
    position: absolute;
    top: 70px;
    right: 16px;
    width: min(320px, calc(100% - 32px));
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    padding: 10px;
    border-radius: 18px;
    background: rgba(10,10,18,.88);
    border: 1px solid rgba(255,255,255,.10);
    box-shadow: 0 18px 40px rgba(0,0,0,.5);
    display: none;
  }
  nav ul.show{ display: flex; }
  nav ul li a{ width: 100%; justify-content: flex-start; }
}

/* ============================
   HERO
   ============================ */

.hero{
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 70px 0 28px;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 28px;
  align-items: center;
}
.hero h1{
  font-size: clamp(2rem, 3.2vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: .2px;
  text-shadow: 0 16px 35px rgba(0,0,0,.55);
}
.hero p{
  margin-top: 12px;
  color: var(--muted);
  line-height: 1.6;
  max-width: 55ch;
}
.hero .cta-row{
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.05);
  color: #fff;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.btn:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  background: rgba(255,255,255,.07);
}
.btn.primary{
  border: 1px solid rgba(255,42,42,.35);
  background: linear-gradient(135deg, rgba(255,42,42,.95), rgba(160,0,0,.95));
  box-shadow: var(--shadow-red);
}
.btn.primary:hover{ box-shadow: 0 18px 50px rgba(255,42,42,.22); }

.hero-card{
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;
}
.hero-card::before{
  content:"";
  position: absolute;
  inset: -120px;
  background: radial-gradient(circle at 20% 20%, rgba(255,42,42,.25), transparent 40%),
              radial-gradient(circle at 80% 35%, rgba(255,107,107,.18), transparent 45%);
  filter: blur(10px);
}
.hero-card .inner{
  position: relative;
  padding: 22px;
}
.hero-card .mini{
  display: grid;
  gap: 10px;
}
.hero-card .pill{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.10);
  color: rgba(233,233,238,.92);
}
.hero-card .pill i{ color: var(--primary-color); }

@media (max-width: 980px){
  .hero{ grid-template-columns: 1fr; padding-top: 46px; }
}

/* ============================
   SEÇÕES / CONTAINER
   ============================ */

.section{
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 48px;
}
.section-title{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.section-title h2{
  font-size: 1.35rem;
  letter-spacing: .2px;
}
.section-title p{
  color: var(--muted);
  font-size: .95rem;
}

/* zona “especial” pro mouse trail virar fire */
.special-section{
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,42,42,.22);
  background: linear-gradient(180deg, rgba(255,42,42,.10), rgba(255,255,255,.02));
  box-shadow: 0 18px 50px rgba(255,42,42,.10);
  padding: 18px;
}

/* ============================
   FILTROS / BUSCA
   ============================ */

.filters-bar{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 14px;
}
#filterButtons{
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-btn{
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
  color: rgba(233,233,238,.90);
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, border-color .2s ease;
  font-weight: 700;
  font-size: .92rem;
}
.filter-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.07);
}
.filter-btn.active{
  background: linear-gradient(135deg, rgba(255,42,42,.92), rgba(155,0,0,.92));
  border-color: rgba(255,42,42,.35);
  box-shadow: 0 14px 35px rgba(255,42,42,.18);
  color: #fff;
}
.search-wrap{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.22);
  min-width: min(360px, 100%);
}
.search-wrap i{
  color: rgba(255,255,255,.65);
}
#searchInput{
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: .95rem;
}
#searchInput::placeholder{
  color: rgba(255,255,255,.55);
}
#searchResultsInfo{
  margin-top: 6px;
  color: #aaa;
  font-size: .92rem;
}

/* ============================
   GRID DE JOGOS
   ============================ */

#games-grid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 14px;
}
@media (max-width: 1100px){
  #games-grid{ grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 860px){
  #games-grid{ grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px){
  #games-grid{ grid-template-columns: 1fr; }
}

/* CARD */
.game-card{
  position: relative;
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
  border: 1px solid rgba(255,255,255,.10);
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  min-height: 330px;
  transform: translateZ(0);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.game-card:hover{
  transform: translateY(-4px);
  box-shadow: 0 18px 55px rgba(0,0,0,.55);
  border-color: rgba(255,42,42,.22);
}
.game-card.hidden{
  opacity: 0;
  transform: scale(.96);
  pointer-events: none;
}
.game-card.visible{
  opacity: 1;
  transform: scale(1);
}

.game-img{
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
  filter: saturate(1.05) contrast(1.03) brightness(.92);
}
.game-card::after{
  content:"";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.65));
  pointer-events: none;
}

/* DESCONTO */
.discount-badge{
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: .85rem;
  color: #fff;
  background: linear-gradient(135deg, rgba(255,42,42,.95), rgba(150,0,0,.95));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 14px 30px rgba(255,42,42,.22);
}

/* INFOS */
.game-info{
  position: relative;
  z-index: 2;
  padding: 14px 14px 16px;
  display: grid;
  gap: 10px;
  flex: 1;
}
.game-title{
  font-size: 1.0rem;
  font-weight: 900;
  letter-spacing: .2px;
  line-height: 1.2;
}
.game-price{
  display: flex;
  align-items: center;
  gap: 10px;
}
.current-price{
  font-size: 1.15rem;
  font-weight: 900;
  color: #fff;
}
.original-price{
  font-size: .92rem;
  color: rgba(233,233,238,.65);
  text-decoration: line-through;
}

/* BOTÕES */
.buy-btn{
  width: 100%;
  border: none;
  cursor: pointer;
  border-radius: 14px;
  padding: 12px 12px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, rgba(255,42,42,.95), rgba(155,0,0,.95));
  box-shadow: 0 14px 35px rgba(255,42,42,.14);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.buy-btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 18px 45px rgba(255,42,42,.20);
  filter: saturate(1.05);
}
.buy-btn:active{ transform: translateY(0); }

/* ============================
   MODAIS (Discord / Infos / Game)
   ============================ */

/* overlay base */
.modal,
.modal-info,
.game-modal{
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 99990;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(8px);
}

/* conteúdo */
.modal-content{
  width: min(760px, 100%);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(18,18,34,.92), rgba(10,10,18,.92));
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: 0 24px 70px rgba(0,0,0,.55);
  overflow: hidden;
  position: relative;
}
.modal-content::before{
  content:"";
  position: absolute;
  inset: -120px;
  background: radial-gradient(circle at 20% 20%, rgba(255,42,42,.22), transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(255,107,107,.14), transparent 45%);
  filter: blur(12px);
}
.modal-inner{
  position: relative;
  padding: 18px;
}
.modal-header{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.modal-header h3{
  font-size: 1.15rem;
  font-weight: 900;
}
.modal-close{
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform .2s ease, background .2s ease;
}
.modal-close:hover{
  transform: translateY(-2px);
  background: rgba(255,255,255,.08);
}

/* Modal do jogo */
.game-modal .modal-content{ width: min(920px, 100%); }
.game-modal .game-top{
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
}
@media (max-width: 760px){
  .game-modal .game-top{ grid-template-columns: 1fr; }
}
#modalImage{
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.10);
}
.game-meta h2{
  font-size: 1.45rem;
  font-weight: 1000;
  line-height: 1.15;
}
.game-meta .prices{
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
#modalPrice{
  font-size: 1.35rem;
  font-weight: 1000;
  color: #fff;
}
#modalOriginalPrice{
  color: rgba(233,233,238,.65);
  text-decoration: line-through;
}
.modal-actions{
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.modal-actions .btn{
  flex: 1;
  min-width: 190px;
}
.btn.ghost{
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
}

/* Requisitos */
#modalRequirements{
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
@media (max-width: 900px){
  #modalRequirements{ grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px){
  #modalRequirements{ grid-template-columns: 1fr; }
}
.requirement-item{
  border-radius: 16px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.22);
}
.requirement-item h4{
  font-size: .92rem;
  color: rgba(255,255,255,.92);
  margin-bottom: 6px;
}
.requirement-item p{
  font-size: .88rem;
  color: rgba(233,233,238,.72);
  line-height: 1.35;
}

/* Modal Discord */
.discord-box{
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.22);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.discord-box .cmd{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: .95rem;
  padding: 12px;
  border-radius: 14px;
  border: 1px dashed rgba(255,255,255,.18);
  background: rgba(0,0,0,.25);
  color: #fff;
  overflow: auto;
}
.small-muted{
  color: rgba(233,233,238,.72);
  font-size: .92rem;
  line-height: 1.5;
}

/* ============================
   SIDEBAR SOCIAL (se existir)
   ============================ */

.social-sidebar{
  position: fixed;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  display: grid;
  gap: 10px;
}
.social-sidebar a{
  width: 46px;
  height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  box-shadow: var(--shadow);
  display: grid;
  place-items: center;
  color: #fff;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity .25s ease, transform .25s ease, background .2s ease;
}
.social-sidebar a.visible{
  opacity: 1;
  transform: translateX(0);
}
.social-sidebar a:hover{
  background: rgba(255,42,42,.18);
}
@media (max-width: 860px){
  .social-sidebar{ display: none; }
}

/* ============================
   TELA DE LOADING
   ============================ */

#loading-screen{
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: grid;
  place-items: center;
  background: radial-gradient(1100px 700px at 30% 20%, rgba(255,42,42,.18), transparent 55%),
              linear-gradient(135deg, #070710, #121226);
}
#loading-screen.loaded{
  animation: fadeOut .5s ease forwards;
}
@keyframes fadeOut{
  to{ opacity: 0; transform: scale(1.02); }
}
.loading-box{
  width: min(520px, calc(100% - 32px));
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.28);
  backdrop-filter: blur(10px);
  box-shadow: 0 26px 80px rgba(0,0,0,.6);
  padding: 20px;
  text-align: center;
}
.loading-title{
  font-weight: 1000;
  letter-spacing: .4px;
  font-size: 1.15rem;
}
.loading-sub{
  margin-top: 8px;
  color: rgba(233,233,238,.70);
  font-size: .95rem;
}
.loading-bar{
  margin-top: 14px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  overflow: hidden;
}
.loading-progress{
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,42,42,.95), rgba(255,107,107,.95));
  box-shadow: 0 0 22px rgba(255,42,42,.20);
  transition: width .25s ease;
}
body.loading-active{
  overflow: hidden !important;
}

/* ============================
   ANIMAÇÕES (JS usa .visible)
   ============================ */

.fade-in-fast{
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .35s ease, transform .35s ease;
}
.fade-in-fast.visible{
  opacity: 1;
  transform: translateY(0);
}

.fade-up-fast{
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .45s ease, transform .45s ease;
}
.fade-up-fast.visible{
  opacity: 1;
  transform: translateY(0);
}

.scale-in-fast{
  opacity: 0;
  transform: scale(.96);
  transition: opacity .45s ease, transform .45s ease;
  transition-delay: calc(var(--i, 0) * 0.03s);
}
.scale-in-fast.visible{
  opacity: 1;
  transform: scale(1);
}

.slide-left-fast{
  opacity: 0;
  transform: translateX(-18px);
  transition: opacity .45s ease, transform .45s ease;
}
.slide-left-fast.visible{
  opacity: 1;
  transform: translateX(0);
}

.slide-right-fast{
  opacity: 0;
  transform: translateX(18px);
  transition: opacity .45s ease, transform .45s ease;
}
.slide-right-fast.visible{
  opacity: 1;
  transform: translateX(0);
}

.rotate-in{
  opacity: 0;
  transform: rotate(-6deg) scale(.98);
  transition: opacity .45s ease, transform .45s ease;
}
.rotate-in.visible{
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* ============================
   FOOTER (se tiver)
   ============================ */

.footer{
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 44px;
  color: rgba(233,233,238,.70);
  border-top: 1px solid rgba(255,255,255,.06);
}
.footer .row{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}
.footer .muted{ color: rgba(233,233,238,.60); }

/* ============================
   UTILITÁRIOS
   ============================ */

.glow{
  box-shadow: 0 0 0 1px rgba(255,42,42,.22),
              0 20px 70px rgba(255,42,42,.12);
}
.badge{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  color: rgba(233,233,238,.85);
  font-weight: 800;
  font-size: .85rem;
}
hr.sep{
  border: none;
  height: 1px;
  background: rgba(255,255,255,.08);
  margin: 14px 0;
}

/* Botão do play do vídeo (JS cria com inline, mas deixo aqui também) */
.video-play-btn{
  border-radius: 999px !important;
}

/* Ajuste: em telas pequenas o vídeo some (JS já faz, mas reforço) */
@media (max-width: 768px){
  #bg-video{ display: none; }
  .video-background{ background: linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%); }
}
