export type RateLimitConfig = {
  max: number;
  windowSeconds: number;
  isAuthenticated?: boolean;
};
