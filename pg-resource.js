//created by Akash
(function(){
	'use strict';
	angular.module('pg-resource',[])
	.service('ApiConfig',[function(){
		this.baseUrl = "";
	}])
	.factory('Resource',['$http','$q','ApiConfig',function($http,$q,ApiConfig){
		return{
			create: function(url,withBase){
				//Default Initialize as true
				if(typeof withBase == "undefined"){
					withBase = true;
				}
				//break the url in array at every /(backlash)
				var finalUrlC = url.trim();
				var resturl = (url.trim()).split("/");
				var urlValue = [];
				for(var partialUrl in resturl){
					if(resturl[partialUrl].search(":")!=-1){
						urlValue.push(resturl[partialUrl].replace(":",""));
					}
				}
				
				//function to map the data to url
				function buildUrl(data){
					var finalUrl = finalUrlC;
					for(var k in urlValue){
						if(data[urlValue[k]]){
							var d = (":"+urlValue[k]).trim();
							finalUrl= finalUrl.replace(d,data[urlValue[k]]);
						}
					}
					finalUrl= finalUrl.replace(":id","");
					if(withBase){
						finalUrl = ApiConfig.baseUrl + finalUrl; 
					}
					return finalUrl;
					
				}
				
				//function to map the qdata and urldata to url with query to be used in get methods
				function buildqUrl(urlData,qData){
					var qUrl = buildUrl(urlData);
					if(!qData){return qUrl;}
					var keys = Object.keys(qData);
					var qString = "?";
					for(var x in keys){
						if(x==0){qString = qString+ keys[x]+"=" + qData[keys[x]];}
						else{qString = qString + "&" + keys[x] +"="+ qData[keys[x]];}
					}
					return qUrl + qString;
				}
				
				
			return {
				//Defining http service for all
				all: function(urlData,config={}){
					return $http.get(buildUrl(urlData),config);
				},
				//This will return the data of a given id
				find: function(urlData,config={}){
					return $http.get(buildUrl(urlData),config);
				},
				//This will process the data with query string
				qfind: function(urlData,qData,config={}){
					return $http.get(buildqUrl(urlData,qData),config);
				},
				//This will update the data of resource with given id
				update: function(urlData,data,config={}){
					return $http.put(buildUrl(urlData),data,config);
				},
				//This will create the classroom
				create: function(urlData,data,config={}){
					return $http.post(buildUrl(urlData),data,config);
				},
				//To delete the data
				destroy: function(urlData,config={}){
					return $http.delete(buildUrl(urlData),config);
				}
			};
		}
		};
	}]);
})();
