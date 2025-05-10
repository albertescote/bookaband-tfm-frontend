export interface ParsedCookie {
  name: string;
  value: string;
  options: Record<string, string | boolean>;
}
