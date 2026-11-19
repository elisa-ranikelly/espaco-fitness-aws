import { CfnOutput } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EspacoFitnessApiGatewayProps{
    productMicroservice: IFunction;
};

export class EspacoFitnessApiGateway extends Construct{
    constructor(scope: Construct, id: string, props: EspacoFitnessApiGatewayProps){
        super(scope, id);

        this.createProductApi(props.productMicroservice);
    };

    private createProductApi(productMicroservice: IFunction){
        const apigtw = new LambdaRestApi(this, "productApi", {
            restApiName: "Product Service",
            handler: productMicroservice,
            proxy: false,
        });

        const product = apigtw.root.addResource("product");
        product.addMethod("GET");

        const singleProduct = product.addResource("{id}");
        singleProduct.addMethod("GET");

        new CfnOutput(this, "ProductApiUrl", {value: apigtw.url});
    }
}