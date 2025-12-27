import fetch from 'node-fetch';
import dotenv from 'dotenv'

dotenv.config();

const haUrl = process.env.HA_URL;
const haToken = process.env.HA_TOKEN;

async function checkApiStatus() {
  try {
    const response = await fetch(`${haUrl}/api/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${haToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status:true,
        message:`API Status: ${data.message}`,
      }
    } else {
      return {
        status:false,
        message: `API check failed: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      status:false,
      message:'An error occurred while connecting to the Home Assistant API:'+ error.message,
    }
  }
}

const status =  new Promise((resolve, reject) => {
  const output = checkApiStatus();
  if (output.status === false) {
    reject(output);
  } else {
    resolve(output);
  }
});

export default status;
