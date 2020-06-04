const version = "0.2";
const cacheName = `notifications-${version}`;

self.addEventListener('install', event => {

  var cachesToKeep = [cacheName];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cachesToKeep.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );

  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/notifications_manager/',
      ])
      .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {

  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true, ignoreVary: true}))
      .then(response => {
        console.log({response_defined:response!==undefined})

        if( isDataRequest(event.request.url) ){
          return fetch(event.request);
        }

        if(response!==undefined){
          return response
        }else{
          addCache(event.request.url);
          return fetch(event.request);
        }
      })
  );
});

function addCache(url_to_add){

  console.log(`have not saved ${url_to_add}`)

  if( !/^https?:\/\//.test(url_to_add) ){
    return // do not try to cache addons
  }
  
  caches.open(cacheName).then(cache => {
    return cache.addAll([
      url_to_add
    ])
    // .then(() => self.skipWaiting());
  })
}

function isDataRequest( url ){
  return /^https:\/\/node.andbrant.com/.test(url);
}

function removeCache(url_to_remove){
  throw new Error("removeCache not ready");
}
