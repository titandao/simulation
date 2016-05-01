

Template.Home.events({
  'submit .add-contract': function(e) {
    e.preventDefault();


    // console.log(e.target.address.value);

    var data = {
      address: e.target.address.value
    };

    Meteor.call('addContract', data);

    // clear values
    e.target.reset();
  }
});
