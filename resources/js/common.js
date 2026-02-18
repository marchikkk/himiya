// import { searchProducts } from "./search";
import { liveSearch} from "./search";
import { updateCartCount, isInCart, addToCart } from "./cart";
import { filtersState } from "./filters";
// import { toggleWishlist, isInWishlist, syncWishlistButtons } from "./wishlist";

/***********************
 * ФИКСАЦИЯ СКРОЛЛА 
 ***********************/
let scrollPosition = 0;

function lockScroll() {
  scrollPosition = window.scrollY;
  // window.scrollTo(0, 0);

  document.body.style.position = 'fixed';
  document.body.style.top = '-${scrollPosition}px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';

  window.scrollTo(0, scrollPosition);
}


/***********************
 * ОТКРЫТИЕ / ЗАКРЫТИЕ ВЕРХНЕГО КАТАЛОГА
 ***********************/

function closeCatalog() {
  const wrapper = document.getElementById('catalog-wrapper');
  const catalog = document.getElementById('catalog-menu-full');
  const overlay = document.getElementById('overlay');
  const catPush = document.getElementById('catPush');
  const searchSuggestions = document.getElementById('search-suggestions'); // Находим поиск

  if (!wrapper || !catalog) return;

  const icon = wrapper.querySelector('img');

  wrapper.classList.remove('active');
  catalog.classList.remove('active');

  // Закрываем оверлей только если поиск тоже закрыт
  const isSearchOpen = searchSuggestions && searchSuggestions.style.display === 'block';
  if (!isSearchOpen) {
    overlay.classList.remove('active');
  }

  if (icon) icon.src = 'img/threebars.svg';

  // УМНЫЙ ТАЙМЕР
  setTimeout(() => {
    // Проверяем: если за эти 230мс ты успел открыть поиск, 
    // то МЫ НЕ ВОЗВРАЩАЕМ z-index: 3
    const isSearchNowActive = searchSuggestions && searchSuggestions.style.display === 'block';
    const isCatalogNowActive = catalog.classList.contains('active');

    if (catPush && !isCatalogNowActive && !isSearchNowActive) {
      catPush.style.zIndex = '3';
    }
  }, 230);

  unlockScroll();
  document.removeEventListener('click', outsideClickListener);
}

// Слушатель клика вне каталога тоже выносим
function outsideClickListener(e) {
  const catalog = document.getElementById('catalog-menu-full');
  const headerTop = document.querySelector('.header');
  const headerBottom = document.querySelector('.header-bot');

  const clickInsideHeader = (headerTop?.contains(e.target)) || (headerBottom?.contains(e.target));
  const clickInsideCatalog = catalog?.contains(e.target);

  if (!clickInsideHeader && !clickInsideCatalog) {
    closeCatalog();
  }
}

// Сама функция переключения теперь стала очень короткой
function catalogToggle() {
  const wrapper = document.getElementById('catalog-wrapper');
  const catalog = document.getElementById('catalog-menu-full');
  const overlay = document.getElementById('overlay');
  const catPush = document.getElementById('catPush');

  if (!wrapper || !catalog || !overlay) return;

  const icon = wrapper.querySelector('img');
  const isOpening = !wrapper.classList.contains('active');

  if (isOpening) {
    wrapper.classList.add('active');
    catalog.classList.add('active');
    overlay.classList.add('active');

    if (icon) icon.src = 'img/krest.svg';
    overlay.style.zIndex = '2';
    if (catPush) catPush.style.zIndex = '1';

    lockScroll();

    setTimeout(() => {
      document.addEventListener('click', outsideClickListener);
    }, 50);
    
    overlay.onclick = closeCatalog;
  } else {
    closeCatalog();
  }
}

/***********************
 * ПОДМЕНЮ ВЕРХНЕГО КАТАЛОГА
 ***********************/
window.initTopCatalogHover = function () {
  const topMenuItems = document.querySelectorAll('.catalog-menu ul li');
  const topSubmenus = document.querySelector('.submenus-top');
  const topCatMenus = document.querySelectorAll('.submenus-top .cat-menu-top');
  const topCatalog = document.querySelector('.catalog-menu-full');

  if (!topMenuItems.length || !topSubmenus) return;

  topMenuItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      topSubmenus.classList.add('active');
      topCatMenus.forEach(menu => menu.classList.remove('active'));
      topCatMenus[i]?.classList.add('active');
    });
  });

  if (topCatalog) {
    topCatalog.addEventListener('mouseleave', () => {
      topSubmenus.classList.remove('active');
      topCatMenus.forEach(menu => menu.classList.remove('active'));
    });
  }
};

/***********************
 * ГОЛОСОВОЙ ПОИСК
 ***********************/
const micBtn = document.getElementById('micBtn');
const searchInput = document.getElementById('searchInput');

if (micBtn && searchInput && 'webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = 'uk-UA';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => micBtn.classList.add('listening');
  recognition.onend = () => micBtn.classList.remove('listening');

  recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript;
  searchInput.value = transcript;

  // 1. Сразу запускаем поиск (переход на страницу результатов)
  if (transcript.trim()) {
    window.location.href = `/search?q=${encodeURIComponent(transcript.trim())}`;
  }
};

  micBtn.addEventListener('click', () => recognition.start());
}



function hasActiveFilters() {
  return (
    filtersState.priceMin !== null ||
    filtersState.priceMax !== null ||
    filtersState.brands.length > 0 ||
    filtersState.onlyPromo === true ||
    filtersState.sort !== 'name_asc'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const btn = document.querySelector('.search-btn');
  // const container = document.getElementById('products-container');

  // Логика кнопки поиска 
  if (input && btn) {
    btn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  }

  // Десктопный каталог
  const catalogTriggers = document.querySelectorAll('.js-catalog-trigger');
  catalogTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault(); 
      catalogToggle();
    });
  });

  // МОБИЛЬНЫЙ КАТАЛОГ
  const mobileTriggers = document.querySelectorAll('.js-mobile-catalog-trigger');
  mobileTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      triggerMobileMenu();
    });
  });
});



export function updateSearchUI(resultCount) {
  const filters = document.getElementById('filters');
  const sortBar = document.getElementById('sort-bar');
  const noResults = document.getElementById('no-results');
  const title = document.getElementById('search-title');

  const isFilterResult = hasActiveFilters();

  // Заголовок
  if (title && filtersState.query) {
    title.textContent = `Результати пошуку за запитом: "${filtersState.query}"`;
  }

  if (resultCount === 0) {

    // Скрываем фильтры
    if (!isFilterResult) {
      if (filters) filters.style.display = 'none';
      if (sortBar) sortBar.style.display = 'none';
    } 

    // Сообщение
    if (noResults) {
      noResults.innerHTML = isFilterResult
      ? 'Немає товарів з обраними фільтрами'
      : 'Нажаль, нічого не знайдено';
      noResults.hidden = false;
    }
  } else {
    // Если что-то нашли
    if (filters) filters.style.display = '';
    if (sortBar) sortBar.style.display = '';
    if (noResults) noResults.hidden = true;
  }
}



const input = document.getElementById('searchInput');
const box = document.getElementById('search-suggestions');

input.addEventListener('input', () => {
  const q = input.value.trim();

  if (q.length < 2) {
    // box.style.display = 'none';
    closeSearchSuggestions();
    return;
  }

  liveSearch(q).then(results => {
    renderSuggestions(results.slice(0,4), q);
  });

  openSearchSuggestions();
});


const overlay = document.getElementById('overlay');

let searchZIndexTimeout;

function openSearchSuggestions() {

// Если каталог открыт — закрываем его без побочных эффектов
  const catalog = document.getElementById('catalog-menu-full');
  if (catalog && catalog.classList.contains('active')) {
    closeCatalog(); 
  }

  // Если висит старый таймер на закрытие — отменяем его немедленно!
  if (searchZIndexTimeout) {
    clearTimeout(searchZIndexTimeout);
  }

  box.style.display = 'block';
  overlay.classList.add('active');

  // СКРЫВАЕМ НАВИГАЦИЮ
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) mobileNav.style.display = 'none';

  if (catPush) {
    catPush.style.zIndex = '1';
  }

  setTimeout(() => {
    document.addEventListener('click', outsideSearchClick);
  }, 0);

  // document.body.style.overflow = 'hidden'; // Запрещаем скролл сайта под поиском
  // box.style.display = 'block';
}

function closeSearchSuggestions() {
  box.style.display = 'none';
  overlay.classList.remove('active');

  // ВОЗВРАЩАЕМ НАВИГАЦИЮ
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) mobileNav.style.display = '';

  // Сбрасываем старый таймер перед запуском нового (на всякий случай)
  if (searchZIndexTimeout) {
    clearTimeout(searchZIndexTimeout);
  }

  // Запускаем таймер на возврат индекса
  searchZIndexTimeout = setTimeout(() => {
    const catalog = document.getElementById('catalog-menu-full');
    const isCatalogOpen = catalog && catalog.classList.contains('active');
    
    // Проверяем: если за это время поиск не открыли снова (!box.style.display)
    if (catPush && !isCatalogOpen && box.style.display === 'none') {
      catPush.style.zIndex = '3';
    }
  }, 300); // Время анимации твоего оверлея

  document.removeEventListener('click', outsideSearchClick);
  // document.body.style.overflow = ''; // Возвращаем скролл
  // box.style.display = 'none';
}


function outsideSearchClick(e) {
  const searchBlock = document.querySelector('.search-block');

  if (!searchBlock.contains(e.target)) {
    closeSearchSuggestions();
  }
}


overlay.addEventListener('click', closeSearchSuggestions);


document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearchSuggestions();
  }
});


function renderSuggestions(items, query) {

  // Если в живом поиске 0 товаров
  if (items.length === 0) {
    box.innerHTML = `
      <div class="no-results">
        <p>За запитом <strong>"${query}"</strong> нічого не знайдено.</p>
        <p>Спробуйте одну з категорій:</p>
        <div class="suggested-categories">
           <a href="category.html?category=shampoos">Шампуні</a>
           <a href="category.html?category=soaps">Мило</a>
           <a href="category.html?category=promo">Акції</a>
        </div>
      </div>
    `;
    box.style.display = 'block';
    return;
  }

  const chips = generateChips(query, items);

  box.innerHTML = `
    ${chips.length ? `
      <div class="chips">
        ${chips.map(c => `
          <button onclick="setSearch('${c}')">${c}</button>
        `).join('')}
      </div>
    ` : ''}

    <h6>Товари</h6>

    <div class="suggest-grid">
      ${items.map(p => `
        <a href="/product?slug=${p.id}" class="suggest-item">
          <img src="${p.image}">
          <div>
            <div>${p.name}</div>
            <strong>${p.price.current.toLocaleString()} ₴</strong>
          </div>
        </a>
      `).join('')}

      <a href="/search?q=${query}" class="suggest-all">
        Переглянути всі →
      </a>
    </div>
  `;

  box.style.display = 'block';
}


function setSearch(value) {
  searchInput.value = value;
  window.location.href = `search?q=${encodeURIComponent(value)}`;
}


function generateChips(query, products) {
  query = query.toLowerCase();
  const chips = new Set();

  products.forEach(p => {
    const words = p.name.toLowerCase().split(' ');

    words.forEach(w => {
      if (w.startsWith(query) && w.length > query.length) {
        chips.add(`${query} ${w}`);
      }
    });

    // по категории
if (p.category && p.category.includes(query)) {
    // Если ввели "шам", предложим просто "шампуні" (через мапинг или как в базе)
    chips.add(p.category); 
}
  });

  return Array.from(chips).slice(0, 6);
}

//Мобильный каталог
function triggerMobileMenu() {
    const mobileNavCatalogBtn = document.querySelectorAll('.mobile-nav .nav-item')[1];
    const menu = document.getElementById('catalog-menu-full');
    const triggerContainer = document.querySelector('.mobile-catalog-trigger-container');

    if (mobileNavCatalogBtn) {
        mobileNavCatalogBtn.click(); // Кликаем по нижней кнопке
    }

    // Ждем 50мс, чтобы класс 'active' успел добавиться или удалиться
    setTimeout(() => {
        if (menu && menu.classList.contains('active')) {
            // Меню открылось — скрываем кнопку
            triggerContainer.style.display = 'none';
        } else {
            // Меню закрылось — возвращаем кнопку
            triggerContainer.style.display = 'flex';
        }
    }, 3);
}

// ВАЖНО: Добавь это, чтобы кнопка возвращалась, если меню 
// закрыли кликом по самой нижней иконке напрямую
document.querySelectorAll('.mobile-nav .nav-item')[1].addEventListener('click', () => {
    const menu = document.getElementById('catalog-menu-full');
    const triggerContainer = document.querySelector('.mobile-catalog-trigger-container');
    
    setTimeout(() => {
        if (menu && !menu.classList.contains('active')) {
            triggerContainer.style.display = 'flex';
        } else {
            triggerContainer.style.display = 'none';
        }
    }, 50);
});


document.addEventListener('click', e => {
  const btn = e.target.closest('.card-btn');
  if (!btn) return;

  e.preventDefault();

  const productId = btn.dataset.id; // Берем ID из кнопки
  if (!productId) return;

  // 1. Ищем товар в ГЛОБАЛЬНОМ массиве (window.products), который ты наполнил из API
  // Используем String() для обоих, чтобы не было проблем "число vs строка"
  const product = (window.products || []).find(p => String(p.id) === String(productId));
  
  if (!product) {
    console.error('Товар не найден в window.products для ID:', productId);
    return;
  }

  // 2. Подготавливаем объект для корзины (выпрямляем цену)
  const productToCart = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price.current, // Передаем только число!
    image: product.image
  };

  // 3. Вызываем функцию из файла cart.js
  const inCartNow = addToCart(productToCart);
  
  // 4. Визуально обновляем кнопку
  updateCartButtonState(btn, inCartNow);
  
  // 5. Синхронизируем все такие же кнопки на странице
  syncCartButtons();
});

// Если функции updateCartButtonState еще нет в этом файле, добавь её:
export function updateCartButtonState(btn, inCart) {
  if (!btn) return;
  if (inCart) {
    btn.classList.add('in-cart');
    btn.innerHTML = `В кошику ✓`;
  } else {
    btn.classList.remove('in-cart');
    btn.innerHTML = `Додати <img src="img/trayy.png">`;
  }
}

export function syncCartButtons() {
  document.querySelectorAll('.card-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (id) {
  
      const inCart = typeof isInCart === 'function' ? isInCart(id) : false;
      updateCartButtonState(btn, inCart);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  syncCartButtons();
});


// window.catalogToggle = catalogToggle;
// window.closeCatalog = closeCatalog;
// window.triggerMobileMenu = triggerMobileMenu;
// window.setSearch = setSearch;
// window.closeSearchSuggestions = closeSearchSuggestions;
