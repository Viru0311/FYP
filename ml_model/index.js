const {spawn} = require('child_process');

const python = spawn('python3', ['run.py', 51,1,2,110,175,0,1,123,0,0.6,2,0,2]);

// collect data from script
python.stdout.on('data', function (data) {
  dataToSend = data.toString().trim();
  console.log(dataToSend);
});

