export default class ErrorHandling extends Error{
    constructor(msg,statusCode){
        super(msg)
        this.statusCode=statusCode
        Error.captureStackTrace(this,this.constructor);
    }
}