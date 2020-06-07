const cronScript = require('nodejs-cron-script');
module.exports = {
    execute: function (clusterDefinition, command) {
        const gatewayUri = clusterDefinition["gateway"]["uri"];
        const schedulerPattern = clusterDefinition["scheduler"]["pattern"];
        for (let index in clusterDefinition.nodes) {

            let node = clusterDefinition.nodes[index];
            node.parameters = [command];

            const job = function () {
                const fetch = require('node-fetch');
                fetch(gatewayUri, {
                    method: 'post',
                    body: JSON.stringify(node),
                    headers: {'Content-Type': 'application/json'},
                })
                    .then(response => response.json())
                    .then(function (json) {
                        console.log('Node #' + node.id + ' response:\n', json.output);
                    });
            };
            const code = cronScript.compile(job);
            console.log(code);
        }
    }
};
