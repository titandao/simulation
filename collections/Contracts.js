Contracts = new Mongo.Collection('contracts');


Contracts.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  remove: function(userId, doc) {
    return true;
  }
});


// DataObject = function (data) {
//   _.extend(this, data);
// };


ContractSchema = new SimpleSchema({
  address: {
    type: String,
    label: "address"
  },
  name: {
    type: String,
    label: "name",
    optional: true
  },
  abi: {
    type: String,
    label: "abi"
    // optional: true
  },
  // ! this is the frontend creator,
  // not the actual contract .sol writer
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

Contracts.attachSchema( ContractSchema );


Meteor.methods({
  addContract: function(data) {

    // console.log(data); return;
    // console.log(JSON.stringify(data.abi));
    // return;
    // data.abi = { "moo": "foo" };

    Contracts.insert(data);

    // get the contract at given abi, address
    // var contract = web3.eth.contract(data.abi).at(data.address);

    // console.log(contract);

  },

  removeContract: function(id) {
    // console.log(id);
    Contracts.remove(id);
  }
});
