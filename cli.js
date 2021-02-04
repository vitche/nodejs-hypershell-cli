#!/usr/bin/env node
let fs = require('fs');
let main = require('./main');
if (4 > process.argv.length) {
    console.log('Usage: hysh cluster.json "uptime; who; pwd;" [--format stream|stream+json]');
} else {
    let clusterDefinitionPath = process.argv[2];
    let shellCommand = process.argv[3];
    let formatKey = process.argv[4];
    let formatValue = process.argv[5];
    if (!("--format" === formatKey && "stream+json" === formatValue)) {
        formatValue = "stream";
    }
    if (fs.existsSync(shellCommand)) {
        shellCommand = fs.readFileSync(shellCommand).toString();
    }
    let clusterDefinition = fs.readFileSync(clusterDefinitionPath);
    clusterDefinition = JSON.parse(clusterDefinition.toString());
    main.execute(clusterDefinition, shellCommand, formatValue);
}
