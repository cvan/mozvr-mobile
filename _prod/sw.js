(function () {

importScripts('/assets/js/lib/sw-toolbox/sw-toolbox.js');

global.toolbox.options.debug = true;

global.toolbox.preCacheItems = [
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/directory.js',
  '/assets/js/ga.js',
  '/assets/img/icon-goggles.svg',
  '/assets/img/logo-mozilla.svg',
  '/assets/img/bg.jpg'
];

global.toolbox.router.default = global.toolbox.networkFirst;

// On install, cache resources and skip waiting so the Service Worker takes
// control of the page ASAP.
global.addEventListener('install', e => e.waitUntil(global.skipWaiting());

// On activation, delete any old caches and start controlling the clients
// without waiting for them to reload.
global.addEventListener('activate', e => e.waitUntil(global.clients.claim()));

})();
