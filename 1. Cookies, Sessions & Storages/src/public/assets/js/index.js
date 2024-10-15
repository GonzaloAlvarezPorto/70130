// client.js
const socket = io();

// Solicitar productos al cargar la página
socket.emit('requestProducts');

// Escuchar actualizaciones de productos
socket.on('productosNuevos', data => {
    let log = document.querySelector('#productosNuevos');
    let productsHTML = '';


    data.forEach(product => {
        productsHTML += `<div id="fichaProducto">
                            <h3>${product._id}</h3>
                            <p>Nombre producto: ${product.title}</p>
                            <p>Precio producto: ${product.precio}</p>
                        </div>`;
    });

    if (log) {
        log.innerHTML = productsHTML;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.querySelector('#productForm');

    if (productForm) {
        productForm.addEventListener('submit', event => {
            const productTitle = document.querySelector('#productTitle').value;
            const productPrecio = document.querySelector('#productPrecio').value;
            const productCategory = document.querySelector('#productCategory').value;
            event.preventDefault();

            fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: productTitle, precio: productPrecio, category: productCategory })
            })
                .then(response => response.json())
                .then(result => {
                    console.log('Producto agregado:', result);


                    productForm.reset();


                    socket.emit('requestProducts');
                })
                .catch(error => console.error('Error al agregar el producto:', error));
        });
    }

    document.querySelectorAll('.deleteProduct').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');

            fetch(`/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    console.log('Producto eliminado:', result);

                    socket.emit('requestProducts');
                })
                .catch(error => console.error('Error al eliminar el producto:', error));
        });
    });

    const carrito = []; // Array para almacenar los productos

    // Función para manejar el clic en "Agregar al carrito"
    const handleAddToCart = (event) => {
        const button = event.target;

        if (button.classList.contains('agregarAlCarrito')) {
            const product = {
                id: button.getAttribute('data-id'),
                title: button.getAttribute('data-title'),
                precio: button.getAttribute('data-precio'),
                category: button.getAttribute('data-category')
            };

            // Agregar el producto al array del carrito
            carrito.push(product);

            // Mostrar el carrito en la consola
            console.log('Carrito:', carrito);
        }
    };

    // Añadir el event listener a los botones de agregar al carrito
    document.addEventListener('click', handleAddToCart);

    const sendCartToServer = async () => {
        try {
            const response = await fetch('/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products: carrito.map(p => ({ id: p.id, quantity: 1 })) }) // Ajusta los datos que envías
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            // Limpiar el carrito después de enviar
            carrito.length = 0; // Vaciar el array
            console.log('Carrito después de enviar:', carrito);
        } catch (error) {
            console.error('Error al enviar el carrito al servidor:', error);
        }
    };

    document.getElementById('sendCartButton').addEventListener('click', sendCartToServer);
});