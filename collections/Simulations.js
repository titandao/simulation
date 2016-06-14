Simulations = new Mongo.Collection('simulations');


// Simulations.allow({
//   insert: function(userId, doc) {
//     return !!userId;
//   },
//   remove: function(userId, doc) {
//     return false;
//   }
// });


// DataObject = function (data) {
//   _.extend(this, data);
// };


MetricSchema = new SimpleSchema({
  // manual id for convenience
  _id: {
    type: String,
    label: "_id"
  },
  contractId: {
    type: String,
    label: "contractId"
  },
  metric: {
    type: String,
    label: "metric"
  }
});


AgentSchema = new SimpleSchema({
  // manual id for convenience
  _id: {
    type: String,
    label: "_id"
  },
  account: {
    type: String,
    label: "account"
  },
  contractName: {
    type: String,
    label: "contractName",
    optional: true
  },
  contractMethod: {
    type: String,
    label: "contractMethod"
    // optional: true
  },

  // in milliseconds
  startTime: {
    type: Number,
    label: "startTime",
    min: 0
  },
  frequency: {
    type: Number,
    label: "frequency",
    min: -1 // one-time call
  },

  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function() {
      return new Date();
    }
  }
});


SimulationSchema = new SimpleSchema({
  // list of metric names e.g. "total"
  metrics: {
    type: [MetricSchema],
    label: "metrics",
    optional: true
  },

  agents: {
    type: [AgentSchema],
    label: "agents",
    optional: true
  },

  // store contract ids
  contracts: {
    type: [String],
    label: "contracts",
    optional: true
    // results in mongo duplicate error
    // autoValue: ()=> { return []; }
  },

  name: {
    type: String,
    label: "name"
  },
  description: {
    type: String,
    label: "description",
    optional: true
  },
  // creator of the simulation
  author: {
    type: String,
    label: "author",
    autoValue: function() {
      return this.userId;
    }
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function() {
      return new Date();
    }
  }
});

Simulations.attachSchema( SimulationSchema );


Meteor.methods({
  simulationAddMetric: (sim_id, data)=> {
    data._id = Random.id();
    // console.log(data);
    // return;
    Simulations.update(sim_id, {
      $push: {
        'metrics': data
      }
    });

  },

  simulationAddAgent: (sim_id, data)=> {
    // add a random id
    data._id = Random.id();

    // console.log(data);
    Simulations.update(sim_id, {
      $push: {
        'agents': data
      }
    });
  },

  addSimulation: function(data) {
    data.contracts = [];
    Simulations.insert(data);
  },

  updateSimulationAddContract: function(sim_id, con) {
    Simulations.update(sim_id, {
      $push: {
        'contracts': con
      }
    });
  },

  simulationRemoveContract: function(sim_id, con_id) {
    Simulations.update(sim_id, {
      $pull: {
        'contracts': con_id
      }
    });
  },

  simulationRemoveMetric: (sim_id, metric_id)=> {
    // console.log(sim_id); console.log(metric_id);
    // console.log('rem'); return;

    Simulations.update(sim_id, {
      $pull: {
        'metrics': {
          // _id is a manual field here
          "_id": metric_id
        }
      }
    });
  },

  simulationRemoveAgent: (sim_id, ag_id)=> {
    // console.log('rem'); return;

    Simulations.update(sim_id, {
      $pull: {
        'agents': ag_id
      }
    });
  },

  updateSimulation: function(id, data) {
    // console.log(id); console.log(data); return;

    Simulations.update(id, {
      $set: data
    });
  },

  removeSimulation: function(id) {
    // console.log(id);
    Simulations.remove(id);
  }
});
