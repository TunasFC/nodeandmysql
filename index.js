const mysql = require('mysql2');
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.json());
const { Client } = require('ssh2');

const sshClient = new Client();
const dbServer = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'H4ck4t0n!',
    database: 'hackathon_db'
}
//ssh
const tunnelConfig = {
    host: '34.227.231.244',
    port: 1022,
    username: 'student',
    privateKey:
        require('fs').readFileSync('C:\\Users\\ivani\\Downloads\\hackaton-student-2.pem')
}
const forwardConfig = {
    srcHost: '127.0.0.1',
    srcPort: 3306,
    dstHost: dbServer.host,
    dstPort: dbServer.port
};
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
            forwardConfig.srcHost,
            forwardConfig.srcPort,
            forwardConfig.dstHost,
            forwardConfig.dstPort,
            (err, stream) => {
                if (err) reject(err);
                const updatedDbServer = {
                    ...dbServer,
                    stream
                };
                const connection =  mysql.createConnection(updatedDbServer);
                connection.connect((error) => {
                    if (error) {
                        reject(error);
                    }else {
                        console.log('hola')
                    }
                    resolve(connection);
                });
                connection.query('SELECT * FROM Invoice',(err, rows,fields)=>{
                    if(!err){
                        console.log(rows);
                    }else{
                        console.log(err);
                    }

                })

            });
    }).connect(tunnelConfig);
});



