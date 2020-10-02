import { navigation } from 'nr1';

const handleClicks = e => {
  const target = e.target;
  if (target) {
    const href = target.getAttribute('href');
    if (href) {
      const urlParts = href.split('/');
      if (urlParts[0].toLowerCase() === 'nr:') {
        e.preventDefault();
        if (
          urlParts.length > 3 &&
          ['dashboard', 'entity'].indexOf(urlParts[2].toLowerCase()) > -1
        ) {
          navigation.openStackedEntity(urlParts[3]);
        }
      }
    }
  }
};

const addScripts = scripts => {
  if (!scripts || !scripts.length) return;
  scripts.map(script => {
    const existingScript = document.head.querySelector(`#${script.name}`);
    if (existingScript) existingScript.remove();
    const scriptElem = document.createElement('script');
    scriptElem.setAttribute('id', script.name);
    const scriptUrl = (script.url || '').trim();
    if (scriptUrl === '') {
      const scriptText = document.createTextNode(script.script);
      scriptElem.appendChild(scriptText);
    } else {
      scriptElem.src = script.url;
      scriptElem.onload = new Function(script.script);
    }
    document.head.appendChild(scriptElem);
  });
};

const emptyBoard = { queries: [], scripts: [], cards: [] };

const nextIndex = items => {
  const itemsLen = items.length;
  if (itemsLen) {
    const lastItem = items[itemsLen - 1];
    const lastIndex = parseInt(
      ((lastItem || {}).name || '0').replace(/\D/g, ''),
      10
    );
    return (lastIndex || 0) + 1;
  }
  return 1;
};

const encoded = async str => {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str)
  );
  return btoa(
    new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), '')
  );
};

const refreshRange = (val, type) => {
  const intervals = [0, 30, 60, 120, 300];
  let mapping;

  if (type === 'r2v') {
    mapping = intervals.reduce((acc, cur, idx) => ({ ...acc, [cur]: idx }), {});
  } else if (type === 'v2r') {
    mapping = intervals.reduce((acc, cur, idx) => ({ ...acc, [idx]: cur }), {});
  }

  return mapping ? mapping[val] : null;
};

export {
  handleClicks,
  addScripts,
  emptyBoard,
  nextIndex,
  encoded,
  refreshRange,
};
