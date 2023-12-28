export interface User {
    username: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
    error: string;
}