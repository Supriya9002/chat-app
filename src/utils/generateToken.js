import jwt from "jsonwebtoken"

const generateAccessToken = async (userId){
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: "15m"}
    )
}


const generateRefreshToken = async (userId){
    return jwt.sign(
        {userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "7d"}
    )
}

