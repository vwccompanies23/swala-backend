const pool = require('../../config/db');

const {
  emitDelivered,
} = require('../../socket/messageEmitter');

const markDelivered = async (req, res) => {

  try {

    const {
      messageId,
      senderId,
    } = req.body;

    await pool.query(

      `
      UPDATE messages
      SET is_delivered = TRUE
      WHERE id = $1
      `,

      [
        messageId,
      ],

    );

    emitDelivered(

      senderId,

      {
        messageId,
      },

    );

    return res.json({

      success: true,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = markDelivered;