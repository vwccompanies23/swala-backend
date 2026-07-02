const userRepository =
require("../../repositories/userRepository");

const me = async (req, res) => {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                error: "Unauthorized",

            });

        }

        const user = await userRepository.findById(

            req.user.id,

        );

        if (!user) {

            return res.status(404).json({

                success: false,

                error: "User not found",

            });

        }

        return res.json({

            success: true,

            user: {

                id: user.id,

                full_name: user.full_name,

                username: user.username,

                phone: user.phone,

                email: user.email,

                profile_image: user.profile_image,

                bio: user.bio,

                language: user.language,

                country: user.country,

                is_verified: user.is_verified,

            },

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

module.exports = me;