const TelegramBot = require('node-telegram-bot-api');

// Вставь сюда свой токен
const token = '7863883243:AAH0d_TFGfCzALIB2xYwy3lfl2l4w4rdalw';
const bot = new TelegramBot(token, { polling: true });

// Обработчик инлайн-запросов
bot.on('inline_query', (query) => {
    const queryId = query.id;
    const queryText = query.query;

    // Проверяем запрос на ключевое слово (например, "team")
    if (queryText.startsWith('team')) {
        const participants = queryText.split(' ').slice(1);
        const teams = splitIntoTeams(participants, 2); // Разделяем на 2 команды для примера

        // Формируем ответ для инлайн-запроса
        const results = [
            {
                type: 'article',
                id: '1',
                title: 'Разделить на команды',
                input_message_content: {
                    message_text: formatTeams(teams),
                },
            },
        ];

        bot.answerInlineQuery(queryId, results);
    } else {
        // Пустой ответ, если не передали команды
        const results = [
            {
                type: 'article',
                id: '0',
                title: 'Введите команду в формате: team имя1 имя2 имя3...',
                input_message_content: {
                    message_text:
                        'Введите команду в формате: team имя1 имя2 имя3...',
                },
            },
        ];

        bot.answerInlineQuery(queryId, results);
    }
});

// Функция для разделения участников на команды
function splitIntoTeams(participants, numberOfTeams) {
    const shuffled = participants.sort(() => 0.5 - Math.random());
    const teams = Array.from({ length: numberOfTeams }, () => []);

    shuffled.forEach((participant, index) => {
        teams[index % numberOfTeams].push(participant);
    });

    return teams;
}

// Форматируем команды в текст для отправки
function formatTeams(teams) {
    return teams
        .map((team, index) => `Команда ${index + 1}:\n${team.join('\n')}`)
        .join('\n\n');
}
