const admin = require("./firebaseAdmin");
const pool = require("../config/db");

const sendNotification = async ({
  userId,
  title,
  body,
  data = {},
}) => {

  try {

    //////////////////////////////////////////////////////
    // GET USER FCM TOKEN
    //////////////////////////////////////////////////////

    const result = await pool.query(
      `
      SELECT
        fcm_token
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      console.log("❌ User not found.");
      return;
    }

    const token = result.rows[0].fcm_token;

    if (!token) {
      console.log(`⚠️ User ${userId} has no FCM token.`);
      return;
    }

    //////////////////////////////////////////////////////
    // BUILD MESSAGE
    //////////////////////////////////////////////////////

    const payload = {

      token,

      notification: {
        title,
        body,
      },

      data: {

        //////////////////////////////////////////////////
        // GENERAL
        //////////////////////////////////////////////////

        type: data.type ?? "",

        screen: data.screen ?? "",

        click_action:
            data.click_action ??
            "FLUTTER_NOTIFICATION_CLICK",

        //////////////////////////////////////////////////
        // USERS
        //////////////////////////////////////////////////

        senderId:
            data.senderId ?? "",

        receiverId:
            data.receiverId ?? "",

        senderName:
            data.senderName ?? "",

        senderUsername:
            data.senderUsername ?? "",

        senderPhoto:
            data.senderPhoto ?? "",

        //////////////////////////////////////////////////
        // CHAT
        //////////////////////////////////////////////////

        chatId:
            data.chatId ?? "",

        messageId:
            data.messageId ?? "",

        message:
            data.message ?? "",

        //////////////////////////////////////////////////
        // CALL
        //////////////////////////////////////////////////

        callId:
            data.callId ?? "",

        callType:
            data.callType ?? "",

        //////////////////////////////////////////////////
        // GROUP
        //////////////////////////////////////////////////

        groupId:
            data.groupId ?? "",

        groupName:
            data.groupName ?? "",

        //////////////////////////////////////////////////
        // COMMUNITY
        //////////////////////////////////////////////////

        communityId:
            data.communityId ?? "",

        //////////////////////////////////////////////////
        // CHANNEL
        //////////////////////////////////////////////////

        channelId:
            data.channelId ?? "",

        //////////////////////////////////////////////////
        // POST
        //////////////////////////////////////////////////

        postId:
            data.postId ?? "",

        commentId:
            data.commentId ?? "",

        //////////////////////////////////////////////////
        // BROADCAST
        //////////////////////////////////////////////////

        broadcastId:
            data.broadcastId ?? "",

        //////////////////////////////////////////////////
        // TIME
        //////////////////////////////////////////////////

        createdAt:
            data.createdAt ?? "",

      },

      android: {

        priority: "high",

        notification: {

          channelId:
              data.type == "call"
                  ? "calls"
                  : "messages",

          priority: "high",

          visibility: "public",

          sound: "default",

          defaultSound: true,

          defaultVibrateTimings: true,

        },

      },

      apns: {

        payload: {

          aps: {

            sound: "default",

            badge: 1,

            contentAvailable: true,

          },

        },

      },

    };

    //////////////////////////////////////////////////////
    // SEND
    //////////////////////////////////////////////////////

    const response =
        await admin.messaging().send(payload);

    console.log("✅ Notification sent.");
    console.log(response);

  } catch (error) {

    console.error("❌ Notification Error");
    console.error(error);

  }

};

module.exports = {
  sendNotification,
};