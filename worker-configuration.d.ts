// Cloudflare Worker types
declare global {
  // Console for logging
  const console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };

  // File API
  interface File {
    readonly name: string;
    readonly size: number;
    readonly type: string;
    arrayBuffer(): Promise<ArrayBuffer>;
  }

  // Headers API
  class Headers {
    constructor(init?: HeadersInit);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
  }

  type HeadersInit = string[][] | Record<string, string> | Headers;

  // FormData API
  interface FormData {
    append(name: string, value: string | Blob, fileName?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string | Blob, fileName?: string): void;
    forEach(callbackfn: (value: FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
  }

  type FormDataEntryValue = File | string;

  // D1 Database
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    all(): Promise<D1Result>;
    first(): Promise<any>;
    run(): Promise<D1Result>;
  }

  interface D1Result {
    results?: any[];
    meta: {
      last_row_id: number;
      changes: number;
      duration: number;
    };
  }

  // R2 Storage
  interface R2Bucket {
    put(key: string, data: ArrayBuffer | ReadableStream, options?: any): Promise<void>;
    get(key: string): Promise<R2Object | null>;
    delete(key: string): Promise<void>;
  }

  interface R2Object {
    body: ReadableStream;
    httpEtag: string;
    writeHttpMetadata(headers: Headers): void;
  }
}

interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  RESEND_API_KEY?: string;
  MOCHA_USERS_SERVICE_API_URL?: string;
  MOCHA_USERS_SERVICE_API_KEY?: string;
}
