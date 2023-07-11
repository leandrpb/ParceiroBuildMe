sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./SelectDialog2",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, SelectDialog2, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.prototipoParceiros.controller.Parceiro", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App64a60084f80ccb015dba0dfa";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			if (!this.sContext) {
				this.sContext = "ParceirosSet('1')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onInputValueHelpRequest: function(oEvent) {

			var sSelectDialogName = "SelectDialog2";
			this.mSelectDialogs = this.mSelectDialogs || {};
			var oSelectDialog = this.mSelectDialogs[sSelectDialogName];
			var oSource = oEvent.getSource();

			if (!oSelectDialog) {
				oSelectDialog = new SelectDialog2(this.getView());
				this.mSelectDialogs[sSelectDialogName] = oSelectDialog;

				// For navigation.
				oSelectDialog.setRouter(this.oRouter);
			}
			var fnCancel = function() {
				oSelectDialog.getControl().detachConfirm(fnConfirm);
				oSelectDialog.getControl().detachCancel(fnCancel);
			};
			var fnConfirm = function(oConfirmEvent) {
				fnCancel();
				if (oSelectDialog.getControl().getBinding("items")) {
					var oBindingContext = oConfirmEvent.getParameter("selectedItem").getBindingContext();
					var sPath = oSelectDialog.getControl().data("selectedPropertyPath");
					oSource.setValue(oBindingContext.getProperty(sPath));
				}
			};
			oSelectDialog.getControl().attachConfirm(fnConfirm);
			oSelectDialog.getControl().attachCancel(fnCancel);
			oSelectDialog.open();
			oSelectDialog.getControl().fireLiveChange();

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Parceiro").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);
