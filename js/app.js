(() => {
  const $ = (selector) => document.querySelector(selector);

  const authPanel = $("#auth");
  const welcomePanel = $("#welcome");
  const tabs = {
    signup: $("#tab-signup"),
    login: $("#tab-login"),
  };
  const forms = {
    signup: $("#form-signup"),
    login: $("#form-login"),
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- Pestañas ---------- */
  function showTab(name, { focus = false } = {}) {
    for (const key of Object.keys(tabs)) {
      const active = key === name;
      tabs[key].setAttribute("aria-selected", String(active));
      tabs[key].tabIndex = active ? 0 : -1;
      forms[key].hidden = !active;
    }
    if (focus) tabs[name].focus();
  }

  for (const [name, tab] of Object.entries(tabs)) {
    tab.addEventListener("click", () => showTab(name));
  }

  // Flechas izquierda/derecha entre pestañas, como en un control nativo.
  $(".tabs").addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = tabs.signup.getAttribute("aria-selected") === "true" ? "login" : "signup";
    showTab(next, { focus: true });
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.go);
      forms[button.dataset.go].querySelector("input").focus();
    });
  });

  /* ---------- Mostrar / ocultar contraseña ---------- */
  document.querySelectorAll(".toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Ocultar" : "Mostrar";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });

  /* ---------- Validación ---------- */
  function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(`${inputId}-err`);
    output.textContent = message || "";
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    return !message;
  }

  function validateSignup(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pass = form.password.value;
    const pass2 = form.password2.value;

    const results = [
      setError("su-name", name ? "" : "Escribe tu nombre."),
      setError("su-email", EMAIL_RE.test(email) ? "" : "Escribe un correo válido."),
      setError("su-pass", pass.length >= 8 ? "" : "La contraseña debe tener al menos 8 caracteres."),
      setError("su-pass2", pass2 === pass ? "" : "Las contraseñas no coinciden."),
    ];
    return results.every(Boolean);
  }

  function validateLogin(form) {
    const results = [
      setError("li-email", EMAIL_RE.test(form.email.value.trim()) ? "" : "Escribe un correo válido."),
      setError("li-pass", form.password.value ? "" : "Escribe tu contraseña."),
    ];
    return results.every(Boolean);
  }

  function focusFirstInvalid(form) {
    const invalid = form.querySelector('[aria-invalid="true"]');
    if (invalid) invalid.focus();
  }

  /* ---------- Envío ---------- */
  forms.signup.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = forms.signup;
    if (!validateSignup(form)) return focusFirstInvalid(form);

    const result = Auth.signUp({ name: form.name.value, email: form.email.value });
    if (!result.ok) {
      setError("su-email", result.error);
      return form.email.focus();
    }
    form.reset();
    render();
  });

  forms.login.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = forms.login;
    const formError = $("#li-form-err");
    formError.textContent = "";
    if (!validateLogin(form)) return focusFirstInvalid(form);

    const result = Auth.logIn({ email: form.email.value });
    if (!result.ok) {
      formError.textContent = result.error;
      return;
    }
    form.reset();
    render();
  });

  $("#logout").addEventListener("click", () => {
    Auth.logOut();
    showTab("login");
    render();
  });

  /* ---------- Vista según sesión ---------- */
  function render() {
    const user = Auth.current();
    authPanel.hidden = Boolean(user);
    welcomePanel.hidden = !user;
    if (user) {
      $("#welcome-title").textContent = `¡Hola, ${user.name}!`;
      $("#logout").focus();
    }
  }

  render();
})();
