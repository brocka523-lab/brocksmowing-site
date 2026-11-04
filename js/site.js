// Brock's Mowing & Services: request form sends to Brock's email (FormSubmit), "Book this" links pre-tick a service.
(function () {
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  var mount = document.getElementById("bms-form");
  var form = document.getElementById("req-form");
  if (!form) return;
  var errBox = document.getElementById("form-err");
  var svcErr = document.getElementById("err-svc");
  var original = mount.innerHTML;

  function tick(name) {
    var f = document.getElementById("req-form");
    if (!f) return;
    f.querySelectorAll('input[name="Services"]').forEach(function (i) { if (i.value === name) i.checked = true; });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-service]");
    if (!a) return;
    if (!document.getElementById("req-form")) { mount.innerHTML = original; wire(); }
    tick(a.dataset.service);
  });

  function wire() {
    form = document.getElementById("req-form");
    errBox = document.getElementById("form-err");
    svcErr = document.getElementById("err-svc");
    form.addEventListener("submit", onSubmit);
  }

  function onSubmit(e) {
    e.preventDefault();
    errBox.textContent = "";
    svcErr.textContent = "";
    var picked = form.querySelectorAll('input[name="Services"]:checked');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!picked.length) { svcErr.textContent = "Pick at least one service."; return; }

    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "Services") return;
      data[k] = v;
    });
    data.Services = Array.prototype.map.call(picked, function (i) { return i.value; }).join(", ");
    if (data._honey) return;

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Sending...";

    fetch("https://formsubmit.co/ajax/brocksmowing@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) === "false") throw new Error(j.message || "send failed"); }); })
      .then(function () {
        mount.innerHTML = '<div class="success"><div class="check" aria-hidden="true">✓</div><h3>Request received</h3>' +
          '<p>Thanks, ' + escapeHtml(data["First name"] || "") + '! Brock will call or text you back with your price and a time that works.</p>' +
          '<p>Need us sooner? Call or text <a href="tel:+17154310923">715-431-0923</a>.</p>' +
          '<p><button type="button" class="btn btn-outline" id="again">Book another service</button></p></div>';
        document.getElementById("again").addEventListener("click", function () { mount.innerHTML = original; wire(); });
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Send My Request";
        errBox.innerHTML = 'That didn\'t go through. Please call or text <a href="tel:+17154310923">715-431-0923</a> or email <a href="mailto:brocksmowing@gmail.com">brocksmowing@gmail.com</a>.';
      });
  }

  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  wire();
})();
