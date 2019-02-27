import {
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IJob, IJobResult } from '@rocket.chat/apps-engine/definition/scheduler';

export class RemindApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async initialize(ce: IConfigurationExtend, er: IEnvironmentRead): Promise<void> {
        const jb = ce.scheduler.getJobBuilder()
            .setName('testing')
            .setDescription('just a testing')
            .parseTextSchedule('every hour')
            .setExecutor(this.jobExecutor);

        await ce.scheduler.scheduleJob(jb);
        return;
    }

    public async jobExecutor(job: IJob, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IJobResult> {
        return {
            success: true,
        };
    }
}
