











const cluster = require('cluster');
const os = require('os');

function startWorker() {
    const worker = cluster.fork();
    console.log("CLUSTER: worker  %d started", worker.id);
}

if(cluster.isMaster) {
    os.cpus().forEach(cpu => {
        startWorker();
    });
    cluster.on('disconnect', (worker)=> {
        console.log("CLUSTER: worker  %d disconnected from cluster", worker.id)
    });
    cluster.on('exit', (worker, code ,signal) => {
        console.log("CLUSTER: worker died with exit code %d (%s)", worker.id, code, signal);
        startWorker();
    });
}else{
    require('./server')();
}