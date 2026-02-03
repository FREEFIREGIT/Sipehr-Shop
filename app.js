// ====== FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ⚡ Настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyQ...",
  authDomain: "sipehr-shop.firebaseapp.com",
  projectId: "sipehr-shop",
  storageBucket: "sipehr-shop.firebasestorage.app",
  messagingSenderId: "315068554355",
  appId: "1:315068554355:web:34a130038f79bf455ade06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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

// ====== SYNC FAVORITES ======
function syncFavoriteButton(btn) {
  const id = Number(btn.dataset.id);
  const favs = getFavorites();
  btn.classList.toggle("active", favs.includes(id));
}
function syncAllFavoriteButtons() {
  document.querySelectorAll(".fav-btn").forEach(syncFavoriteButton);
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
  id = Number(id);
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index > -1) favs.splice(index, 1);
  else favs.push(id);
  saveFavorites(favs);
  syncAllFavoriteButtons();
}

// ====== RENDER CART DROPDOWN ======
function renderCartDropdown() {
  const list = document.querySelector(".cart-dropdown .cart-list");
  const totalEl = document.querySelector(".cart-dropdown .total-price");
  if (!list || !totalEl) return;

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

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) checkoutBtn.style.display = cart.length > 0 ? "block" : "none";
}

// ====== FAVORITES COUNTER ======
function updateFavCounter() {
  const counter = document.querySelector(".fav-counter");
  if (counter) counter.textContent = getFavorites().length;
}

// ====== GOOGLE SIGN-IN ======
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(res => {
      const user = res.user;
      console.log("Google user:", user);
      alert(`Привет, ${user.displayName}!`);
    })
    .catch(err => {
      console.error("Google Sign-In error:", err);
      alert(err.message);
    });
}

// ====== FACEBOOK SIGN-IN ======
function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');

  signInWithPopup(auth, provider)
    .then(res => {
      const user = res.user;
      console.log("Facebook user:", user);
      alert(`Привет, ${user.displayName}!`);
    })
    .catch(err => {
      console.error("Facebook Sign-In error:", err);
      alert(err.message);
    });
}

// ====== ИНИЦИАЛИЗАЦИЯ КНОПОК ======
document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleSignIn");
  const fbBtn = document.getElementById("facebookSignIn");

  if (googleBtn) googleBtn.addEventListener("click", signInWithGoogle);
  if (fbBtn) fbBtn.addEventListener("click", signInWithFacebook);
});

// ====== СЛУШАТЕЛЬ СОСТОЯНИЯ АВТОРИЗАЦИИ ======
auth.onAuthStateChanged(user => {
  console.log("Auth state changed:", user);
  // тут можно добавить отображение имени и аватара рядом с кнопкой
});

// ====== HIDE SKELETON ======
function hideSkeleton() {
  document.querySelectorAll(".skeleton").forEach(el => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 400);
  });
}

// ====== EVENT LISTENERS ======
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add-to-cart]");
  if (btn) addToCart(btn.dataset.addToCart);

  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) toggleFavorite(favBtn.dataset.id);

  if (e.target.classList.contains("cart-remove")) {
    const cart = getCart();
    cart.splice(e.target.dataset.index, 1);
    saveCart(cart);
  }

  if (e.target.classList.contains("checkout-btn")) {
    alert("Оплата успешна! 🎉");
    saveCart([]);
  }
});

// ====== DARK MODE ======
window.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkToggle");
  if (!darkToggle) return;

  if(localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });
});

// ====== INIT ======
updateCartCounter();
updateFavCounter();
renderCartDropdown();
hideSkeleton();
syncAllFavoriteButtons();

// ====== ТРЁХТОЧЕЧНОЕ МЕНЮ ======
const mainButton = document.getElementById('mainButton');
const menuItems = document.getElementById('menuItems');

if (mainButton && menuItems) {
  mainButton.addEventListener('click', () => {
    menuItems.classList.toggle('active');
  });
}

