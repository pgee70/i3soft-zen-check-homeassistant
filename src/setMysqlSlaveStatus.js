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
  const connection = mysql.createConnection({
    database: dbName,
    host: dbHost,
    password: dbPass,
    user: dbUser,
  });
  const slaveStatusSql = 'show slave status';

  const sqlQuery = newStatus.toLowerCase() === 'on'
    ? 'start slave'
    : 'stop slave';
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    connection.query(slaveStatusSql, (error, results) => {
      if (error) throw error;
      const currentStatus = results[0].Slave_IO_Running;
      if ((currentStatus === 'No' && newStatus === 'On')
        || (currentStatus === 'Yes' && newStatus === 'Off')) {
        connection.query(sqlQuery, (error, results) => {
          if (error) throw error;
        });
      }
    })
    connection.end(); // Close the connection when done
  });
}
export default setMysqlSlaveStatus;
