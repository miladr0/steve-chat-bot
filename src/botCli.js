const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();
const program = require('commander');
const { prompt } = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const clear = require('clear');
const { questions } = require('./bot/questions');
const { calculateNextBirthday } = require('./bot/util/calculateNextBirthday.util');
const yesno = require('./bot/util/yesnoClassification.util');
const Message = require('./api/models/message.model');
const { unSubscribeMessage, messagePublish, messageSubscribe } = require('./bot/services/redisPubSub.service');


messageSubscribe();

// clear the terminal screen.
clear();
// show some text in Ascii format.
console.log(chalk.yellowBright(figlet.textSync('Birthday Bot', { horizontalLayout: 'full' })));

program
  .command('start')
  .alias('s')
  .description('Find out when is user next birth date party!')
  .action(async () => {
    try {
      const answers = await prompt(questions);
      const confirmAnswer = answers.confirmation.trim().toLowerCase();

      // publish user message through redis pub/sub for calling web hook
      messagePublish(answers);

      // save all user inputs as single message in db
      const message = new Message(answers);
      await message.save();

      if (yesno.yesValues().indexOf(confirmAnswer) >= 0) {
        calculateNextBirthday(answers.birthday);
      } else {
        console.log('Goodbye 🙅');
      }
    } catch (err) {
      console.log(err);
    }
  });


program.parse(process.argv);


process.on('SIGINT', () => {
  unSubscribeMessage();
  process.exit();
});
