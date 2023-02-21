var invoiceApp = new Vue({
  el: '#invoice-app',
  data: {
    company: { name: "RADI Investments, LLC", address: "PO BOX 2127", cityStateZip: "WAXAHACHIE TX 75168", phone: "945-900-6177", email: "whitaker.randy@gmail.com" },
    selectedproperty: {},
    properties: [
      { id: 1, name: "101 Truman", tenant: "Adrianne Lewis", address: "101 Truman Dr", cityStateZip: "Henderson, TX 75652-2633", dueOn: 1, amount: 750.00, paidLateFee: 0.00, lastpaid: "02/01/2023" },
      { id: 2, name: "107 Parnell", tenant: "Allie Morris", address: "107 Parnell Dr", cityStateZip: "Henderson, TX 75654-3334", dueOn: 13, amount: 900.00, paidLateFee: 0.00, lastpaid: "02/01/2023" },
      { id: 3, name: "208 Christian", tenant: "", address: "208 Christian Dr", cityStateZip: "Henderson, TX 75652", dueOn: 1, amount: 900.00, lateFee: 0.00, paidLateFee: "02/01/2023" },
      { id: 4, name: "705 N Mill", tenant: "Jason Tribble", address: "705 N Mill St", cityStateZip: "Henderson, TX 75652-6015", dueOn: 3, amount: 770.00, paidLateFee: 40.00, lastpaid: "02/01/2023" },
      { id: 5, name: "707 N Mill", tenant: "Deanna Dean", address: "707 N Mill St", cityStateZip: "Henderson, TX 75652-6015", dueOn: 4, amount: 600.00, paidLateFee: 0.00, lastpaid: "02/01/2023" },
      { id: 6, name: "1004 Jones", tenant: "Kevin & Misty Nix", address: "1004 Jones St", cityStateZip: "Henderson, TX 75654", dueOn: 18, amount: 1500.00, paidLateFee: 0.00, lastpaid: "02/01/2023" },
      { id: 7, name: "6133 HWY 79", tenant: "Robert Hopper", address: "6133 HWY 79 S.", cityStateZip: "Henderson, TX 75654", dueOn: 1, amount: 1600.00, paidLateFee: 0.00, lastpaid: "02/01/2023" }
    ],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  methods: {
    invoiceNumber: function (id) {
      const date = new Date();

      let index = 0;
      let day = ("0" + date.getDate()).slice(-2);
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let year = date.getFullYear();

      if (id != null) {
        index = parseInt(id);
      }

      return `${year}${month}${day}${index}`;
    },
    lastMonth: function () {
      const date = new Date();
      return this.months[date.getMonth()];
    },
    nextMonth: function () {
      const date = new Date();
      return this.months[date.getMonth() + 1];
    },
    invoiceDate: function () {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      return `${month}/${day}/${year}`;
    },
    dueDate: function (dueOn) {
      const date = new Date();

      let day = 1;
      let month = date.getMonth() + 2;
      let year = date.getFullYear();

      if (dueOn != null) {
        day = parseInt(dueOn);
      }

      return `${month}/${day}/${year}`;
    },
    lastpaidDate: function (dueOn) {
      const date = new Date();

      let day = 1;
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      if (dueOn != null) {
        day = parseInt(dueOn);
      }

      return `${month}/${day}/${year}`;
    }
  }
});