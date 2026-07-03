const pool = require('../../config/db');

const getGroups = async (req, res) => {
  try {

   const result = await pool.query(`
   SELECT
       g.*,

       (
         SELECT gm.message
         FROM group_messages gm
         WHERE gm.group_id = g.id
         ORDER BY gm.created_at DESC
         LIMIT 1
       ) AS last_message,

       (
         SELECT gm.created_at
         FROM group_messages gm
         WHERE gm.group_id = g.id
         ORDER BY gm.created_at DESC
         LIMIT 1
       ) AS last_time

   FROM groups g
   ORDER BY g.created_at DESC
   `);

    res.json({
      success: true,
      groups: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports =
getGroups;