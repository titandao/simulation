Meteor.subscribe('contracts');


/*
  Contracts (plural)
*/

Template.Contracts.helpers({
   contracts: ()=> {
     // get only this user's contracts
     return Contracts.find({author: Meteor.userId()});
   }
});

/*
  Contract (singular)
*/

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
