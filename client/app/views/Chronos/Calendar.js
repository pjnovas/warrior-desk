/**
 * VIEW: Calendar: Shows Today's ChronoLogs
 * 
 */
 
var template = require('./templates/calendar.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui: {
    calendar: ".calendar"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(options){
    this.collection = options && options.collection;
    this.collection.on("reset add remove", this.render.bind(this));
  },

  onRender: function(){
    var self = this;
    _.defer(function(){
      self.initCalendar();
    });
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

  calendarCreated: false,

  initCalendar: function(){
    var calEvents = [];

    calEvents = this.collection.map(function(ele){
      var cevent = ele.toJSON();
      cevent.id = cevent._id;
      cevent.allDay = false;

      var chrono = desk.app.chronos.get(cevent.chrono);
      cevent.title = chrono.get("title");
      //cevent.backgroundColor = 'orange';
      cevent.start = moment.unix(cevent.start).format("YYYY-MM-DDTHH:mm:ss");
      cevent.end = moment.unix(cevent.end).format("YYYY-MM-DDTHH:mm:ss");

      return cevent;
    });

    if (this.calendarCreated){
      this.ui.calendar.fullCalendar('destroy');
    }

    var self = this;
    function updateEvent(event){
      var log = self.collection.get(event.id);
      log.save({
        start: moment(event.start.format()).unix(),
        end: moment(event.end.format()).unix()
      });
    }

    function removeEvent(event){
      if (window.confirm("remove this event?")){
        var log = self.collection.get(event.id);
        log.destroy();
        self.ui.calendar.fullCalendar('removeEvents', event._id);
      }
    }

    this.ui.calendar.fullCalendar({
      lang: 'es-AR',
      defaultView: 'agendaDay',
      editable: true,
      header: false,
      allDaySlot: false,
      height: 600,
      timeFormat: 'HH:mm',
      axisFormat: 'HH:mm',
      scrollTime: '08:00:00',
      columnFormat: {
        day: 'dddd D/MM'
      },
      events: calEvents,
      eventDrop: updateEvent,
      eventResize: updateEvent,
      eventClick: removeEvent
    });

    this.calendarCreated = true;
  }

});