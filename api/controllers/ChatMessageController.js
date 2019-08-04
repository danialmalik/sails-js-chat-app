/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  render: (request, response) => {
    return response.view('pages/chatroom');
  },

  postMessage: async (request, response) => {
    // Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

    try {
      let user = await User.findOne({ id: request.session.userId });
      let users = await User.find();
      let msg = await ChatMessage.create({
        message: request.body.message,
        createdBy: user.id
      }).fetch();
      if (!msg.id) {
        throw new Error('Message processing failed!');
      }
      msg.createdBy = user;
      ChatMessage.publish(
        _.pluck(users, 'id'),
        {
          verb: 'CREATED',
          msg: msg
        }
      );
    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  },

  subscribeToChat: async (request, response)=> {
    if (!request.isSocket) {
      return response.badRequest();
    }

    ChatMessage.subscribe(request, [request.session.userId]);
    return response.ok({status: 'DONE'});
  }
};
