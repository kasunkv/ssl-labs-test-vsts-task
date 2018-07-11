import { Container } from 'inversify';
import 'reflect-metadata';

import { ISslLabsService } from '../interfaces/ISslLabsService';
import { ITaskInput } from './../interfaces/ITaskInput';
import { ILogger } from '../interfaces/ILogger';

import TYPES from './types';

import { SslLabsService } from '../SslLabsService';
import { TaskInput } from './../TaskInput';
import { Logger } from '../Logger';


const container = new Container();

container.bind<ISslLabsService>(TYPES.ISslLabsService).to(SslLabsService).inSingletonScope();
container.bind<ITaskInput>(TYPES.ITaskInput).to(TaskInput).inSingletonScope();
container.bind<ILogger>(TYPES.ILogger).to(Logger).inSingletonScope();

export default container;