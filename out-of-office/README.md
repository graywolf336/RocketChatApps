# Out of Office Responder App

<img width="868" alt="Screen Shot 2020-05-11 at 10 35 39 AM" src="https://user-images.githubusercontent.com/850391/81580952-b37c2080-9373-11ea-8d38-8cb1d4a949f8.png">

This application is an example, and a working one, of the ability to combine slash commands, persisent storage, listeners, and i18n to add additional functionality to Rocket.Chat without having to customize and fork Rocket.Chat.

This adds a command `/out-of-office` which accepts either `out`, `in` or `status`. The `out` also takes additional parameters which will be the message that is sent to people who try to direct message you when you're out of office. The `in` just tells the App that you're back in office and not to send a message to someone. The `status` simply tells you what your out of office status currently is.

It uses the persistent storage avaible to the Apps to store your out of office status even through restarts. :)
