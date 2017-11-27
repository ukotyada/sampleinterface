var express = require('express'); 
var bodyParser=require('body-parser')

var MongoClient =require('mongodb').MongoClient;
var url = 'mongodb://mss:mss@ds159180.mlab.com:59180/interfacedb';
//var url = 'mongodb://127.0.0.1:27017/InterfaceDB';

var app = express();

var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));

var port=process.env.PORT || 7000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next)
 {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var sess;

app.get('/', function(req, res) {
         res.sendFile(__dirname+'/public'+'/index.html');
       });

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
	    
   
    //console.log(db);

    // Get the documents collection
	var collection0=db.collection('dealer');
    var collection = db.collection('customer');
	var collection1= db.collection('order');
	var collection2 = db.collection('orderdItems');
	var collection3= db.collection('products');
  var collection4= db.collection('claims');
  var invoiceCollection = db.collection('invoiceDetails');
  
  
//*=======================================Authenticate Customer============================================*//


app.get('/authenticateCustomer', function (req, res) {
	//console.log(req.body);
	sess = req.session;
	var Email=req.query.Email;
	var Password=req.query.Password;
	collection0.find({"Email":Email,"Password":Password}).toArray(function(err,result){
		sess.result=result
		//console.log("session data"+JSON.stringify(sess.result[0].type));
		if(sess.result)
	{
		response={
				"output":sess.result
				 }
				res.json(response)
				//console.log(JSON.stringify(response));
	}
	else
	{
		error={
				"output":err
			  }
				console.log(error)
				res.json(error);
	}
	});
});


//*--------------------------claims data--------------------------------------------------*//

app.get('/getclaims', function (req, res) {
	console.log("entered in claims");
	
	
	collection4.find({}).toArray(function(err,result){
		//sess.result=result
		//console.log("session data"+JSON.stringify(sess.result[0].type));
		if(err)
	{
		response={
				"output":err
				 }
				res.json(response)
				//console.log(JSON.stringify(response));
	}
	else
	{
		response={
				"output":result
			  }
				console.log(response);
				res.json(response);
	}
	});
});
///*--------------------------------------------------------------------------*//
app.get('/getclaimsId', function (req, res) {
	console.log("entered in claim details");
	var id=req.query.orderId;
	console.log("entered in claim details"+id);
	
	collection4.find({"orderId":id}).toArray(function(err,result){
		//sess.result=result
		//console.log("session data"+JSON.stringify(sess.result[0].type));
		if(err)
	{
		response={
				"output":err
				 }
				res.json(response)
				//console.log(JSON.stringify(response));
	}
	else
	{
		response={
				"output":result
			  }
				console.log(response);
				res.json(response);
	}
	});
	
					
});

	
 //*====================================Store CustomerData In DB======================================*//
 
      app.post('/customerReg', function (req, res) {
         console.log('hi');
         // Prepare output in JSON form at
         var customerName=req.body.customerName
         var customerId=req.body.customerId
         var cEmail=req.body.cEmail
         var cPassword=req.body.cPassword
         var cConfirmPass=req.body.cConfirmPass
		 var customerPhone=req.body.customerPhone
		 var customerRole=req.body.customerRole
		 var markertType=req.body.markertType
		 var ProjectName=req.body.ProjectName
		 var country=req.body.country
		 var state=req.body.state
		 var address=req.body.address
		 var PostalCode=req.body.PostalCode
		 

        // console.log(customerName +""+ customerId +""+ cEmail);
         collection.insert({"customerName":customerName,"customerId":customerId,"cEmail":cEmail,"cPassword":cPassword,"customerPhone":customerPhone,"customerRole":customerRole,"markertType":markertType,"ProjectName":ProjectName,"country":country,"state":state,"address":address,"PostalCode":PostalCode}, function (err, result) {
            if (err) {
				response={
				"output" : error
                }
				res.json(response);
			}			  
			  else {
                 response={
				"output" : result
                }
				//console.log("customerData"+JSON.stringify(response));
				res.json(response);
                }
      
	         })

  })
  
  //*==================================Post Order Data==========================================*/
  
  
   //insert Orderapi
      app.post('/orderPost', function (req, res) {
         
         // Prepare output in JSON form at
         var orderId=req.body.orderId
         var customerId=req.body.customerId
         var orderType=req.body.orderType
         var orderDate=req.body.orderDate
         var PoNumber=req.body.PoNumber
		 var projectName=req.body.projectName
		 var status=req.body.status
		 
         //console.log(customerId +""+ orderType +""+ projectName);
         collection1.insert({"orderId":orderId,"customerId":customerId,"orderType":orderType,"orderDate":orderDate,"PoNumber":PoNumber,"projectName":projectName,"status":status}, function (err, result) {
            if (err) {
				response={
				"output" : error
                }
				res.json(response);
			}			  
			  else {
                 response={
				"output" : result
                }
				//console.log("customerData"+JSON.stringify(response));
				res.json(response);
                }
      
	         })

  })


//*====================================retrive Order Details ==========================================*//

 app.get('/getAllOrdersBySpecifiedId', function (req, res) {
        // Prepare output in JSON form at
           //console.log(req.body);
		  //console.log("session data"+JSON.stringify(sess.result[0].customerId));
         var dealerId = req.query.dealerId
		 /* var orderType = req.body.orderType
		 var fDate = req.body.fDate
		 var tdate = req.body.tDate */

           //console.log("dealer ID from view"+dealerId)
           
		      collection1.aggregate([
                     {
                          $lookup:
                                {
                                    from: "invoiceDetails",
                                    localField: "invoiceNo",
                                    foreignField: "invoiceNo",
                                    as: "order_response"
                                }
                     },
                    {
                      $match:
                      {
                        dealerId: dealerId
                      }
                    }],function(err,result){
						 
						 if(err)
                           {
							   response={
		                        "output":"error"
		                          }
                                res.send(response);
                               //console.log(JSON.stringify(response));
                           }
                        else
                           {
							   
				             response={
		             
					            "output":result
					 
		                          }
					// console.log(JSON.stringify(response));
                                res.send(response);
                             
                           }  
			  
           }); 
			  		                
 });

 
 app.get('/getInvoieDetailsById', function (req, res) {
   //console.log("req",req);
   var invoiceNo = req.query.invoiceNo;
   var response ={};
   invoiceCollection.aggregate([{
         $lookup: {
           from: "order",
           localField: "invoiceNo",
           foreignField: "invoiceNo",
           as: "order"
         }
       },
       {
         $unwind: "$order"
       },
       {
         $lookup: {
           from: "dealer",
           localField: "order.dealerId",
           foreignField: "dealerId",
           as: "dealerDetails"
         }
       },
       {
         $unwind: "$dealerDetails"
       },
       {
         $match: {
           'invoiceNo': invoiceNo
         }

       }

     ],function(err,result){
       response = {invoiceData:result};
       collection2.aggregate([
      {
           $lookup:
                 {
                     from: "products",
                     localField: "productId",
                     foreignField: "productId",
                     as: "product_response"
                 }
  
      }, { $match: {
        'orderId':result[0].order.orderId
      }}],
     function (err, result) {

       if (err) {
         response = {
           "output": err.message
         }
         res.send(response);
       } else {
        response.product_response=result;
         response = {

           "output": response

         }
//console.log(response);
         res.send(response);

       }

     });

 });
});
 
 
 //*=======================retrive Order Details with Products==========================================*//

 app.get('/getAllProductsBySpecifiedId', function (req, res) {
        
         var orderId = req.query.orderId
		 
           console.log(orderId)
           
		      collection2.aggregate([
                     {
                          $lookup:
                                {
                                    from: "products",
                                    localField: "productId",
                                    foreignField: "productId",
                                    as: "product_response"
                                }
                     },
                    {
                      $match: {
                        orderId: orderId
                      }
                    }],function(err,result){
						 
						 if(result)
                           {
				             response={
		             
					            "output":result
					 
		                          }
					 
                                res.json(response);
                                //console.log(JSON.stringify(response));
                           }
                        else
                           {
                             response={
		                        "output":"error"
		                          }
                                res.json(response);
                           }  
			  
           }); 
			  

			  
          /* collection2.find({ "orderID":orderID }).toArray(function(err,result)
           {
             if(err)
              {
                response={
		            "output":error
		             }
                res.json(response);
                
              }
             else
              {
                response={
		            "output":result
		             }
                res.json(response);
                console.log(JSON.stringify(response));
              }
           });  
		   */			  
 });
 
 app.get('/logout',function(req,res)
	   {
         req.session.destroy(function(err) 
		 {
           if(err) 
		   {
             console.log(err);
           } 
		   else 
		   {
               res.redirect('/index');
	           //res.render('index.html');

           }
         });

       });

 
 
  }
});	

module.exports = app

app.listen(port, function () {
console.log("app listening on : "+port)
})
