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
                const localStorageData = localStorage.getItem("data");
                const parseData = JSON.parse(localStorageData);
                const ProductsModel = new JSONModel(parseData);
                this.getView().setModel(ProductsModel, "products");
            },

            onSearch: function () {
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

                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
            }
        });
    }
);
