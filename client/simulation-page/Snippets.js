



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


/*
  Metric view
*/

Template.Metric.events({
  'click .remove'(e) {

    e.preventDefault();

    var sim_id = FlowRouter.getParam('_id');
    Meteor.call('simulationRemoveMetric', sim_id, this._id, (err)=> {
      if (err) {
        console.log(err)
      }
    });
  }
});


Template.Agent.events({
  // remove it from the simulation, not the
  // actual contract collection
  'click .remove'(e) {
    e.preventDefault();

    var agent_id = this._id;
    // ! assuming we're on /simulation/:id page
    var sim_id = FlowRouter.getParam('_id');

    // console.log(agent_id+","+sim_id);
    // var sim = Simulations.findOne({_id: sim_id});
    // console.log(sim); return;


    Meteor.call('simulationRemoveAgent', sim_id, agent_id);
  }
});
