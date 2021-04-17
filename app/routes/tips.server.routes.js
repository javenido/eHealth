const userController = require('../../app/controllers/users.server.controller');
const tipController = require('../../app/controllers/tips.server.controller');

module.exports = function (app) {
    app.route('/tip/create')
        .post(userController.requiresLogin,
            tipController.create);
    app.route('/tips/list/:authorId?').get(tipController.list);
    app.route('/tip/:tipId')
        .delete(userController.requiresLogin,
            tipController.delete);
    app.route('/tip/random').get(tipController.getRandom);

    app.param('tipId', tipController.tipByID);
};