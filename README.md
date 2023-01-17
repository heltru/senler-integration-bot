# senler-integration-bot


Библиотека для связи вашей интеграции с Senler


```sh
npm i senler-integration-bot
```

Документация [Интеграций Senler](https://app.gitbook.com/o/-L_IF5TbiMa8dxgx_94P/s/-L_IF5Te3IJsAOAjS0Js/~/changes/5KXCjOJaCW3x6DidncV4/chat-boty-integracii).

 
## Чтение настроек
При открытии модального окна и загрузки интеграции через iframe. Событие onload. Senler отправляет запрос `setData` c настройками из шага.

Интеграция обрабатывает запрос следующим образом:
```js
import IntegrationConnect from "senler-integration-bot/src/index.js";

integrationConnect.route('setData', (message) => {
        let settings = message.request.payload;
        if ('private' in settings) {
            setPrivateSettings(JSON.parse(settings.private));
        }
        if ('public' in settings) {
            setPublicSettings(JSON.parse(settings.public))
        }
        message.responce.success = true;
        message.send();//Отправим ответ timeout 50 сек
});
```

## Сохранение настроек
При нажатии кнопки "Сохранить" в модальном окне настроек интеграции, Senler отправляет запрос `getData`

Интеграция обрабатывает запрос следующим образом:
```js
 integrationConnect.route('getData', (message) => {
    message['responce'] = {
        payload: {},
        success: true
    };

    message.responce.payload['public'] =  JSON.parse(localStorage.getItem('public_settings'));
    message.responce.payload['private'] = JSON.parse(localStorage.getItem('private_settings'));

    message.responce.payload['command_title'] = 'Бот шлет сообщение с подписчиком';

    message.send();//Отправим ответ timeout 50 сек
});
```
## Cтруктра данных  Window.postMessage() сообщения
```json
{
    "payload": {
        "public": "123 123 123 %last_name%",
        "private": [
            {
                "id": "ToIl1LHrgzX-VEMg55yCy",
                "chat_id": "560572781",
                "token": "1925730357:AAELFz-Rm43Eavdw5wcpmrCxXHl9iqWwpe0",
                "user_id": 1667583788069
            }
        ],
        "command_title": "Example One"
    },
    "type": "getData",
    "success": true    
}
```
- `public` - публичные настройки
- `private` - приватные настройки, очищаются при копировании бота
- `command_title` - заголовок в редакторе бота

Для браузера [`dist/bundle.js`](https://unpkg.com/senler-integration-bot/dist/bundle.js)

```html
<script src="https://unpkg.com/senler-integration-bot/dist/bundle.js"></script>
```