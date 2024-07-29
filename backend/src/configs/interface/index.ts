export interface IApp {
  name: string,
  description?: string,
  version: string,
  port: number,
  rateLimit: number,
  corsOrigin: string,
  enableDoc?: boolean,
  docUser: string,
  docPassword: string,
  languages: string[],
  defaultLanguage: string,
  recaptchaSecret: string,
  emailExpireAt: number,

}

export interface IAuth {
  jwtSecretKey: string,
  jwtRefreshSecretKey: string,
  jwtExpiresIn: number,
  jwtRefreshExpiresIn: number,
  saltRound: number,
  signOption?: any,
  google: {
    id: string,
    secret: string,
    redirectUrl: string,
  }
}

export interface IMail {
  usingAws: boolean;
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  mailHost?: string;
  mailUser?: string;
  mailPassword?: string;
  mailForm?: string;
  sibKey?: string
}

export interface IRedis {
  host: string;
  port: number;
  db: number;
}

export interface IDatabaseHost {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  options?: any;
}

export interface IDatabase {
  master: IDatabaseHost;
  slaves: IDatabaseHost[];
}