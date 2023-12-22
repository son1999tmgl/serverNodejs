export const USER_MESSAGE = {
    NAME: {
        NOT_EMPTY: "Name is required",
        IS_STRING: "Name must be a string",
        LENGTH: "Name must be between 1 and 50 characters",
    },
    PASSWORD: {
        NOT_EMPTY: "Password is required",
        STRONG: "Password must be strong with a minimum length of 6 characters",
    },
    CONFIRM_PASSWORD: {
        NOT_EMPTY: "Confirm password is required",
        MATCH: "Passwords do not match",
    },
    EMAIL: {
        NOT_EMPTY: "Email is required",
        IS_EMAIL: "Invalid email format",
        EXISTS: "Email already exists",
        EMAIL_OR_PASSWORD_FAIL: "Email or password is invalid"
    },
    DATE_OF_BIRTH: {
        ISO8601: "Date of birth must be in ISO8601 format",
    },
    ERROR_VALIDATION: "Data validation error",
    NOT_FOUND_USER: "User not found",
};
