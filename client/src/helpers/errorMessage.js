function errorMessage(obj) {
    let msg = '';
    if(obj.message) {
        msg = obj.message;
    } else if(obj.email) {
        msg = obj.email
    } else if(obj.password) {
        msg = obj.password
    } else if(obj.firstName) {
        msg = obj.firstName
    } else if(obj.lastName) {
        msg = obj.lastName
    }
    return msg;
}

export default errorMessage;