import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  getCorridorConfig,
  getOriginCountry,
  isOriginCountry,
  isDestinationCurrency,
  isProviderEligibleForCorridor
} from "@/lib/corridors";

const awsConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
  }
};

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);
const sesClient = new SESClient(awsConfig);

export async function POST(req: Request) {
  try {
    const { email, targetRate, country, destinationCurrency } = (await req.json()) as {
      email?: string;
      targetRate?: number | string;
      country?: string;
      destinationCurrency?: string;
    };
    const alertCountry = country && isOriginCountry(country) ? country : "USA";
    const destination = destinationCurrency && isDestinationCurrency(destinationCurrency) ? destinationCurrency : "NGN";
    const origin = getOriginCountry(alertCountry);
    const corridor = getCorridorConfig(alertCountry, destination);
    const alertProviders = corridor?.scrapeProviders.filter((provider) =>
      isProviderEligibleForCorridor(alertCountry, destination, provider)
    );
    if (!origin?.active || !alertProviders?.length) {
      return Response.json({ error: "Rate alerts are not available for this corridor yet." }, { status: 400 });
    }
    const currency = origin.currency;
    const targetRateText = String(targetRate);

    await docClient.send(
      new PutCommand({
        TableName: "Saveratesfrica-RateAlerts",
        Item: {
          email,
          targetRate: targetRateText,
          country: alertCountry,
          corridor: `${alertCountry}-${destination}`,
          destinationCurrency: destination,
          status: "active",
          createdAt: new Date().toISOString()
        }
      })
    );

    await sesClient.send(
      new SendEmailCommand({
        Source: "Patterns@saverateafrica.com",
        Destination: {
          ToAddresses: email ? [email] : []
        },
        Message: {
          Subject: {
            Data: "Your NGN Rate Alert is Set! 🎯"
          },
          Body: {
            Text: {
              Data: `Hi there!

Your rate alert has been saved successfully.

We will email you the moment ${destination} hits your target rate of ${targetRateText} ${destination}/${currency}.

Thank you for using SaveRateAfrica!

- The SaveRateAfrica Team
www.saverateafrica.com`
            }
          }
        }
      })
    );

    return Response.json({ message: "Alert saved!" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
