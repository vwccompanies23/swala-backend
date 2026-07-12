const likeModel =
require("../../models/likes/likeModel");

const getPostLikesController = async (req, res) => {

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

        const likes = await likeModel.getPostLikes(

            postId,

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            total: likes.length,

            likes,

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

module.exports = getPostLikesController;