import { Injectable } from '@nestjs/common';
import jwt_decode from "jwt-decode";



@Injectable()
export class AuthService {
  constructor() {}

  // Summary : Upload File to crespective DMS 
  // Created By : Don C Varghese
  async getTokenUser(token) {
    try{
        const  decoded = jwt_decode(token);
        const username = decoded['preferred_username'];
        return username;
    
  } catch (err) {
    console.log(err.message);
  }
  }
}
