export interface User {
    id: number;
    fullName: string;
    birthdate: string;
    password: string;
    balance: number;
    role: string;
    createdBy: number;
    createdAt: Date;
}