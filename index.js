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
    password: 'password',
    database: 'data_base_name'
}
//ssh
const tunnelConfig = {
    host: 'ip_of_server: 234.12.23 _example',
    port: destiny_port_int,
    username: 'username',
    privateKey:
        require('fs').readFileSync('C:\\your_pem_path')
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



