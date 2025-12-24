// Adapté de /home/ajb/www/html/caf/js/main.js

// const a = (() => {
//     document.addEventListener('DOMContentLoaded', function () {
//         // en dure car la premiere page envoi sur rando du mardi. Si passage à toutes les activités mettre "#activites" comme hash
//         if (window.location.hash == "") window.location.hash = "#programme-RNDM"
//         hashArr = window.location.hash.spli   // let vls = {
//         //    course: {}, courses: [], idCourse: 0, inscritData: {}, participants: [], perso: {}
//         // }
//     })
//     /** traitement des swipe ecran */
//     const touchStart = (el) => {
//         el.addEventListener('touchstart', function (event) {
//             event.stopPropagation();
//             touchstartX = event.changedTouches[0].screenX;
//             touchstartY = event.changedTouches[0].screenY;
//         }, { passive: true }, false);
//     }
//     const touchEnd = (el) => {
//         el.addEventListener('touchend', function (event) {
//             event.stopPropagation();
//             touchendX = event.changedTouches[0].screenX;
//             touchendY = event.changedTouches[0].screenY;
//             processResult(this, handleGesture(), event);
//         }, false);
//     }
//     const handleGesture = () => {
//         let horizontalDifference = touchstartX - touchendX
//         let verticalDifference = touchstartY - touchendY
//         // Horizontal difference dominates
//         if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
//             if (horizontalDifference >= 50) {
//                 return 'Left';
//             } else if (horizontalDifference <= -50) {
//                 return 'Right';
//             }

//             // Verical or no difference dominates
//         } else {
//             if (verticalDifference >= 50) {
//                 return 'Up';
//             } else if (verticalDifference <= -50) {
//                 return 'Down';
//             }
//         }
//     }
//     const processResult = (el, gesture, event) => {
//         var classe = el.classList[0]
//         switch (classe) {
//             case 'card':
//                 switch (gesture) {
//                     // case 'Up' : document.getElementById('iInfo').classList.add('show'); break
//                     // case 'Left' : document.getElementById('iPart').classList.add('show'); break
//                     case 'Up': a.toggle('iInfo'); break
//                     case 'Left': a.toggle('iPart'); break
//                 }
//                 break
//             case 'tooltiptext':
//                 switch (gesture) {
//                     case 'Down': console.log(gesture, event.target.style);
//                         event.target.style.visibility = 'hidden'; break
//                 }
//                 break
//             case 'iPart':
//                 switch (gesture) {
//                     // case 'Right' : I.closeiPart(el); break
//                     case 'Right': a.toggle('iPart'); break
//                 }
//                 break
//         }
//     }
//     const swipeables = document.querySelectorAll('.tooltiptext')
//     for (let i = 0; i < swipeables.length; i++) {
//         touchStart(swipeables[i]); touchEnd(swipeables[i]);
//     }
//     const t = (elId) => {
//         document.getElementById(elId).classList.toggle('show')
//     }
//     return {
//         toggle: (value) => t(value)
//     }
// })()

const triggers = document.querySelectorAll('.tooltipText');
const panel = document.getElementById('note-panel');
const content = document.getElementById('note-content');

triggers.forEach(el => {
    el.addEventListener('click', () => {
        content.innerHTML = "<b>Note : </b>" + el.dataset.tip;
        panel.classList.add('visible');
        // touchStart(el); touchEnd(el);
    });
});

panel.addEventListener('click', e => {
    panel.classList.remove('visible');
    e.stopPropagation();
});

// Fermeture par clic extérieur
document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !e.target.classList.contains('tooltip')) {
        panel.classList.remove('visible');
    }
});

// Activation du pan+zoom
const element = document.getElementById('map-svg');
const panzoom = Panzoom(element, {
    maxScale: 8,
    minScale: 1,
    contain: 'outside'
});

// Activation du pinch-to-zoom sur mobile
document.getElementById('panzoom-container')
    .addEventListener('wheel', panzoom.zoomWithWheel);

// TOOLTIP
const tooltip = document.getElementById('tooltip');
const hotspots = document.querySelectorAll('.hotspot');

// hotspots.forEach(hs => {
//     hs.addEventListener('mousemove', e => {
//         tooltip.textContent = hs.dataset.label;
//         tooltip.style.opacity = 1;

//         tooltip.style.left = e.clientX + "px";
//         tooltip.style.top = e.clientY + "px";
//     });

//     hs.addEventListener('mouseleave', () => {
//         tooltip.style.opacity = 0;
//     });
// });

const Sidepanel = document.getElementById('side-panel');
const Sidecontent = document.getElementById('side-content');

// OUVERTURE + CHARGEMENT PAGE
document.querySelectorAll('.open-panel').forEach(link => {
    link.addEventListener('click', async e => {
        console.log(e)
        e.preventDefault();

        const page = link.dataset.page;
        console.log(page)
        // Chargement dynamique du HTML local
        try {
            const response = await fetch(page);
            Sidecontent.innerHTML = await response.text();
            console.log(Sidecontent)
        } catch (err) {
            Sidecontent.innerHTML = "<p>Erreur de chargement.</p>";
        }

        // Ouvrir le panneau
        Sidepanel.classList.add('visible');
    });
});

// SWIPE POUR FERMER
let startX = 0;

Sidepanel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

Sidepanel.addEventListener('touchmove', e => {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // si swipe vers la droite > 60px → fermer
    if (deltaX > 60) {
        Sidepanel.classList.remove('visible');
    }
});

// CLIQUE EN DEHORS (facultatif)
document.addEventListener('click', e => {
    if (Sidepanel.classList.contains('visible') &&
        !Sidepanel.contains(e.target) &&
        !e.target.classList.contains('open-panel')) {
        Sidepanel.classList.remove('visible');
    }
});


// const tooltip = document.getElementById('tooltip');
// const hotspots = document.querySelectorAll('.hotspot');

// hotspots.forEach(hs => {
//     hs.addEventListener('mousemove', e => {
//         tooltip.textContent = hs.dataset.label;
//         tooltip.style.opacity = 1;

//         // Position de la souris relative au conteneur
//         const rect = e.target.ownerSVGElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         tooltip.style.left = (rect.left + x) + "px";
//         tooltip.style.top = (y - 10) + "px";
//     });

//     hs.addEventListener('mouseleave', () => {
//         tooltip.style.opacity = 0;
//     });
// });