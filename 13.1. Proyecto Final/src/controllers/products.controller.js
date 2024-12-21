const ProductsDTO = require("../dto/products.dto");
const { productService } = require("../services");

class ProductsController {
    constructor() {
        this.service = productService;
    }

    createProduct = async (req, res) => {
        const productData = req.body;
    
        const { title, description, code, category } = productData;
        let { price, stock, status } = productData;
    
        price = Number(price);
        stock = Number(stock);
    
        if (status === undefined) {
            status = true;
        }
    
        if (!title || !description || !code || !category || !price || typeof price !== 'number' || isNaN(price) || !stock || typeof stock !== 'number' || isNaN(stock)) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios y deben ser válidos.",
            });
        }
    
        try {
            const existingProduct = await this.service.getProduct({ title: productData.title });
    
            if (existingProduct) {
                return res.status(400).json({ message: "El producto ya existe" });
            }
    
            const newProduct = await this.service.createProduct({ ...productData, price, stock, status });
            const productDTO = new ProductsDTO(newProduct);
    
            res.status(201).json({ message: "Producto creado", data: productDTO });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al crear el producto" });
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
    
            const user = req.user;
            
            const productsDTO = products.map(product => new ProductsDTO(product));
    
            res.render('users/products', { products: productsDTO, user: user });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    };
    
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