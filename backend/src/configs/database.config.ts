import { registerAs } from '@nestjs/config';

import { IDatabase, IDatabaseHost } from './interface';
import { read } from 'fs';

export default registerAs(
  'database',
  (): IDatabase => {
    let readDbs: IDatabaseHost[] = [];
    let i: number = 1;
    let fetch: boolean = true;
    do {
      if (process.env[`DATABASE_READ_DB_NAME_${i}`] &&
        process.env[`DATABASE_READ_USER_${i}`] &&
        process.env[`DATABASE_READ_PASSWORD_${i}`] &&
        process.env[`DATABASE_READ_HOST_${i}`] &&
        process.env[`DATABASE_READ_PORT_${i}`]) {
        readDbs.push({
          database: process.env[`DATABASE_READ_DB_NAME_${i}`],
          username: process.env[`DATABASE_READ_USER_${i}`],
          password: process.env[`DATABASE_READ_PASSWORD_${i}`],
          host: process.env[`DATABASE_READ_HOST_${i}`],
          port: Number(process.env[`DATABASE_READ_PORT_${i}`]),
        });
        i++;
      }
      else {
        fetch = false;
      }
    } while (fetch);

    return {
      master: {
        host: process.env.DATABASE_WRITE_HOST,
        port: Number(process.env.DATABASE_WRITE_PORT),
        username: process.env.DATABASE_WRITE_USER,
        password: process.env.DATABASE_WRITE_PASSWORD,
        database: process.env.DATABASE_WRITE_DB_NAME,
      },
      slaves: readDbs
    };
  }
);
