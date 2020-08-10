import { Request, Response } from 'express';
import db from '../database/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
require('dotenv').config();

async function isEmailRegistered(email: string) {
  const emails = await db('users').where('users.email', '=', email);

  if (emails.length == 0) {
    return false;
  }

  return true;
}

export default class UsersController {
  async register(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    // ensure any item is not recieved
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "Incomplete data!"
      });
    }

    // verify if user is already registered
    if (await isEmailRegistered(email) === true) {
      return res.status(400).json({
        error: "Email already registered!"
      });
    }

    // hash password
    const hash = await bcrypt.hash(password, 8);

    try {

      await db('users').insert({
        firstName,
        lastName,
        email,
        hash
      })
      
      return res.status(201).json({
        "message": "New user registered with success! welcome to Proffy!"
      });
    } catch(err) {
      console.log(err);
      return res.status(500).json({
        "error": "Can not register new user. Try again later."
      })
    }
  }

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    // ensure any item is not recieved
    if (!email || !password) {
      return res.status(400).json({
        error: "Incomplete data!"
      });
    }

    const users = await db('users').where('users.email', '=', email);

    // if no user is found
    if (users.length === 0) {
      return res.status(400).json({
        error: "Email not registered! Please create your account!"
      });
    }

    // compare hash
    if (await bcrypt.compare(password, users[0].hash) == false ) {
      return res.status(400).json({
        error: "Password incorrect!"
      })
    };

    let token;

    // generate jwt token
    if (process.env.ACCESS_TOKEN_SECRET) {
      token = await jwt.sign({ id: users[0].id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400
      });
    }

    return res.json({
      token: token
    });
  }
}