var invoiceApp = new Vue({
  el: '#invoice-app',
  created() {
    const dataFileName = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcvxfsh6iwoa31ZAjQBLg2rO52UCaQ4QWojIoaq2Kp31TuU0G0YGBjUgXUMXd-NKwD2DoLyEM5F_C9/pub?gid=0&single=true&output=csv";

    fetch(dataFileName)
      .then(response => response.text())
      .then(data => (this.csvparser(data)))
      .catch(function (error) {
        this.errorMessage = `Error when loading tenant ${error.message}`;
    });

  },
  data: {
    errorMessage: "",
    company: { name: "RADI Investments, LLC", address: "PO BOX 2127", cityStateZip: "WAXAHACHIE TX 75168", phone: "945-900-6177", email: "whitaker.randy@gmail.com" },
    selectedproperty: {},
    properties: [],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  methods: {
    csvparser: function (csv) {
      //console.log("parsing csv file data");
      const lines = csv.split("\n");
      //console.log("Lines:", lines);

      // NOTE: If your columns contain commas in their values, you'll need
      // to deal with those before doing the next step by convert them
      // into ` or something, then covert them back later.
      var headers = lines[0].split(",");
      //console.log("Headers:", headers);

      for(var i=1; i<lines.length; i++) {
        const property = {id: 0, name: "", tenant: "", address: "", cityStateZip: "", dueOn: 1, amount: 0.00, addLateFee: "", paidLateFee: 75.00, lastpaid: "01/01/2023"};
        const currentline = lines[i].split(",");

          for(var j=0; j<headers.length; j++) {
            const headerName = headers[j].replace('\r', '').replace('\t', '');
            //console.log("Header Name:", headerName);

            switch (headerName) {
              case 'id':
                property.id = parseInt(currentline[j].replace('\r', '').replace('\t', ''));
                break;
              case 'name':
                property.name = currentline[j].replace('\r', '').replace('\t', '');
                break;
              case 'tenant':
                property.tenant = currentline[j].replace('\r', '').replace('\t', '');
                break;
              case 'address':
                property.address = currentline[j].replace('\r', '').replace('\t', '');
                break;
              case 'cityStateZip':
                property.cityStateZip = currentline[j].replace('\r', '').replace('\t', '');
                break;
              case 'dueOn':
                property.dueOn = parseInt(currentline[j].replace('\r', '').replace('\t', ''));
                break;
              case 'amount':
                property.amount = parseFloat(currentline[j].replace('\r', '').replace('\t', ''));
                break;
              case 'paidLateFee':
                property.paidLateFee = parseFloat(currentline[j].replace('\r', '').replace('\t', ''));
                break;
              case 'lastpaid':
                property.lastpaid = currentline[j].replace('\r', '').replace('\t', '');
                break;
              default:
                console.log(`Unknown header name: ${headerName}.`);
                break;
            }
          }

          this.properties.push(property);
      }
    },
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