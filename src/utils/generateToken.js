import jwt from "jsonwebtoken"

export const generateAccessToken = async (userId)=>{
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: "15m"}
    )
}


export const generateRefreshToken = async (userId)=>{
    return jwt.sign(
        {userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "7d"}
    )
}

