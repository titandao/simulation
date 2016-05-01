Meteor.subscribe('contracts');



Template.Contracts.helpers({
   contracts: ()=> {
     return Contracts.find({});
   }
});



Template.Contract.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   }
});

Template.Contract.events({
  'click .remove'(e) {
    e.preventDefault();
    Meteor.call('removeContract', this._id);
  }
});
