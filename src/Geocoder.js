// @flow
import googleMaps from '@google/maps';

/**
 * Class responsible for geocoding operations.
 */
export default class Geocoder {
  client: Object;

  /**
   * Constructor.
   * @param {string} googleApiKey Google API key with geocode enabled.
   */
  constructor(googleApiKey: string) {
    this.client = googleMaps.createClient({
      key: googleApiKey,
      Promise,
    });
  }

  /**
   * Retrieves details of an address.
   * @param {string} address The address.
   */
  async getAddressDetails(address: string): Promise<Object> {
    const { json } = await this.client
      .geocode({
        address,
      })
      .asPromise();

    if (!json || !json.results || !json.results.length) {
      throw new Error(`No geocode results for: ${address}`);
    }

    const { geometry, formatted_address: formattedAddress } = json.results[0];
    const { lat: latitude, lng: longitude } = geometry.location;

    return {
      formattedAddress,
      latitude,
      longitude,
    };
  }
}
