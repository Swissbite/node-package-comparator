/**
 * This file is part of Node Package Comparator.
 *
 * Node Package Comparator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Node Package Comparator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with Node Package Comparator.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Scheduler = require('./scheduler.model');

exports.register = function(socket) {
  Scheduler.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Scheduler.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('scheduler:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('scheduler:remove', doc);
}
