console.log("hello depuis le service worker");

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);
});

self.addEventListener('activate', (evt) => {
    console.log(`sw activé à ${new Date().toLocaleTimeString()}`); 
  
    // 5.4 Supprimer les anciennes instances de cache
    let cacheCleanPromise = caches.keys().then(keys => {
        keys.forEach(key => {            
            if(key !== cacheName){
                caches.delete(key);
            }
        });
    });

    evt.waitUntil(cacheCleanPromise);
});

self.addEventListener('fetch', (evt) => {
    console.log('sw intercepte la requête suivante via fetch', evt);
    console.log('url interceptée', evt.request.url);
});

//..
self.addEventListener('fetch', (evt) => {
    if(!navigator.onLine) {
        const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'} };
        evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers));
    }

    // console.log('sw intercepte la requête suivante via fetch', evt);
    console.log('url interceptée', evt.request.url);


    // 5.1 Stratégie : cache only with network callback
    evt.respondWith(
    
        caches.match(evt.request)
            .then(cachedResponse => {   
                if (cachedResponse) {
               		// identification de la requête trouvée dans le cache
                    console.log("url depuis le cache", evt.request.url);
                    return cachedResponse;
                }

                // 5.1 Stratégie de cache
                return fetch(evt.request).then(
                    // On récupère la requête
                    function(newResponse) {
                    	// identification de la requête ajoutée au cache
                        console.log("url depuis le réseau et mise en cache", evt.request.url);
                        
                        // Accès au cache
                        caches.open(cacheName).then(
                            function(cache){
                                // ajout du résultat de la requête au cache
                                cache.put(evt.request, newResponse);
                            }
                        );
                        // Utilisation de clone car on ne peut utiliser qu'une fois la réponse
                        return newResponse.clone();
                    }
                )
            }
        )
    );
});
    

    // if(!navigator.onLine) {
    //     const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'} };
    //     evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers));
    // }

    // console.log('sw intercepte la requête suivante via fetch', evt);
    // console.log('url interceptée', evt.request.url);


    // // 5.1 Stratégie : cache only with network callback
    // evt.respondWith(
    //     caches.match(evt.request)
    //         .then(cachedResponse => {   
    //             if (cachedResponse) {
    //                 // 5.2 identification de la requête trouvée dans le cache
    //                 console.log("url depuis le cache", evt.request.url);

    //                 return cachedResponse;
    //             }

    //             // 5.1 Stratégie de cache
    //             return fetch(evt.request).then(
    //                 // On récupère la requête
    //                 function(newResponse) {
    //                     // 5.2 identification de la requête ajoutée au cache
    //                     console.log("url depuis le réseau et mise en cache", evt.request.url);

    //                     // Accès au cache
    //                     caches.open(cacheName).then(
    //                         function(cache){
    //                             // ajout du résultat de la requête au cache
    //                             cache.put(evt.request, newResponse);
    //                         }
    //                     );
    //                     // Utilisation de clone car on ne peut utiliser qu'une fois la réponse
    //                     return newResponse.clone();
    //                 }
    //             )
    //         }
    //     )
    // );
	
// 7.3 Notifications persistantes (envoyées depuis le service worker)
// Affichage de la notification
self.registration.showNotification("Notification du SW", {
    body:"je suis une notification dite persistante"
})
 
// Ecoute de l'événement close
self.addEventListener("notificationclose", evt => {
    console.log("Notification fermée", evt);
})

// 7.3 Notifications persistantes (envoyées depuis le service worker)
self.registration.showNotification("Notification du SW", {
    body:"je suis une notification dite persistante",
  
    // 7.4 Options de notifications grâce aux actions
    actions:[
        {action:"accept", title:"accepter"},
        {action: "refuse", title: "refuser"}
    ]
})

// 7.4 Options de notifications grâce aux actions
// Ecouteur au clic d'un des deux boutons de la notification
self.addEventListener("notificationclick", evt => {
    console.log("notificationclick evt", evt);
    if(evt.action === "accept"){
        console.log("vous avez accepté");
    } else if(evt.action === "refuse"){
        console.log("vous avez refusé");
    } else{
        console.log("vous avez cliqué sur la notification (pas sur un bouton)");
    }
})
const cacheName = 'veille-techno' + '1.2';

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);

    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
        .then(console.log('cache initialisé'))
        .catch(console.err);
    });

    evt.waitUntil(cachePromise);

});

//..


//...