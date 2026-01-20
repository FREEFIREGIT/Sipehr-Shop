// ====== FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ⚡ Настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqQc7JS5eyDydXf3jJSlp6Ca_eWsd0O7g",
  authDomain: "sipehr-shop.firebaseapp.com", // не GitHub Pages
  projectId: "sipehr-shop",
  storageBucket: "sipehr-shop.firebasestorage.app",
  messagingSenderId: "315068554355",
  appId: "1:315068554355:web:34a130038f79bf455ade06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Сделаем доступным для других скриптов
window.db = db;
window.auth = auth;

console.log("🔥 Firebase подключён");

// ====== PRODUCTS ======
const products = {
  1: { id: 1, name: "Buds 2 Pro", price: 1299, img: "buds.jpg" },
  2: { id: 2, name: "Headphones X", price: 899, img: "headphones.jpg" },
  3: { id: 3, name: "EarPods Type-C", price: 299, img: "earpods.jpg" }
};

// ====== LOCALSTORAGE CART ======
function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  renderCartDropdown();
}

// ====== LOCALSTORAGE FAVORITES ======
function getFavorites() { return JSON.parse(localStorage.getItem("favorites")) || []; }
function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
  updateFavCounter();
}

// ====== CART LOGIC ======
function addToCart(id) {
  const cart = getCart();
  cart.push(products[id]);
  saveCart(cart);
}

function updateCartCounter() {
  const counter = document.querySelector(".cart-counter");
  if (counter) counter.textContent = getCart().length;
}

// ====== FAVORITES LOGIC ======
function toggleFavorite(id) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index > -1) favs.splice(index, 1);
  else favs.push(id);
  saveFavorites(favs);
}

// ====== RENDER CART DROPDOWN ======
function renderCartDropdown() {
  const list = document.querySelector(".cart-dropdown .cart-list");
  const totalEl = document.querySelector(".cart-dropdown .total-price");
  if (!list) return;

  const cart = getCart();
  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    list.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-info">
          <b>${item.name}</b><br>${item.price} c
        </div>
        <button class="cart-remove" data-index="${index}">x</button>
      </div>
    `;
  });

  totalEl.textContent = total + " c";
}

// ====== FAVORITES COUNTER ======
function updateFavCounter() {
  const counter = document.querySelector(".fav-counter");
  if (counter) counter.textContent = getFavorites().length;
}

// ====== EVENT LISTENERS ======
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add-to-cart]");
  if (btn) addToCart(btn.dataset.addToCart);

  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    toggleFavorite(favBtn.dataset.id);
    favBtn.classList.toggle("active");
  }

  if (e.target.classList.contains("cart-remove")) {
    const cart = getCart();
    cart.splice(e.target.dataset.index, 1);
    saveCart(cart);
  }
});

// ====== GOOGLE SIGN-IN ======
const googleBtn = document.getElementById("googleSignIn");

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    // ✅ Открываем попап только один раз
    signInWithPopup(auth, provider)
      .then(res => {
        const user = res.user;
        alert(`Привет, ${user.displayName}!`);
        console.log("Google user:", user);
      })
      .catch(err => {
        console.error("Google Sign-In error:", err.code, err.message);
        alert(err.message);
      });
  });
}
const googleSignInDiv = document.querySelector(".google-signin");

function updateGoogleButton(user) {
  if (user) {
    // Пользователь вошёл — показываем аватарку
    googleSignInDiv.innerHTML = `
      <img src="${user.photoURL}" alt="${user.displayName}" class="google-user-avatar" title="${user.displayName}">
    `;
  } else {
    // Нет пользователя — показываем кнопку входа
    googleSignInDiv.innerHTML = `
      <button id="googleSignIn">
        <img src="google-icon.png" alt="Google" class="google-icon">
        Войти через Google
      </button>
    `;
    // Повторно привязываем событие к кнопке
    const googleBtn = document.getElementById("googleSignIn");
    googleBtn.addEventListener("click", signInWithGoogle);
  }
}

// Функция для входа через Google
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(res => {
      const user = res.user;
      console.log("Google user:", user);
      updateGoogleButton(user);
      alert(`Привет, ${user.displayName}!`);
    })
    .catch(err => {
      console.error("Google Sign-In error:", err.code, err.message);
      alert(err.message);
    });
}

// Привязка события кнопки
const googleBtn = document.getElementById("googleSignIn");
if (googleBtn) googleBtn.addEventListener("click", signInWithGoogle);

// Проверяем, вошёл ли пользователь при загрузке страницы
auth.onAuthStateChanged(user => {
  updateGoogleButton(user);
});

// ====== INIT ======
updateCartCounter();
updateFavCounter();
renderCartDropdown();

