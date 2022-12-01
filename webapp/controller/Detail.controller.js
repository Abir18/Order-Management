sap.ui.define(
    [
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/mvc/Controller",
        "sap/f/library"
    ],
    function (Fragment, JSONModel, Controller, fioriLibrary) {
        "use strict";

        return Controller.extend("task.order.management.controller.Detail", {
            onInit: function () {
                // set explored app's demo model on this sample
                // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                // this.getView().setModel(oModel);
                // const localStorageData = localStorage.getItem("data");
                // const parseData = JSON.parse(localStorageData);
                // console.log(parseData, "parseData");
                // const ProductsModel = new JSONModel(parseData);
                // this.getView().setModel(ProductsModel, "products");

                let customers = new JSONModel(
                    sap.ui.require.toUrl("task/order/management/customers.json")
                );
                // console.log(customers, "customers");

                this.getView().setModel(customers);

                // console.log(this.getView().getModel());

                this.byId("app_input_orderno").setValue(
                    parseInt(Date.now() + Math.random())
                        .toString()
                        .slice(6)
                );
            },

            onCancelPressed: function () {
                var oFCL = this.oView.getParent().getParent();

                oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
            },

            handleValueHelp: function () {
                var oView = this.getView();
                // console.log(oView, "oView");

                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "task.order.management.view.ValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(
                    function (oValueHelpDialog) {
                        this._configValueHelpDialog();
                        oValueHelpDialog.open();
                    }.bind(this)
                );
            },

            _configValueHelpDialog: function () {
                // var sInputValue = this.byId("productInput").getValue(),
                //     oModel = this.getView().getModel("products"),
                //     aProducts = oModel.getProperty("/ProductCollection");
                // aProducts.forEach(function (oProduct) {
                //     oProduct.selected = oProduct.Name === sInputValue;
                // });
                // oModel.setProperty("/ProductCollection", aProducts);
            },
            handleValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.byId("app_input_customername");

                if (!oSelectedItem) {
                    oInput.resetProperty("value");

                    return;
                }
                // console.log(oSelectedItem.getCells()[1]);
                oInput.setValue(oSelectedItem.getCells()[1].getText());
                // oInput.setValue(oSelectedItem.getCells()[1].mProperties.text);
            },

            onCountryChange: function (oEvent) {
                // console.log(oEvent.getParameters().selectedItem.sId.slice(-1));

                const selectedCountryIndex = oEvent
                    .getParameters()
                    .selectedItem.sId.slice(-1);

                const selectedCountryId = parseInt(selectedCountryIndex) + 1;
                console.log(selectedCountryId);

                const countriesData = this.getView()
                    .getModel("countries")
                    .getData();

                const selectedCountryData = countriesData.find(
                    (country) => country.countryId === selectedCountryId
                );
                console.log(selectedCountryData);

                const cityModel = new JSONModel(selectedCountryData);

                this.getView().setModel(cityModel, "cityName");
            },

            _dataFormat: {
                ProductCollection: []
            },

            // this.dataFormat : [],

            onSavePressed: function () {
                console.log("Form SUbmitted");

                const orderId = this.byId("app_input_orderno").getValue();
                const customerName = this.byId(
                    "app_input_customername"
                ).getValue();

                const countryName = this.byId("app_input_country")
                    ?.getSelectedItem()
                    ?.getText();
                const cityName = this.byId("app_input_city")
                    ?.getSelectedItem()
                    ?.getText();

                const date = this.byId("app_input_date").getValue();

                const newCustomerData = {
                    OrderId: orderId,
                    CustomerName: customerName || "John Doe",
                    Address: `${cityName || "Dhaka"}, ${
                        countryName || "Bangladesh"
                    }`,
                    Date: date
                        ? new Date(date).toLocaleDateString("en-us", {
                              weekday: "long",
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                          })
                        : new Date("11/24/22").toLocaleDateString("en-us", {
                              weekday: "long",
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                          }),
                    Delivered: false
                    // Date: date
                };

                // let dataFormat = {
                //     ProductCollection: []
                // };
                // dataFormat.ProductCollection.push(newCustomerData);

                // let dataFormat = [];
                // let data =
                this._dataFormat.ProductCollection.push(newCustomerData);
                // console.log(data, "ddd");
                // dataFormat.push(1);
                if (localStorage.getItem("LocalStorageData")) {
                    let newARR = JSON.parse(
                        localStorage.getItem("LocalStorageData")
                    );
                    // newARR.ProductCollection.push(newCustomerData);

                    newARR.ProductCollection.push(newCustomerData);

                    console.log("newARR", newARR);
                    console.log("dataFormat", this._dataFormat);

                    localStorage.setItem(
                        "LocalStorageData",
                        JSON.stringify(newARR)
                    );

                    // console.log("newARR", newARR);
                    // localStorage.setItem(
                    //     "LocalStorageData",
                    //     JSON.stringify(newARR.ProductCollection)
                    // );
                } else {
                    localStorage.setItem(
                        "LocalStorageData",
                        JSON.stringify(this._dataFormat)
                    );
                    console.log("not found");
                }
                // console.log("dataFormat", this._dataFormat);
                // console.log(orderId, customerName, countryName, cityName, date);

                // const localStorageData = JSON.stringify(newCustomerData);
                // localStorage.setItem();
                this.byId("app_input_orderno").setValue("");

                this.byId("app_input_orderno").setValue(
                    parseInt(Date.now() + Math.random())
                        .toString()
                        .slice(6)
                );

                var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);

                const localStorageData =
                    localStorage.getItem("LocalStorageData");
                const parseData = JSON.parse(localStorageData);
                console.log(parseData, "parseData");
                const ProductsModel = new JSONModel(parseData);
                this.getView().setModel(ProductsModel);

                // if (localStorage.length > 0) {
                //     localStorage.setItem(
                //         "dummy",
                //         JSON.stringify(this._dataFormat)
                //     );
                //     for (let i = 0; i < localStorage.length; i++) {
                //         // console.log(localStorage.key(i));
                //         if (localStorage.key(i) == "dummy") {
                //             localStorage.getItem("dummy");
                //         }
                //     }
                // }
            }
        });
    }
);
