

Template.Home.events({
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

    // abi must be parsed to JSON
    try {
      data.abi = JSON.parse(abi);
    } catch(e) {
      ErrorMsg("Error parsing abi to JSON: " + e.toString());
      return;
    }


    // console.log(typeof(data.abi));
    // return;

    Meteor.call('addContract', data);

    // clear values
    e.target.reset();
  }
});
