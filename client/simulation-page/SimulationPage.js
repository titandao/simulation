

Template.SimulationPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var id = FlowRouter.getParam('_id');
    self.subscribe('singleSimulation', id);
  });


  // self.autorun(()=> {
  //   console.log("hey");
  //   $( '#simulation-add-contract input[name="name"]' ).autocomplete({
  //     source: ["aaaa", "bbbb", "cccc"]
  //   });
  // });
});




Template.SimulationPage.helpers({
   isOwner() {
     return this.author === Meteor.userId();
   },

   simulation: ()=> {
     var id = FlowRouter.getParam('_id');
     return Simulations.findOne({_id: id});
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
          options: '',
          matchAll: false,
          template: Template.Contract,
          filter: { author: Meteor.userId() } // match only this user's contracts
        }
      ]
    };
  }
});


Template.SimulationPage.events({
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
  },


  'submit #simulation-add-contract': function(e) {
    e.preventDefault();

  }
});
