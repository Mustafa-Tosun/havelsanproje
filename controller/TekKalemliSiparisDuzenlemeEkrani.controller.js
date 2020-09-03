sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/m/MessageToast"
], function(BaseController, MessageBox, Utilities, History, Dialog,	DialogType, Button, ButtonType, Text, MessageToast) {
	"use strict";
	var confirmed = false;

	return BaseController.extend("com.sap.build.standard.esasPrototip.controller.TekKalemliSiparisDuzenlemeEkrani", {
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

			this.aRadioButtonGroupIds = ["sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-emwtgiw74gerh39f2artjq4z8_S8"];
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
			var oRadioButtonGroup = this.byId("sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-emwtgiw74gerh39f2artjq4z8_S8");
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
		onDegisikleriKaydet: function(oEvent) {

			if (!this.oApproveDialog2) {
				
				var oBindingContext = oEvent.getSource().getBindingContext();

				this.oApproveDialog2 = new Dialog({
					type: DialogType.Message,
					title: "İptal",
					content: new Text({
						text: "Bu değişikliği yapmak istediğinize emin misiniz?",
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Evet",
						press: function () {
							
							var oModel = this.getView().getModel("tekKalemSiparisDuzenleModel");
							var kopyaAdedi = oModel.getProperty("/kopyaAdedi").toString();

							var tekKalemSiparisDuzenleModelJSON = {
								"adSoyad": oModel.getProperty("/adSoyad"),
								"urun": oModel.getProperty("/urun"),
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

							var selectedIndex = this.getOwnerComponent().getModel("itemIndexModel").getProperty("/");

							var tempUrl = "https://stajprojebackend.herokuapp.com/siparisDuzenle/" + selectedIndex;

							jQuery.ajax({
								type: "PUT",
								url: tempUrl,
								contentType: "application/json",
								async: false,
								data:JSON.stringify(tekKalemSiparisDuzenleModelJSON),
								success: function(response) {
									confirmed = true;
									MessageToast.show("Siparis Başarıyla Düzenlendi.", {
										duration: 5000,
									});
								},
								error: function(error) {
									MessageToast.show("Siparis Düzenlenemedi.", {
										duration: 5000,
									});
									console.log("HATA: ", error);
								}
							});
							this.oApproveDialog2.close();
						}.bind(this),
					}),
					endButton: new Button({
						text: "Vazgeç",
						press: function () {
							this.oApproveDialog2.close();
						}.bind(this),
					}),
					
				});
				

			}
			/*
			if(confirmed){
				confirmed = false;
				return new Promise(function(fnResolve) {

					this.doNavigate("YurticiWebSiparisListesi", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}*/

			this.oApproveDialog2.open();
		},
		handleChangeValuestate: function(requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function(requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === '') {
							input.setValueState("Error"); //input is blank set ValueState to error
							status = false;
						} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
							input.setValueState("Error"); //Invalid Date set ValueState to error
							status = false;
						}
					}
				});
			}
			return status;

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TekKalemliSiparisDuzenlemeEkrani").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			this.oModel = this.getOwnerComponent().getModel();

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609672253-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609833381-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609936675-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609976995-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610321687-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610390862-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610632898-emwtgiw74gerh39f2artjq4z8_S8",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598623728752-emwtgiw74gerh39f2artjq4z8_S8",
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
