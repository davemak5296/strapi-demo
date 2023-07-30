'use strict';

/**
 * order controller
 */
const { isObject } = require('lodash/fp');
const { ValidationError } = require('@strapi/utils').errors;

const { parseBody } = require('@strapi/strapi/lib/core-api/controller/transform');


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx) {
    const { query } = ctx.request;

    const { data, files } = parseBody(ctx);

    if (!isObject(data)) {
      throw new ValidationError('Missing "data" payload in the request body');
    }

    const sanitizedInputData = await this.sanitizeInput(data, ctx);

    const entity = await strapi.db.query('api::order.order').create({
      data: sanitizedInputData,
    })

    const purchaser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: data.user_id },
      select: ['id'],
      populate: {
        upline_1_id: { select: ['id']},
        upline_2_id: { select: ['id']},
        upline_3_id: { select: ['id']}
      }
    })

    await strapi.db.query('api::commission.commission').create({
      data: {
        order_id: entity.id,
        user_id: purchaser.upline_1_id.id,
        amount: data.amount*0.05
      }
    });
    await strapi.db.query('api::commission.commission').create({
      data: {
        order_id: entity.id,
        user_id: purchaser.upline_2_id.id,
        amount: data.amount*0.03
      }
    });
    await strapi.db.query('api::commission.commission').create({
      data: {
        order_id: entity.id,
        user_id: purchaser.upline_3_id.id,
        amount: data.amount*0.02
      }
    });

    return ctx.send({
      message: "end"
    })
    // const entity = await strapi
    //   .service(uid)
    //   .create({ ...query, data: sanitizedInputData, files });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
