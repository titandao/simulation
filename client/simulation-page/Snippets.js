



Template.SimulationContract.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   }
});


Template.SimulationContract.events({
  // remove it from the simulation, not the
  // actual contract collection
  'click .remove'(e) {
    e.preventDefault();

    var con_id = this._id;

    // ! assuming we're on /simulation/:id page
    var sim_id = FlowRouter.getParam('_id');

    // console.log(con_id+","+sim_id);return;

    Meteor.call('simulationRemoveContract', sim_id, con_id);
  }
});
