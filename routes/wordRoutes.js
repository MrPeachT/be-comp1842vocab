const { authOptional, authRequired, requireRole } = require('../middleware/auth');
const controller = require('../controllers/wordController');

module.exports = function (app) {
  app.route('/words')
    .get(authOptional, controller.list_all_words)
    .post(authRequired, requireRole('admin', 'student')
, controller.create_a_word);

  app.route('/words/:id')
    .get(authOptional, controller.read_a_word)
    .put(authRequired, requireRole('admin', 'student'), controller.update_a_word)
    .delete(authRequired, requireRole('admin', 'student'), controller.delete_a_word);
};