
let productos = [];
let carrito = [];

localStorage.setItem('productos', JSON.stringify(productos));

const selectProductos = document.querySelector('#productos');
const btnAgregar = document.querySelector('#agregar');

function traerItemsStorage() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
}

function traerCarrito() {
    fetch('./carritoNuevo.json')
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((planilla) => {
        productos = planilla
        popularDropdown();
        
    })
}

function popularDropdown() {
    productos.forEach(({nombre,precio}, index) => { 
        const option = document.createElement('option');
        option.textContent = `${nombre} - $${precio}`;
        option.value = index; 
        selectProductos.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    traerCarrito();
    traerItemsStorage();
    dibujarTabla();

    btnAgregar.addEventListener('submit', (e) => {
        e.preventDefault();
        const productoSeleccionado = productos.find((item,index) => index === +selectProductos.value);
        if (productoSeleccionado === undefined) {
            alert('Usted primero debe seleccionar un producto');
            return;
        }
        const indiceCarrito = carrito.findIndex((item) => item.producto.nombre === productoSeleccionado.nombre);

        if (indiceCarrito !== -1) { 
            carrito[indiceCarrito].cantidad++;
        }else {
            const item = new Item(productoSeleccionado,1);
            carrito.push(item);
        }

        localStorage.setItem('carrito',JSON.stringify(carrito)); 
        dibujarTabla();
    })

})




function dibujarTabla() {
    const bodyTabla = document.getElementById('items');
    const total = document.querySelector('#total');
    bodyTabla.innerHTML = ``; 
    carrito.forEach((item,index) => {
        const {producto: {nombre:nombrecin,precio}, cantidad} = item;
        bodyTabla.innerHTML = bodyTabla.innerHTML +  `
        <tr class="text-white">
            <td>${nombrecin || ''}</td>
            <td>$${precio || ''}</td>
            <td>${cantidad || ''}</td>
            <td>${cantidad * precio || 0}</td>
            <td>
                <button id="item-${index}" class="btn btn-danger">Remove</button>
            </td>
        </tr>
    `;
        document.querySelector(`#item-${index}`).addEventListener('click', () => {
            carrito.splice(index,1);
            dibujarTabla();
            localStorage.setItem('carrito', JSON.stringify(carrito));
        });

    });
    total.textContent = carrito.reduce((acc,item) => acc + item.producto.precio*item.cantidad , 0);
}




