var veriler_url = "https://havelsanproje.herokuapp.com/veriler";

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast", // aşağıda beliren alert() tarzı
	"sap/ui/model/json/JSONModel", // JSON formatına erişim
	"sap/ui/core/Fragment" // Pop-up - dialog
], function (Controller,
			MessageToast,
			JSONModel,
			Fragment) {
	"use strict";

	return Controller.extend("etimaden.havelsan-proje.controller.View1", {
		onInit : function () {
        	// set data model on view
        	var oData = {
        		ürün: {
            		isim: "Bor",
            		miktar: "3",
            		birim: "ton"
            	}
        	};
        	
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
        
        var siparisVerileri = new sap.ui.model.json.JSONModel(veriler_url);
        this.getView().setModel(siparisVerileri, "veri");
		},

		onShowHello: function () {
			 MessageToast.show("Hello World");
		},

        onSubmit: function () {
        	console.log("submitting..");
        	jQuery.ajax({
        		type: "POST",
        		url: "https://havelsanproje.herokuapp.com/siparis",
        		contentType: "application/json",
        		data:JSON.stringify({
						"müsteri": "Controller",
						"siparisNo": "0010",
						"ürün": "Yeni Ürün3",
						"açıklama": "açıklama",
						"teslimSekli": "teslim",
						"paraBirimi": "Yok"
				}),
				success: function(data, textStatus){
					MessageToast.show("Talep Başarıyla Kaydedildi.", {
                        duration: 5000,
                    });
				},
				error: function(error){
					console.log("HATA: ", error);
						MessageToast.show("başarısız", {
                        duration: 5000,
                    });
				}
        	});
        },
        
        onChangeSiparisNo: function (oEvent) {
        	var input = oEvent.getParameters().value;
        	var kontrol = {
        		"siparisNo": input
        	}
        	jQuery.ajax({
        		type: "POST",
        		url: "https://havelsanproje.herokuapp.com/kontrolSiparisNo",
        		contentType: "application/json",
				data: JSON.stringify(kontrol),
				success: function(response)  {
					console.log("siparis no kontrol get success");
				},
				error: function(error,response) {
					console.log("HATA: ", error);
					if(error.status == 402){
						MessageToast.show("Sipariş numarası zaten kayıtlı");
					}
            	}
        	})
        },
        
		kaydetYeniSiparis: function (oEvent) {
			const oView = this.getView();
        	jQuery.ajax({
        		type: "POST",
        		url: "https://havelsanproje.herokuapp.com/siparis",
        		contentType: "application/json",
        		data:JSON.stringify({
						"müsteri": oView.byId("musteri").getValue(),
						"siparisNo": oView.byId("siparisNo").getValue(),
						"ürün": oView.byId("urun").getValue(),
						"açıklama": oView.byId("aciklama").getValue(),
						"teslimSekli": oView.byId("teslimSekli").getValue(),
						"paraBirimi": oView.byId("paraBirimi").getValue()
				}),
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
		},
		
		onOpenDialog : function () {
			var oView = this.getView();
			// create dialog lazily
			if (!this.byId("helloDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "etimaden.havelsan-proje.view.HelloDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("helloDialog").open();
			}
		},
		
		onCloseDialog: function () {
			this.byId("helloDialog").close();
		}
	});
});