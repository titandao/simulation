
/// @returns object with data to add to collection
// function deploySingle(name, contract, cb) {
//   var single_result = {};
//   single_result.name = name;
//
//   var instance = web3.eth.contract(contract.info.abiDefinition);
//
//   // submit to network from primary account TODO different creators?
//   var newInstance = instance.new({from:web3.eth.accounts[0], data: contract.code, gas: 1000000}, (err, contract)=> {
//     if (err) { return cb(err); }
//
//     single_result.address = deployed.address;
//
//     result.push(single_result);
//     cb(null);
//   });
// }

/// @returns `cb(err, result)` array of contract object to add
/// to collection
function deployCode(code, done) {
  async.waterfall([
    (cb)=> {
      web3.personal.unlockAccount(web3.eth.accounts[0], "passphrase", function(err, result) {
        cb(err);
      });
    },
    (cb)=> {
      web3.eth.compile.solidity(code, cb);
    },
    (compiled, cb)=> {
      var results = [];
      // deploy each
      async.each(Object.keys(compiled), (k, cb)=> {
        var item = compiled[k];
        var single_result = {};
        single_result.name = k;

        var instance = web3.eth.contract(item.info.abiDefinition);
        instance.new({from:web3.eth.accounts[0], data: item.code, gas: 1000000}, (err, deployed)=> {
          if (err) { return cb(err); }

          // console.log(deployed);
          if(!deployed.address) {
            console.log("Contract transaction send: TransactionHash: " + deployed.transactionHash + " waiting to be mined...");
          } else {
            console.log("Contract mined! Address: " + deployed.address);
            // console.log(contract);
            single_result.address = deployed.address;
            single_result.abi = JSON.stringify(item.info.abiDefinition);

            results.push(single_result);
            cb(null);
          }
        });

      }, (err)=> {
        cb(err, results);
      });
    }
  ], done);
}



Template.Home.events({
  'submit #deploy-contract': function(e) {
    e.preventDefault();

    // var name = e.target.name.value || "";
    var code = e.target.code.value || "";

    ToggleLoader();
    deployCode(code, (err, result)=> {
      ToggleLoader();
      if (err) { return ErrorMsg(err.toString()); }

      // now create collection objects
      // console.log(result);
      for (var i=0; i < result.length; i++) {
        Meteor.call('addContract', result[i]);
      }
    });
  },


  'submit #add-contract': function(e) {
    e.preventDefault();




    // console.log(e.target.address.value);

    var data = {
      name: e.target.name.value || "",
      address: e.target.address.value || null
      // abi: e.target.abi.value
    };
    var abi = e.target.abi.value;
    // TEMP
    abi = '[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"type":"constructor"}] ';
    data.name = "greeter";
    data.address = "0xba356be3d621bf5e42afb487461b4c83476f916d";

    // abi must be parse-able to JSON
    try {
      // data.abi =
      JSON.parse(abi);
    } catch(e) {
      ErrorMsg("Error parsing abi to JSON: " + e.toString());
      return;
    }
    data.abi = abi;


    Meteor.call('addContract', data);


    // clear values
    e.target.reset();
  },

  'submit #add-simulation': function(e) {
    e.preventDefault();

    var data = {
      name: e.target.name.value || ""
    };


    Meteor.call('addSimulation', data, function(error) {
      if (error) return ErrorMsg(error.toString());
    });

    // clear values
    e.target.reset();
  }
});
