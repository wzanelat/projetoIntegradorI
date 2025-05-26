const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

const loginMessage = document.getElementById('message');
const registerMessage = document.getElementById('register-message');
const forgotPasswordBtn = document.getElementById('forgot-password');

function mostrarErroAmigavel(codigo) {
  switch (codigo) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/email-already-in-use':
      return 'E-mail já está em uso.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    default:
      return 'Erro: ' + codigo;
  }
}

showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  showRegisterBtn.style.display = 'none';
  showLoginBtn.style.display = 'inline';
  loginMessage.textContent = '';
});

showLoginBtn.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
  showRegisterBtn.style.display = 'inline';
  showLoginBtn.style.display = 'none';
  registerMessage.textContent = '';
});

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  if (!email.includes('@')) {
    loginMessage.textContent = "Digite um e-mail válido.";
    return;
  }

  const btn = loginForm.querySelector('button');
  btn.disabled = true;
  btn.textContent = "Entrando...";
  loginMessage.textContent = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      loginMessage.textContent = mostrarErroAmigavel(error.code);
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Entrar";
    });
});

// Cadastro
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm['reg-email'].value.trim();
  const password = registerForm['reg-password'].value;

  if (!email.includes('@')) {
    registerMessage.textContent = "Digite um e-mail válido.";
    return;
  }

  const btn = registerForm.querySelector('button');
  btn.disabled = true;
  btn.textContent = "Cadastrando...";
  registerMessage.textContent = "";

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      registerMessage.textContent = "Conta criada! Redirecionando...";
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    })
    .catch(error => {
      registerMessage.textContent = mostrarErroAmigavel(error.code);
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Cadastrar";
    });
});

// Recuperar senha
forgotPasswordBtn.addEventListener('click', () => {
  const email = prompt("Digite seu e-mail para recuperar a senha:");
  if (email && email.includes('@')) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('E-mail de recuperação enviado!');
      })
      .catch(error => {
        alert(mostrarErroAmigavel(error.code));
      });
  } else {
    alert("Digite um e-mail válido.");
  }
});
