const fs = require("fs");
const path = require("path");

const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const deleteMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        //////////////////////////////////////////////////////
        // FIND MESSAGE
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT *
            FROM messages
            WHERE id = $1
            `,

            [messageId],

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Message not found",

            });

        }

        const message =
            result.rows[0];

        //////////////////////////////////////////////////////
        // DELETE UPLOADED FILE
        //////////////////////////////////////////////////////

        if (message.media_url) {

            try {

                const url =
                    new URL(message.media_url);

                const filePath = path.join(

                    process.cwd(),

                    decodeURIComponent(
                        url.pathname.substring(1),
                    ),

                );

                if (fs.existsSync(filePath)) {

                    fs.unlinkSync(filePath);

                    console.log(
                        "Deleted media:",
                        filePath,
                    );

                }

            }

            catch (e) {

                console.log(
                    "Media delete skipped",
                    e.message,
                );

            }

        }

        //////////////////////////////////////////////////////
        // DELETE DATABASE RECORD
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE
            FROM messages
            WHERE id = $1
            `,

            [messageId],

        );

       //////////////////////////////////////////////////////
       // FIND CHAT PARTICIPANTS
       //////////////////////////////////////////////////////

       const chat = await pool.query(

           `
           SELECT
               user_one_id,
               user_two_id
           FROM chats
           WHERE id = $1
           `,

           [
               message.chat_id,
           ],

       );

       //////////////////////////////////////////////////////
       // SEND DELETE EVENT TO EVERYONE
       //////////////////////////////////////////////////////

       if (chat.rows.length > 0) {

           const participants = [

               chat.rows[0].user_one_id,

               chat.rows[0].user_two_id,

           ];

           for (const userId of participants) {

               eventDispatcher.deleteMessage({

                   receiverId: userId,

                   messageId: Number(messageId),

               });

           }

       }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            messageId,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports =
deleteMessage;