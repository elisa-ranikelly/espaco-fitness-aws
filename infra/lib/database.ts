import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

// CRIAÇÃO DO BANCO (DYNAMODB) PARA CADA SERVIÇO
export class EspacoFitnessDatabase extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderTable: ITable;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.productTable = this.createProductTable();
        this.basketTable = this.createBasketTable();
        this.orderTable = this.createOrderTable();
    }

    // MÉTODOS DE CRIAÇÃO DAS TABELAS (PRODUTO, CARRINHO E PEDIDO)
    private createProductTable(): ITable {
        return new Table(this, "product", {
            partitionKey: { name: "id", type: AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY, // DESTROY SERVE PARA APAGAR A TABELA
            tableName: "product",
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
    }

    private createBasketTable(): ITable {
        return new Table(this, "basket", {
            partitionKey: { name: "userName", type: AttributeType.STRING },
            tableName: "basket",
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
    }

    private createOrderTable(): ITable {
        return new Table(this, "order", {
            partitionKey: { name: "userName", type: AttributeType.STRING },
            sortKey: { name: "orderDate", type: AttributeType.STRING },
            tableName: "order",
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
    }
}

