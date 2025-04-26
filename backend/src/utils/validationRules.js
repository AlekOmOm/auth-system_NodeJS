const NAME_RULES = {
  INPUT_TYPE: "string",
  MIN_LENGTH: 3,
  MAX_LENGTH: 50,
  REGEX: /^[a-zA-Z]+$/,
};

const EMAIL_RULES = {
  INPUT_TYPE: "string",
  MIN_LENGTH: 5,
  MAX_LENGTH: 50,
  REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const PASSWORD_RULES = {
  INPUT_TYPE: "string",
  MIN_LENGTH: 8,
  MAX_LENGTH: 100,
  UPPER_CASE: 1,
  LOWER_CASE: 1,
  DIGIT: 1,
};

const FIELD_REQUIRED = (field) => {
  return `${field} is required`;
};

export const ERROR_MESSAGES = {
  USER: {
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid credentials",
    PASSWORD_MISMATCH: "Password mismatch",
    DUPLICATE_EMAIL: "Email already in use",
    INVALID_EMAIL: "Invalid email",
    WEAK_PASSWORD: "Password is too weak",
    REQUIRED_FIELDS: "Required fields are missing",
    INVALID_NAME: "Name must be a string",
    INVALID_EMAIL: "Email must be a valid email address",
    INVALID_PASSWORD: "Password must be at least 8 characters long",
    FIELD_REQUIRED: FIELD_REQUIRED,
  },
  SESSION: {
    INVALID_SESSION: "Invalid session",
    SESSION_EXPIRED: "Session expired",
    SESSION_DESTROYED: "Session destroyed",
    SESSION_CREATED: "Session created",
    SESSION_DESTROYED: "Session destroyed",
  },
};
