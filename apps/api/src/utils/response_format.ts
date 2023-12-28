/**
 * Standard response format for API calls
 */

import { ApiResponse } from "@/types";

export interface ApiResponseInput {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

export const apiResponse=({ success, message, data, error }: ApiResponseInput): ApiResponse => {
    return {
        success: success,
        message: message||"",
        data: data||null,
        error: error||""
    };
}