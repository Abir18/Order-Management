sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/f/library"
    ],
    function (
        Controller,
        Filter,
        FilterOperator,
        Sorter,
        MessageBox,
        JSONModel,
        fioriLibrary
    ) {
        "use strict";

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

                // let customers = new JSONModel(
                //     sap.ui.require.toUrl("task/order/management/customers.json")
                // );

                // console.log(customers, "customers");

                // this.getView().setModel(customers);

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

                // this.byId("app_input_orderno").setValue(
                //     Math.round(Math.random() * 100)
                // );
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
            onDeleteButtonPressed: function (orderId) {
                console.log(orderId, typeof orderId);
                // console.log(oEvent.getParameters());
                console.log("Deleted");

                let allOrders = JSON.parse(
                    localStorage.getItem("LocalStorageData")
                );
                // console.log(allOrders.ProductCollection);

                let updatedOrderData = allOrders.ProductCollection.filter(
                    (order) => order.OrderId !== orderId
                );

                let data = { ProductCollection: updatedOrderData };

                console.log(updatedOrderData, "u");
                console.log(data, "uu");

                localStorage.setItem("LocalStorageData", JSON.stringify(data));

                const localStorageData =
                    localStorage.getItem("LocalStorageData");
                const parseData = JSON.parse(localStorageData);
                console.log(parseData, "parseData");
                const ProductsModel = new JSONModel(parseData);
                this.getView().setModel(ProductsModel);

                // this.getView().getModel().refresh();
            }
        });
    }
);
