const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */
   async find(ctx) {
    let entities;

    const query = { ...ctx.query, user: ctx.state.user.id };

    if (ctx.query._q) {
      entities = await strapi.services.post.search(query);
    } else {
      entities = await strapi.services.post.find(query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.post }));
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.post.findOne({ id, user: ctx.state.user.id });

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async count(ctx) {
    const query = { ...ctx.query, user: ctx.state.user.id };

    if (ctx.query._q) {
      return await strapi.services.post.countSearch(query);
    };

    return await strapi.services.post.count(query);
  },

  async create(ctx) {
    const { id } = ctx.state.user;

    let entity;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);

      entity = await strapi.services.post.create({
        ...data,
        user: id
      }, { files });
    } else {
      entity = await strapi.services.post.create({
        ...ctx.request.body,
        user: id
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },


};
