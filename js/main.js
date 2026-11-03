/* Página de servicios · cambio de tema y recorrido por las pantallas del sistema de tóner. */
(function () {
  'use strict';

  var raiz = document.documentElement;

  /* ------------------------------------------------------------ tema claro / oscuro */
  var botonTema = document.getElementById('boton-tema');

  function leerTema() {
    try { return localStorage.getItem('tema'); } catch (e) { return null; }
  }
  function guardarTema(tema) {
    try { localStorage.setItem('tema', tema); } catch (e) { /* sin almacenamiento: el cambio dura esta visita */ }
  }
  function esOscuro() { return raiz.getAttribute('data-theme') === 'dark'; }
  function pintarBotonTema() {
    if (!botonTema) return;
    var texto = esOscuro() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
    botonTema.setAttribute('aria-label', texto);
    botonTema.setAttribute('title', texto);
  }

  if (botonTema) {
    botonTema.addEventListener('click', function () {
      var tema = esOscuro() ? 'light' : 'dark';
      raiz.setAttribute('data-theme', tema);
      guardarTema(tema);
    });
  }
  if (window.MutationObserver) {
    new MutationObserver(pintarBotonTema).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
  }
  if (window.matchMedia) {
    var preferencia = window.matchMedia('(prefers-color-scheme: dark)');
    var alCambiarSistema = function (e) {
      if (!leerTema()) raiz.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    if (preferencia.addEventListener) preferencia.addEventListener('change', alCambiarSistema);
    else if (preferencia.addListener) preferencia.addListener(alCambiarSistema);
  }
  pintarBotonTema();

  /* ------------------------------------------------------------ recorrido por las pantallas */
  var lista = document.querySelector('.recorrido-lista');
  if (!lista) return;

  var pestanas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
  var panel = document.getElementById('visor');
  var marco = document.getElementById('visor-marco');
  var imagen = document.getElementById('visor-img');
  var numero = document.getElementById('visor-n');
  var titulo = document.getElementById('visor-titulo');
  var descripcion = document.getElementById('visor-desc');
  var anterior = document.getElementById('visor-anterior');
  var siguiente = document.getElementById('visor-siguiente');
  var carpeta = 'img/toner/';
  var actual = 0;

  function datos(i) {
    var p = pestanas[i];
    return {
      slug: p.getAttribute('data-slug'),
      titulo: p.querySelector('span').textContent,
      desc: p.getAttribute('data-desc'),
      alt: p.getAttribute('data-alt')
    };
  }

  function precargar(i) {
    var d = datos((i + pestanas.length) % pestanas.length);
    var img = new Image();
    img.decoding = 'async';
    img.sizes = imagen.getAttribute('sizes');
    img.srcset = carpeta + d.slug + '-800.webp 800w, ' + carpeta + d.slug + '.webp 1600w';
  }

  function mostrarEnLista(p) {
    // desplaza solo la tira de miniaturas, nunca la página
    if (lista.scrollWidth <= lista.clientWidth) return;
    var izq = p.parentNode.offsetLeft - lista.offsetLeft;
    var der = izq + p.parentNode.offsetWidth;
    if (izq < lista.scrollLeft) lista.scrollLeft = izq - 8;
    else if (der > lista.scrollLeft + lista.clientWidth) lista.scrollLeft = der - lista.clientWidth + 8;
  }

  function seleccionar(i, enfocar) {
    actual = (i + pestanas.length) % pestanas.length;
    pestanas.forEach(function (p, k) {
      var sel = k === actual;
      p.setAttribute('aria-selected', sel ? 'true' : 'false');
      p.tabIndex = sel ? 0 : -1;
    });
    var d = datos(actual);
    imagen.srcset = carpeta + d.slug + '-800.webp 800w, ' + carpeta + d.slug + '.webp 1600w';
    imagen.src = carpeta + d.slug + '.webp';
    imagen.alt = d.alt;
    marco.href = carpeta + d.slug + '-completa.webp';
    numero.textContent = actual + 1;
    titulo.textContent = d.titulo;
    descripcion.textContent = d.desc;
    panel.setAttribute('aria-labelledby', pestanas[actual].id);
    mostrarEnLista(pestanas[actual]);
    if (enfocar) pestanas[actual].focus();
    precargar(actual + 1);
    if (dialogo && dialogo.open) pintarAmpliado();
  }

  pestanas.forEach(function (p, k) {
    p.tabIndex = k === 0 ? 0 : -1;
    p.addEventListener('click', function (e) {
      e.preventDefault();
      seleccionar(k, false);
    });
    p.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = actual + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = actual - 1;
      else if (e.key === 'Home') destino = 0;
      else if (e.key === 'End') destino = pestanas.length - 1;
      if (destino !== null) {
        e.preventDefault();
        seleccionar(destino, true);
      }
    });
  });
  if (anterior) anterior.addEventListener('click', function () { seleccionar(actual - 1, false); });
  if (siguiente) siguiente.addEventListener('click', function () { seleccionar(actual + 1, false); });

  /* ------------------------------------------------------------ pantalla en grande */
  var dialogo = document.getElementById('ampliado');
  var puedeAbrir = dialogo && typeof dialogo.showModal === 'function';
  var ampliadoImg = document.getElementById('ampliado-img');
  var ampliadoTitulo = document.getElementById('ampliado-titulo');
  var ampliadoCuerpo = document.getElementById('ampliado-cuerpo');
  var zoom = document.getElementById('ampliado-zoom');

  function ponerZoom(real) {
    ampliadoCuerpo.classList.toggle('real', real);
    zoom.setAttribute('aria-pressed', real ? 'true' : 'false');
    zoom.textContent = real ? 'Ajustar a la pantalla' : 'Tamaño real';
  }

  function pintarAmpliado() {
    var d = datos(actual);
    ampliadoImg.src = carpeta + d.slug + '-completa.webp';
    ampliadoImg.alt = d.alt;
    ampliadoTitulo.textContent = (actual + 1) + ' de ' + pestanas.length + ' · ' + d.titulo;
    ampliadoCuerpo.scrollTop = 0;
    ampliadoCuerpo.scrollLeft = 0;
  }

  if (puedeAbrir) {
    marco.addEventListener('click', function (e) {
      e.preventDefault();
      ponerZoom(false);
      pintarAmpliado();
      dialogo.showModal();
    });
    document.getElementById('ampliado-cerrar').addEventListener('click', function () { dialogo.close(); });
    document.getElementById('ampliado-anterior').addEventListener('click', function () { seleccionar(actual - 1, false); });
    document.getElementById('ampliado-siguiente').addEventListener('click', function () { seleccionar(actual + 1, false); });
    zoom.addEventListener('click', function () { ponerZoom(!ampliadoCuerpo.classList.contains('real')); });
    ampliadoImg.addEventListener('click', function () { ponerZoom(!ampliadoCuerpo.classList.contains('real')); });
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
    dialogo.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('button')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); seleccionar(actual + 1, false); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); seleccionar(actual - 1, false); }
    });
    dialogo.addEventListener('close', function () { marco.focus(); });
  }
})();
