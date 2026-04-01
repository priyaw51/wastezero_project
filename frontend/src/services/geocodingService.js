/**
 * Geocoding Service
 * Uses OpenStreetMap's Nominatim API to convert text addresses into coordinates (forward geocoding)
 * and coordinates into text addresses (reverse geocoding).
 */

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

/**
 * Forward Geocoding: Address String -> { lat, lon }
 * @param {string} address - The full address string to look up
 * @returns {Promise<{lat: string, lon: string} | null>}
 */
export const forwardGeocode = async (address) => {
    if (!address || address.trim() === "") return null;

    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'WasteZero-App'
                }
            }
        );

        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: data[0].lat,
                lon: data[0].lon
            };
        }
        
        return null;
    } catch (error) {
        console.error("[GeocodingService] Forward geocode error:", error);
        return null;
    }
};

/**
 * Reverse Geocoding: { lat, lon } -> Address String
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string | null>}
 */
export const reverseGeocode = async (lat, lon) => {
    if (lat === null || lon === null) return null;

    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
                headers: {
                    'User-Agent': 'WasteZero-App'
                }
            }
        );

        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        return data.display_name || null;
    } catch (error) {
        console.error("[GeocodingService] Reverse geocode error:", error);
        return null;
    }
};

const geocodingService = {
    forwardGeocode,
    reverseGeocode
};

export default geocodingService;
