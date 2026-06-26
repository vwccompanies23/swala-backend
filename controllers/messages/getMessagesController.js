const pool = require('../../config/db');

const getMessages = async (req, res) => {
  try {

    const { chat_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        m.*,
        u.full_name,
        u.username,
        u.profile_image
      FROM messages m
      LEFT JOIN users u
      ON m.sender_id = u.id
      WHERE m.chat_id = $1
      ORDER BY m.created_at ASC
      `,
      [chat_id]
    );

    res.status(200).json({
      success: true,
      messages: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = getMessages;