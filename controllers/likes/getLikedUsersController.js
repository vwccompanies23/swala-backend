const likeModel =
require("../../models/likes/likeModel");

const getLikedUsersController = async (req, res) => {

    try {

        const { postId } = req.params;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!postId) {

            return res.status(400).json({

                success: false,

                error: "postId is required",

            });

        }

        //////////////////////////////////////////////////////
        // GET USERS
        //////////////////////////////////////////////////////

        const users =
        await likeModel.getPostLikes(

            postId,

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            count: users.length,

            users,

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
getLikedUsersController;