import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EspacoFitnessDatabase } from "./database";
import { EspacoFitnessMicroservice } from './microservice';
import { EspacoFitnessApiGateway } from "./apigateway";
import { EspacoFitnessFrontend } from "./frontend";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CRIAÇÃO DO BANCO DE DADOS (DYNAMODB)
    const database = new EspacoFitnessDatabase(this, "DataBase");

    const microservices = new EspacoFitnessMicroservice(this, "Microservices", {
      productTable: database.productTable
    });

    /*new EspacoFitnessMicroservice (this, "Microservices", {
      productTable: database.productTable
    });*/

    new EspacoFitnessApiGateway(this, "ApiGateway", {
      productMicroservice: microservices.productMicroservice
    });

    new EspacoFitnessFrontend(this, "Frontend");
  }
}
