const admin = require("./firebaseAdmin");
const pool = require("../config/db");

const sendNotification = async ({
  userId,
  title,
  body,
  data = {},
}) => {

  try {

    const result = await pool.query(
      `
      SELECT fcm_token
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return;
    }

    const token =
      result.rows[0].fcm_token;

    if (!token) {
      return;
    }

    await admin.messaging().send({

      token,

      notification: {
        title,
        body,
      },

      data,

      android: {
        priority: "high",
      },

      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },

    });

  } catch (error) {

    console.error(
      "Notification Error:",
      error,
    );

  }

};

module.exports = {
  sendNotification,
};