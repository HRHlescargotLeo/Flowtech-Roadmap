/* ==========================================================================
   photos.js — Flowtech photography for the design layer (V2)

   Swaps the illustrated placeholders for Flowtech's own product shots and
   photography, loaded directly from flowtech.co.uk's image hosts (Pimberly via
   ImageKit for products, Payload CMS for everything else). Each image is only
   applied once it has loaded, so anywhere the images can't be reached the
   illustrated placeholder stays in place. Photography © Flowtech, used here to
   show how the proposals would look on the live site.
   ========================================================================== */

(function () {
  'use strict';

  var PIM = 'https://ik.imagekit.io/pimberly/67068fd7ef898dbc872f1977/';
  function pim(path) { return PIM + path + '?tr=w-700,q-80,f-auto'; }
  function cms(name, size) { return 'https://payload.flowtech.co.uk/api/media/file/' + (size || 1080) + '/' + encodeURIComponent(name) + '?prefix=payload-cms%2Fflowtech'; }

  /* Product shots by family, from each product's page on flowtech.co.uk. */
  var FAMILY = {
    tee: pim('234cc75d/679a19e718c51b8fbe50aec5/IFT-M313-13794W-large1425.png'),
    straight: pim('b5ece61a/679a196e18c51b8fbe50a1bc/IFT-M313-13695W-large1425.png'),
    stud: pim('3f81659a/679a19e418c51b8fbe50ae6e/IFT-M313-11244W-large1425.png'),
    elbow: pim('3edafc60/679a19e418c51b8fbe50ae71/IFT-M313-11426W-large1425.png'),
    branch: pim('446c74ce/679a19ee18c51b8fbe50af7f/IFT-M313-16839W-large1425.png'),
    mput: pim('a7700a34/679a19db18c51b8fbe50ad9a/IFT-M311-08707W-large1425.png'),
    jg: pim('62d0660f/679a1a1318c51b8fbe50b379/IFT-M314-03256W-large1425.png'),
    aigneptee: pim('e4877345/679a19fa18c51b8fbe50b0bc/IFT-M311-40452W-large1425.png'),
    aignepelbow: pim('d77364dd/679a19f918c51b8fbe50b0a7/IFT-M311-40106W-large1425.png'),
    legris: pim('426819b7/68f8df0357112b29a3472549/IFT-M314-12091W-large1425.png'),
    smc: pim('704bdd53/68cd66d5adc03fe6990d08ec/KQ2T-union-tee-001-L.jpg'),
    tube: pim('c7131a2b/679a197218c51b8fbe50a228/IFT-M311-15702W-large1425.png'),
    cutter: pim('84d77065/679a17ce18c51b8fbe507b75/IFT-M311-17716W-large1425.png'),
    plug: pim('3ff9ac70/679a211218c51b8fbe519364/IFT-M316-02980W-large1425.png'),
    clip: pim('663ffc86/679a1b5818c51b8fbe50d6bd/IFT-M314-76583W-large1425.png')
  };
  function productPhoto(code) {
    code = String(code || '').toUpperCase();
    if (/^2019-8(39|40|41|42|43)/.test(code)) return FAMILY.tee;
    if (/^2019-83/.test(code)) return FAMILY.straight;
    if (/^2019-(49|50)/.test(code)) return FAMILY.stud;
    if (/^2019-51/.test(code)) return FAMILY.elbow;
    if (/^2111-/.test(code)) return FAMILY.branch;
    if (code === 'MPUT-8') return FAMILY.mput;
    if (/^PM02/.test(code)) return FAMILY.jg;
    if (code === 'P16-6') return FAMILY.aigneptee;
    if (/^P8-/.test(code)) return FAMILY.aignepelbow;
    if (/^LE-/.test(code)) return FAMILY.legris;
    if (/^KQ2T/.test(code)) return FAMILY.smc;
    if (/^FT-PU/.test(code)) return FAMILY.tube;
    if (/^FT-TC/.test(code)) return FAMILY.cutter;
    if (/^FT-BP/.test(code)) return FAMILY.plug;
    if (/^FT-RC/.test(code)) return FAMILY.clip;
    return null;
  }

  var SERVICE = {
    'bespoke product manufacture': cms('EMC_Tube Bender_LoRes.jpg'),
    'hydraulic systems design & build': cms('Power Packs_1200x800-12.jpg'),
    'pneumatic systems design & build': cms('Power Packs_1200x800-7.jpg'),
    'compressed air systems design & build': cms('Engineer_2200060957.jpg'),
    'process control & instrumentation design & build': cms('Large Bore Hydraulic Actuator.png'),
    'service & maintenance': cms('What We Do_Image_01.jpg'),
    'repair & overhaul': cms('HPU_Engineers.png')
  };
  var CASE = {
    'halley-vi': cms('Halley VI_Image 1.jpg'),
    'tower-bridge': cms('What We Do_Image_03.jpg'),
    'narrow-water-bridge': cms('HD_fm_opened_final.jpg'),
    'rice-bridge': cms('rice bridge image 1.jpg')
  };
  var CASE_BY_TITLE = {
    'halley vi research station': cms('Halley VI_Image 2.jpg'),
    'tower bridge': cms('What We Do_Image_03.jpg'),
    'narrow water bridge': cms('HD_fm_opened_final.jpg'),
    'rice bridge remediation': cms('rice bridge image 1.jpg')
  };
  var SECTOR = {
    'data centres': cms('Data Centre World 2026.jpg', 1920),
    'bridges, waterways & flood defence': cms('HD_fm_opened_final.jpg', 1920),
    'food & beverage': cms('Food & Beverage.jpg', 1920),
    'agriculture': cms('Lamma-2025.jpg'),
    'transport': cms('Ireland_Truck Workshop.JPG', 1920),
    'utility': cms('Waste Water.jpg', 1920),
    'aerospace': cms('Ground Support 2.png', 1920),
    'metals & heavy engineering': cms('CNC Machine.png')
  };
  /* Sites with their own photograph on flowtech.co.uk. */
  var BRANCH = {
    'gloucester': cms('Gloucester Site Exterior.jpg'),
    'leicester': cms('leicester opening 2.jpg'),
    'skelmersdale': cms('esc skelmersdale.jpg'),
    'rotterdam': cms('Rotterdam Engineering Solutions Centre 1200x800.png'),
    'belfast': cms('dji_fly_20250625_153932_271_1750862608524_photo.jpg'),
    'pontefract': cms('pontefract meeting image-1.jpg'),
    'exeter': cms('HPUs Exeter.jpeg')
  };
  var LABEL = {
    'find a fitting': FAMILY.tee,
    'product page': cms('Flowtech Parker Pneumatics Range.jpg'),
    'order and quote': cms('Warehouse.png'),
    'engineering services': cms('Services Landing Page_Image 1_1200 x 800.jpg'),
    'find a branch': cms('Gloucester Site Exterior.jpg')
  };
  var ACCREDITATION = [cms('BFPA.jpg', 256), cms('UKAS.jpg', 256), cms('BFPDA Q.jpg', 256), cms('eCO.jpg', 256)];
  var LOGO = cms('Flowtech Logo_white.png', 384);

  /* Apply a photo once it has loaded; leave the illustration if it fails. */
  function apply(el, src, cls) {
    if (!el || !src || el.getAttribute('data-photo') === src) return;
    el.setAttribute('data-photo', src);
    var img = new Image();
    img.onload = function () {
      if (el.getAttribute('data-photo') !== src) return;
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.remove('has-photo', 'has-product', 'has-logo');
      el.classList.add(cls || 'has-photo');
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', (el.textContent || 'Photo').trim());
      }
    };
    img.src = src;
  }
  function text(el) { return el ? (el.textContent || '').trim().toLowerCase() : ''; }
  function codeFromHref(a) {
    var m = a && (a.getAttribute('href') || '').match(/code=([^&#]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function applyAll() {
    // Product cards in listings and the module library
    document.querySelectorAll('.p-card').forEach(function (card) {
      apply(card.querySelector('.wf-placeholder'), productPhoto(codeFromHref(card.querySelector('h3 a'))), 'has-product');
    });
    // Product page gallery: the main image and the first thumbnail
    var code = text(document.getElementById('p-code'));
    if (code) {
      var main = document.querySelector('.product-top > div > .wf-placeholder');
      apply(main, productPhoto(code), 'has-product');
      apply(document.querySelector('.thumbs .wf-placeholder'), productPhoto(code), 'has-product');
    }
    // Fits-with items
    document.querySelectorAll('.fit-item').forEach(function (it) {
      var input = it.querySelector('input');
      apply(it.querySelector('.wf-placeholder'), productPhoto(input && input.value), 'has-product');
    });
    // Service cards: a photo strip across the top
    document.querySelectorAll('.svc-card').forEach(function (c) {
      var src = SERVICE[text(c.querySelector('h3'))];
      if (!src || c.getAttribute('data-photo') === src) return;
      c.setAttribute('data-photo', src);
      var img = new Image();
      img.onload = function () { c.style.setProperty('--photo', 'url("' + src + '")'); c.classList.add('has-photo-top'); };
      img.src = src;
    });
    // Case study cards
    document.querySelectorAll('.case-card').forEach(function (c) {
      var a = c.querySelector('[data-case]') || c.querySelector('h3 a');
      var id = a && (a.getAttribute('data-case') || ((a.getAttribute('href') || '').match(/case=([\w-]+)/) || [])[1]);
      apply(c.querySelector('.wf-placeholder'), CASE[id]);
    });
    // Case study overlay
    var cm = document.getElementById('cm-title');
    if (cm) apply(document.querySelector('#case-modal .wf-placeholder'), CASE_BY_TITLE[text(cm)]);
    // Service page
    var svc = document.getElementById('svc-name');
    if (svc) document.querySelectorAll('#service .wf-placeholder.ratio-16-9').forEach(function (el) {
      if (!el.closest('.case-card')) apply(el, SERVICE[text(svc)]);
    });
    // Sector page
    var sec = document.getElementById('sec-name');
    if (sec) apply(document.querySelector('#sector > .wf-placeholder'), SECTOR[text(sec)]);
    document.querySelectorAll('.trust-row .wf-placeholder').forEach(function (el, i) { apply(el, ACCREDITATION[i % ACCREDITATION.length], 'has-logo'); });
    // Branch page
    var br = document.getElementById('br-name');
    if (br) {
      var town = text(br).replace(/\s*\(.*\)$/, '');
      apply(document.querySelector('#branch .side-panel > .wf-placeholder'), BRANCH[town] || cms('Services Landing Page_Image 1_1200 x 800.jpg'));
    }
    // Logo and labelled placeholders
    document.querySelectorAll('.wf-placeholder.logo').forEach(function (el) { apply(el, LOGO, 'has-logo'); });
    document.querySelectorAll('.wf-placeholder').forEach(function (el) {
      var src = LABEL[text(el)];
      if (src) apply(el, src, src === FAMILY.tee ? 'has-product' : 'has-photo');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyAll();
    // Listings, product pages and overlays re-render, so watch for new placeholders.
    if ('MutationObserver' in window) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(function () { pending = false; applyAll(); });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  });
})();
