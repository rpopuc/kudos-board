import "reflect-metadata";
import { MongoClient, Db, Collection as MongoCollection } from "mongodb";
import { Collection } from "@/infra/MongoDB/services/Collection";
import { Database } from "@/infra/MongoDB/services/Database";

jest.mock("mongodb");
jest.mock("dotenv");

describe("Database", () => {
  let mongoClientMock: jest.Mocked<MongoClient>;
  let dbMock: jest.Mocked<Db>;

  beforeEach(() => {
    dbMock = {
      collection: jest.fn(),
    } as any;

    mongoClientMock = {
      connect: jest.fn().mockResolvedValue(undefined),
      db: jest.fn().mockReturnValue(dbMock),
    } as any;

    (MongoClient as unknown as jest.Mock).mockReturnValue(mongoClientMock);

    process.env = {
      DB_CONN_STRING: "mongodb://localhost:27017",
      DB_NAME: "test",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to database", async () => {
    const database = new Database();

    await database.connect();

    expect(mongoClientMock.connect).toBeCalled();
    expect(mongoClientMock.db).toBeCalledWith(process.env.DB_NAME);
    expect(database.db).toBe(dbMock);
  });

  it("should return a Collection instance", async () => {
    const collectionName = "testCollection";

    dbMock.collection.mockReturnValue({} as MongoCollection);

    const database = new Database();
    database.db = dbMock;

    const collection = await database.getCollection(collectionName);

    expect(collection).toBeInstanceOf(Collection);
    expect(database.db?.collection).toBeCalledWith(collectionName);
  });

  it("should throw an error if database is not connected", async () => {
    mongoClientMock.db = jest.fn().mockReturnValue(undefined);

    const collectionName = "testCollection";

    const database = new Database();

    await expect(database.getCollection(collectionName)).rejects.toThrow(
      "The connection with the database was not established.",
    );
  });
});
