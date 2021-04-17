const userController = require('../../app/controllers/users.server.controller');
const vitalsController = require('../../app/controllers/vitals.server.controller');

module.exports = function (app) {
    app.route('/vitals/create').post(
        userController.requiresLogin,
        vitalsController.create);
    app.route('/vitals/list/:patient?').get(vitalsController.list);
    app.post('/predict', vitalsController.trainAndPredict);
};