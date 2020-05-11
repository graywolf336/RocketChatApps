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
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';

export class MessageTestingApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        if (message.room.type === RoomType.DIRECT_MESSAGE) {
            return;
        }

        const iterator = await read.getRoomReader().getMessages(message.room.id);

        this.getLogger().log('type', typeof iterator, 'keys', Object.keys(iterator));

        for await (const sub of iterator) {
            this.getLogger().log('message', sub);
        }
    }
}
