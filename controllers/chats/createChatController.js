const pool = require('../../config/db');

const createChat = async (req, res) => {

  try {

    const {
      user_one_id,
      user_two_id
    } = req.body;

    const existingChat =
      await pool.query(
        `
        SELECT *
        FROM chats
        WHERE
        (
          user_one_id = $1
          AND user_two_id = $2
        )
        OR
        (
          user_one_id = $2
          AND user_two_id = $1
        )
        `,
        [
          user_one_id,
          user_two_id,
        ]
      );

    if (
      existingChat.rows.length > 0
    ) {

      return res.json({
        success: true,
        chat:
        existingChat.rows[0],
      });
    }

    const chat =
      await pool.query(
        `
        INSERT INTO chats
        (
          user_one_id,
          user_two_id
        )
        VALUES
        (
          $1,
          $2
        )
        RETURNING *
        `,
        [
          user_one_id,
          user_two_id,
        ]
      );

    res.json({
      success: true,
      chat: chat.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = createChat;