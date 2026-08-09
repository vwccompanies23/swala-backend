const pool = require("../../config/db");

const passwordService =
require("../../services/auth/passwordService");

const authService =
require("../../services/auth/authService");

const deviceService =
require("../../services/auth/deviceService");

const registerController = async (req, res) => {

    try {

      const {

          full_name,

          phone,

          password,

      } = req.body;

      const username =
          "@" +
          full_name
              .toLowerCase()
              .replace(/\s+/g, "") +
          Math.floor(Math.random() * 10000);

      const email = null;

      const country = null;

      const language = "en";

        if (

            !full_name ||

            !phone ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields",

            });

        }

        const existingUser = await pool.query(

            `
            SELECT id
            FROM users
            WHERE phone = $1
               OR username = $2
            `,

            [

                phone,

                username,

            ],

        );

        if (existingUser.rows.length > 0) {

            return res.status(409).json({

                success: false,

                error: "User already exists",

            });

        }

        const hashedPassword =

            await passwordService.hash(

                password,

            );

        const result = await pool.query(

            `
            INSERT INTO users
            (
                full_name,
                username,
                phone,
                email,
                password,
                country,
                language,
                is_verified
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,FALSE
            )
            RETURNING *
            `,

            [

                full_name,

                username,

                phone,

                email,

                hashedPassword,

                country,

                language,

            ],

        );

        const user = result.rows[0];

        req.device =

            deviceService.getDevice(req);

        const login =

            await authService.createLogin({

                user,

                req,

            });

        return res.status(201).json({

            success: true,

            accessToken:

                login.accessToken,

            refreshToken:

                login.refreshToken,

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

       console.error("REGISTER ERROR");
       console.error(error);

       return res.status(500).json({
           success: false,
           error: error.message,
           stack: error.stack,
       });

   }

};

module.exports = registerController;