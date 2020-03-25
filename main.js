const fetch = require('node-fetch');
module.exports = {
    execute: function (gatewayUri, clusterDefinition, command) {
        for (let index in clusterDefinition) {

            let node = clusterDefinition[index]
            node.parameters = [command];

            fetch(gatewayUri, {
                method: 'post',
                body: JSON.stringify(node),
                headers: {'Content-Type': 'application/json'},
            })
                .then(response => response.json())
                .then(function (json) {
                    console.log('Node #' + node.id + ' response:\n', json.output);
                });
        }
    }
};
