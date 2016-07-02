(function() {
  'use strict';

  angular
    .module('studies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Studies',
      state: 'studies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'studies', {
      title: 'List Studies',
      state: 'studies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'studies', {
      title: 'Create Study',
      state: 'studies.create',
      roles: ['user', 'admin']
    });
  }
})();