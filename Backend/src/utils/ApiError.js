class ApiError {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = [],
    ) {
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.error = error;
        this.success = false;

       
    }
}

export { ApiError };