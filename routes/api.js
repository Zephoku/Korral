var DocumentDBClient = require('documentdb').DocumentClient;
var nconf = require('nconf');

nconf.env();
nconf.file({ file: 'config.json' });

var host = nconf.get("HOST");
var authKey = nconf.get("AUTH_KEY");
var databaseId = nconf.get("DATABASE");
var collectionId = nconf.get("COLLECTION");

var client = new DocumentDBClient(host, { masterKey: authKey });

exports.getCategories = function(req, res) {
  var userId = req.param("userId");

  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      listItems(userId, collection, function (items) {
        //console.log(items);
        res.json(items);
      });    
    });
  });
}

exports.getCategory = function(req, res) { 
  var userId = req.param("userId");
  var categoryId = req.param("categoryId");

  console.log(categoryId);
  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      readDocuments(userId, categoryId, collection, function(doc) {
        if (doc == null) {
          res.sendStatus(400);
          return;
        }
        console.log(doc);
        res.json(doc);
      });    
    });
  });
}

exports.getLinks = function(req, res) {
  var userId = req.param("userId");
  var categoryId = req.param("categoryId");
  console.log(categoryId);

  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      listLinks(userId, categoryId, collection, function (links) {
        console.log(links);
        res.json(links);
      });    
    });
  });
}

exports.postCategories = function(req, res) {
  var userId = req.param("userId");
  var categories = req.body;
  
  if (categories == null) {
    res.writeHead(401, {'Content-Type': 'text/json'});
  }

  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      createItem(collection, categories, function(err) {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    });
  });
}

exports.deleteCategories = function(req, res) {
  var userId = req.param("userId");
  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      deleteCollection(collection, function() {
        res.sendStatus(200);
      });
    });
  });
}

exports.deleteCategory = function(req, res) {
  var userId = req.param("userId");
  var categoryId = req.param("categoryId");

  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      readDocuments(userId, categoryId, collection, function(doc) {
        deleteDocument(doc, function() {
          res.sendStatus(200);
        });
      });
    });
  });
}

exports.putCategories = function(req, res) {
  var userId = req.param("userId");
  var categories = req.body;
  if (categories.id == null) {
    res.sendStatus(401);
    return;
  }

  readOrCreateDatabase(function (database) {
    readOrCreateCollection(userId, database, function (collection) {
      readDocuments(userId, categories.id, collection, function(doc) {
        console.log("Docs");
        console.log(doc);
        if (doc == null) {
            res.sendStatus(400);
            return;
        }
          
        updateItem(doc, categories, function(err) {
          if(err) {
            console.log(err);
            res.sendStatus(400);
          } else {
            res.sendStatus(200);
          }
        });

      });
    });
  });
}

var readOrCreateDatabase = function (callback) {
    client.queryDatabases('SELECT * FROM root r WHERE r.id="' + databaseId + '"').toArray(function (err, results) {
        if (err) {
            // some error occured, rethrow up
            console.log(err);
            throw (err);
        }
        if (!err && results.length === 0) {
            // no error occured, but there were no results returned 
            // indicating no database exists matching the query            
            client.createDatabase({ id: databaseId }, function (err, createdDatabase) {
                callback(createdDatabase);
            });
        } else {
            // we found a database
            callback(results[0]);
        }
    });
};

var readOrCreateCollection = function (userId, database, callback) {
    client.queryCollections(database._self, 'SELECT * FROM ' + userId).toArray(function (err, results) {
        if (err) {
            // some error occured, rethrow up
            console.log(err);
        }           
        if (!err && results.length === 0) {
            // no error occured, but there were no results returned 
            //indicating no collection exists in the provided database matching the query
            client.createCollection(database._self, { id: collectionId }, function (err, createdCollection) {
                callback(createdCollection);
            });
        } else {
            // we found a collection
            console.log(results[0]);
            callback(results[0]);
        }
    });
};

var updateOrCreateCollection = function (userId, collectionId, database, callback) {
    client.queryCollections(database._self, 'SELECT * FROM '+userId+' r WHERE r.id="'+collectionId + '"').toArray(function (err, results) {
        if (err) {
            // some error occured, rethrow up
            console.log(err);
            //throw (err);
        }           
        if (!err && results.length === 0) {
            // no error occured, but there were no results returned 
            //indicating no collection exists in the provided database matching the query
            client.createCollection(database._self, { id: collectionId }, function (err, createdCollection) {
                callback(createdCollection);
            });
        } else {
            // we found a collection
            callback(results[0]);
        }
    });
};

var readDocuments = function (userId, collectionId, collection, callback) {

    client.queryDocuments(collection._self, 'SELECT * FROM '+userId+' r WHERE r.id="'+collectionId + '"').toArray(function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      callback(docs[0]);
    }
  });
};

var listItems = function (userId, collection, callback) {
    client.queryDocuments(collection._self, 'SELECT r.id, r.icon, r.links FROM '+userId+ ' r').toArray(function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          callback(docs);
        }
    });
}

var listLinks = function (userId, categoryId, collection, callback) {
    client.queryDocuments(collection._self, 'SELECT r.links FROM '+userId+' r WHERE r.id="' + categoryId + '"').toArray(function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          callback(docs);
        }
    });
}

// create new item
var createItem = function (collection, documentDefinition, callback) {
    client.createDocument(collection._self, documentDefinition, function (err, doc) {
        callback(err);
    });
}

var deleteCollection = function (collection, callback) {
    client.deleteCollection(collection._self, [], function(err) {
      callback(err);
    });
}

var deleteDocument = function (doc, callback) {
    client.deleteDocument(doc._self, [], function(err) {
      callback(err);
    });
}

var updateItem = function (documentOld, documentNew, callback) {
  client.replaceDocument(documentOld._self, documentNew, function(err) {
    callback(err);
  });
}
