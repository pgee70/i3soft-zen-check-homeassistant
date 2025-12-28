import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const haUrl = process.env.HA_URL;
const haToken = process.env.HA_TOKEN;
const haEntityId = process.env.HA_ENTITY_ID;

const headers = {
  'Authorization': `Bearer ${haToken}`,
  'Content-Type': 'application/json',
}

async function updateEntity() {
  const updateUrl = `${haUrl}/api/services/homeassistant/update_entity`;
  const body = {entity_id: haEntityId}
  try {
    fetch(updateUrl, {method: 'POST', headers, body: JSON.stringify(body)})
      .then(response => {
        // console.log('updateEntity',response);
        if (response.ok) {
          return {
            status: true,
            message: response,
          }
        } else {
          return {
            status: false,
            message: `API check failed: ${response.statusText}`
          };
        }
      })
  } catch (error) {
    return {
      status: false,
      message: 'An error occurred while connecting to the Home Assistant API:' + error.message,
    }
  }
}

// the home assistant API returns something like if successful
// {"entity_id":"switch.socket_river_plus_ups","state":"on","attributes":{"icon":"mdi:light-switch","friendly_name":"Socket: River plus UPS"},"last_changed":"2025-12-26T00:43:09.494226+00:00","last_reported":"2025-12-26T00:43:09.494226+00:00","last_updated":"2025-12-26T00:43:09.494226+00:00","context":{"id":"01KDC1R0SPRYY1S6YW91QF18J4","parent_id":null,"user_id":null}}
// if the state is not found, then expect:
// {"message":"Entity not found."}
async function checkSwitchSocket() {
  try {
    const stateUrl = `${haUrl}/api/states/${haEntityId}`
    const response = await fetch(stateUrl, {method: 'GET', headers});
    // console.log('checkSwitchSocket',response);
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
  const updateEntityOutput = updateEntity();
  if (updateEntityOutput.status === false) {
    reject(updateEntityOutput);
  }
  const checkSwitchOutput = checkSwitchSocket();
  if (checkSwitchOutput.status === false) {
    reject(checkSwitchOutput);
  } else {
    resolve(checkSwitchOutput);
  }
});
export default status;
status.then(output=>console.log(output))
