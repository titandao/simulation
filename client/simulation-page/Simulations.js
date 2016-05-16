Meteor.subscribe('simulations');

/*
  Simulations (plural)
*/

Template.Simulations.helpers({
   simulations: ()=> {
     // get only this user's Simulations
     return Simulations.find({author: Meteor.userId()});
   }
});

/*
  Simulation (singular)
*/

Template.Simulation.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   }
});

Template.Simulation.events({
  'click .remove'(e) {
    e.preventDefault();
    Meteor.call('removeSimulation', this._id);
  }
});
