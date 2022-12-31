import {decrypt} from "./Crypto";
export const RequestUserData = (token:string)=>{
    const access_token = decrypt(token);
};