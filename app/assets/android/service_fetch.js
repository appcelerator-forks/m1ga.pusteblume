var service = Titanium.Android.currentService;
var intent = service.intent;
Ti.App.fireEvent('checkNotifications');
