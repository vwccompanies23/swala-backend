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
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get(
  "/users/search",
  async (req, res) => {

    try {

      const search =
        req.query.search;

      if (!search) {

        return res.json([]);

      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            username,
            phone,
            profile_picture,
            bio
          FROM users
          WHERE
            username ILIKE $1
            OR phone ILIKE $1
          LIMIT 50
          `,
          [`%${search}%`]
        );

      res.json(
        result.rows
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to search users",
      });

    }

  }
);

app.post(
  "/create-chat",
  async (req, res) => {

    try {

      const {
        user1,
        user2,
      } = req.body;

      const existing =
        await pool.query(
          `
          SELECT c.id

          FROM chats c

          JOIN chat_members m1
          ON c.id = m1.chat_id

          JOIN chat_members m2
          ON c.id = m2.chat_id

          WHERE
            c.is_group = false
            AND m1.user_id = $1
            AND m2.user_id = $2
          `,
          [user1, user2]
        );

      if (
        existing.rows.length
      ) {

        return res.json({
          chatId:
            existing.rows[0].id,
        });

      }

      const chat =
        await pool.query(
          `
          INSERT INTO chats
          (is_group)

          VALUES
          (false)

          RETURNING id
          `
        );

      const chatId =
        chat.rows[0].id;

      await pool.query(
        `
        INSERT INTO chat_members
        (
          chat_id,
          user_id
        )
        VALUES
        ($1,$2),
        ($1,$3)
        `,
        [
          chatId,
          user1,
          user2,
        ]
      );

      res.json({
        chatId,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to create chat",
      });

    }

  }
);

/* ===================================
   CREATE TABLES
=================================== */

async function createTables() {

  try {

    /* USERS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        bio TEXT DEFAULT '',
        status TEXT DEFAULT 'Offline',
        profile_picture TEXT,
        cover_photo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* CHATS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        is_group BOOLEAN DEFAULT false,
        group_name TEXT,
        group_photo TEXT,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* CHAT MEMBERS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_members (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    /* MESSAGES */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT,
        message_type TEXT DEFAULT 'text',
        voice_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* WORLD POSTS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS world_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        caption TEXT,
        media_url TEXT,
        media_type TEXT,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      )
    `);

    /* NOTIFICATIONS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type TEXT,
        text TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log(
      "Database tables ready 🚀"
    );

  } catch (err) {

    console.error(
      "TABLE ERROR:",
      err
    );

  }

}

createTables();

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

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

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

      const token =
        jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRET,
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

      const token =
        jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRET,
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
            phone,
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
              AS other_profile_picture

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

      console.log(
        "WORLD POSTS ROUTE HIT"
      );

      const result = await pool.query(`
        SELECT
          id,
          user_id,
          caption,
          media_url,
          media_type,
          views,
          created_at,
          expires_at
        FROM world_posts
        ORDER BY created_at DESC
      `);

      console.log(
        "WORLD POSTS SUCCESS:",
        result.rows
      );

      return res.json(
        result.rows
      );

    } catch (err) {

      console.error(
        "WORLD POSTS FULL ERROR:",
        err.message
      );

      return res.status(500).json({
        error:
          "Failed to load world posts",
      });

    }

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