sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(BaseController, MessageBox, Utilities, History, MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.esasPrototip.controller.SiparisOzetEkrani", {
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
		_onPageNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		onKaydet: function(oEvent) {
			var oModel = this.getView().getModel("tekKalemSiparisModel");
			var kopyaAdedi = oModel.getProperty("/kopyaAdedi").toString();
			//console.log(oModel.getJSON());
			var tekKalemSiparisJSON = {
				"adSoyad": oModel.getProperty("/adSoyad"),
				"urun": oModel.getProperty("/urun"),
				"siparisNo": enBuyukSiparisNo,
				"urunAciklama": oModel.getProperty("/urunAciklama"),
				"teslimSekli": oModel.getProperty("/teslimSekli"),
				"paketleme": oModel.getProperty("/paketleme"),
				"miktar": oModel.getProperty("/miktar"),
				"olcuBirimi": oModel.getProperty("/olcuBirimi"),
				"paraBirimi": oModel.getProperty("/paraBirimi"),
				"sevkiyatBaslangic": oModel.getProperty("/sevkiyatBaslangic"),
				"sevkiyatBitis": oModel.getProperty("/sevkiyatBitis"),
				"odemeTuru": oModel.getProperty("/odemeTuru"),
				"tasimaSekli": oModel.getProperty("/tasimaSekli"),
				"sektor": oModel.getProperty("/sektor"),
				"odemeBilgisi": oModel.getProperty("/odemeBilgisi"),
				"dokumanTuru": oModel.getProperty("/dokumanTuru"),
				"kopyaAdedi": kopyaAdedi,
				"aciklama": oModel.getProperty("/aciklama"),
				"faturaFirmasi": oModel.getProperty("/faturaFirmasi"),
				"aliciFirma": oModel.getProperty("/aliciFirma"),
				"aciklamalar": oModel.getProperty("/aciklamalar")
			};
			// this.getView().getModel("tekKalemSiparisModel").getProperty("/adSoyad");
			 console.log(tekKalemSiparisJSON);
			// console.log(tekKalemSiparisJSON/oData);
			// console.log(tekKalemSiparisJSON>oData);
			// console.log(tekKalemSiparisJSON[0]);
			jQuery.ajax({
        		type: "POST",
        		url: "https://stajprojebackend.herokuapp.com/siparis",
        		contentType: "application/json",
        		data:JSON.stringify(tekKalemSiparisJSON),
				success: function() {
					MessageToast.show("Siparis Başarıyla Kaydedildi.", {
                        duration: 5000,
                    });
				},
				error: function(error) {
					console.log("HATA: ", error);
						MessageToast.show("başarısız", {
                        duration: 5000,
                    });
				}
        	});

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("YurticiWebSiparisListesi", oBindingContext, fnResolve, "");
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
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("SiparisOzetEkrani").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var enBuyukSiparisNo = -999;

			jQuery.ajax({
				type: "GET",
				url: "https://stajprojebackend.herokuapp.com/enBuyukSiparisNo",
				contentType: "application/json",
				async: true,
				success: function(response) {
					console.log("enBuyukSiparisNo alindi.");
					enBuyukSiparisNo = response.enBuyukSiparisNo + 1;
				},
				error: function(error) {
					console.log("HATA: enBuyukSiparisNo alinamadi.", error);
				}
			});

		}
	});
}, /* bExport= */ true);
