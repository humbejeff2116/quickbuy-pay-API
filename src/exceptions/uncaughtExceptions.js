





const cluster = require('cluster');



module.exports = function(req, res, next) {
    const domain = require('domain').create();
    domain.on('error', (err)=> {
        console.error('DOMAIN ERROR CAUGHT\n' ,err.stack);
        try{
            setTimeout(()=> {
                console.error('failsafe shutdown.');
                process.exit(1);
            },5000);
            let worker = cluster.worker;
            if(worker) worker.disconnect();
            server.close();
            try{
                next(err);
            }catch(err) {
                console.error('Express mechanism failed \n' ,err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('server error');
            }
        }catch(err) {
            console.error('Unable to send 500 response\n',err.stack);
        }
    });
    domain.add(req);
    domain.add(res);
    domain.run(next)
}