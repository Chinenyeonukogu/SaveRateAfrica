import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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

const currencyByCountry = {
  USA: "USD",
  UK: "GBP",
  Canada: "CAD"
} as const;

type AlertCountry = keyof typeof currencyByCountry;

export async function POST(req: Request) {
  try {
    const { email, targetRate, country } = (await req.json()) as {
      email?: string;
      targetRate?: number | string;
      country?: AlertCountry;
    };
    const alertCountry: AlertCountry = country && country in currencyByCountry ? country : "USA";
    const currency = currencyByCountry[alertCountry];
    const targetRateText = String(targetRate);

    await docClient.send(
      new PutCommand({
        TableName: "Saveratesfrica-RateAlerts",
        Item: {
          email,
          targetRate: targetRateText,
          country: alertCountry,
          status: "active",
          createdAt: new Date().toISOString()
        }
      })
    );

    await sesClient.send(
      new SendEmailCommand({
        Source: "partners@saverateafrica.com",
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

We will email you the moment NGN hits your target rate of ${targetRateText} NGN/${currency}.

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
