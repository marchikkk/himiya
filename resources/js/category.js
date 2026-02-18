import { isPromo, renderProducts } from "./catalog";
import { syncCartButtons } from "./common";

// ===== получить всех потомков категории =====
function getAllChildCategoryIds(parentId, categories) {
  const result = [];

  function walk(id) {
    categories
      .filter(c => c.parent_id === id)
      .forEach(child => {
        result.push(child.id);
        walk(child.id);
      });
  }

  walk(parentId);
  return result;
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get('category');

  if (!categoryId) {
    console.warn('Категорія не вказана в URL');
    return;
  }

  const container = document.getElementById('products-container');
  const titleEl = document.getElementById('category-title');

  if (!container) return;

  try {
    // =====  грузим категории =====
    const catRes = await fetch('http://phpsite.test/api/categories');
    const catJson = await catRes.json();
    const categories = catJson.data;

    // =====  грузим товары =====
    const prodRes = await fetch('http://phpsite.test/api/products');
    const prodJson = await prodRes.json();

    const products = prodJson.data.map(p => ({
      id: p.id,
      article: p.sku ?? p.id.slice(0, 8),
      name: p.name,
      brand: p.brand?.name ?? '',
      image: p.images?.[0] ?? 'img/carousel/test2.jpg',
      category_id: p.category?.id ?? null,
      price: {
        current: Number(p.final_price ?? p.price ?? 0),
        old: p.discount_percent > 0 ? Number(p.price) : null
      }
    }));

    let filtered = [];

    // =====  PROMO (виртуальная категория) =====
    if (categoryId === 'promo') {
      if (titleEl) {
        titleEl.textContent = 'Товари в акції';
      }

      filtered = products.filter(isPromo);

    } else {
      // =====  обычные категории =====
      const currentCategory = categories.find(c => c.id === categoryId);

      if (!currentCategory) {
        container.innerHTML = '<p class="no-products">Категорія не знайдена</p>';
        return;
      }

      if (titleEl) {
        titleEl.textContent = currentCategory.name;
      }

      const childIds = getAllChildCategoryIds(categoryId, categories);
      const allowedCategoryIds =
        childIds.length > 0 ? childIds : [categoryId];

      filtered = products.filter(p =>
        allowedCategoryIds.includes(p.category_id)
      );
    }

    // =====  отрисовка =====
    if (filtered.length) {
      renderProducts(filtered, 'products-container');
      setTimeout(syncCartButtons, 50);
    } else {
      container.innerHTML = '<p class="no-products">Товарів не знайдено</p>';
    }
    
  } catch (e) {
    console.error('Помилка завантаження', e);
    container.innerHTML = '<p class="no-products">Помилка завантаження</p>';
  }
});