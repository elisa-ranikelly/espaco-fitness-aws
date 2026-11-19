import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { Duration } from "aws-cdk-lib";

interface EspacoFitnessMicroserviceProps {
    productTable: ITable;
}

// FUNÇÕES PARA OS MICROSERVIÇOS, CADA UMA SÓ CONHECE A PRÓPRIA TABELA
export class EspacoFitnessMicroservice extends Construct {
    public readonly productMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: EspacoFitnessMicroserviceProps) {
        super(scope, id);

        this.productMicroservice = this.createProductFunction(props.productTable);
    }

    // TODAS AS FUNÇÕES UTILIZAM ESSAS PROPRIEDADES COMUNS (NODE 22, TEMPO LIMITE E O EMPACOTAMENTO)
    private commonProps(): NodejsFunctionProps{
        return {
            runtime: Runtime.NODEJS_22_X,
            timeout: Duration.seconds(10),
            bundling: {externalModules: ["@aws-sdk/*"]},
        }
    }

    private createProductFunction(productTable: ITable): NodejsFunction {

        const productFunction = new NodejsFunction(this, "productFunction", { 
            ...this.commonProps(),
            entry: join(__dirname, "..", "src", "product", "index.js"),
            environment: {
                DYNAMODB_TABLE_NAME: productTable.tableName,
            },
        });

        productTable.grantReadData(productFunction);
        return productFunction;
    }
}