const userController = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/user/create').post(userController.create);
    app.route('/user/login').post(userController.authenticate);
    app.route('/user/verify').get(userController.isSignedIn);
    app.route('/user/logout').get(userController.signOut);
    app.route('/user/:userId')
        .get(userController.read);

    app.param('userId', userController.userByID);
};