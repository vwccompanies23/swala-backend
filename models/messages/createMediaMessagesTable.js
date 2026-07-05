const db =
require("../../config/db");

async function createMediaMessagesTable() {

    await db.query(

        `

        CREATE TABLE IF NOT EXISTS media_messages (

            id SERIAL PRIMARY KEY,

            message_id INTEGER NOT NULL

                REFERENCES messages(id)

                ON DELETE CASCADE,

            chat_id INTEGER NOT NULL,

            sender_id INTEGER NOT NULL,


            media_type VARCHAR(30)

                NOT NULL,

            file_name TEXT,

            original_name TEXT,

            file_path TEXT NOT NULL,

            file_url TEXT NOT NULL,

            mime_type TEXT,

            file_size BIGINT DEFAULT 0,

            duration INTEGER DEFAULT 0,

            thumbnail_url TEXT DEFAULT '',


                        image_width INTEGER DEFAULT 0,

                        image_height INTEGER DEFAULT 0,



                        video_width INTEGER DEFAULT 0,

                        video_height INTEGER DEFAULT 0,

                        video_fps INTEGER DEFAULT 0,



                        audio_bitrate INTEGER DEFAULT 0,

                        audio_sample_rate INTEGER DEFAULT 0,

                        audio_channels INTEGER DEFAULT 0,



                        document_pages INTEGER DEFAULT 0,



                        gif_width INTEGER DEFAULT 0,

                        gif_height INTEGER DEFAULT 0,



                        sticker_pack TEXT DEFAULT '',

                        sticker_name TEXT DEFAULT '',



                        latitude DOUBLE PRECISION DEFAULT 0,

                        longitude DOUBLE PRECISION DEFAULT 0,



                        contact_name TEXT DEFAULT '',

                        contact_phone TEXT DEFAULT '',



                        poll_question TEXT DEFAULT '',

                        poll_options JSONB DEFAULT '[]'::jsonb,



                                    checksum TEXT DEFAULT '',

                                    encryption_key TEXT DEFAULT '',

                                    is_encrypted BOOLEAN DEFAULT FALSE,



                                    upload_status VARCHAR(20)

                                        DEFAULT 'completed',



                                    metadata JSONB

                                        DEFAULT '{}'::jsonb,



                                    created_at TIMESTAMP

                                        DEFAULT CURRENT_TIMESTAMP,

                                    updated_at TIMESTAMP

                                        DEFAULT CURRENT_TIMESTAMP

                                );



                                CREATE INDEX IF NOT EXISTS
                                idx_media_message_id
                                ON media_messages(message_id);

                                CREATE INDEX IF NOT EXISTS
                                idx_media_chat_id
                                ON media_messages(chat_id);

                                CREATE INDEX IF NOT EXISTS
                                idx_media_sender_id
                                ON media_messages(sender_id);

                                CREATE INDEX IF NOT EXISTS
                                idx_media_type
                                ON media_messages(media_type);

                                CREATE INDEX IF NOT EXISTS
                                idx_media_created
                                ON media_messages(created_at);

                                `

                            );

                            console.log(

                                "✅ media_messages table ready."

                            );

                        }

                        module.exports =
                        createMediaMessagesTable;