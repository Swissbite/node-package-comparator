/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Setting = require('./setting.model');

exports.register = function(socket) {
  Setting.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Setting.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('setting:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('setting:remove', doc);
}