const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageP = document.getElementById('message');

loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      messageP.textContent = error.message;
    });
});

registerBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      messageP.textContent = "Cadastro realizado com sucesso! Faça login.";
    })
    .catch(error => {
      messageP.textContent = error.message;
    });
});
