import checkApiStatus from "./src/checkApiStatus.js";
import checkSwitchSocket from "./src/checkSwitchSocket.js";
import setMysqlSlaveStatus from "./src/setMysqlSlaveStatus.js";

checkApiStatus
  .then((checkApiStatusOutput) => {
    if (checkApiStatusOutput.status === true) {
      checkSwitchSocket.then(checkSwitchSocketOutput => {
        if (checkSwitchSocketOutput.status === true) {
          console.log(checkSwitchSocketOutput.message);
          // the socket is found - if the state attribute is 'on' turn slave on.
          // otherwise turn slave off
          if (checkSwitchSocketOutput.message.state === 'on') {
            setMysqlSlaveStatus('on');
          }
        } else {
          console.error(checkSwitchSocketOutput.message);
        }
      });
    } else {
      console.error(checkSwitchSocketOutput.message)
    }
  });
