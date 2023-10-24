export const HASH_SALT_ROUNDS = 10;

// atleast 8 chars, 1 letter and 1 number
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const IS_PUBLIC_KEY = 'isPublic';
