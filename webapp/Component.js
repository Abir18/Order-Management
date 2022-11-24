sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
    function (UIComponent, JSONModel) {
        "use strict";

        return UIComponent.extend("task.order.management.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                let data = {
                    ProductCollection: [
                        {
                            OrderId: 1,
                            CustomerName: "Fuad",
                            Address: "Dhaka",
                            Date: "22 November, 2022",
                            Active: true
                        },
                        {
                            OrderId: 2,
                            CustomerName: "Rifat",
                            Address: "Chittagong",
                            Date: "23 November, 2022",
                            Active: false
                        },
                        {
                            OrderId: 3,
                            CustomerName: "Suweb",
                            Address: "Karachi",
                            Date: "12 November, 2022",
                            Active: false
                        },
                        {
                            OrderId: 4,
                            CustomerName: "Ashik",
                            Address: "Dhaka",
                            Date: "2 November, 2022",
                            Active: true
                        }
                    ]
                };

                UIComponent.prototype.init.apply(this, arguments);

                localStorage.setItem("data", JSON.stringify(data));

                // Get data from LocalStorage and set it to Model
                // const localStorageData = localStorage.getItem("data");
                // const parseData = JSON.parse(localStorageData);
                // console.log(parseData, "localStorageData");
                // const ProductsModel = new JSONModel(parseData);
                // this.setModel(ProductsModel, "products");

                // oProductsModel = new JSONModel(
                //     sap.ui.require.toUrl("task/order/management/mock") +
                //         "/products.json"
                // );
                // oProductsModel.setSizeLimit(1000);
                // this.setModel(oProductsModel, "products");

                // set products demo model on this sample
                let oProductsModel = new JSONModel(data);
                this.setModel(oProductsModel, "products");

                // const model = this.getModel("products");
                // console.log(model.getData(), "model");
            }
        });
    }
);
