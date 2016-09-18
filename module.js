(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Widget = require('./widget'),
    Shortcut = require('./shortcut'),
    locales = require('./locales');

I18n.registryDict(locales);
OS.installModule('TODO', {
  Widget: Widget,
  Shortcut: Shortcut
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  alert('Welcome to My World');
});


},{"./locales":3,"./shortcut":5,"./widget":6}],2:[function(require,module,exports){
var en = {
};

module.exports = en;


},{}],3:[function(require,module,exports){
module.exports = {
  en: require('./en')
};


},{"./en":2}],4:[function(require,module,exports){
(function (global){
var settings = {
  DEFAULT_SIZE: {
    width: '150px',
    height: '100px'
  },

  DEFAULT_POSITION: global.Settings.get('default_position')
};

module.exports = settings;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
var Link = OS.Link;

var Shortcut = React.createClass({displayName: "Shortcut",
  render: function () {
    return (
      React.createElement(Link, {
        className:  this.props.className, 
        onClick:  this.props.onClick}, 

        React.createElement("span", {className: "fa fa-spinner"})
      )
    );
  }
});

module.exports = Shortcut;


},{}],6:[function(require,module,exports){
var Mixins = OS.Mixins,
    Widget = OS.Widget,
    Configurator = OS.Configurator,
    IForm = OS.IForm,
    Input = OS.Input,
    Select = OS.Select,
    Option = OS.Option;

var settings = require('./settings');

var styles = {
  form: {
    textAlign: 'center'
  },

  timeInput: {
    width: '80px',
    fontSize: '18px',
    textAlign: 'center',
    marginRight: '5px'
  },

  typeInput: {
    width: '160px',
    marginRight: '5px'
  }
};

var _Widget = React.createClass({displayName: "_Widget",
  mixins: [Mixins.WidgetHelper],

  getInitialState: function () {
    return {
      size: settings.DEFAULT_SIZE,
      position: settings.DEFAULT_POSITION
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var time = this.refs.time.getValue(),
        type = ReactDOM.findDOMNode(this.refs.type).value;

    this.createAlarm(time, type);
  },

  createAlarm: function (time, type) {
    var types = {
      today: function (time) {
        chrome.alarms.create(this.getAlarmName(type, time), {
          when: this.parseTime(time).toDate() - moment()
        });
      }.bind(this),

      tomorrow: function () {
        chrome.alarms.create(this.getAlarmName(type, time), {
          when: this.parseTime(time).add(1, 'days').toDate() - moment()
        });
      }.bind(this)
    };

    types[type](time);
  },

  getAlarmName: function (type, time) {
    return sprintf('jsos-%s-%s', type, time);
  },

  parseTime: function (time) {
      var _time = moment(time, 'HH:mm'),
          _moment = moment();

      _moment.hours(_time.hours());
      _moment.minutes(_time.minutes());

      return _moment;
  },

  _getSettings: function () {
    return {
      size: _.clone(this.state.size),
      position: _.clone(this.state.position)
    };
  },

  componentWillMount: function () {
    this.init();
  },

  render: function () {
    return (
      React.createElement(Widget.Widget, {widgetStyles:  this.getWidgetStyles() }, 
        React.createElement(Widget.DefaultHeader, {
          title: "Alarm", 
          onMouseDownPositionBtn:  this.handleStartMoving, 
          onClickCloseBtn:  this.close, 
          onClickConfigureBtn:  this.openConfigurator}
        ), 

        React.createElement(Widget.Body, null, 
          React.createElement(IForm.Form, {
            style:  styles.form, 
            onSubmit:  this.handleSubmit}, 

            React.createElement(IForm.Field, null, 
              React.createElement(Input, {
                type: "text", 
                ref: "time", 
                placeholder: "09:31", 
                style:  styles.timeInput}
              )
            ), 

            React.createElement(IForm.Field, null, 
              React.createElement(Select, {
                ref: "type", 
                style:  styles.typeInput}, 

                React.createElement(Option, {
                  text: "Today", 
                  value: "today"}
                ), 
                React.createElement(Option, {
                  text: "Tomorrow", 
                  value: "tomorrow"}
                )
              )
            ), 

            React.createElement(IForm.Submit, {
              value: "Create"}
            )
          )
        )
      )
    );
  },
});

module.exports = _Widget;


},{"./settings":4}]},{},[1])