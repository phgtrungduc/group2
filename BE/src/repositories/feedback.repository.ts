import { BaseRepository } from './base.repository';
import { Feedback } from '../models';

export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor() {
    super('feedbacks');
  }
}
