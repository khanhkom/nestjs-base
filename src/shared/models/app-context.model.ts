import { AuthenticatedUser } from './authenticated-user.model';

export class AppContextData {
  user?: AuthenticatedUser;
}

export class AppContext {
  public readonly executionId: string;
  public readonly data: AppContextData;

  constructor(executionId: string) {
    this.executionId = executionId;
    this.data = new AppContextData();
  }
}
