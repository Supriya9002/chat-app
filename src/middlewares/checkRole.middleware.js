import UserModel from "../models/user.model";

const checkRole = async (Role) => {
  return async (req, res, next) => {
    try {
      const userid = req.userID;
      const user = await UserModel.findOne({ _id: userid });
      if (!user || user.role !== Role) {
        res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default checkRole;
