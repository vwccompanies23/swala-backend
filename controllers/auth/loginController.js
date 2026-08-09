const pool = require("../../config/db");

const passwordService =
require("../../services/auth/passwordService");

const authService =
require("../../services/auth/authService");

const deviceService =
require("../../services/auth/deviceService");

//////////////////////////////////////////////////////
// NORMALIZE PHONE
//////////////////////////////////////////////////////

const normalizePhone = (phone) => {

    if (!phone) return "";

    let value = phone.toString().trim();

    if (value.startsWith("00")) {
        value = "+" + value.substring(2);
    }

    value = value.replace(/[^\d+]/g, "");

    if (value.startsWith("+")) {

        value =
            "+" +
            value.substring(1).replace(/\+/g, "");

    } else {

        value =
            value.replace(/\+/g, "");

    }

    return value;

};

const loginUser = async (req, res) => {

    try {

        const {
            phone,
            password,
        } = req.body;

        console.log("PHONE FROM APP:", phone);

        const normalizedPhone = normalizePhone(phone);

        console.log("NORMALIZED PHONE:", normalizedPhone);

        //////////////////////////////////////////////////////
        // LOAD USERS
        //////////////////////////////////////////////////////

        const result = await pool.query(
            `
            SELECT *
            FROM users
            `
        );

        //////////////////////////////////////////////////////
        // FIND MATCH
        //////////////////////////////////////////////////////

        let user = null;

        for (const row of result.rows) {

            console.log(
                "DB PHONE:",
                row.phone,
                "NORMALIZED:",
                normalizePhone(row.phone),
            );

            if (
                normalizePhone(row.phone) === normalizedPhone
            ) {

                console.log("MATCH FOUND:", row.id);

                user = row;
                break;

            }

        }

        if (!user) {

            return res.status(404).json({

                success: false,

                error: "User not found",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY PASSWORD
        //////////////////////////////////////////////////////

        const passwordMatch =
            await passwordService.verify(

                password,

                user.password,

            );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                error: "Invalid password",

            });

        }

        //////////////////////////////////////////////////////
        // LOGIN
        //////////////////////////////////////////////////////

        req.device =
            deviceService.getDevice(req);

        const login =
            await authService.createLogin({

                user,

                req,

            });



        return res.json({

            success: true,

            accessToken:
                login.accessToken,

            refreshToken:
                login.refreshToken,

            user: {

                id: user.id,

                full_name:
                    user.full_name,

                username:
                    user.username,

                email:
                    user.email,

                phone:
                    user.phone,

                profile_image:
                    user.profile_image,

                bio:
                    user.bio,

                language:
                    user.language,

                country:
                    user.country,

                is_verified:
                    user.is_verified,

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

module.exports = loginUser;