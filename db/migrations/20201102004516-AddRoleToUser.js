'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn (
      'users',
      'role',
      {
        type: Sequelize.ENUM( 'ADMIN', 'EDITOR', 'NORMAL' ),
        defaultValue: 'NORMAL' 
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
