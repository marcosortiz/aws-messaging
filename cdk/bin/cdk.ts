#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/cdk-stack';
const fs = require('fs');
const path = require('path');

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../config/config.json`);
const config = fs.readFileSync(CONFIG_FILE_PATH,'utf8');
const stackName = JSON.parse(config).stackName;

const app = new cdk.App();
new CdkStack(app, stackName);
