import { Response, Request, ErrorRequestHandler, NextFunction } from "express";


export class AppError extends Error{
    code: number;

    constructor(code: number,message: string){
        super();
        this.code = code;
        this.message = message;
        this.stack  = process.env.NODE_ENV  === "production"? "" : this.stack;
    }
}
export const errorHandler: ErrorRequestHandler = (
    error: any | AppError,
    req: Request,
    res: Response
) => {
    const code = error.code || 500;
    const message = error.message;
    console.log(error);

    if(!(error instanceof AppError)){
        return res.status(code).send({
            message: "Internal Server Error",
            success: false,
            data: null
        })
    }

    res.status(code).send({
        message,
        success: false,
        data: null
    })
}