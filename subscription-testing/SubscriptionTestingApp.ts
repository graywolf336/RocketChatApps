import {
    IAppAccessors,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

export class SubscriptionTestingApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        const iterator = await read.getRoomSubscriptionReader().getByRoomId(message.room.id);

        this.getLogger().log('iterator', iterator);
        this.getLogger().log('iterator keys', Object.keys(iterator));
        this.getLogger().log('iterator[Symbol.iterator]()', iterator[Symbol.iterator]());

        for await (const sub of iterator) {
            this.getLogger().log('subscription', sub);
        }
    }
}
