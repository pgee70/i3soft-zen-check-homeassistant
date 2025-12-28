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
  try {
    const updateEntityUrl = `${haUrl}/api/services/homeassistant/update_entity`;
    const init = {method: 'POST', headers, body: JSON.stringify({entity_id: haEntityId})}
    const response = await fetch(updateEntityUrl, init);

    // console.log('updateEntity',response);
    if (response.ok) {
      return {
        status: true,
        message: `updateEntity response.statusText: ${response.statusText}`,
      }
    }
    return {
      status: false,
      message: `updateEntity response.statusText: ${response.statusText}`
    };
  } catch (error) {
    return {
      status: false,
      message: 'updateEntity:' + error.message,
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
    const response = await fetch(stateUrl, {method: 'GET', headers: headers});
    if (response.ok) {
      const data = await response.json();
      return {
        status: true,
        message: data,
      }
    }
    return {
      status: false,
      message: `updateEntity response.statusText: ${response.statusText}`
    }
    // console.log('checkSwitchSocket',response);

  } catch (error) {
    return {
      status: false,
      message: 'updateEntity:' + error.message,
    }
  }
}

const status = new Promise((resolve, reject) => {
  updateEntity()
    .then(updateEntityOutput => {
      console.log('updateEntityOutput',updateEntityOutput);
      if (updateEntityOutput.status === false) {
        reject(updateEntityOutput);
      } else {

        checkSwitchSocket().then(
          checkSwitchSocketOutput => {
            console.log('checkSwitchSocketOutput',checkSwitchSocketOutput.message);
            resolve(checkSwitchSocketOutput);
          }
        )
      }
    })
});

export default status;
