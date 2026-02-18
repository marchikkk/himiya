import { renderProducts } from './catalog';
import { updateSearchUI } from './common';
import { switchLayout } from './search';

export const filtersState = {
  priceMin: null,
  priceMax: null,
  brands: [],
  query: null,
  onlyPromo: false,
  sort: 'name_asc'
};

/*
|--------------------------------------------------------------------------
| Сбор фильтров из UI
|--------------------------------------------------------------------------
*/
function collectFilters() {

  const min = document.getElementById('priceMin')?.value;
  const max = document.getElementById('priceMax')?.value;

  filtersState.priceMin = min ? Number(min) : null;
  filtersState.priceMax = max ? Number(max) : null;

  filtersState.brands = [...document.querySelectorAll('.filter-brand:checked')]
    .map(cb => cb.value);

  filtersState.onlyPromo =
    document.getElementById('onlyPromo')?.checked || false;

  filtersState.sort =
    document.getElementById('sortSelect')?.value || 'name_asc';
}

/*
|--------------------------------------------------------------------------
| Формирование запроса к API
|--------------------------------------------------------------------------
*/
function buildQueryParams() {

  const params = new URLSearchParams();

  if (filtersState.query)
    params.append('search', filtersState.query);

  if (filtersState.priceMin !== null)
    params.append('price_from', filtersState.priceMin);

  if (filtersState.priceMax !== null)
    params.append('price_to', filtersState.priceMax);

  if (Array.isArray(filtersState.brands) && filtersState.brands.length > 0) {
    params.append('brands', filtersState.brands.join(','));
  }

  if (filtersState.onlyPromo)
    params.append('promo', 1);

  params.append('sort', filtersState.sort);

  return params.toString();
}

/*
|--------------------------------------------------------------------------
| Основное применение фильтров (через API)
|--------------------------------------------------------------------------
*/
async function applyFilters() {

  const queryString = buildQueryParams();

  try {
    let res = await fetch(`/api/products?${queryString}`);
    let json = await res.json();

    if (json.data.length === 0 && filtersState.query) {
      const switched = switchLayout(filtersState.query);
      if (switched !== filtersState.query) {
        const params = new URLSearchParams(queryString);
        params.set('search', switched);
        res = await fetch(`/api/products?${params.toString()}`);
        json = await res.json();
      }
    }

    const products = (json.data || []).map(p => ({
      id: p.external_id ?? p.id,
      slug: p.external_id ?? p.id,
      article: p.sku ?? '',
      name: p.name,
      brand: p.brand?.name ?? '',
      image: p.images?.[0] ?? '/img/no-image.jpg',
      price: {
        current: Number(p.final_price ?? p.price ?? 0),
        old: p.discount_percent > 0
          ? Number(p.price)
          : null
      }
    }));

    renderBrandFilters(json.brands || []);
    renderProducts(products, 'products-container');
    updateSearchUI(products.length);

  } catch (e) {
    console.error('Filter API error:', e);
  }
}

/*
|--------------------------------------------------------------------------
| Сброс фильтров
|--------------------------------------------------------------------------
*/
function resetFilters() {

  filtersState.priceMin = null;
  filtersState.priceMax = null;
  filtersState.brands = [];
  filtersState.onlyPromo = false;
  filtersState.sort = 'name_asc';

  const minInput = document.getElementById('priceMin');
  const maxInput = document.getElementById('priceMax');
  const promoCheckbox = document.getElementById('onlyPromo');
  const sortSelect = document.getElementById('sortSelect');

  if (minInput) minInput.value = '';
  if (maxInput) maxInput.value = '';
  if (promoCheckbox) promoCheckbox.checked = false;
  if (sortSelect) sortSelect.value = 'name_asc';

  document.querySelectorAll('.filter-brand').forEach(cb => {
    cb.checked = false;
  });
}

/*
|--------------------------------------------------------------------------
| Инициализация
|--------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const queryFromURL = params.get('q');

  if (queryFromURL) {
    filtersState.query = queryFromURL;
  }

  applyFilters();

  document.getElementById('applyFilters')?.addEventListener('click', () => {
    collectFilters();
    applyFilters();
  });

  document.getElementById('sortSelect')?.addEventListener('change', () => {
    collectFilters();
    applyFilters();
  });

  document.getElementById('resetFilters')?.addEventListener('click', () => {
    resetFilters();
    applyFilters();
  });
});

function renderBrandFilters(brands) {

  const container = document.getElementById('brand-filters');

  if (!container) return;

  const existing = container.querySelectorAll('.brand-item');
  existing.forEach(el => el.remove());

  brands.forEach(brand => {

    const label = document.createElement('label');
    label.classList.add('brand-item');

    const isChecked = filtersState.brands.includes(brand.slug);

    label.innerHTML = `
      <input 
        type="checkbox" 
        class="filter-brand" 
        value="${brand.slug}"
        ${isChecked ? 'checked' : ''}
      >
      ${brand.name}
    `;

    container.appendChild(label);
  });
}