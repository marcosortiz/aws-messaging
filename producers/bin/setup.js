var fs   = require('fs');
var path = require('path');

var AWS            = require('aws-sdk/global');
var Cloudformation = require('aws-sdk/clients/cloudformation');

const KEYS = [ 'SqsQueueUrl', 'FifoSqsQueueUrl'];

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../config/config.json`);
const PRODUCER_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../lib/config/config.json`);

var region = null;
var stackName = null;

function getRegion() {
    region = process.env.BACKEND_REGION;
    if (region == null) {
        var data = fs.readFileSync(CONFIG_FILE_PATH, 'UTF8');
        region = JSON.parse(data).region;
    }
    return region;
}

function getBackendStackName() {
    stackName = process.env.CFN_STACK_NAME;
    if (stackName == null) {
        var data =  fs.readFileSync(CONFIG_FILE_PATH, 'UTF8');
        stackName = JSON.parse(data).stackName;
    }
    return stackName;
}

function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function fetchConfig(keys, outputs) {
    console.log('Reading backend configuration file ...');
    AWS.config.region = getRegion();

    const cfn = new Cloudformation();
    var stackName = getBackendStackName()
    var params = {
        StackName: stackName
    };

    console.log(`Parsing configuration params from CloudFormation stack ${stackName} ...`);
    cfn.describeStacks(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            var config = { region: region };
            var outputs = data.Stacks[0].Outputs;
            KEYS.forEach(function(key) {
                config[key] = find(outputs, key);
            });
            let content = JSON.stringify(config, null, 4);
            fs.writeFileSync(PRODUCER_CONFIG_FILE_PATH, content);
            console.log(`Producers configuration saved to ${PRODUCER_CONFIG_FILE_PATH}`);
        }     
    });
}

fetchConfig();
