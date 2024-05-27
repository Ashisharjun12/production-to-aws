import { config as conf } from "dotenv";

conf()

const _config = {

    port : process.env.PORT,
    mongourl:process.env.MONGO_URI,
    env:process.env.NODE_ENV,
    jwtsecret:process.env.JWT_SECRET,
    cloudinary_name:process.env.CLOUDINARY_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET_KEY,
    domain:process.env.DOMAIN

}

export const config = Object.freeze(_config);

