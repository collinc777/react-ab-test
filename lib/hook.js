"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectVariant = function selectVariant(currentVariant) {
  return function (variants, fallback) {
    if (currentVariant in variants) {
      return variants[currentVariant];
    }
    return fallback;
  };
};

var useExperiment = function useExperiment(experimentName, userIdentifier, defaultVariantName) {
  var _useState = (0, _react.useState)(_emitter2.default.calculateActiveVariant(experimentName, userIdentifier, defaultVariantName)),
      _useState2 = _slicedToArray(_useState, 2),
      activeVariant = _useState2[0],
      setActiveVariant = _useState2[1];

  (0, _react.useEffect)(function () {
    _emitter2.default._incrementActiveExperiments(experimentName);
    _emitter2.default.setActiveVariant(experimentName, activeVariant);
    _emitter2.default._emitPlay(experimentName, activeVariant);

    var variantListener = _emitter2.default.addActiveVariantListener(experimentName, function (name, variant) {
      if (name === experimentName) {
        setActiveVariant(variant);
      }
    });
    return function () {
      variantListener.remove();
      _emitter2.default._decrementActiveExperiments(experimentName);
    };
  }, [experimentName, activeVariant]);

  return {
    experimentName: experimentName,
    activeVariant: activeVariant,
    emitWin: function emitWin() {
      return _emitter2.default.emitWin(experimentName);
    },
    selectVariant: selectVariant(activeVariant)
  };
};

exports.default = useExperiment;