const pool = require("./pool")

exports.findByEmail = async (email) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [email])
    return rows[0]
}

exports.findById = async(userId)=>{
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    return rows[0]
} 

exports.createNewUser = async(userInfos) => {
    const { rows } = await pool.query("INSERT INTO users (username, firstname, lastname, hash) VALUES ($1, $2, $3, $4) RETURNING *", [userInfos.username, userInfos.first_name, userInfos.last_name, userInfos.password]);

    return rows
}