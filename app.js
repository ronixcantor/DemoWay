/*
 DemoWay — Juego educativo offline
 Estructura: index.html + styles.css + app.js
 Hecho en JavaScript nativo: sin dependencias externas.
*/
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const escapeHTML = text => String(text).replace(/[&<>"']/g, chr => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[chr]));

const COLORS = ['#5d88ef', '#fa7b77', '#35b995', '#9b75dc'];
const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const ICONS = {inicio:'🏫',meta:'🏛️',reto:'❔',constitucion:'⚖️',voto:'🗳️',bonus:'⚡',obstaculo:'🚧',normal:'🌳'};
const TITLES = {inicio:'Inicio',meta:'Meta',reto:'Reto ciudadano',constitucion:'Constitución',voto:'Votación',bonus:'Avance bonus',obstaculo:'Obstáculo',normal:'Camino libre'};
const PATTERN = ['inicio','reto','normal','bonus','voto','constitucion','obstaculo','reto','normal','bonus','voto','constitucion','reto','normal','obstaculo','voto','bonus','constitucion','reto','normal','voto','bonus','obstaculo','constitucion','reto','normal','bonus','voto','reto','meta'];

const QUESTIONS = [
  {kind:'reto',q:'Una estudiante no puede participar en una actividad por su género. ¿Qué principio se está afectando?',a:['La igualdad','La propiedad privada','La movilidad'],correct:0,why:'El artículo 13 de la Constitución reconoce la igualdad ante la ley y prohíbe la discriminación.'},
  {kind:'reto',q:'El colegio quiere escuchar propuestas para mejorar los espacios comunes. ¿Qué acción fortalece la democracia?',a:['Decidirlo sin consultar','Abrir un espacio de participación','Prohibir opiniones diferentes'],correct:1,why:'Participar y escuchar propuestas contribuye a tomar decisiones más incluyentes.'},
  {kind:'reto',q:'Una persona publica una opinión respetuosa sobre un problema de su ciudad. ¿Qué derecho está ejerciendo?',a:['Derecho a la herencia','Libertad de expresión','Derecho a contratar'],correct:1,why:'El artículo 20 protege la libertad de expresar y difundir pensamientos y opiniones.'},
  {kind:'reto',q:'Una comunidad quiere proteger el parque de su barrio. ¿Qué es lo más democrático?',a:['Organizarse y dialogar con la alcaldía','No dejar hablar a los vecinos','Tomar decisiones en secreto'],correct:0,why:'La participación de la comunidad y el diálogo con las autoridades favorecen el interés colectivo.'},
  {kind:'reto',q:'En un grupo de clase hay opiniones distintas. ¿Cuál es la mejor respuesta?',a:['Excluir a quien discrepe','Escuchar y acordar reglas justas','Imponer la opinión más fuerte'],correct:1,why:'El respeto por el pluralismo permite convivir y decidir con personas que piensan diferente.'},
  {kind:'reto',q:'Una entidad recopila datos personales de alguien. ¿Qué derecho debe respetar?',a:['La privacidad y protección de datos','El derecho a conducir','La libertad de comercio'],correct:0,why:'El artículo 15 protege la intimidad y el derecho a conocer, actualizar y rectificar datos personales.'},
  {kind:'reto',q:'Una persona es sancionada sin poder explicar su versión. ¿Qué garantía está comprometida?',a:['La libre competencia','El debido proceso','La propiedad intelectual'],correct:1,why:'El artículo 29 establece garantías del debido proceso también en actuaciones administrativas.'},
  {kind:'reto',q:'Un grupo quiere organizar un debate pacífico sobre decisiones públicas. ¿Qué derecho es más relevante?',a:['La reunión y manifestación pacífica','El derecho de autor','La propiedad privada'],correct:0,why:'El artículo 37 reconoce el derecho de reunión y manifestación pública y pacífica.'},
  {kind:'reto',q:'¿Cuál de estas acciones muestra un deber ciudadano?',a:['Respetar los derechos de los demás','Impedir todas las votaciones','Ignorar las normas de convivencia'],correct:0,why:'El artículo 95 incluye el respeto por los derechos ajenos y la participación en la vida cívica.'},
  {kind:'reto',q:'¿Qué es una decisión más justa para un concurso universitario?',a:['Elegir a los amigos del jurado','Definir criterios públicos e iguales','Cambiar reglas después del resultado'],correct:1,why:'Los criterios claros e iguales ayudan a evitar la arbitrariedad y la discriminación.'},
  {kind:'reto',q:'Una clase elige representante. ¿Qué hace legítima la elección?',a:['Que solo vote el profesor','Que participen los estudiantes habilitados','Que gane siempre el mismo'],correct:1,why:'La elección debe respetar reglas claras y permitir participar a quienes tienen derecho al voto.'},
  {kind:'reto',q:'¿Qué se debería hacer ante una noticia política dudosa?',a:['Compartirla sin verificar','Comprobar fuentes antes de difundirla','Atacar a quien pregunte'],correct:1,why:'Verificar la información ayuda a tomar decisiones informadas y evita la desinformación.'},
  {kind:'constitucion',q:'¿En qué año se promulgó la Constitución Política vigente de Colombia?',a:['1811','1886','1991'],correct:2,why:'La Constitución Política actual fue promulgada en 1991.'},
  {kind:'constitucion',q:'¿Cuál es la norma de mayor jerarquía en Colombia?',a:['Un reglamento escolar','La Constitución Política','Una resolución municipal'],correct:1,why:'El artículo 4 establece que la Constitución es norma de normas.'},
  {kind:'constitucion',q:'¿Qué mecanismo permite pedir protección inmediata de derechos fundamentales, en los casos previstos?',a:['La acción de tutela','Un concurso público','Una encuesta'],correct:0,why:'La acción de tutela está consagrada en el artículo 86 de la Constitución.'},
  {kind:'constitucion',q:'¿Qué artículo reconoce el derecho de petición?',a:['El artículo 23','El artículo 100','El artículo 200'],correct:0,why:'El artículo 23 reconoce el derecho a presentar peticiones respetuosas y obtener pronta resolución.'},
  {kind:'constitucion',q:'La Constitución de 1991 define a Colombia como…',a:['Un Estado social de derecho','Una monarquía absoluta','Una confederación colonial'],correct:0,why:'El artículo 1 define a Colombia como un Estado social de derecho, democrático, participativo y pluralista.'},
  {kind:'constitucion',q:'¿Cuál de estas instituciones fue creada por la Constitución de 1991?',a:['La Corte Constitucional','El Virreinato de la Nueva Granada','El Congreso de Angostura'],correct:0,why:'La Constitución de 1991 creó la Corte Constitucional, que protege la supremacía constitucional.'},
  {kind:'constitucion',q:'¿Qué reconoce el artículo 7 de la Constitución?',a:['La diversidad étnica y cultural de la Nación','La prohibición de todos los debates','El voto obligatorio en todas las elecciones'],correct:0,why:'El artículo 7 reconoce y protege la diversidad étnica y cultural de la Nación colombiana.'},
  {kind:'constitucion',q:'¿Cuál de estos derechos está expresamente reconocido en el artículo 67?',a:['La educación','Elegir cualquier sanción','Tener empleo garantizado'],correct:0,why:'El artículo 67 reconoce la educación como derecho y servicio público con función social.'},
  {kind:'constitucion',q:'¿Qué Constitución precedió a la de 1991?',a:['La de 1886','La de 2005','La de 1820'],correct:0,why:'La Constitución de 1886 fue el texto anterior, aunque recibió numerosas reformas.'},
  {kind:'constitucion',q:'La acción de tutela protege principalmente…',a:['Derechos fundamentales','Solamente bienes comerciales','Cualquier preferencia personal'],correct:0,why:'La tutela busca proteger derechos constitucionales fundamentales cuando se cumplen sus requisitos.'}
];

const VOTES = [
  {q:'El barrio tiene recursos para mejorar un solo espacio. ¿Cuál es la mejor forma de decidir?',a:['Que la autoridad decida sin explicar','Escuchar propuestas y votar con reglas claras','Elegir por sorteo sin escuchar a nadie'],correct:1,why:'La información y la participación permiten decisiones colectivas mejor fundamentadas.'},
  {q:'Un grupo quiere cambiar las reglas de convivencia. ¿Qué debería hacerse?',a:['Acordar las reglas con participación del grupo','Ocultar las reglas nuevas','Excluir a quienes no están de acuerdo'],correct:0,why:'Las normas compartidas son más legítimas cuando existen diálogo, participación y respeto.'},
  {q:'En una reunión, una minoría propone una idea diferente. ¿Cómo debería responder la mayoría?',a:['Ignorarla por ser minoría','Escucharla y respetar sus derechos','Prohibirle volver a participar'],correct:1,why:'La democracia protege la participación y los derechos de las minorías, no solo a la mayoría.'},
  {q:'La comunidad necesita solucionar un conflicto ambiental. ¿Cuál camino es preferible?',a:['Dialogar, informarse y participar','Atacar a las personas con otras opiniones','No permitir preguntas'],correct:0,why:'El diálogo y la información favorecen soluciones participativas y respetuosas del ambiente.'},
  {q:'En una votación hay un empate. ¿Qué es lo más democrático?',a:['Declarar ganador al más popular','Aplicar la regla acordada antes de votar','Cambiar la regla después del resultado'],correct:1,why:'Las reglas deben definirse con anticipación, ser claras y aplicarse por igual.'}
];

const TUTORIAL = [
  {heading:'¡Hola, ciudadano!',text:'Soy Mocra, tu búho profesor. En DemoWay viajaremos por una ciudad llena de derechos, retos y decisiones. ¡Te guiaré durante toda la partida!',icon:'👋 🦉'},
  {heading:'Lanza el dado y avanza',text:'Cada persona tiene una ficha de color. Cuando llegue su turno, toca “Lanzar dado”. La ficha se moverá por el camino y descubrirá una nueva casilla.',icon:'🎲 ➜ 🧩'},
  {heading:'Descubre casillas especiales',text:'❔ y ⚖️ son preguntas, 🗳️ invita a votar, ⚡ te impulsa hacia delante y 🚧 te hace retroceder. ¡Cada casilla tiene una sorpresa!',icon:'❔ 🗳️ ⚡'},
  {heading:'Decidir también es participar',text:'En las votaciones, todas las personas eligen una opción por turnos. Después conocerán la explicación y los puntos obtenidos.',icon:'🙋 🗳️ 🤝'},
  {heading:'¡Vamos a la meta!',text:'En Modo Expo cada persona juega 3 turnos y gana quien acumule más puntos (los avances desempatan). En Aventura completa gana quien llegue primero a la Plaza de la Constitución.',icon:'🏁 🏆 ✨'}
];

const state = {
  selectedMode:'expo', playerCount:2, sound:true, screen:'home', players:[], current:0, turns:0,
  phase:'idle', mode:'expo', nodes:[], recentNode:-1, usedQuestions:new Set(), usedVotes:new Set(),
  modalClosable:true, modalOnClose:null, tourIndex:0, tourAfter:null, started:false
};
let audioCtx;
let toastTimeout;

function sound(freq = 570, len = .09, type = 'sine', gain = .055) {
  if (!state.sound) return;
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    if (!audioCtx) audioCtx = new Context();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator(); const volume = audioCtx.createGain();
    oscillator.type = type; oscillator.frequency.value = freq;
    volume.gain.setValueAtTime(gain, audioCtx.currentTime);
    volume.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + len);
    oscillator.connect(volume); volume.connect(audioCtx.destination);
    oscillator.start(); oscillator.stop(audioCtx.currentTime + len);
  } catch (_) { /* El juego sigue funcionando si el navegador bloquea el audio. */ }
}
function soundCorrect(){sound(490,.14);setTimeout(()=>sound(660,.16),115)}
function soundWrong(){sound(260,.16,'triangle')}
function toast(message){const el = $('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2500)}
function mountOwls(root=document){$$('[data-mocra]',root).forEach(target=>{if(!target.firstChild)target.appendChild($('#mocraTemplate').content.firstElementChild.cloneNode(true))})}
function switchScreen(name){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===`screen-${name}`));state.screen=name;window.scrollTo({top:0,behavior:'instant'});if(name==='game')renderGame()}
function saveSound(){try{localStorage.setItem('demoway-sound',state.sound?'on':'off')}catch(_){}}
function readSound(){try{return localStorage.getItem('demoway-sound')!=='off'}catch(_){return true}}
function updateSound(){const btn=$('#soundBtn');btn.textContent=state.sound?'♫':'♪̸';btn.setAttribute('aria-pressed',String(state.sound));btn.setAttribute('title',state.sound?'Silenciar sonidos':'Activar sonidos')}
function setupInputs(){
  $('#playerNumber').textContent=state.playerCount;
  $('#playersRange').value=state.playerCount;
  const container=$('#nameInputs');const previous=$$('input',container).map(x=>x.value);
  container.replaceChildren();
  for(let i=0;i<state.playerCount;i++){
    const label=document.createElement('div');label.className='player-input';
    const circle=document.createElement('i');circle.className='player-color';circle.style.background=COLORS[i];
    const box=document.createElement('div');box.style.flex='1';box.style.minWidth='0';
    const caption=document.createElement('label');caption.textContent=`JUGADOR ${i+1}`;caption.setAttribute('for',`name${i}`);
    const inp=document.createElement('input');inp.id=`name${i}`;inp.maxLength=18;inp.value=previous[i]||`Jugador ${i+1}`;inp.autocomplete='off';inp.setAttribute('aria-label',`Nombre del jugador ${i+1}`);
    box.append(caption,inp);label.append(circle,box);container.append(label);
  }
}
function setPlayerCount(next){state.playerCount=Math.max(1,Math.min(4,next));setupInputs();sound(420,.06)}
function setMode(mode){state.selectedMode=mode;$$('[data-mode]').forEach(btn=>{const active=btn.dataset.mode===mode;btn.classList.toggle('selected',active);btn.setAttribute('aria-checked',String(active))});sound(450,.07)}

function openModal(tag,html,{closeable=true,onClose=null}={}){
  state.modalClosable=closeable;state.modalOnClose=onClose;
  $('#modalTag').textContent=tag;$('#modalContent').innerHTML=html;$('#modalRoot').hidden=false;
  $('#modalClose').hidden=!closeable;$('#modalDialog').focus({preventScroll:true});
}
function closeModal(){if(!state.modalClosable)return;$('#modalRoot').hidden=true;$('#modalContent').replaceChildren();const callback=state.modalOnClose;state.modalOnClose=null;if(callback)callback()}
function forceCloseModal(){$('#modalRoot').hidden=true;$('#modalContent').replaceChildren();state.modalOnClose=null;state.modalClosable=true}
function mainModalButton(selector,cb){const btn=$(selector,$('#modalContent'));if(btn)btn.addEventListener('click',cb)}

function tutorialScreen(){
  const slide=TUTORIAL[state.tourIndex];
  openModal(`TUTORIAL · ${state.tourIndex+1} DE ${TUTORIAL.length}`,
    `<div class="tutorial-content"><div class="mocra-mount" data-mocra></div><div class="tutorial-icons">${slide.icon}</div><h2 id="modalTitle">${slide.heading}</h2><p>${slide.text}</p><div class="progress-dots">${TUTORIAL.map((_,i)=>`<span class="${i===state.tourIndex?'active':''}"></span>`).join('')}</div><div class="modal-actions"><button class="btn btn-outline" id="skipTour">${state.tourAfter?'Saltar tutorial':'Cerrar'}</button><button class="btn btn-primary" id="nextTour">${state.tourIndex===TUTORIAL.length-1?'¡A jugar!':'Siguiente →'}</button></div></div>`,
    {closeable:!state.tourAfter,onClose:null});
  mountOwls($('#modalContent'));
  mainModalButton('#skipTour',finishTutorial);
  mainModalButton('#nextTour',()=>{sound(650,.09);if(state.tourIndex>=TUTORIAL.length-1)finishTutorial();else{state.tourIndex++;tutorialScreen()}});
}
function startTutorial(after=null){state.tourIndex=0;state.tourAfter=after;tutorialScreen()}
function finishTutorial(){const after=state.tourAfter;state.tourAfter=null;forceCloseModal();if(after)after()}

function startGame(){
  state.players=$$('#nameInputs input').slice(0,state.playerCount).map((inp,i)=>({
    name:inp.value.trim()||`Jugador ${i+1}`,color:COLORS[i],position:0,points:0,id:i
  }));
  state.mode=state.selectedMode;state.nodes=makeNodes(state.mode==='expo'?18:30);
  state.current=0;state.turns=0;state.phase='idle';state.recentNode=-1;state.usedQuestions.clear();state.usedVotes.clear();state.started=true;
  $('#die').textContent='⚄';setMocra('¡Comienza la aventura! Cada decisión es una oportunidad de aprender.');
  switchScreen('game');toast('¡Bienvenidos a la ciudad de DemoWay!');soundCorrect();
}
function makeNodes(total){return Array.from({length:total},(_,i)=>({index:i,type:i===0?'inicio':i===total-1?'meta':PATTERN[i]}))}
function getGridPosition(i,total,mobile){
  const cols=mobile?4:6;const row=Math.floor(i/cols),col=i%cols;
  const rows=Math.ceil(total/cols),reverse=row%2===1;
  const xIndex=reverse?(cols-1-col):col;
  return {x:9+xIndex*(82/(cols-1)),y:rows===1?50:11+row*(78/(rows-1))};
}
function renderBoard(){
  if(!state.nodes.length)return;
  const root=$('#boardMap');const mobile=window.matchMedia('(max-width:640px)').matches;
  const total=state.nodes.length;
  const ratio=mobile?(total===18?.72:.45):(total===18?1.8:1.39);
  root.style.setProperty('--board-ratio',String(ratio));
  root.style.setProperty('--node-size',mobile?(total===18?'41px':'39px'):'clamp(35px, 4.4vw, 58px)');
  const positions=state.nodes.map((node)=>getGridPosition(node.index,total,mobile));
  $('#trailPath').setAttribute('d',positions.map((p,i)=>`${i?'L':'M'} ${p.x*10} ${p.y*10}`).join(' '));
  const nodesRoot=$('#boardNodes');nodesRoot.replaceChildren();
  state.nodes.forEach(node=>{
    const at=positions[node.index];const div=document.createElement('div');
    div.className=`node${node.index===state.recentNode?' recent':''}`;div.dataset.type=node.type;
    div.style.left=`${at.x}%`;div.style.top=`${at.y}%`;
    div.title=`Casilla ${node.index+1}: ${TITLES[node.type]}`;
    div.setAttribute('aria-label',div.title);
    let label='';if(node.type==='inicio')label='INICIO';if(node.type==='meta')label='META';
    div.innerHTML=`<span class="node-number">${node.index+1}</span><span class="node-emoji">${ICONS[node.type]}</span>${label?`<span class="node-label">${label}</span>`:''}`;
    const present=state.players.filter(player=>player.position===node.index);
    if(present.length){
      const tokens=document.createElement('div');tokens.className='pawn-stack';
      present.forEach(player=>{const pawn=document.createElement('span');pawn.className=`pawn${player.id===state.current?' active-pawn':''}`;pawn.style.background=player.color;pawn.title=player.name;tokens.append(pawn)});
      div.append(tokens);
    }
    nodesRoot.append(div);
  });
}
function renderGame(){
  if(!state.players.length)return;
  const active=state.players[state.current];
  $('#currentPlayer').innerHTML=`<i class="player-color" style="background:${active.color}"></i><span>${escapeHTML(active.name)}</span>`;
  const round=Math.floor(state.turns/state.players.length)+1;
  $('#roundLabel').textContent=state.mode==='expo'?`Ronda ${Math.min(round,3)} de 3`:'Aventura completa';
  $('#turnsCounter').textContent=`${state.turns} ${state.turns===1?'turno':'turnos'}`;
  $('#rollBtn').disabled=state.phase!=='idle';
  $('#rollBtn').textContent=state.phase==='idle'?'🎲 Lanzar dado':'⏳ En curso…';
  $('#scoreboard').innerHTML=state.players.map(player=>`<div class="player-score ${player.id===state.current?'is-turn':''}"><i class="player-color" style="background:${player.color}"></i><div class="score-name">${escapeHTML(player.name)}<span class="score-progress">Casilla ${player.position+1}/${state.nodes.length}</span></div><span class="score-points">${player.points} pts</span></div>`).join('');
  renderBoard();
}
function setMocra(message){$('#mocraMessage').textContent=message}
function pickUnused(bank,used){const remaining=bank.map((_,i)=>i).filter(i=>!used.has(i));if(!remaining.length){used.clear();return pickUnused(bank,used)}const choice=remaining[Math.floor(Math.random()*remaining.length)];used.add(choice);return bank[choice]}

async function movePlayer(player,amount){
  const target=Math.min(state.nodes.length-1,Math.max(0,player.position+amount));
  const dir=target>=player.position?1:-1;
  while(player.position!==target){player.position+=dir;state.recentNode=player.position;renderGame();sound(370+player.position*16,.055,'triangle',.025);await sleep(165)}
  state.recentNode=-1;renderGame();
}
async function rollDie(){
  if(state.phase!=='idle')return;
  state.phase='rolling';renderGame();$('#turnHint').textContent='Mocra está lanzando el dado…';
  const die=$('#die');die.classList.add('rolling');
  for(let i=0;i<11;i++){die.textContent=FACES[Math.floor(Math.random()*6)];sound(200+i*25,.037,'square',.015);await sleep(70)}
  const roll=Math.floor(Math.random()*6)+1;
  die.textContent=FACES[roll-1];die.classList.remove('rolling');sound(690,.18);
  state.phase='moving';renderGame();$('#turnHint').textContent=`¡Salió ${roll}! Avanzando…`;
  const player=state.players[state.current];await sleep(220);await movePlayer(player,roll);
  if(player.position===state.nodes.length-1){player.points+=25;finishGame(player);return}
  await resolveLanding(player);
}
async function resolveLanding(player){
  const cell=state.nodes[player.position];
  if(cell.type==='reto'||cell.type==='constitucion'){questionModal(cell.type);return}
  if(cell.type==='voto'){voteModal();return}
  if(cell.type==='bonus'){
    player.points+=5;setMocra('¡Encontraste una oportunidad! Avanzas dos casillas y sumas 5 puntos.');
    openModal('CASILLA BONUS',`<div class="event-image">⚡</div><h2 id="modalTitle" class="event-title">¡Impulso ciudadano!</h2><p class="event-text">Cuando participamos y nos informamos, ¡avanzamos juntos! <strong>+5 puntos</strong> y <strong>+2 casillas</strong>.</p><button class="btn btn-primary btn-full" id="eventOk">¡Aprovechar ventaja! ➜</button>`,{closeable:false});
    mainModalButton('#eventOk',async()=>{forceCloseModal();state.phase='moving';await movePlayer(player,2);if(player.position===state.nodes.length-1){player.points+=25;finishGame(player)}else{handleCapture(player);finishTurn()}});return;
  }
  if(cell.type==='obstaculo'){
    setMocra('¡Todos cometemos errores! Lo importante es aprender y volver a intentarlo.');
    openModal('OBSTÁCULO',`<div class="event-image">🚧</div><h2 id="modalTitle" class="event-title">¡Un pequeño tropiezo!</h2><p class="event-text">La falta de diálogo trae dificultades. Retrocedes <strong>2 casillas</strong>, pero sigues en el juego.</p><button class="btn btn-primary btn-full" id="eventOk">Seguir aprendiendo ➜</button>`,{closeable:false});
    mainModalButton('#eventOk',async()=>{forceCloseModal();state.phase='moving';await movePlayer(player,-2);handleCapture(player);finishTurn()});return;
  }
  setMocra('¡Buen avance! Recuerda: los derechos vienen acompañados de deberes.');
  handleCapture(player);await sleep(300);finishTurn();
}
function questionModal(type){
  const player=state.players[state.current];
  const question=pickUnused(QUESTIONS.filter(q=>q.kind===type),state.usedQuestions);
  // Este banco se usa por categoría; las firmas también impiden repetir preguntas.
  const key=question.q; if(!state.seenQuestions)state.seenQuestions=new Set();
  let q=question;
  const available=QUESTIONS.filter(item=>item.kind===type&&!state.seenQuestions.has(item.q));
  if(available.length){q=available[Math.floor(Math.random()*available.length)]}else{state.seenQuestions.clear()}
  state.seenQuestions.add(q.q);
  const isHistory=type==='constitucion';
  setMocra(isHistory?'¿Qué tanto conoces nuestra Constitución?':'¡La ciudadanía se aprende con situaciones cotidianas!');
  const html=`<div class="challenge-top"><span>${isHistory?'⚖️ CONSTITUCIÓN':'❔ RETO CIUDADANO'}</span><span>·</span><span>${escapeHTML(player.name)} responde</span></div><h2 id="modalTitle" class="question-title">${escapeHTML(q.q)}</h2><div class="choices">${q.a.map((answer,i)=>`<button class="choice" data-choice="${i}"><span class="choice-prefix">${'ABC'[i]}</span><span>${escapeHTML(answer)}</span></button>`).join('')}</div><p style="font-size:12px">Elige una opción para descubrir la explicación de Mocra.</p><div id="feedbackArea" aria-live="polite"></div>`;
  openModal(isHistory?'RETO CONSTITUCIONAL':'RETO CIUDADANO',html,{closeable:false});
  $$('.choice',$('#modalContent')).forEach(button=>button.addEventListener('click',()=>{
    const answer=Number(button.dataset.choice);const right=answer===q.correct;
    $$('.choice',$('#modalContent')).forEach(b=>{b.disabled=true;if(Number(b.dataset.choice)===q.correct)b.classList.add('correct');else if(Number(b.dataset.choice)===answer)b.classList.add('incorrect')});
    if(right){player.points+=20;soundCorrect();setMocra('¡Excelente respuesta! Ganaste 20 puntos de ciudadanía.')}else{soundWrong();setMocra('No pasa nada. ¡Lo más importante es comprender por qué!')}
    $('#feedbackArea').innerHTML=`<div class="answer-feedback ${right?'':'wrong'}"><strong>${right?'🎉 ¡Respuesta correcta! +20 puntos':'💡 ¡Aprendamos juntos!'}</strong><p>${escapeHTML(q.why)}</p></div><button class="btn btn-primary btn-full" id="continueQuestion" style="margin-top:15px">Continuar recorrido →</button>`;
    mainModalButton('#continueQuestion',()=>{forceCloseModal();handleCapture(player);finishTurn()});
    renderGame();
  }));
}
function voteModal(){
  const vote=pickUnused(VOTES,state.usedVotes);const order=state.players.map((_,i)=>(state.current+i)%state.players.length);
  const ballots=[];let next=0;
  const render=()=>{
    if(next>=order.length){
      const count=ballots.filter(b=>b.choice===vote.correct).length;
      for(const item of ballots){state.players[item.id].points+=item.choice===vote.correct?10:0}
      if(count>0)soundCorrect();else soundWrong();
      setMocra(`¡Todos participaron! ${count} de ${order.length} eligieron la propuesta más respetuosa de los derechos.`);
      openModal('RESULTADO DE LA VOTACIÓN',`<div class="event-image">🗳️</div><h2 id="modalTitle" class="event-title">¡Cada voto cuenta!</h2><p class="event-text"><strong>${count} de ${order.length}</strong> eligieron la opción más adecuada.</p><div class="answer-feedback"><strong>Respuesta recomendada: ${escapeHTML(vote.a[vote.correct])}</strong><p>${escapeHTML(vote.why)}</p></div><p style="text-align:center;font-size:13px">Cada persona que acertó ganó 10 puntos.</p><button class="btn btn-primary btn-full" id="voteDone">Continuar aventura →</button>`,{closeable:false});
      mainModalButton('#voteDone',()=>{forceCloseModal();handleCapture(state.players[state.current]);finishTurn()});
      renderGame();return;
    }
    const participant=state.players[order[next]];
    openModal(`VOTACIÓN · ${next+1} DE ${order.length}`,`<div class="vote-turn">🗳️ Le toca votar a: ${escapeHTML(participant.name)}</div><h2 id="modalTitle" class="question-title">${escapeHTML(vote.q)}</h2><div class="choices">${vote.a.map((a,i)=>`<button class="choice" data-choice="${i}"><span class="choice-prefix">${'ABC'[i]}</span><span>${escapeHTML(a)}</span></button>`).join('')}</div><p style="font-size:12px">Cuando elijas, pasa el dispositivo a la siguiente persona. Las respuestas se mostrarán al final.</p>`,{closeable:false});
    $$('.choice',$('#modalContent')).forEach(b=>b.addEventListener('click',()=>{ballots.push({id:participant.id,choice:Number(b.dataset.choice)});sound(520,.1);next++;render()}));
  };
  setMocra('En una democracia, ¡la opinión de cada participante importa!');render();
}
function handleCapture(player){
  if(player.position===0||player.position===state.nodes.length-1)return;
  if(state.nodes[player.position].type==='constitucion')return;
  let captures=0;
  state.players.forEach(opponent=>{
    if(opponent.id!==player.id&&opponent.position===player.position){opponent.position=Math.max(0,opponent.position-3);captures++}
  });
  if(captures){player.points+=captures*10;toast(`¡${player.name} capturó ${captures} ficha(s)! +${captures*10} puntos`);soundCorrect();setMocra('¡Una captura! Recuerda competir con respeto.');renderGame()}
}
function finishTurn(){
  state.turns++;
  if(state.mode==='expo'&&state.turns>=state.players.length*3){finishGame();return}
  state.current=(state.current+1)%state.players.length;
  state.phase='idle';$('#turnHint').textContent='¡Tira el dado para avanzar!';renderGame();
}
function finishGame(firstToFinish=null){
  state.phase='ended';const ordered=[...state.players].sort((a,b)=>b.points-a.points||b.position-a.position);
  const champion=firstToFinish||ordered[0];
  const tied=!firstToFinish&&ordered.length>1&&ordered[0].points===ordered[1].points&&ordered[0].position===ordered[1].position;
  $('#endSubtitle').textContent=tied?'¡Hay un empate! Dos o más jugadores comparten el primer lugar.':`${champion.name} ${firstToFinish?'llegó a la Plaza de la Constitución':'obtuvo el mejor resultado'}: ¡felicitaciones!`;
  $('#finalScores').innerHTML=ordered.map((player,i)=>`<div class="final-score"><span>${i===0?'🥇':i===1?'🥈':i===2?'🥉':'✨'} <span style="color:${player.color}">●</span> ${escapeHTML(player.name)}</span><span>${player.points} pts · casilla ${player.position+1}</span></div>`).join('');
  switchScreen('end');soundCorrect();setTimeout(soundCorrect,260);
}
function showInstructions(){openModal('REGLAS DE DEMOWAY',`<h2 id="modalTitle">Reglas para una gran aventura</h2><div class="instructions"><div class="instruction-line"><span class="instruction-icon">🎲</span><div><b>1. Lanza y avanza</b>Por turnos, toca el dado y mueve tu ficha por el camino.</div></div><div class="instruction-line"><span class="instruction-icon">❔</span><div><b>2. Resuelve situaciones</b>Acertar una pregunta te da 20 puntos. Mocra siempre explica la respuesta.</div></div><div class="instruction-line"><span class="instruction-icon">🗳️</span><div><b>3. Vota con el grupo</b>Todos participan al llegar a una casilla de votación. Cada respuesta adecuada otorga 10 puntos.</div></div><div class="instruction-line"><span class="instruction-icon">⚡</span><div><b>4. Descubre efectos</b>Las casillas bonus dan +5 puntos y +2 pasos; los obstáculos hacen retroceder 2. Capturar a otro jugador le hace retroceder 3 y da +10 puntos.</div></div><div class="instruction-line"><span class="instruction-icon">🏆</span><div><b>5. Gana la partida</b>Modo Expo: 3 turnos por jugador, gana por puntos (desempate por avance). Modo completo: gana el primero en llegar a la meta.</div></div></div><button class="btn btn-primary btn-full" id="rulesDone">¡Entendido!</button>`,{closeable:true});mainModalButton('#rulesDone',closeModal)}
function showCredits(){openModal('CRÉDITOS Y FUENTES',`<h2 id="modalTitle">DemoWay <span style="color:#8862d8">✦</span></h2><p>Videojuego educativo de <strong>Constitución y Democracia</strong>, con Mocra como guía. Diseño de propuesta para la Universidad de San Buenaventura, Bogotá.</p><p><strong>Proyecto académico:</strong> Ronald Cantor · Ingeniería Multimedia.</p><p><strong>Referencia normativa:</strong> Constitución Política de Colombia de 1991, especialmente artículos 1, 4, 7, 13, 15, 20, 23, 29, 37, 67, 86 y 95. La dinámica simplifica situaciones para fines didácticos.</p><p><a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4125" target="_blank" rel="noopener noreferrer">Consultar Constitución en Función Pública ↗</a></p><p style="font-size:12px">No recopila datos personales ni utiliza servidores. Las partidas funcionan localmente en tu navegador.</p><button class="btn btn-primary btn-full" id="creditsDone">Cerrar</button>`,{closeable:true});mainModalButton('#creditsDone',closeModal)}
function confirmLeave(to='home'){
  if(state.screen!=='game'||state.phase==='ended'){switchScreen(to);return}
  openModal('CONFIRMACIÓN',`<h2 id="modalTitle">¿Abandonar la partida?</h2><p>Si sales ahora, se perderá el progreso de esta partida.</p><div class="modal-actions"><button class="btn btn-outline" id="keepPlaying">Seguir jugando</button><button class="btn btn-primary" id="leaveGame">Salir</button></div>`,{closeable:true});
  mainModalButton('#keepPlaying',closeModal);mainModalButton('#leaveGame',()=>{forceCloseModal();state.phase='ended';switchScreen(to)})
}
function restartConfirm(){openModal('REINICIAR PARTIDA',`<h2 id="modalTitle">¿Volver a comenzar?</h2><p>Se reiniciarán el tablero, las fichas y los puntos. Mantendrás los mismos participantes.</p><div class="modal-actions"><button class="btn btn-outline" id="cancelRestart">Cancelar</button><button class="btn btn-primary" id="acceptRestart">Reiniciar ↺</button></div>`,{closeable:true});mainModalButton('#cancelRestart',closeModal);mainModalButton('#acceptRestart',()=>{forceCloseModal();startGame()})}

function init(){
  state.sound=readSound();updateSound();mountOwls();setupInputs();
  $('#playBtn').addEventListener('click',()=>{switchScreen('setup');sound(580,.1)});
  $('#tutorialHomeBtn').addEventListener('click',()=>startTutorial());
  $('#creditsBtn').addEventListener('click',showCredits);
  $('#homeBtn').addEventListener('click',()=>confirmLeave('home'));
  $('#soundBtn').addEventListener('click',()=>{state.sound=!state.sound;updateSound();saveSound();sound(680,.12);toast(state.sound?'Sonidos activados':'Sonidos desactivados')});
  $$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>confirmLeave(btn.dataset.go)));
  $$('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
  $('#minusPlayers').addEventListener('click',()=>setPlayerCount(state.playerCount-1));
  $('#plusPlayers').addEventListener('click',()=>setPlayerCount(state.playerCount+1));
  $('#playersRange').addEventListener('input',e=>setPlayerCount(Number(e.target.value)));
  $('#startBtn').addEventListener('click',()=>startTutorial(startGame));
  $('#rollBtn').addEventListener('click',rollDie);
  $('#restartBtn').addEventListener('click',restartConfirm);
  $('#againBtn').addEventListener('click',()=>{switchScreen('setup')});
  $('#modalClose').addEventListener('click',closeModal);
  $('.modal-backdrop').addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modalRoot').hidden)closeModal()});
  let lastMobile=window.matchMedia('(max-width:640px)').matches;
  window.addEventListener('resize',()=>{const mobile=window.matchMedia('(max-width:640px)').matches;if(lastMobile!==mobile){lastMobile=mobile;if(state.screen==='game')renderBoard()}});
}

document.addEventListener('DOMContentLoaded',init);
