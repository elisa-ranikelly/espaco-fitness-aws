import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EspacoFitnessDatabase } from "./database";
import { EspacoFitnessMicroservice } from './microservice';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CRIAÇÃO DO BANCO DE DADOS (DYNAMODB)
    const database = new EspacoFitnessDatabase(this, "DataBase");

    new EspacoFitnessMicroservice (this, "Microservices", {
      productTable: database.productTable
    });
  }
}
