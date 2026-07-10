const cron = require("node-cron");
const pool = require("../../config/db");
const fs = require("fs");
const path = require("path");

const cleanExpiredStatuses = async () => {

    try {

        const result = await pool.query(

            `
            SELECT
                id,
                media_url
            FROM statuses
            WHERE expires_at <= NOW()
            `

        );

        for (const status of result.rows) {

            //////////////////////////////////////////////////////
            // DELETE MEDIA FILE
            //////////////////////////////////////////////////////

            if (status.media_url) {

                try {

                    const filePath = path.join(
                        __dirname,
                        "../../uploads/status",
                        path.basename(status.media_url)
                    );

                    if (fs.existsSync(filePath)) {

                        fs.unlinkSync(filePath);

                    }

                } catch (e) {

                    console.error("Status media delete error:", e);

                }

            }

            //////////////////////////////////////////////////////
            // DELETE STATUS
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM statuses
                WHERE id = $1
                `,

                [status.id]

            );

        }

        if (result.rows.length > 0) {

            console.log(`Deleted ${result.rows.length} expired statuses`);

        }

    } catch (error) {

        console.error("Status Scheduler Error:", error);

    }

};

//////////////////////////////////////////////////////
// RUN EVERY MINUTE
//////////////////////////////////////////////////////

const startStatusScheduler = () => {

    cron.schedule("* * * * *", async () => {

        await cleanExpiredStatuses();

    });

    console.log("Status Scheduler Started");

};

module.exports = {

    startStatusScheduler,

    cleanExpiredStatuses,

};