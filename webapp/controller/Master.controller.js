sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/f/library",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/List",
        "sap/m/StandardListItem",
        "sap/m/library",
        "sap/m/MessageToast"
    ],
    function (
        Controller,
        Filter,
        FilterOperator,
        Sorter,
        MessageBox,
        JSONModel,
        fioriLibrary,
        Dialog,
        Button,
        List,
        StandardListItem,
        mobileLibrary,
        MessageToast
    ) {
        "use strict";
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;
        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("task.order.management.controller.Master", {
            onInit: function () {
                this.oView = this.getView();
                this._bDescendingSort = false;
                this.oProductsTable = this.oView.byId("productsTable");

                // Get data from LocalStorage and set it to Model
                const localStorageData =
                    localStorage.getItem("LocalStorageData");
                const parseData = JSON.parse(localStorageData);
                // console.log(parseData, "parseData");
                const ProductsModel = new JSONModel(parseData);
                this.getView().setModel(ProductsModel);

                // this.getView().getModel().refresh();

                this.oRouter = this.getOwnerComponent().getRouter();

                // localStorage.setItem("customers", JSON.stringify(customers));

                // console.log("mm", this.getView().getModel());
            },

            onSearch: function (oEvent) {
                var oTableSearchState = [],
                    sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [
                        new Filter(
                            "CustomerName",
                            FilterOperator.Contains,
                            sQuery
                        )
                    ];
                }

                this.oProductsTable
                    .getBinding("items")
                    .filter(oTableSearchState, "Application");
            },

            onAdd: function () {
                MessageBox.information("This functionality is not ready yet.", {
                    title: "Aw, Snap!"
                });
            },

            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.oProductsTable.getBinding("items"),
                    oSorter = new Sorter("CustomerName", this._bDescendingSort);

                oBinding.sort(oSorter);
            },

            onListItemPress: function (oEvent) {
                var oFCL = this.oView.getParent().getParent();

                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsBeginExpanded);
                // oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
            },

            onEditItemPress: function (orderId, delivered) {
                console.log(orderId, delivered);
                if (delivered) {
                    MessageToast.show("Order already delivered.");
                    return;
                }
                var oFCL = this.oView.getParent().getParent();

                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsBeginExpanded);
            },
            updateMultipleSelection: function (oEvent) {
                var oMultiInput = oEvent.getSource(),
                    sTokensPath =
                        oMultiInput
                            .getBinding("tokens")
                            .getContext()
                            .getPath() +
                        "/" +
                        oMultiInput.getBindingPath("tokens"),
                    aRemovedTokensKeys = oEvent
                        .getParameter("removedTokens")
                        .map(function (oToken) {
                            return oToken.getKey();
                        }),
                    aCurrentTokensData = oMultiInput
                        .getTokens()
                        .map(function (oToken) {
                            return {
                                Key: oToken.getKey(),
                                Name: oToken.getText()
                            };
                        });

                aCurrentTokensData = aCurrentTokensData.filter(function (
                    oToken
                ) {
                    return aRemovedTokensKeys.indexOf(oToken.Key) === -1;
                });

                oMultiInput
                    .getModel()
                    .setProperty(sTokensPath, aCurrentTokensData);
            },
            handleDetailsPress: function (oEvent) {
                MessageToast.show(
                    "Details for product with id " +
                        this.getView()
                            .getModel()
                            .getProperty(
                                "ProductId",
                                oEvent.getSource().getBindingContext()
                            )
                );
            },

            onPaste: function (oEvent) {
                var aData = oEvent.getParameter("data");
                MessageToast.show("Pasted Data: " + aData);
            },

            onStatusChanged: function (orderId, delivered) {
                if (delivered) return;

                if (!this.oDefaultDialog) {
                    console.log("Helllooooooo");

                    this.oDefaultDialog = new Dialog({
                        title: "Are you sure to change this status?",

                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                const localStorageData =
                                    localStorage.getItem("LocalStorageData");
                                const parseData = JSON.parse(localStorageData);
                                let updatedData =
                                    parseData.ProductCollection.filter(
                                        (order) => {
                                            // console.log(orderId, "orderId");
                                            return order.OrderId == orderId;
                                        }
                                    ).map((data) => {
                                        if (data.Delivered == false) {
                                            data.Delivered = true;
                                            console.log(
                                                data.Delivered,
                                                "data.Delivered"
                                            );
                                            return data;
                                        }
                                        return data;
                                    });
                                console.log(updatedData, "updatedData");
                                console.log(parseData, "parseData");
                                let mappedStatusData =
                                    parseData.ProductCollection.map((order) => {
                                        if (order.OrderId == orderId) {
                                            // console.log(orderId, "in the middle");
                                            return updatedData[0];
                                        }
                                        return order;
                                    });

                                let data = {
                                    ProductCollection: mappedStatusData
                                };
                                console.log(data, "data");

                                localStorage.setItem(
                                    "LocalStorageData",
                                    JSON.stringify(data)
                                );

                                const getlocalStorageData =
                                    localStorage.getItem("LocalStorageData");
                                const getParseData =
                                    JSON.parse(getlocalStorageData);
                                // console.log(getParseData, "parseData");
                                const ProductsModel = new JSONModel(
                                    getParseData
                                );
                                this.getView().setModel(ProductsModel);
                                //==============
                                this.oDefaultDialog.close();
                                this.getView().getModel().refresh();
                                var msg = "User status changed";
                                MessageToast.show(msg);
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                this.oDefaultDialog.close();
                            }.bind(this)
                        })
                    });

                    console.log(this.oDefaultDialog, "this.oDefaultDialog");
                    // to get access to the controller's model
                    this.getView().addDependent(this.oDefaultDialog);
                }
                this.getView().getModel().refresh();
                console.log("this.oDefaultDialog");
                console.log(this.oDefaultDialog, "this.oDefaultDialog");
                this.oDefaultDialog.open();
            },

            onDeleteButtonPressed: function (orderId) {
                const localStorageData =
                    localStorage.getItem("LocalStorageData");
                const parseData = JSON.parse(localStorageData);
                console.log(parseData, "parseData");
                const ProductsModel = new JSONModel(parseData);
                this.getView().setModel(ProductsModel);
                if (!this.oDefaultDialog) {
                    this.oDefaultDialog = new Dialog({
                        title: "Are you sure to delete this order?",

                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                let allOrders = JSON.parse(
                                    localStorage.getItem("LocalStorageData")
                                );

                                let updatedOrderData =
                                    allOrders.ProductCollection.filter(
                                        (order) => order.OrderId !== orderId
                                    );

                                let data = {
                                    ProductCollection: updatedOrderData
                                };

                                localStorage.setItem(
                                    "LocalStorageData",
                                    JSON.stringify(data)
                                );

                                this.oDefaultDialog.close();
                                MessageToast.show("Order Successfully Deleted");

                                const localStorageData =
                                    localStorage.getItem("LocalStorageData");
                                const parseData = JSON.parse(localStorageData);
                                console.log(parseData, "parseData");
                                const ProductsModel = new JSONModel(parseData);
                                this.getView().setModel(ProductsModel);
                                this.getView().getModel().refresh();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                this.oDefaultDialog.close();
                            }.bind(this)
                        })
                    });

                    // to get access to the controller's model
                    this.getView().addDependent(this.oDefaultDialog);
                }

                this.oDefaultDialog.open();
            }
        });
    }
);
