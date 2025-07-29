

const galeriaServicios = {
    'Servicios': [
        { foto: 'img/01.jpg', descripcion: 'Manicure y Pedicure' },
        { foto: 'img/02.jpeg', descripcion: 'Uñas acrílicas y gel' },
        { foto: 'img/03.jpg', descripcion: 'Peinados y cortes' },
        { foto: 'img/04.jpg', descripcion: 'Maquillaje' }
    ]
};
let categoriaActual = 'Servicios', pedidoServicios = [];

const renderServicios = () => {
    const cont = document.getElementById('lista-servicios');
    cont.innerHTML = galeriaServicios[categoriaActual].map((serv, i) => `
    <div class="servicio-card">
      <img src="${serv.foto}" alt="Servicio">
      <p>${serv.descripcion}</p>
      <button class="agregar-btn" data-idx="${i}">Agregar</button>
    </div>
  `).join('');
    cont.querySelectorAll('.agregar-btn').forEach(btn =>
        btn.onclick = e => agregarAlPedido(+btn.dataset.idx)
    );
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
};
