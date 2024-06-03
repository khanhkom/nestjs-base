export const PAGE_SIZE_DEFAULT = 10;

export const PASSWORD_SALT_ROUNDS = 10;

const SENSITIVE_FIELDS = ['password', 'authorization', 'token', 'refreshToken'];

type SensitiveReplacement = {
  REGEX: string | RegExp;
  REPLACER: (substring: string, ...args: unknown[]) => string;
};

const SENSITIVE_FIELDS_REPLACEMENT: SensitiveReplacement = {
  REGEX: new RegExp(SENSITIVE_FIELDS.map((field) => `(?<${field}>"${field}":".*?")`).join('|'), 'gim'),
  REPLACER: (...args: unknown[]): string => {
    const namedGroups = args.pop() as object;
    const [key] = Object.entries(namedGroups).find(([, value]) => value !== undefined) as [string, unknown];
    return `"${key}":"[MASKED]"`;
  },
};

const SENSITIVE_DATA_REPLACEMENT: SensitiveReplacement = {
  REGEX: /\$2[ayb]\$.{56}/gim,
  REPLACER: () => '[MASKED]',
};

export const SENSITIVE_REPLACEMENTS: SensitiveReplacement[] = [
  SENSITIVE_FIELDS_REPLACEMENT,
  SENSITIVE_DATA_REPLACEMENT,
];
