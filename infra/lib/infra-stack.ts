import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EspacoFitnessDatabase } from "./database";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CRIAÇÃO DO BANCO DE DADOS (DYNAMODB)
    new EspacoFitnessDatabase(this, "Database");
  }
}
