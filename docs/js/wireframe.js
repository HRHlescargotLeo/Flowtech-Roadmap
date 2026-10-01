/* ==========================================================================
   wireframe.js — shared interaction behaviour for lo-fi wireframes.

   Everything here is driven by data attributes and classes, so pages stay
   declarative and no page needs its own inline script. Keep it that way: a
   wireframe pack with five slightly different accordion implementations is
   how nav bugs get reported in a client review.

   All patterns are keyboard-operable and dismissible with Escape, because
   accessibility is cheaper to design in at wireframe stage than to retrofit.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation flyouts ------------------------------------------------
     Opened on hover AND focus. Hover alone would make the whole navigation
     unusable by keyboard, which is the single most common wireframe defect
     that survives into build. */
  function initNav() {
    var backdrop = document.querySelector('.flyout-backdrop');
    var items = document.querySelectorAll('.nav-item');

    function closeAll() {
      document.querySelectorAll('.nav-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (backdrop) backdrop.classList.remove('active');
    }

    items.forEach(function (item) {
      var flyout = item.querySelector('.nav-flyout');
      if (!flyout) return;

      var trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      function open() {
        closeAll();
        item.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
      }

      function close() {
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) close();
        }, 10);
      });

      if (trigger) {
        trigger.addEventListener('click', function (ev) {
          if (trigger.getAttribute('href') === '#') {
            ev.preventDefault();
            item.classList.contains('open') ? close() : open();
          }
        });
      }
    });

    if (backdrop) backdrop.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* --- Accordions --------------------------------------------------------
     Markup: <div class="accordion-item"><button class="accordion-title">…
     Multiple panels may be open at once unless the .accordion carries
     data-single. */
  function initAccordions() {
    document.querySelectorAll('.accordion-title').forEach(function (title) {
      var startOpen = title.closest('.accordion-item').classList.contains('open');
      title.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      title.addEventListener('click', function () {
        var item = title.closest('.accordion-item');
        var group = title.closest('.accordion');
        var willOpen = !item.classList.contains('open');

        if (group && group.hasAttribute('data-single')) {
          group.querySelectorAll('.accordion-item.open').forEach(function (o) {
            o.classList.remove('open');
            var t = o.querySelector('.accordion-title');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('open', willOpen);
        title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* --- Tabs --------------------------------------------------------------
     Markup: <button class="tab" data-tab="panel-id"> and
             <div class="tab-panel" id="panel-id"> */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var tabs = group.querySelectorAll('.tab');
      tabs.forEach(function (tab) {
        tab.setAttribute('role', 'tab');
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          var target = document.getElementById(tab.getAttribute('data-tab'));
          if (!target) return;
          var container = target.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });
          target.classList.add('active');
        });
      });
    });
  }

  /* --- Carousels ---------------------------------------------------------
     Markup: <div class="carousel" data-autoplay="6000"> containing
             .carousel-track > .carousel-item, .carousel-arrow[data-dir],
             and an empty .carousel-indicators which is populated here. */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var items = track.querySelectorAll('.carousel-item');
      var dotsHost = carousel.querySelector('.carousel-indicators');
      var index = 0;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        if (!dotsHost) return;
        dotsHost.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      function go(n) {
        index = (n + items.length) % items.length;
        render();
      }

      if (dotsHost) {
        items.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      carousel.querySelectorAll('.carousel-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          go(index + (arrow.getAttribute('data-dir') === 'prev' ? -1 : 1));
        });
      });

      var interval = parseInt(carousel.getAttribute('data-autoplay'), 10);
      if (interval > 0) {
        var start = function () { timer = window.setInterval(function () { go(index + 1); }, interval); };
        var stop = function () { window.clearInterval(timer); };
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('mouseleave', start);
      }

      render();
    });
  }

  /* --- Modals ------------------------------------------------------------
     Markup: any element with data-modal-open="modal-id", and
             <div class="wf-modal" id="modal-id"> */
  function initModals() {
    function close(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var panel = modal.querySelector('.wf-modal-panel');
        if (panel) {
          panel.setAttribute('tabindex', '-1');
          panel.focus();
        }
      });
    });

    document.querySelectorAll('.wf-modal').forEach(function (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal || ev.target.classList.contains('wf-modal-close')) close(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.wf-modal.open').forEach(close);
    });
  }

  /* --- Notes toggle -------------------------------------------------------
     A switch in the prototype navigator shows or hides everything marked
     as a note: the "what we're proposing and why" panel at the top of each
     prototype and the numbered annotations within it. Off by default; the
     choice is remembered for the session so it carries between prototypes. */
  function initNotes() {
    var hidden = true;
    try { hidden = window.sessionStorage.getItem('wf-notes-hidden') !== '0'; } catch (e) { /* private mode */ }
    var toggles = document.querySelectorAll('[data-notes-toggle]');
    if (!document.querySelector('.wf-note, .proposal')) {
      toggles.forEach(function (t) { t.hidden = true; });
      return;
    }

    function apply() {
      document.body.classList.toggle('wf-notes-hidden', hidden);
      toggles.forEach(function (t) {
        t.setAttribute('aria-checked', hidden ? 'false' : 'true');
        var l = t.querySelector('.notes-label');
        if (l) l.textContent = hidden ? 'Notes off' : 'Notes on';
      });
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        hidden = !hidden;
        try { window.sessionStorage.setItem('wf-notes-hidden', hidden ? '1' : '0'); } catch (e) { /* private mode */ }
        apply();
        if (!hidden) {
          var panel = document.querySelector('.proposal');
          if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
        }
      });
    });
    apply();
  }

  /* --- Prototype navigator: current page and previous / next ------------- */
  function initProtoNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    var links = Array.prototype.slice.call(document.querySelectorAll('.proto-links a[data-proto]'));
    var index = -1;
    links.forEach(function (a, i) {
      var match = a.getAttribute('data-proto').split(' ').indexOf(file) !== -1;
      if (match) { a.setAttribute('aria-current', 'page'); index = i; }
    });
    var current = document.querySelector('.proto-links a[aria-current]');
    if (current && current.scrollIntoView && window.innerWidth < 1024) {
      var list = current.closest('.proto-links');
      if (list) list.scrollLeft = current.offsetLeft - 16;
    }
    var pager = document.querySelector('[data-proto-pager]');
    if (!pager || index < 0) return;
    function label(a) { return a.textContent.replace(/\s+/g, ' ').trim(); }
    var html = '';
    if (index > 0) html += '<a class="prev" href="' + links[index - 1].getAttribute('href') + '"><span class="wf-meta">Previous</span>' + label(links[index - 1]) + '</a>';
    else html += '<span></span>';
    if (index < links.length - 1) html += '<a class="next" href="' + links[index + 1].getAttribute('href') + '"><span class="wf-meta">Next</span>' + label(links[index + 1]) + '</a>';
    pager.innerHTML = html;
  }

  /* ======================================================================
     Flowtech prototype behaviour (V1, greyscale)
     Driven by ids and data attributes on the pages. Data from data.js
     (sample data, see the notes at the top of that file).
     ====================================================================== */

  var FT = window.FT || { PRODUCTS: [], BRANCHES: [], CROSSREF: {}, CAPS: {}, POSTCODES: {}, NO_NEXT_DAY: [], QUOTES: [], money: function (n) { return '£' + n; } };
  var money = FT.money;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-GB'); }
  function byCode(code) {
    if (!code) return null;
    var c = String(code).trim().toUpperCase();
    for (var i = 0; i < FT.PRODUCTS.length; i++) { if (FT.PRODUCTS[i].code.toUpperCase() === c) return FT.PRODUCTS[i]; }
    return null;
  }
  function branchById(id) {
    for (var i = 0; i < FT.BRANCHES.length; i++) { if (FT.BRANCHES[i].id === id) return FT.BRANCHES[i]; }
    return null;
  }
  function store(key, val) { try { window.sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ } }
  function load(key, fallback) { try { var v = JSON.parse(window.sessionStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }

  /* Query parameters carry context between pages. Some hosts strip the query
     string, so the last clicked link's query is kept for the page it opens. */
  function currentFile() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) return v;
    var saved = load('ft-q', null);
    if (saved && saved.file === currentFile()) { try { return new URLSearchParams(saved.q).get(name); } catch (e) { return null; } }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.indexOf('?') !== -1) store('ft-q', { file: href.split('?')[0].split('/').pop(), q: href.split('?')[1].split('#')[0] });
    else if (href.charAt(0) !== '#') { try { window.sessionStorage.removeItem('ft-q'); } catch (err) { /* private mode */ } }
  }, true);

  /* --- Toast ------------------------------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#wf-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wf-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 2800);
  }

  function initHeaderHeight() {
    var header = $('.site-header');
    if (!header) return;
    function set() { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    window.addEventListener('resize', set);
  }

  /* --- Drawers ------------------------------------------------------------
     Trigger [data-drawer-open="id"], panel <div class="drawer" id="id">.
     Escape or a click on the dimmed area closes; focus returns to trigger. */
  var lastDrawerTrigger = null;
  function openDrawer(id, trigger) {
    var d = document.getElementById(id);
    if (!d) return;
    lastDrawerTrigger = trigger || null;
    d.classList.add('open');
    document.body.style.overflow = 'hidden';
    var panel = $('.drawer-panel', d);
    if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
  }
  function closeDrawer(d) {
    d.classList.remove('open');
    document.body.style.overflow = '';
    if (lastDrawerTrigger) lastDrawerTrigger.focus();
  }
  function initDrawers() {
    $all('[data-drawer-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); openDrawer(t.getAttribute('data-drawer-open'), t); });
    });
    $all('.drawer').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target === d || e.target.closest('.drawer-close') || e.target.closest('[data-drawer-close]')) closeDrawer(d);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $all('.drawer.open').forEach(closeDrawer);
    });
  }

  /* --- Shared form validation ------------------------------------------- */
  function validateForm(form) {
    var first = null;
    $all('[required]', form).forEach(function (input) {
      if (input.closest('[hidden]')) return;
      var field = input.closest('.field') || input.closest('fieldset');
      var ok = input.type === 'email' ? /.+@.+\..+/.test(input.value)
        : input.type === 'checkbox' ? input.checked
        : input.type === 'radio' ? !!$('[name="' + input.name + '"]:checked', form)
        : input.value.trim() !== '';
      if (ok && input.getAttribute('data-pattern')) ok = new RegExp(input.getAttribute('data-pattern'), 'i').test(input.value.trim());
      if (field) {
        field.classList.toggle('has-error', !ok);
        var err = $('.field-error', field);
        if (err) err.hidden = ok;
      }
      if (!ok && !first) first = input;
    });
    var summary = $('.error-summary', form);
    if (summary) summary.hidden = !first;
    if (first) { first.focus(); return false; }
    return true;
  }

  /* --- Basket (sample, per session) ------------------------------------- */
  function getBasket() { return load('ft-basket', []); }
  function setBasket(b) { store('ft-basket', b); updateBasketCount(); }
  function addToBasket(code, qty, label, price) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var b = getBasket();
    var found = null;
    b.forEach(function (l) { if (l.code === code && !label) found = l; });
    if (found) found.qty += qty;
    else b.push({ code: code, qty: qty, label: label || null, price: price || null });
    setBasket(b);
  }
  function basketLines() {
    return getBasket().map(function (l) {
      var p = byCode(l.code);
      var unit = l.price != null ? l.price : (p ? (p.offer || p.price) : 0);
      return { code: l.code, qty: l.qty, name: l.label || (p ? p.name : l.code), unit: unit, total: unit * l.qty };
    });
  }
  function updateBasketCount() {
    var n = getBasket().reduce(function (s, l) { return s + l.qty; }, 0);
    $all('[data-basket-count]').forEach(function (el) { el.textContent = fmt(n); });
    renderBasket();
  }

  /* --- VAT preference (R21) --------------------------------------------- */
  function vatMode() { return load('ft-vat', 'ex'); }
  function withVat(n) { return vatMode() === 'inc' ? n * 1.2 : n; }
  function vatLabel() { return vatMode() === 'inc' ? 'inc VAT' : 'exc VAT'; }
  function initVatToggles() {
    $all('[data-vat]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-vat') === vatMode() ? 'true' : 'false');
      b.addEventListener('click', function () {
        store('ft-vat', b.getAttribute('data-vat'));
        $all('[data-vat]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-vat') === vatMode() ? 'true' : 'false'); });
        syncVatLabels();
        document.dispatchEvent(new CustomEvent('ft:vat'));
      });
    });
    syncVatLabels();
  }
  function syncVatLabels() { $all('[data-vat-label]').forEach(function (el) { el.textContent = vatLabel(); }); }
  function priceHTML(p, opts) {
    opts = opts || {};
    var now = p.offer || p.price;
    var html = '<span class="price-now">' + money(withVat(now)) + '</span> <span class="price-vat">' + vatLabel() + '</span>';
    if (p.offer) html = '<span class="price-was">Was ' + money(withVat(p.price)) + '</span> ' + html + ' <span class="badge solid">Special price</span>';
    if (p.pack && !opts.short) html += '<span class="price-unit">' + esc(p.pack) + (p.unit === 'per metre' ? ' · ' + money(withVat(now) / 30) + ' per metre' : (p.unit === 'each' ? ' · ' + money(withVat(now) / 10) + ' each' : '')) + '</span>';
    return html;
  }

  /* --- My branch (R50) --------------------------------------------------- */
  function myBranch() { return branchById(load('ft-branch', '')); }
  function setMyBranch(id) {
    store('ft-branch', id);
    var b = branchById(id);
    $all('[data-my-branch]').forEach(function (el) { el.textContent = b ? b.town + (b.brand !== 'Flowtech' ? ' (' + b.brand + ')' : '') : 'not chosen'; });
    document.dispatchEvent(new CustomEvent('ft:branch'));
    if (b) toast(b.town + ' is now your branch');
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  /* Sample branch stock: a stable share of national stock per branch. */
  function branchStock(p, b) {
    if (!p || !b || !p.stock) return 0;
    if (b.caps.indexOf('collect') === -1) return 0;
    var share = (hash(p.code + b.id) % 9) / 100;
    var n = Math.floor(p.stock * share);
    return hash(b.id + p.code) % 5 === 0 ? 0 : n;
  }
  function distanceKm(a, b) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (b[0] - a[0]) * toR, dLng = (b[1] - a[1]) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function postcodeArea(pc) {
    var m = String(pc || '').toUpperCase().replace(/\s+/g, '').match(/^([A-Z]{1,2})[0-9]/);
    return m ? m[1] : null;
  }
  function validPostcode(pc) { return /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i.test(String(pc || '').trim()) || /^[A-Z]{1,2}[0-9][0-9A-Z]?$/i.test(String(pc || '').trim()); }

  /* --- Delivery dates (R22) ----------------------------------------------
     Cut-off 10pm Monday to Friday for next working day (Hours & Delivery page). */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function isWorkday(d) { return d.getDay() !== 0 && d.getDay() !== 6; }
  function addWorkdays(d, n) { var x = new Date(d.getTime()); while (n > 0) { x.setDate(x.getDate() + 1); if (isWorkday(x)) n -= 1; } return x; }
  function longDate(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function despatchInfo(now) {
    now = now || new Date();
    var cut = new Date(now.getTime()); cut.setHours(22, 0, 0, 0);
    if (isWorkday(now) && now < cut) {
      var mins = Math.floor((cut - now) / 60000);
      return { today: true, left: Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm', despatch: now };
    }
    var next = addWorkdays(now, 1);
    return { today: false, despatch: next };
  }
  function deliveryEstimate(p, qty, pc) {
    var area = postcodeArea(pc);
    if (!area || !validPostcode(pc)) return { error: 'Enter a UK postcode, like GL2 5JY or LS1.' };
    if (area !== 'BT' && area !== 'GY' && area !== 'JE' && !FT.POSTCODES[area]) return { error: 'We don\'t recognise ' + pc.toUpperCase() + '. Check the postcode and try again.' };
    var d = despatchInfo();
    var short = p && qty > p.stock;
    var despatch = short ? addWorkdays(d.despatch, p.lead || 3) : d.despatch;
    var extra = FT.NO_NEXT_DAY.indexOf(area) !== -1 ? 2 : (area === 'BT' ? 1 : 0);
    var deliver = addWorkdays(despatch, 1 + extra);
    var lines = [];
    if (short && p.stock > 0) lines.push(fmt(p.stock) + ' in stock now. The other ' + fmt(qty - p.stock) + ' arrive in about ' + (p.lead || 3) + ' working days [sample lead time].');
    else if (short) lines.push('Not in stock. Lead time about ' + (p.lead || 3) + ' working days [sample].');
    if (extra === 2) lines.push(area + ' postcodes are outside the next-day area, so allow 2 to 3 working days.');
    if (area === 'BT') lines.push('Northern Ireland: allow one extra working day [sample].');
    return { date: deliver, today: d.today && !short, left: d.left, lines: lines };
  }

  /* --- Product card markup (R10, R13) ------------------------------------ */
  function productURL(code) { return 'product.html?code=' + encodeURIComponent(code); }
  function stockText(p) {
    if (p.stock > 0) return '<span class="stock in">In stock: ' + fmt(p.stock) + '</span>';
    return '<span class="stock out">Available to order · about ' + (p.lead || 3) + ' working days</span>';
  }
  function cardHTML(p) {
    return '<article class="p-card">' +
      '<div class="wf-placeholder ratio-4-3">Product image</div>' +
      '<p class="p-brand">' + esc(p.brand) + '</p>' +
      '<h3><a href="' + productURL(p.code) + '">' + esc(p.name) + '</a></h3>' +
      '<p class="p-code">Code <b>' + esc(p.code) + '</b></p>' +
      '<p class="p-chips">' + specChips(p) + '</p>' +
      '<p class="p-price">' + priceHTML(p) + '</p>' +
      stockText(p) +
      '<form class="add-row" data-add="' + esc(p.code) + '"><label class="visually-hidden" for="q-' + esc(p.code) + '">Quantity for ' + esc(p.code) + '</label><input type="number" min="1" value="1" id="q-' + esc(p.code) + '"><button class="btn" type="submit">Add</button></form>' +
      '</article>';
  }
  function specChips(p) {
    var c = [];
    if (p.od) c.push(p.od + 'mm OD');
    if (p.cat === 'fitting') c.push(p.shape);
    if (p.thread) c.push(p.thread);
    if (p.maxBar && p.cat === 'fitting') c.push(p.maxBar + ' bar');
    return c.map(function (x) { return '<span class="spec-chip">' + esc(x) + '</span>'; }).join('');
  }
  function rowHTML(p) {
    return '<tr><td><a href="' + productURL(p.code) + '">' + esc(p.name) + '</a><span class="row-sub">' + esc(p.brand) + '</span></td>' +
      '<td class="num">' + esc(p.code) + '</td><td class="num">' + (p.od || '–') + '</td><td>' + esc(p.shape) + '</td><td>' + esc(p.thread || '–') + '</td>' +
      '<td class="num">' + money(withVat(p.offer || p.price)) + (p.offer ? ' <span class="badge">Offer</span>' : '') + '</td>' +
      '<td>' + (p.stock > 0 ? fmt(p.stock) : 'To order') + '</td>' +
      '<td><form class="add-row compact" data-add="' + esc(p.code) + '"><label class="visually-hidden" for="ql-' + esc(p.code) + '">Quantity for ' + esc(p.code) + '</label><input type="number" min="1" value="1" id="ql-' + esc(p.code) + '"><button class="btn btn-sm" type="submit">Add</button></form></td></tr>';
  }
  /* One listener for every Add form on the page. */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest('form[data-add]');
    if (!f) return;
    e.preventDefault();
    var code = f.getAttribute('data-add');
    var qty = parseInt(($('input[type="number"]', f) || {}).value, 10) || 1;
    addToBasket(code, qty);
    var p = byCode(code);
    toast('Added ' + fmt(qty) + ' × ' + (p ? p.name : code) + ' to the basket');
  });

  /* --- Equivalents (R13, R15) -------------------------------------------- */
  function equivalentsFor(match, excludeCode) {
    if (!match) return [];
    return FT.PRODUCTS.filter(function (p) {
      return p.code !== excludeCode && p.cat === 'fitting' && p.od === match.od && p.shape === match.shape && p.conn === match.conn && (match.thread ? p.thread === match.thread : true);
    }).sort(function (a, b) { return (a.brand === 'FT Pro' ? 0 : 1) - (b.brand === 'FT Pro' ? 0 : 1) || (b.stock - a.stock); });
  }
  function crossRefHTML(code) {
    var key = String(code || '').trim().toUpperCase();
    var x = FT.CROSSREF[key];
    var own = byCode(key);
    if (!x && !own) return null;
    var html = '';
    if (x) {
      html += '<p><b>' + esc(key) + '</b>: ' + esc(x.maker) + ' ' + esc(x.desc) + '.</p>';
      if (!x.match) return html + '<p>We don\'t have a direct equivalent in the catalogue. <a href="request-a-quote.html?parts=' + encodeURIComponent(key) + '">Ask us to source it</a>.</p>';
    }
    var list = equivalentsFor(x ? x.match : { od: own.od, shape: own.shape, conn: own.conn, thread: own.thread }, own ? own.code : '');
    if (own) html += '<p>We stock <a href="' + productURL(own.code) + '">' + esc(own.name) + '</a> (' + (own.stock > 0 ? fmt(own.stock) + ' in stock' : 'available to order') + ').</p>';
    if (!list.length) return html + '<p>No equivalents in the sample data.</p>';
    html += '<p class="muted">Equivalent parts with the same size, shape and connection. Check the tech sheet before swapping a part in a regulated or safety-critical system.</p><ul class="equiv-list">';
    list.forEach(function (p) {
      html += '<li><a href="' + productURL(p.code) + '">' + esc(p.name) + '</a><span>' + esc(p.code) + ' · ' + money(withVat(p.offer || p.price)) + ' ' + vatLabel() + ' · ' + (p.stock > 0 ? fmt(p.stock) + ' in stock' : 'to order') + '</span></li>';
    });
    return html + '</ul>';
  }

  /* --- Prototype 1: Find a fitting (R10–R16) ----------------------------- */
  var FACETS = [
    { key: 'od', label: 'Tube OD (mm)', primary: true, sort: function (a, b) { return a - b; } },
    { key: 'conn', label: 'Connection', primary: true },
    { key: 'shape', label: 'Shape', primary: true },
    { key: 'thread', label: 'Thread size and type', primary: true },
    { key: 'brand', label: 'Brand', primary: true },
    { key: 'material', label: 'Material', primary: false },
    { key: 'maxBar', label: 'Max working pressure (bar)', primary: false, sort: function (a, b) { return a - b; } },
    { key: 'series', label: 'Series', primary: false }
  ];
  function initListing() {
    var root = $('#listing');
    if (!root) return;
    var items = FT.PRODUCTS.filter(function (p) { return p.cat === 'fitting'; });
    var state = { sel: {}, avail: 'all', sort: 'relevance', view: load('ft-view', 'grid'), per: load('ft-per', 12), page: 1, q: '' };
    FACETS.forEach(function (f) { state.sel[f.key] = []; });
    ['od', 'conn', 'shape', 'thread', 'brand'].forEach(function (k) {
      var v = param(k);
      if (v) state.sel[k] = v.split('|').map(function (x) { return k === 'od' ? Number(x) : x; });
    });
    if (param('q')) state.q = param('q');

    function matches(p, skip) {
      if (state.q) {
        var q = state.q.toLowerCase();
        if ((p.name + ' ' + p.code).toLowerCase().indexOf(q) === -1) return false;
      }
      if (skip !== 'avail' && state.avail === 'stock' && !(p.stock > 0)) return false;
      if (skip !== 'avail' && state.avail === 'order' && p.stock > 0) return false;
      for (var i = 0; i < FACETS.length; i++) {
        var k = FACETS[i].key;
        if (k === skip || !state.sel[k].length) continue;
        if (state.sel[k].indexOf(p[k]) === -1) return false;
      }
      return true;
    }
    function facetHTML(f) {
      var vals = {};
      items.forEach(function (p) { var v = p[f.key]; if (v === '' || v == null) return; vals[v] = 0; });
      items.forEach(function (p) { var v = p[f.key]; if (v === '' || v == null) return; if (matches(p, f.key)) vals[v] += 1; });
      var keys = Object.keys(vals).map(function (k) { return f.key === 'od' || f.key === 'maxBar' ? Number(k) : k; });
      keys.sort(f.sort || function (a, b) { return String(a).localeCompare(String(b)); });
      var html = '<fieldset class="facet"><legend>' + f.label + '</legend>';
      var shown = 0;
      keys.forEach(function (k) {
        var n = vals[k];
        var on = state.sel[f.key].indexOf(k) !== -1;
        if (!n && !on) return;
        shown += 1;
        var id = 'f-' + f.key + '-' + String(k).replace(/[^a-z0-9]/gi, '');
        html += '<label class="check" for="' + id + '"><input type="checkbox" id="' + id + '" data-facet="' + f.key + '" value="' + esc(k) + '"' + (on ? ' checked' : '') + '> ' + esc(k) + (f.key === 'od' ? 'mm' : '') + ' <span class="count">' + n + '</span></label>';
      });
      if (!shown) html += '<p class="muted small">No options match the other filters.</p>';
      return html + '</fieldset>';
    }
    function availHTML() {
      var all = items.filter(function (p) { return matches(p, 'avail'); });
      var inS = all.filter(function (p) { return p.stock > 0; }).length;
      var opts = [['all', 'Any availability', all.length], ['stock', 'In stock now', inS], ['order', 'Available to order', all.length - inS]];
      return '<fieldset class="facet"><legend>Availability</legend>' + opts.map(function (o) {
        return '<label class="check" for="av-' + o[0] + '"><input type="radio" name="avail" id="av-' + o[0] + '" value="' + o[0] + '"' + (state.avail === o[0] ? ' checked' : '') + '> ' + o[1] + ' <span class="count">' + o[2] + '</span></label>';
      }).join('') + '</fieldset>';
    }
    function sorted(list) {
      var l = list.slice();
      if (state.sort === 'price-asc') l.sort(function (a, b) { return (a.offer || a.price) - (b.offer || b.price); });
      if (state.sort === 'price-desc') l.sort(function (a, b) { return (b.offer || b.price) - (a.offer || a.price); });
      if (state.sort === 'stock') l.sort(function (a, b) { return b.stock - a.stock; });
      return l;
    }
    function render() {
      $('#facets-primary').innerHTML = availHTML() + FACETS.filter(function (f) { return f.primary; }).map(facetHTML).join('');
      $('#facets-more').innerHTML = FACETS.filter(function (f) { return !f.primary; }).map(facetHTML).join('');
      var res = sorted(items.filter(function (p) { return matches(p); }));
      var pages = Math.max(1, Math.ceil(res.length / state.per));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * state.per;
      var slice = res.slice(start, start + state.per);
      $('#result-count').textContent = res.length ? 'Showing ' + (start + 1) + '–' + (start + slice.length) + ' of ' + res.length + ' sample products' : 'No products match';
      var out = $('#results');
      if (!res.length) {
        out.innerHTML = '<div class="empty-state"><h3>No fittings match these filters</h3><p>Remove a filter, or try the <a href="fitting-finder.html">fitting finder</a>.</p><button type="button" class="btn btn-secondary" data-clear>Clear all filters</button></div>';
      } else if (state.view === 'list') {
        out.innerHTML = '<div class="table-wrap"><table class="list-table"><caption class="visually-hidden">Matching products</caption><thead><tr><th scope="col">Product</th><th scope="col">Code</th><th scope="col">OD mm</th><th scope="col">Shape</th><th scope="col">Thread</th><th scope="col">Price (' + vatLabel() + ')</th><th scope="col">Stock</th><th scope="col"><span class="visually-hidden">Add</span></th></tr></thead><tbody>' + slice.map(rowHTML).join('') + '</tbody></table></div>';
      } else {
        out.innerHTML = '<div class="p-grid">' + slice.map(cardHTML).join('') + '</div>';
      }
      var pag = '';
      if (pages > 1) {
        pag = '<nav aria-label="Pages"><ul class="pagination">';
        for (var i = 1; i <= pages; i++) pag += '<li>' + (i === state.page ? '<span class="current" aria-current="page">' + i + '</span>' : '<a href="#results" data-page="' + i + '">' + i + '</a>') + '</li>';
        pag += '</ul></nav>';
      }
      $('#pager').innerHTML = pag;
      var chips = [];
      FACETS.forEach(function (f) { state.sel[f.key].forEach(function (v) { chips.push('<button type="button" class="chip" data-remove="' + f.key + '" data-value="' + esc(v) + '">' + esc(v) + (f.key === 'od' ? 'mm' : '') + ' <span aria-hidden="true">×</span><span class="visually-hidden"> remove filter</span></button>'); }); });
      if (state.avail !== 'all') chips.push('<button type="button" class="chip" data-remove="avail">' + (state.avail === 'stock' ? 'In stock now' : 'Available to order') + ' <span aria-hidden="true">×</span></button>');
      if (state.q) chips.push('<button type="button" class="chip" data-remove="q">“' + esc(state.q) + '” <span aria-hidden="true">×</span></button>');
      if (chips.length) chips.push('<button type="button" class="btn-link" data-clear>Clear all</button>');
      $('#active-filters').innerHTML = chips.join('');
      var nSel = FACETS.reduce(function (s, f) { return s + state.sel[f.key].length; }, 0) + (state.avail !== 'all' ? 1 : 0);
      $all('[data-filter-count]').forEach(function (el) { el.textContent = nSel ? '(' + nSel + ')' : ''; });
      $all('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === state.view ? 'true' : 'false'); });
      var moreCount = FACETS.filter(function (f) { return !f.primary; }).reduce(function (s, f) { return s + state.sel[f.key].length; }, 0);
      $('#more-count').textContent = moreCount ? '(' + moreCount + ' selected)' : '';
      var xr = $('#crossref');
      if (xr) {
        var html = state.q ? crossRefHTML(state.q) : null;
        xr.hidden = !html || !FT.CROSSREF[state.q.trim().toUpperCase()];
        if (!xr.hidden) $('.crossref-body', xr).innerHTML = html;
      }
    }
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.getAttribute('data-facet')) {
        var k = t.getAttribute('data-facet');
        var v = (k === 'od' || k === 'maxBar') ? Number(t.value) : t.value;
        var arr = state.sel[k];
        if (t.checked) { if (arr.indexOf(v) === -1) arr.push(v); } else state.sel[k] = arr.filter(function (x) { return x !== v; });
        state.page = 1; render();
        var again = document.getElementById(t.id); if (again) again.focus();
      } else if (t.name === 'avail') { state.avail = t.value; state.page = 1; render(); var a = document.getElementById(t.id); if (a) a.focus(); }
      else if (t.id === 'sort') { state.sort = t.value; render(); }
      else if (t.id === 'per') { state.per = Number(t.value); store('ft-per', state.per); state.page = 1; render(); }
    });
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button, a');
      if (!t) return;
      if (t.hasAttribute('data-view')) { state.view = t.getAttribute('data-view'); store('ft-view', state.view); render(); }
      else if (t.hasAttribute('data-page')) { e.preventDefault(); state.page = Number(t.getAttribute('data-page')); render(); $('#results').scrollIntoView({ block: 'start' }); }
      else if (t.hasAttribute('data-remove')) {
        var k = t.getAttribute('data-remove');
        if (k === 'avail') state.avail = 'all';
        else if (k === 'q') { state.q = ''; $('#within').value = ''; }
        else { var v = t.getAttribute('data-value'); state.sel[k] = state.sel[k].filter(function (x) { return String(x) !== v; }); }
        state.page = 1; render();
      } else if (t.hasAttribute('data-clear')) {
        FACETS.forEach(function (f) { state.sel[f.key] = []; }); state.avail = 'all'; state.q = ''; $('#within').value = ''; state.page = 1; render();
      }
    });
    var more = $('#more-filters');
    if (more) {
      more.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.getAttribute('data-facet')) return;
        var k = t.getAttribute('data-facet');
        var v = k === 'maxBar' ? Number(t.value) : t.value;
        if (t.checked) state.sel[k].push(v); else state.sel[k] = state.sel[k].filter(function (x) { return x !== v; });
        state.page = 1; render();
      });
    }
    $('#within-form').addEventListener('submit', function (e) { e.preventDefault(); state.q = $('#within').value.trim(); state.page = 1; render(); });
    $('#sort').value = state.sort;
    $('#per').value = String(state.per);
    var ft = $('#filters-toggle');
    if (ft) ft.addEventListener('click', function () {
      var open = !root.classList.contains('filters-open');
      root.classList.toggle('filters-open', open);
      ft.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (state.q) $('#within').value = state.q;
    document.addEventListener('ft:vat', render);
    render();
  }

  /* --- Prototype 1: Fitting finder (R14, R15) ---------------------------- */
  function initFinder() {
    var root = $('#finder');
    if (!root) return;
    var items = FT.PRODUCTS.filter(function (p) { return p.cat === 'fitting'; });
    var steps = [
      { key: 'od', q: 'What size is the tube?', hint: 'Outside diameter, in millimetres. Measure with calipers or read it off the tube.', fmt: function (v) { return v + 'mm'; } },
      { key: 'conn', q: 'What does it connect?', hint: 'Tube to tube joins lengths of tube. Tube to thread screws into a port on a valve, cylinder or manifold.', fmt: function (v) { return v; } },
      { key: 'thread', q: 'What thread is the port?', hint: 'BSPT is tapered, BSPP is parallel, NPT is the US standard. The tech sheet shows each one.', fmt: function (v) { return v; }, when: function (s) { return s.conn === 'Tube to thread'; } },
      { key: 'shape', q: 'What shape do you need?', hint: 'Straight, elbow (90°), tee (three ways, equal) or branch tee (thread on the side).', fmt: function (v) { return v; } }
    ];
    var sel = {};
    var i = 0;
    function pool(upto) {
      return items.filter(function (p) {
        for (var k = 0; k < upto; k++) { var s = steps[k]; if (sel[s.key] != null && p[s.key] !== sel[s.key]) return false; }
        return true;
      });
    }
    function active() { return steps.filter(function (s) { return !s.when || s.when(sel); }); }
    function render() {
      var list = active();
      if (i >= list.length) return showResults();
      var s = list[i];
      var idx = steps.indexOf(s);
      var p = pool(idx);
      var counts = {};
      p.forEach(function (x) { var v = x[s.key]; if (v === '' || v == null) return; counts[v] = (counts[v] || 0) + 1; });
      var keys = Object.keys(counts).map(function (k) { return s.key === 'od' ? Number(k) : k; }).sort(function (a, b) { return s.key === 'od' ? a - b : String(a).localeCompare(String(b)); });
      $('#finder-progress').innerHTML = list.map(function (x, n) { return '<li class="' + (n < i ? 'done' : n === i ? 'current' : '') + '">' + esc(x.q.replace('?', '')) + (n < i ? ': <b>' + esc(x.fmt(sel[x.key])) + '</b>' : '') + '</li>'; }).join('');
      $('#finder-step').innerHTML = '<fieldset><legend><span class="step-q">' + esc(s.q) + '</span></legend><p class="field-hint">' + esc(s.hint) + '</p><div class="option-grid">' +
        keys.map(function (k) { return '<button type="button" class="opt-btn" data-val="' + esc(k) + '" aria-pressed="' + (sel[s.key] === k ? 'true' : 'false') + '"><b>' + esc(s.fmt(k)) + '</b><span>' + counts[k] + ' product' + (counts[k] === 1 ? '' : 's') + '</span></button>'; }).join('') +
        '</div></fieldset>';
      $('#finder-back').hidden = i === 0;
      $('#finder-results').hidden = true;
      var first = $('.opt-btn', root); if (first && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('opt-btn')) first.focus();
    }
    function showResults() {
      var list = active();
      var res = items.filter(function (p) { return list.every(function (s) { return p[s.key] === sel[s.key]; }); })
        .sort(function (a, b) { return (a.brand === 'FT Pro' ? 0 : 1) - (b.brand === 'FT Pro' ? 0 : 1) || (b.stock - a.stock); });
      $('#finder-progress').innerHTML = list.map(function (x) { return '<li class="done">' + esc(x.q.replace('?', '')) + ': <b>' + esc(x.fmt(sel[x.key])) + '</b></li>'; }).join('');
      $('#finder-step').innerHTML = '';
      var r = $('#finder-results');
      r.hidden = false;
      var q = list.map(function (s) { return s.key + '=' + encodeURIComponent(sel[s.key]); }).join('&');
      $('h2', r).textContent = res.length + ' matching ' + (res.length === 1 ? 'fitting' : 'fittings');
      $('.finder-list', r).innerHTML = res.map(function (p, n) {
        return '<li class="finder-hit">' + (n === 0 && p.brand === 'FT Pro' ? '<span class="badge solid">Best match</span>' : '') + '<a href="' + productURL(p.code) + '">' + esc(p.name) + '</a><span>' + esc(p.code) + ' · ' + money(withVat(p.offer || p.price)) + ' ' + vatLabel() + ' · ' + (p.stock > 0 ? fmt(p.stock) + ' in stock' : 'to order') + '</span>' +
          '<form class="add-row compact" data-add="' + esc(p.code) + '"><label class="visually-hidden" for="fq-' + n + '">Quantity</label><input type="number" min="1" value="1" id="fq-' + n + '"><button class="btn btn-sm" type="submit">Add</button></form></li>';
      }).join('');
      $('#finder-all').setAttribute('href', 'find-a-fitting.html?' + q);
      $('#finder-back').hidden = false;
      var h = $('h2', r); h.setAttribute('tabindex', '-1'); h.focus();
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.opt-btn');
      if (b) {
        var s = active()[i];
        sel[s.key] = s.key === 'od' ? Number(b.getAttribute('data-val')) : b.getAttribute('data-val');
        steps.forEach(function (x, n) { if (n > steps.indexOf(s)) delete sel[x.key]; });
        i += 1; render();
        var q = $('.step-q', root); if (q) { q.setAttribute('tabindex', '-1'); q.focus(); }
      }
    });
    $('#finder-back').addEventListener('click', function () { i = Math.max(0, Math.min(i, active().length) - 1); render(); });
    $('#finder-restart').addEventListener('click', function () { sel = {}; i = 0; render(); });
    var xf = $('#xref-form');
    if (xf) xf.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#xref-code').value.trim();
      var out = $('#xref-result');
      var html = v ? crossRefHTML(v) : null;
      out.hidden = false;
      out.innerHTML = html || '<p>We couldn\'t match <b>' + esc(v || 'that code') + '</b> in the sample data. Try KQ2T08-00A, QST-8, 3104 08 00 or PM0408E, or <a href="request-a-quote.html?parts=' + encodeURIComponent(v) + '">ask us to identify it</a>.</p>';
    });
    $all('[data-xref]').forEach(function (b) { b.addEventListener('click', function () { $('#xref-code').value = b.getAttribute('data-xref'); xf.requestSubmit ? xf.requestSubmit() : xf.dispatchEvent(new Event('submit')); }); });
    document.addEventListener('ft:vat', function () { if (!$('#finder-results').hidden) showResults(); });
    render();
  }

  /* --- Prototype 2: Product page (R20–R28) ------------------------------- */
  function initProduct() {
    var root = $('#product');
    if (!root) return;
    var p = byCode(param('code')) || byCode('2019-8412');
    document.title = p.code + ' ' + p.name + ' — Flowtech prototype';
    $('#crumb-name').textContent = p.name;
    $('#crumb-cat').textContent = p.cat === 'tube' ? 'Tubing' : (p.cat === 'fitting' ? (p.conn === 'Tube to thread' ? 'Male studs and elbows' : 'Tube to tube connectors') : 'Accessories');
    $('#p-name').textContent = p.name;
    $('#p-brand').textContent = p.brand;
    $('#p-code').textContent = p.code;
    $('#p-chips').innerHTML = specChips(p);

    function renderPrice() {
      $('#p-price').innerHTML = priceHTML(p);
      $('#p-alt-vat').textContent = vatMode() === 'inc' ? money(p.offer || p.price) + ' exc VAT' : money((p.offer || p.price) * 1.2) + ' inc VAT';
      var qty = Math.max(1, parseInt($('#p-qty').value, 10) || 1);
      $('#p-line').textContent = fmt(qty) + ' × ' + money(withVat(p.offer || p.price)) + ' = ' + money(withVat((p.offer || p.price) * qty)) + ' ' + vatLabel();
    }
    function renderStock() {
      $('#p-stock').innerHTML = p.stock > 0 ? '<b>' + fmt(p.stock) + '</b> in stock nationally' : '<b>Not in stock.</b> Lead time about ' + (p.lead || 3) + ' working days [sample]';
      var b = myBranch();
      var el = $('#p-branch');
      if (!b) { el.innerHTML = '<a href="branches.html?from=' + encodeURIComponent(p.code) + '">Choose your branch</a> to see local stock and collection.'; return; }
      var n = branchStock(p, b);
      var collect = b.caps.indexOf('collect') !== -1;
      el.innerHTML = 'At <b>' + esc(b.town) + '</b>' + (b.brand !== 'Flowtech' ? ' (' + esc(b.brand) + ')' : '') + ': ' + (n > 0 ? fmt(n) + ' in stock' + (collect ? ', ready to collect in about 1 hour [sample]' : '') : 'none in stock' + (collect ? ', can be sent for collection tomorrow' : '')) + '. <a href="branches.html?from=' + encodeURIComponent(p.code) + '">Change branch</a>';
    }
    function renderCountdown() {
      var d = despatchInfo();
      $('#p-cutoff').textContent = p.stock > 0
        ? (d.today ? 'Order in the next ' + d.left + ' for despatch today.' : 'Order now for despatch on ' + longDate(d.despatch) + '.')
        : 'Ships when stock arrives, in about ' + (p.lead || 3) + ' working days [sample].';
    }
    renderPrice(); renderStock(); renderCountdown();
    $('#p-qty').addEventListener('input', function () { renderPrice(); $('#delivery-result').hidden = true; });
    $all('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        var q = $('#p-qty'); q.value = Math.max(1, (parseInt(q.value, 10) || 1) + Number(b.getAttribute('data-step'))); renderPrice();
      });
    });
    $('#p-add').addEventListener('click', function () {
      var qty = Math.max(1, parseInt($('#p-qty').value, 10) || 1);
      addToBasket(p.code, qty);
      toast('Added ' + fmt(qty) + ' × ' + p.name + ' to the basket');
    });
    $('#p-tech').addEventListener('click', function (e) { e.preventDefault(); var t = $('[data-tab="tab-downloads"]'); t.click(); t.focus(); });
    $('#p-tech').textContent = p.techSheet ? 'Tech sheet ' + p.techSheet + ' (PDF)' : 'Tech sheet (PDF) [sample]';

    /* Delivery checker (R22) */
    var pc = $('#d-postcode');
    var saved = load('ft-postcode', '');
    if (saved) pc.value = saved;
    $('#delivery-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var qty = Math.max(1, parseInt($('#p-qty').value, 10) || 1);
      var r = deliveryEstimate(p, qty, pc.value);
      var field = pc.closest('.field');
      var out = $('#delivery-result');
      if (r.error) { field.classList.add('has-error'); $('.field-error', field).textContent = r.error; $('.field-error', field).hidden = false; out.hidden = true; pc.focus(); return; }
      field.classList.remove('has-error'); $('.field-error', field).hidden = true;
      store('ft-postcode', pc.value.trim().toUpperCase());
      out.hidden = false;
      out.innerHTML = '<p class="d-date">Arrives <b>' + longDate(r.date) + '</b> to ' + esc(pc.value.trim().toUpperCase()) + '</p>' +
        (r.today ? '<p>Order in the next ' + r.left + ' for despatch today. Free next-day delivery on orders over £50 exc VAT.</p>' : '') +
        r.lines.map(function (l) { return '<p class="muted">' + esc(l) + '</p>'; }).join('');
    });

    /* Specifications: only fields with values (R24) */
    var spec = [['Brand', p.brand], ['Series', p.series], ['Product type', p.cat === 'fitting' ? 'Push-in fitting' : (p.cat === 'tube' ? 'Pneumatic tube' : 'Accessory')], ['Shape', p.cat === 'fitting' ? p.shape : ''], ['Connection', p.cat === 'fitting' ? p.conn : ''],
      ['Outside diameter', p.od ? p.od + ' mm' : ''], ['Thread', p.thread], ['Material', p.material], ['Maximum working pressure', p.cat !== 'tool' ? p.maxBar + ' bar' : ''], ['Working temperature', p.cat !== 'tool' ? p.temp : ''], ['Media', p.cat === 'fitting' || p.cat === 'tube' ? 'Air and vacuum' : ''], ['Sold as', p.pack || 'Each']];
    $('#spec-list').innerHTML = spec.filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    $('#spec-text').textContent = p.brand === 'FT Pro' && p.cat === 'fitting'
      ? p.od + 'mm outside diameter, pneumatic one-touch push-in metric tube fitting, ' + p.shape.toLowerCase() + ', ' + p.material.toLowerCase() + '. Working temperature 0°C to +60°C, maximum working pressure ' + p.maxBar + ' bar. Media: air and vacuum only. Negative pressure: -750mm Hg (10 Torr).'
      : '[Description from product data, written to the house standard: brand, size, type, material, ratings, media.]';

    /* Variants: same family, other sizes (R25) */
    var fam = FT.PRODUCTS.filter(function (x) { return x.brand === p.brand && x.cat === p.cat && x.shape === p.shape && x.conn === p.conn && x.series === p.series && (p.cat !== 'fitting' || (x.thread ? x.thread.split(' ').pop() : '') === (p.thread ? p.thread.split(' ').pop() : '')); });
    fam.sort(function (a, b) { return a.od - b.od || String(a.thread).localeCompare(String(b.thread)); });
    function renderVariants() {
      $('#variants').innerHTML = fam.length > 1
        ? '<div class="table-wrap"><table class="list-table"><caption class="visually-hidden">Sizes in this range</caption><thead><tr><th scope="col">Size</th>' + (fam.some(function (x) { return x.thread; }) ? '<th scope="col">Thread</th>' : '') + '<th scope="col">Code</th><th scope="col">Price (' + vatLabel() + ')</th><th scope="col">Stock</th><th scope="col"><span class="visually-hidden">Add</span></th></tr></thead><tbody>' +
          fam.map(function (x) {
            var cur = x.code === p.code;
            return '<tr' + (cur ? ' class="current"' : '') + '><td>' + (x.od ? x.od + 'mm OD' : '–') + (cur ? ' <span class="badge">This one</span>' : '') + '</td>' + (fam.some(function (y) { return y.thread; }) ? '<td>' + esc(x.thread || '–') + '</td>' : '') + '<td class="num">' + (cur ? esc(x.code) : '<a href="' + productURL(x.code) + '">' + esc(x.code) + '</a>') + '</td><td class="num">' + money(withVat(x.offer || x.price)) + '</td><td>' + (x.stock > 0 ? fmt(x.stock) : 'To order') + '</td><td><form class="add-row compact" data-add="' + esc(x.code) + '"><label class="visually-hidden" for="v-' + esc(x.code) + '">Quantity for ' + esc(x.code) + '</label><input type="number" min="1" value="1" id="v-' + esc(x.code) + '"><button class="btn btn-sm" type="submit">Add</button></form></td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<p class="muted">This product comes in one size.</p>';
    }
    renderVariants();

    /* Fits with (R26) */
    var fits = FT.PRODUCTS.filter(function (x) { return x.code !== p.code && (x.cat === 'tube' || x.cat === 'accessory') && x.od === p.od; })
      .concat(FT.PRODUCTS.filter(function (x) { return x.cat === 'tool'; }));
    function renderFits() {
      var host = $('#fits');
      if (!fits.length || p.cat !== 'fitting') { host.innerHTML = '<p class="muted">[Compatible items come from product relationships in the product information system.]</p>'; $('#fits-add').hidden = true; return; }
      host.innerHTML = fits.map(function (x, n) {
        return '<label class="fit-item" for="fit-' + n + '"><input type="checkbox" id="fit-' + n + '" value="' + esc(x.code) + '"><span class="wf-placeholder ratio-1-1">Image</span><span class="fit-body"><b>' + esc(x.name) + '</b><span>' + esc(x.code) + ' · ' + money(withVat(x.price)) + ' ' + vatLabel() + (x.pack ? ' · ' + esc(x.pack) : '') + ' · ' + (x.stock > 0 ? 'In stock' : 'To order') + '</span><span class="why-fit">' + (x.cat === 'tube' ? 'Tube to suit ' + p.od + 'mm push-in fittings' : x.cat === 'tool' ? 'Square cuts so the tube seals' : 'Fits ' + p.od + 'mm fittings') + '</span></span></label>';
      }).join('');
    }
    renderFits();
    $('#fits-add').addEventListener('click', function () {
      var picked = $all('#fits input:checked');
      if (!picked.length) { toast('Tick the items you want to add first'); return; }
      picked.forEach(function (c) { addToBasket(c.value, 1); c.checked = false; });
      toast('Added ' + picked.length + ' item' + (picked.length === 1 ? '' : 's') + ' to the basket');
    });

    /* Equivalents and look-alikes (R27, R28) */
    var eq = equivalentsFor({ od: p.od, shape: p.shape, conn: p.conn, thread: p.thread }, p.code).filter(function (x) { return x.brand !== p.brand || x.series !== p.series; });
    function renderEq() {
      $('#equivalents').innerHTML = p.cat !== 'fitting' ? '<p class="muted">No equivalents for this item.</p>' : (eq.length ? '<ul class="equiv-list">' + eq.map(function (x) {
        return '<li><a href="' + productURL(x.code) + '">' + esc(x.name) + '</a><span>' + esc(x.brand) + (x.series ? ' · ' + esc(x.series) : '') + ' · ' + esc(x.code) + ' · ' + money(withVat(x.offer || x.price)) + ' ' + vatLabel() + ' · ' + (x.stock > 0 ? fmt(x.stock) + ' in stock' : 'to order') + '</span></li>';
      }).join('') + '</ul>' : '<p class="muted">No other brands in the sample data for this size and shape.</p>');
      var twin = FT.PRODUCTS.filter(function (x) { return x.code !== p.code && x.brand === p.brand && x.od === p.od && x.shape === p.shape && x.conn === p.conn && x.thread === p.thread && x.series !== p.series; })[0];
      var box = $('#lookalike');
      box.hidden = !twin;
      if (twin) {
        $('.lookalike-body', box).innerHTML = '<p>There are two ' + esc(p.brand) + ' ' + p.od + 'mm ' + esc(p.shape.toLowerCase()) + 's. Here is how they differ.</p><div class="table-wrap"><table class="list-table"><thead><tr><th scope="col"></th><th scope="col">' + esc(p.code) + ' (this one)</th><th scope="col"><a href="' + productURL(twin.code) + '">' + esc(twin.code) + '</a></th></tr></thead><tbody>' +
          [['Series', p.series, twin.series], ['Material', p.material, twin.material], ['Max pressure', p.maxBar + ' bar', twin.maxBar + ' bar'], ['Price', money(withVat(p.price)), money(withVat(twin.price))], ['Stock', fmt(p.stock), fmt(twin.stock)]].map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      }
    }
    renderEq();
    document.addEventListener('ft:vat', function () { renderPrice(); renderVariants(); renderFits(); renderEq(); });
    document.addEventListener('ft:branch', renderStock);
    var sticky = $('#p-sticky');
    if (sticky) {
      document.body.classList.add('has-prop-sticky');
      $('#p-sticky-name').textContent = p.code;
      $('#p-sticky-add').addEventListener('click', function () { $('#p-add').click(); });
    }
  }

  /* --- Basket panel (quick order page) ----------------------------------- */
  function renderBasket() {
    var host = $('#basket-lines');
    if (!host) return;
    var lines = basketLines();
    if (!lines.length) {
      host.innerHTML = '<p class="muted">Your basket is empty. Add products from the quick order rows, a listing or a product page.</p>';
      $('#basket-total').textContent = '';
      $('#basket-actions').hidden = true;
      return;
    }
    $('#basket-actions').hidden = false;
    var sub = lines.reduce(function (s, l) { return s + l.total; }, 0);
    host.innerHTML = '<div class="table-wrap"><table class="list-table"><caption class="visually-hidden">Basket</caption><thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Line total (' + vatLabel() + ')</th><th scope="col"><span class="visually-hidden">Remove</span></th></tr></thead><tbody>' +
      lines.map(function (l, n) {
        return '<tr><td>' + esc(l.name) + '<span class="row-sub">' + esc(l.code) + ' · ' + money(withVat(l.unit)) + ' each</span></td><td><label class="visually-hidden" for="bq-' + n + '">Quantity</label><input class="qty-sm" type="number" min="1" id="bq-' + n + '" value="' + l.qty + '" data-bq="' + n + '"></td><td class="num">' + money(withVat(l.total)) + '</td><td><button type="button" class="btn-link" data-bremove="' + n + '">Remove</button></td></tr>';
      }).join('') + '</tbody></table></div>';
    var carriage = sub >= 50 ? 0 : 12.5;
    $('#basket-total').innerHTML = 'Goods ' + money(withVat(sub)) + ' · Next-day delivery ' + (carriage ? money(withVat(carriage)) : 'free') + ' · <b>Total ' + money(withVat(sub + carriage)) + ' ' + vatLabel() + '</b>';
  }
  function initBasketPanel() {
    var host = $('#basket-lines');
    if (!host) return;
    host.addEventListener('change', function (e) {
      var i = e.target.getAttribute('data-bq');
      if (i == null) return;
      /* Defer: a change fires on blur, often just before a Remove click re-renders the table. */
      var qty = Math.max(1, parseInt(e.target.value, 10) || 1);
      var code = getBasket()[Number(i)] && getBasket()[Number(i)].code;
      window.setTimeout(function () {
        var b = getBasket();
        if (b[Number(i)] && b[Number(i)].code === code) { b[Number(i)].qty = qty; setBasket(b); }
      }, 0);
    });
    host.addEventListener('click', function (e) {
      var i = e.target.getAttribute('data-bremove');
      if (i == null) return;
      var b = getBasket(); var gone = b.splice(Number(i), 1)[0]; setBasket(b);
      toast('Removed ' + gone.code);
    });
    $('#basket-clear').addEventListener('click', function () { setBasket([]); toast('Basket cleared'); });
    $('#basket-checkout').addEventListener('click', function () { toast('Checkout is outside these prototypes'); });
    document.addEventListener('ft:vat', renderBasket);
    renderBasket();
  }

  /* Parse pasted or uploaded lines: "code<tab|,|;|spaces>qty" (R30) */
  function parseLines(text) {
    return String(text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
      var parts = l.split(/\t|,|;/).map(function (x) { return x.trim(); }).filter(Boolean);
      if (parts.length < 2) { var m = l.match(/^(.*?)\s+(\d+)$/); parts = m ? [m[1], m[2]] : [l, '1']; }
      return { code: parts[0].replace(/^"|"$/g, ''), qty: parseInt(parts[1], 10) || 1 };
    }).filter(function (r) { return !/^(code|product|part)/i.test(r.code); });
  }

  /* --- Prototype 3: Quick order (R30–R32) -------------------------------- */
  function initQuickOrder() {
    var body = $('#qo-rows');
    if (!body) return;
    var n = 0;
    function addRow(code, qty) {
      n += 1;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><label class="visually-hidden" for="qo-c' + n + '">Product code, row ' + n + '</label><input type="text" id="qo-c' + n + '" class="qo-code" autocomplete="off" spellcheck="false" value="' + esc(code || '') + '" placeholder=""></td>' +
        '<td><label class="visually-hidden" for="qo-q' + n + '">Quantity, row ' + n + '</label><input type="number" min="1" id="qo-q' + n + '" class="qo-qty qty-sm" value="' + (qty || 1) + '"></td>' +
        '<td class="qo-desc" aria-live="polite"></td><td class="num qo-price"></td><td><button type="button" class="btn-link qo-del">Remove</button></td>';
      body.appendChild(tr);
      lookup(tr);
      return tr;
    }
    function lookup(tr) {
      var code = $('.qo-code', tr).value.trim();
      var qty = Math.max(1, parseInt($('.qo-qty', tr).value, 10) || 1);
      var desc = $('.qo-desc', tr), price = $('.qo-price', tr);
      tr.classList.remove('bad', 'ok');
      if (!code) { desc.innerHTML = '<span class="muted">Type or paste a code</span>'; price.textContent = ''; return; }
      var p = byCode(code);
      if (!p) {
        var x = FT.CROSSREF[code.toUpperCase()];
        tr.classList.add('bad');
        desc.innerHTML = x ? 'That\'s a ' + esc(x.maker) + ' code. <a href="fitting-finder.html?code=' + encodeURIComponent(code) + '">See our equivalents</a>' : 'We can\'t find <b>' + esc(code) + '</b>. Check the code, or <a href="request-a-quote.html?parts=' + encodeURIComponent(code + ' ' + qty) + '">ask for a quote</a>.';
        price.textContent = '';
        return;
      }
      tr.classList.add('ok');
      desc.innerHTML = esc(p.name) + '<span class="row-sub">' + (p.stock >= qty ? 'In stock' : (p.stock > 0 ? fmt(p.stock) + ' in stock, rest to order' : 'To order, about ' + (p.lead || 3) + ' working days')) + '</span>';
      price.textContent = money(withVat((p.offer || p.price) * qty));
    }
    body.addEventListener('input', function (e) { var tr = e.target.closest('tr'); if (tr) lookup(tr); });
    body.addEventListener('click', function (e) { if (e.target.classList.contains('qo-del')) { e.target.closest('tr').remove(); if (!body.children.length) addRow(); } });
    body.addEventListener('keydown', function (e) {
      /* Enter moves code → quantity → next row, adding a row at the end. */
      if (e.key !== 'Enter') return;
      var tr = e.target.closest('tr');
      if (e.target.classList.contains('qo-code')) { e.preventDefault(); $('.qo-qty', tr).focus(); $('.qo-qty', tr).select(); }
      else if (e.target.classList.contains('qo-qty')) { e.preventDefault(); var next = tr.nextElementSibling || addRow(); $('.qo-code', next).focus(); }
    });
    $('#qo-add-row').addEventListener('click', function () { var tr = addRow(); $('.qo-code', tr).focus(); });
    function fillFrom(list, source) {
      if (!list.length) { toast('No lines found in the ' + source); return; }
      $all('tr', body).forEach(function (tr) { if (!$('.qo-code', tr).value.trim()) tr.remove(); });
      list.forEach(function (r) { addRow(r.code, r.qty); });
      var bad = $all('tr.bad', body).length;
      $('#qo-summary').textContent = list.length + ' line' + (list.length === 1 ? '' : 's') + ' added from the ' + source + (bad ? '. ' + bad + ' need checking (marked).' : '.');
    }
    $('#qo-paste-btn').addEventListener('click', function () { fillFrom(parseLines($('#qo-paste').value), 'pasted text'); $('#qo-paste').value = ''; });
    $('#qo-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { fillFrom(parseLines(r.result), 'file ' + f.name); };
      r.readAsText(f);
    });
    $('#qo-sample').addEventListener('click', function () { $('#qo-paste').value = '2019-8412\t200\n2019-5004\t150\nFT-PU08-30B\t6\nKQ2T08-00A\t40\nABC-999\t10'; $('#qo-paste').focus(); });
    $('#qo-submit').addEventListener('click', function () {
      var added = 0, skipped = 0;
      $all('tr', body).forEach(function (tr) {
        var p = byCode($('.qo-code', tr).value);
        if (!p) { if ($('.qo-code', tr).value.trim()) skipped += 1; return; }
        addToBasket(p.code, $('.qo-qty', tr).value); added += 1;
      });
      if (!added) { toast('Enter at least one product code we recognise'); return; }
      toast('Added ' + added + ' line' + (added === 1 ? '' : 's') + ' to the basket' + (skipped ? '. ' + skipped + ' skipped' : ''));
      $('#basket').scrollIntoView({ block: 'start' });
    });
    document.addEventListener('ft:vat', function () { $all('tr', body).forEach(lookup); });
    for (var i = 0; i < 4; i++) addRow();
  }

  /* --- Prototype 3: Request a quote (R33, R34) --------------------------- */
  function initQuote() {
    var f = $('#rfq-form');
    if (!f) return;
    var parts = $('#rfq-parts');
    var pre = param('parts');
    if (pre) parts.value = pre.replace(/\s+(\d+)$/, '\t$1');
    function preview() {
      var rows = parseLines(parts.value);
      var host = $('#rfq-preview');
      if (!rows.length) { host.innerHTML = ''; return; }
      host.innerHTML = '<p class="small"><b>' + rows.length + ' line' + (rows.length === 1 ? '' : 's') + '</b>, ' + rows.filter(function (r) { return byCode(r.code); }).length + ' matched to our catalogue. Unmatched lines are fine: we\'ll identify them.</p><ul class="rfq-list">' +
        rows.map(function (r) { var p = byCode(r.code); var x = FT.CROSSREF[r.code.toUpperCase()]; return '<li class="' + (p ? 'ok' : '') + '"><b>' + esc(r.code) + '</b> × ' + fmt(r.qty) + ' <span>' + (p ? esc(p.name) : x ? esc(x.maker) + ' ' + esc(x.desc) + ', we\'ll offer an equivalent' : 'Not matched, we\'ll identify it') + '</span></li>'; }).join('') + '</ul>';
    }
    parts.addEventListener('input', preview);
    preview();
    $('#rfq-file-parts').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var r = new FileReader();
      r.onload = function () { parts.value = (parts.value ? parts.value + '\n' : '') + r.result; preview(); };
      r.readAsText(file);
    });
    $('#rfq-files').addEventListener('change', function (e) {
      var list = Array.prototype.slice.call(e.target.files || []);
      var total = list.reduce(function (s, x) { return s + x.size; }, 0);
      var host = $('#rfq-file-list');
      host.innerHTML = list.map(function (x) { return '<li>' + esc(x.name) + ' <span class="muted">' + Math.max(1, Math.round(x.size / 1024)) + ' KB</span></li>'; }).join('');
      var err = $('#rfq-files-error');
      err.hidden = total <= 20 * 1024 * 1024;
    });
    $all('[name="rfq-account"]').forEach(function (r) { r.addEventListener('change', function () { $('#rfq-acc-field').hidden = $('[name="rfq-account"]:checked').value !== 'yes'; }); });
    var d = $('#rfq-date');
    if (d) d.min = new Date().toISOString().slice(0, 10);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      var rows = parseLines(parts.value);
      var ref = 'Q-' + (48214 + (hash(parts.value) % 600));
      f.hidden = true;
      var done = $('#rfq-done');
      done.hidden = false;
      $('#rfq-ref').textContent = ref;
      $('#rfq-lines').textContent = rows.length + ' line' + (rows.length === 1 ? '' : 's');
      $('#rfq-email').textContent = $('#rfq-mail').value;
      var h = $('h2', done); h.setAttribute('tabindex', '-1'); h.focus();
      var q = load('ft-new-quote', null);
      store('ft-new-quote', { ref: ref, date: 'Today', valid: '–', status: 'Received', lines: rows.map(function (r) { return [r.code, r.qty]; }) });
      void q;
    });
  }

  /* --- Prototype 3: My quotes (R35) -------------------------------------- */
  function initMyQuotes() {
    var host = $('#quote-list');
    if (!host) return;
    var quotes = FT.QUOTES.slice();
    var extra = load('ft-new-quote', null);
    if (extra) quotes.unshift(extra);
    var filter = 'all';
    function total(q) { return q.lines.reduce(function (s, l) { var p = byCode(l[0]); return s + (p ? (p.offer || p.price) * l[1] * 0.92 : 0); }, 0); }
    function render() {
      var term = $('#quote-search').value.trim().toUpperCase().replace(/^Q-?/, '');
      var list = quotes.filter(function (q) { return (filter === 'all' || q.status === filter) && (!term || q.ref.replace('Q-', '').indexOf(term) !== -1); });
      host.innerHTML = list.length ? '<div class="table-wrap"><table class="list-table"><caption class="visually-hidden">Your quotes</caption><thead><tr><th scope="col">Quote</th><th scope="col">Requested</th><th scope="col">Lines</th><th scope="col">Value (' + vatLabel() + ')</th><th scope="col">Valid until</th><th scope="col">Status</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>' +
        list.map(function (q) {
          var i = quotes.indexOf(q);
          return '<tr><td class="num"><b>' + esc(q.ref) + '</b></td><td>' + esc(q.date) + '</td><td>' + q.lines.length + '</td><td class="num">' + (q.status === 'Received' || q.status === 'In progress' ? '–' : money(withVat(total(q)))) + '</td><td>' + esc(q.valid) + '</td><td><span class="badge' + (q.status === 'Ready' ? ' solid' : '') + '">' + esc(q.status) + '</span></td><td><button type="button" class="btn btn-sm btn-secondary" data-qview="' + i + '">View</button></td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty-state"><p>No quotes match. Check the quote number on your email, for example 48213.</p></div>';
      $('#quote-count').textContent = list.length + ' of ' + quotes.length + ' quotes';
    }
    $('#quote-search').addEventListener('input', render);
    $all('[data-qfilter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-qfilter');
        $all('[data-qfilter]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    var modal = $('#quote-modal');
    var current = null;
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qview]');
      if (!b) return;
      current = quotes[Number(b.getAttribute('data-qview'))];
      $('#qm-title').textContent = 'Quote ' + current.ref;
      $('#qm-meta').textContent = 'Requested ' + current.date + ' · Valid until ' + current.valid + ' · ' + current.status;
      $('#qm-lines').innerHTML = current.lines.map(function (l) { var p = byCode(l[0]); var unit = p ? (p.offer || p.price) * 0.92 : 0; return '<tr><td>' + esc(p ? p.name : l[0]) + '<span class="row-sub">' + esc(l[0]) + '</span></td><td class="num">' + fmt(l[1]) + '</td><td class="num">' + (current.status === 'Received' || current.status === 'In progress' ? '–' : money(withVat(unit))) + '</td></tr>'; }).join('');
      var ready = current.status === 'Ready';
      $('#qm-order').hidden = !ready;
      $('#qm-expired').hidden = current.status !== 'Expired';
      $('#qm-wait').hidden = !(current.status === 'In progress' || current.status === 'Received');
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      var panel = $('.wf-modal-panel', modal); panel.setAttribute('tabindex', '-1'); panel.focus();
    });
    $('#qm-order').addEventListener('click', function () {
      current.lines.forEach(function (l) { var p = byCode(l[0]); if (p) addToBasket(p.code, l[1], p.name + ' (quote ' + current.ref + ')', (p.offer || p.price) * 0.92); });
      modal.classList.remove('open'); document.body.style.overflow = '';
      toast('Quote ' + current.ref + ' added to the basket at quoted prices');
    });
    document.addEventListener('ft:vat', render);
    render();
  }

  /* --- Prototype 3: Registration (R36) ----------------------------------- */
  function initRegister() {
    var f = $('#reg-form');
    if (!f) return;
    function biz() { var c = $('[name="reg-biz"]:checked'); return c ? c.value : 'yes'; }
    $all('[name="reg-biz"]').forEach(function (r) { r.addEventListener('change', function () { $('#reg-company').hidden = biz() !== 'yes'; }); });
    $('#reg-lookup').addEventListener('click', function () {
      var v = $('#reg-crn').value.trim();
      var out = $('#reg-lookup-result');
      out.hidden = false;
      if (!/^([0-9]{8}|[A-Z]{2}[0-9]{6})$/i.test(v)) { out.innerHTML = '<p class="field-error">Enter an 8-character company number, like 01234567 or SC123456.</p>'; return; }
      out.innerHTML = '<p><b>[Sample Engineering Ltd]</b><br>[Registered address from Companies House]</p><p class="small muted">Is this your company? <button type="button" class="btn-link" id="reg-use">Use these details</button></p>';
      $('#reg-use').addEventListener('click', function () { $('#reg-name').value = 'Sample Engineering Ltd'; out.innerHTML = '<p>Company details added.</p>'; $('#reg-name').focus(); });
    });
    var pw = $('#reg-pass');
    function checks() {
      var v = pw.value;
      var rules = [['len', v.length >= 10], ['num', /\d/.test(v)], ['case', /[a-z]/.test(v) && /[A-Z]/.test(v)]];
      rules.forEach(function (r) { var li = $('[data-rule="' + r[0] + '"]'); li.classList.toggle('met', r[1]); $('.rule-state', li).textContent = r[1] ? 'Done:' : 'Needs:'; });
      return rules.every(function (r) { return r[1]; });
    }
    pw.addEventListener('input', checks);
    $('#reg-show').addEventListener('click', function () { var s = pw.type === 'password'; pw.type = s ? 'text' : 'password'; this.textContent = s ? 'Hide' : 'Show'; });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = validateForm(f);
      var pf = pw.closest('.field');
      var good = checks();
      pf.classList.toggle('has-error', !good);
      $('.field-error', pf).hidden = good;
      if (!ok || !good) { if (ok) pw.focus(); return; }
      f.hidden = true;
      var done = $('#reg-done'); done.hidden = false;
      $('#reg-done-mail').textContent = $('#reg-email').value;
      var h = $('h2', done); h.setAttribute('tabindex', '-1'); h.focus();
    });
  }

  /* --- Prototype 4: Engineering services (R40–R47) ----------------------- */
  function serviceById(id) { return (FT.SERVICES || []).filter(function (s) { return s.id === id; })[0] || null; }
  function caseById(id) { return (FT.CASES || []).filter(function (c) { return c.id === id; })[0] || null; }
  function sitesFor(caps) { return FT.BRANCHES.filter(function (b) { return caps.some(function (c) { return b.caps.indexOf(c) !== -1; }); }); }
  function caseCard(c) {
    return '<article class="case-card"><div class="wf-placeholder ratio-16-9">' + (c.real ? 'Project photo' : 'Photo [to be supplied]') + '</div><div class="case-body"><p class="wf-meta">' + esc(c.sector) + ' · ' + esc(c.place) + '</p><h3><a href="case-studies.html?case=' + c.id + '" data-case="' + c.id + '">' + esc(c.title) + '</a></h3><p>' + esc(c.summary) + '</p></div></article>';
  }
  function initServicesHub() {
    var grid = $('#service-grid');
    if (!grid) return;
    grid.innerHTML = FT.SERVICES.map(function (s) {
      return '<article class="svc-card"><h3><a href="service.html?id=' + s.id + '">' + esc(s.name) + '</a></h3><p>' + esc(s.summary) + '</p><p class="wf-meta">Offered at ' + sitesFor(s.caps).length + ' sites</p></article>';
    }).join('');
    $('#sector-grid').innerHTML = Object.keys(FT.SECTORS).map(function (k) {
      var s = FT.SECTORS[k];
      return '<li><a class="sector-link' + (s.target ? ' target' : '') + '" href="sector.html?id=' + k + '">' + esc(s.name) + '</a></li>';
    }).join('');
    $('#case-strip').innerHTML = FT.CASES.filter(function (c) { return c.real; }).slice(0, 3).map(caseCard).join('');
  }
  function initService() {
    var root = $('#service');
    if (!root) return;
    var s = serviceById(param('id')) || serviceById('repair-overhaul');
    document.title = s.name + ' — Flowtech prototype';
    $('#svc-crumb').textContent = s.name;
    $('#svc-name').textContent = s.name;
    $('#svc-summary').textContent = s.summary;
    $('#svc-includes').innerHTML = s.includes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('#svc-turnaround').textContent = s.turnaround;
    var tool = $('#svc-tool');
    tool.hidden = !s.tool;
    if (s.tool) { tool.setAttribute('href', s.tool.href); tool.textContent = s.tool.label; }
    var sites = sitesFor(s.caps);
    $('#svc-site-count').textContent = sites.length;
    $('#svc-sites').innerHTML = sites.map(function (b) { return '<li><a href="branch.html?id=' + b.id + '">' + esc(b.town) + '</a>' + (b.brand !== 'Flowtech' ? ' <span class="muted">(' + esc(b.brand) + ')</span>' : '') + '</li>'; }).join('');
    var c = caseById(s.caseId);
    $('#svc-case').innerHTML = c ? caseCard(c) : '<div class="empty-state"><p>[Case study for this service to be supplied by Flowtech.]</p></div>';
    $('#svc-other').innerHTML = FT.SERVICES.filter(function (x) { return x.id !== s.id; }).map(function (x) { return '<li><a href="service.html?id=' + x.id + '">' + esc(x.name) + '</a></li>'; }).join('');
    $('#svc-enquiry-service').value = s.name;
    var f = $('#svc-form');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      f.hidden = true;
      var d = $('#svc-done'); d.hidden = false;
      var b = myBranch();
      $('#svc-done-site').textContent = b ? b.town : 'your nearest Engineering Solution Centre';
      var h = $('h3', d); h.setAttribute('tabindex', '-1'); h.focus();
    });
  }
  function initSector() {
    var root = $('#sector');
    if (!root) return;
    var id = param('id');
    if (!FT.SECTORS[id]) id = 'data-centres';
    var s = FT.SECTORS[id];
    document.title = s.name + ' — Flowtech prototype';
    $('#sec-crumb').textContent = s.name;
    $('#sec-name').textContent = s.name;
    $('#sec-intro').textContent = s.intro;
    $('#sec-needs').innerHTML = s.needs.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('#sec-services').innerHTML = s.services.map(function (k) { var x = serviceById(k); return '<article class="svc-card"><h3><a href="service.html?id=' + x.id + '">' + esc(x.name) + '</a></h3><p>' + esc(x.summary) + '</p></article>'; }).join('');
    $('#sec-cats').innerHTML = s.cats.map(function (c) { return '<li><a href="find-a-fitting.html">' + esc(c) + '</a></li>'; }).join('');
    var cs = s.cases.map(caseById).filter(Boolean);
    $('#sec-cases').innerHTML = cs.length ? cs.map(caseCard).join('') : '<div class="empty-state"><p>[Case studies for ' + esc(s.name.toLowerCase()) + ' to be supplied.]</p></div>';
    var n = $('#sec-news');
    n.hidden = !s.news;
    if (s.news) { $('h3', n).textContent = s.news.title; $('p', n).textContent = s.news.text; }
    var sw = $('#sec-switch');
    sw.innerHTML = Object.keys(FT.SECTORS).map(function (k) { return '<option value="' + k + '"' + (k === id ? ' selected' : '') + '>' + esc(FT.SECTORS[k].name) + '</option>'; }).join('');
    $('#sec-switch-form').addEventListener('submit', function (e) { e.preventDefault(); window.location.href = 'sector.html?id=' + sw.value; store('ft-q', { file: 'sector.html', q: 'id=' + sw.value }); });
  }
  function initCases() {
    var host = $('#case-grid');
    if (!host) return;
    var f = { sector: 'All', region: 'All' };
    function render() {
      var list = FT.CASES.filter(function (c) { return (f.sector === 'All' || c.sector === f.sector) && (f.region === 'All' || c.region === f.region); });
      host.innerHTML = list.length ? list.map(caseCard).join('') : '<div class="empty-state"><p>No case studies match. Clear a filter to see more.</p></div>';
      $('#case-count').textContent = list.length + ' of ' + FT.CASES.length + ' case studies';
    }
    function chips(id, key, vals) {
      var g = $(id);
      g.innerHTML = '<span class="lbl">' + (key === 'sector' ? 'Sector' : 'Region') + '</span>' + ['All'].concat(vals).map(function (v) { return '<button type="button" class="chip" aria-pressed="' + (f[key] === v ? 'true' : 'false') + '" data-v="' + esc(v) + '">' + esc(v) + '</button>'; }).join('');
      g.addEventListener('click', function (e) {
        var b = e.target.closest('.chip'); if (!b) return;
        f[key] = b.getAttribute('data-v');
        $all('.chip', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    }
    function uniq(k) { var o = []; FT.CASES.forEach(function (c) { if (o.indexOf(c[k]) === -1) o.push(c[k]); }); return o; }
    chips('#case-f-sector', 'sector', uniq('sector'));
    chips('#case-f-region', 'region', uniq('region'));
    render();
    var modal = $('#case-modal');
    function open(id) {
      var c = caseById(id); if (!c) return;
      $('#cm-title').textContent = c.title;
      $('#cm-meta').textContent = c.place + ' · ' + c.sector + ' · ' + (serviceById(c.service) || {}).name;
      $('#cm-challenge').textContent = c.challenge;
      $('#cm-solution').textContent = c.solution;
      $('#cm-result').textContent = c.result;
      $('#cm-service').setAttribute('href', 'service.html?id=' + c.service);
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      var p = $('.wf-modal-panel', modal); p.setAttribute('tabindex', '-1'); p.focus();
    }
    host.addEventListener('click', function (e) { var a = e.target.closest('[data-case]'); if (!a) return; e.preventDefault(); open(a.getAttribute('data-case')); });
    if (param('case')) open(param('case'));
  }

  /* --- Prototype 4: Hose builder (R44) ----------------------------------- */
  function initHoseBuilder() {
    var f = $('#hose-form');
    if (!f) return;
    var H = FT.HOSE;
    function opts(sel, list, label) { $(sel).innerHTML = list.map(function (x, i) { return '<option value="' + i + '">' + esc(label(x)) + '</option>'; }).join(''); }
    opts('#h-type', H.types, function (x) { return x[1]; });
    opts('#h-bore', H.bores, function (x) { return x[0] + '" (' + x[1] + 'mm) bore'; });
    opts('#h-end-a', H.ends, function (x) { return x[1]; });
    opts('#h-end-b', H.ends, function (x) { return x[1]; });
    $('#h-bore').value = '2';
    function bent(i) { return H.ends[i][0].indexOf('90') !== -1; }
    function calc() {
      var t = H.types[+$('#h-type').value], b = H.bores[+$('#h-bore').value];
      var a = +$('#h-end-a').value, z = +$('#h-end-b').value;
      var len = Math.max(0, parseInt($('#h-len').value, 10) || 0);
      var qty = Math.max(1, parseInt($('#h-qty').value, 10) || 1);
      var sleeve = $('#h-sleeve').checked, test = $('#h-test').checked;
      $('#h-orient-field').hidden = !(bent(a) && bent(z));
      var unit = (len / 1000) * b[2] * t[2] + H.ends[a][2] * t[2] + H.ends[z][2] * t[2] + 4.5 + (sleeve ? (len / 1000) * 3.2 : 0) + (test ? 6 : 0);
      var wp = H.pressure[t[0]][+$('#h-bore').value];
      var lenOk = len >= 150 && len <= 20000;
      $('#h-len-err').hidden = lenOk;
      $('#h-len').closest('.field').classList.toggle('has-error', !lenOk);
      var desc = t[0] + ' ' + b[0] + '" hose, ' + fmt(len) + 'mm, ' + H.ends[a][1] + ' to ' + H.ends[z][1] + (bent(a) && bent(z) ? ', ' + $('#h-orient').value + '° orientation' : '') + (sleeve ? ', protective sleeve' : '') + (test ? ', pressure tested' : '');
      $('#h-summary').innerHTML = '<dt>Hose</dt><dd>' + esc(t[1]) + '</dd><dt>Bore</dt><dd>' + esc(b[0]) + '" (' + b[1] + 'mm)</dd><dt>Length</dt><dd>' + fmt(len) + 'mm overall</dd><dt>End A</dt><dd>' + esc(H.ends[a][1]) + '</dd><dt>End B</dt><dd>' + esc(H.ends[z][1]) + '</dd><dt>Working pressure</dt><dd>' + wp + ' bar [sample]</dd><dt>Quantity</dt><dd>' + fmt(qty) + '</dd>';
      $('#h-price').innerHTML = lenOk ? money(withVat(unit * qty)) + ' <span class="price-vat">' + vatLabel() + (qty > 1 ? ', ' + money(withVat(unit)) + ' each' : '') + ' [sample pricing]</span>' : '–';
      var b2 = myBranch();
      var site = b2 && b2.caps.indexOf('hose') !== -1 ? b2 : branchById('gloucester');
      $('#h-lead').innerHTML = (qty <= 10 ? 'Made at <b>' + esc(site.town) + '</b>: ready for collection in about 2 hours, or next-day delivery if ordered by 2pm [sample].' : 'Batch of ' + fmt(qty) + ': made at <b>' + esc(site.town) + '</b> within 3 working days [sample].') + (b2 ? '' : ' <a href="branches.html">Choose your branch</a>');
      return { ok: lenOk && H.ends[a][0] !== 'NONE' || lenOk, unit: unit, qty: qty, desc: desc, lenOk: lenOk };
    }
    f.addEventListener('input', calc);
    f.addEventListener('change', calc);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = calc();
      if (!r.lenOk) { $('#h-len').focus(); return; }
      addToBasket('HOSE-ASSY', r.qty, 'Hose assembly: ' + r.desc, r.unit);
      toast('Hose assembly added to the basket');
    });
    $('#h-quote').addEventListener('click', function () {
      var r = calc();
      if (!r.lenOk) { $('#h-len').focus(); return; }
      store('ft-q', { file: 'request-a-quote.html', q: 'parts=' + encodeURIComponent('Hose assembly: ' + r.desc + '\t' + r.qty) });
      window.location.href = 'request-a-quote.html?parts=' + encodeURIComponent('Hose assembly: ' + r.desc + '\t' + r.qty);
    });
    document.addEventListener('ft:vat', calc);
    calc();
  }

  /* --- Prototype 4: Book a service visit (R45) --------------------------- */
  function initBookVisit() {
    var root = $('#visit');
    if (!root) return;
    var step = 1, data = {};
    var t = param('type');
    if (t === 'repair') { var r = $('#v-type-repair'); if (r) r.checked = true; }
    function show(n, quiet) {
      step = n;
      $all('.step-panel', root).forEach(function (p) { p.hidden = Number(p.getAttribute('data-step')) !== n; });
      $all('.stepper li', root).forEach(function (li, i) { li.classList.toggle('current', i + 1 === n); li.classList.toggle('done', i + 1 < n); if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      var h = $('.step-panel[data-step="' + n + '"] h2', root); if (h && !quiet) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }
    function nearest(pc) {
      var area = postcodeArea(pc), c = FT.POSTCODES[area];
      if (area === 'BT') c = [54.60, -5.93];
      if (!c) return null;
      var type = $('[name="v-type"]:checked').value;
      var need = type === 'repair' ? 'repair' : 'hose';
      return FT.BRANCHES.filter(function (b) { return b.region !== 'Benelux' && b.caps.indexOf(need) !== -1; })
        .map(function (b) { return { b: b, d: distanceKm(c, [b.lat, b.lng]) }; }).sort(function (x, y) { return x.d - y.d; }).slice(0, 3);
    }
    $('#v-next-1').addEventListener('click', function () {
      var c = $('[name="v-type"]:checked');
      var fs = $('#v-type-fs');
      fs.classList.toggle('has-error', !c); $('.field-error', fs).hidden = !!c;
      if (!c) { $('[name="v-type"]').focus(); return; }
      data.type = c.value; data.typeLabel = $('strong', c.closest('label')).textContent;
      $('#v-emergency').hidden = data.type !== 'emergency';
      show(2);
    });
    $('#v-find').addEventListener('click', function () {
      var pc = $('#v-postcode'), field = pc.closest('.field');
      var res = validPostcode(pc.value) ? nearest(pc.value) : null;
      field.classList.toggle('has-error', !res); $('.field-error', field).hidden = !!res;
      var host = $('#v-sites');
      if (!res) { host.innerHTML = ''; pc.focus(); return; }
      host.innerHTML = '<fieldset><legend>Choose the centre</legend>' + res.map(function (x, i) {
        return '<label class="option-card" for="v-site-' + i + '"><input type="radio" name="v-site" id="v-site-' + i + '" value="' + x.b.id + '"' + (i === 0 ? ' checked' : '') + '><strong>' + esc(x.b.town) + (x.b.brand !== 'Flowtech' ? ' (' + esc(x.b.brand) + ')' : '') + '</strong><span>' + Math.round(x.d * 0.621) + ' miles · ' + x.b.caps.map(function (c) { return FT.CAPS[c]; }).join(', ') + '</span></label>';
      }).join('') + '</fieldset>';
    });
    $('#v-postcode').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('#v-find').click(); } });
    $('#v-next-2').addEventListener('click', function () {
      var s = $('[name="v-site"]:checked');
      if (!s) { $('#v-find').click(); if (!$('[name="v-site"]:checked')) return; s = $('[name="v-site"]:checked'); }
      data.site = branchById(s.value);
      buildDates(); show(3);
    });
    function buildDates() {
      var host = $('#v-dates'), d = new Date(), out = [], urgent = data.type === 'emergency';
      $('#v-when-urgent').hidden = !urgent;
      $('#v-when-dates').hidden = urgent;
      for (var i = 0; out.length < 10; i++) { d = addWorkdays(d, 1); out.push(new Date(d.getTime())); }
      host.innerHTML = out.map(function (x, i) { var full = hash(data.site.id + i) % 4 === 0; return '<button type="button" class="date-btn" data-date="' + x.toISOString().slice(0, 10) + '" aria-pressed="false"' + (full ? ' disabled' : '') + '>' + DAYS[x.getDay()].slice(0, 3) + '<b>' + x.getDate() + '</b>' + MONTHS[x.getMonth()].slice(0, 3) + (full ? '<span class="visually-hidden"> fully booked</span>' : '') + '</button>'; }).join('');
    }
    $('#v-dates').addEventListener('click', function (e) {
      var b = e.target.closest('.date-btn'); if (!b || b.disabled) return;
      $all('.date-btn', root).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      data.date = new Date(b.getAttribute('data-date'));
    });
    $('#v-next-3').addEventListener('click', function () {
      var err = $('#v-date-error');
      var ok = data.type === 'emergency' || data.date;
      err.hidden = !!ok;
      if (!ok) return;
      data.slot = $('[name="v-slot"]:checked') ? $('[name="v-slot"]:checked').value : 'Morning';
      show(4);
    });
    $all('[data-back]').forEach(function (b) { b.addEventListener('click', function () { show(step - 1); }); });
    var f = $('#v-form');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      $('#v-steps').hidden = true;
      var done = $('#v-done'); done.hidden = false;
      $('#vd-type').textContent = data.typeLabel;
      $('#vd-site').textContent = data.site.town;
      $('#vd-when').textContent = data.type === 'emergency' ? 'As soon as possible. The centre will call you within 30 minutes [sample].' : longDate(data.date) + ', ' + data.slot.toLowerCase();
      $('#vd-ref').textContent = 'SV-' + (31000 + hash($('#v-name').value) % 900);
      var h = $('h2', done); h.setAttribute('tabindex', '-1'); h.focus();
    });
    $('#v-photos').addEventListener('change', function (e) { $('#v-photo-list').innerHTML = Array.prototype.slice.call(e.target.files || []).map(function (x) { return '<li>' + esc(x.name) + '</li>'; }).join(''); });
    var b = myBranch();
    if (b) $('#v-postcode').placeholder = '';
    show(1, true);
  }

  /* --- Prototype 5: Branch finder (R50–R55) ------------------------------ */
  var MAP_BOX = { w: -10.6, e: 7.0, n: 58.8, s: 49.8 };
  function pinPos(lat, lng) { return { x: (lng - MAP_BOX.w) / (MAP_BOX.e - MAP_BOX.w) * 100, y: (MAP_BOX.n - lat) / (MAP_BOX.n - MAP_BOX.s) * 100 }; }
  function hoursToday(b) {
    var d = new Date().getDay();
    if (d === 0 || d === 6) return { open: false, text: 'Closed today. Opens Monday 8am' };
    var close = d === 5 ? 17 : (b.brand === 'Thorite' ? 17 : 17.5);
    var h = new Date().getHours() + new Date().getMinutes() / 60;
    var open = h >= 8 && h < close;
    return { open: open, text: (open ? 'Open now, ' : 'Closed now. ') + '8am to ' + (close === 17 ? '5pm' : '5.30pm') + ' today [sample]' };
  }
  function initBranches() {
    var root = $('#branches');
    if (!root) return;
    var state = { region: 'All', caps: [], origin: null, place: '', sel: null, openNow: false };
    var from = param('from');
    if (from) { var bk = $('#back-to-product'); bk.hidden = false; $('a', bk).setAttribute('href', 'product.html?code=' + encodeURIComponent(from)); }
    $('#cap-chips').innerHTML = '<span class="lbl">Services</span>' + Object.keys(FT.CAPS).map(function (k) { return '<button type="button" class="chip" data-cap="' + k + '" aria-pressed="false">' + esc(FT.CAPS[k]) + '</button>'; }).join('');
    function list() {
      var l = FT.BRANCHES.filter(function (b) {
        return (state.region === 'All' || b.region === state.region) && state.caps.every(function (c) { return b.caps.indexOf(c) !== -1; }) && (!state.openNow || hoursToday(b).open);
      }).map(function (b) { return { b: b, d: state.origin ? distanceKm(state.origin, [b.lat, b.lng]) : null }; });
      if (state.origin) l.sort(function (a, z) { return a.d - z.d; });
      else { var ord = { UK: 0, Ireland: 1, Benelux: 2 }; l.sort(function (a, z) { return ord[a.b.region] - ord[z.b.region] || a.b.town.localeCompare(z.b.town); }); }
      return l;
    }
    function render() {
      var l = list();
      var mine = myBranch();
      $('#branch-count').textContent = l.length + ' of ' + FT.BRANCHES.length + ' sites' + (state.origin ? ', nearest to ' + state.place + ' first' : '');
      $('#branch-list').innerHTML = l.length ? l.map(function (x) {
        var b = x.b, h = hoursToday(b);
        return '<li class="branch-card' + (state.sel === b.id ? ' selected' : '') + '" id="card-' + b.id + '"><div class="row between"><h3><a href="branch.html?id=' + b.id + '">' + esc(b.town) + '</a></h3>' + (x.d != null ? '<span class="dist">' + Math.round(x.d * 0.621) + ' miles</span>' : '') + '</div>' +
          '<p class="wf-meta">' + (b.brand !== 'Flowtech' ? esc(b.brand) + ', part of Flowtech · ' : '') + esc(b.region) + '</p>' +
          '<p class="hours">' + esc(h.text) + '</p>' +
          '<ul class="cap-list">' + b.caps.map(function (c) { return '<li>' + esc(FT.CAPS[c]) + '</li>'; }).join('') + '</ul>' +
          '<div class="row">' + (mine && mine.id === b.id ? '<span class="badge solid">Your branch</span>' : '<button type="button" class="btn btn-sm btn-secondary" data-mine="' + b.id + '">Set as my branch</button>') + '<a class="btn btn-sm btn-secondary" href="branch.html?id=' + b.id + '">Branch details</a></div></li>';
      }).join('') : '<li class="empty-state"><p>No sites match. Remove a service filter or choose another region.</p></li>';
      $('#map-pins').innerHTML = l.map(function (x) {
        var p = pinPos(x.b.lat, x.b.lng);
        return '<button type="button" class="map-pin small' + (state.sel === x.b.id ? ' on' : '') + '" style="left:' + p.x.toFixed(2) + '%;top:' + p.y.toFixed(2) + '%" data-pin="' + x.b.id + '" aria-pressed="' + (state.sel === x.b.id ? 'true' : 'false') + '" aria-label="' + esc(x.b.town + (x.b.brand !== 'Flowtech' ? ' (' + x.b.brand + ')' : '')) + '"><span>' + esc(x.b.town) + '</span></button>';
      }).join('') + (state.origin ? '<span class="map-you" style="left:' + pinPos(state.origin[0], state.origin[1]).x.toFixed(2) + '%;top:' + pinPos(state.origin[0], state.origin[1]).y.toFixed(2) + '%">You</span>' : '');
      $all('[data-region]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-region') === state.region ? 'true' : 'false'); });
    }
    $('#branch-search').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#b-q').value.trim();
      var field = $('#b-q').closest('.field');
      var err = $('.field-error', field);
      if (!v) { state.origin = null; state.place = ''; field.classList.remove('has-error'); err.hidden = true; render(); return; }
      var town = FT.BRANCHES.filter(function (b) { return b.town.toLowerCase() === v.toLowerCase(); })[0];
      var area = postcodeArea(v), c = null;
      if (town) c = [town.lat, town.lng];
      else if (area && FT.POSTCODES[area]) c = FT.POSTCODES[area];
      else if (area === 'BT') c = [54.60, -5.93];
      if (!c) { field.classList.add('has-error'); err.hidden = false; $('#b-q').focus(); return; }
      field.classList.remove('has-error'); err.hidden = true;
      state.origin = c; state.place = v.toUpperCase(); state.region = 'All';
      render();
      var first = $('#branch-list .branch-card'); if (first) state.sel = first.id.replace('card-', '');
      render();
    });
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-region')) { state.region = t.getAttribute('data-region'); render(); }
      else if (t.hasAttribute('data-cap')) {
        var k = t.getAttribute('data-cap');
        var on = state.caps.indexOf(k) === -1;
        state.caps = on ? state.caps.concat(k) : state.caps.filter(function (x) { return x !== k; });
        t.setAttribute('aria-pressed', on ? 'true' : 'false'); render();
      } else if (t.hasAttribute('data-pin')) {
        state.sel = t.getAttribute('data-pin'); render();
        var card = document.getElementById('card-' + state.sel); if (card) { card.scrollIntoView({ block: 'nearest' }); var a = $('a', card); if (a) a.focus({ preventScroll: true }); }
      } else if (t.hasAttribute('data-mine')) { setMyBranch(t.getAttribute('data-mine')); render(); }
      else if (t.id === 'open-now') { state.openNow = !state.openNow; t.setAttribute('aria-pressed', state.openNow ? 'true' : 'false'); render(); }
    });
    render();
  }

  /* --- Prototype 5: Branch page (R56–R58) -------------------------------- */
  function initBranch() {
    var root = $('#branch');
    if (!root) return;
    var b = branchById(param('id')) || branchById('gloucester');
    document.title = b.town + ' — Flowtech prototype';
    $('#br-crumb').textContent = b.town;
    $('#br-name').textContent = b.town + (b.brand !== 'Flowtech' ? ' (' + b.brand + ')' : '');
    $('#br-brand').textContent = b.brand !== 'Flowtech' ? b.brand + ' is part of Flowtech. Order from either website and collect here.' : 'Flowtech ' + (b.caps.indexOf('hose') !== -1 || b.caps.indexOf('repair') !== -1 ? 'Engineering Solution Centre' : 'site') + ', ' + b.region;
    $('#br-address').textContent = b.address;
    $('#br-phone').textContent = b.phone;
    $('#br-email').textContent = b.email;
    $('#br-real').hidden = !b.real;
    $('#br-hours-today').textContent = hoursToday(b).text;
    $('#br-caps').innerHTML = b.caps.map(function (c) { return '<li>' + esc(FT.CAPS[c]) + '</li>'; }).join('');
    var svc = FT.SERVICES.filter(function (s) { return s.caps.some(function (c) { return b.caps.indexOf(c) !== -1; }); });
    $('#br-services').innerHTML = svc.map(function (s) { return '<li><a href="service.html?id=' + s.id + '">' + esc(s.name) + '</a></li>'; }).join('') || '<li>[Services to be supplied]</li>';
    var collect = b.caps.indexOf('collect') !== -1;
    $('#br-collect').innerHTML = collect ? 'Order online by 3pm and collect from 4pm the same day, if the items are in stock here [sample]. Choose <b>Collect from ' + esc(b.town) + '</b> at checkout.' : 'This site does not have a trade counter. Order for delivery, or collect from the nearest counter.';
    var tr = $('#br-training');
    tr.hidden = b.caps.indexOf('train') === -1;
    function setMine() {
      var mine = myBranch();
      var btn = $('#br-mine');
      btn.hidden = !!(mine && mine.id === b.id);
      $('#br-is-mine').hidden = !(mine && mine.id === b.id);
    }
    $('#br-mine').addEventListener('click', function () { setMyBranch(b.id); setMine(); });
    setMine();
    var near = FT.BRANCHES.filter(function (x) { return x.id !== b.id; }).map(function (x) { return { x: x, d: distanceKm([b.lat, b.lng], [x.lat, x.lng]) }; }).sort(function (a, z) { return a.d - z.d; }).slice(0, 3);
    $('#br-near').innerHTML = near.map(function (n) { return '<li><a href="branch.html?id=' + n.x.id + '">' + esc(n.x.town) + (n.x.brand !== 'Flowtech' ? ' (' + esc(n.x.brand) + ')' : '') + '</a> <span class="muted">' + Math.round(n.d * 0.621) + ' miles</span></li>'; }).join('');
    var p = pinPos(b.lat, b.lng);
    $('#br-pin').style.left = p.x.toFixed(2) + '%';
    $('#br-pin').style.top = p.y.toFixed(2) + '%';
    $('#br-pin').textContent = b.town;
    $('#br-stock-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#br-code').value.trim();
      var prod = byCode(v);
      var out = $('#br-stock-result'); out.hidden = false;
      if (!prod) { out.innerHTML = '<p>We can\'t find <b>' + esc(v || 'that code') + '</b>. Try 2019-8412 or FT-PU08-30B.</p>'; return; }
      var n = branchStock(prod, b);
      out.innerHTML = '<p><a href="' + productURL(prod.code) + '">' + esc(prod.name) + '</a>: <b>' + (n > 0 ? fmt(n) + ' in stock here' : 'none in stock here') + '</b>' + (n > 0 && collect ? ', ready to collect in about 1 hour' : '') + '. ' + (prod.stock > 0 ? fmt(prod.stock) + ' nationally.' : '') + ' [sample]</p>';
    });
    $all('[data-course]').forEach(function (btn) {
      btn.addEventListener('click', function () { $('#course-name').textContent = btn.getAttribute('data-course'); $('#course-form').hidden = false; $('#course-done').hidden = true; });
    });
    var cf = $('#course-form');
    if (cf) cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(cf)) return;
      cf.hidden = true; var d = $('#course-done'); d.hidden = false;
      $('#course-done-name').textContent = $('#course-name').textContent;
      $('#course-done-n').textContent = $('#c-places').value;
    });
  }


  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAccordions();
    initTabs();
    initCarousels();
    initModals();
    initNotes();
    initProtoNav();
    initHeaderHeight();
    initDrawers();
    initVatToggles();
    var b = myBranch();
    $all('[data-my-branch]').forEach(function (el) { el.textContent = b ? b.town : 'not chosen'; });
    initListing();
    initFinder();
    initProduct();
    initBasketPanel();
    initQuickOrder();
    initQuote();
    initMyQuotes();
    initRegister();
    initServicesHub();
    initService();
    initSector();
    initCases();
    initHoseBuilder();
    initBookVisit();
    initBranches();
    initBranch();
    updateBasketCount();
    var xc = param('code');
    if (xc && $('#xref-code')) { $('#xref-code').value = xc; $('#xref-form').dispatchEvent(new Event('submit', { cancelable: true })); }
  });
})();
