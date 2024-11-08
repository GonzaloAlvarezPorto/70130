const ProductsDTO = require("../dto/products.dto");
const { productService } = require("../services");

class ProductsController {
    constructor() {
        this.service = productService;
    }

    createProduct = async (req, res) => {
        const productData = req.body;

        const { title, category, precio, stock } = productData;
        if (!title || !category || !precio || typeof precio !== 'number' || !stock || typeof stock !== 'number') {
            return res.status(400).json({
                message: "Todos los campos son obligatorios y deben ser válidos: title, category, price, stock"
            });
        }

        try {
            // Verificar si el producto ya existe por nombre
            const existingProduct = await this.service.getProduct({ title: productData.title });

            if (existingProduct) {
                return res.status(400).json({ message: "El producto ya existe" });
            }

            // Crear el producto si no existe
            const newProduct = await this.service.createProduct(productData);
            const productDTO = new ProductsDTO(newProduct);

            res.status(201).json({ message: "Producto creado", data: productDTO });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    };

    getProduct = async (req, res) => {
        const { pid } = req.params;
        try {
            const product = await this.service.getProduct({ _id: pid });
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            const productDTO = new ProductsDTO(product);

            res.json(productDTO);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.service.getProducts({});

            const productsDTO = products.map(product => new ProductsDTO(product));

            res.json(productsDTO)

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    updateProduct = async (req, res) => {
        const { pid } = req.params;
        let updatedData = req.body;

        try {
            const updatedProduct = await this.service.updateProduct(pid, updatedData);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const productDTO = new ProductsDTO(updatedProduct);

            res.json({ message: 'Producto actualizado con éxito' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params;

        try {
            const deletedProduct = await this.service.deleteProduct(pid);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const productDTO = new ProductsDTO(deletedProduct)

            res.json({ message: 'Producto eliminado correctamente', product: productDTO });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
}

module.exports = {
    ProductsController
};