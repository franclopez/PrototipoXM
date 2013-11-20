$(function() {
            
            /********Init Connection with kinvey Back End********/
           var promiseInit = Kinvey.init({
                appKey    : 'kid_PVvB5PRZEi',
                appSecret : '5ba92a5b5d7e40949f84a445b747eaf4'
            });
            promiseInit.then(function(activeUser) {
                var promisePing = Kinvey.ping();
                promisePing.then(function(response) {
                  console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
                }, function(error) {
                  console.log('Kinvey Ping Failed. Response: ' + error.description);
                });
            }, function(error) {
               loginError.text('Problemas conectando con el backend. Por favor intente mas tarde');
            });
            
            /************ login ************/
            var loginForm = $('#login_form');
            var loginError =  $('#login_error');
            console.log("Log In");
            loginForm.on('submit', function(e) {
                e.preventDefault();
                loginError.text('');
                $.mobile.loading('show');
                var usernameField = loginForm.find('[name="username"]');
                var username = $.trim(usernameField.val());
                var passwordField = loginForm.find('[name="password"]');
                var password = $.trim(passwordField.val());
    			console.log("Autenticando usuario...");
                console.log(username);
                console.log(password);
                var user = Kinvey.getActiveUser();
                
				Kinvey.User.logout({
						success: function() {
							console.log("Desconectando");
						},
						error: function(e) {
							console.log("Usuario no conectado");
						}
				});
				
				Kinvey.User.login(username, password, {
						success: function() {
						console.log("Loggeado.");
							loginForm.removeClass('loading');
							$.mobile.loading('hide');
							usernameField.val(''); //clear fields
							passwordField.val('');
							$.mobile.changePage('#menu'); //change to menu page
						},
						error: function(error){
							console.log(error);
							$.mobile.loading('hide');
							loginError.text('Por Favor Ingrese Un Usuario y Contraseña Válidos');
						}
				 });
				 return false;
            });
            
            //Logout
			
			$("#logout").click(function () {
                console.log("Logging out");
                var user = Kinvey.getActiveUser();
                if (null !== user){
                    Kinvey.User.logout({
                        success: function() {
                            $.mobile.changePage('#logon'); 
                        },
                        error: function(e) {
                            $.mobile.changePage('#logon'); 
                        }
                    });
                }
            });
			
			//Menu Page
			$(document).on("pageshow", "#menu", function () {
				var user = Kinvey.getActiveUser();
				console.log(user);
				var txtBienv = "Bienvenido: " + user.first_name + " " + user.last_name;
				$('#bienvenidaText').text(txtBienv);
				console.log(txtBienv);
			});
			
			//Busqueda de requerimientos
			$(document).on("pageinit", "#requerimientosBusqueda", function () {
				console.log("pageinit del requerimientosBusqueda");
				var promise = Kinvey.DataStore.find('EstadosRequerimiento', null, {
					success: function(items) {
					   var list = $("#reqBusEstReq");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				  });
                  var promise2 = Kinvey.DataStore.find('TiposRequerimiento', null, {
    				success: function(items) {
					   var list = $("#reqBusTipReq");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				  });
            });
			
			$(document).on("pageshow", "#requerimientosBusqueda", function () {
					console.log("pageshow del requerimientosBusqueda");
			});
			
			            
            //Busqueda de Fronteras
    		$(document).on("pageinit", "#fronterasBusqueda", function () {
				var promise = Kinvey.DataStore.find('TiposFrontera', null, {
					success: function(items) {
					   var list = $("#fronBusFronTipo");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				});
				var promise2 = Kinvey.DataStore.find('NivelesTension', null, {
    				success: function(items) {
					   var list = $("#fronBusNivTension");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Descripcion, item.Id));
					   });
					}
				});
                var queryDpto = new Kinvey.Query();
                queryDpto.ascending('NombreDepartamento');
                var promiseDepto = Kinvey.DataStore.find('Departamentos', queryDpto, {
    				success: function(items) {
					   var list = $("#fronBusDepartamento");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.NombreDepartamento, item.IdDepartamento));
					   });
					}
				});
			});
            
            $('#fronBusDepartamento').change(function() {
			  $.mobile.loading('show');
			  var query = new Kinvey.Query();
              query.ascending('NombreCiudad');
			  query.equalTo('IdDepartamento', this.value);
              $("#fronBusCiudad").empty();
              $("#fronBusCiudad").append(new Option("Seleccione...", ''));
              $("#fronBusCiudad").selectmenu('refresh');              
			  $("#fronBusCiudad").prop('selectedIndex', 0);
              var promiseCiudad = Kinvey.DataStore.find('Ciudades', query, {
    				success: function(items) {
					   var list = $("#fronBusCiudad");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.NombreCiudad, item.IdCiudad));
					   });
					   $.mobile.loading('hide');
					}
				});
			});
			
			//Realizar Busqueda de Requerimientos
            $("#reqBusSearch").click(function () {
                 $.mobile.loading('show');
                 console.log("Buscando requerimientos....");
                 $.mobile.changePage('#detalleRequerimiento');
                 $.mobile.loading('hide');
            });
            
            
            //Realizar Busqueda de Fronteras
            $("#fronBusSearch").click(function () {
                 $.mobile.loading('show');
                 console.log("Buscando fronteras....");
                 $.mobile.changePage('#detalleFronteras');
                 $.mobile.loading('hide');
            });
});		
