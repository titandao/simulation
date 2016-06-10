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


AgentSchema = new SimpleSchema({
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
  // contracts() {
  //   var _ids =
  // },

  addSimulation: function(data) {

    // console.log(data); //return;
    // console.log(JSON.stringify(data.abi));
    // return;
    // data.abi = { "moo": "foo" };
    data.contracts = [];
    Simulations.insert(data);
    // try {
    //   Simulations.insert(data);
    // } catch(e) {
    //   console.log("err");
    //   ErrorMsg(e.toString());
    // }


    // get the contract at given abi, address
    // var contract = web3.eth.contract(data.abi).at(data.address);

    // console.log(contract);

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
