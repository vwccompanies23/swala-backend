const pool = require("../../config/db");

const createCall = async (req, res) => {

  try {

    const {
      caller_id,
      receiver_id,
      call_type,
      is_group_call = false,
      group_id = null,
    } = req.body;

    /*
    ==========================================
    VALIDATION
    ==========================================
    */

    if (!caller_id || !call_type) {

      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });

    }

    if (!is_group_call && !receiver_id) {

      return res.status(400).json({
        success: false,
        message: "Receiver is required.",
      });

    }

    if (!["voice", "video"].includes(call_type)) {

      return res.status(400).json({
        success: false,
        message: "Invalid call type.",
      });

    }

    if (!is_group_call && caller_id === receiver_id) {

      return res.status(400).json({
        success: false,
        message: "You cannot call yourself.",
      });

    }

    console.log(`📞 Creating ${call_type} call`);

    /*
    ==========================================
    CREATE CALL
    ==========================================
    */

   let result;

   if (is_group_call) {

     result = await pool.query(
       `
       INSERT INTO calls
       (
         caller_id,
         receiver_id,
         call_type,
         initiated_by
       )
       VALUES
       ($1,NULL,$2,$1)
       RETURNING *;
       `,
       [
         caller_id,
         call_type,
       ],
     );

   } else {

     result = await pool.query(
       `
       INSERT INTO calls
       (
         caller_id,
         receiver_id,
         call_type,
         initiated_by
       )
       VALUES
       ($1,$2,$3,$1)
       RETURNING *;
       `,
       [
         caller_id,
         receiver_id,
         call_type,
       ],
     );

   }
    /*
    ==========================================
    CREATE CALL HISTORY
    ==========================================
    */

   await pool.query(
   `
   INSERT INTO call_history
   (
   call_id,
   caller_id,
   receiver_id,
   call_type,
   status,
   duration,
   initiated_by,
   started_at
   )
   VALUES
   ($1,$2,$3,$4,'ringing',0,$2,CURRENT_TIMESTAMP);
   `,
   [
   result.rows[0].id,
   caller_id,
   is_group_call ? null : receiver_id,
   call_type,
   ],
   );

    /*
    ==========================================
    GET CALLER
    ==========================================
    */

    const callerResult = await pool.query(

      `
      SELECT
        id,
        full_name,
        username,
        profile_image
      FROM users
      WHERE id=$1;
      `,

      [

        caller_id,

      ],

    );

    /*
    ==========================================
    GET RECEIVER
    ==========================================
    */

    let receiverResult = {

      rows: [],

    };

    if (!is_group_call) {

      receiverResult = await pool.query(

        `
        SELECT
          id,
          full_name,
          username,
          profile_image
        FROM users
        WHERE id=$1;
        `,

        [

          receiver_id,

        ],

      );

    }

    console.log("✅ Call created");

    res.status(201).json({

      success: true,

      message: "Call created successfully.",

      call: result.rows[0],

      caller: callerResult.rows[0],

      receiver: receiverResult.rows[0] ?? null,

      callerName:
          callerResult.rows[0]?.full_name ?? "",

      callerUsername:
          callerResult.rows[0]?.username ?? "",

      callerPhoto:
          callerResult.rows[0]?.profile_image ?? "",

      receiverName:
          receiverResult.rows[0]?.full_name ?? "",

      receiverUsername:
          receiverResult.rows[0]?.username ?? "",

      receiverPhoto:
          receiverResult.rows[0]?.profile_image ?? "",

      isGroupCall: is_group_call,

      groupId: group_id,

    });

  } catch (error) {

    console.error("❌ Create Call Error");

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to create call.",

      error: error.message,

    });

  }

};

module.exports = createCall;