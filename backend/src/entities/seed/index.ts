import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';


@Injectable()
export class SeedingService {
  private seedData: any[];
  constructor(
    private readonly entityManager: EntityManager,
  ) {

  }

  async seed(): Promise<void> {

  }

}