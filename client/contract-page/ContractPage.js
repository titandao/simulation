




Template.ContractPage.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   }
});

Template.ContractPage.events({
  // 'click .remove'(e) {
  //   e.preventDefault();
  //   Meteor.call('removeContract', this._id);
  // }
});
