// Light scroll animations for brocksmowing.com, built on Motion (motion.dev).
// Content is fully visible without JS; hiding only happens once Motion has loaded.
(function () {
  var M = window.Motion;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!M || reduce) return;
  var animate = M.animate, inView = M.inView, stagger = M.stagger;
  var ease = [0.22, 1, 0.36, 1];

  // 1. Count the "130+" up when it scrolls into view
  var big = document.querySelector(".trust-big strong");
  if (big) {
    var target = parseInt(big.textContent, 10) || 130;
    big.textContent = "0+";
    inView(big, function () {
      animate(0, target, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: function (v) { big.textContent = Math.round(v) + "+"; }
      });
    }, { amount: 0.6 });
  }

  // 2. Fade up groups of cards, one after another
  var groups = [
    [".trust-in", ":scope > div"],
    [".season", ".season-card"],
    [".svc-group", ".svc"],
    [".steps", "li"],
    [".pairs", ".pair"],
    ["#reviews", ".rcard"],
    [".faq", "details"]
  ];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (box) {
      var items = box.querySelectorAll(g[1]);
      if (!items.length || box.dataset.anim) return;
      box.dataset.anim = "1";
      items.forEach(function (el) { el.classList.add("anim-pre"); });
      inView(box, function () {
        animate(items, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, ease: ease, delay: stagger(0.08) })
          .then(function () { items.forEach(function (el) { el.classList.remove("anim-pre"); el.style.transform = ""; }); });
      }, { amount: 0.15 });
    });
  });

  // 3. Single blocks: section headings, booking area, about
  document.querySelectorAll(".section-head, .book-side, #bms-form, .about-side, .also").forEach(function (el) {
    el.classList.add("anim-pre");
    inView(el, function () {
      animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, ease: ease })
        .then(function () { el.classList.remove("anim-pre"); el.style.transform = ""; });
    }, { amount: 0.2 });
  });

  // 4. Gentle pulse on the main "Book" buttons, three times in the first 15 seconds
  var ctas = document.querySelectorAll(".hero .btn-gold, .season-now .btn-gold");
  function pulse() {
    ctas.forEach(function (b) {
      animate(b, { scale: [1, 1.06, 1] }, { duration: 0.7, ease: "easeInOut" });
    });
  }
  if (ctas.length) { [2500, 8500, 14500].forEach(function (t) { setTimeout(pulse, t); }); }
})();
