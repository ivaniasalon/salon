// ...existing code...

const galeriaServicios = {
    'Servicios': [
        { fotos: ['img/01.jpg', 'img/05.webp', 'img/10.webp', 'img/11.jpeg', 'img/12.jpeg', 'img/13.jpg', 'img/14.jpg', 'img/15.jpg'], descripcion: 'Manicure y Pedicure' },
        { fotos: ['img/02.jpeg', 'img/06.jpeg', 'img/17.jpg', 'img/20.jpg', 'img/21.webp'], descripcion: 'Uñas acrílicas y gel' },
        { fotos: ['img/03.jpg', 'img/07.jpg', 'img/08.webp', 'img/16.png'], descripcion: 'Peinados y cortes' },
        { fotos: ['img/04.jpg', 'img/09.jpg', 'img/18.webp', 'img/19.png'], descripcion: 'Maquillaje' }
    ]
};
let categoriaActual = 'Servicios', pedidoServicios = [];

const renderServicios = () => {
    const cont = document.getElementById('lista-servicios');
    cont.innerHTML = galeriaServicios[categoriaActual].map((serv, i) => `
    <div class="servicio-card" data-idx="${i}">
      <div class="servicio-img-wrap">
        <img src="${serv.fotos[0]}" alt="Servicio" class="servicio-img img-a" style="opacity:1;">
        <img src="${serv.fotos[1] || serv.fotos[0]}" alt="Servicio" class="servicio-img img-b" style="opacity:0;">
      </div>
      <p>${serv.descripcion}</p>
      <button class="agregar-btn" data-idx="${i}">Agregar</button>
    </div>
  `).join('');
    cont.querySelectorAll('.agregar-btn').forEach(btn =>
        btn.onclick = e => agregarAlPedido(+btn.dataset.idx)
    );
    iniciarCarruselesImagenes();
}

// Cambia las imágenes de cada tarjeta automáticamente entre sus propias fotos
function iniciarCarruselesImagenes() {
    galeriaServicios[categoriaActual].forEach((serv, i) => {
        if (!serv.fotos || serv.fotos.length < 2) return;
        let idxImg = 0;
        const card = document.querySelector(`.servicio-card[data-idx='${i}']`);
        if (!card) return;
        // Elimina imágenes previas
        const imgWrap = card.querySelector('.servicio-img-wrap');
        imgWrap.innerHTML = '';
        // Crea todas las imágenes y las apila
        const imgs = serv.fotos.map((src, j) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Servicio';
            img.className = 'servicio-img';
            img.style.position = 'absolute';
            img.style.left = 0;
            img.style.top = 0;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.opacity = j === 0 ? 1 : 0;
            img.style.transition = 'opacity 2s';
            imgWrap.appendChild(img);
            return img;
        });
        let interval, timeout;
        function showNext() {
            const prev = idxImg;
            idxImg = (idxImg + 1) % imgs.length;
            imgs[idxImg].style.transition = 'opacity 2s';
            imgs[prev].style.transition = 'opacity 2s';
            imgs[idxImg].style.opacity = 1;
            imgs[prev].style.opacity = 0;
            timeout = setTimeout(() => {
                showNext();
            }, 5000); // 3s visible + 2s transición
        }
        function startLoop() {
            // Inicializa todas en 0 excepto la actual
            imgs.forEach((img, j) => img.style.opacity = j === idxImg ? 1 : 0);
            timeout = setTimeout(() => {
                showNext();
            }, 3000); // 3s visible antes de empezar la transición
        }
        function stopLoop() {
            if (timeout) clearTimeout(timeout);
        }
        startLoop();
        // Pausar con mouse/touch
        imgWrap.onmousedown = stopLoop;
        imgWrap.ontouchstart = stopLoop;
        // Reanudar con mouseup/touchend/mouseleave
        imgWrap.onmouseup = startLoop;
        imgWrap.ontouchend = startLoop;
        imgWrap.onmouseleave = startLoop;
    });
};

const agregarAlPedido = idx => {
    const servicio = galeriaServicios[categoriaActual][idx];
    if (!pedidoServicios.includes(servicio)) {
        pedidoServicios.push(servicio);
        renderPedido();
    }
};

const renderPedido = () => {
    let pedidoDiv = document.getElementById('pedido-servicios');
    if (!pedidoDiv) {
        pedidoDiv = document.createElement('div');
        pedidoDiv.id = 'pedido-servicios';
        // Solo insertamos el div, no el botón, ya que el botón está fijo en el HTML
        document.querySelector('main').insertBefore(pedidoDiv, document.getElementById('btn-wsp'));
    }
    pedidoDiv.innerHTML = pedidoServicios.length
        ? `<strong>Servicios seleccionados:</strong><ul>${pedidoServicios.map((s, i) => `<li>${s.descripcion} <button class='btn-quitar' onclick='eliminarDelPedido(${i})'>Quitar</button></li>`).join('')}</ul>`
        : '<em>No has agregado servicios aún.</em>';
};

const eliminarDelPedido = idx => {
    pedidoServicios.splice(idx, 1);
    renderPedido();
};

const enviarWhatsApp = () => {
    if (!pedidoServicios.length) return alert('Por favor selecciona al menos un servicio antes de enviar tu pedido por WhatsApp.');
    const plural = pedidoServicios.length > 1;
    const msg = `Hola, quiero agendar ${plural ? 'estos servicios' : 'este servicio'}:%0A` + pedidoServicios.map(s => `- ${s.descripcion}%0A`).join('');
    window.open(`https://wa.me/50588282598?text=${msg}`);
};


window.onload = () => {
    renderServicios();
    renderPedido();
    // Asignar evento al botón de WhatsApp si existe
    const btnWsp = document.getElementById('btn-wsp');
    if (btnWsp) btnWsp.onclick = enviarWhatsApp;
    // Advertir si hay servicios agregados al intentar cerrar/recargar
    window.addEventListener('beforeunload', function (e) {
        if (pedidoServicios.length > 0) {
            setTimeout(() => {
                const pedidoDiv = document.getElementById('pedido-servicios');
                if (pedidoDiv) pedidoDiv.scrollIntoView({ behavior: 'smooth' });
            }, 0);
            const mensaje = 'Tienes servicios agregados. ¿Quieres enviarlos por WhatsApp antes de salir?';
            e.preventDefault();
            e.returnValue = mensaje;
            return mensaje;
        }
    });
};
