/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Plugin = require('./plugin.model');

exports.register = function(socket) {
  Plugin.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Plugin.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('plugin:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('plugin:remove', doc);
}