Meteor.publish('contracts', function() {
  return Contracts.find({author: this.userId});
});
