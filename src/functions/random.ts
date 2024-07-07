/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */

export const generateRandomPassword = (length = 10) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};

export const generateRandomId = (length = 8) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        randomId += charset.charAt(Math.floor(Math.random() * n));
    }
    return randomId;
};
