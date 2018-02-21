// @flow
import fs from 'fs';
import csv from 'fast-csv';

/**
 * Class that parses a CSV file.
 */
export default class CsvParser {
  /**
   * Constructor.
   * @param {string} sourceFilePath Path to the source CSV file.
   */
  constructor(sourceFilePath: string) {
    this.sourceFilePath = sourceFilePath;
    this.records = [];
  }

  /**
   * Parses the file and returns the records.
   * @return {Array<Object>} a promise to resolve the array of records.
   */
  parse(): Promise<Array<Object>> {
    return new Promise((resolve, reject) => {
      console.log(`Parsing CSV file: ${this.sourceFilePath}`);

      const records = [];

      // Loads the file stream
      const stream = fs.createReadStream(this.sourceFilePath);

      // CSV parsing options
      const parsingOptions = {
        headers: true,
        delimiter: ',',
        quote: '"',
        objectMode: true,
        trim: true,
        ignoreEmpty: true,
      };

      // parses the CSV file
      const csvStream = csv(parsingOptions)
        .on('data', (data) => {
          records.push(data);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          console.log(`Loaded ${records.length} records`);
          resolve(records);
        });

      stream.pipe(csvStream);
    });
  }
}
