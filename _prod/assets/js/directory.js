(function () {

function sortObjectBy (items, key) {
  var objA;
  var objB;
  var objAKey;
  var objBKey;
  return Object.keys(items).sort(function (a, b) {
    objA = items[a];
    objB = items[b];
    objAKey = (objA[key] || '').toLowerCase();
    objBKey = (objB[key] || '').toLowerCase();
    if (objA[key] && objB[key]) {
      if (objAKey < objBKey) {
        return -1;
      }
      if (objAKey > objBKey) {
        return 1;
      }
    }
    return 0;
  });
}

function looksLikeAUrl (url) {
  url = (url || '').trim();
  return url.indexOf('http:') === 0 || url.indexOf('https:') === 0;
}

function coerceToSourceUrl (url) {
  if (!url) { return; }
  if (url.split('/').length - 1 === 1) {
    return 'https://github.com/' + url;
  }
}

window.requestAnimationFrame(function () {
  // Defer loading of web fonts.
  var fonts = [
    'https://code.cdn.mozilla.net/fonts/fira.css'
  ];
  var link;
  fonts.forEach(function (url) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
});

var xhr = new XMLHttpRequest();
xhr.addEventListener('load', directoryLoaded);
xhr.open('get', 'index.json');
xhr.send();

var body = document.body;
var content = document.querySelector('#content');

function directoryLoaded () {
  var data = JSON.parse(xhr.response || '{}');
  var objects = sortObjectBy(data.objects, 'title');
  var item;
  var li;
  var itemLink;
  var itemTitle;
  var itemAuthor;
  var itemAuthorName;
  var itemAuthorUrl;
  var itemAuthorLink;
  var itemDescription;
  var itemSource;
  var itemPost;

  content.insertAdjacentHTML('beforeend', '<ol class="directory__list"></ol>');

  var directoryList = document.querySelector('.directory__list');

  objects.forEach(function (key) {
    item = data.objects[key];

    li = document.createElement('li');
    li.className = 'directory__item';

    itemLink = document.createElement('a');
    itemLink.className = 'directory__item__link';
    itemLink.setAttribute('href', item.start_url);

    itemAuthor = document.createElement('span');
    itemAuthor.className = 'directory__item__author__by';

    if (typeof item.author === 'string') {
      itemAuthorName = item.author;
      itemAuthorUrl = item.author;
    } else if (typeof item.author === 'object') {
      itemAuthorName = item.author.name || item.author.url;
      itemAuthorUrl = item.author.url || item.author.name;
    }

    if (looksLikeAUrl(itemAuthorUrl)) {
      itemAuthorLink = document.createElement('a');
      itemAuthorLink.className = 'directory__item__author__link';
      itemAuthorLink.setAttribute('href', itemAuthorUrl);
    } else {
      itemAuthorLink = document.createElement('span');
      itemAuthorLink.className = 'directory__item__author__plain';
    }
    itemAuthorLink.className = 'directory__item__author__name';
    itemAuthorLink.textContent = itemAuthorName;

    itemTitle = document.createElement('span');
    itemTitle.className = 'directory__item__title';
    itemTitle.textContent = item.title;

    itemLink.appendChild(itemTitle);

    if (item.description) {
      itemDescription = document.createElement('span');
      itemDescription.className = 'directory__item__description';
      itemDescription.textContent = item.description;
      itemLink.insertAdjacentHTML('beforeend', itemDescription.outerHTML);
    }

    li.appendChild(itemLink);
    li.appendChild(itemAuthor);

    itemAuthor.textContent = 'by ';
    itemAuthor.insertAdjacentHTML('afterend', itemAuthorLink.outerHTML);

    if (item.source_url) {
      itemSource = document.createElement('a');
      itemSource.className = 'directory__item__source directory__item__sublink';
      itemSource.textContent = 'View source';
      itemSource.setAttribute('href', coerceToSourceUrl(item.source_url));
      li.appendChild(itemSource);
    }

    if (item.post_url) {
      itemPost = document.createElement('a');
      itemPost.className = 'directory__item__post directory__item__sublink';
      itemPost.textContent = 'Read post';
      itemPost.setAttribute('href', item.post_url);
      li.appendChild(itemPost);
    }

    directoryList.appendChild(li);
  });
}

})();
