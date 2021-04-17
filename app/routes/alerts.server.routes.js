const userController = require('../../app/controllers/users.server.controller');
const alertController = require('../../app/controllers/alerts.server.controller');

module.exports = function (app) {
    app.route('/alert/create')
        .post(userController.requiresLogin,
            alertController.create);
    app.route('/alerts/list').get(alertController.list);
    app.route('/alert/:alertId')
        .delete(userController.requiresLogin,
            alertController.delete);

    app.param('alertId', alertController.alertByID);
};