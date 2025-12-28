import checkApiStatus from "./src/checkApiStatus.js";
import checkSwitchSocket from "./src/checkSwitchSocket.js";
import setMysqlSlaveStatus from "./src/setMysqlSlaveStatus.js";

checkApiStatus
  .then((checkApiStatusOutput) => {
    if (checkApiStatusOutput.status === true) {
      // console.log(checkApiStatusOutput);
      checkSwitchSocket.then(checkSwitchSocketOutput => {
        // console.log(checkSwitchSocketOutput)
        if (checkSwitchSocketOutput.status === true) {
          // console.log(checkSwitchSocketOutput.message);
          // the socket is found - if the state attribute is 'on' turn slave on.
          // otherwise turn slave off
          const newState = checkSwitchSocketOutput.message.state === '0.0'
            ? 'off'
            : 'on';
          setMysqlSlaveStatus(newState);
        } else {
          console.error(checkSwitchSocketOutput.message);
          setMysqlSlaveStatus('off');
        }
      });
    } else {
      console.error(checkSwitchSocketOutput.message)
      setMysqlSlaveStatus('off');
    }
  });
