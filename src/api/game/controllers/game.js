'use strict';

/**
 * game controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { parseBody } = require('@strapi/strapi/lib/core-api/controller/transform');

module.exports = createCoreController('api::game.game', ({strapi}) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx);
    const {name, locale} = sanitizedQuery;

    const entry = await strapi.db.query('api::game.game').findOne({
      select: ['id', 'name'],
      where: {name: name},
      populate: {
        localizations: {
          where: { locale: locale },
          select: ['name', 'locale'],
        }
      }
    })
    
    return {
      data: {
        locale: locale,
        game_name: locale==='en'? entry.name : entry['localizations'][0].name
      }
    }
    return this.transformResponse(cleanOutput);
  },
}));
