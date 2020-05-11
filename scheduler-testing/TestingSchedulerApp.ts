import { IConfigurationExtend, IConfigurationModify, IEnvironmentRead, ILogger, IRead, IModify, IHttp, IPersistence, IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { Schedule, IJob, IJobResult } from '@rocket.chat/apps-engine/definition/scheduler';

export class TestingSchedulerApp extends App {
    public async onEnable(environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean> {
        return true;
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        const job: IJob = {

            name: 'Testing',
            executor: this.jobExecutor,
        };

        const jobId = await configuration.scheduler.scheduleJob(job, new Schedule('* * * * *'));
        this.getAccessors().reader.getSchedulerReader().getJobById(jobId);
        
        // return;
    }

    private async jobExecutor(read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IJobResult> {
        return undefined;
    }
}
