import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(req: Request) {
  try {
    const { email, targetRate } = await req.json();

    await docClient.send(
      new PutCommand({
        TableName: "Saveratesfrica-RateAlerts",
        Item: {
          email,
          targetRate: String(targetRate),
          status: "active",
          createdAt: new Date().toISOString()
        }
      })
    );

    return Response.json({ message: "Alert saved!" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
