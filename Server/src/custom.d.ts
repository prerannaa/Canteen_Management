//Req interface/obj from express will have admin property of type any
declare namespace Express {
    export interface Request{
        admin: any;
        user: any;
        categories: any;
        items: any;
    }
}