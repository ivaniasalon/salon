// Ventana flotante de chat con WhatsApp y TikTok
function crearVentanaChat() {
    if (document.getElementById('ventana-chat')) return;
    const div = document.createElement('div');
    div.id = 'ventana-chat';
    div.style.position = 'fixed';
    div.style.right = '2.2em';
    div.style.bottom = '2.2em';
    div.style.zIndex = '9999';
    div.style.background = 'rgba(255,255,255,0.98)';
    div.style.borderRadius = '1.5em';
    div.style.boxShadow = '0 5px 20px #e573b355';
    div.style.padding = '0.7em 1.2em 0.7em 1.2em';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '1.1em';
    div.style.transition = 'opacity 0.3s, transform 0.2s';
    div.style.opacity = '1';
    div.style.cursor = 'pointer';
    // WhatsApp
    const btnWsp = document.createElement('button');
    btnWsp.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:2.1em;height:2.1em;vertical-align:middle;">';
    btnWsp.style.background = 'none';
    btnWsp.style.border = 'none';
    btnWsp.style.cursor = 'pointer';
    btnWsp.title = 'Chatea por WhatsApp';
    btnWsp.onclick = function (e) {
        e.stopPropagation();
        window.open('https://wa.me/50558805307', '_blank');
    };
    // TikTok
    const btnTiktok = document.createElement('button');
    btnTiktok.innerHTML = '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style="width:2.1em;height:2.1em;vertical-align:middle;filter:invert(0.1) grayscale(0.2);">';
    btnTiktok.style.background = 'none';
    btnTiktok.style.border = 'none';
    btnTiktok.style.cursor = 'pointer';
    btnTiktok.title = 'Ver TikTok de la empresa';
    btnTiktok.onclick = function (e) {
        e.stopPropagation();
        window.open('https://www.tiktok.com/@jen_yehu', '_blank'); // Cambia el usuario por el de la empresa
    };
    div.appendChild(btnWsp);
    div.appendChild(btnTiktok);
    document.body.appendChild(div);
}

function actualizarVentanaChat() {
    const chat = document.getElementById('ventana-chat');
    const btnWsp = document.getElementById('btn-wsp');
    if (!chat || !btnWsp) return;
    // Si el botón de WhatsApp está visible en el viewport, ocultar la ventana de chat
    const rect = btnWsp.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    chat.style.opacity = visible ? '0' : '1';
    chat.style.pointerEvents = visible ? 'none' : 'auto';
}

window.addEventListener('scroll', actualizarVentanaChat);
window.addEventListener('resize', actualizarVentanaChat);


const galeriaServicios = {
    'Servicios': [
        { fotos: ['img/01.jpg', 'img/05.webp'], descripcion: 'Manicure y Pedicure' },
        { fotos: ['img/02.jpeg', 'img/06.jpeg'], descripcion: 'Uñas acrílicas y gel' },
        { fotos: ['img/03.jpg', 'img/07.jpg', 'img/08.webp'], descripcion: 'Peinados y cortes' },
        { fotos: ['img/04.jpg', 'img/09.jpg'], descripcion: 'Maquillaje' }
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
        const imgA = card.querySelector('.img-a');
        const imgB = card.querySelector('.img-b');
        if (!imgA || !imgB) return;
        if (serv._interval) clearInterval(serv._interval);
        imgA.style.opacity = 1;
        imgB.style.opacity = 0;
        imgA.src = serv.fotos[0];
        imgB.src = serv.fotos[1] || serv.fotos[0];
        let mostrarA = false;
        function startInterval() {
            serv._interval = setInterval(() => {
                const nextIdx = (idxImg + 1) % serv.fotos.length;
                if (mostrarA) {
                    // imgA va a mostrar la siguiente imagen
                    imgA.src = serv.fotos[nextIdx];
                    imgA.style.transition = 'opacity 2.5s';
                    imgB.style.transition = 'opacity 2.5s';
                    imgA.style.opacity = 1;
                    imgB.style.opacity = 0;
                } else {
                    // imgB va a mostrar la siguiente imagen
                    imgB.src = serv.fotos[nextIdx];
                    imgA.style.transition = 'opacity 2.5s';
                    imgB.style.transition = 'opacity 2.5s';
                    imgA.style.opacity = 0;
                    imgB.style.opacity = 1;
                }
                idxImg = nextIdx;
                mostrarA = !mostrarA;
            }, 5500);
        }
        function stopInterval() {
            if (serv._interval) clearInterval(serv._interval);
        }
        startInterval();
        const imgWrap = card.querySelector('.servicio-img-wrap');
        // Pausar con mouse/touch
        imgWrap.onmousedown = stopInterval;
        imgWrap.ontouchstart = stopInterval;
        // Reanudar con mouseup/touchend/mouseleave
        imgWrap.onmouseup = startInterval;
        imgWrap.ontouchend = startInterval;
        imgWrap.onmouseleave = startInterval;
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
        document.querySelector('main').insertBefore(pedidoDiv, document.querySelector('#contacto'));
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
    window.open(`https://wa.me/50558805307?text=${msg}`);
};


window.onload = () => {
    renderServicios();
    renderPedido();
    const btnWsp = document.getElementById('btn-wsp');
    if (btnWsp) btnWsp.onclick = enviarWhatsApp;
    crearVentanaChat();
    actualizarVentanaChat();
    // Advertir si hay servicios agregados al intentar cerrar/recargar
    window.addEventListener('beforeunload', function (e) {
        if (pedidoServicios.length > 0) {
            // Scroll al área de servicios agregados y WhatsApp
            setTimeout(() => {
                const pedidoDiv = document.getElementById('pedido-servicios');
                if (pedidoDiv) pedidoDiv.scrollIntoView({ behavior: 'smooth' });
                const btnWsp = document.getElementById('btn-wsp');
                if (btnWsp) btnWsp.scrollIntoView({ behavior: 'smooth' });
            }, 0);
            // Mensaje personalizado (algunos navegadores solo muestran el mensaje por defecto)
            const mensaje = 'Tienes servicios agregados. ¿Quieres enviarlos por WhatsApp antes de salir?';
            e.preventDefault();
            e.returnValue = mensaje;
            return mensaje;
        }
    });
};
