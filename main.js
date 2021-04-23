const cronScript = require('nodejs-cron-script');
module.exports = {
  execute: function (clusterDefinition, command, outputFormat) {
    const gatewayUri = clusterDefinition["gateway"]["uri"];
    let schedulerPattern = undefined;
    if (clusterDefinition["scheduler"]) {
      schedulerPattern = clusterDefinition["scheduler"]["pattern"];
    }
    for (let index in clusterDefinition.nodes) {
      let node = clusterDefinition.nodes[index];
      const commandBuffer = Buffer.from(command).toString('base64');
      node.parameters = [commandBuffer];
      const nodeIdentifier = node.identifier;
      let requestBody = JSON.stringify(node);
      const job = function () {
        const fetch = require('node-fetch');
        requestBody = JSON.parse(requestBody);
        requestBody.parameters[0] = Buffer.from(requestBody.parameters[0], 'base64').toString();
        requestBody = JSON.stringify(requestBody);
        fetch(gatewayUri + "/chainCode/invoke", {
          method: 'post',
          body: requestBody,
          headers: {'Content-Type': 'application/json'},
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            switch (outputFormat) {
              case "stream":
                if (json.output) {
                  console.log(nodeIdentifier + ':$', json.output);
                }
                if (json.error) {
                  console.log(nodeIdentifier + ':&2$', json.error);
                }
                break;
              case "stream+json":
                console.log(JSON.stringify(json) + ",");
                break;
            }
          });
      };
      if (schedulerPattern) {
        const code = cronScript.compile(job, {
          "gatewayUri": gatewayUri + "/chainCode/invoke",
          "requestBody": requestBody,
          "nodeIdentifier": nodeIdentifier
        });
        const callback = function (error, standardOutput, standardError) {
          if (error) {
            console.log(error);
          } else {
            console.log(standardOutput, standardError);
          }
        };
        cronScript.schedule(nodeIdentifier, schedulerPattern, code, callback);
      } else {
        // cronScript.execute(code, callback);
        job();
      }
    }
  },
  install: function (clusterDefinition, options) {
    console.log("hysh", "install", clusterDefinition, options);
  },
  instantiate: function (clusterDefinition, args) {
    console.log("hysh", "instantiate", clusterDefinition, options);
  }
};
