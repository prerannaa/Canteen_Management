import jsonwebtoken from "jsonwebtoken";

export const assignToken =  (payload: any) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY as string);
};

export const verifyToken = ( token: any) => {
    return jsonwebtoken.verify(token,process.env.JWT_SECRET_KEY as string);
}  