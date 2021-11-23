const API_KEY = 'nextcorenextcore';
const {connect} = require('./dbUtils');

// const utils = require('./utils');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');
const xlsx = require('xlsx');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/upload/excel', (req, res) => {
  const _d = camelcaseKeys(req.body);
  try {
    connect((conn, err) => {
      if(err) throw Error('db error');
      conn.beginTransaction((err) => {
        if(err) throw Error('db error');
        try {
          const values = _d.slice(1).map((v, i) => (
            `('${v.coldate}', '${v.dkey}', ${v.output}, ${v.outputFail}, ${v.pne}, 0)`
          )).join(',');
            
          const sql = `
            INSERT INTO 
              nc_p_day_facility_dev_t
              (coldate, dkey, OUTPUT, OUTPUT_FAIL, PNE, loss_flag)
            VALUES
              ${values}
          `
    
          conn.query(sql, [], (err, data) => {
            if(err) throw Error('db error');

            conn.commit();
            conn.end();
            res.json('upload excel');
          });
        } catch(e) {
          console.log(e);
          conn && conn.rollback();
          conn && conn.end();
          throw Error('db error');
        }
      });
    })
  } catch(err) {
    res.status(500).send();
  }
});

app.get('/device/excel', (req, res) => {
  const apiKey = req.header('api-key');
  console.log(apiKey);
  
  if(apiKey !== API_KEY) {
    res.sendStatus(403);
    // res.send('invalid api-key');
  } else {
    try {
      connect((conn, err) => {
        if(err) throw Error('db error');

        conn.query(`
        SELECT
          DEVID DKEY,
          comments COMMENTS,
          GROUP_NAME GROUP_NAME
        FROM sehong_device_info
        `, [], (err, data) => {
          if(err) throw Error('db error');

          const wb = xlsx.utils.book_new();
          const wsData = [
            ['장비키', '구분', '그룹명'], 
            ...data.map((v) => ([v.DKEY, v.COMMENTS, v.GROUP_NAME]))
          ];
          const ws = xlsx.utils.aoa_to_sheet(wsData);
          xlsx.utils.book_append_sheet(wb, ws, 'sheet 1');
          var wbout = xlsx.write(wb, {bookType:'xlsx',  type: 'binary'});

          conn.end();
          res.send(wbout);
        });
      });
    } catch(e) {
      conn && conn.end();
      res.sendStatus(500);
      // res.send('db error');  
    }
  }
});

app.listen(7777, () => {
  console.log('excel data server start');
})
