const model  = require('../models/usuarios.model.js');
const bcrypt = require('bcryptjs');

exports.get_registro = (request, response, next) => {
    response.render('usuarios/registro', {
        registro: true
    });
};

exports.post_registro = async (request, response, next) => {
    try {
        const { username, name, password } = request.body;
        const usuarioExistente = await model.User.findByUsername(username);
        if (usuarioExistente) {
            return response.status(409).send('El usuario ya existe');
        }
        const user = new model.User(username, name, password);
        await user.save();

        response.status(201).redirect('/usuarios/login');

    } catch (e) {
        console.error(e);
        response.status(500).send('Error registrando usuario');
    }
};

exports.render_login = (request, response, next) => {
    response.render('usuarios/registro', {
        registro: false
    });
};

exports.do_login = async (request, response, next) => {
    try {
        const usuario = await model.User.findByUsername(request.body.username);
        if (!usuario) {
            return response.redirect('/usuarios/login');
        }
        const doMatch = await bcrypt.compare(request.body.password, usuario.password);
        if (!doMatch) {
            return response.redirect('/usuarios/login');
        }

        request.session.username   = usuario.username;
        request.session.isLoggedIn = true;

        return request.session.save(err => {
            response.redirect('/usuarios/logged');
        });

    } catch (e) {
        console.error(e);
        response.redirect('/usuarios/login');
    }
};

exports.get_logged = async (request, response, next) => {
    const usuario = await model.User.findByUsername(request.session.username);
    if (!usuario) {
        return response.redirect('/usuarios/login');
    }
    response.render('usuarios/logged', {
        user: usuario
    });
};