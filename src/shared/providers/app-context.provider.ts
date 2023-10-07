import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AppContext } from '../models/app-context.model';

@Injectable()
export class AppContextProvider extends AsyncLocalStorage<AppContext> {}
