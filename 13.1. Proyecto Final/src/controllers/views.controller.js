const { productService } = require("../services");

class ViewsController {

    constructor() {
        this.service = productService;
    }

    index(req, res) {
        res.render('index');
    }
    
    login(req, res) {
        res.render('login');
    }

    register(req, res) {
        res.render('register');
    }

    createProduct(req, res){
        res.render('users/createProducts')
    }

    updateProduct(req, res){
        res.render('users/updateProduct')
    }

    getProductsRealTime = async (req, res) => {
        try {
            const { limit = 10, page = 1, sort = '', query = '' } = req.query;

            const limitInt = parseInt(limit);
            const pageInt = parseInt(page);
            const sortOption = sort === 'desc' ? { price: -1 } : (sort === 'asc' ? { price: 1 } : {});
            const filter = query ? { category: new RegExp(query, 'i') } : {};

            const products = await this.service.getProducts(filter, sortOption, limitInt, (pageInt - 1) * limitInt);
            const allProducts = await this.service.getProducts(filter);
            const totalProducts = allProducts.length;
            const totalPages = Math.ceil(totalProducts / limitInt);
            const hasPrevPage = pageInt > 1;
            const hasNextPage = pageInt < totalPages;
            const prevPage = hasPrevPage ? pageInt - 1 : null;
            const nextPage = hasNextPage ? pageInt + 1 : null;
            const prevLink = `limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`;
            const nextLink = `limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`;

            res.render('realtimeproducts', {
                Productos: products,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                currentPage: pageInt,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                limit: limitInt,
                sort: sort,
                query: query
            });

            console.log({
                status: 'success',
                payload: products,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: pageInt,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos');
        }
    }
}

module.exports = ViewsController;