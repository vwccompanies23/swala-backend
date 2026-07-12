const cron = require("node-cron");

const deleteExpiredPostsController =
require("../../controllers/posts/deleteExpiredPostsController");

//////////////////////////////////////////////////////
// START POST SCHEDULER
//////////////////////////////////////////////////////

const startPostScheduler = () => {

    //////////////////////////////////////////////////////
    // EVERY 5 MINUTES
    //////////////////////////////////////////////////////

    cron.schedule("*/5 * * * *", async () => {

        console.log("🗑 Checking expired posts...");

        try {

            await deleteExpiredPostsController(

                {},

                {

                    json: () => {},

                    status: () => ({

                        json: () => {},

                    }),

                },

            );

        }

        catch (error) {

            console.error(

                "Post Scheduler Error:",

                error,

            );

        }

    });

    console.log("✅ Post Scheduler started.");

};

module.exports = {

    startPostScheduler,

};