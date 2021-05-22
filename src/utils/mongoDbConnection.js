


module.exports = function connectToMongodb(ODM, configurations) {
    if(typeof configurations !== 'object') throw new Error('functions second arguments should be an array')
    ODM.connect(configurations.prodDbURI || configurations.devDbURI, configurations.dbOptions, (err, conn)=> {
        if(err) throw err;
        console.log(`connection to database established`);
    })
}