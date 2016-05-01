FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('MainLayout', {main: 'Home'});
  }
});


FlowRouter.route('/contract/:id', {
  name: 'contract-page',
  action() {
    BlazeLayout.render('MainLayout', {main: 'ContractPage'});
  }
});
