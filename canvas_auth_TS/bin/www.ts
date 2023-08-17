
import { App } from '../app.js';
import http from 'http';
import https from 'https';
import { debug } from 'console';
import fs from 'fs';
import process from 'process';


class WWW {
  app: any;
  port: any;
  server: any;
  constructor(app: any, port: string | number) {
    this.app =  app;
    this.port = port;
  }

  public async createServer(): Promise<void> {
    var port = this.normalizePort(process.env.PORT  || this.port);
    let certs;
    try {
      certs = await this.readCertFiles();
      this.app.set('cert', certs.certificate );
      this.app.set('key', certs.key );
    } catch(err) {
      console.log('Unable to find the certs. Launching the application with http')
    }
    this.app.set('port', port);
    this.app.set('hostname', 'canvasauth');
    if( certs.cert && certs.key) {
      console.log('cert files are ', certs);
      this.server =  https.createServer(certs, this.app);
    } else {
      this.server = http.createServer(this.app);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */

    console.log('Server Created');
    this.server.listen(port);

    
    console.log('Server port attached', this.server.port);
    this.server.on('error', this.onError.bind(this));

    this.server.on('listening', this.onListening.bind(this));
  }

  public async readCertFiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      const certs: {cert: any, key: any} = {cert:'', key: ''};
      console.log('Reading cert files from ', process.cwd() + './certs');
      certs.cert =  fs.readFileSync(process.cwd() + '/certs/' + 'localhost.crt');
      certs.key =  fs.readFileSync(process.cwd() + '/certs/' + 'localhost.key');
      resolve(certs);
    })
  }

  private normalizePort(val: string): string | number | boolean {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
 * Event listener for HTTP server "listening" event.
 */

  private onListening() {
  var addr =  this.server?.address;
  const port = this.port;
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + port;
  console.log('Listening on ' + bind);

  // this.service.mongoose.connect();
  }

}

(async() => {
  // console.log('App is', App);
  debug;
  try {
    const www =  new WWW(new App().app, '3001' );
    console.log('Created WWW');
    await www.createServer();
  } catch(err) {
    console.log('Error in creating the server', err);
  }
})();