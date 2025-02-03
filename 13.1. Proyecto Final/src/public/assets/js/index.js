const socketConnection = io();

// Solicitar productos al cargar la página
socketConnection.emit('requestProducts');

// Escuchar actualizaciones de productos
socketConnection.on('productosNuevos', data => {
    let log = document.querySelector('#productosNuevos');
    let productsHTML = '';


    data.forEach(product => {
        productsHTML += `<div id="fichaProducto">
                            <h3>${product._id}</h3>
                            <p>Nombre producto: ${product.title}</p>
                            <p>Precio producto: ${product.price}</p>
                        </div>`;
    });

    if (log) {
        log.innerHTML = productsHTML;
    }
});

async function deleteProduct(productId) {
    console.log(productId);
    const confirmation = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmation) return; // Cancela si el usuario no confirma

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert("Producto eliminado correctamente");
            location.reload(); // Recarga la página para reflejar los cambios
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Error al eliminar el producto");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar la solicitud");
    }
}