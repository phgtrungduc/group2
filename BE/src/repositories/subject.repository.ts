import { BaseRepository } from './base.repository';
import { Subject } from '../models';

export class SubjectRepository extends BaseRepository<Subject> {
  constructor() {
    super('subjects');
  }
}
