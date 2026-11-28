import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Distribution, PriceClass, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { join } from "path";

// HOSPEDAGEM DO FRONT EM UM BUCKET PRIVADO MAIS CLOUDFRONT
export class EspacoFitnessFrontend extends Construct{
    constructor(scope: Construct, id: string){
        super(scope, id);

        const siteBucket = new Bucket(this, "siteBucket", {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true // PERMITE AO DESTROY APAGAR O BUCKET
        });

        const distribution = new Distribution(this, "siteDistribution", {
            defaultRootObject: "index.html",
            priceClass: PriceClass.PRICE_CLASS_100,
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            errorResponses: [
                {httpStatus: 403, responseHttpStatus: 200, responsePagePath: "/index.html"},
                {httpStatus: 404, responseHttpStatus: 200, responsePagePath: "/index.html"},
            ],
        });

        // ENVIA O CONTEÚDO DE FRONTEND -> DIST PARA O BUCKET A CADA DEPLOY
        new BucketDeployment(this, "siteDeployment", {
            sources: [Source.asset(join(__dirname, "..", "..", "frontend", "dist"))],
            destinationBucket: siteBucket, distribution,
            distributionPaths: ["/*"],
        });

        new CfnOutput(this, "SiteUrl", { value: `https://${distribution.distributionDomainName}` });
    }
};