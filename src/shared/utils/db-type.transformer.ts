import { ValueTransformer } from 'typeorm';

export const dateTransformer: ValueTransformer = {
  from: (value: string | number) => new Date(value),
  to: (value: Date) => value,
};
