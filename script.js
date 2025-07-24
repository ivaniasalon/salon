const servicios = [
    {
        nombre: "Manicure de lujo",
        descripcion: "Manicure profesional con esmaltes premium y decoración artística.",
        precio: 100,
        imagenes: [
            "Manicure/01.jpg",
            "Manicure/02.jpg",
        ]
    },
    {
        nombre: "Peinado glamoroso",
        descripcion: "Peinado elegante para eventos especiales y sesiones de fotos.",
        precio: 180,
        imagenes: [
            "Peinados/01.jpeg",
            "Peinados/02.jpg"
        ]
    },
    {
        nombre: "Coloración de cabello",
        descripcion: "Tintura profesional con productos de alta gama y asesoría personalizada.",
        precio: 250,
        imagenes: [
            "Coloración/01.jpg",
            "Coloración/02.webp"
        ]
    },
    {
        nombre: "Tratamiento facial",
        descripcion: "Limpieza profunda, hidratación y rejuvenecimiento facial.",
        precio: 220,
        imagenes: [
            "Tratamiento/01.jpeg",
            "Tratamiento/02.jpeg"
        ]
    }
];


function mostrarServicios() {
    const lista = document.getElementById('servicios-lista');
    lista.innerHTML = '';
    servicios.forEach(servicio => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-servicio';
        let imgHtml = '';
        if (servicio.imagen) {
            imgHtml = `<img src="${servicio.imagen}" alt="${servicio.nombre}" style="cursor:pointer" onclick="window.open('${servicio.imagen}','_blank')" onerror="this.onerror=null;this.src='https://via.placeholder.com/90x90?text=Servicio';">`;
        } else {
            imgHtml = `<img src="https://via.placeholder.com/90x90?text=Servicio" alt="${servicio.nombre}">`;
        }
        tarjeta.innerHTML = `
            ${imgHtml}
            <div class="nombre">${servicio.nombre}</div>
            <div class="descripcion">${servicio.descripcion}</div>
            <div class="precio">$${servicio.precio ? servicio.precio.toLocaleString('es-CO', { minimumFractionDigits: 0 }) : ''}</div>
        `;
        lista.appendChild(tarjeta);
    });
}




window.onload = mostrarServicios;

// Modal para mostrar imagen grande
function crearModalImagen() {
    let modal = document.createElement('div');
    modal.id = 'modal-imagen';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.style.cursor = 'pointer';
    modal.innerHTML = `
        <button id="modal-prev" style="position:absolute;left:5vw;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.7);border:none;border-radius:50%;width:40px;height:40px;font-size:2rem;cursor:pointer;">&#8592;</button>
        <img id="modal-img" src="" style="max-width:70vw;max-height:70vh;border-radius:24px;box-shadow:0 8px 32px #000;">
        <button id="modal-next" style="position:absolute;right:5vw;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.7);border:none;border-radius:50%;width:40px;height:40px;font-size:2rem;cursor:pointer;">&#8594;</button>
    `;
    modal.onclick = function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    document.body.appendChild(modal);
    return modal;
}

// Modifica mostrarServicios para usar el modal
function mostrarServicios() {
    const lista = document.getElementById('servicios-lista');
    lista.innerHTML = '';
    servicios.forEach(servicio => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-servicio';
        let imgHtml = '';
        let primeraImg = (servicio.imagenes && servicio.imagenes.length) ? servicio.imagenes[0] : "https://via.placeholder.com/90x90?text=Servicio";
        imgHtml = `<img src="${primeraImg}" alt="${servicio.nombre}" style="cursor:pointer" />`;
        tarjeta.innerHTML = `
            ${imgHtml}
            <div class="nombre">${servicio.nombre}</div>
            <div class="descripcion">${servicio.descripcion}</div>
            <div class="precio">$${servicio.precio ? servicio.precio.toLocaleString('es-CO', { minimumFractionDigits: 0 }) : ''}</div>
        `;
        // Evento para mostrar modal con navegación
        tarjeta.querySelector('img').onclick = function () {
            let modal = document.getElementById('modal-imagen');
            if (!modal) modal = crearModalImagen();
            let idx = 0;
            let imagenes = servicio.imagenes && servicio.imagenes.length ? servicio.imagenes : [this.src];
            const modalImg = modal.querySelector('#modal-img');
            modalImg.src = imagenes[idx];
            // Navegación
            modal.querySelector('#modal-prev').onclick = function (e) {
                e.stopPropagation();
                idx = (idx - 1 + imagenes.length) % imagenes.length;
                modalImg.src = imagenes[idx];
            };
            modal.querySelector('#modal-next').onclick = function (e) {
                e.stopPropagation();
                idx = (idx + 1) % imagenes.length;
                modalImg.src = imagenes[idx];
            };
        };
        lista.appendChild(tarjeta);
    });
}
