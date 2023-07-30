'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({strapi}) => ( {
  async findOne(ctx) {
    const cleanQuery = await this.sanitizeQuery(ctx);
    const entry = await strapi.db.query('api::category.category').findOne({
      populate: ['restaurants']
      // populate: {
      //   restaurants: {
      //     select: ['id', 'Name']
      //   }
      // },
    })
    console.log(entry)
    const cleanOutput = await this.sanitizeOutput(entry, ctx);

    return this.transformResponse(cleanOutput)
  }
}));
