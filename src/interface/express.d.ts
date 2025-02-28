declare namespace Express {
    interface Request {
        errors?: {
            message: string;
            status: number;
        };
    }
}