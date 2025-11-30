const { authOptional, authRequired } = require('../middleware/auth');

module.exports = function(app) {
  const controller = require('../controllers/wordController');

  app.route('/words')
    .get(controller.list_all_words)
    .post(authRequired, controller.create_a_word);

  app.route('/words/:id')
    .get(controller.read_a_word)
    .put(authRequired, controller.update_a_word)
    .delete(authRequired, controller.delete_a_word);
};