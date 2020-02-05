'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hook = require('./hook');

var _hook2 = _interopRequireDefault(_hook);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterVariants = function filterVariants(name, children) {
  var variants = {};
  _react2.default.Children.forEach(children, function (element) {
    if (!_react2.default.isValidElement(element) || element.type.displayName !== "Pushtell.Variant") {
      var error = new Error("Pushtell Experiment children must be Pushtell Variant components.");
      error.type = "PUSHTELL_INVALID_CHILD";
      throw error;
    }
    variants[element.props.name] = element;
    _emitter2.default.addExperimentVariant(name, element.props.name);
  });
  _emitter2.default.emit("variants-loaded", name);
  return variants;
};

var CoreExperiment = function CoreExperiment(props) {
  var variants = (0, _react.useMemo)(function () {
    return filterVariants(props.name, props.children);
  }, [props.name, props.children]);

  var _useExperiment = (0, _hook2.default)(props.name, props.userIdentifier, props.defaultVariantName),
      selectVariant = _useExperiment.selectVariant;

  return selectVariant(variants, []);
};

CoreExperiment.propTypes = {
  name: _propTypes2.default.string.isRequired,
  userIdentifier: _propTypes2.default.string,
  defaultVariantName: _propTypes2.default.string,
  children: _propTypes2.default.node
};

exports.default = CoreExperiment;