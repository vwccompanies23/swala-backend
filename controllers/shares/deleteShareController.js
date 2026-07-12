const shareModel =
require("../../models/shares/shareModel");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const deleteShareController = async (req, res) => {

    try {

        const { shareId } = req.params;

        const {

            user_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (

            !shareId ||

            !user_id

        ) {

            return res.status(400).json({

                success: false,

                error:
                "shareId and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // FIND SHARE
        //////////////////////////////////////////////////////

        const share =

            await shareModel.getShare(

                shareId,

            );

        if (!share) {

            return res.status(404).json({

                success: false,

                error:
                "Share not found",

            });

        }

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (

            Number(share.user_id) !==

            Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error:
                "You are not allowed to delete this share",

            });

        }

        //////////////////////////////////////////////////////
        // DELETE SHARE
        //////////////////////////////////////////////////////

        await shareModel.deleteShare(

            shareId,

        );

        //////////////////////////////////////////////////////
        // TOTAL SHARES
        //////////////////////////////////////////////////////

        const sharesCount =

            await shareModel.countShares(

                share.post_id,

            );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postShare({

            action: "deleted",

            postId:
            Number(share.post_id),

            shareId:
            Number(shareId),

            shares:
            sharesCount,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            shareId:
            Number(shareId),

            shares_count:
            sharesCount,

            message:
            "Share deleted successfully",

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error:
            error.message,

        });

    }

};

module.exports =
deleteShareController;