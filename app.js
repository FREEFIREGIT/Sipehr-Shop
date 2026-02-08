// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyQ...",
  authDomain: "sipehr-shop.firebaseapp.com",
  projectId: "sipehr-shop",
  storageBucket: "sipehr-shop.firebasestorage.app",
  messagingSenderId: "315068554355",
  appId: "1:315068554355:web:34a130038f79bf455ade06"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 Firebase подключён");

// ================= PRODUCTS =================
const products = {
  1: { id: 1, name: "Buds 2 Pro", price: 1299, img: "buds.jpg" },
  2: { id: 2, name: "Headphones X", price: 899, img: "headphones.jpg" },
  3: { id: 3, name: "EarPods Type-C", price: 299, img: "earpods.jpg" }
};

// ================= CART =================
const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = cart => {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  renderCartDropdown();
};

function addToCart(id) {
  const cart = getCart();
  cart.push(products[id]);
  saveCart(cart);
}

function updateCartCounter() {
  const el = document.querySelector(".cart-counter");
  if (el) el.textContent = getCart().length;
}

// ================= FAVORITES =================
const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];
const saveFavorites = favs => {
  localStorage.setItem("favorites", JSON.stringify(favs));
  updateFavCounter();
};

function toggleFavorite(id) {
  id = Number(id);
  const favs = getFavorites();
  favs.includes(id) ? favs.splice(favs.indexOf(id), 1) : favs.push(id);
  saveFavorites(favs);
  syncAllFavoriteButtons();
}

function syncAllFavoriteButtons() {
  document.querySelectorAll(".fav-btn").forEach(btn => {
    const id = Number(btn.dataset.id);
    btn.classList.toggle("active", getFavorites().includes(id));
  });
}

function updateFavCounter() {
  const el = document.querySelector(".fav-counter");
  if (el) el.textContent = getFavorites().length;
}

// ================= CART DROPDOWN =================
function renderCartDropdown() {
  const list = document.querySelector(".cart-list");
  const totalEl = document.querySelector(".total-price");
  if (!list || !totalEl) return;

  const cart = getCart();
  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    list.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <b>${item.name}</b><br>${item.price} c
        </div>
        <button class="cart-remove" data-index="${i}">×</button>
      </div>
    `;
  });

  totalEl.textContent = total + " c";
}

// ================= AUTH =================
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(res => alert(`👋 Привет, ${res.user.displayName}`))
    .catch(err => console.error(err));
}

// ================= USER UI =================
onAuthStateChanged(auth, user => {
  const userBox = document.querySelector(".user-box");
  if (!userBox) return;

  if (user) {
    userBox.innerHTML = `
      <img src="${user.photoURL}" class="user-avatar">
      <span>${user.displayName}</span>
      <button id="logoutBtn" class="logout-btn">Выйти</button>
    `;
    document.getElementById("logoutBtn").onclick = () =>
      signOut(auth).then(() => location.reload());
  } else {
    userBox.innerHTML = `<button id="googleSignIn">Войти через Google</button>`;
    document.getElementById("googleSignIn").onclick = signInWithGoogle;
  }
});

// ================= EVENTS =================
document.addEventListener("click", e => {
  const cartBtn = e.target.closest("[data-add-to-cart]");
  if (cartBtn) addToCart(cartBtn.dataset.addToCart);

  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) toggleFavorite(favBtn.dataset.id);

  if (e.target.classList.contains("cart-remove")) {
    const cart = getCart();
    cart.splice(e.target.dataset.index, 1);
    saveCart(cart);
  }

  if (e.target.classList.contains("checkout-btn")) {
    alert("Оплата успешна 🎉");
    saveCart([]);
  }
});

// ================= SKELETON LOADER =================
function hideSkeletonAfterLoad() {
  const images = document.images;
  let loaded = 0;
  if (images.length === 0) removeSkeleton();

  [...images].forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === images.length) removeSkeleton();
    } else {
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === images.length) removeSkeleton();
      };
    }
  });
}

function removeSkeleton() {
  document.querySelectorAll(".skeleton").forEach(el => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 400);
  });
}

// ================= DARK MODE =================
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  if (localStorage.getItem("dark") === "1")
    document.body.classList.add("dark-mode");

  darkToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "dark",
      document.body.classList.contains("dark-mode") ? "1" : "0"
    );
  };
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  updateFavCounter();
  renderCartDropdown();
  syncAllFavoriteButtons();
  hideSkeletonAfterLoad();
});
