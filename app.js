const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  /** Count the machine's CPUs */
  const cpuCount = os.cpus().length;

  /** Create a worker for each CPU */
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  /** Listen for dying workers */
  cluster.on('exit', () => cluster.fork());
}
else {
  require('./server');
}