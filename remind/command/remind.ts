import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class RemindCommand implements ISlashCommand {
    public command = 'remind';
    public i18nParamsExample = 'Remind_Params_Example';
    public i18nDescription = 'Remind_Description';
    public providesPreview = false;

    public executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
