// sap.ui.define(
//     ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
//     function (UIComponent, JSONModel) {
//         "use strict";

//         return UIComponent.extend("practise.orderManegement.Component", {
//             metadata: {
//                 manifest: "json"
//             },

//             init: function () {
//                 var oProductsModel;

//                 UIComponent.prototype.init.apply(this, arguments);

//                 // set products demo model on this sample
//                 oProductsModel = new JSONModel(
//                     sap.ui.require.toUrl("practise/orderManegement/mock") +
//                         "/products.json"
//                 );
//                 oProductsModel.setSizeLimit(1000);
//                 this.setModel(oProductsModel, "products");
//             }
//         });
//     }
// );

sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
    function (UIComponent, JSONModel) {
        "use strict";

        return UIComponent.extend("task.order.management.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                var oProductsModel;

                UIComponent.prototype.init.apply(this, arguments);

                // set products demo model on this sample
                oProductsModel = new JSONModel(
                    sap.ui.require.toUrl("task/order/management/mock") +
                        "/products.json"
                );
                oProductsModel.setSizeLimit(1000);
                this.setModel(oProductsModel, "products");
            }
        });
    }
);
