
// default function() for a contract
// i.e. sending it ether
var sendFunctionAbi = {
  "constant": false,
  "name": 'send',
  "type": "function",
  "inputs": [{
  	"name": "amount",
  	"type": "uint256"
	}],
  "outputs": []
};

Template.SimulationPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var id = FlowRouter.getParam('_id');
    // self.subscribe('singleSimulation', id);
    // self.subscribe('simulations', id);
    Session.set('simulationRunning', false);


  });
});





// Template.SimulationPage.simulationRunning = ()=> {
//   return "false";
// }

Template.SimulationPage.helpers({
  metricsSelectedContract: function() {
    var id = Session.get('metrics-selected-contract-id');

    if (!id) return {};

    // get the contract, and public variables
    var con = Contracts.findOne({_id: id});
    return con;
    // console.log(con);
  },
  agentsSelectedContract: function() {
    var id = Session.get('agents-selected-contract-id');

    if (!id) return {};

    // get the contract, and public variables
    var con = Contracts.findOne({_id: id});
    return con;
  },

  getContractMetrics: function(contract) {
    if (!contract) return [];

    var result = [];
    try {
      var abi = JSON.parse(contract.abi);
    } catch(e) {
      console.log(e);
      console.log(contract.abi);
      return [];
    }

    if (!abi) return [];

    var item;
    for (var i=0; i<abi.length; i++) {
      item = abi[i];
      if (item.constant) {
        result.push(item);
      }
    }
    // console.log(result);
    return result;
  },

  getContractMethods: function(contract) {
    if (!contract) return [];

    var result = [sendFunctionAbi];
    try {
      var abi = JSON.parse(contract.abi);
    } catch(e) {
      console.log(e);
      console.log(contract.abi);
      return [];
    }

    if (!abi) return [];

    var item;
    for (var i=0; i<abi.length; i++) {
      item = abi[i];
      if (item.constant===false) {
        // if (item['type']=='constructor') {
        //   item['name'] = 'constructor';
        // }
        result.push(item);
      }
    }
    // console.log(result);
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

     if (!sim) return {};

     // populate contracts
     sim.contracts_obj = Contracts.find({
       "_id": { "$in": sim.contracts }
     }).fetch();


     return sim;
   },



  //  contractNames: function() {
  //    return ["aaaaaaaaa", "bbbbbbbb", "cccccccccc"];
  //   //  return Contracts.find().fetch().map(function(it){ return it.name; });
  //  }
   settings: function() {
     // get sim for sim.contracts...
     var id = FlowRouter.getParam('_id');
     var sim = Simulations.findOne({_id: id});

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
          filter: {
            author: Meteor.userId(),
            _id: { "$nin": sim ? sim.contracts : [] } // not already in simulation
          } // match only this user's contracts
        }
      ]
    };
  }
});


Template.SimulationPage.events({
  'change #metric-contract-select': function(e) {
    var val = $(e.target).val().trim(); // contract id

    Session.set('metrics-selected-contract-id', val);
  },

  'change #agent-contract-select': function(e) {
    var val = $(e.target).val().trim(); // contract id

    Session.set('agents-selected-contract-id', val);
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
  },

  'submit #simulation-add-metric': (e)=> {
    e.preventDefault();

    var data = {
      contractId: e.target.contractId.value,
      metric: e.target.metric.value
    };
    console.log(data);
  },
  'submit #simulation-add-agent': (e)=> {
    e.preventDefault();

    var data = {
      account: e.target.account.value,
      contractId: e.target.contractId.value,
      metric: e.target.metric.value,
      starttime: e.target.starttime.value,
      frequency: e.target.frequency.value
    };
    console.log(data);
  }
});
