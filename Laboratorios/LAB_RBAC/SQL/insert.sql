INSERT INTO roles (nombre) VALUES
    ('lector'),
    ('editor'),
    ('administrador')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO permisos (clave) VALUES
    ('ver_notas'),
    ('crear_nota'),
    ('editar_nota'),
    ('eliminar_nota')
ON CONFLICT (clave) DO NOTHING;

-- lector: solo ver
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'lector' AND p.clave = 'ver_notas'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- editor: ver, crear, editar
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'editor' AND p.clave IN ('ver_notas','crear_nota','editar_nota')
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- administrador: todo
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'administrador'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

INSERT INTO usuario_rol (username, id_rol)
SELECT 'tu_usuario', r.id FROM roles r WHERE r.nombre = 'administrador'
ON CONFLICT (username, id_rol) DO NOTHING;

-- SE REGISTRAN LOS USUARIOS EN WEB