import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Video } from '@/entities';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Video],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User, Video]),
];