/* =====================================================================
   STUDIO K · script.js
   1) Configuración   2) Datos de servicios   3) Lista de servicios
   4) Modales         5) Stepper de reserva   6) Envío por WhatsApp
   ===================================================================== */

document.documentElement.classList.add('js');

/* ---------- 1) CONFIGURACIÓN (edita estos valores) ---------- */
const CONFIG = {
  // Número de WhatsApp que recibe las solicitudes: 57 + número, sin + ni espacios (ej. '573001234567').
  // Si lo dejas vacío, se abre el enlace wa.link de Studio K sin mensaje prellenado.
  WHATSAPP: '',
  WHATSAPP_LINK: 'https://wa.link/8qvs7m',
  // Foto de Karen para el arco de la portada (ej. 'img/karen.jpg'). Vacío = marco "Foto de Karen · Próximamente".
  KAREN_FOTO: '',
  HORAS: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
  DIAS_CERRADO: [0],                                     // 0 = domingo
  ESPECIALISTAS: ['Cualquiera del equipo', 'Karen']      // añade al equipo aquí
};

/* ---------- SEDES (rellena dirección, teléfono y foto de cada una) ----------
   foto: ruta de la imagen, ej. 'img/sede1.jpg'. Si la dejas vacía se muestra un marco con "Foto de la sede".
   maps: enlace de Google Maps (opcional). Si lo dejas vacío se busca por la dirección.
   whatsapp: número propio de la sede (opcional); si no, se usa CONFIG.WHATSAPP. */
const SEDES = [
  { id: 'sede1', nombre: 'Sede 1', direccion: 'Dirección de la sede 1', referencia: 'Barrio / local / piso', horario: 'Lunes a sábado · 9:00 am – 5:00 pm', telefono: '', whatsapp: '', maps: '', foto: '' },
  { id: 'sede2', nombre: 'Sede 2', direccion: 'Dirección de la sede 2', referencia: 'Barrio / local / piso', horario: 'Lunes a sábado · 9:00 am – 5:00 pm', telefono: '', whatsapp: '', maps: '', foto: '' }
];

/* ---------- 2) SERVICIOS ----------
   OJO: precios, descripciones largas y características (feats) son EJEMPLO; cámbialos por los reales. */
const SERVICIOS = [
  { id: 's1', cat: 'Cejas', nombre: 'Diseño de cejas', badges: ['CERA', 'HILO'], precio: 25000, desc: 'A la medida de tu estructura.', largo: 'Diseño personalizado según la estructura de tu rostro, retirando el vello con cera o hilo.', feats: ["Técnica con cera o hilo", "Dura de 2 a 3 semanas", "Ideal para todo tipo de piel", "incluye Spa"] },
  { id: 's2', cat: 'Cejas', nombre: 'Semipermanente', badges: ['MAQUILLAJE'], precio: 35000, desc: 'Diseño y maquillaje de cejas.', largo: 'Maquillaje de cejas que realza tu diseño con un acabado suave y natural.', feats: ["Dura de 3 a 5 días", "Ideal para efecto maquillaje", "Técnica con cera dermatologica","incluye Spa"] },
  { id: 's3', cat: 'Micropigmentación', nombre: 'Micropigmentación', badges: ['PIGMENTO'], precio: 250000, desc: 'Definición que dura.', largo: 'Una tecnica especializada de diseño y pigmentacion que busca realzar la belleza natural de las cejas, respetando la armonia facial, la colorimetria y la escencia de cada persona', feats: ["Dura de 1 a 2 años (varía por piel)", "diseño personalizado", "Efecto Natural","Tecnica efecto polvo"] },
  { id: 's4', cat: 'Pestañas', nombre: 'Lifting coreano', badges:['LIFTING'], precio: 40000, desc: 'Pestañas peinadas y con volumen.', largo: 'El lash lifting Korean busca un efecto elegante, limpio y natural, respetando la estructura de la pestaña para lograr una curvatura armoniosa', feats: ["Dura de 4 a 6 semanas", "Sin extensiones", "Sin exceso de producto", "Aspecto sofisticado desde el primer dia" , "Incluye Kit profesional post cuidado"] },
  { id: 's5', cat: 'Pestañas', nombre: 'Pestañas Punto a punto', badges: ['FIBRA DE SEDA'], precio: 100000, desc: 'Fibra de seda, look natural.', largo: 'Extensiones de fibra de seda aplicadas pestaña por pestaña para un look natural.', feats: [ "Retoque cada 3 semanas", "Ideal para un efecto sutil"] },
  { id: 's6', cat: 'Pestañas', nombre: 'Pestañas híbridas', badges: ['HÍBRIDAS'], precio: 150000, desc: 'Más mirada, sin exagerar.', largo: 'Mezcla de técnicas que combina densidad y ligereza para más mirada sin exagerar.', feats: ["Técnica híbrida", "Retoque cada 3 semanas", "Ideal para volumen natural"] }
];
const CATS = ['Todos', ...new Set(SERVICIOS.map(s => s.cat))];
const GRUPOS = { 'list-cejas': ['Cejas', 'Micropigmentación'], 'list-pestanas': ['Pestañas'] };
const money = n => '$' + n.toLocaleString('es-CO');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- 3) LISTA DE SERVICIOS (Cejas / Pestañas) ---------- */
const pool = $$('#pool img:not([id^="ba-"])');                       // fotos incluidas una sola vez en el HTML
Object.entries(GRUPOS).forEach(([listId, cats]) => {
  $('#' + listId).innerHTML = SERVICIOS.filter(s => cats.includes(s.cat)).map((s, n) => `
  <article class="svc" id="${s.id}">
    <span class="n">${String(n + 1).padStart(2, '0')}</span>
    <div>
      <div class="ttl"><h3>${s.nombre}</h3>${s.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
      <p>${s.desc}</p>
      <button type="button" class="ver" data-id="${s.id}" aria-haspopup="dialog">VER FOTO ▾</button>
    </div>
    <div class="end">
      <div class="price"><small>DESDE</small><b>${money(s.precio)}</b></div>
      <button type="button" class="agendar" data-id="${s.id}">Agendar →</button>
    </div>
  </article>`).join('');
  $('#' + listId).addEventListener('click', e => {
    const ver = e.target.closest('.ver'), ag = e.target.closest('.agendar');
    if (ver) openPreview(ver.dataset.id);
    if (ag) openBookingModal(ag.dataset.id);
  });
});

/* ---------- SEDES ---------- */
const maps = d => d.maps || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.direccion + ' Barranquilla');
$('#sedes-row').innerHTML = SEDES.map((d, i) => `
  <article class="sede" id="${d.id}">
    <div class="sede-foto${d.foto ? '' : ' vacia'}">
      ${d.foto ? `<img src="${d.foto}" alt="${d.nombre} de Studio K en Barranquilla" loading="lazy">` : '<div><span>Foto de la sede</span><small>Próximamente</small></div>'}
      <span class="sede-n">Sede 0${i + 1}</span>
    </div>
    <div class="sede-b">
      <h3>${d.nombre}</h3>
      <dl>
        <div><dt>Dirección</dt><dd>${d.direccion}${d.referencia ? '<br><span style="color:var(--mute)">' + d.referencia + '</span>' : ''}</dd></div>
        <div><dt>Horario</dt><dd>${d.horario}</dd></div>
        ${d.telefono ? `<div><dt>Teléfono</dt><dd>${d.telefono}</dd></div>` : ''}
      </dl>
      <div class="sede-act">
        <a class="pill o" href="${maps(d)}" target="_blank" rel="noopener">Cómo llegar</a>
        <button type="button" class="pill agendar-sede" data-sede="${d.id}">Agendar aquí</button>
      </div>
    </div>
  </article>`).join('');
$('#sedes-row').addEventListener('click', e => { const b = e.target.closest('.agendar-sede'); if (b) openBookingModal(null, b.dataset.sede); });
$('#foot-sedes').innerHTML = SEDES.map(d => `<span>${d.nombre} · ${d.direccion}</span>`).join('');

/* ---------- 4) MODALES ---------- */
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const bm = $('#booking-modal'), pm = $('#svc-modal');
let lastFocus = null;
const modalTop = () => $('.modal-scroll').scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

function showOverlay(el) { el.hidden = false; el.classList.remove('closing'); document.body.classList.add('lock'); }
function hideOverlay(el, done) {                     // fade-out y luego oculta
  el.classList.add('closing');
  const end = () => { el.hidden = true; el.classList.remove('closing'); if (bm.hidden && pm.hidden) document.body.classList.remove('lock'); if (done) done(); };
  reduce ? end() : setTimeout(end, 300);
}

/* Modal de agendamiento a pantalla completa. id (opcional) = servicio preseleccionado */
function openBookingModal(id, sedeId) {
  lastFocus = document.activeElement;
  if (!pm.hidden) hideOverlay(pm);
  selected.clear(); if (id) selected.add(id);
  form.elements.sede.value = sedeId || SEDES[0].id;
  catActual = 'Todos'; renderPicker(); updateSummary(); goStep(1);
  showOverlay(bm); modalTop(); $('#bk-close').focus();
}
function closeBookingModal() {
  if (bm.hidden || bm.classList.contains('closing')) return;
  hideOverlay(bm, () => { resetAll(); if (lastFocus && lastFocus.focus) lastFocus.focus(); });
}
function resetAll() {                                // limpia selección y formulario
  form.reset(); selected.clear(); state.hora = ''; catActual = 'Todos';
  $$('.hora').forEach(x => x.classList.remove('on')); $('#fecha-txt').textContent = '';
  $('#ok').classList.remove('show'); $('#paso3').hidden = false;
  setBtn('Enviar solicitud'); btn.disabled = false; renderPicker(); updateSummary(); goStep(1);
}

/* Vista previa de servicio ("VER FOTO") */
function openPreview(id) {
  const i = SERVICIOS.findIndex(s => s.id === id), s = SERVICIOS[i];
  const img = $('#sv-img'); img.src = pool[i].src; img.alt = pool[i].alt;
  $('#sv-title').textContent = s.nombre; $('#sv-desc').textContent = s.largo;
  $('#sv-feats').innerHTML = s.feats.map(f => `<li>${f}</li>`).join('');
  $('#sv-book').dataset.id = id;
  showOverlay(pm); $('#sv-close').focus();
}
const closePreview = () => { if (!pm.hidden) hideOverlay(pm); };

$('#bk-close').addEventListener('click', closeBookingModal);
$('#sv-close').addEventListener('click', closePreview);
pm.addEventListener('click', e => { if (e.target === pm) closePreview(); });
$('#sv-book').addEventListener('click', e => openBookingModal(e.currentTarget.dataset.id));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!pm.hidden) closePreview(); else closeBookingModal(); } });
// Botones "Agendar cita" de la página (navbar, hero, footer...)
$$('a[href="#reservar"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openBookingModal(); }));

/* ---------- 5) STEPPER ---------- */
const form = $('#booking-form');
const state = { step: 1, hora: '' };
const selected = new Set();
let catActual = 'Todos';

function goStep(n) {
  state.step = n;
  $$('.step', form).forEach(el => el.classList.toggle('on', +el.dataset.step === n));
  $$('.stepper span').forEach(el => {
    const k = +el.dataset.s; el.classList.toggle('on', k === n); el.classList.toggle('done', k < n);
  });
  $$('.err', form).forEach(e => e.textContent = '');
}
$$('[data-go]', form).forEach(b => b.addEventListener('click', () => {
  const to = +b.dataset.go;
  if (to > state.step && !validar(state.step)) return;   // validación antes de avanzar
  goStep(to); modalTop();
}));

// Paso 1: categorías + selección múltiple
function renderCats() {
  $('#cats').innerHTML = CATS.map(c => `<button type="button" class="chip${c === catActual ? ' on' : ''}" data-c="${c}">${c}</button>`).join('');
}
function renderPicker() {
  renderCats();
  $('#picks').innerHTML = SERVICIOS.filter(s => catActual === 'Todos' || s.cat === catActual).map(s => `
    <label class="pick${selected.has(s.id) ? ' sel' : ''}">
      <input type="checkbox" value="${s.id}" ${selected.has(s.id) ? 'checked' : ''}>
      <span class="nm">${s.nombre}</span><span class="pr">${money(s.precio)}</span>
    </label>`).join('');
}
$('#cats').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { catActual = c.dataset.c; renderPicker(); } });
$('#picks').addEventListener('change', e => {
  const cb = e.target; cb.checked ? selected.add(cb.value) : selected.delete(cb.value);
  cb.closest('.pick').classList.toggle('sel', cb.checked); updateSummary();
});
function updateSummary() {
  const lista = SERVICIOS.filter(s => selected.has(s.id));
  const total = lista.reduce((a, s) => a + s.precio, 0);
  $('#summary').innerHTML = `<h4>TU SELECCIÓN (${lista.length})</h4>` +
    (lista.length ? `<ul>${lista.map(s => `<li><span>${s.nombre}</span><span>${money(s.precio)}</span></li>`).join('')}</ul>` : '<p style="margin:0 0 8px;color:var(--mute)">Aún no has elegido servicios.</p>') +
    `<div class="tot"><span>Subtotal confirmado:</span><span>${money(total)}</span></div>`;
}
CONFIG.ESPECIALISTAS.forEach(n => form.elements.especialista.add(new Option(n, n)));
SEDES.forEach(d => form.elements.sede.add(new Option(d.nombre + ' · ' + d.direccion, d.id)));

// Paso 2: fecha y hora
const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
form.elements.fecha.min = hoy;
$('#horas').innerHTML = CONFIG.HORAS.map(h => `<button type="button" class="hora" data-h="${h}">${h}</button>`).join('');
$('#horas').addEventListener('click', e => {
  const b = e.target.closest('.hora'); if (!b) return;
  state.hora = b.dataset.h; $$('.hora').forEach(x => x.classList.toggle('on', x === b));
});
const fechaLegible = v => new Date(v + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
form.elements.fecha.addEventListener('change', () => {
  const v = form.elements.fecha.value;
  if (v && CONFIG.DIAS_CERRADO.includes(new Date(v + 'T00:00').getDay())) {
    form.elements.fecha.value = ''; $('#fecha-txt').textContent = ''; $('#err2').textContent = 'Atendemos de lunes a sábado. Elige otro día.'; return;
  }
  $('#err2').textContent = ''; $('#fecha-txt').textContent = v ? fechaLegible(v) : '';
});

// Validaciones por paso
function validar(n) {
  if (n === 1 && !selected.size) { $('#err1').textContent = 'Elige al menos un servicio para continuar.'; return false; }
  if (n === 2 && (!form.elements.fecha.value || !state.hora)) { $('#err2').textContent = 'Elige una fecha y una hora para continuar.'; return false; }
  if (n === 3) {
    const tel = form.elements.telefono.value.replace(/\D/g, '');
    if (form.elements.nombre.value.trim().length < 2) return err3('Escribe tu nombre completo.', form.elements.nombre);
    if (tel.length < 7) return err3('Escribe un teléfono válido.', form.elements.telefono);
  }
  return true;
}
function err3(msg, el) { $('#err3').textContent = msg; el.focus(); return false; }

/* ---------- 6) ENVÍO POR WHATSAPP ---------- */
const btn = $('#send');
const setBtn = (t, c) => { btn.textContent = t; btn.classList.remove('ok', 'err'); if (c) btn.classList.add(c); };

form.addEventListener('submit', e => {      // sin async/await: Safari (iPhone) bloquea window.open si no es directo al toque
  e.preventDefault();
  if (!validar(3)) return;
  const lista = SERVICIOS.filter(s => selected.has(s.id));
  const sede = SEDES.find(d => d.id === form.elements.sede.value) || SEDES[0];
  const msg = [
    '¡Hola! Quiero agendar una cita en Studio K 🖤',
    '',
    'Nombre: ' + form.elements.nombre.value.trim(),
    'Teléfono: +57 ' + form.elements.telefono.value.trim(),
    'Servicios: ' + lista.map(s => `${s.nombre} (${money(s.precio)})`).join(', '),
    'Subtotal: ' + money(lista.reduce((a, s) => a + s.precio, 0)),
    'Sede: ' + sede.nombre + ' · ' + sede.direccion,
    'Especialista: ' + form.elements.especialista.value,
    'Fecha: ' + fechaLegible(form.elements.fecha.value),
    'Hora: ' + state.hora
  ].join('\n');
  const num = (sede.whatsapp || CONFIG.WHATSAPP).replace(/\D/g, '');
  const url = num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : CONFIG.WHATSAPP_LINK;
  if (!num && navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => {});   // sin número: deja el mensaje copiado
  window.open(url, '_blank');
  setBtn('¡Solicitud lista!', 'ok');
  $('#paso3').hidden = true; $('#ok').classList.add('show');
  setTimeout(closeBookingModal, 6000);
});
$('#nueva').addEventListener('click', closeBookingModal);

/* ---------- ANTES Y DESPUÉS (barra deslizadora) ----------
   Para usar tus propias fotos pon la ruta en antes/despues, ej: 'img/antes2.jpg'.
   Si las dejas vacías se muestra un marco de ejemplo. */
const ANTES_DESPUES = [
  { antes: 'ba-1a', despues: 'ba-1d', titulo: 'Pestañas híbridas' },
  { antes: '', despues: '', titulo: 'Tu foto aquí' },
  { antes: '', despues: '', titulo: 'Tu foto aquí' }
];
const baUrl = v => !v ? '' : (/[./]/.test(v) ? v : (($('#' + v) || {}).src || ''));
const baLayer = (v, k) => baUrl(v) ? `<img src="${baUrl(v)}" alt="">` : `<div class="ph ${k}">Tu foto aquí</div>`;
$('#ba-row').innerHTML = ANTES_DESPUES.map(b => `
  <figure class="ba" style="--p:50%">
    <div class="ba-view">
      ${baLayer(b.despues, 'd')}
      <div class="ba-top">${baLayer(b.antes, 'a')}</div>
      <span class="ba-tag l">ANTES</span><span class="ba-tag r">DESPUÉS</span>
      <div class="ba-handle" aria-hidden="true"><span class="knob"></span></div>
      <input type="range" class="ba-range" min="0" max="100" value="50" aria-label="Comparar antes y después: ${b.titulo}">
    </div>
    <figcaption>${b.titulo}</figcaption>
  </figure>`).join('');
$('#ba-row').addEventListener('input', e => {
  if (e.target.classList.contains('ba-range')) e.target.closest('.ba').style.setProperty('--p', e.target.value + '%');
});

/* ---------- Visor de fotos (código original) ---------- */
const d = $('#d'), di = $('img', d);
$$('.two img.r').forEach(e => e.addEventListener('click', () => {
  const i = e.tagName == 'IMG' ? e : $('img', e); di.src = i.src; di.alt = i.alt; d.showModal();
}));
d.addEventListener('click', () => d.close());

renderPicker(); updateSummary(); goStep(1);

/* ---------- Foto de Karen en la portada ---------- */
if (CONFIG.KAREN_FOTO) $('#karen').innerHTML = `<img src="${CONFIG.KAREN_FOTO}" alt="Karen, dueña de Studio K">`;

/* ---------- Carrusel de reseñas: duplica las tarjetas para el bucle sin saltos ---------- */
$$('.marq .track').forEach(t => {
  const items = [...t.children];
  items.forEach(el => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelector('img').alt = ''; t.appendChild(c); });
});

/* ---------- Aparición al hacer scroll ---------- */
const rvSel = '.intro .w>*,.chap-head,.svc,.ba,.two>*,.dark .w>*,.rev-head,.rev-foot,.sede,#sedes .w>p,#sedes .w>h2,.hero .t,.stats>div';
const rvEls = $$(rvSel);
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  rvEls.forEach((el, i) => { el.classList.add('rv'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
}


/* ---------- Corazón flotante: baja y sube con el scroll ---------- */
(() => {
  const cora = $('#cora'); if (!cora || reduce) return;
  let ticking = false;
  const place = () => {
    const vh = innerHeight, max = Math.max(1, document.documentElement.scrollHeight - vh);
    const p = Math.min(1, scrollY / max);
    const y = vh * .2 + (0.5 - 0.5 * Math.cos(p * Math.PI * 2)) * vh * .55;   // sube y baja suavemente a lo largo de la página
    cora.style.transform = `translate3d(0,${y}px,0)`; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(place); } }, { passive: true });
  addEventListener('resize', place); place();
})();