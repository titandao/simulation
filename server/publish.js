Meteor.publish('contracts', function() {
  return Contracts.find({author: this.userId});
});

Meteor.publish('simulations', function() {
  return Simulations.find({author: this.userId});
});
