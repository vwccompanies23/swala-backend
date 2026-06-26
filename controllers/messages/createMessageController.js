const pool = require('../../config/db');
const { sendNotification } =
require('../../firebase/notificationService');

const createMessage = async (req, res) => {

  try {

    const {
      chat_id,
      sender_id,
      message,
    } = req.body;

    if (!chat_id || !sender_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const messageResult =
      await pool.query(
        `
        INSERT INTO messages
        (
          chat_id,
          sender_id,
          message
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        RETURNING *
        `,
        [
          chat_id,
          sender_id,
          message,
        ]
      );

    const chat =
      await pool.query(
        `
        SELECT
        user_one_id,
        user_two_id
        FROM chats
        WHERE id = $1
        `,
        [chat_id]
      );

    if (chat.rows.length > 0) {

      const receiverId =
        chat.rows[0].user_one_id ==
        sender_id
            ? chat.rows[0].user_two_id
            : chat.rows[0].user_one_id;

      const sender =
        await pool.query(
          `
          SELECT full_name
          FROM users
          WHERE id = $1
          `,
          [sender_id]
        );

      await sendNotification({

        userId: receiverId,

        title: "New Message",

        body:
            `${sender.rows[0].full_name}: ${message}`,

        data: {
          chatId: chat_id.toString(),
          senderId: sender_id.toString(),
        },

      });

    }

    res.status(201).json({
      success: true,
      message_data:
          messageResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

};

module.exports = createMessage;