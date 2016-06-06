


Template.SimulationPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var id = FlowRouter.getParam('_id');
    // self.subscribe('singleSimulation', id);
    // self.subscribe('simulations', id);
    Session.set('simulationRunning', false);


  });


  // self.autorun(()=> {
  //   console.log("hey");
  //   $( '#simulation-add-contract input[name="name"]' ).autocomplete({
  //     source: ["aaaa", "bbbb", "cccc"]
  //   });
  // });
});





// Template.SimulationPage.simulationRunning = ()=> {
//   return "false";
// }

Template.SimulationPage.helpers({

  getContractNames: function(contracts) {
    var result = [];
    for (var i=0; i<contracts.length; i++) {
      result.push({name:contracts[i].name});
    }
    console.log(result);
    return result;
  },

  simulationRunning: function() {
    return Session.get('simulationRunning') || false;
  },

  // toggleSimulationRunning() {
  //   Session.set('simulationRunning', Math.round(Math.random() * 10));
  //   // this.simulationRunning +=  1; //!this.simulationRunning;
  // },

   isOwner() {
     return this.author === Meteor.userId();
   },

   simulation: ()=> {
     var id = FlowRouter.getParam('_id');
     var sim = Simulations.findOne({_id: id});

     if (!sim) return;

     // populate contracts
     sim.contracts_obj = Contracts.find({
       "_id": { "$in": sim.contracts }
     }).fetch();

    //  console.log(sim.contracts[0]);
     console.log(sim);
     return sim;
   },



  //  contractNames: function() {
  //    return ["aaaaaaaaa", "bbbbbbbb", "cccccccccc"];
  //   //  return Contracts.find().fetch().map(function(it){ return it.name; });
  //  }
   settings: function() {
    return {
      position: "top",
      // position: Session.get("position"),
      limit: 5,
      rules: [
        // {
        //   token: '@',
        //   collection: Meteor.users,
        //   field: "username",
        //   template: Template.userPill
        // },
        {
          collection: Contracts,
          field: "name",
          options: 'i', // case insensitive; can't index
          matchAll: false,
          template: Template.Contract,
          filter: { author: Meteor.userId() } // match only this user's contracts
        }
      ]
    };
  }
});


Template.SimulationPage.events({
  'change #contract-select': function(e) {
    console.log('select');
  },

  "autocompleteselect input": function(event, template, doc) {
    // console.log("selected ", doc._id);
    // add the id to the list
    var sim_id = FlowRouter.getParam('_id');
    var con = doc._id;
    Meteor.call('updateSimulationAddContract', sim_id, con, function(err) {
      if (err) return ErrorMsg(err.toString());
      SuccessMsg("Update Successful");
    });
  },


  // chosen over a simple 'toggle' for UX
  'click #run-simulation': function(e) {
      e.preventDefault();
      Session.set('simulationRunning', true);
      $('#simulationViewer').slideDown();
  },
  'click #stop-simulation': function(e) {
      e.preventDefault();
      Session.set('simulationRunning', false);
      $('#simulationViewer').slideUp();
  },

  'submit #simulation-basic': function(e) {
    e.preventDefault();

    var data = {
      name: e.target.name.value,
      description: e.target.description.value
    };

    // console.log(FlowRouter.getParam('_id')); return;

    var id = FlowRouter.getParam('_id');
    Meteor.call('updateSimulation', id, data, function(err) {
      if (err) return ErrorMsg(err.toString());
      SuccessMsg("Update Successful");
    });


    // clear values
    // e.target.reset();
  }
});
