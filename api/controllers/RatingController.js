/**
 * RatingController
 *
 * @description :: Server-side logic for managing ratings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  attributes: {

    stars: {
      type: 'integer'
    },

    byUser: {
      model: 'user'
    },

    byTutorial: {
      model: 'tutorial'
    }
  }
};

