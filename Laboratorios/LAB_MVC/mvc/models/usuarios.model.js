const log = console.log;

const usuarios = [
    { id: 1, nombre: "Samuel", active: true },
    { id: 2, nombre: "Lisa",   active: true },
    { id: 3, nombre: "Bob",    active: false },
    { id: 4, nombre: "Alicia", active: true }
];

exports.ObtenerUsuarios = function (correo, contrasena) {
    log("Obtener Usuarios");
    return usuarios;
}

exports.ObtenerUsuariosActivos = function (correo, contrasena) {
    log("Obtener Usuarios Activos");
    return usuarios.filter(user => user.active);
}

exports.GuardarUsuario = function (nombre, activo) {
    const nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;
    const usuario = {
        id: nuevoId,
        nombre: nombre,
        active: activo === "true" || activo === true
    };
    usuarios.push(usuario);
    return usuario;
}

exports.BuscarUsuario = function (id) {
    const uid = parseInt(id);
    return usuarios.find(user => user.id === uid);
}

exports.EditarUsuario = function (id, nombre, activo) {
    const usuario = exports.BuscarUsuario(id);
    if (usuario) {
        usuario.nombre = nombre;
        usuario.active = activo === "true" || activo === true;
    }
    return usuario;
}

exports.EliminarUsuario = function (id) {
    const uid = parseInt(id);
    const index = usuarios.findIndex(user => user.id === uid);
    if (index >= 0) {
        usuarios.splice(index, 1);
        return true;
    }
    return false;
}

/*
    CRUD

    Create
    Read
    Update
    Delete

    List Table
    Get Object

    Users
    Search by ID
    Search by Name
    Search by Email
    Search by Role

    Alerts
    Search by ID
    Search by Title
    Search by User ID
*/