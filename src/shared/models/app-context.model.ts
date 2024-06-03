import { AuthenticatedUser } from './authenticated-user.model';

export class AppContextData {
  user?: AuthenticatedUser;
}

export class AppContext {
  public readonly executionId: string;
  public readonly startAt: number;
  public readonly data: AppContextData;

  constructor(executionId: string) {
    this.executionId = executionId;
    this.startAt = Date.now();
    this.data = new AppContextData();
  }
}
