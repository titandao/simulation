/*
  Internal
*/

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

// dummy sample data
var initialColumns = [
  // ['data1', 30, 200, 100, 400, 150, 250]
];

var MAX_TIMEOUT_MS = 300000; // 300s=5mins
var UPDATE_INTERVAL = 4000;



var launchAgents = (sim)=> {
  // console.log(sim.agents);

  // just launch each in parrallel
  async.each(sim.agents, (item, cb)=> {
    var start = item.startTime;
    var frequency = item.frequency;

    // TEST call desired function once
    var contract = Contracts.findOne({_id: item.contractName});

    // console.log(item);
    // console.log(contract);

    try {
      var abi = JSON.parse(contract.abi);
    } catch(e) {
      console.log(e);
      console.log(contract.abi);
      return;
    }

    // get the web3 contract
    web3.eth.contract(abi).at(contract.address, (err, contractInstance)=> {
      if (err) {
        return cb(err);
      }

      // console.log(contractInstance);

      // for now just send
      var sender = item.account;
      var receiver = contract.address;
      var amount = 10; // 10 wei

      web3.personal.unlockAccount(sender, "passphrase", function(err, result) {
        if (err) return cb(err);


        var interval = setInterval(()=> {
          web3.eth.sendTransaction({from:sender, to:receiver, value:amount}, (err, result)=> {
            if (err) {
              clearTimeout(interval);
              return cb(err);
            }

            // console.log(result);

          });

          cb();
        }, frequency);

      });




      // setInterval(()=> {
      //   // call the desired function
      // }, frequency);
      // cb();
    });

  }, (err)=> {

  });
};

// get current simulation's metrics and add full contract to each
// by full contract we mean the web3 contract instance. Do this before simulation
// rather than at each iteration.
// cb(err, populatedMetrics)
var preparePopulatedMetrics = (cb)=> {
  var populatedMetrics = [];

  var id = FlowRouter.getParam('_id');
  var sim = Simulations.findOne({_id: id});

  if (!sim || !sim.metrics || !sim.metrics.length) {
    return cb(null, populatedMetrics);
  }

  // now get each contract
  var metrics = sim.metrics;
  async.each(metrics, (item, cb)=> {
    contract = Contracts.findOne({_id: item.contractId});
    item.contract = contract;

    populatedMetrics.push(item);
    cb();

  }, (err)=> {
    // console.log(populatedMetrics);
    return cb(err, populatedMetrics);
  });
};

// returns the index of the col with given key
// e.g. [ ['moo' ....]] would be 0
// -1 if not found
var findColIndex = function(key, cols) {
  if (!cols.length) return -1;
  for (var i=0; i<cols.length; i++) {
    if (!cols[i].length) continue;
    if (cols[i][0] === key) return i;
  }

  return -1;
};


var updateSimulationChart = (populatedMetrics)=> {

  // return;

  var populatedMetrics = Session.get('populatedMetrics');
  if (!populatedMetrics || !populatedMetrics.length) return;


  // for each metric, find the contract (abi + address)
  // and call the metric
  async.each(populatedMetrics, (item, cb)=> {
    var contract = item.contract;

    var abi;
    try {
      abi = JSON.parse(contract.abi);
    } catch(e) {
      console.log(e);
      return cb(e);
    }

    web3.eth.contract(abi).at(contract.address, (err, contractInstance)=> {
      if (err) return cb(err);

      contractInstance[item.metric]((err, bigNumber)=> {

        // convert from weird BigNumber object
        var value = bigNumber.valueOf();

        // console.log(value);

        var cols = Session.get('chartColumns');

        var i = findColIndex(item.metric,cols);
        // add data
        cols[i].push(value);
        Session.set('chartColumns', cols)


        cb();
      });
    });
  }, (err)=> {
    if (err) {
      // console.log(err);
    }
  });


  // var cols = Session.get('chartColumns');
  // // add data
  // cols[0].push(200);
  // console.log(cols);
  // Session.set('chartColumns', cols)
  // console.log('hey');
};

/*
  SimulationPage Template
*/

Template.SimulationPage.onCreated(function() {
  var self = this;
  self.autorun(function() {



    // self.subscribe('singleSimulation', id);
    // self.subscribe('simulations', id);
    Session.set('simulationRunning', false);



    Session.set('chartColumns', initialColumns);


    // also get web3 accounts
    web3.eth.getAccounts((err, result)=> {
      if (err) {
        console.log(err);
        return ErrorMsg(err);
      }

      var web3Accounts = result.map((x)=> { return { name: x }});
      Session.set('web3-accounts', web3Accounts);
    });
  });
});





// Template.SimulationPage.simulationRunning = ()=> {
//   return "false";
// }

Template.SimulationPage.helpers({
  myChartData: function() {

    var obj = {
      data: {
				columns: [],
				type: 'spline'
			}
    };

    if (Session.get('chartColumns')) {
      obj.data.columns = Session.get('chartColumns');
    }


    return obj;



		// return {
		// 	data: {
		// 		columns: [
		// 			['data1', 30, 200, 100, 400, 150, 250],
		// 			['data2', 130, 100, 140, 200, 150, 50]
		// 		],
		// 		type: 'spline'
		// 	}
		// };
	},

  web3Accounts: ()=> {
    return Session.get('web3-accounts') || [];
  },
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
    if (!contract || !contract.abi) return [];

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
    if (!contract || !contract.abi) return [];

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

      // make sure there are metrics and agents
      var id = FlowRouter.getParam('_id');
      var sim = Simulations.findOne({_id: id});

      if (!sim.agents || !sim.agents.length) {
        return ErrorMsg("Please create an agent first");
      }
      if (!sim.metrics || !sim.metrics.length) {
        return ErrorMsg("Please create a metric first");
      }


      launchAgents(sim); //return;



      // Session.set('currentSimulation', sim);
      preparePopulatedMetrics((err, populatedMetrics)=> {
        if (err) {
          return ErrorMsg(err);
        }

        Session.set('populatedMetrics', populatedMetrics);

        // initialise data columns
        var chartColumns = []; // Session.get('chartColumns');
        for (var i=0; i<populatedMetrics.length; i++) {
          chartColumns.push([populatedMetrics[i].metric, 30, 200, 100, 400, 150, 250]);
        //   chartColumns.push([populatedMetrics[i].metric, 200*i, 200*i, 200*i]);
        }
        Session.set('chartColumns', chartColumns);
        // console.log(chartColumns);




        // begin simulation
        // set as running
        Session.set('simulationRunning', true);
        $('#simulationViewer').slideDown();


        // clear chart
        // Session.set('chartColumns', initialColumns);

        // also start chart updater
        var chartUpdater = setInterval(updateSimulationChart, UPDATE_INTERVAL);
        // set the updater so we can stop it
        Session.set('chartUpdater', chartUpdater);


        // max timeout on the simulation
        setTimeout(()=> {
          clearTimeout(chartUpdater);
          var updt = Session.set('chartUpdater');
          if (updt) {
            WarningMsg("Simulation timed out...");
          }
        }, MAX_TIMEOUT_MS);


      });

  },
  'click #stop-simulation': function(e) {
      e.preventDefault();
      Session.set('simulationRunning', false);

      var chartUpdater = Session.get('chartUpdater');
      clearTimeout(chartUpdater);
      Session.set('chartUpdater', null);
      // $('#simulationViewer').slideUp();
  },

  'click #toggle-chart': function(e) {
      e.preventDefault();
      $('#simulationViewer').slideToggle();
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

    var sim_id = FlowRouter.getParam('_id');

    Meteor.call('simulationAddMetric', sim_id, data, (err)=> {
      if (err) {
        console.log(err);
        return ErrorMsg(err);
      }
    });
    // console.log(data);
  },
  'submit #simulation-add-agent': (e)=> {
    e.preventDefault();

    var data = {
      account: e.target.account.value,
      contractName: e.target.contractName.value,
      contractMethod: e.target.contractMethod.value,
      startTime: e.target.startTime.value,
      frequency: e.target.frequency.value
    };

    var sim_id = FlowRouter.getParam('_id');
    Meteor.call('simulationAddAgent', sim_id, data, (err)=> {
      if (err) {
        console.log(err);
        return ErrorMsg(err);
      }
    });
    // console.log(data);
  }
});
