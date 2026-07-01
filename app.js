// app.js — render, modal, age gate, copiar, QR, ícones, rastreamento

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     RASTREAMENTO (localStorage)
     Estrutura: array de índices marcados pelo convidado neste dispositivo.
     Cada convidado tem sua própria lista — não há sincronização entre dispositivos.
     Para rastreamento compartilhado, integre Firebase Realtime Database:
     console.firebase.google.com → crie projeto → Realtime Database → adicione
     a databaseURL em data.js e adapte as funções getMarked/saveMarked abaixo.
  ───────────────────────────────────────────── */
  var STORAGE_KEY = 'ca_wedding_v1';

  function getMarked() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveMarked(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function isMarked(idx) { return getMarked().indexOf(idx) !== -1; }

  function addMark(idx) {
    var arr = getMarked();
    if (arr.indexOf(idx) === -1) arr.push(idx);
    saveMarked(arr);
  }

  function removeMark(idx) {
    var arr = getMarked().filter(function (i) { return i !== idx; });
    saveMarked(arr);
  }

  function toggleMark(idx) {
    if (isMarked(idx)) { removeMark(idx); return false; }
    addMark(idx); return true;
  }

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */
  function fmt(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function pad(n) { return String(n + 1).padStart(2, '0'); }

  function icons() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  /* ─────────────────────────────────────────────
     STATS
  ───────────────────────────────────────────── */
  function updateStats() {
    var el = document.getElementById('stat-chosen');
    if (el) el.textContent = getMarked().length;
  }

  /* ─────────────────────────────────────────────
     CARD — atualiza badge e borda
  ───────────────────────────────────────────── */
  function refreshCard(idx) {
    var card = document.querySelector('[data-card-idx="' + idx + '"]');
    if (!card) return;
    card.classList.toggle('card--marked', isMarked(idx));
  }

  /* ─────────────────────────────────────────────
     MINHA LISTA — seção inferior
  ───────────────────────────────────────────── */
  function renderMyGifts() {
    var section = document.getElementById('my-gifts-section');
    var list    = document.getElementById('my-gifts-list');
    if (!section || !list) return;

    var marked = getMarked();
    if (marked.length === 0) { section.hidden = true; return; }

    section.hidden = false;
    list.innerHTML = marked.map(function (idx) {
      var p = PRESENTES[idx];
      return '<div class="gift-chip">' +
        '<span class="gift-chip__title">' + p.titulo + '</span>' +
        '<span class="gift-chip__value">' + fmt(p.valor) + '</span>' +
        '<button class="gift-chip__remove" data-remove="' + idx + '" ' +
          'aria-label="Remover ' + p.titulo + ' da minha lista">' +
          '<i data-lucide="x"></i>' +
        '</button>' +
      '</div>';
    }).join('');

    list.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.dataset.remove, 10);
        removeMark(i);
        refreshCard(i);
        updateStats();
        renderMyGifts();
        icons();
      });
    });

    icons();
  }

  /* ─────────────────────────────────────────────
     GRID — renderiza os 29 cards
  ───────────────────────────────────────────── */
  function renderGrid() {
    var grid = document.getElementById('grid');
    if (!grid) return;

    grid.innerHTML = PRESENTES.map(function (p, idx) {
      var marked = isMarked(idx);
      var photo = p.foto
        ? '<img src="' + p.foto + '" alt="' + p.titulo + '" loading="lazy">'
        : '<div class="card__placeholder">' +
            '<i data-lucide="gift"></i>' +
            '<span class="card__placeholder-lbl">Foto ' + pad(idx) + '</span>' +
          '</div>';

      return '<article class="card' + (marked ? ' card--marked' : '') + '" ' +
             'data-card-idx="' + idx + '" role="listitem">' +
        '<div class="card__photo">' +
          '<span class="card__marked-badge" aria-hidden="true">' +
            '<i data-lucide="check"></i> Meu presente' +
          '</span>' +
          '<span class="card__num" aria-hidden="true">' + pad(idx) + '</span>' +
          photo +
        '</div>' +
        '<div class="card__body">' +
          '<h2 class="card__title">' + p.titulo + '</h2>' +
          '<p class="card__value">' + fmt(p.valor) + '</p>' +
        '</div>' +
        '<div class="card__footer">' +
          '<button class="btn btn--primary btn--full" ' +
            'data-open="' + idx + '" ' +
            'aria-label="Presentear: ' + p.titulo + ' — ' + fmt(p.valor) + '">' +
            '<i data-lucide="gift"></i> Presentear' +
          '</button>' +
        '</div>' +
      '</article>';
    }).join('');

    grid.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(parseInt(btn.dataset.open, 10));
      });
    });
  }

  /* ─────────────────────────────────────────────
     MODAL — conteúdo HTML interno
  ───────────────────────────────────────────── */
  function buildModalHTML(idx) {
    var p      = PRESENTES[idx];
    var marked = isMarked(idx);

    var waLine = '';
    if (typeof WHATSAPP === 'string' && WHATSAPP) {
      var waText = encodeURIComponent(
        'Olá ' + CASAL.nome1 + ' e ' + CASAL.nome2 + '! 💕\n' +
        'Vou presentear com "' + p.titulo + '" (' + fmt(p.valor) + ').\n' +
        'Pix realizado! 🎉'
      );
      waLine = '<a class="btn btn--ghost btn--full" ' +
               'href="https://wa.me/' + WHATSAPP + '?text=' + waText + '" ' +
               'target="_blank" rel="noopener noreferrer" ' +
               'aria-label="Avisar o casal pelo WhatsApp">' +
               '<i data-lucide="message-circle"></i> Avisar o casal no WhatsApp' +
               '</a>';
    }

    var markBtn = marked
      ? '<button class="btn btn--gold btn--full" id="mark-btn" aria-pressed="true">' +
          '<i data-lucide="check"></i> Já registrei na minha lista' +
        '</button>'
      : '<button class="btn btn--ghost btn--full" id="mark-btn" aria-pressed="false">' +
          '<i data-lucide="heart"></i> Guardar na minha lista' +
        '</button>';

    return '' +
      '<p class="modal__eyebrow">Presente ' + pad(idx) + '</p>' +
      '<h2 class="modal__title" id="modal-title">' + p.titulo + '</h2>' +
      '<p class="modal__value">' + fmt(p.valor) + '</p>' +

      '<div class="modal__qr-wrap" id="qr-wrap" aria-label="QR Code Pix"></div>' +

      '<p class="modal__field-label">Pix Copia e Cola</p>' +
      '<textarea class="modal__textarea" id="pix-code" readonly ' +
        'aria-label="Código Pix copia e cola"></textarea>' +

      '<button class="btn btn--primary btn--full modal__copy-btn" id="copy-btn">' +
        '<i data-lucide="copy"></i> Copiar código Pix' +
      '</button>' +

      '<hr class="modal__divider">' +

      '<p class="modal__steps-label">Como pagar</p>' +
      '<ol class="modal__steps">' +
        '<li class="modal__step">Abra o app do seu banco e acesse o <strong>Pix</strong>.</li>' +
        '<li class="modal__step">Escolha <strong>Ler QR Code</strong> ou <strong>Copia e Cola</strong>.</li>' +
        '<li class="modal__step">O valor já vem preenchido — só confirme o pagamento.</li>' +
      '</ol>' +

      '<div class="modal__trust">' +
        'Antes de confirmar, verifique se o recebedor aparece como <strong>CARLOS MAGNO</strong>.' +
      '</div>' +

      '<div class="modal__confirm">' +
        '<p class="modal__confirm-heading">Registrar meu presente</p>' +
        '<p class="modal__confirm-hint">' +
          'Após realizar o Pix, clique para salvar na sua lista neste dispositivo.' +
        '</p>' +
        markBtn +
        waLine +
      '</div>';
  }

  /* ─────────────────────────────────────────────
     MODAL — abrir
  ───────────────────────────────────────────── */
  var _lastFocused = null;
  var _copyTimer   = null;
  var _currentIdx  = null;

  function openModal(idx) {
    _currentIdx  = idx;
    _lastFocused = document.activeElement;

    var overlay = document.getElementById('modal-overlay');
    var body    = document.getElementById('modal-body');
    var p       = PRESENTES[idx];

    try {
      body.innerHTML = buildModalHTML(idx);

      // Preenche o textarea com o código Pix
      var codigo = gerarPix(p.valor);
      var ta     = document.getElementById('pix-code');
      if (ta) ta.value = codigo;

      // Gera QR Code
      var qrWrap = document.getElementById('qr-wrap');
      if (qrWrap) {
        try {
          var qr = qrcode(0, 'M');
          qr.addData(codigo);
          qr.make();
          qrWrap.innerHTML = qr.createImgTag(5, 8);
        } catch (e) {
          qrWrap.innerHTML = '<p class="modal__qr-error">QR não disponível</p>';
        }
      }

      icons();
      setupModalActions(idx, codigo);
    } catch (e) {
      console.error('Erro ao montar o modal do presente:', e);
      body.innerHTML = '<p class="modal__qr-error">' +
        'Não foi possível abrir este presente. Recarregue a página e tente novamente.' +
        '</p>';
    }

    overlay.hidden = false;
    overlay.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');

    // Foco no modal para leitores de tela
    var modal = document.getElementById('modal');
    if (modal) modal.focus();
  }

  /* ─────────────────────────────────────────────
     MODAL — listeners de ações internas
  ───────────────────────────────────────────── */
  function setupModalActions(idx, codigo) {
    // Copiar
    var copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = codigo;
        var ta   = document.getElementById('pix-code');
        if (ta) text = ta.value;

        function onCopied() {
          copyBtn.innerHTML = '<i data-lucide="check"></i> Copiado!';
          icons();
          clearTimeout(_copyTimer);
          _copyTimer = setTimeout(function () {
            copyBtn.innerHTML = '<i data-lucide="copy"></i> Copiar código Pix';
            icons();
          }, 1600);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(onCopied).catch(function () {
            fallbackCopy(ta, onCopied);
          });
        } else {
          fallbackCopy(ta, onCopied);
        }
      });
    }

    // Guardar / remover da lista
    var markBtn = document.getElementById('mark-btn');
    if (markBtn) {
      markBtn.addEventListener('click', function () {
        var nowMarked = toggleMark(idx);
        markBtn.setAttribute('aria-pressed', nowMarked ? 'true' : 'false');
        if (nowMarked) {
          markBtn.className = 'btn btn--gold btn--full';
          markBtn.innerHTML = '<i data-lucide="check"></i> Já registrei na minha lista';
        } else {
          markBtn.className = 'btn btn--ghost btn--full';
          markBtn.innerHTML = '<i data-lucide="heart"></i> Guardar na minha lista';
        }
        icons();
        refreshCard(idx);
        updateStats();
        renderMyGifts();
      });
    }
  }

  function fallbackCopy(ta, cb) {
    if (!ta) return;
    try { ta.select(); document.execCommand('copy'); cb(); } catch (e) {}
  }

  /* ─────────────────────────────────────────────
     MODAL — fechar
  ───────────────────────────────────────────── */
  function closeModal() {
    var overlay = document.getElementById('modal-overlay');
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    clearTimeout(_copyTimer);
    _currentIdx = null;
    if (_lastFocused) { _lastFocused.focus(); _lastFocused = null; }
  }

  /* ─────────────────────────────────────────────
     AGE GATE
  ───────────────────────────────────────────── */
  function setupAgeGate() {
    var gate = document.getElementById('age-gate');
    var btn  = document.getElementById('age-gate-btn');
    var main = document.getElementById('main');

    icons(); // renderiza ícones do age gate

    btn.addEventListener('click', function () {
      gate.style.animation = 'fadeOut .28s ease forwards';
      setTimeout(function () {
        gate.hidden = true;
        gate.setAttribute('aria-hidden', 'true');
        main.hidden = false;
        main.removeAttribute('aria-hidden');
        render();
      }, 260);
    });
  }

  /* ─────────────────────────────────────────────
     RENDER PRINCIPAL
  ───────────────────────────────────────────── */
  function render() {
    // Nomes no hero
    var heroNames = document.getElementById('hero-names');
    if (heroNames) {
      heroNames.innerHTML =
        CASAL.nome1 + ' <span class="amp">&amp;</span> ' + CASAL.nome2;
    }

    // Nomes no footer
    var footerCouple = document.getElementById('footer-couple');
    if (footerCouple) {
      footerCouple.textContent = CASAL.nome1 + ' & ' + CASAL.nome2;
    }

    renderGrid();
    updateStats();
    renderMyGifts();
    icons();
  }

  /* ─────────────────────────────────────────────
     EVENT LISTENERS GLOBAIS
  ───────────────────────────────────────────── */
  function setupEvents() {
    // Fechar modal — botão ×
    document.getElementById('modal-close').addEventListener('click', closeModal);

    // Fechar modal — clicar fora
    document.getElementById('modal-overlay').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });

    // Fechar modal — Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var overlay = document.getElementById('modal-overlay');
        if (!overlay.hidden) closeModal();
      }
    });
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  setupEvents();
  setupAgeGate();

})();
