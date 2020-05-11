import {
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageSent, MessageActionButtonsAlignment, MessageActionType } from '@rocket.chat/apps-engine/definition/messages';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { IOutOfOfficeStorage } from './IOutOfOfficeStorage';
import { OutOfOfficeCommand} from './OutOfOfficeCommand';

export class OutOfOfficeApp extends App implements IPostMessageSent {
    public async checkPostMessageSent(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        // We don't auto-respond to rooms beside direct messages
        // maybe in the future if the user is tagged by someone
        // then they will be direct messaged but right now it is
        // only direct messages
        this.getLogger().log(message.room.type, RoomType.DIRECT_MESSAGE);
        return message.room.type === RoomType.DIRECT_MESSAGE;
    }

    public async executePostMessageSent(message: IMessage, read: IRead,
                                        http: IHttp, persistence: IPersistence): Promise<void> {

        // If I'm away and type, need to offer an option to leave away
        const me = message.sender;
        const assocMe = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, me.id);
        const awayMe = await read.getPersistenceReader().readByAssociation(assocMe);
        if (awayMe.length > 0) {
            // Notify me with options to leave or cotinue out of office
            const text = 'You are currently out-of-office. Would you like to check back in?';
            const attachment = {
                actionButtonsAlignment: MessageActionButtonsAlignment.HORIZONTAL,
                actions: [
                    {
                        text: 'Yes',
                        type: MessageActionType.BUTTON,
                        msg_in_chat_window: true,
                        msg: '/out-of-office in',
                    },
                    {
                        text: 'No',
                        type: MessageActionType.BUTTON,
                        msg_in_chat_window: true,
                        msg: '/out-of-office status',
                    },
                ],
            };

            const msgMe = read.getNotifier().getMessageBuilder().setText(text).setAttachments([attachment])
                .setUsernameAlias('Out of Office').setEmojiAvatar(':calendar:')
                .setRoom(message.room).setSender(message.sender).getMessage();

            await read.getNotifier().notifyUser(message.sender, msgMe);
        }

        const otherUsers = message.room.usernames.filter((u) => u !== message.sender.username);
        if (otherUsers.length !== 1) {
            // We don't care if there isn't one other person in the room
            return;
        }

        const otherUser = await read.getUserReader().getByUsername(otherUsers[0]);
        const assoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, otherUser.id);

        const awayDatas = await read.getPersistenceReader().readByAssociation(assoc);
        if (awayDatas.length === 0) {
            // The user is not marked as away, but now check the sender
            await this.checkAndSendReminderMessage(message.sender, message.room, read);
            return;
        }

        const data = awayDatas[0] as IOutOfOfficeStorage;
        const msg = read.getNotifier().getMessageBuilder().setText(otherUser.username +
            ' is currently *out of office*, however they left the following message:\n\n>' +
            data.message)
            .setUsernameAlias('Out of Office').setEmojiAvatar(':calendar:')
            .setRoom(message.room).setSender(message.sender).getMessage();

        await read.getNotifier().notifyUser(message.sender, msg);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new OutOfOfficeCommand());
    }

    private async checkAndSendReminderMessage(sender: IUser, room: IRoom, read: IRead): Promise<void> {
        const assoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, sender.id);

        const awayDatas = await read.getPersistenceReader().readByAssociation(assoc);
        if (awayDatas.length === 0) {
            // the sender is not away
            return;
        }

        const data = awayDatas[0] as IOutOfOfficeStorage;
        const msg = read.getNotifier().getMessageBuilder().setText(sender.username +
            ', you are currently marked as *out of office* with the following message:\n\n>' +
            data.message)
            .setUsernameAlias('Out of Office').setEmojiAvatar(':calendar:')
            .setRoom(room).setSender(sender).getMessage();

        await read.getNotifier().notifyUser(sender, msg);
    }
}
