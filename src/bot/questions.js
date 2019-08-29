/* eslint consistent-return: 0 */

const moment = require('moment');
const yesno = require('./util/yesnoClassification.util');
// get user info through some questions
exports.questions = [
  {
    type: 'input',
    name: 'firstName',
    message: 'Please enter your first name...',
    validate(name) {
      if (name.length) {
        return true;
      }
      return 'Please enter your first name...';
    },
  },
  {
    type: 'input',
    name: 'birthday',
    message: 'Please enter your birth date <YYYY-MM-DD>...',
    validate(date) {
      if (date.length) {
        // strict parsing date format using momentJs
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
          return true;
        }
        return 'Please enter your birth date in valid format <YYYY-MM-DD>';
      }
      return 'Please enter your birth date...';
    },
  },
  {
    type: 'input',
    name: 'confirmation',
    message: 'show next birth date?["y","yes","ok","yeah" or "n", "no", "nah"...]',
    validate(value) {
      try {
        if (value.length) {
          const cleanedValue = value.trim().toLowerCase();
          if (yesno.yesValues().indexOf(cleanedValue) >= 0
           || yesno.noValues().indexOf(cleanedValue) >= 0) {
            return true;
          }
          return 'not a valid answer for confirmation!';
        }
        return 'Please answer: calculate your next birth date?';
      } catch (err) {
        console.log(err);
      }
    },


  },
];
