const auth = firebase.auth();
const db = firebase.firestore();

const relatosList = document.getElementById('relatos-list');
const logoutBtn = document.getElementById('logout-btn');
const admins = ['admin@exemplo.com'];

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  if (!admins.includes(user.email)) {
    alert('Acesso negado: você não é administrador');
    auth.signOut();
    window.location.href = 'index.html';
  } else {
    carregarRelatos();
  }
});

function carregarRelatos() {
  relatosList.innerHTML = 'Carregando relatos...';
  db.collection('relatos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    relatosList.innerHTML = '';
    if (snapshot.empty) {
      relatosList.innerHTML = '<p>Nenhum relato encontrado.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const relato = doc.data();
      const div = document.createElement('div');
      div.classList.add('relato');
      div.innerHTML = `
        <p><strong>Tipo:</strong> ${relato.type}</p>
        <p><strong>Descrição:</strong> ${relato.description}</p>
        <p><strong>Localização:</strong> ${relato.location}</p>
        <p><strong>Enviado por:</strong> ${relato.email}</p>
        ${relato.photoUrl ? `<img src="${relato.photoUrl}" alt="Foto do relato" />` : ''}
        <button data-id="${doc.id}" class="delete-btn">Excluir</button>
        <hr />
      `;
      relatosList.appendChild(div);
    });

    // Eventos excluir
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Confirma exclusão deste relato?')) {
          db.collection('relatos').doc(id).delete();
        }
      });
    });
  });
}
