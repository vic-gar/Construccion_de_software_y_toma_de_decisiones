/*
La suma de las cantidades e importe total de todas las entregas realizadas 
durante el 97.
*/

SELECT
    SUM(e.Cantidad) AS total_unidades_entregadas,
    SUM(e.Cantidad * m.Costo * (1 + m.PorcentajeImpuesto / 100)) AS importe total
FROM Entregan e
JOIN Materiales m ON e.Clave = m.Clave
WHERE YEAR(e.Fecha) = 1997;

/*
Para cada proveedor, obtener la razón social del proveedor, número de entregas e 
importe total de las entregas realizadas.
*/

SELECT
    p.RazonSocial AS proveedor,
    COUNT(*) AS numero_de_entregas,
    SUM(e.Cantidad * m.Costo * (1 + m.PorcentajeImpuesto / 100)) AS importe_total
FROM Entregan e
JOIN Proveedores p ON e.RFC = p.RFC
JOIN Materiales m ON e.Clave = m.Clave
GROUP BY p.RFC, p.RazonSocial;

/*
Por cada material obtener la clave y descripción del material, la cantidad total
entregada, la mínima cantidad entregada, la máxima cantidad entregada, el 
importe total de las entregas de aquellos materiales en los que la cantidad 
promedio entregada sea mayor a 400.
*/

SELECT
    m.Clave AS clave,
    m.Descripcion AS descripcion,
    SUM(e.Cantidad) AS cantidad_total,
    MIN(e.Cantidad) AS cantidad_minima,
    MAX(e.Cantidad) AS cantidad_maxima,
    SUM(e.Cantidad * m.Costo * (1 + m.PorcentajeImpuesto / 100)) AS Importe_Total
FROM Entregan e
JOIN Materiales m ON e.Clave = m.Clave
GROUP BY m.Clave, m.Descripcion
HAVING AVG(e.Cantidad) > 400;

/*
Para cada proveedor, indicar su razón social y mostrar la cantidad promedio de 
cada material entregado, detallando la clave y descripción del material, 
excluyendo aquellos proveedores para los que la cantidad promedio sea menor a 
500.
*/

SELECT
    p.RazonSocial AS Proveedor,
    m.Clave AS Clave Material,
    m.Descripcion AS Descripcion_Material,
    AVG(e.Cantidad) AS Cantidad_Promedio
FROM Entregan e
JOIN Proveedores p ON e.RFC = p.RFC
JOIN Materiales m ON e.Clave = m.Clave
GROUP BY p.RFC, p.RazonSocial, m.Clave, m.Descripcion
HAVING AVG(e.Cantidad) >= 500;

/*
Mostrar en una solo consulta los mismos datos que en la consulta anterior pero 
para dos grupos de proveedores: aquellos para los que la cantidad promedio 
entregada es menor a 370 y aquellos para los que la cantidad promedio entregada 
sea mayor a 450.
*/

SELECT
    p.RazonSocial AS Proveedor,
    m.Clave AS Clave_Material,
    m.Descripcion AS Descripcion_Material,
    AVG(e.Cantidad) AS Cantidad_Promedio,
    CASE
        WHEN AVG(e.Cantidad) < 370 THEN 'Promedio bajo (< 370)'
        WHEN AVG(e.Cantidad) > 450 THEN 'Promedio alto (> 450)'
    END AS Grupo
FROM Entregan e
JOIN Proveedores p ON e.RFC = p.RFC
JOIN Materiales m ON e.Clave = m.Clave
GROUP BY p.RFC, p.RazonSocial, m.Clave, m.Descripcion
HAVING AVG(e.Cantidad) < 370 OR AVG(e.Cantidad) > 450;

