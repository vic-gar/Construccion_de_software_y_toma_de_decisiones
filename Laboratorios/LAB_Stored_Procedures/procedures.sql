-- 1. Insertar una nueva Operación

CREATE OR REPLACE PROCEDURE public.sp_insertar_operacion(
    p_contrato_id INTEGER,
    p_origen_recursos SMALLINT,
    p_origen_operacion SMALLINT,
    p_destino_operacion SMALLINT,
    p_instrumento_monetario SMALLINT,
    p_monto NUMERIC(14,2),
    p_es_moneda_extranjera BOOLEAN DEFAULT FALSE,
    OUT p_operacion_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.operaciones (
        contrato_id,
        origen_recursos,
        origen_operacion,
        destino_operacion,
        instrumento_monetario,
        monto,
        es_moneda_extranjera
    )
    VALUES (
        p_contrato_id,
        p_origen_recursos,
        p_origen_operacion,
        p_destino_operacion,
        p_instrumento_monetario,
        p_monto,
        p_es_moneda_extranjera
    )
    RETURNING operacion_id INTO p_operacion_id;
END;
$$;

-- 2. Crear una Alerta

CREATE OR REPLACE PROCEDURE public.sp_crear_alerta(
    p_regla_id INTEGER,
    p_operacion_id INTEGER DEFAULT NULL,
    p_sofom_id SMALLINT,
    p_tipo_reporte_id SMALLINT,
    p_tipo_alerta_id SMALLINT,
    p_descripcion TEXT DEFAULT 'Sin descripción',
    OUT p_alerta_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.alertas (
        regla_id,
        operacion_id,
        sofom_id,
        tipo_reporte_id,
        tipo_alerta_id,
        descripcion
    )
    VALUES (
        p_regla_id,
        p_operacion_id,
        p_sofom_id,
        p_tipo_reporte_id,
        p_tipo_alerta_id,
        p_descripcion
    )
    RETURNING alerta_id INTO p_alerta_id;
END;
$$;

-- 3. Actualizar Perfil de Cliente

CREATE OR REPLACE PROCEDURE public.sp_actualizar_perfil_cliente(
    p_perfiles_cliente_id INTEGER,
    p_puntaje NUMERIC(4,2),
    p_clasif_monitoreo NUMERIC(4,2) DEFAULT NULL,
    p_clasif_cliente NUMERIC(4,2) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.perfiles_cliente
    SET 
        puntaje = p_puntaje,
        clasif_monitoreo = COALESCE(p_clasif_monitoreo, clasif_monitoreo),
        clasif_cliente = COALESCE(p_clasif_cliente, clasif_cliente),
        ultima_revision = NOW(),
        ultimo_cambio = NOW()
    WHERE perfiles_cliente_id = p_perfiles_cliente_id;
END;
$$;

/*
¿Que desventajas identificas en la utilizacion de store procedures?

Mayor complejidad de mantenimiento ya que la lógica de negocio queda repartida 
entre la aplicación y la base de datos y puede ser difícil localizar errores 
cuando parte del procesamiento ocurre dentro del servidor de bases de datos. 
Además los cambios requieren modificar el procedimiento y volver a desplegarlo.
*/