export interface IErrorException {
  statusCode: number;
  message: string;
  data?: Record<string, any>;
}