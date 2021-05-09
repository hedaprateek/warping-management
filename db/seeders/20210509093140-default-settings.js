'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Settings',
      [
        {
          companyName: 'Shree Ranisati Warpers',
          companyAddress: '380, Khanjire industrial Estate, Behind Hira Sizing, Ichalkaranji-416115',
          companyGst: 'Default GST',
          companyContact: '(+91) 9922114900, 9923479331',
          emailId: 'pjhunjhunwala00@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
