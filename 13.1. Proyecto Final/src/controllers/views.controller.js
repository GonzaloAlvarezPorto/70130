class ViewsController {
    static index(req, res) {
        res.render('index');
    }
    
    static login(req, res) {
        res.render('login');
    }

    static register(req, res) {
        res.render('register');
    }

    static createProduct(req, res){
        res.render('users/createProducts')
    }

    static updateProduct(req, res){
        res.render('users/updateProduct')
    }
}

module.exports = ViewsController;