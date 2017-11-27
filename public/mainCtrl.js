var array=[];
var array1=[];
//var config = require('../config.js');
//var url = config.config.apiUrl;

var myApp = angular.module ("myApp", ['ngRoute','ui.bootstrap']);      //'ui.bootstrap'
myApp.config (function($routeProvider){
	$routeProvider  
		.when ('/', {
			templateUrl:'login.html',
			controller: 'InterfaceCtrl'
				}) 
          .when ('/home', {
			templateUrl:'home.html',
			controller: 'homeCtrl1'
				})
		 .when ('/orderstatus', {
			templateUrl:'ordersearch.html',
			controller: 'OrderCtrl'
				})
		 .when ('/orderdetails', {
			templateUrl:'orderdetails.html',
			controller: 'OrderDetailsCtrl'
				})
			.when ('/invoicesearch', {
			templateUrl:'invoicesearch.html',
			controller: 'invoicesearchCtrl'
			
				})
				.when ('/claimdetails', {
			templateUrl:'claimdetails.html',
			controller: 'claimDetailsCtrl'
				})
				.when ('/claimsearch', {
			templateUrl:'cliamsearch.html',
			controller: 'claimsearchCtrl'
				})
		.when ('/invoicedetails/:invoice', {
			templateUrl:'invoicedetails.html',
			controller: 'invoiceDetailsCtrl'
				})
				.when ('/claimssearch', {
			templateUrl:'claimssearch.html',
			controller: 'claimssearchCtrl'
				})
		.when ('/claimdetails', {
			templateUrl:'claimdetails.html',
			controller: 'claimDetailsCtrl'
				})
				.when ('/logout', {
			templateUrl:'login.html',
			controller: 'InterfaceCtrl'
				})
				.when ('/pwd', {
			templateUrl:'pwdchg.html',
			controller: 'sun'
				});
				
           			
});





myApp.controller("InterfaceCtrl", function($scope, $rootScope, $location , $http ,$window){
	
	$rootScope.fullscreen=true;
	$scope.submit = function(isValid){
		$scope.submitted="true";
		
        var Email = $scope.Email;
		
        var Password = $scope.Password;
		
      var data={ 
	  
	   "Email":Email,
	   "Password":Password
	  }
	  
	  
	  $http.get("authenticateCustomer",{params:data}).then(function(response){
		//$http.post("https://"+window.location.hostname+"/authenticateCustomer",data).then(function(response){
			//$window.alert(JSON.stringify(response));
	     if(response.data.output.length!=0){
			 if(response.data.output[0].type == "dealer"){
            //$window.alert("welcome"+response.data.output[0].dealerId);
		     
			$location.path("/home" );
			$rootScope.fullscreen=false;
			$window.localStorage.setItem('storage',JSON.stringify(response.data.output))
			
        }
		 }
    
	    else{
		    
			if(Email != null && Password != null)
		   {
			   $scope.errmsg="Please Verify Your Credentials";
		   }
	    }
	
		});
	};
});


myApp.controller("homeCtrl1", function($scope, $rootScope, $location , $http ,$window){
	
	     array = []; //remove any unwanted data in the array
		 
	 var cDetails=JSON.parse($window.localStorage.getItem('storage'));
	 
	  
	  var Iorder=cDetails[0].dealerId;
			var count =0;
			var order={ 
	                   "dealerId" : Iorder,
	                  
	                     }
	  
	               $http.get("getAllOrdersBySpecifiedId",{params:order}).then(function(response){
	//$http.get("https://"+window.location.hostname+"/getAllOrdersBySpecifiedId",{params:order}).then(function(response){				 
	                     if(response === null)
		                       {
								   
				                  
				                alert("No Matches found");
							   
							   }                                
    
	                     else{
							         
									  var length = response.data.output.length;
								    
									 if(length != 0 ){
								  for(i=0; i<length; i++){
									 
									   if(response.data.output[i].dealerId == Iorder){ 
										   
										  array.push(response.data.output[i]);
										  				                         
									  } 
									
									  
							   }
									 }
							  
							 								  
							    $scope.orders = array;
							   
		                     
	                         } 
	
		                 });
						 
$http.get("getclaims").then(function(response){
		 
           //   alert(JSON.stringify(response.data.output));	
			  //var jj=JSON.stringify(response);
			  // $window.localStorage.setItem('ress',JSON.stringify(response.data.output));
       $scope.data=response.data.output;
		
 });
		$scope.selected = function(orderNo){
		
	
		console.log(orderNo);
		
		var id = orderNo;
			$window.localStorage.setItem('orderid',id);
	
		
			
		$location.path("/claimdetails");
	};				 
	
	$scope.selectedOrder = function(order){
		
		array1 = []; //removes any unwanted data in the array1
		console.log(order);
		
		var id = order
		
		$window.localStorage.setItem('orderID',id);
			
		
		var data={
			"orderId" :id 
		}
		
	               $http.get("getAllProductsBySpecifiedId",{params:data}).then(function(response){
				   //$http.get("https://"+window.location.hostname+"/getAllProductsBySpecifiedId",{params:data}).then(function(response){	                

					if(response.data.output.length!=0)
		                       {
				                 
									  var length = response.data.output.length;
								    // alert(length);
								  for(i=0;i<length;i++){
									  if(response.data.output[i].orderId == id){ 
									  
										  array1.push(response.data.output[i]);
										 
									  }
									  
								  }
								  
								  $scope.products = array1;
								
				                   $location.path("/orderdetails");
								 
                               }
    
	                     else{
		                        alert("No Matches found");
	                         } 
	
		                 });

		
	};
	
	
});



myApp.controller("OrderCtrl", function($scope, $http, $window, $location, $rootScope, $filter, selectedCustomerOrderTypesFilter){
	 
	 //pagination
	 $scope.filteredproducts = []
  ,$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  $scope.products = [];
  $scope.orderByDate = [];
  //$scope.loading = true;
  
	var loadOrder = function(){
		var length1 = array.length;
		//alert(length1);
		$scope.order = array;
		$scope.order1 =$scope.order ;
		 //console.log($filter('orderBy')($scope.order,'-orderDate'));
		 $scope.order = $filter('orderBy')($scope.order,'-orderDate');
		 $scope.order11 = $filter('orderBy')($scope.order,'-orderDate');
		// $scope.orderByDate = $scope.order;
		 $scope.order = $filter('selectedCustomerOrderTypes')($scope.order);
		next();
		
		
	}
	
	$scope.click=function(){
		console.log("in ng-checked value");
		console.log("filtered order details"+ $scope.order);
		 //pagination
	 $scope.filteredproducts = [],
	$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  //$scope.order = [];
 // $scope.order = $scope.filteredorder;
 
 $scope.order = $filter('selectedCustomerOrderTypes')($scope.order11);
		next();
		
	}
	 	
	
	 
	$scope.selectedOrder = function(order){
		
		array1 = []; //removes any unwanted data in the array1
		console.log(order);
		
		var id = order
		0
		$window.localStorage.setItem('orderID',id);
			
		
		var data={
			"orderId" :id 
		}
		
	               $http.get("getAllProductsBySpecifiedId",{params:data}).then(function(response){
//$http.get("https://"+window.location.hostname+"/getAllProductsBySpecifiedId",{params:data}).then(function(response){	                

					if(response.data.output.length!=0)
		                       {
				                 
									  var length = response.data.output.length;
								    // alert(length);
								  for(i=0;i<length;i++){
									  if(response.data.output[i].orderId == id){ 
									  
										  array1.push(response.data.output[i]);
										 
									  }
									  
								  }
								  
								  $scope.products = array1;
								
				                   $location.path("/orderdetails");
								 
                               }
    
	                     else{
		                        alert("No Matches found");
	                         } 
	
		                 });

		
	};
	$scope.searchOrder = function()
	{
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
		, end = begin + $scope.itemsPerPage;
		console.log("searchOrder");
		$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
	};

	$scope.searchOrderByDate = function()
	{
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
		, end = begin + $scope.itemsPerPage;
		var arr = $scope.reportrangedateorder.split("-");
		var from = arr[0].trim();
		var toDate = arr[1].trim();
		console.log('from',from);
		console.log('toDate',toDate);
		//$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
		$scope.filteredorder=  $scope.order.filter(item => moment(new Date(item.orderDate).toISOString()).isBetween(from,toDate));
		
	};

    //Watch for date changes
    $scope.$watch('reportrangedateorder', function (newDate) {
    	if (newDate) {
    		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
    			end = begin + $scope.itemsPerPage;
    		var arr = newDate.split("-");
    		var from = arr[0].trim();
    		var toDate = arr[1].trim();
    		console.log('from', from);
    		console.log('toDate', toDate);
    		//$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
    		$scope.filteredorder = $scope.order.filter(item => moment(new Date(item.orderDate).toISOString()).isBetween(from, toDate));
    	}
	}, false);
	$scope.$watch('apply.daterangepicker'),function(newDate) {
		console.log('newDate', newDate);
	}
	
	
	//pagination 
			var next = function() {
  $scope.$watch('currentPage + itemsPerPage', function() {
  console.log("in watch");
  $scope.itemsPerPage = $scope.viewby;
   /* var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = begin + $scope.itemsPerPage;
    */
   // $scope.filteredTodos = $scope.todos.slice(begin, end);
	var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = (($scope.currentPage) * $scope.itemsPerPage);
	 $scope.filteredorder = $scope.order.slice(begin, end);
	 
	// console.log($filter('orderBy')($scope.filteredorder,'orderDate'));
  });
  };
loadOrder();

$scope.$watch('order', function() {
    console.log($scope.order);
	console.log($scope.order.checked);
  })
  
});
	
	

myApp.controller("OrderDetailsCtrl", function($scope, $http, $window, $location, $routeParams){

 
 var length1 = array.length;
 
 var length2 = array1.length;

 var order=$window.localStorage.getItem('orderID');

 var dealerDetails = JSON.parse($window.localStorage.getItem('storage'));
 console.log('dealerDetails',dealerDetails);

			
 //alert("local storage orderId"+order);
 
 for(var i=0;i<length1;i++){
	 if(array[i].orderId == order){
		 $scope.customerOrder = array[i];
		 console.log(JSON.stringify($scope.customerOrder));
		 var customerOrder = array[i];
		 $scope.cust=customerOrder.orderId
		 $scope.customerId = customerOrder.customerId;
		 $scope.date=customerOrder.orderDate
		 $scope.poNumber=customerOrder.PoNumber
		 $scope.reqDate=customerOrder.requestedDate
		 $scope.shipDate=customerOrder.shipDate		 
		 $scope.projectName=customerOrder.projectName		 
		 
		 $scope.details=customerOrder.order_response
		 console.log("This is details"+JSON.stringify($scope.details));
		 $scope.ship=customerOrder.ShipTo
		 $scope.sold=customerOrder.SoldTo
		 $scope.orderstatus = customerOrder.orderstatus;
		 
	 }
 }
 
 var products=[]
 var prod=[]
 var productInfo=array1
 console.log("var productInfo"+JSON.stringify(productInfo))
 var length=productInfo.length
 for(i=0; i<length; i++){
	productInfo[i].product_response[0].quantity= productInfo[i].quantity;
	productInfo[i].product_response[0].orderstatus= productInfo[i].orderstatus;
	
	 prod.push(productInfo[i].product_response[0])
 }
console.log("prod array"+JSON.stringify(prod))
$scope.products=prod
$scope.dealer=dealerDetails[0];
console.log('dealer',$scope.dealer);

 
 
});	
	
	// Define our filter
myApp.filter('selectedCustomerOrderTypes', function($filter) {
  return function(order) {
	  //console.log("in custom filter"+JSON.stringify(order))
    var i, len;
    
	//alert("in sellected");
    // get customers that have been checked
    var checkedCustomers = $filter('filter')(order, {checked: true});
    
    // Add in a check to see if any customers were selected. If none, return 
    // them all without filters
    if(checkedCustomers.length == 0) {
      return order;
    }
    
    // get all the unique orderTypes that come from these checked customers
    var orderTypes = {};
    for(i = 0, len = checkedCustomers.length; i < len; ++i) {
      // if this checked customers orderTypes isn't already in the orderTypes object 
      // add it
      if(!orderTypes.hasOwnProperty(checkedCustomers[i].orderType)) {
        orderTypes[checkedCustomers[i].orderType] = true;
      }
    }
    
    // Now that we have the orderTypes that come from the checked customers, we can
    //get all customers from those orderTypes and return them
    var ret = [];
    for(i = 0, len = order.length; i < len; ++i) {
      // If this customer's orderType exists in the orderTypes object, add it to the 
      // return array
      if(orderTypes[order[i].orderType]) {
        ret.push(order[i]);
      } 
    }
    
	console.log("ret custom filter"+JSON.stringify(ret));
    // we have our result!
    return ret;
  };
});

//***************************To Get Unique OrderTypes**********************************//

myApp.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});



myApp.controller("invoicesearchCtrl", function($scope, $http, $window, $location, $routeParams, $filter){
 $scope.filteredproducts = []
  ,$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  $scope.products = [];
  $scope.orderByDate = [];
  $scope.todos=[];
  //$scope.loading = true;
  
 	var loadOrder = function(){
		var length1 = array.length;
		//alert(length1);
		$scope.order = array;
		//$scope.order1 =$scope.order ;
		 //console.log($filter('orderBy')($scope.order,'-orderDate'));
		 $scope.order = $filter('orderBy')($scope.order,'-requestedDate');
		// $scope.order11 = $filter('orderBy')($scope.order,'-orderDate');
		// $scope.orderByDate = $scope.order;
		 //$scope.order = $filter('selectedCustomerOrderTypes')($scope.order);
		next();
		
		
	}
	$scope.searchInvoice = function()
	{
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
		, end = begin + $scope.itemsPerPage;
		$scope.filteredorder= $filter('filter')($scope.order,{invoiceNo:$scope.invoiceSearch}).slice(begin,end);
	};

	$scope.searchOrder = function()
	{
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
		, end = begin + $scope.itemsPerPage;
		$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
	};

	$scope.searchOrderByDate = function()
	{
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
		, end = begin + $scope.itemsPerPage;
		var arr = $scope.reportrangedateinvoice.split("-");
		var from = arr[0].trim();
		var toDate = arr[1].trim();
		console.log('from',from);
		console.log('toDate',toDate);
		//$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
		$scope.filteredorder=  $scope.order.filter(item => moment(new Date(item.order_response[0].invoiceDate).toISOString()).isBetween(from,toDate));//item => moment(new Date(item.orderresponse.invoiceDate).toISOString()).isBetween(from,toDate));
		
	};

	//Watch for date changes
	$scope.$watch('reportrangedatinvoice', function (newDate) {
		if (newDate) {
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
				end = begin + $scope.itemsPerPage;
			var arr = newDate.split("-");
			var from = arr[0].trim();
			var toDate = arr[1].trim();
			console.log('from',from);
			console.log('toDate',toDate);
			//$scope.filteredorder= $filter('filter')($scope.order,{orderId:$scope.orderSearch}).slice(begin,end);
			$scope.filteredorder=  $scope.order.filter(item => moment(new Date(item.order_response[0].invoiceDate).toISOString()).isBetween(from,toDate));//item => moment(new Date(item.orderresponse.invoiceDate).toISOString()).isBetween(from,toDate));
			
		}
	}, false);
	
	var next = function() {
  $scope.$watch('currentPage + itemsPerPage', function() {
  console.log("in watch");
  $scope.itemsPerPage = $scope.viewby;
    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = begin + $scope.itemsPerPage;
    
    $scope.filteredTodos = $scope.todos.slice(begin, end);
	var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = (($scope.currentPage) * $scope.itemsPerPage);
	 $scope.filteredorder = $scope.order.slice(begin, end);
	 console.log(JSON.stringify($scope.filteredorder))
	// console.log($filter('orderBy')($scope.filteredorder,'orderDate'));
   }); 
  };
  loadOrder();
  
});
	

myApp.controller("invoiceDetailsCtrl", function ($scope, $http, $window, $location, $routeParams) {


	//var invoiceDetailsArr = [];
	var order = $window.localStorage.getItem('orderID');
	var total = 0;
	var totalQuantity = 0;
	//console.log("scope",$routeParams);
	//alert("local storage orderId"+order);
	var data = {
		"invoiceNo": $routeParams.invoice
	}
	//var url = window.location.hostname==='localhost'? "http://"+window.location.hostname+":"+window.location.port: "https://"+window.location.hostname;
	$http.get("getInvoieDetailsById",
	{params:data}).then(function (response) {
		if (response.data.output){
			$scope.invoiceDetails = response.data.output.invoiceData[0];
			$scope.productDetails = response.data.output.product_response;
			//$scope.totals=calcTotals($scope.productDetails);
			
			angular.forEach(response.data.output.product_response,function(value,index){
			total += parseFloat(value.totalPrice);
			totalQuantity += parseFloat(value.quantity);
			});
			$scope.invoiceDetails.total= total;
			$scope.invoiceDetails.totalQuantity = totalQuantity;
			console.log('invoice Details 11',$scope);
		} else {
			alert("No Matches found");
		}

	});


});

myApp.controller("claimssearchCtrl", function($scope, $http, $window, $location, $rootScope, $filter,filterFilter)
 {
	$scope.data = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 5
  ,$scope.maxSize = 5;
             var re=[];
          var cDetails=JSON.parse($window.localStorage.getItem('storage'));
	 
   //   var  res=JSON.parse($window.localStorage.getItem('ress'));
           				
	  var Iorder=cDetails[0].dealerId;
	  //alert("hhff"+Iorder);
			var data={
			"orderId" :Iorder
		}
		
	 		  $http.get("getclaims",{params:data}).then(function(response){
				//  $http.get("https://"+window.location.hostname+"/getclaims",{params:data}).then(function(response){	                
             //alert("vbhfvhfhffh"+JSON.stringify(response.data.output.length));
		// var length3=response.data.output.length;
		// for(var i=0;i<length3;i++)
		// {
			// re.push(response.data.output[i]);
		// }
		$scope.data=response.data.output;

  
	$scope.currentPage = 1;
	$scope.totalItems = $scope.data.length;
	//alert("arry lenth is"+$scope.totalItems);
	$scope.entryLimit = 5; // items per page
	$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
     //alert("page size is"+$scope.noOfPages);
 
  $scope.$watch('search', function (newVal, oldVal) {
	     //alert("cdvdv"+$scope.data);
		$scope.filtered = filterFilter($scope.data, newVal);
		//alert("cdvdv"+$scope.filtered);
		$scope.totalItems = $scope.filtered.length;
		$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		$scope.currentPage = 1;
	}, true);


 });
 
	$scope.selectedOrder = function(orderNo){
		console.log(orderNo);
		
		var id = orderNo;
			$window.localStorage.setItem('orderid',id);	
		$location.path("/claimdetails");
	};
	
   
});
myApp.filter('startFrom', function () {
			//alert("hvhvhff");
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

myApp.controller('claimDetailsCtrl', function($scope, $http, $window)
{
		
		//alert('hhxcgdvcgvgvcf');
		 var ger=$window.localStorage.getItem('orderid');
		
		//alert("order id is"+ger);
		var data={
			"orderId" :ger
		}
		
		$http.get("getclaimsId",{params:data}).then(function(response){	                

  // $http.get("https://"+window.location.hostname+"/getclaimsId",{params:data}).then(function(response){	                

					 if(response.data.output.length!=0)
		                        {
				                 
									  // // var length = response.data.output.length;
								  
										//	alert('res'+JSON.stringify(response.data.output));
										

											//alert('Case Reason=',JSON.stringify(response.data.output[0].CaseReason));
									  	  $scope.products = response.data.output;
											$scope.cstatus =response.data.output[0].CaseStatus;
											$scope.cReason =response.data.output[0].CaseReason;
											$scope.cGroup =response.data.output[0].CaseGroup;
								    		//$scope.addrNumber =response.data.output[0].AddressNumber;
											$scope.stat = response.data.output[0].State;
											$scope.zcode = response.data.output[0].ZipCode;
											
											$scope.sitemno = response.data.output[0].ShortItemNo;
											$scope.ltsno = response.data.output[0].LotSerialNumber;
											$scope.contactname1 =response.data.output[0].ContactName1;
											$scope.ctry =response.data.output[0].Country;
											$scope.contactname1addr=response.data.output[0].Contact1Address;
											$scope.Prefix=response.data.output[0].Prefix;
											$scope.FromPhone=response.data.output[0].FromPhone;
											$scope.Remark1=response.data.output[0].Remark1;
											$scope.FAXPrefix=response.data.output[0].FAXPrefix;
											 $scope.CaseFaxNumber=response.data.output[0].CaseFaxNumber;
											$scope.ContactName2=response.data.output[0].ContactName2;
											 $scope.EMailAddress=response.data.output[0].EMailAddress;
											 $scope.ShortItemNo=response.data.output[0].ShortItemNo;
											 $scope.Branch=response.data.output[0].Branch;
											 $scope.LotSerialNumber=response.data.output[0].LotSerialNumber;
											 $scope.bUnit=response.data.output[0].BusinessUnit;
											 $scope.des=response.data.output[0].Description;
											  $scope.cnumber=response.data.output[0].CustomerNumber;
											   $scope.orderid=response.data.output[0].orderId;
											  $scope.CustomerNumber=response.data.output[0].CustomerNumber;
								}
       
    
	                     else{
		                        alert("No Matches found");
	                         } 
	
		              });
		
	});