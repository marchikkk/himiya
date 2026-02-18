import { syncCartButtons } from "./common";
import { isInWishlist } from "./wishlist";

// ===== ГЛОБАЛЬНО =====
window.products = [];

// ===== ВСПОМОГАТЕЛЬНЫЕ =====
export function isPromo(p) {
  return p.price?.old && p.price.old > p.price.current;
}

function getDiscountPercent(p) {
  if (!isPromo(p)) return 0;
  return Math.round(((p.price.old - p.price.current) / p.price.old) * 100);
}

function sortProducts(items, type) {
  const sorted = [...items];
  switch (type) {
    case 'price_asc':
      sorted.sort((a, b) => a.price.current - b.price.current);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.price.current - a.price.current);
      break;
    case 'name_desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'promo_desc':
      sorted.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

export function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  const template = document.getElementById('product-card-template');

  if (!container || !template) return;

  container.innerHTML = '';

  products.forEach(p => {
    const clone = template.content.cloneNode(true);

    const productUrl = `/product?slug=${p.id}`;

    // ===== ССЫЛКИ =====
    const nameEl = clone.querySelector('.product-name');
    const imgLink = clone.querySelector('.product-link');
    const articleEl = clone.querySelector('.product-article');

    if (nameEl) {
      nameEl.textContent = p.name;
      nameEl.href = productUrl;
    }

    if (imgLink) {
      imgLink.href = productUrl;
    }

    if (articleEl) {
      articleEl.textContent = `Артикул: ${p.article}`;
      articleEl.href = productUrl;
    }

    // ===== ДАННЫЕ =====
    clone.querySelector('.product-brand').textContent = p.brand;
    clone.querySelector('.product-image').src = p.image;

    const oldPriceEl = clone.querySelector('.old-price');
    const currentPriceEl = clone.querySelector('.current-price');

    currentPriceEl.textContent = `${p.price.current.toLocaleString()} ₴`;

    if (p.price.old) {
      oldPriceEl.textContent = `${p.price.old.toLocaleString()} ₴`;
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }

    // ===== АКЦИЯ =====
    const badge = clone.querySelector('.badge-sale');
    const discount = getDiscountPercent(p);
    badge.style.display = discount > 0 ? 'block' : 'none';
    badge.textContent = discount > 0 ? `-${discount}%` : '';

    // ===== ИЗБРАННОЕ =====
    const wishlistBtn = clone.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.dataset.id = p.id;

      if (typeof isInWishlist === 'function' && isInWishlist(p.id)) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '❤️';
      }
    }

    // ===== КНОПКА КОРЗИНЫ =====
    const btn = clone.querySelector('.card-btn');
    if (btn) {
      btn.dataset.id = p.id;
    }

    container.appendChild(clone);
  });
}

// ===== ЗАГРУЗКА =====
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://phpsite.test/api/products')
    .then(res => res.json())
    .then(response => {
      const data = response.data;

      window.products = data.map(p => ({
        id: p.id,
        slug: p.id,
        article: p.sku || p.id.slice(0,8),
        name: p.name,
        brand: p.brand?.name || '',
        image: p.image || p.images?.[0] || 'img/carousel/test2.jpg',
        category_id: p.category?.external_id || p.category?.id || null,
        category_name: p.category?.name || 'Без категорії',
        price: {
          current: Number(p.final_price ?? p.price ?? 0),
          old: p.discount_percent > 0
            ? Number(p.price)
            : null
        }
      }));

      const CATEGORY_IDS = {
          FORKS: '680f1a87-eea0-11ef-98dc-002324220145',
          KETTLES: '680f1a86-eea0-11ef-98dc-002324220145',
          TEST: '801051ca-0533-11f1-99fe-a85e45177e72'
      };

      const forks = window.products.filter(p => p.category_id === CATEGORY_IDS.FORKS);
      const kettles = window.products.filter(p => p.category_id === CATEGORY_IDS.KETTLES);
      const test = window.products.filter(p => p.category_id === CATEGORY_IDS.TEST);
      const promo = window.products.filter(isPromo);

      renderProducts(forks.slice(0, 5), 'forks-container');
      renderProducts(kettles.slice(0, 5), 'kettles-container');
      renderProducts(test.slice(0, 5), 'test-container');
      renderProducts(promo.slice(0, 5), 'promo-container');

      setTimeout(() => {
          if (typeof syncCartButtons === 'function') {
              syncCartButtons();
          }
      }, 100);
    })
    .catch(err => console.error('API error:', err));
});

