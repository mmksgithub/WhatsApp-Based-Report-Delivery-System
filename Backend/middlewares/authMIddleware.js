import asyncHandler from "express-async-handler";
import member from "../models/memberModel.js";
import localBranch from "../models/localBrModel.js";
import stateBranch from "../models/stateBrModel.js";
import headQuarter from "../models/headquarterModel.js";
import jwt from "jsonwebtoken";

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await member.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.status === "suspended") {
      res.status(400);
      throw new Error("User suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error.message);
  }
});

const stateProtect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await stateBranch.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.status === "suspended") {
      res.status(400);
      throw new Error("User suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error.message);
  }
});

const localProtect = asyncHandler(async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];

    // console.log("token in headQuarterProtect", token);
    // console.log("req headers in headQuarterProtect", req.headers);
    // console.log(
    //   "req headers  authorization in headQuarterProtect",
    //   req.headers.authorization
    // );

    // console.log("req. headQuarterProtect ", req);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await localBranch.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.status === "suspended") {
      res.status(400);
      throw new Error("User suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error.message);
  }
});

const branchProtect = (req, res, next) => {
  const allowedBranches = ["headquarter", "statebranch", "localbranch"];

  console.log("re user in branchProtect", req.user);

  if (!allowedBranches.includes(req.user.branchType)) {
    console.log("branch Type", req.user.branchType);
    return res
      .status(403)
      .json({ message: "Access denied. User not authorized for this branch." });
  }
  next();
};

const headQuarterProtect = asyncHandler(async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    // console.log("req. headQuarterProtect ", req);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await headQuarter.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.status === "suspended") {
      res.status(400);
      throw new Error("User suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error.message);
  }
});

const verifiedOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, account not verified");
  }
});

const authorOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role === "author" || req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an author");
  }
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

export {
  protect,
  verifiedOnly,
  authorOnly,
  adminOnly,
  stateProtect,
  localProtect,
  headQuarterProtect,
  branchProtect,
};
