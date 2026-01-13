import { BaseRepository } from './base.repository';
import { Score } from '../models';

export class ScoreRepository extends BaseRepository<Score> {
  constructor() {
    super('scores');
  }
}
