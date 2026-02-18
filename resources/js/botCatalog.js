document.addEventListener('DOMContentLoaded', () => {
    fetch('http://phpsite.test/api/categories')
        .then(res => res.json())
        .then(response => {
            const categories = response.data;
            const tree = buildTree(categories);
            renderMenu(tree);
        });
});

// 1. Превращаем плоский список в дерево
function buildTree(items) {
    const tree = [];
    const mappedArr = {};

    // Сначала создаем мапу, где ключ - это ID
    items.forEach(item => {
        mappedArr[item.id] = { ...item, children: [] };
    });

    for (const id in mappedArr) {
        const item = mappedArr[id];
        if (item.parent_id) {
            // Если есть родитель, пушим текущий элемент в детей родителя
            if (mappedArr[item.parent_id]) {
                mappedArr[item.parent_id].children.push(item);
            }
        } else {
            // Если родителя нет - это корневой элемент
            tree.push(item);
        }
    }
    return tree;
}

// 2. Отрисовываем меню
function renderMenu(tree) {
    const mainList = document.getElementById('main-categories-list');
    const subContainer = document.getElementById('submenus-container');
    const overlay = document.getElementById('overlay');
    
    if (!mainList || !subContainer) return;

    mainList.innerHTML = '';
    subContainer.innerHTML = '';

    tree.forEach((parent) => {
        // 1. Главный пункт 
        const li = document.createElement('li');
        li.className = 'has-menu';
        li.innerHTML = `<a href="/category?category=${parent.id}">${parent.name}</a>`;
        mainList.appendChild(li);

        // 2. Блок подменю
        let subDiv = null;
        if (parent.children.length > 0) {
            subDiv = document.createElement('div');
            subDiv.className = 'cat-menu';
            
            const ul = document.createElement('ul');

            parent.children.forEach(child => {
                // Сначала добавляем заголовок группы (например, "Столові прибори")
                let childHtml = `<li><a href="/category?category=${child.id}" style="font-weight: bold; display: block; margin-top: 10px;">${child.name}</a></li>`;
                
                // Если внутри приборов есть Вилки/Ложки (3-й уровень)
                if (child.children && child.children.length > 0) {
                    child.children.forEach(subChild => {
                        childHtml += `<li class="sub-child" style="padding-left: 15px;"><a href="/category?category=${subChild.id}">${subChild.name}</a></li>`;
                    });
                }
                ul.innerHTML += childHtml;
            });
            // ----------------------------------

            subDiv.appendChild(ul);
            subContainer.appendChild(subDiv);
        }

        // 3. Логика наведения
        li.addEventListener('mouseenter', () => {
            subContainer.classList.add('active');
            if (overlay) overlay.classList.add('active');
            
            document.querySelectorAll('.submenus .cat-menu').forEach(m => m.classList.remove('active'));
            if (subDiv) {
                subDiv.classList.add('active');
            }
        });
    });

    // 4. Логика ухода мышки
    document.querySelector('.catal-hover')?.addEventListener('mouseleave', () => {
        subContainer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.submenus .cat-menu').forEach(m => m.classList.remove('active'));
    });
}