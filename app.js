// ====== PRODUCTS ======
const products = {
  1: { id: 1, name: "Buds 2 Pro", price: 1299, img: "buds.jpg" },
  2: { id: 2, name: "Headphones X", price: 899, img: "headphones.jpg" },
  3: { id: 3, name: "EarPods Type-C", price: 299, img: "earpods.jpg" }
};

// ====== LOCALSTORAGE CART ======
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  renderCartDropdown();
}

// ====== LOCALSTORAGE FAVORITES ======
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

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
  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
  }
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
          <b>${item.name}</b><br>
          ${item.price} c
        </div>
        <button class="cart-remove" data-index="${index}">x</button>
      </div>
    `;
  });

  totalEl.textContent = total + " c";
}

// ====== RENDER FAVORITES ON PAGE ======
function updateFavCounter() {
  const counter = document.querySelector(".fav-counter");
  if (counter) counter.textContent = getFavorites().length;
}

// ====== EVENT LISTENERS ======
document.addEventListener("click", e => {
  // ADD TO CART BUTTON
  const btn = e.target.closest("[data-add-to-cart]");
  if (btn) {
    addToCart(btn.dataset.addToCart);
  }

  // FAVORITE BUTTON
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const id = favBtn.dataset.id;
    toggleFavorite(id);
    favBtn.classList.toggle("active");
  }

  // REMOVE FROM CART
  if (e.target.classList.contains("cart-remove")) {
    const index = e.target.dataset.index;
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }
});
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleSignIn");

googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Привет, ${user.displayName}!`);
      console.log("Пользователь вошёл через Google:", user);
    })
    .catch((error) => {
      console.error("Ошибка входа через Google:", error);
      alert("Ошибка при входе через Google!");
    });
});

// ====== INITIALIZE ======
updateCartCounter();
updateFavCounter();
renderCartDropdown();
