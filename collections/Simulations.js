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


SimulationSchema = new SimpleSchema({

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
  addSimulation: function(data) {

    // console.log(data); //return;
    // console.log(JSON.stringify(data.abi));
    // return;
    // data.abi = { "moo": "foo" };
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
