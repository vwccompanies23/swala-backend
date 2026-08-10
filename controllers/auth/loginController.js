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

        console.log("================================");
        console.log("LOGIN REQUEST");
        console.log("PHONE FROM APP:", phone);

        const normalizedPhone =
            normalizePhone(phone);

        console.log(
            "NORMALIZED PHONE:",
            normalizedPhone,
        );

        //////////////////////////////////////////////////////
        // LOAD USERS
        //////////////////////////////////////////////////////

        const result = await pool.query(`
            SELECT *
            FROM users
        `);

        console.log(
            "TOTAL USERS:",
            result.rows.length,
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
                normalizePhone(row.phone) ===
                normalizedPhone
            ) {

                console.log(
                    "MATCH FOUND:",
                    row.id,
                );

                user = row;
                break;

            }

        }

        if (!user) {

            console.log("USER NOT FOUND");

            return res.status(404).json({

                success: false,

                error: "User not found",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY PASSWORD
        //////////////////////////////////////////////////////

        console.log("VERIFYING PASSWORD...");

        const passwordMatch =
            await passwordService.verify(

                password,

                user.password,

            );

        console.log(
            "PASSWORD MATCH:",
            passwordMatch,
        );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                error: "Invalid password",

            });

        }

        //////////////////////////////////////////////////////
        // CREATE LOGIN
        //////////////////////////////////////////////////////

        console.log("GETTING DEVICE...");

        req.device =
            deviceService.getDevice(req);

        console.log("DEVICE:", req.device);

        console.log("CREATING LOGIN...");

        const login =
            await authService.createLogin({

                user,

                req,

            });

        console.log("LOGIN CREATED");

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        const response = {

            success: true,

            accessToken:
                login.accessToken,

            refreshToken:
                login.refreshToken,

            user: {

                // Integer ID for Flutter
                id: user.app_id,

                // UUID for backend
                uuid: user.id,

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

        };

        console.log("LOGIN RESPONSE:");
        console.log(
            JSON.stringify(response, null, 2),
        );

        return res.json(response);

    } catch (error) {

        console.error("LOGIN ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports = loginUser;