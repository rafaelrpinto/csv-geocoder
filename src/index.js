// @flow
import CsvParser from './CsvParser';
import CsvWriter from './CsvWriter';
import Geocoder from './Geocoder';

// load env variables
require('dotenv').config();

const {
  SOURCE_FILE_PATH,
  TARGET_FILE_PATH,
  ADDRESS_COLUMNS,
  ADDRESS_SUFFIX,
  GOOGLE_MAPS_API_KEY,
} = process.env;

const BATCH_SIZE = 10;
const WAIT_BETWEEN_BATCHES = 1000;

const parser = new CsvParser(SOURCE_FILE_PATH);
const writer = new CsvWriter(TARGET_FILE_PATH);
const geocoder = new Geocoder(GOOGLE_MAPS_API_KEY);

async function processRecord(record: Object): Promise<void> {
  try {
    const { formattedAddress, latitude, longitude } = await geocoder.getAddressDetails(record.__address);
    record.__address = formattedAddress;
    record.__latitude = latitude;
    record.__longitude = longitude;
  } catch (err) {
    record.__address = err.message;
    record.__latitude = 'ERROR';
    record.__longitude = 'ERROR';
  }
}

(async () => {
  const targetRecords = [];
  const sourceRecords = await parser.parse();

  sourceRecords.forEach((record) => {
    // joins the CSV address data into a single field: __address
    const fullAddress = ADDRESS_COLUMNS.split(',').reduce(
      (address, columnName) => `${address} ${record[columnName.trim()]}`,
      '',
    );
    record.__address = `${fullAddress} - ${ADDRESS_SUFFIX}`;
  });

  const total = sourceRecords.length;

  while (sourceRecords.length) {
    const batch = sourceRecords.splice(0, BATCH_SIZE);

    // processes the batch
    await Promise.all(batch.map(record => processRecord(record)));

    targetRecords.push(...batch);

    console.log(`Progress: ${targetRecords.length}/${total}`);

    // sleeps
    await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_BATCHES));
  }

  console.log(`Geocoded ${targetRecords.length} records. Writing result to: ${TARGET_FILE_PATH}`);

  await writer.write(targetRecords);

  console.log('Done!');
})();
