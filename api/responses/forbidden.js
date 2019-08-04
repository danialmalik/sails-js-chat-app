module.exports = function(msg, context) {
  let { req, res } = this;
  res.status = 403;
  res.view('403', context);
};
