require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

/* ===================================
   SOCKET SERVER
=================================== */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ===================================
   POSTGRES
=================================== */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/* ===================================
   ONLINE USERS
=================================== */

const onlineUsers = {};


/* ===================================
   REGISTER
=================================== */

app.post(
  "/register",
  async (req, res) => {

    try {

      const {
        username,
        password,
        phone,
      } = req.body;

      /* CHECK USER */

      const existingUser =
        await pool.query(
          `
          SELECT * FROM users
          WHERE username = $1
        `,
          [username]
        );

      if (
        existingUser.rows.length > 0
      ) {

        return res.status(400).json({
          error:
            "Username already exists",
        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /* CREATE USER */

      const result =
        await pool.query(
          `
          INSERT INTO users
          (
            username,
            password,
            phone,
            bio,
            status
          )
          VALUES
          ($1, $2, $3, $4, $5)
          RETURNING
          id,
          username,
          profile_picture,
          phone
        `,
          [
            username,
            hashedPassword,
            phone,
            "",
            "Offline",
          ]
        );

      const user =
        result.rows[0];

      /* TOKEN */

      const token =
        jwt.sign(
          {
            id: user.id,
          },
          "swala_secret_key",
          {
            expiresIn:
              "30d",
          }
        );

      res.json({
        token,
        user,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Registration failed",
      });

    }

  }
);

/* ===================================
   LOGIN
=================================== */

app.post(
  "/login",
  async (req, res) => {

    try {

      const {
        username,
        password,
      } = req.body;

      /* FIND USER */

      const result =
        await pool.query(
          `
          SELECT * FROM users
          WHERE username = $1
        `,
          [username]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(400).json({
          error:
            "User not found",
        });

      }

      const user =
        result.rows[0];

      /* CHECK PASSWORD */

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {

        return res.status(400).json({
          error:
            "Wrong password",
        });

      }

      /* TOKEN */

      const token =
        jwt.sign(
          {
            id: user.id,
          },
          "swala_secret_key",
          {
            expiresIn:
              "30d",
          }
        );

      res.json({
        token,
        user: {
          id: user.id,
          username:
            user.username,
          profile_picture:
            user.profile_picture,
        },
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Login failed",
      });

    }

  }
);

/* ===================================
   GET USER PROFILE
=================================== */

app.get(
  "/user/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT
            id,
            username,
            profile_picture,
            bio,
            status,
            cover_photo
          FROM users
          WHERE id = $1
        `,
          [id]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            "User not found",
        });

      }

      res.json(
        result.rows[0]
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to load profile",
      });

    }

  }
);

/* ===================================
   GET USER CHATS
=================================== */
app.get(
  "/chats/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT
            chats.id,
            chats.is_group,
            chats.group_name,
            chats.group_photo,

            other_user.id
              AS other_user_id,

            other_user.username
              AS other_username,

            other_user.profile_picture
              AS other_profile_picture,

            (
              SELECT message
              FROM messages
              WHERE messages.chat_id = chats.id
              ORDER BY created_at DESC
              LIMIT 1
            ) AS last_message,

            (
              SELECT created_at
              FROM messages
              WHERE messages.chat_id = chats.id
              ORDER BY created_at DESC
              LIMIT 1
            ) AS last_message_time

          FROM chats

          JOIN chat_members current_member
          ON current_member.chat_id = chats.id

          LEFT JOIN chat_members other_member
          ON
            other_member.chat_id = chats.id
            AND other_member.user_id != $1

          LEFT JOIN users other_user
          ON other_user.id = other_member.user_id

          WHERE
            current_member.user_id = $1

          ORDER BY
            last_message_time DESC
          NULLS LAST
        `,
          [userId]
        );

      res.json(
        result.rows
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to load chats",
      });

    }

  }
);

/* ===================================
   GET CHAT MESSAGES
=================================== */

app.get(
  "/messages/:chatId",
  async (req, res) => {

    try {

      const { chatId } = req.params;

      const result = await pool.query(
        `
        SELECT
          messages.id,
          messages.message,
          messages.created_at,
          messages.sender_id,

          users.username,
          users.profile_picture

        FROM messages

        JOIN users
        ON users.id = messages.sender_id

        WHERE
        messages.chat_id = $1

        ORDER BY
        messages.created_at ASC
      `,
        [chatId]
      );

      res.json(result.rows);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to load messages",
      });

    }

  }
);

/* ===================================
   WORLD POSTS
=================================== */

app.get(
  "/world-posts",
  async (req, res) => {

    try {

      const result = await pool.query(
        `
        SELECT
          world_posts.id,
          world_posts.caption,
          world_posts.media_url,
          world_posts.media_type,
          world_posts.created_at,
          world_posts.expires_at,
          world_posts.views,

          users.username,
          users.profile_picture

        FROM world_posts

        JOIN users
        ON users.id = world_posts.user_id

        WHERE world_posts.expires_at > NOW()

        ORDER BY world_posts.created_at DESC
      `
      );

      res.json(result.rows);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to load world posts",
      });

    }

  }
);

/* ===================================
   CREATE PRIVATE CHAT
=================================== */

app.post(
  "/create-chat",
  async (req, res) => {

    try {

      const {
        userOne,
        userTwo,
      } = req.body;

      /* CHECK IF CHAT EXISTS */

      const existing = await pool.query(
        `
        SELECT c.id

        FROM chats c

        JOIN chat_members cm1
        ON cm1.chat_id = c.id

        JOIN chat_members cm2
        ON cm2.chat_id = c.id

        WHERE
        c.is_group = false
        AND cm1.user_id = $1
        AND cm2.user_id = $2
      `,
        [
          userOne,
          userTwo,
        ]
      );

      if (existing.rows.length > 0) {

        return res.json(
          existing.rows[0]
        );

      }

      /* CREATE CHAT */

      const chatResult = await pool.query(
        `
        INSERT INTO chats
        (
          is_group
        )
        VALUES (false)
        RETURNING *
      `
      );

      const chat = chatResult.rows[0];

      /* ADD MEMBERS */

      await pool.query(
        `
        INSERT INTO chat_members
        (
          chat_id,
          user_id
        )
        VALUES
        ($1, $2),
        ($1, $3)
      `,
        [
          chat.id,
          userOne,
          userTwo,
        ]
      );

      res.json(chat);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to create chat",
      });

    }

  }
);

/* ===================================
   CREATE GROUP
=================================== */

app.post(
  "/create-group",
  async (req, res) => {

    try {

      const {
        groupName,
        members,
        createdBy,
      } = req.body;

      const groupResult = await pool.query(
        `
        INSERT INTO chats
        (
          is_group,
          group_name,
          created_by
        )
        VALUES ($1, $2, $3)
        RETURNING *
      `,
        [
          true,
          groupName,
          createdBy,
        ]
      );

      const group = groupResult.rows[0];

      /* ADD MEMBERS */

      const allMembers = [
        ...members,
        createdBy,
      ];

      for (const memberId of allMembers) {

        await pool.query(
          `
          INSERT INTO chat_members
          (
            chat_id,
            user_id
          )
          VALUES ($1, $2)
        `,
          [
            group.id,
            memberId,
          ]
        );

      }

      res.json(group);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to create group",
      });

    }

  }
);

/* ===================================
   CALL SYSTEM
=================================== */

app.post(
  "/start-call",
  async (req, res) => {

    try {

      const {
        callerId,
        receiverId,
        type,
      } = req.body;

      const callData = {
        callerId,
        receiverId,
        type,
        startedAt: new Date(),
      };

      io.emit(
        "incoming_call",
        callData
      );

      res.json({
        success: true,
        callData,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to start call",
      });

    }

  }
);

/* ===================================
   GET NOTIFICATIONS
=================================== */

app.get(
  "/notifications/:userId",
  async (req, res) => {

    try {

      const { userId } = req.params;

      const result = await pool.query(
        `
        SELECT
          notifications.id,
          notifications.type,
          notifications.text,
          notifications.is_read,
          notifications.created_at,

          users.username,
          users.profile_picture

        FROM notifications

        JOIN users
        ON users.id = notifications.sender_id

        WHERE
        notifications.user_id = $1

        ORDER BY
        notifications.created_at DESC
      `,
        [userId]
      );

      res.json(result.rows);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to load notifications",
      });

    }

  }
);

/* ===================================
   SOCKETS
=================================== */

io.on(
  "connection",
  (socket) => {

    console.log(
      "User connected:",
      socket.id
    );

    /* =========================
       USER ONLINE
    ========================= */

    socket.on(
      "user_online",
      async (userId) => {

        socket.userId =
          userId;

        onlineUsers[userId] =
          socket.id;

        /* UPDATE STATUS */

        try {

          await pool.query(
            `
            UPDATE users
            SET status = $1
            WHERE id = $2
          `,
            [
              "Online",
              userId,
            ]
          );

        } catch (err) {

          console.error(err);

        }

        io.emit(
          "online_status",
          {
            userId,
            online: true,
          }
        );

      }
    );

    /* =========================
       JOIN CHAT
    ========================= */

    socket.on(
      "join_chat",
      (chatId) => {

        socket.join(
          `chat_${chatId}`
        );

      }
    );

    /* =========================
       SEND MESSAGE
    ========================= */

  socket.on(
  "send_message",
  async (data) => {

    try {

      /* =========================
         MESSAGE TYPE
      ========================= */

      const messageType =
        data.messageType || "text";

      const voiceUrl =
        data.voiceUrl || null;

      /* =========================
         SAVE MESSAGE
      ========================= */

      const result =
        await pool.query(
          `
          INSERT INTO messages
          (
            chat_id,
            sender_id,
            message,
            message_type,
            voice_url
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
          [
            data.chatId,
            data.senderId,
            data.message || "",
            messageType,
            voiceUrl,
          ]
        );

      const newMessage =
        result.rows[0];

      /* =========================
         SEND REALTIME MESSAGE
      ========================= */

      io.to(
        `chat_${data.chatId}`
      ).emit(
        "receive_message",
        {
          ...newMessage,

          username:
            data.username,
        }
      );

      /* =========================
         NOTIFICATION TEXT
      ========================= */

      const notificationText =

        messageType === "voice"
          ? `${data.username} sent a voice message`
          : `${data.username} sent you a message`;

      /* =========================
         SAVE NOTIFICATION
      ========================= */

      await pool.query(
        `
        INSERT INTO notifications
        (
          user_id,
          sender_id,
          type,
          text
        )
        VALUES ($1, $2, $3, $4)
      `,
        [
          data.receiverId,
          data.senderId,
          "message",
          notificationText,
        ]
      );

      /* =========================
         REALTIME NOTIFICATION
      ========================= */

      io.emit(
        "new_notification",
        {
          type: "message",

          text:
            notificationText,
        }
      );

    } catch (err) {

      console.error(err);

    }

  }
);

    /* =========================
       TYPING
    ========================= */

    socket.on(
      "typing",
      (data) => {

        socket.to(
          `chat_${data.chatId}`
        ).emit(
          "user_typing",
          data
        );

      }
    );

    socket.on(
      "stop_typing",
      (data) => {

        socket.to(
          `chat_${data.chatId}`
        ).emit(
          "stop_typing",
          data
        );

      }
    );

    /* =========================
       START CALL
    ========================= */

    socket.on(
      "call_user",
      (data) => {

        const receiverSocketId =
          onlineUsers[
            data.receiverId
          ];

        if (
          receiverSocketId
        ) {

          io.to(
            receiverSocketId
          ).emit(
            "incoming_call",
            {
              callerId:
                data.callerId,

              callerName:
                data.callerName,

              receiverId:
                data.receiverId,

              type:
                data.type,

              offer:
                data.offer,
            }
          );

        }

      }
    );

    /* =========================
       ANSWER CALL
    ========================= */

    socket.on(
      "answer_call",
      (data) => {

        const callerSocketId =
          onlineUsers[
            data.callerId
          ];

        if (
          callerSocketId
        ) {

          io.to(
            callerSocketId
          ).emit(
            "call_answered",
            {
              answer:
                data.answer,
            }
          );

        }

      }
    );

    /* =========================
       ICE CANDIDATES
    ========================= */

    socket.on(
      "ice_candidate",
      (data) => {

        const targetSocketId =
          onlineUsers[
            data.targetUserId
          ];

        if (
          targetSocketId
        ) {

          io.to(
            targetSocketId
          ).emit(
            "ice_candidate",
            {
              candidate:
                data.candidate,
            }
          );

        }

      }
    );

    /* =========================
       END CALL
    ========================= */

    socket.on(
      "end_call",
      (data) => {

        const targetSocketId =
          onlineUsers[
            data.targetUserId
          ];

        if (
          targetSocketId
        ) {

          io.to(
            targetSocketId
          ).emit(
            "call_ended"
          );

        }

      }
    );

    /* =========================
       REJECT CALL
    ========================= */

    socket.on(
      "reject_call",
      (data) => {

        const callerSocketId =
          onlineUsers[
            data.callerId
          ];

        if (
          callerSocketId
        ) {

          io.to(
            callerSocketId
          ).emit(
            "call_rejected"
          );

        }

      }
    );

    /* =========================
       DISCONNECT
    ========================= */

    socket.on(
      "disconnect",
      async () => {

        console.log(
          "User disconnected:",
          socket.id
        );

        if (
          socket.userId
        ) {

          delete onlineUsers[
            socket.userId
          ];

          try {

            await pool.query(
              `
              UPDATE users
              SET status = $1
              WHERE id = $2
            `,
              [
                "Offline",
                socket.userId,
              ]
            );

          } catch (err) {

            console.error(err);

          }

          io.emit(
            "online_status",
            {
              userId:
                socket.userId,

              online: false,
            }
          );

        }

      }
    );

  }
);

/* ===================================
   SERVER
=================================== */

const PORT =
  process.env.PORT || 3001;

server.listen(
  PORT,
  () => {

    console.log(
      `Swala server running on port ${PORT}`
    );

  }
);