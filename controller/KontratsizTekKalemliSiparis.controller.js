sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.esasPrototip.controller.KontratsizTekKalemliSiparis", {
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

			this.aRadioButtonGroupIds = ["sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12"];
			this.handleRadioButtonGroupsSelectedIndex();

		},
		handleRadioButtonGroupsSelectedIndex: function() {
			var that = this;
			this.aRadioButtonGroupIds.forEach(function(sRadioButtonGroupId) {
				var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
				var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
				if (oButtonsBinding) {
					var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
					var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
					oButtonsBinding.attachEventOnce("change", function() {
						if (oSelectedIndexBinding) {
							oSelectedIndexBinding.refresh(true);
						} else {
							oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
						}
					});
				}
			});

		},
		_onPageNavButtonPress: function(oEvent) {

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
		_onTextAreaLiveChange: function() {
			return new Promise(function(fnResolve) {
				var sTargetPos = "";
				sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
				sap.m.MessageToast.show("", {
					onClose: fnResolve,
					duration: 0 || 3000,
					at: sTargetPos,
					my: sTargetPos
				});
			}).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		convertTextToIndexFormatter: function(sTextValue) {
			var oRadioButtonGroup = this.byId("sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12");
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function(oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function(oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect: function() {

		},
		onIleri: function(oEvent) {
			var adSoyad = this.getView().byId("adSoyad").getValue();
			var urun = this.getView().byId("urun").getValue();
			var urunAciklama = this.getView().byId("urunAciklama").getValue();
			var teslimSekli = this.getView().byId("teslimSekli").getValue();
			var paketleme = this.getView().byId("paketleme").getValue();
			var miktar = this.getView().byId("miktar").getValue();
			var olcuBirimi = this.getView().byId("olcuBirimi").getValue();
			var paraBirimi = this.getView().byId("paraBirimi").getValue();
			var sevkiyatBaslangic = this.getView().byId("sevkiyatBaslangic").getDateValue();
			var sevkiyatBitis = this.getView().byId("sevkiyatBitis").getDateValue();
			var odemeTuru = this.getView().byId("odemeTuru").getValue();
			var tasimaSekli = this.getView().byId("tasimaSekli").getValue();
			var sektor = this.getView().byId("sektor").getValue();
			var odemeBilgisi = this.getView().byId("odemeBilgisi").getValue();
			var dokumanTuru = this.getView().byId("dokumanTuru").getValue();
			var kopyalamaAdedi = this.getView().byId("kopyalamaAdedi").getValue();
			var aciklama = this.getView().byId("aciklama").getValue();
			var faturaFirmasi = this.getView().byId("faturaFirmasi").getValue();
			var aliciFirma = this.getView().byId("aliciFirma").getValue();
			var aciklamalar = this.getView().byId("aciklamalar").getValue();
			console.log(odemeBilgisi);
			console.log(olcuBirimi);
			
			var oBindingContext = oEvent.getSource().getBindingContext();
			console.log(oBindingContext);
			return new Promise(function(fnResolve) {

				this.doNavigate("SiparisOzetEkrani", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("KontratsizTekKalemliSiparis").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609672253-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609833381-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609936675-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609976995-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610321687-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610390862-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610632898-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598623728752-emwtgiw74gerh39f2artjq4z8_S8-o5bfz2azdlpxwka7nyor5ahz12_S12",
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
