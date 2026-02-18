/*
|--------------------------------------------------------------------------
| Переключение раскладки
|--------------------------------------------------------------------------
*/
export function switchLayout(text) {
  const layoutMap = {
    'q':'й','w':'ц','e':'у','r':'к','t':'е','y':'н','u':'г','i':'ш','o':'щ','p':'з',
    'a':'ф','s':'і','d':'в','f':'а','g':'п','h':'р','j':'о','k':'л','l':'д',
    'z':'я','x':'ч','c':'с','v':'м','b':'и','n':'т','m':'ь',

    'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p',
    'ф':'a','і':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l',
    'я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m'
  };

  return text
    .split('')
    .map(char => layoutMap[char.toLowerCase()] ?? char)
    .join('');
}

/*
|--------------------------------------------------------------------------
| Live search для автоподсказок
|--------------------------------------------------------------------------
*/
export async function liveSearch(query) {

  const normalized = query.toLowerCase().trim();
  if (!normalized || normalized.length < 2) return [];

  try {

    let res = await fetch(`/api/products?search=${encodeURIComponent(normalized)}`);
    let json = await res.json();
    let results = json.data || [];

    if (results.length === 0) {
      const switched = switchLayout(normalized);
      if (switched !== normalized) {
        res = await fetch(`/api/products?search=${encodeURIComponent(switched)}`);
        json = await res.json();
        results = json.data || [];
      }
    }

    return results.map(p => ({
      id: p.external_id ?? p.id,
      slug: p.external_id ?? p.id,
      name: p.name,
      image: p.images?.[0] ?? '/img/no-image.jpg',
      price: {
        current: Number(p.final_price ?? p.price ?? 0)
      }
    }));

  } catch (e) {
    console.error('Live search error:', e);
    return [];
  }
}