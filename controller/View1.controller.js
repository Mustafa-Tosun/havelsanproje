var genel_veri_url = "https://havelsanproje.herokuapp.com/veriler";

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
//	var data;
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
        	
        		///////////////////////////////////////////////DIGER PROJE
        	    var oModel1 = new sap.ui.model.json.JSONModel();
                var oResourceBundle = this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle();
                var url = oResourceBundle.getText("dataUrl1");

                oModel1.loadData(url); //Genelveri json yuklemesi
                this.getView().setModel(oModel, "dataModel1");

                var oVieww = this.getView();
                var oModell = new sap.ui.model.json.JSONModel(genel_veri_url);
                oModel.attachRequestCompleted(function () {
              //  	  data = JSON.parse(oModel1.getJSON());
                //    items = data[items_text];
                //    vagons = data[vagons_text];
                //    home_stations = data[stations_text][home_text];
                //    abroad_stations = data[stations_text][abroad_text];
                //    clients = data[clients_text];
                    oVieww.setModel(oModell, "fragmentModel");
                });
                ///////////////////////////////////////////////DIGER PROJE
    	var aa = new sap.ui.model.json.JSONModel("https://api.exchangeratesapi.io/latest");
        this.getView().setModel(aa, "data");
        
        var bb = new sap.ui.model.json.JSONModel(genel_veri_url);
        this.getView().setModel(bb, "veri");
            
        //    var deneme = new JSONModel({
         //   	text: data
         //   });
         //   sap.ui.getCore.setModel(deneme);
         //   new JSONModel({data:"{/data"}).placeAt("content");
                
        
        ///////////////////////////////////////////////////////https://jsbin.com/wucazawoze/edit?html,js,output
        
        
        ///////////////////////////////////////////////////////https://jsbin.com/wucazawoze/edit?html,js,output

        
        
        /////////////////////////////////////////////////////////DOCUMENTATION
        // Create a JSON model from an object literal
	//	var documentationModel = new JSONModel({
	//		greetingText: "Hi, my name is Harry Hawk"
	//	});

		// Assign the model object to the SAPUI5 core
	//	sap.ui.getCore().setModel(documentationModel);
    	
			
			// Display a text element whose text is derived
		// from the model object

	//	new Text({text: "{/greetingText}"}).placeAt("content");
		},
    	
    	/////////////////////////////////////////////////////////DOCUMENTATION
		
		onShowHello: function () {
			 MessageToast.show("Hello World");
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