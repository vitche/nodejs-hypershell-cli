const cronScript = require('nodejs-cron-script');
module.exports = {
    execute: function (clusterDefinition, command) {
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
                fetch(gatewayUri, {
                    method: 'post',
                    body: requestBody,
                    headers: {'Content-Type': 'application/json'},
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((json) => {
                        if (json.output) {
                            console.log('Node #' + nodeIdentifier + ' response:', json.output);
                        }
                        if (json.error) {
                            console.log('Node #' + nodeIdentifier + ' error:', json.error);
                        }
                    });
            };
            if (schedulerPattern) {
                const code = cronScript.compile(job, {
                    "gatewayUri": gatewayUri,
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
    }
};
