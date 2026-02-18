import { syncCartButtons } from "./common";

/***********************
 * КОРЗИНА (localStorage)
 ***********************/

// получить корзину
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// сохранить корзину
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// добавить товар
export function addToCart(product) {
  const cart = getCart();
  const exists = cart.find(item => item.id === product.id);

  if (exists) {
    // если уже есть → удаляем
    removeFromCart(product.id);
    return false; // теперь товара НЕТ
  } else {
    // если нет → добавляем
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    saveCart(cart);
    return true; // теперь товар ЕСТЬ
  }
}


// обновить счётчик
export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const counter = document.getElementById('cart-count');
  if (counter) {
    counter.textContent = count;
  }
  const counterMobile = document.getElementById('cart-count-mobile');
  if (counterMobile) {
    counterMobile.textContent = count;
  }
}

// при загрузке страницы
document.addEventListener('DOMContentLoaded', updateCartCount);



const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.querySelectorAll('.cart'); // кнопка в шапке
const closeCartBtn = document.getElementById('close-cart');

function openCart() {
  cartPanel.classList.add('active');
  cartOverlay.classList.add('active');
  renderCart();
}

function closeCart() {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
}

// Вешаем событие на каждую найденную кнопку (и ПК, и мобилка)
cartBtn?.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  });
});

closeCartBtn?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);



function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');

  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <img src="${item.image}">
      <div>
        <div>${item.name}</div>
        <div>${item.price} ₴</div>
        <div>
          <button data-id="${item.id}" class="minus">−</button>
          ${item.quantity}
          <button data-id="${item.id}" class="plus">+</button>
          <button data-id="${item.id}" class="remove">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = total + ' ₴';
}



document.addEventListener('click', e => {
  // Проверяем, что кликнули именно по кнопкам управления в корзине
  const isControlBtn = e.target.classList.contains('plus') || 
                       e.target.classList.contains('minus') || 
                       e.target.classList.contains('remove');
                       
  if (!isControlBtn || !e.target.dataset.id) return;

  const id = e.target.dataset.id; // оставляем как строку для универсальности
  let cart = getCart();
  
  // Ищем товар, сравнивая ID как строки
  const item = cart.find(i => String(i.id) === String(id));

  if (!item) return;

  if (e.target.classList.contains('plus')) {
    item.quantity++;
  }

  if (e.target.classList.contains('minus')) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(i => String(i.id) !== String(id));
    }
  }

  if (e.target.classList.contains('remove')) {
    cart = cart.filter(i => String(i.id) !== String(id));
  }

  saveCart(cart); // сохраняем
  renderCart();   // перерисовываем панель

  // ВАЖНО: Синхронизируем кнопки на основной странице
  if (typeof syncCartButtons === 'function') {
    syncCartButtons();
    // window.syncCartButtons();
  }
});


const goCheckoutBtn = document.getElementById('go-checkout');

goCheckoutBtn?.addEventListener('click', () => {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Кошик порожній');
    return;
  }

  window.location.href = '/checkout';
});

export function isInCart(productId) {
  const cart = getCart();
  return cart.some(item => String(item.id) === String(productId));
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => String(item.id) !== String(productId));
  saveCart(cart);
}


// window.removeFromCart = removeFromCart;

// window.addToCart = addToCart;
// window.isInCart = isInCart;
// window.updateCartCount = updateCartCount;