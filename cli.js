#!/usr/bin/env node
let fs = require('fs');
let main = require('./main');
if (4 > process.argv.length) {
    console.log('Usage: hysh cluster.json "uptime; who; pwd;"');
} else {
    let clusterDefinitionPath = process.argv[2];
    let shellCommand = process.argv[3];
    let clusterDefinition = fs.readFileSync(clusterDefinitionPath);
    clusterDefinition = JSON.parse(clusterDefinition.toString());
    // TODO: Move the gateway URI to settings
    main.execute('http://localhost:3002/chainCode/invoke', clusterDefinition, shellCommand);
}
