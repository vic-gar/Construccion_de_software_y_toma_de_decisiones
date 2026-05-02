const log = console.log;

const alertas = [
    { id: 1, titulo: "Alerta 1", active: true,  idUser: 1 },
    { id: 2, titulo: "Alerta 2", active: true,  idUser: 1 },
    { id: 3, titulo: "Alerta 3", active: false, idUser: 2 },
    { id: 4, titulo: "Alerta 4", active: true,  idUser: 1 }
];

exports.ObtenerAlertas = function () {
    log("Obtener Alertas");
    return alertas;
}

exports.ObtenerAlertasActivas = function () {
    log("Obtener Alertas Activas");
    return alertas.filter(alerta => alerta.active);
}

exports.ObtenerAlertasPorUsuario = function (idUser) {
    const uid = parseInt(idUser);
    return alertas.filter(alerta => alerta.idUser === uid);
}

exports.GuardarAlerta = function (titulo, idUser) {
    const nuevoId = alertas.length > 0 ? alertas[alertas.length - 1].id + 1 : 1;
    const alerta = {
        id: nuevoId,
        titulo: titulo,
        active: true,
        idUser: parseInt(idUser)
    };
    alertas.push(alerta);
    return alerta;
}
