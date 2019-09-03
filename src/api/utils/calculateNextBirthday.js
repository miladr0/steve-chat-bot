const moment = require('moment');

exports.calculateNextBirthday = (value) => {
  const birthday = moment(value).format('YYYY-MM-DD');
  const today = moment().format('YYYY-MM-DD');
  const years = moment().diff(birthday, 'years');
  const adjustToday = birthday.substring(5) === today.substring(5) ? 0 : 1;
  const nextBirthday = moment(birthday).add(years + adjustToday, 'years');
  const daysUntilBirthday = nextBirthday.diff(today, 'days');

  if (daysUntilBirthday === 0) {
    return 'Happy birthday too you!';
  }
  return `There are ${daysUntilBirthday} days left until your next birthday`;
};
