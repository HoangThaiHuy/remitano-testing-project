import { Test } from "@nestjs/testing";
import { NotificationGateway } from "./notification.gateway";
import { INestApplication } from "@nestjs/common";
import { Socket, io } from "socket.io-client";

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe("Notification", () => {
  let gateway: NotificationGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(NotificationGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<NotificationGateway>(NotificationGateway);
    // Create a new client that will interact with the gateway
    ioClient = io("http://localhost:3700", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    app.listen(3700);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });


});