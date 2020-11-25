import {
  Client,
  // Object that contains the type definitions of every API method
  RequestParams,
  // Interface of the generic API response
  ApiResponse
} from "@elastic/elasticsearch";
import logger from "../utils/logger";
import ENV from "../utils/env";

export class EsClient {
  public esclient = new Client({ node: "http://localhost:9200" });

  // Check if Elastic search engine is running
  public async checkEsConnection() {
    this.esclient.ping(err => {
      if (err) return logger.info("Elastic search cluster is down");
      logger.info("Elastic search cluster is up!");
    });
  }

  //Create Index

  public async createIndex(indexName) {
    return this.esclient.indices.create({ index: indexName });
  }

  public async refresh(indexName) {
    return this.esclient.indices.refresh({ index: indexName });
  }
  //Check if Index already exists

  public async indexExists(indexName) {
    return this.esclient.indices.exists({ index: indexName });
  }

  // Prepare index and its mapping
  public async createMapping(indexName, docType, payload) {
    return this.esclient.indices.putMapping({ index: indexName, type: docType, body: payload });
  }

  // Add/update new Document
  public async createDocument(indexName, _id, docType, payload) {
    return this.esclient.index({ index: indexName, type: docType, id: _id, body: payload });
  }

  // Update a Document
  public async updateDocument(indexName, _id, docType, payload) {
    return this.esclient.update({ index: indexName, type: docType, id: _id, body: payload });
  }

  //Search
  public async search(indexName, docType, payload) {
    return this.esclient.search({ index: indexName, type: docType, body: payload });
  }

  // Delete a document from an index
  public async deleteDocument(indexName, _id, docType) {
    return this.esclient.delete({ index: indexName, type: docType, id: _id });
  }

  // Delete all
  public async deleteAll() {
    return this.esclient.indices.delete({ index: "_all" });
  }
}
