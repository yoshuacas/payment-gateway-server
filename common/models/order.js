module.exports = function(Order) {

	Order.pay = function(countryCode, msisdn, amount, merchantId, isTrusted, res, cb) {

		var TigoPaymentGateway = Order.app.dataSources.tigoPaymentGateway;
		var tigoPaymentGatewayAuth = Order.app.dataSources.tigoPaymentGatewayAuth;


		if (isTrusted){
			var authCredentials = "d3lGcmZ3SlB1dmV5OWdDV1VwRDB1SmhJQUdpMEttbnI6MXV5UUl2SjJZNUZSdkpMVQ==";
		}else {
			var authCredentials = "R1lQM2p5MzlOM1RwTGFUNk9IQzJYaDNRdW1MeFF0akI6WllESDZwYklvN0Nic0g2VQ=="; 
		}
		

		TigoPaymentGateway.postToken(authCredentials, function (error, response, context){
			if (error) {
				console.log (error);
				return cb (error);
			}

			var tokenResult = JSON.parse(response);
			console.log (tokenResult);

			if (!tokenResult.accessToken) return cb ("accessToken not received");

			var txnId = String(new Date().getTime());
			txnId = txnId.substring(0, 10);

			var body = {

				"MasterMerchant":
				{
					"account":merchantId,
					"pin":"0000",
					"id":"PaymentGatewayH"
				},
				"Merchant":
				{
					"reference":"Merchant " +merchantId,
					"fee":"00.00",
					"currencyCode":"USD"
				},
				"Subscriber":
				{
					// "account":"78758838",
					// "countryCode": "503",
					"account":msisdn,
					"countryCode": countryCode,
					"country":"SLV",
					"firstName":"",
					"lastName":"",
					"emailId" :""
				},
				"redirectUri":"http://localhost:9000/#/result",
				"callbackUri":"http://localhost:3000/api/callback",
				"language":"esp",
				"terminalId":"Postman",
				"OriginPayment":
				{
					"amount":amount,
					"currencyCode":"USD",
					"tax":"0.00",
					"fee":"0.00"
				},
				"exchangeRate":"1.00",
				"LocalPayment":
				{
					"amount":amount,
					"currencyCode":"USD"
				},
				"merchantTransactionId":txnId

			};

			tigoPaymentGatewayAuth.postAuth (tokenResult.accessToken, body, function (error, response, context){
				if (error) return cb (error);
				

				console.log(response);
				return cb(null, response);
			});

		});


	};


	Order.remoteMethod(
		'pay',
		{
			accepts: [
				{arg: 'countryCode', type: 'string', required: true},
				{arg: 'msisdn', type: 'string', required: true},
				{arg: 'amount', type: 'string', required: true},
				{arg: 'merchantId', type: 'string', required: true},
				{arg: 'isTrusted', type: 'boolean', required: true},

			    {arg: 'res', type: 'object', http: { source: 'res' }}
			],
			returns: {arg: 'token', type: 'object'}
		}
	);


	// Order.afterRemote( 'pay', function( ctx, next) { 
	// 	// var res = ctx.res;
	// 	// var redirectUrl = ctx.result.token.redirectUrl;
	// 	 console.log (ctx.result);
 // 	// 	res.redirect(redirectUrl);
 // 		next();
	// });



};
