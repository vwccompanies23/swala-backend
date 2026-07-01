const pool = require('../../config/db');

const {
  sendNotification,
} = require('../../firebase/notificationService');

const {
  emitMessage,
} = require('../../socket/messageEmitter');

const createMessage = async (req, res) => {

  try {

    const {
      sender_id,
      receiver_id,
      message,
    } = req.body;

    if (!sender_id || !receiver_id || !message) {

      return res.status(400).json({

        success: false,

        error: 'Missing required fields',

      });

    }

    console.log('📨 New message request:', {

      sender_id,

      receiver_id,

      message,

    });

    // Find existing chat

    let chat = await pool.query(

      `
      SELECT id
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
      LIMIT 1
      `,

      [
        sender_id,
        receiver_id,
      ],

    );

    let chatId;

    if (chat.rows.length === 0) {

      console.log('🆕 Creating new chat');

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

        [
          sender_id,
          receiver_id,
        ],

      );

      chatId = newChat.rows[0].id;

    } else {

      chatId = chat.rows[0].id;

    }

    console.log('💬 Chat ID:', chatId);

    const savedMessage = await pool.query(

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
        chatId,
        sender_id,
        message,
      ],

    );

    console.log('✅ Message saved');

    // Send realtime message

    emitMessage(

      receiver_id,

      {
        ...savedMessage.rows[0],
        receiver_id,
      },

    );

    console.log('📤 Realtime message emitted');

    const sender = await pool.query(

      `
      SELECT full_name
      FROM users
      WHERE id = $1
      `,

      [
        sender_id,
      ],

    );

    try {

      await sendNotification({

        userId: receiver_id,

        title: 'New Message',

        body: `${sender.rows[0].full_name}: ${message}`,

        data: {

          chatId: chatId.toString(),

          senderId: sender_id.toString(),

        },

      });

      console.log('🔔 Notification sent');

    } catch (notificationError) {

      console.error(

        '⚠️ Notification failed:',

        notificationError,

      );

    }

    return res.status(201).json({

      success: true,

      message: savedMessage.rows[0],

    });

  } catch (err) {

    console.error('❌ Create Message Error');

    console.error(err);

    return res.status(500).json({

      success: false,

      error: err.message,

    });

  }

};

module.exports = createMessage;