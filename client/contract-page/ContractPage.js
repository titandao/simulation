

Template.ContractPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var contractId = FlowRouter.getParam('_id');
    self.subscribe('singleContract', contractId);
  });
});


Template.ContractPage.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   },

   contract: ()=> {
     var contractId = FlowRouter.getParam('_id');
     return Contracts.findOne({_id: contractId});
   }
});
//
// Template.ContractPage.events({
//   'click .moo'(e) {
//     e.preventDefault();
//     // Meteor.call('removeContract', this._id);
//   }
// });
