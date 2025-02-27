//APIError.ts

export class APIError extends Error {
    public code: number;
    public userGuidance?: string;
  
    constructor(code: number, message: string, userGuidance?: string) {
      super(message);
      this.code = code;
      this.userGuidance = userGuidance;
    }
  }

  