const pool = require('../../../config/db');

const createChannelPost = async (req, res) => {
  try {

    const {
      channel_id,
      author_id,
      content,
      media_url,
      media_type
    } = req.body;

    if (!channel_id || !author_id) {
      return res.status(400).json({
        success: false,
        message: 'channel_id and author_id are required.',
      });
    }

    if (!content && !media_url) {
      return res.status(400).json({
        success: false,
        message: 'A post must contain text or media.',
      });
    }

    const postResult = await pool.query(
      `
      INSERT INTO channel_posts
      (
        channel_id,
        author_id,
        content,
        media_url,
        media_type
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *;
      `,
      [
        channel_id,
        author_id,
        content,
        media_url,
        media_type
      ]
    );

    await pool.query(
      `
      UPDATE channels
      SET posts_count = posts_count + 1
      WHERE id = $1;
      `,
      [channel_id]
    );

    res.status(201).json({
      success: true,
      message: 'Channel post created successfully.',
      post: postResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to create channel post.',
      error: error.message,
    });

  }
};

module.exports = createChannelPost;