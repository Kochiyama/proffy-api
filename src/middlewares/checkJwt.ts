import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

export default function checkjwt(req: Request, res: Response, next: NextFunction) {
  // get authentication header
  const authHeader = <string>req.headers.authorization;

  // ensure header exists
  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  } 

  // ensure environment access variable secret exists
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(500).send({ error: "Internal authorization error!"})
  }

  // extract token from header
  const [schema, token] = authHeader.split(' ');

  let jwtPayload;

  try{
    jwtPayload = <any>jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch(err) {
    return res.status(401);
  }

  next();
}
