'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/fonts/MaterialIcons-Regular.otf": "d259da3d8fb289f014755eaeac3f707e",
"assets/assets/dishes/default.png": "5bbc7e65473a7d48ef6ecc1ad9d5e9cd",
"assets/assets/others/visa.png": "ecd1f2d7cdb379d8534e12d263e2b599",
"assets/assets/others/star.png": "7c5fe617d85b83b0d4774307ca0eece3",
"assets/assets/logo.png": "1dcbf7287cb59f8745761d777a89a738",
"assets/assets/data.json": "f11bb86058a9fb34e09a6bab639cd7de",
"assets/assets/banners/banner_splash.png": "265f8ff71940ee8fafc179e7013854ec",
"assets/assets/banners/banner_promo.png": "33a2b618f9c3fa4f52e4d44e0692dc18",
"assets/assets/restaurants/donutz.png": "369f2cad9c5b1f1c3961e0f602b5bc7a",
"assets/assets/restaurants/panda-sushi.png": "69feef4b1b748a1acc2b82621c55b3dc",
"assets/assets/restaurants/cabron-mexicano.png": "40d3af02bd31f77b3f8ce2e3e23c784e",
"assets/assets/restaurants/monstro-burguer.png": "be40a27c4f9f5af6df8d98f3f8e2639c",
"assets/assets/restaurants/foodcourt-natural.png": "d3ae03d17b0e857e256f1a5b1c975eff",
"assets/assets/categories/bebidas.png": "2f8b1b120483f9bd179da69c93a5205e",
"assets/assets/categories/sobremesas.png": "92ace5bd4b44e05160a04c1933b8b696",
"assets/assets/categories/massas.png": "aab12f016571e54f67befd56a20c2fcb",
"assets/assets/categories/principais.png": "1b7cd179f75f187eed35067ad08b4a54",
"assets/assets/categories/petiscos.png": "1be3adb84cf0f4c46cb73ab86e1a0869",
"assets/AssetManifest.json": "f2ffd6b8d8346df93802d02afd8bd6bf",
"assets/AssetManifest.bin.json": "e3079d3a1b200a1c8e242ff755bcd5ab",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "8cb8ba46d256455b019d1f2317ed9ae5",
"assets/NOTICES": "4aeefbb00040d3dabde0bb9d5c705b7b",
"flutter_bootstrap.js": "fa70613bfb6224059f3782ca60671e58",
"main.dart.js": "2ac715fcc7e871434835536902bdc0b0",
"version.json": "389a6e6e6f34312743ca5f36467c84b5",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"manifest.json": "56128fc6ec7568b99d6fc24cfa34a218",
"index.html": "461ea0ba76df527babd16c414d0d441e",
"/": "461ea0ba76df527babd16c414d0d441e",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/canvaskit.js.symbols": "ff204c6b77c9e5969d85d9bfbaa0c843",
"canvaskit/canvaskit.js": "de27f912e40a372c22a069c1c7244d9b",
"canvaskit/skwasm_st.wasm": "3179a61ea4768a679dbbe30750d75214",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/canvaskit.wasm": "2e9895626fe95683569ed951214f1eb8",
"canvaskit/chromium/canvaskit.js.symbols": "85275e659470daa080e014ffe17a1a59",
"canvaskit/chromium/canvaskit.js": "73343b0c5d471d1114d7f02e06c1fdb2",
"canvaskit/chromium/canvaskit.wasm": "86233631b867ce8f74c2020077650d11",
"canvaskit/skwasm.wasm": "c528f7ba97a317e25e547ea47c8a66d8",
"canvaskit/skwasm.js.symbols": "c7cf698f802bc5e9e8e791f762ebdfe9",
"canvaskit/skwasm_st.js.symbols": "a564f5dfbd90292f0f45611470170fe1"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
