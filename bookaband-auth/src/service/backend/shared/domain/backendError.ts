export interface BackendError {
  statusCode: number;
  error: string;
  path: string;
  timestamp: string;
}
