import { BaseRepository } from './base.repository';
import { Tuition } from '../models';

export class TuitionRepository extends BaseRepository<Tuition> {
  constructor() {
    super('tuition');
  }
}
