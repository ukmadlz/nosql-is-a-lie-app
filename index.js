
'use strict';

// Required Libs
const cfenv  = require('cfenv');
const Hapi   = require('hapi');
const Path   = require('path');
const Pusher = require('pusher');

// Handle Configs
const appEnv = cfenv.getAppEnv();

// Instantiate the server
const server = new Hapi.Server({
  debug: {
    request: ['error', 'good'],
  },
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public'),
      },
    },
  },
});

// Set Hapi Connections
server.connection({
  host: appEnv.bind || 'localhost',
  port: appEnv.port || process.env.PORT || 5000,
});

// Hapi Log
server.log(['error', 'database', 'read']);

// Hapi Plugins
const hapiErr = function (err) {
  if (err) console.log(err);
};

// DB List
const dbList = {
  'key-value': [
    'redis',
    'memcached',
    'riak kv',
    'riak',
    'hazelcast',
    'ehcache',
    'aerospike',
    'oracle coherence',
    'berkeley db',
    'amazon simpledb',
    'oracle nosql',
    'infinispan',
    'leveldb',
    'gridgain',
    'zodb',
    'gt.m',
    'ncache',
    'rocksdb',
    'wiredtiger',
    'websphere extreme scale',
    'tokyo cabinet',
    'project voldemort',
    'xap',
    'hibari',
    'mapdb',
    'tokyo tyrant',
    'stsdb',
    'scalaris',
    'globalsdb',
    'hyperdex',
    'kyoto cabinet',
    'tarantool',
    'lightcloud',
    'scaleout',
    'stateserver',
    'upscaledb',
    'quasardb',
    'bangdb',
    'bergdb',
    'cachelot.io',
    'codernitydb',
    'cortexdb',
    'elliptics',
    'helium',
    'hyperleveldb',
    'kyoto tycoon',
    'ledisdb',
    'nanolat',
    'resin',
    'tomp2p'
  ],
  document: [
    'cloudant',
    'couchdb',
    'mongodb',
    'couchbase',
    'rethinkdb',
    'ravendb',
    'gemfire',
    'pouchdb',
    'microsoft azure documentdb',
    'datameer',
    'cloudkit',
    'mnesia',
    'google cloud datastore',
    'tokumx',
    'clusterpoint',
    'terrastore',
    'raptordb',
    'ejdb',
    'sisodb',
    'whitedb',
    'sequoiadb',
    'jasdb',
    'lokijs',
    'densodb',
    'djondb',
    'faunadb',
    'fleetdb',
    'senseidb',
  ],
  column: [
    'cassandra',
    'hbase',
    'accumulo',
    'hypertable',
    'google cloud bigtable',
    'scylladb',
  ],
  graph: [
    'neo4j',
    'titan',
    'giraph',
    'infinitegraph',
    'sparksee',
    'hypergraphdb',
    'flockdb',
    'velocitygraph',
    'infogrid',
    'graphbase'
  ]
};

// Titles
const dbNames = {
  'key-value': 'Key Value',
  document: 'Document',
  column: 'Column',
  graph: 'Graph'
};

// Views
server.register(require('vision'), (err) => {

  if (err) {
      throw err;
  }

  server.views({
    engines: { jade: require('jade') },
    path: __dirname + '/templates',
    compileOptions: {
      pretty: true,
    },
  });
});

// Static
server.register(require('inert'));
server.route({
  method: 'GET',
  path: '/app.js',
  handler: {
    file: 'app.js',
  },
});

// Pusher
var pusher = new Pusher({
  appId: '201509',
  key: 'ab09ac6fc0d6c1cf2fee',
  secret: '69fd2a62abaec241e641',
  cluster: 'eu',
  encrypted: true
});

// Routes
server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: function (request, reply) {
      reply().redirect('/key-value');
    },
  },
});
server.route({
  method: 'GET',
  path: '/{database}',
  config: {
    handler: function (request, reply) {
      return reply.view('index', {
        title: dbNames[request.params.database],
        database: request.params.database
      });
    },
  },
});
server.route({
  method: 'GET',
  path: '/{database}/check',
  config: {
    handler: function (request, reply) {

      if (dbList[request.params.database].indexOf(request.query.database.toLowerCase()) >= 0) {
        pusher.trigger(request.params.database, 'new-entry', {
          "database": request.query.database
        });
      }
      return reply({
        response: dbList[request.params.database].indexOf(request.query.database.toLowerCase()),
      });
    },
  },
});

server.route({
  method: 'GET',
  path: '/{database}/result',
  config: {
    handler: function (request, reply) {
      return reply.view('result', {
        title: dbNames[request.params.database] + ' Results',
        database: request.params.database
      });
    },
  },
});

// Start Hapi
server.start(function (err) {
  if (err) {
    hapiErr(err);
  } else {
    console.log('Server started at: ' + server.info.uri);
  }
});

