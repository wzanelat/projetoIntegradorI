const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const form = document.getElementById('relato-form');
const statusMsg = document.getElementById('status-msg');
const logoutBtn = document.getElementById('logout-btn');

const photoInput = document.getElementById('photo');
const locationInput = document.getElementById('location');
const getLocationBtn = document.getElementById('get-location-btn');

let map;
let marker;
let currentCoords = null;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
});

function initMap() {
  map = L.map('map').setView([-15.7942, -47.8822], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

function updateMarker(lat, lng) {
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }
  map.setView([lat, lng], 15);
  currentCoords = { lat, lng };
}

getLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocalização não suportada pelo seu navegador');
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    updateMarker(lat, lng);
    locationInput.value = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }, () => {
    alert('Não foi possível obter sua localização');
  });
});

window.onload = () => {
  initMap();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.style.color = 'black';
  statusMsg.textContent = 'Enviando...';

  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value;
  const location = locationInput.value;
  const user = auth.currentUser;

  let photoUrl = null;
  if (photoInput.files.length > 0) {
    try {
      const file = photoInput.files[0];
      const storageRef = storage.ref();
      const photoRef = storageRef.child(`relatos/${user.uid}/${Date.now()}_${file.name}`);
      await photoRef.put(file);
      photoUrl = await photoRef.getDownloadURL();
    } catch (err) {
      statusMsg.style.color = 'red';
      statusMsg.textContent = 'Erro no upload da foto: ' + err.message;
      return;
    }
  }

  db.collection('relatos').add({
    userId: user.uid,
    email: user.email,
    type,
    description,
    location,
    latitude: currentCoords ? currentCoords.lat : null,
    longitude: currentCoords ? currentCoords.lng : null,
    photoUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    statusMsg.style.color = 'green';
    statusMsg.textContent = 'Relato enviado com sucesso!';
    form.reset();
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    currentCoords = null;
  }).catch(error => {
    statusMsg.style.color = 'red';
    statusMsg.textContent = 'Erro ao enviar relato: ' + error.message;
  });
});
