const cronScript = require('nodejs-cron-script');
module.exports = {
    execute: function (clusterDefinition, command) {
        const gatewayUri = clusterDefinition["gateway"]["uri"];
        const schedulerPattern = clusterDefinition["scheduler"]["pattern"];
        for (let index in clusterDefinition.nodes) {

            let node = clusterDefinition.nodes[index];
            node.parameters = [command];

            const nodeIdentifier = node.id;
            const requestBody = JSON.stringify(node);

            const job = function () {
                const fetch = require('node-fetch');
                fetch(gatewayUri, {
                    method: 'post',
                    body: requestBody,
                    headers: {'Content-Type': 'application/json'},
                })
                    .then(response => response.json())
                    .then((json) => {
                        console.log('Node #' + nodeIdentifier + ' response:', json.output);
                    });
            };
            const code = cronScript.compile(job, {
                "gatewayUri": gatewayUri,
                "requestBody": requestBody,
                "nodeIdentifier": nodeIdentifier
            });
            const callback = function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(stdout, stderr);
                }
            };
            if (schedulerPattern) {
                cronScript.schedule(schedulerPattern, code, callback);
            } else {
                cronScript.execute(code, callback);
            }
        }
    }
};
