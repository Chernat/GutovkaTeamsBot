


const TelegramBot = require('node-telegram-bot-api');

// Вставь сюда свой токен от BotFather
const token = '7863883243:AAH0d_TFGfCzALIB2xYwy3lfl2l4w4rdalw';
const bot = new TelegramBot(token, { polling: true });

let surveyMessageId = null; // ID сообщения с опросом
let userResponses = {}; // Объект для хранения ответов

// Список команд (пример)
const teams = ['Team A', 'Team B', 'Team C'];


bot.on('inline_query', (query) => {
    console.log('Получен запрос:', query);

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

// Отправка опроса
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Создаем опрос
  const options = {
    reply_markup: {
      inline_keyboard: teams.map((team) => [{ text: team, callback_data: team }]),
    },
  };

  bot.sendMessage(chatId, 'Выберите команду:', options)
    .then((sentMessage) => {
      surveyMessageId = sentMessage.message_id;
    });
});

// Обработка выбора команды
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const team = callbackQuery.data;

  // Записываем ответ
  userResponses[userId] = team;

  bot.sendMessage(chatId, `Вы выбрали: ${team}`);

  // Можно добавить обработку для подтверждения выбора, отправки результатов и т.д.
});

// Команда для просмотра распределения по командам
bot.onText(/\/results/, (msg) => {
  const chatId = msg.chat.id;

  // Подсчёт пользователей в командах
  const teamCounts = teams.reduce((acc, team) => {
    acc[team] = Object.values(userResponses).filter(response => response === team).length;
    return acc;
  }, {});

  // Отправка результатов
  const resultMessage = Object.entries(teamCounts).map(([team, count]) => `${team}: ${count} человек`).join('\n');
  bot.sendMessage(chatId, `Распределение по командам:\n${resultMessage}`);
});

console.log('Бот запущен!');
