
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('MainLayout', {main: 'Home'});
  }
});


FlowRouter.route('/contract/:_id', {
  name: 'contract-page',
  action(params) {
    BlazeLayout.render('MainLayout', {main: 'ContractPage'});
  }
});
