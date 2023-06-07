import { PrismaClient } from "@prisma/client";

export class PrismaClientSingleton {
  private static client: PrismaClient;

  private static initClient() {
    PrismaClientSingleton.client = new PrismaClient();
  }

  public static getClient() {
    if (!PrismaClientSingleton.client) {
      PrismaClientSingleton.initClient();
    }
    return PrismaClientSingleton.client;
  }
}
