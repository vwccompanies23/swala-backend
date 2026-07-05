const pool = require("../../config/db");

class MediaRetrievalService {

    //////////////////////////////////////////////////////
    // GET MEDIA FOR ONE MESSAGE
    //////////////////////////////////////////////////////

    async getMedia(messageId) {

        const result = await pool.query(

            `
            SELECT *
            FROM media_messages
            WHERE message_id = $1
            LIMIT 1
            `,

            [

                messageId,

            ],

        );

        return result.rows[0] || null;

    }

    //////////////////////////////////////////////////////
    // ATTACH MEDIA TO MESSAGE
    //////////////////////////////////////////////////////

    async attachMedia(message) {

        const media =
            await this.getMedia(message.id);

        return {

            ...message,

            media,

        };

    }

    //////////////////////////////////////////////////////
    // ATTACH MEDIA TO CHAT
    //////////////////////////////////////////////////////

    async attachMediaToMessages(messages) {

        const result = [];

        for (const message of messages) {

            result.push(

                await this.attachMedia(

                    message,

                ),

            );

        }

        return result;

    }

}

module.exports =
new MediaRetrievalService();