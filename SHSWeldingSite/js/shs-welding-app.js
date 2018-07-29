'use strict';

var siteApp = angular.module('shsWeldingApp', ['ngResource'])

siteApp.controller('siteCtrl', function ($scope, $rootScope, $interval, dataService) {

  $scope.feedback = "";
  $scope.mySheets = "active";
  $scope.addSheet = "";
  $scope.uploadProgress = "";
  $scope.jobs = dataService.getJobs();
  $scope.changeMenu = changeMenu;

  $scope.clients = [];
  $scope.projects = [];
  $scope.states = [];
  $scope.counties = [];
  $scope.workers = [];
  $scope.billingCategories = [];
  $scope.equipment = [];
  $scope.lunchHours = [];

  $scope.totalQty = 0;
  $scope.totalDuration = 0;
  $scope.totalLunch = 0;
  $scope.totalReg = 0;
  $scope.totalOt = 0;
  $scope.totalWkd = 0;

  $scope.uploadToServer = function (id) {
    $scope.uploadProgress = "active";
    dataService.saveJob(id, hideUpload);
  }

  function hideUpload(data) {
    $scope.uploadProgress = "";

    if (data == "true") {
      $scope.feedback = "Time sheet successfully saved.";

      $interval(function () {
        $scope.feedback = "";
      }, 2000);
    }
  }

  $scope.removesheet = function (id) {
    if (window.confirm('Are you sure you want to delete this time sheet?')) {
      window.localStorage.removeItem(id);
      $scope.jobs = dataService.getJobs();
    }
  };

  function changeMenu(item, id) {
    if (item == 'mySheets' && $scope.lastActiveMenu != 'mySheets') {
      $scope.lastActiveMenu = "mySheets";
      $scope.mySheets = "active";
      $scope.addSheet = "";
      $scope.uploadProgress = "";
      $scope.jobs = dataService.getJobs();

    } else if (item == 'addSheet' && $scope.lastActiveMenu != 'addSheet') {
      $scope.lastActiveMenu = "addSheet";
      $scope.mySheets = "";
      $scope.addSheet = "active";
      $scope.uploadProgress = "";
      $scope.job = dataService.getJob(id);
      calculateTotals();
      calculateTotalQty();
      
      if ($scope.job.signatureImage == '') {
        signaturePad.clear();
      } else {
        loadSignature($scope.job.signatureImage);
      }
    }
  }

  $scope.job = dataService.getJob('');

  dataService.getSettings(refreshSettings);

  if ($scope.job.fieldName != '') {
    setProjectState($scope.job.fieldName);
  }
  if ($scope.job.date != '') {
    setDayOfWeek($scope.job.date);
  }
  
  $scope.eraseSignature = function () {
    signaturePad.clear();
  };

  $scope.filterProjectExpression = function (project) {
    return (project.ClientID === $scope.job.client.ClientID);
  };
  $scope.filterStateExpression = function (state) {
    return (state.Code === $scope.job.state.Code);
  };

  $scope.saveSheet = function () {
    var timesheet = $scope.job;

    if (timesheet != null && timesheet.client != null && timesheet.client.ClientID != null && timesheet.client.ClientID.length > 2) {

      if (!signaturePad.isEmpty()) {
        var data = signaturePad.toDataURL('image/jpeg');
        //console.log(data);
        timesheet.signatureImage = data;
      } else {
        timesheet.signatureImage = "";
      }

      var datakey = timesheet.sheetId;

      if (timesheet.sheetId != null && timesheet.sheetId.length < 10) {
        datakey = 'SHS' + Date.now();
        timesheet.sheetId = datakey;
      }
      
      timesheet.hoursWorked = $scope.totalWkd;

      var sheetinfo = JSON.stringify(timesheet);
      
      localStorage.setItem(datakey, sheetinfo);
      changeMenu('mySheets');

    } else {
      window.alert("A client must be selected before saving the timesheet.");
    }
  }
  $scope.calculateHours = function (n) {

    if (n.startTime !== '' && n.endTime !== '') {
      var wkd = timeDiff(n.startTime, n.endTime),
          a = convertTimeToMinutes(wkd),
          b = convertTimeToMinutes("8:00"),
          l = convertTimeToMinutes(n.lunchHour);

      wkd = a - l;
      var otm = a - b - l;

      n.workedHours = convertMinutesToTime(wkd);
      if (otm > 0) {
        n.regularHours = "8:00";
        n.overTimeHours = convertMinutesToTime(otm);
      } else {
        n.regularHours = convertMinutesToTime(wkd);
        n.overTimeHours = 0;
      }

    }

    calculateTotals();
  };

  $scope.updateTotalQty = calculateTotalQty;

  $scope.addEquipment = function (event) {

    if (event != null && event.keyCode == 9) {
      return 0;
    }

    var equip = { "equipment": {}, "units": 0, "notes": "" };
    $scope.job.equipmentList.push(equip);
  };
  $scope.removeEquipment = function (index, event) {

    if (event != null && event.keyCode == 9) {
      return 0;
    }

    if (window.confirm('Are you sure you want to delete this item?')) {
      $scope.job.equipmentList.splice(index, 1);
    }
  };
  $scope.addWorker = function (event) {

    if (event != null && event.keyCode == 9) {
      return 0;
    }

    var wkr = { "worker": {}, "billingCategory": {}, "startTime": "", "endTime": "", "lunchHour": 0, "regularHours": 0, "overTimeHours": 0, "workedHours": 0 };
    $scope.job.workcrew.push(wkr);
  };
  $scope.removeWorker = function (index, event) {

    if (event != null && event.keyCode == 9) {
      return 0;
    }

    if (window.confirm('Are you sure you want to delete this item?')) {
      $scope.job.workcrew.splice(index, 1);
    }
  };

  $scope.updateClientState = setClientState;
  $scope.updateProjectState = setProjectState;
  $scope.updateWeekName = setDayOfWeek;

  function setClientState(client) {
    $scope.job.state = {};

    for (var i = 0; i < $scope.states.length; i++) {
      if ($scope.states[i].Code === client.ClientState) {
        $scope.job.state = $scope.states[i];
        break;
      }
    }
  };
  function setProjectState(project) {
    $scope.job.state = {};

    for (var i = 0; i < $scope.states.length; i++) {
      if ($scope.states[i].Code === project.ProjectState) {
        $scope.job.state = $scope.states[i];
        break;
      }
    }
  };
  function setDayOfWeek(value) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(value);
    $scope.job.dayOfWeek = days[d.getUTCDay()];
  }
  function refreshSettings(data) {

    if (data.clients != null) {
      $scope.clients = data.clients;
    }

    if (data.projects != null) {
      $scope.projects = data.projects;
    }

    if (data.states != null) {
      $scope.states = data.states;
    }

    if (data.counties != null) {
      $scope.counties = data.counties;
    }

    if (data.workers != null) {
      $scope.workers = data.workers;
    }

    if (data.equipment != null) {
      $scope.equipment = data.equipment;
    }

    if (data.lunchHours != null) {
      $scope.lunchHours = data.lunchHours;
    }

    if (data.billingCategories != null) {
      $scope.billingCategories = data.billingCategories;
    }

  }
  function timeDiff(startTime, endTime) {
    var hours = endTime.split(':')[0] - startTime.split(':')[0],
        minutes = endTime.split(':')[1] - startTime.split(':')[1];

    minutes = isNaN(minutes) ? 0 : minutes;
    hours = isNaN(hours) ? 0 : hours;
    console.log('hours: ' + hours + ' minutes: ' + minutes);

    minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
    if (minutes < 0) {
      hours--;
      minutes = 60 + minutes;
    }

    hours = hours.toString().length < 2 ? '0' + hours : hours;
    return (hours + ':' + minutes);
  }
  function convertTimeToMinutes(value) {
    var h = 0, m = 0;

    if (typeof value === 'number') {
      h = parseInt(value, 10);
      m = parseInt((value - h) * 60, 10);
    } else {
      h = value.split(':')[0];
      m = value.split(':')[1];
    }

    h = isNaN(h) ? 0 : h;
    m = isNaN(m) ? 0 : m;

    return (m * 1) + (h * 60);
  }
  function convertMinutesToTime(value) {
    var tmp = (value / 60),
        h = parseInt(tmp, 10),
        m = parseInt((tmp - h) * 60, 10);

    h = isNaN(h) ? 0 : h;
    m = isNaN(m) ? 0 : m;

    return (h + ':' + m);
  }
  function calculateTotals() {
    var totalLunch = 0,
        totalReg = 0,
        totalOt = 0,
        totalWkd = 0;

    for (var i = 0; i < $scope.job.workcrew.length; i++) {
      totalLunch += convertTimeToMinutes($scope.job.workcrew[i].lunchHour);
      totalReg += convertTimeToMinutes($scope.job.workcrew[i].regularHours);
      totalOt += convertTimeToMinutes($scope.job.workcrew[i].overTimeHours);
      totalWkd += convertTimeToMinutes($scope.job.workcrew[i].workedHours);
    }

    $scope.totalLunch = convertMinutesToTime(totalLunch);
    $scope.totalReg = convertMinutesToTime(totalReg);
    $scope.totalOt = convertMinutesToTime(totalOt);
    $scope.totalWkd = convertMinutesToTime(totalWkd);
  }
  function calculateTotalQty() {
    var total = 0;

    for (var i = 0; i < $scope.job.equipmentList.length; i++) {
      total += $scope.job.equipmentList[i].units;
    }

    $scope.totalQty = total;
  }

});

var canvas = document.getElementById('signature-pad');
var signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: 'rgb(255, 255, 255)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

function loadSignature(data) {
  if (data !== null) {
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);   
    };
    img.src = data;
  }
}

window.onresize = resizeCanvas;
resizeCanvas();