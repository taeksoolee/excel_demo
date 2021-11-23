require('dotenv').config();

const mysql = require('mysql');


const CONFIG = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : 'amep_fems'
}

const connect = (callback) => {
  let conn = null;
  try {
    conn = mysql.createConnection(CONFIG);  
    callback && callback(conn);
  } catch(e) {
    callback && callback(null, e);
  } finally {
    // conn && conn.end();
  }
}

module.exports = {
  connect,
}