const pool = require('../../config/db');
const { sendNotification } = require('../../firebase/notificationService');

const createMessage = async (req, res) => {
  try {
    const {
      sender_id,
      receiver_id,
      message,
      message_type,
    } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if a chat already exists
    let chatResult = await pool.query(
      `
      SELECT id
      FROM chats
      WHERE
      (user_one_id = $1 AND user_two_id = $2)
      OR
      (user_one_id = $2 AND user_two_id = $1)
      LIMIT 1
      `,
      [sender_id, receiver_id]
    );

    let chatId;

    // Create chat if it doesn't exist
    if (chatResult.rows.length === 0) {
      const newChat = await pool.query(
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
        RETURNING id
        `,
        [sender_id, receiver_id]
      );

      chatId = newChat.rows[0].id;
    } else {
      chatId = chatResult.rows[0].id;
    }

    // Save the message
    const messageResult = await pool.query(
      `
      INSERT INTO messages
      (
        chat_id,
        sender_id,
        message,
        message_type
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `,
      [
        chatId,
        sender_id,
        message,
        message_type || 'text',
      ]
    );

    // Get sender name
    const sender = await pool.query(
      `
      SELECT full_name
      FROM users
      WHERE id = $1
      `,
      [sender_id]
    );

    // Send notification
    await sendNotification({
      userId: receiver_id,
      title: 'New Message',
      body: `${sender.rows[0].full_name}: ${message}`,
      data: {
        chatId: chatId.toString(),
        senderId: sender_id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      message: messageResult.rows[0],
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