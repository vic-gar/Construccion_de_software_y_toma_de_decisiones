const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;
    const sql = `
        SELECT g.id, g.title, g.release_year, g.price, g.rating,
               s.name AS studio,
               gn.name AS genre
        FROM games g
        LEFT JOIN studios s ON s.id = g.studio_id
        LEFT JOIN genres  gn ON gn.id = g.genre_id
        ORDER BY g.title
        LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(sql, [pageSize, offset]);
    return rows;
};

exports.count = async () => {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM games');
    return rows[0].total;
};

exports.findById = async (id) => {
    const sql = `
        SELECT g.id, g.title, g.release_year, g.price, g.rating,
               g.studio_id, g.genre_id,
               s.name AS studio,
               gn.name AS genre
        FROM games g
        LEFT JOIN studios s ON s.id = g.studio_id
        LEFT JOIN genres  gn ON gn.id = g.genre_id
        WHERE g.id = $1
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
};

exports.findByTitle = async (titulo) => {
    const sql = `SELECT id, title, release_year, price, rating
                 FROM games WHERE title ILIKE $1
                 ORDER BY title LIMIT 50`;
    const { rows } = await pool.query(sql, [`%${titulo}%`]);
    return rows;
};

// Sólo para demostrar SQL injection — no usar en código real
exports.findByTitleInsegura = async (titulo) => {
    const sql = `SELECT id, title, release_year, price, rating
                 FROM games WHERE title ILIKE '%${titulo}%'
                 ORDER BY title LIMIT 50`;
    const { rows } = await pool.query(sql);
    return rows;
};

exports.save = async (game) => {
    const sql = `
        INSERT INTO games (title, studio_id, genre_id, release_year, price, rating)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    return pool.query(sql, [
        game.title,
        game.studio_id || null,
        game.genre_id || null,
        game.release_year || null,
        game.price || null,
        game.rating || null
    ]);
};

exports.update = async (id, game) => {
    const sql = `
        UPDATE games
        SET title = $1,
            studio_id = $2,
            genre_id = $3,
            release_year = $4,
            price = $5,
            rating = $6
        WHERE id = $7
    `;
    return pool.query(sql, [
        game.title,
        game.studio_id || null,
        game.genre_id || null,
        game.release_year || null,
        game.price || null,
        game.rating || null,
        id
    ]);
};