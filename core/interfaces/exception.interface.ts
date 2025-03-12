export interface Exception {
  message: string;
  error: string | null;
  statusCode: number;
  cause?: string;
}
