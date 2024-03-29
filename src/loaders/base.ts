import { EnvLoadError } from "./error";

export abstract class EnvOption<T> {
  private isOptional = false;
  private defaultValue: T | null = null;

  constructor(protected readonly envVar: string) {}

  optional(predicate = true): EnvOption<T> {
    if (predicate) {
      this.isOptional = true;
    }
    return this;
  }

  default(value: T): EnvOption<T> {
    this.defaultValue = value;
    return this;
  }

  protected abstract loadType(rawValue: string): T;

  load(): T {
    const envValue = process.env[this.envVar];
    if (envValue) {
      return this.loadType(envValue);
    } else if (this.isOptional) {
      return this.loadOptional();
    } else {
      throw new EnvLoadError(
        `Could not find "${this.envVar}" in the environment!`,
      );
    }
  }

  private loadOptional(): T {
    return this.defaultValue as unknown as T;
  }
}
