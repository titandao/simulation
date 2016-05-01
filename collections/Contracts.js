Contracts = new Mongo.Collection('contracts');


Contracts.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  remove: function(userId, doc) {
    return false;
  }
});


ContractSchema = new SimpleSchema({
  address: {
    type: String,
    label: "Address"
  },
  name: {
    type: String,
    label: "Name",
    optional: true
  },
  author: {
    type: String,
    label: "Author",
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
    // data.createdAt = new Date();
    Contracts.insert(data);
  },

  removeContract: function(id) {
    // console.log(id);
    Contracts.remove(id);
  }
});
