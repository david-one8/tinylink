import { z } from 'zod';

const URL_REGEX = /^https?:\/\/.+\..+/i;
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export const createLinkSchema = z.object({
  targetUrl: z
    .string()
    .min(1, 'URL is required')
    .regex(URL_REGEX, 'Invalid URL format. Must start with http:// or https://'),
  customCode: z
    .string()
    .regex(CODE_REGEX, 'Code must be 6-8 alphanumeric characters')
    .optional()
    .or(z.literal('')),
});

export const codeParamSchema = z.object({
  code: z.string().regex(CODE_REGEX, 'Invalid code format'),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
