// @flow
import fs from 'fs';
import csv from 'fast-csv';

/**
 * Class that writes records to a CSV file.
 */
export default class CsvWriter {
  targetFilePath: string;

  /**
   * Constructor.
   * @param {string} targetFilePath Target CSV file to be created.
   */
  constructor(targetFilePath: string) {
    this.targetFilePath = targetFilePath;
  }

  /**
   * Writes the records to the file.
   * @param {Array<Object>} records Records to be written.
   */
  write(records: Array<Object>): Promise<void> {
    return new Promise((resolve, reject) => {
      const csvStream = csv.createWriteStream({ headers: true });
      try {
        const writableStream = fs.createWriteStream(this.targetFilePath);

        writableStream.on('finish', () => {
          resolve();
        });

        csvStream.pipe(writableStream);

        records.forEach((record) => {
          csvStream.write(record);
        });
      } catch (err) {
        reject(err);
      } finally {
        csvStream.end();
      }
    });
  }
}
