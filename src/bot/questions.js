const moment = require('moment');
const yesno = require('./util/yesnoClassification.util');
//get user info through some questions 
exports.questions = [
  {
    type: 'input',
    name: 'firstName',
    message: 'Please enter your first name...',
    validate: function(name) {
        if(name.length) {
            return true
        }else {
            return 'Please enter your first name...'
        }
    }
  },
  {
    type: 'input',
    name: 'birthday',
    message: 'Please enter your birth date <YYYY-MM-DD>...',
    validate: function(date) {
        if(date.length) {
            //strict parsing date format using momentJs
            if(moment(date, 'YYYY-MM-DD', true).isValid()) {
                return true;
            }else {
                return 'Please enter your birth date in valid format <YYYY-MM-DD>'
            }
        }else {
            return 'Please enter your birth date...'
        }
    }
  },
  {
    type: 'input',
    name: 'confirmation',
    message: 'show next birth date?["y","yes","ok","yeah" or "n", "no", "nah"...]',
    validate: function(value) {
        try {
            if(value.length) {
                const cleanedValue = value.trim().toLowerCase();
                if(yesno.yesValues().indexOf(cleanedValue) >= 0 || yesno.noValues().indexOf(cleanedValue) >= 0) {
                    return true;
                }else {
                    return 'not a valid answer for confirmation!' 
                }
            }else {
                return 'Please answer: calculate your next birth date?'
            }
        }catch(err) {
            console.log(err);
        }
    },


  }
];