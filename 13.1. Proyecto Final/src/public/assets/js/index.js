document.addEventListener("DOMContentLoaded", () => {
    // Botones de eliminar
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const productId = button.getAttribute("data-id");
            const confirmDelete = confirm("¿Seguro que deseas eliminar este producto?");
            if (!confirmDelete) return;

            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    button.parentElement.remove();
                    alert("Producto eliminado exitosamente.");
                } else {
                    alert("Error al eliminar el producto.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Error de conexión.");
            }
        });
    });

    // Modal de edición
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = button.getAttribute("data-id");
            const productTitle = button.getAttribute("data-title");
            const productCategory = button.getAttribute("data-category");
            const productPrice = button.getAttribute("data-precio");

            // Llenar los campos del modal con los valores actuales del producto
            document.getElementById("editTitle").value = productTitle;
            document.getElementById("editCategory").value = productCategory;
            document.getElementById("editPrecio").value = productPrice;

            // Mostrar el modal
            document.getElementById("editModal").style.display = "block";

            // Manejar el cierre del modal
            document.getElementById("closeModalButton").addEventListener("click", () => {
                document.getElementById("editModal").style.display = "none";
            });

            // Manejar el envío del formulario de edición
            const form = document.getElementById("editProductForm");
            form.onsubmit = async (e) => {
                e.preventDefault();
                const updatedTitle = document.getElementById("editTitle").value;
                const updatedCategory = document.getElementById("editCategory").value;
                const updatedPrice = document.getElementById("editPrecio").value;

                try {
                    const response = await fetch(`/api/products/${productId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: updatedTitle,
                            category: updatedCategory,
                            precio: updatedPrice
                        })
                    });

                    if (response.ok) {
                        alert("Producto actualizado exitosamente.");
                        document.getElementById("editModal").style.display = "none";
                        location.reload(); // Recargar la página para ver los cambios
                    } else {
                        alert("Error al actualizar el producto.");
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    alert("Error de conexión.");
                }
            };
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            
            try {
                const response = await fetch('/api/carts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                if (response.ok) {
                    console.log('Producto agregado al carrito');
                } else {
                    console.error('Error al agregar el producto al carrito');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        });
    });
});
