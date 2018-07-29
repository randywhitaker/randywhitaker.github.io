siteApp.factory('dataService', function ($http, $rootScope) {
  // 'timesheets/settings.json'

  return {
    getSettings: function (callback) {
      $http({ method: 'GET', url: 'http://bqe.shswelding.com/SHSTimeSheet/api/settings' }).
      success(function (data, status, headers, config) {
        var appSettings = JSON.stringify(data);
        window.localStorage.setItem('appSettings', appSettings);
        callback(data);
      }).
      error(function (data, status, headers, config) {
        var appSettings = window.localStorage.getItem('appSettings');
        if (appSettings != null) {
          callback(JSON.parse(appSettings));
        } else {
          callback(data);
        }
      });
    },
    saveSheet: function (callbackmethod, job) {
      $http({ method: 'POST', url: 'http://bqe.shswelding.com/SHSTimeSheet/api/timesheet', headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(job) }).
      success(function (data, status, headers, config) {
        callbackmethod(data);
      }).
      error(function (data, status, headers, config) {
        callbackmethod(null);
      });
    },
    getJobs: function () {
      var jobs = [];

      if (window.localStorage !== null && window.localStorage.length > 0) {

        for (var i = 0; i < window.localStorage.length; i++) {
          var item = localStorage.getItem(localStorage.key(i));

          if (item !== null && item.indexOf('sheetId') !== -1) {
            jobs.push(JSON.parse(item));
          }

        }
      }

      return jobs;
    },
    getJob: function (id) {
      var emptyJob = {
        "sheetId": "",
        "hoursWorked": "",
        "fieldName": {
          "ProjectID": "",
          "ProjectName": "",
          "ProjectState": "",
          "ClientID": ""
        },
        "locationOrWellName": "",
        "client": {
          "ClientID": "",
          "ClientState": ""
        },
        "afeNumber": "",
        "approvalNumber": "",
        "state": {
          "Code": "",
          "Name": ""
        },
        "countyOrParish": "",
        "date": "",
        "dayOfWeek": null,
        "truckNumber": "",
        "remarks": "",
        "signatureImage": "",
        "printedName": "",
        "signatureDate": "",
        "workcrew": [],
        "equipmentList": []
      };

      if (id !== null && id.length > 0) {
        if (window.localStorage !== null && window.localStorage.length > 0) {
          var item = window.localStorage.getItem(id);
          if (item !== null) {
            emptyJob = JSON.parse(item);
          }
        }
      }

      return emptyJob;
    },
    saveJob: function (id, hideUpload) {

      if (id !== null && id.length > 0) {
        if (window.localStorage !== null && window.localStorage.length > 0) {
          var item = window.localStorage.getItem(id);
          if (item !== null) {

            $http({ method: 'POST', url: 'api/timesheet', headers: { 'Content-Type': 'application/json' }, data: item }).
            success(function (data, status, headers, config) {
              hideUpload(data);
            }).
            error(function (data, status, headers, config) {
              hideUpload(data);
            });


          }
        }
      }

    }
  };

});