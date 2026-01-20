// ====== FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqQc7JS5eyDydXf3jJSlp6Ca_eWsd0O7g",
  authDomain: "sipehr-shop.firebaseapp.com",
  projectId: "sipehr-shop",
  storageBucket: "sipehr-shop.firebasestorage.app",
  messagingSenderId: "315068554355",
  appId: "1:315068554355:web:34a130038f79bf455ade06"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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

// ====== FAVORITES ======
function getFavorites() { return JSON.parse(localStorage.getItem("favorites")) || []; }
function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
  updateFavCounter();
}

// ====== CART ======
function addToCart(id) {
  const cart = getCart();
  cart.push(products[id]);
  saveCart(cart);
}

function updateCartCounter() {
  const counter = document.querySelector(".cart-counter");
  if (counter) counter.textContent = getCart().length;
}

// ====== FAVORITES ======
function toggleFavorite(id) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  index > -1 ? favs.splice(index, 1) : favs.push(id);
  saveFavorites(favs);
}

// ====== CART DROPDOWN ======
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
        <img src="${item.img}">
        <div class="cart-info">
          <b>${item.name}</b><br>${item.price} c
        </div>
        <button class="cart-remove" data-index="${index}">x</button>
      </div>`;
  });

  totalEl.textContent = total + " c";
}

// ====== COUNTERS ======
function updateFavCounter() {
  const counter = document.querySelector(".fav-counter");
  if (counter) counter.textContent = getFavorites().length;
}

// ====== EVENTS ======
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
    signInWithPopup(auth, provider)
      .then(res => {
        alert(`Привет, ${res.user.displayName}!`);
        console.log("Google user:", res.user);
      })
      .catch(err => {
        console.error("Auth error:", err.code, err.message);
        alert(err.message);
      });
  });
}

// ====== INIT ======
updateCartCounter();
updateFavCounter();
renderCartDropdown();
