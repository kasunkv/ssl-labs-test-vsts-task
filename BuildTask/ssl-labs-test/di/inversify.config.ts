import { Container } from 'inversify';
import 'reflect-metadata';

import { ISslLabsService } from '../interfaces/ISslLabsService';
import { ITaskInput } from './../interfaces/ITaskInput';

import TYPES from './types';

import { SslLabsService } from '../SslLabsService';
import { TaskInput } from './../TaskInput';


const container = new Container();

container.bind<ISslLabsService>(TYPES.ISslLabsService).to(SslLabsService).inSingletonScope();
container.bind<ITaskInput>(TYPES.ITaskInput).to(TaskInput).inSingletonScope();

export default container;