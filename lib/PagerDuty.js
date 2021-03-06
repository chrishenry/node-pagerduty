// Generated by CoffeeScript 1.9.0
(function() {
  var PagerDuty, request, _expect, _object, _stripUndefined,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  request = require('request');

  _object = function(kvpairs) {
    var kv, res, _i, _len;
    res = {};
    for (_i = 0, _len = kvpairs.length; _i < _len; _i++) {
      kv = kvpairs[_i];
      res[kv[0]] = kv[1];
    }
    return res;
  };

  _stripUndefined = function(obj) {
    var k, v;
    return _object((function() {
      var _results;
      _results = [];
      for (k in obj) {
        v = obj[k];
        if (v !== void 0) {
          _results.push([k, v]);
        }
      }
      return _results;
    })());
  };

  _expect = function(expectedStatusCode, callback) {
    return function(err, response, body) {
      try {
        body = JSON.parse(body);
      } catch (_error) {}
      if (err || response.statusCode !== expectedStatusCode) {
        return callback(err || (body && body.error ? new Error(body.error.errors[0]) : new Error('Unexpected HTTP code: ' + response.statusCode)));
      } else {
        return callback(null, body);
      }
    };
  };

  PagerDuty = (function() {
    module.exports = PagerDuty;

    function PagerDuty(_arg) {
      this.serviceKey = _arg.serviceKey, this.subdomain = _arg.subdomain;
      if (this.serviceKey == null) {
        throw new Error('PagerDuty.constructor: Need serviceKey!');
      }
    }

    PagerDuty.prototype.create = function(_arg) {
      var callback, description, details, incidentKey;
      description = _arg.description, incidentKey = _arg.incidentKey, details = _arg.details, callback = _arg.callback;
      if (description == null) {
        throw new Error('PagerDuty.create: Need description!');
      }
      return this._eventRequest(__extends(arguments[0], {
        eventType: 'trigger'
      }));
    };

    PagerDuty.prototype.acknowledge = function(_arg) {
      var callback, description, details, incidentKey;
      incidentKey = _arg.incidentKey, details = _arg.details, description = _arg.description, callback = _arg.callback;
      if (incidentKey == null) {
        throw new Error('PagerDuty.acknowledge: Need incidentKey!');
      }
      return this._eventRequest(__extends(arguments[0], {
        eventType: 'acknowledge'
      }));
    };

    PagerDuty.prototype.resolve = function(_arg) {
      var callback, description, details, incidentKey;
      incidentKey = _arg.incidentKey, details = _arg.details, description = _arg.description, callback = _arg.callback;
      if (incidentKey == null) {
        throw new Error('PagerDuty.resolve: Need incidentKey!');
      }
      return this._eventRequest(__extends(arguments[0], {
        eventType: 'resolve'
      }));
    };

    PagerDuty.prototype._eventRequest = function(_arg) {
      var callback, description, details, eventType, incidentKey, json;
      description = _arg.description, incidentKey = _arg.incidentKey, eventType = _arg.eventType, details = _arg.details, callback = _arg.callback;
      if (eventType == null) {
        throw new Error('PagerDuty._request: Need eventType!');
      }
      details || (details = {});
      callback || (callback = function() {});
      json = {
        service_key: this.serviceKey,
        event_type: eventType,
        description: description,
        details: details,
        incident_key: incidentKey
      };
      return request({
        method: 'POST',
        uri: 'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
        json: _stripUndefined(json)
      }, function(err, response, body) {
        if (err || response.statusCode !== 200) {
          return callback(err || new Error(body.errors[0]));
        } else {
          return callback(null, body);
        }
      });
    };

    PagerDuty.prototype.getEscalationPolicies = function(_arg) {
      var callback, limit, offset, query;
      query = _arg.query, offset = _arg.offset, limit = _arg.limit, callback = _arg.callback;
      return this._getRequest({
        resource: 'escalation_policies',
        callback: callback,
        qs: {
          query: query,
          offset: offset,
          limit: limit
        }
      });
    };

    PagerDuty.prototype.createEscalationPolicy = function(_arg) {
      var callback, escalationRules, name;
      name = _arg.name, escalationRules = _arg.escalationRules, callback = _arg.callback;
      return this._postRequest({
        resource: 'escalation_policies',
        callback: callback,
        json: {
          name: name,
          escalation_rules: escalationRules
        }
      });
    };

    PagerDuty.prototype.getUsers = function(_arg) {
      var callback, limit, offset, query;
      query = _arg.query, offset = _arg.offset, limit = _arg.limit, callback = _arg.callback;
      return this._getRequest({
        resource: 'users',
        callback: callback,
        qs: {
          query: query,
          offset: offset,
          limit: limit
        }
      });
    };

    PagerDuty.prototype.createUser = function(_arg) {
      var callback, email, name, requesterId;
      name = _arg.name, email = _arg.email, requesterId = _arg.requesterId, callback = _arg.callback;
      return this._postRequest({
        resource: 'users',
        callback: callback,
        json: {
          name: name,
          email: email,
          requester_id: requesterId
        }
      });
    };

    PagerDuty.prototype.getServices = function(_arg) {
      var callback, limit, offset, query;
      query = _arg.query, offset = _arg.offset, limit = _arg.limit, callback = _arg.callback;
      return this._getRequest({
        resource: 'services',
        callback: callback,
        qs: {
          query: query,
          offset: offset,
          limit: limit
        }
      });
    };

    PagerDuty.prototype.createService = function(_arg) {
      var callback, escalationPolicyId, name, serviceKey, type;
      name = _arg.name, escalationPolicyId = _arg.escalationPolicyId, type = _arg.type, serviceKey = _arg.serviceKey, callback = _arg.callback;
      return this._postRequest({
        resource: 'services',
        callback: callback,
        json: {
          service: {
            name: name,
            escalation_policy_id: escalationPolicyId,
            type: type,
            service_key: serviceKey
          }
        }
      });
    };

    PagerDuty.prototype._getRequest = function(_arg) {
      var callback, limit, offset, qs, resource, uri;
      resource = _arg.resource, qs = _arg.qs, offset = _arg.offset, limit = _arg.limit, callback = _arg.callback;
      callback || (callback = function() {});
      uri = 'https://' + this.subdomain + '.pagerduty.com/api/v1/' + resource;
      return request({
        method: 'GET',
        uri: uri,
        qs: _stripUndefined(qs),
        headers: {
          'Authorization': 'Token token=' + this.serviceKey
        }
      }, _expect(200, callback));
    };

    PagerDuty.prototype._postRequest = function(_arg) {
      var callback, json, resource, uri;
      resource = _arg.resource, json = _arg.json, callback = _arg.callback;
      callback || (callback = function() {});
      uri = 'https://' + this.subdomain + '.pagerduty.com/api/v1/' + resource;
      return request({
        method: 'POST',
        uri: uri,
        json: _stripUndefined(json),
        headers: {
          'Authorization': 'Token token=' + this.serviceKey
        }
      }, _expect(201, callback));
    };

    return PagerDuty;

  })();

}).call(this);
