const yesValues = () => {
  const yes = ['I agree',
    "I'm sure",
    'aye aye',
    'carry on',
    'do it',
    'get on with it then',
    'go ahead',
    'i agree',
    'make it happen',
    'make it so',
    'most assuredly',
    'perfect, thanks',
    'please do',
    'rock on',
    "that's correct",
    "that's right",
    'uh huh',
    'yeah, do it',
    'yes, do it',
    'yes, please',
    'you got it',
    'absolutely',
    'affirmative',
    'alright',
    'assuredly',
    'aye',
    'certainly',
    'confirmed',
    'continue',
    'continue',
    'correct',
    'da',
    'good',
    'hooray',
    'ja',
    'ok',
    'okay',
    'proceed',
    'righto',
    'sure',
    'thanks',
    'totally',
    'true',
    'y',
    'ya',
    'yay',
    'yea',
    'yeah',
    'yep',
    'yeppers',
    'yes',
  ];

  return yes.map(y => y.toLocaleLowerCase());
};

const noValues = () => {
  const no = [
    'I changed my mind',
    "I don't agree",
    'absolutely not',
    'belay that',
    'cut it out',
    "don't do anything",
    "don't do it",
    'forget it',
    'never mind',
    'no thanks',
    'no way',
    "on second thought, don't do it",
    "please don't",
    'scratch that',
    "don't",
    'cancel',
    'denied',
    'disengage',
    'end',
    'exit',
    'halt',
    'n',
    'nah',
    'nay',
    'nay',
    'neg',
    'negative',
    'negatory',
    'nein',
    'nevermind',
    'no',
    'nope',
    'nyet',
    'quit',
    'skip',
    'stop'];

  return no.map(n => n.toLocaleLowerCase());
};

module.exports = {
  yesValues,
  noValues,
};
