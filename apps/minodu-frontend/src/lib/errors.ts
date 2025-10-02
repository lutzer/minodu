
class HttpError extends Error {
    code: Number
    message: string

    constructor( {code, message}: { code: number, message: string} ) {
        super()
        this.code = code
        this.message = message
    }
}

export { HttpError}