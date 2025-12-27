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
console.log(typeof (element), panzoom)

// Activation du pinch-to-zoom sur mobile
document.getElementById('panzoom-container')
    .addEventListener('wheel', panzoom.zoomWithWheel);

// TOOLTIP
const tooltip = document.getElementById('tooltip');
const hotspots = document.querySelectorAll('.hotspot');
const Sidepanel = document.getElementById('side-panel');
const Sidecontent = document.getElementById('side-content');

hotspots.forEach(hs => {
    // let panzoomInstances = []
    hs.addEventListener('click', async e => {
        e.preventDefault();
        const page = hs.dataset.page;
        console.log(page)
        // Chargement dynamique du HTML local
        try {
            const response = await fetch(page);
            Sidecontent.innerHTML = await response.text();
            // Ouvrir le panneau
            Sidepanel.classList.add('visible');
            Sidepanel.scroll(0, 0)
            setTimeout(() => panel.classList.add('open'), 10); // laisse le DOM être affiché
            const els = Sidecontent.querySelectorAll('.map-svg-pnl')
            console.log(els)
            initPanZoom(els, 1);
        } catch (err) {
            Sidecontent.innerHTML = "<p>Erreur de chargement.</p>";
        }
    });
});


function initPanZoom(els, startScale) {
    // const elements = content.querySelectorAll('.needs-panzoom'); // classe mise dans panel-content.html
    console.log(els, startScale)
    els.forEach((el) => {
        const pz = Panzoom(el, {
            maxScale: 6,
            minScale: 0.6,
            startScale: startScale,
            contain: 'outside',
        });
        document.getElementById('panzoom-container').addEventListener('wheel', pz.zoomWithWheel);
        console.log(typeof (el))
        // panzoomInstances.push(pz);
    });
}


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