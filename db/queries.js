const pool = require("./pool");

exports.findByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    email,
  ]);
  return rows[0];
};

exports.findById = async (userId) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);
  return rows[0];
};

exports.createNewUser = async (userInfos) => {
  const { rows } = await pool.query(
    "INSERT INTO users (username, firstname, lastname, hash) VALUES ($1, $2, $3, $4) RETURNING username",
    [
      userInfos.username,
      userInfos.first_name,
      userInfos.last_name,
      userInfos.password,
    ]
  );
  return rows;
};

exports.getAllMessages = async (clientTz) => {
  const { rows } = await pool.query(
    "SELECT messages.message_id, messages.user_id, messages.message, TO_CHAR(created_at at time zone ($1), 'YYYY-MM-DD HH24:MI') as created_at, users.username FROM messages INNER JOIN users ON messages.user_id = users.user_id;", [clientTz]
  );
  return rows;
};

exports.getMessageById = async (msgId) => {
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE message_id = $1",
    [msgId]
  );
  return rows[0];
};

exports.deleteMessage = async (msgId, userId) => {
  const { rows } = await pool.query(
    "DELETE FROM messages WHERE message_id = $1 AND user_id = $2 RETURNING *",
    [msgId, userId]
  );
  return rows;
};

exports.createNewMessage = async (newMessage) => {
  const { rows } = await pool.query(
    "INSERT INTO messages (user_id, message) VALUES ($1, $2) RETURNING *",
    [newMessage.user_id, newMessage.message]
  );
  console.log(newMessage);
  return rows;
};

exports.setMembershipTrue = async (userId) => {
  const { rows } = await pool.query(
    "UPDATE users SET membership_status = true WHERE user_id = $1 RETURNING username, membership_status",
    [userId]
  );
  return rows[0];
};

exports.setMembershipFalse = async (userId) => {
  const { rows } = await pool.query(
    "UPDATE users SET membership_status = false WHERE user_id = $1 RETURNING username, membership_status",
    [userId]
  );
  return rows[0];
};
