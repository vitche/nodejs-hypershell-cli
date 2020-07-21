#!/usr/bin/env node
let fs = require('fs');
let main = require('./main');
if (4 > process.argv.length) {
    console.log('Usage: hysh cluster.json "uptime; who; pwd;"');
} else {
    let clusterDefinitionPath = process.argv[2];
    let shellCommand = process.argv[3];
    if (fs.existsSync(shellCommand)) {
        shellCommand = fs.readFileSync(shellCommand).toString();
    }
    let clusterDefinition = fs.readFileSync(clusterDefinitionPath);
    clusterDefinition = JSON.parse(clusterDefinition.toString());
    main.execute(clusterDefinition, shellCommand);
}
