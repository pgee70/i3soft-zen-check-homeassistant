import fetch from 'node-fetch';
import dotenv from 'dotenv'

dotenv.config();

const haUrl = process.env.HA_URL;
const haToken = process.env.HA_TOKEN;
const haSwitch = process.env.HA_SWITCH;

// the home assistant API returns something like if successful
// {"entity_id":"switch.socket_river_plus_ups","state":"on","attributes":{"icon":"mdi:light-switch","friendly_name":"Socket: River plus UPS"},"last_changed":"2025-12-26T00:43:09.494226+00:00","last_reported":"2025-12-26T00:43:09.494226+00:00","last_updated":"2025-12-26T00:43:09.494226+00:00","context":{"id":"01KDC1R0SPRYY1S6YW91QF18J4","parent_id":null,"user_id":null}}
// if the state is not found, then expect:
// {"message":"Entity not found."}
async function checkSwitchSocket() {
  try {
    const response = await fetch(`${haUrl}/api/states/${haSwitch}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${haToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        status: true,
        message: data,
      }
    } else {
      return {
        status: false,
        message: `API check failed: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'An error occurred while connecting to the Home Assistant API:' + error.message,
    }
  }
}

const status = new Promise((resolve, reject) => {
  const output = checkSwitchSocket();
  if (output.status === false) {
    reject(output);
  } else {
    resolve(output);
  }
});
export default status;
