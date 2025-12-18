var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'My App',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  // Add default routes
  routes: [
    {
      path: '/prueba/',
      url: '/pages/pagina-1.html',
    },
    {
      path: '/planetas/',
      url: '/pages/planeta.html',
    },
  ],
  // ... other parameters
});

const virtualLists = {};
  
async function cargarDatos(tipo) {
  try {
    const BASE_URL = 'https://dragonball-api.com/api';
    let url = `${BASE_URL}/${tipo}?limit=10`;
    let items = [];

    while (url) {
      const res = await fetch(url);
      const data = await res.json();
      items.push(...data.items);
      url = data.links?.next || null;
    }

    const listId = `${tipo}-list`;
    const el = document.getElementById(listId);

    if (!el) {
      console.error(`No existe #${listId}`);
      return;
    }
    if (virtualLists[tipo]) {
      virtualLists[tipo].destroy();
    }

    virtualLists[tipo] = app.virtualList.create({
      el,
      items,
      height: 72,
      renderItem(item) {
        return `
          <li>
            <div class="item-content">
              <div class="item-media">
                <img src="${item.image}" width="50" />
              </div>
              <div class="item-inner">
                <div class="item-title">${item.name}</div>
              </div>
            </div>
          </li>
        `;
      },
    });

  } catch (err) {
    console.error('ERROR API', err);
  }
}


app.on('pageInit', function (page) {
  if (page.name === 'personajes') {
    cargarDatos('characters');
  }
  if(page.name === 'planetas') {
    cargarDatos('planets');
  }
});