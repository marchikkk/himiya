import { updateCartButtonState } from "./common";

/***********************
 * ИЗБРАННОЕ (wishlist)
 ***********************/

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
  updateWishlistCount();
}

export function isInWishlist(productId) {
  return getWishlist().some(item => item.id === productId);
}

// Добавить / Удалить + Полная синхронизация
export function toggleWishlist(product) {
  const list = getWishlist();
  const index = list.findIndex(item => item.id === product.id);

  if (index !== -1) {
    list.splice(index, 1);
  } else {
    // Сохраняем весь объект, чтобы не терять артикулы и бренды
    list.push({ ...product });
  }

  saveWishlist(list);
  
  // Обновляем все сердечки этого товара на текущей странице
  syncWishlistButtons(product.id);
}

// Та самая функция для синхронизации всех секций (Мыло, Акции и т.д.)
export function syncWishlistButtons(productId) {
  const isFavorite = isInWishlist(productId);
  const allButtons = document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`);
  
  allButtons.forEach(btn => {
    btn.classList.toggle('active', isFavorite);
    // Меняем иконку (если ты используешь текст, а не CSS-картинку)
    btn.innerHTML = isFavorite ? '❤️' : '❤️'; 
  });
}

function updateWishlistCount() {
  const count = getWishlist().length;
  const el = document.getElementById('wishlist-count');
  const elM = document.getElementById('wishlist-count-mobile');

  if (el) el.textContent = count;
  if (elM) elM.textContent = count;
}

// Рендер страницы вишлиста
function renderWishlistItems() {
  const container = document.getElementById('wishlist-items');
  const template = document.getElementById('product-card-template');
  
  if (!container || !template) return;

  container.innerHTML = '';
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><h3>Ваш список обраного порожній</h3></div>';
    return;
  }

  wishlist.forEach(p => {
    const clone = template.content.cloneNode(true);

    // Заполняем данные
    clone.querySelector('.product-article').textContent = `Артикул: ${p.article || p.id}`;
    clone.querySelector('.product-brand').textContent = p.brand || '';
    clone.querySelector('.product-name').textContent = p.name;
    clone.querySelector('.product-name').href = `product.html?slug=${p.slug}`;
    clone.querySelector('.product-link').href = `product.html?slug=${p.slug}`;
    clone.querySelector('.product-image').src = p.image;

    // Цены
    const oldPriceEl = clone.querySelector('.old-price');
    const currentPriceEl = clone.querySelector('.current-price');
    currentPriceEl.textContent = `${p.price.current.toLocaleString()} ₴`;

    if (p.price.old && p.price.old > p.price.current) {
      oldPriceEl.textContent = `${p.price.old.toLocaleString()} ₴`;
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }

    // Скидка (Проценты)
    const badge = clone.querySelector('.badge-sale');
    const discount = Math.round(((p.price.old - p.price.current) / p.price.old) * 100);

    if (p.price.old && discount > 0) {
      badge.textContent = `-${discount}%`;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }

    // Сердечко (Кнопка удаления)
    const wishlistBtn = clone.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.dataset.id = p.id;
      wishlistBtn.classList.add('active');
      wishlistBtn.innerHTML = '❤️';

      wishlistBtn.onclick = (e) => {
        e.preventDefault();
        // 1. Удаляем из localStorage
        toggleWishlist(p); 
        // 2. Сразу перерисовываем страницу, чтобы товар исчез
        renderWishlistItems(); 
        // 3. Явно обновляем цифру в шапке
        updateWishlistCount(); 
      };
    }

    // Корзина
    const btn = clone.querySelector('.card-btn');
    
    // 1. ОБЯЗАТЕЛЬНО даем кнопке ID (чтобы сработал клик из common.js)
    btn.dataset.id = p.id; 

    // 2. Ставим правильное начальное состояние (галочка, если уже в корзине)
    if (typeof isInCart === 'function' && isInCart(p.id)) {
      updateCartButtonState(btn, true);
    }

    // 3. Наведение (как в каталоге)
    btn.addEventListener('mouseenter', () => {
      const currentImg = btn.querySelector('img');
      if (currentImg && !btn.classList.contains('in-cart')) {
        currentImg.src = 'img/tray.png';
      }
    });

    btn.addEventListener('mouseleave', () => {
      const currentImg = btn.querySelector('img');
      if (currentImg && !btn.classList.contains('in-cart')) {
        currentImg.src = 'img/trayy.png';
      }
    });
    
    // ВАЖНО: Удаляем btn.onclick! 
    // Глобальный слушатель из common.js сам поймает клик по .card-btn

    container.appendChild(clone);
  });
  updateWishlistCount();
}

document.addEventListener('DOMContentLoaded', () => {
  updateWishlistCount();
  renderWishlistItems();
});
document.addEventListener('click', e => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    e.preventDefault();

    // Если мы на странице избранного, там своя логика (удаление)
    if (document.getElementById('wishlist-items')) return;

    // Получаем ID из кнопки (это всегда строка из dataset)
    const rawId = btn.dataset.id;
    
    // Ищем товар в глобальном массиве, сравнивая без учета типа (==) или приводя к числу
    // Так как в API id может быть числом, а в dataset — строка.
    const product = (window.products || []).find(p => String(p.id) === String(rawId));

    if (!product) {
        console.warn('Товар не найден в window.products для ID:', rawId);
        return;
    }

    // Вызываем функции из твоего файла избранного
    // (Убедись, что функции toggleWishlist и syncWishlistButtons доступны глобально или в этом же файле)
    toggleWishlist(product);
    syncWishlistButtons(product.id);
});

