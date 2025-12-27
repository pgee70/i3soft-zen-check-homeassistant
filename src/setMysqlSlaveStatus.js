import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;
const dbUser = process.env.DB_USER;

const setMysqlSlaveStatus = newStatus => {
  const possibleStatuses = ['on', 'off'];
  if (!possibleStatuses.includes(newStatus)) {
    console.error(`Status: ${newStatus} is invalid.`);
    return;
  }
  const connection1 = mysql.createConnection({
    database: dbName, host: dbHost, password: dbPass, user: dbUser,
  });
  const slaveStatusSql = 'show slave status';

  const changeSlaveSql = newStatus.toLowerCase() === 'on' ? 'start slave' : 'stop slave';
  connection1.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    connection1.query(slaveStatusSql, (error, results) => {
      if (error) throw error;
      const currentStatus = results[0].Slave_IO_Running;
      if ((currentStatus === 'No' && newStatus === 'on') || (currentStatus === 'Yes' && newStatus === 'off')) {
        console.log(`Slave state update: Slave_IO_Running='${currentStatus}' newStatus:'${newStatus}'`)
        const connection2 = mysql.createConnection({
          database: dbName, host: dbHost, password: dbPass, user: dbUser,
        });
        connection2.connect(err => {
          if (err) {
            console.error('Error connecting to MySQL database:', err);
            return;
          }
          connection2.query(changeSlaveSql, (error, results) => {
            if (error) throw error;
            console.log(changeSlaveSql,results)
          });
          connection2.end();
        })
      }
    })
    connection1.end(); // Close the connection when done
  });
}
export default setMysqlSlaveStatus;
