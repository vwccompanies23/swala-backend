const pool = require('../../config/db');

const {
  emitSeen,
} = require('../../socket/messageEmitter');

const markSeen = async (req, res) => {

  try {

    const {
      messageId,
      senderId,
    } = req.body;

    await pool.query(

      `
      UPDATE messages
      SET is_read = TRUE
      WHERE id = $1
      `,

      [
        messageId,
      ],

    );

    emitSeen(

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

module.exports = markSeen;