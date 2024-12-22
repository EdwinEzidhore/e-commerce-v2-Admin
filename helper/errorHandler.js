export function throwError(message, status) {
    const error = new Error(message) || "Unexpected error occured! Try again...";
    error.status = status || 500;
    throw (error);
}