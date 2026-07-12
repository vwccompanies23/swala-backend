const pool = require("../../config/db");

const createCommentsTable = async () => {

    const query = `

        CREATE TABLE IF NOT EXISTS comments (

            id SERIAL PRIMARY KEY,

            post_id INTEGER NOT NULL,

            user_id INTEGER NOT NULL,

            parent_comment_id INTEGER,

            comment TEXT NOT NULL,

            edited BOOLEAN DEFAULT FALSE,

            is_deleted BOOLEAN DEFAULT FALSE,

            likes_count INTEGER DEFAULT 0,

            replies_count INTEGER DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_comment_post
            FOREIGN KEY (post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE,

            CONSTRAINT fk_comment_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

            CONSTRAINT fk_parent_comment
            FOREIGN KEY (parent_comment_id)
            REFERENCES comments(id)
            ON DELETE CASCADE

        );

    `;

    try {

        await pool.query(query);

        console.log(
            "Comments table ready",
        );

    }

    catch (error) {

        console.error(error);

    }

};

module.exports =
createCommentsTable;