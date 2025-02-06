import jwt from "jsonwebtoken";
import { Request } from "express";

export const getUserFromCookie = (cookiesStr: string) => {
  const cookies = cookiesStr.split(";") || [];
  const authCookie = cookies.find((cookie) => cookie.startsWith("token="));
  const token = authCookie?.split("=")[1].trim();

  const decodedToken = jwt.verify(
    token ?? "",
    process.env.JWT_SECRET!
  ) as jwt.JwtPayload & { userId: string };

  return decodedToken.userId;
};

export const getToken = (cookiesStr: string) => {
  const cookies = cookiesStr.split(";") || [];
  const authCookie = cookies.find((cookie) => cookie.startsWith("token="));
  const token = authCookie?.split("=")[1].trim();

  return token;
};
