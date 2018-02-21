// @flow
import fs from 'fs';
import csv from 'fast-csv';

export default class CsvWriter {
  targetFilePath: string;

  constructor(targetFilePath: string) {
    this.targetFilePath = targetFilePath;
  }

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
