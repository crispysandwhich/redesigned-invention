
import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export interface JWTPayload {
  userId: string;
  role: string;
  username?: string;
  metaAddress?: string | null;
}

export const createToken = (payload: JWTPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// Doesnt work through middle ware
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.log(error, "in the JWT")
    return null;
  }
};



export async function verifyTokenEdge(token: any) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}