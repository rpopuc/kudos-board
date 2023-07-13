import { Collection } from "@/infra/MongoDB/services/Collection";
import { FindCursor, Collection as MongoCollection, ObjectId } from "mongodb";

describe("Collection", () => {
  let mongoCollectionMock: jest.Mocked<MongoCollection>;
  let collection: Collection<any>;

  beforeEach(() => {
    mongoCollectionMock = {
      find: jest.fn().mockImplementation(() => ({
        toArray: jest.fn().mockResolvedValue([]),
      })),
      insertOne: jest.fn().mockResolvedValue({}),
      updateOne: jest.fn().mockResolvedValue({}),
      deleteOne: jest.fn().mockResolvedValue({ acknowledged: true }),
    } as any;

    collection = new Collection<any>(mongoCollectionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("find", () => {
    it("should find documents by filter", async () => {
      const filter = { field: "value" };
      const documents = [{ _id: new ObjectId().toHexString() }];

      mongoCollectionMock.find.mockImplementationOnce(
        () =>
          ({
            toArray: jest.fn().mockResolvedValueOnce(documents),
          } as Partial<FindCursor<any>> as FindCursor<any>),
      );

      const result = await collection.find(filter);

      expect(result).toEqual(documents);
      expect(mongoCollectionMock.find).toHaveBeenCalledWith(filter);
    });
  });

  describe("findFirst", () => {
    it("should find first document by filter", async () => {
      const filter = { field: "value" };
      const document = { _id: new ObjectId().toHexString() };

      mongoCollectionMock.find.mockImplementationOnce(
        () =>
          ({
            toArray: jest.fn().mockResolvedValueOnce([document]),
          } as Partial<FindCursor<any>> as FindCursor<any>),
      );

      const result = await collection.findFirst(filter);

      expect(result).toEqual(document);
      expect(mongoCollectionMock.find).toHaveBeenCalledWith(filter);
    });
  });

  describe("insertOne", () => {
    it("should insert one document", async () => {
      const document = { field: "value" };

      const result = await collection.insertOne(document);

      expect(result).toEqual(document);
      expect(mongoCollectionMock.insertOne).toHaveBeenCalledWith(document);
    });
  });

  describe("update", () => {
    it("should update one document", async () => {
      const id = new ObjectId();
      const document = { field: "newValue" };

      const result = await collection.update(id, document);

      expect(result).toEqual(document);
      expect(mongoCollectionMock.updateOne).toHaveBeenCalledWith({ _id: id }, { $set: document });
    });
  });

  describe("delete", () => {
    it("should delete one document", async () => {
      const id = new ObjectId();

      const result = await collection.delete(id);

      expect(result).toEqual(true);
      expect(mongoCollectionMock.deleteOne).toHaveBeenCalledWith({ _id: id });
    });
  });
});
