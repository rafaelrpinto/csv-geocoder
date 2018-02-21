# csv-geocoder

Add formatted address, latitude and longitude columns to a CSV that has address data in single or multiple columns.

### Setup

* `git checkout https://github.com/rafaelrpinto/csv-geocoder`
* `yarn install`
* Rename `.env.sample` file to `.env` and change the properties as described below
* `yarn start`

### Properties

* SOURCE_FILE_PATH - Path to the source CSV file
* TARGET_FILE_PATH - Path to the generated CSV file
* ADDRESS_COLUMNS - Comma separated names of the columns used to build the address (in order)
* ADDRESS_SUFFIX - Optional suffix to add to all addresses before geocoding
* GOOGLE_MAPS_API_KEY - Your google maps API
* BATCH_SIZE - Number of concurrent requests to google maps
* WAIT_BETWEEN_BATCHES - Time to wait beteen batches

### CSV Format

The CSV must have commas (,) as separators and the text cells must be wrapped in double quotes (");
