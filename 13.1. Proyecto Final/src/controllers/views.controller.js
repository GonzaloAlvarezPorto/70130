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
}

module.exports = ViewsController;