// to check if the user is admin or not

import { NextFunction, Request, Response } from "express";
import { jwtVerify, JWTPayload } from "jose";


export interface AuthenticatedRequest extends Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
// 1) phle h token verify kr rhe hai 
  export const authenticateJwt = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json({ success: false, error: "Access token is not present" });
      return;
    }
  
    jwtVerify(accessToken, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
      .then((res) => {
        const payload = res.payload as JWTPayload & {
          userId: string;
          email: string;
          role: string;
        };
  
        req.user = {//this is the user object that will be used in the controller
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
        next();
      })
      .catch((e) => {
        console.error(e);
        res
          .status(401)
          .json({ success: false, error: "Access token is not present" });
      });
  };
//2) jo token verify hua hai vo super admin hai ki nhi
  export const isSuperAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user && req.user.role === "SUPER_ADMIN") {
      next();
    } else {
      res
        .status(403)
        .json({
          success: false,
          error: "Access denied! Super admin access required",
        });
    }
  };