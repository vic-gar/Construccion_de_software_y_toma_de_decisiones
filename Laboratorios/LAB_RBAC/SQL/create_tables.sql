-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS roles (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permisos (
    id    SERIAL PRIMARY KEY,
    clave VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuario_rol (
    username VARCHAR(60) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    id_rol   INT         NOT NULL REFERENCES roles(id)       ON DELETE CASCADE,
    PRIMARY KEY (username, id_rol)
);

CREATE TABLE IF NOT EXISTS rol_permiso (
    id_rol     INT NOT NULL REFERENCES roles(id)    ON DELETE CASCADE,
    id_permiso INT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_rol, id_permiso)
);

CREATE TABLE IF NOT EXISTS notas (
    id         SERIAL PRIMARY KEY,
    titulo     VARCHAR(200) NOT NULL,
    contenido  TEXT         NOT NULL,
    autor      VARCHAR(60)  NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    creada_en  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notas_autor ON notas (autor);

CREATE TABLE IF NOT EXISTS users (
    id        SERIAL PRIMARY KEY,
    username  VARCHAR(60)  NOT NULL UNIQUE,
    name      VARCHAR(120),
    password  VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);