#!/usr/bin/env node
const fs = require("fs");
const main = require("./main");
const stdio = require("stdio");

let toolCommand = process.argv[1];

// 0
// 1
// 2 - cluster definition
// 3 - command or shell file
// 4 - [format] key
// 5 - [format] value
if (4 > process.argv.length) {
  console.log(
    'Usage:\n' +
    'hysh cluster.json "uptime; who; pwd;" [--format stream|stream+json]\n' +
    'hyshm cluster.json [install|instantiate] --organization-identifier={organizationIdentifer} --administrator-logon={administratorLogOn} --administrator-password={administratorPassword} --chaincode-name={chainCodeName} --chaincode-identifier={chainCodeIdentifier} --chaincode-version={chainCodeVersion}');
} else if (0 < toolCommand.indexOf("hyshm")) {
  // "hyshm" mode
  const options = stdio.getopt({
    "organization-identifier": {
      args: 1,
      required: true
    },
    "administrator-logon": {
      args: 1,
      required: true
    },
    "administrator-password": {
      args: 1,
      required: true
    },
    "chaincode-name": {
      args: 1,
      required: true
    },
    "chaincode-identifier": {
      args: [0, 1],
      required: false
    },
    "chaincode-version": {
      args: 1,
      required: true
    },
    "format": {
      args: 1,
      required: false,
      default: "stream+json"
    }
  });

  if (options.args) {
    let clusterDefinitionPath = options.args[0];
    let command = options.args[1];
    delete options.args;
    switch (command) {
      case "install": {
        let clusterDefinition = fs.readFileSync(clusterDefinitionPath);
        clusterDefinition = JSON.parse(clusterDefinition.toString());
        main.install(clusterDefinition, options, (result) => {
          console.log(JSON.stringify(result));
        });
        break;
      }
      case "instantiate": {
        let clusterDefinition = fs.readFileSync(clusterDefinitionPath);
        clusterDefinition = JSON.parse(clusterDefinition.toString());
        main.instantiate(clusterDefinition, options, (result) => {
          console.log(JSON.stringify(result));
        });
        break;
      }
    }
  }
} else {
  // "hysh" mode
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
