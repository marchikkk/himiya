import { renderProducts } from './catalog';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('slug'); // slug = id товара

  if (!id) {
    console.warn('Product ID not found in URL');
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`);

    if (!res.ok) {
      throw new Error('Product not found');
    }

    const json = await res.json();
    const p = json.data;

    const product = {
      id: p.id,
      article: p.sku ?? p.id.slice(0, 8),
      name: p.name,
      brand: p.brand?.name ?? '',
      image: p.images?.[0] ?? '',
      price: {
        current: Number(p.final_price ?? p.price ?? 0),
        old: p.discount_percent > 0 ? Number(p.price) : null
      }
    };

    renderProducts([product], 'product-page-container');

    // ЛОГИКА НАЛИЧИЯ 
    const stockContainer = document.getElementById('stock-status');
    if (stockContainer) {
        if (p.stock_total > 0) {
            stockContainer.innerHTML = '<span class="in-stock">В наявності</span>';
        } else {
            stockContainer.innerHTML = '<span class="out-stock">Немає в наявності</span>';
        }
    }

  } catch (e) {
    console.error('Product load error:', e);
    document.getElementById('product-page-container').innerHTML = '<h2>Товар не знайдено</h2>';
  }
});



