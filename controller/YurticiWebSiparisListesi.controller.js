var veriler_url = "https://stajprojebackend.herokuapp.com/siparisler";
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";
	var selectedIndex = -1;

	return BaseController.extend("com.sap.build.standard.esasPrototip.controller.YurticiWebSiparisListesi", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5f4569c0b7db3e5c61210bfb";

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

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		formatDateUTCtoLocale: function(dDate) {
			if (dDate) {
				return new Date(dDate.getUTCFullYear(), dDate.getUTCMonth(), dDate.getUTCDate());
			}
			return dDate;

		},
		_onDateRangeSelectionChange: function(oEvent) {

			var oDateRangeSelection = oEvent.getSource();
			var oBindingContext = oDateRangeSelection.getBindingContext();
			var sBindingPathOfDateValue = oDateRangeSelection.getBindingPath("dateValue");
			var sBindingPathOfSecondDateValue = oDateRangeSelection.getBindingPath("secondDateValue");
			var oFrom = oEvent.getParameter("from");
			if (oBindingContext && sBindingPathOfDateValue && oFrom) {
				var oFromBefore = oBindingContext.getModel().getProperty(sBindingPathOfDateValue, oBindingContext);
				if (oFromBefore) {
					var oUTCFrom = new Date(Date.UTC(oFrom.getFullYear(), oFrom.getMonth(), oFrom.getDate(), oFromBefore.getUTCHours(), oFromBefore.getUTCMinutes(), oFromBefore.getUTCSeconds()));
					oBindingContext.getModel().setProperty(sBindingPathOfDateValue, oUTCFrom, oBindingContext);
				}
			}
			var oTo = oEvent.getParameter("to");
			if (oBindingContext && sBindingPathOfSecondDateValue && oTo) {
				var oToBefore = oBindingContext.getModel().getProperty(sBindingPathOfSecondDateValue, oBindingContext);
				if (oToBefore) {
					var oUTCTo = new Date(Date.UTC(oTo.getFullYear(), oTo.getMonth(), oTo.getDate(), oToBefore.getUTCHours(), oToBefore.getUTCMinutes(), oToBefore.getUTCSeconds()));
					oBindingContext.getModel().setProperty(sBindingPathOfSecondDateValue, oUTCTo, oBindingContext);
				}
			}

		},
		_onFioriListReportTableUpdateFinished: function(oEvent) {
			
			var oTable = oEvent.getSource();
			var oHeaderbar = oTable.getAggregation("headerToolbar");
			if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
				var oTitle = oHeaderbar.getAggregation("content")[1];
				if (oTable.getBinding("items") && oTable.getBinding("items").isLengthFinal()) {
					oTitle.setText("(" + oTable.getBinding("items").getLength() + ")");
				} else {
					oTitle.setText("(1)");
				}
			}

		},
		_onFioriListReportActionButtonPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("KontratsizTekKalemliSiparis", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onFioriListReportActionButtonPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("KontratsizCokKalemliSiparis", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		onSelectionChange: function(oEvent){
			var oSelectedItem = oEvent.getParameter("listItem");          //Get Hold of SelectedItem
			var oTable = oEvent.getSource();                                             //Get Hold of Table
			selectedIndex = oTable.indexOfItem(oSelectedItem)                                        //Get the index of Selected Item
			//https://answers.sap.com/questions/12399310/fetching-the-index-of-a-row-on-basis-of-radio-butt.html
		},

		onGoruntule: function(oEvent) {

			var tempUrl = "https://stajprojebackend.herokuapp.com/siparisDon/" + selectedIndex;
			var responseJSON = {};

			jQuery.ajax({
				type: "GET",
				url: tempUrl,
				contentType: "application/json",
				async: false,
				success: function(response) {
					responseJSON = response;
					console.log("Siparis basariyla siteye ulasti");
				},
				error: function(error) {
					console.log("HATA: siparis siteye ulasamadi", error);
				}
			});

			this.getView().getModel("tekKalemSiparisModel").setProperty("/",responseJSON);

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("SiparisOzetEkrani", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onFioriListReportActionButtonPress3: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("TekKalemliSiparisDuzenlemeEkrani", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("YurticiWebSiparisListesi").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this.oFilterBar = null;
			this.oFilterBar = this.getView().byId("ListReportFilterBar");
			var oBasicSearch = new sap.m.SearchField({
				showSearchButton: true
			});
			this.oFilterBar.setBasicSearch(oBasicSearch);

			var siparisVerileri = new sap.ui.model.json.JSONModel(veriler_url);
			this.getView().setModel(siparisVerileri, "veri");

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1598877003988---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1598877030891---1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);
