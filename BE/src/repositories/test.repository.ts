import { BaseRepository } from './base.repository';
import { Test } from '../models';

export class TestRepository extends BaseRepository<Test> {
  constructor() {
    super('tests');
  }
}
