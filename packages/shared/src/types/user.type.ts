import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;

  githubId: string;

  email: string | null;

  username: string;

  name: string;

  avatarUrl: string;

  provider: 'github';

  createdAt: Date;

  updatedAt: Date;
}
