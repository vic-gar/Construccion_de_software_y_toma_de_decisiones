const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const modelUsuarios = require('../models/usuarios.model');
const modelAlertas = require('../models/alertas.model');

module.exports.getAllUsers = async(req, res) => {
    let correo = "";
    let contrasena = "";

    let usuarios = modelUsuarios.ObtenerUsuariosActivos(correo, contrasena);
    let alertas = modelAlertas.ObtenerAlertas();

    /*res.setHeader("Content-Type", "application/json");
    res.status(200)
        .json({ status: "success",
                message:"Get all users",
                data: activeUsers
            });
    res.end();*/

    res.render("./usuarios/obtener_usuarios",{
        title: "Obtener Usuarios",
        usuarios: usuarios,
        alertas: alertas
    });
}

module.exports.getAllUsersActivos = async(req, res) => {
    let usuariosActivos = modelUsuarios.ObtenerUsuariosActivos();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ status: "success", data: usuariosActivos });
    res.end();
}

module.exports.addUserView = async(req, res) => {
    res.render("./usuarios/agregar_usuario", {
        title: "Agregar Usuario"
    });
}

module.exports.addUserForm = async(req, res) => {
    const nombre = req.body.nombre;
    const activo = req.body.activo;
    modelUsuarios.GuardarUsuario(nombre, activo);
    res.redirect("/usuarios/obtener_usuarios");
}

module.exports.editUserView = async(req, res) => {
    const id = req.query.id;
    const usuario = modelUsuarios.BuscarUsuario(id);
    if (!usuario) {
        res.status(404).send("Usuario no encontrado");
        return;
    }
    res.render("./usuarios/editar_usuario", {
        title: "Editar Usuario",
        usuario: usuario
    });
}

module.exports.editUserForm = async(req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const activo = req.body.activo;
    modelUsuarios.EditarUsuario(id, nombre, activo);
    res.redirect("/usuarios/obtener_usuarios");
}

module.exports.deleteUser = async(req, res) => {
    const id = req.body.id;
    modelUsuarios.EliminarUsuario(id);
    res.redirect("/usuarios/obtener_usuarios");
}