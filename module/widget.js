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

var _Widget = React.createClass({
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
          when: this.parseTime(time).toDate()
        });
      },

      tomorrow: function () {
        chrome.alarms.create(this.getAlarmName(type, time), {
          when: this.parseTime(time).add(1, 'days').toDate()
        });
      }
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
      <Widget.Widget widgetStyles={ this.getWidgetStyles() }>
        <Widget.DefaultHeader
          title="Alarm"
          onMouseDownPositionBtn={ this.handleStartMoving }
          onClickCloseBtn={ this.close }
          onClickConfigureBtn={ this.openConfigurator }
        />

        <Widget.Body>
          <IForm.Form
            style={ styles.form }
            onSubmit={ this.handleSubmit }>

            <IForm.Field>
              <Input
                type="text"
                ref="time"
                placeholder="09:31"
                style={ styles.timeInput }
              />
            </IForm.Field>

            <IForm.Field>
              <Select
                ref="type"
                style={ styles.typeInput }>

                <Option
                  text="Today"
                  value="today"
                />
                <Option
                  text="Tomorrow"
                  value="tomorrow"
                />
              </Select>
            </IForm.Field>

            <IForm.Submit
              value="Create"
            />
          </IForm.Form>
        </Widget.Body>
      </Widget.Widget>
    );
  },
});

module.exports = _Widget;
