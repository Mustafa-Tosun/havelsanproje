sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(BaseController, MessageBox, Utilities, History, MessageToast, siparisListesi) {
	"use strict";
	var enBuyukSiparisNo = -999;

	return BaseController.extend("com.sap.build.standard.esasPrototip.controller.KontratsizCokKalemliSiparis", {
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

			this.aRadioButtonGroupIds = ["sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-srekdr43ka4w63lz96fophf39_S9"];
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
			var oRadioButtonGroup = this.byId("sap_m_Page_0-content-sap_m_RadioButtonGroup-1598622896251-srekdr43ka4w63lz96fophf39_S9");
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
		onListeyeEkle: function(oEvent) {

			var t_adSoyad = this.getView().byId("adSoyad").getValue();
			var t_urun = this.getView().byId("urun").getValue();
			var t_urunAciklama = this.getView().byId("urunAciklama").getValue();
			var t_teslimSekli = this.getView().byId("teslimSekli").getValue();
			var t_paketleme = this.getView().byId("paketleme").getValue();
			var t_miktar = this.getView().byId("miktar").getValue();
			var t_olcuBirimi = this.getView().byId("olcuBirimi").getValue();
			var t_paraBirimi = this.getView().byId("paraBirimi").getValue();
			var t_sevkiyatBaslangic = this.getView().byId("sevkiyatBaslangic").getDateValue();
			var t_sevkiyatBitis = this.getView().byId("sevkiyatBitis").getDateValue();
			var t_odemeTuru = this.getView().byId("odemeTuru").getValue();
			var t_tasimaSekli = this.getView().byId("tasimaSekli").getValue();
			var t_sektor = this.getView().byId("sektor").getValue();
			var t_odemeBilgisi = this.getView().byId("odemeBilgisi").getValue();
			var t_dokumanTuru = this.getView().byId("dokumanTuru").getValue();
			var t_kopyalamaAdedi = this.getView().byId("kopyaAdedi").getValue();
			var t_aciklama = this.getView().byId("aciklama").getValue();
			var t_faturaFirmasi = this.getView().byId("faturaFirmasi").getValue();
			var t_aliciFirma = this.getView().byId("aliciFirma").getValue();
			var t_aciklamalar = this.getView().byId("aciklamalar").getValue();


			var tempJSON = {
				siparisler: [
						{
						"adSoyad":t_adSoyad,
						"urun": t_urun,
						"siparisNo": enBuyukSiparisNo,
						"urunAciklama": t_urunAciklama,
						"teslimSekli": t_teslimSekli,
						"paketleme": t_paketleme,
						"miktar": t_miktar,
						"olcuBirimi": t_olcuBirimi,
						"paraBirimi": t_paraBirimi,
						"sevkiyatBaslangic": t_sevkiyatBaslangic,
						"sevkiyatBitis": t_sevkiyatBitis,
						"odemeTuru": t_odemeTuru,
						"tasimaSekli": t_tasimaSekli,
						"sektor": t_sektor,
						"odemeBilgisi": t_odemeBilgisi,
						"dokumanTuru": t_dokumanTuru,
						"kopyaAdedi": t_kopyalamaAdedi,
						"aciklama": t_aciklama,
						"faturaFirmasi": t_faturaFirmasi,
						"aliciFirma": t_aliciFirma,
						"aciklamalar": t_aciklamalar
					},
				]
			};

			if(JSON.stringify(this.getView().getModel("cokKalemSiparisModel").getProperty("/")) == '{}'){

				this.getView().getModel("cokKalemSiparisModel").setProperty("/",tempJSON);
				var oModel = this.getView().getModel("cokKalemSiparisModel");
				var oModelJSON = oModel.getJSON();
				siparisListesi = JSON.parse(oModelJSON);
				console.log(siparisListesi);

			}
			else{

				this.getView().getModel("cokKalemSiparisModel").getProperty("/");
				var oModel = this.getView().getModel("cokKalemSiparisModel");
				var oModelJSON = oModel.getJSON();
				siparisListesi = JSON.parse(oModelJSON);
				console.log(siparisListesi);
				siparisListesi.siparisler.push(tempJSON.siparisler[0]);
				this.getView().getModel("cokKalemSiparisModel").setProperty("/", siparisListesi);

			}


			/*
			this.getView().getModel("cokKalemSiparisModel").setProperty("/", tempJSON);

			var oModel = this.getView().getModel("cokKalemSiparisModel");
			var oModelJSON = oModel.getJSON();
			console.log("Eklenen JSON");
			console.log(oModelJSON);

			var siparisListesi = JSON.parse(oModelJSON);
			//console.log(tempJsonArray.siparisler);
			siparisListesi.siparisler.push(JSON.parse(oModelJSON).siparisler[0]);

			var tempJSONString = JSON.stringify(siparisListesi)
			console.log(tempJSONString);

			this.getView().getModel("cokKalemSiparisModel").setProperty("/",siparisListesi);
*/
			//var oModel2= new sap.ui.model.json.JSONModel(siparisListesi);
			//this.getView().setModel(oModel2, "cokKalemSiparisModel");
			//var oModelJSON2 = oModel2.getJSON();
			//console.log("Tum modelin JSON i");
			//console.log(oModelJSON2);


			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("KontratsizCokKalemliSiparis", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("KontratsizCokKalemliSiparis").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oModel = new sap.ui.model.json.JSONModel();
			var oResourceBundle = this.getOwnerComponent()
                .getModel("i18n")
				.getResourceBundle();
				
			var url = oResourceBundle.getText("dataUrl");
			oModel.loadData(url);

			this.getView().setModel(oModel, "cokKalemSiparisModel");
			

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

		},
		onKaydet: function(oEvent) {
            console.log("onKaydet");
            let oModel = this.getView().getModel("cokKalemSiparisModel");
            let cokKalemSiparisJSON = oModel.getJSON();
            let cokKalemSiparisJSONString = JSON.parse(cokKalemSiparisJSON);
            console.log(cokKalemSiparisJSONString);
            jQuery.ajax({
                type: "POST",
                url: "https://stajprojebackend.herokuapp.com/cokluSiparis",
                contentType: "application/json",
                async: false,
                data:JSON.stringify(cokKalemSiparisJSONString),
                success: function() {
                    console.log("Siparis db ye kaydedildi: ");
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

            this.getView().getModel("cokKalemSiparisModel").setProperty("/"); //liste sifirlama


            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                this.doNavigate("YurticiWebSiparisListesi", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },

		onItemSelected: function(oEvent) {
			//var oSelectedItem = oEvent.getSource();
			//var oContext = oSelectedItem.getBindingContext('cokKalemSiparisModel');
			//var sPath = oContext.getPath();
			//var oSummaryTable = this.byId("ozetTablosu");
			//oSummaryTable.bindElement({ path: sPath, model: "cokKalemSiparisModel" });
		},

		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609833381-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609936675-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610321687-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610632898-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598623728752-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598610390862-srekdr43ka4w63lz96fophf39_S9",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Page_0-content-sap_m_ComboBox-1598609672253-srekdr43ka4w63lz96fophf39_S9",
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
