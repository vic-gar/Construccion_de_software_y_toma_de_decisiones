const express = require('express');
const router  = express.Router();
const controller = require('../controllers/game.controller.js');

router.get('/', controller.index);
router.get('/buscar', controller.buscarSeguro);
router.get('/buscar-inseguro', controller.buscarInseguro);

router.get('/new', controller.getNuevoJuego);
router.post('/new', controller.postNuevoJuego);

router.get('/:game_id/edit', controller.getEditarJuego);
router.post('/:game_id/edit', controller.postEditarJuego);

router.get('/:game_id', controller.getJuego);

module.exports = router;