document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('top-categories');
  const submenusEl = document.getElementById('top-submenus');

  if (!listEl || !submenusEl) return;

  const isMobile = () =>
    window.matchMedia('(max-width: 1022px)').matches;

  // ======================
  // 1️⃣ Загружаем категории
  // ======================
  const res = await fetch('/api/categories');
  const json = await res.json();
  const categories = json.data;

  // ======================
  // 2️⃣ Строим map + дерево
  // ======================
  const map = {};
  categories.forEach(c => {
    map[c.id] = { ...c, children: [] };
  });

  categories.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(map[c.id]);
    }
  });

  const parents = Object.values(map).filter(
    c => c.parent_id === null
  );

  // ======================
  // 🖥 DESKTOP
  // ======================
  function initDesktopCatalog() {
    listEl.innerHTML = '';
    submenusEl.innerHTML = '';

    // ЛЕВОЕ МЕНЮ
    parents.forEach(parent => {
      const li = document.createElement('li');
      li.dataset.id = parent.id;

      li.innerHTML = `<a href="/category?category=${parent.id}">${parent.name}</a>`;

      listEl.appendChild(li);
    });

    // ПРАВЫЕ ПОДМЕНЮ
    parents.forEach(parent => {
      const wrap = document.createElement('div');
      wrap.className = 'cat-menu-top';
      wrap.dataset.id = parent.id;
      wrap.style.display = 'none';

      const ul = document.createElement('ul');

      function walk(cat, depth = 0) {
        cat.children.forEach(child => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="/category?category=${child.id}">
              ${'— '.repeat(depth)}${child.name}
            </a>
          `;
          ul.appendChild(li);
          walk(child, depth + 1);
        });
      }

      walk(parent);
      wrap.appendChild(ul);
      submenusEl.appendChild(wrap);
    });

    // HOVER
    listEl.addEventListener('mouseover', e => {
      const li = e.target.closest('li');
      if (!li) return;

      const id = li.dataset.id;
      document.querySelectorAll('.cat-menu-top').forEach(el => {
        el.style.display = el.dataset.id === id ? 'block' : 'none';
      });
    });

    // инициализация hover из common.js
    if (typeof window.initTopCatalogHover === 'function') {
      window.initTopCatalogHover();
    }
  }

  // ======================
  // 📱 MOBILE (DRILL-DOWN)
  // ======================
  let currentParentId = null;
  let historyStack = [];

  function renderMobileLevel(parentId = null) {
    listEl.innerHTML = '';
    submenusEl.innerHTML = ''; // на мобилке не используем

    // BACK
    if (historyStack.length > 0) {
      const backLi = document.createElement('li');
      backLi.className = 'mobile-back';
      backLi.textContent = '← Назад';
      backLi.onclick = e => {
        e.preventDefault();
        e.stopPropagation();

        currentParentId = historyStack.pop() ?? null;
        renderMobileLevel(currentParentId);
      };
      listEl.appendChild(backLi);
    }

    const items = Object.values(map).filter(
      c => c.parent_id === parentId
    );

    items.forEach(cat => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#">${cat.name}</a>`;

      li.onclick = e => {
        e.preventDefault();
        e.stopPropagation();

        if (cat.children.length > 0) {
          historyStack.push(parentId);
          currentParentId = cat.id;
          renderMobileLevel(cat.id);
        } else {
          window.location.href = `/category?category=${cat.id}`;
        }
      };

      listEl.appendChild(li);
    });
  }

  function initMobileCatalog() {
    renderMobileLevel(null);
  }

  // ======================
  // 🚀 Запуск нужного режима
  // ======================
  if (isMobile()) {
    initMobileCatalog();
  } else {
    initDesktopCatalog();
  }

  // если пользователь повернул экран
  window.addEventListener('resize', () => {
    listEl.innerHTML = '';
    submenusEl.innerHTML = '';
    historyStack = [];
    currentParentId = null;

    if (isMobile()) {
      initMobileCatalog();
    } else {
      initDesktopCatalog();
    }
  });
});