const fs = require('fs');
const csv = require('csv');
const async = require('async');
const {
  Products,
  Photos,
  Features,
  Related,
  Skus,
  Styles,
} = require('../server/models/index.js');

// Adjust CSV file, respective Model and highWaterMark as necessary
const input = fs.createReadStream(__dirname + '/data/skus.csv', {
  highWaterMark: 48,
});

const parser = csv.parse({
  columns: true,
  relax: true,
});

const inserter = async.cargo((tasks, inserterCallback) => {
  Skus.bulkCreate(tasks, {
    ignoreDuplicates: true,
    benchmark: true,
  }).then(() => inserterCallback());
}, 1000);

parser.on('readable', () => {
  while ((line = parser.read())) {
    inserter.push(line);
  }
});

parser.on('error', (err) => console.error(err.message));

parser.on('end', (count) => {
  inserter.drain = () => doneLoadingCallback();
});

input.pipe(parser);
