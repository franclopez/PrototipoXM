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
                
                //flood control
                if(loginForm.hasClass('loading')) {
                    return false;
                }
                loginForm.addClass('loading');
                
                var usernameField = loginForm.find('[name="username"]');
                var username = $.trim(usernameField.val());
                var passwordField = loginForm.find('[name="password"]');
                var password = $.trim(passwordField.val());
                console.log(username);
                console.log(password);
                var user = Kinvey.getActiveUser();
                if (null !== user){
                    $.mobile.changePage('#menu'); //change to menu page
                }
    			else {
					Kinvey.User.login(username, password, {
						success: function() {
							loginForm.removeClass('loading');
							usernameField.val(''); //clear fields
							passwordField.val('');
							$.mobile.changePage('#menu'); //change to menu page
						},
						error: function(error){
							console.log(error);
							loginForm.removeClass('loading');
							loginError.text('Por Favor ingrese un usuario y contraseña validos');
						}
					});
				}
                return false;
            });
            
            //Logout
             var button = document.getElementById('logout');
             button.addEventListener('click', function() {
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
			$(document).on("pageinit", "#menu", function () {
				var user = Kinvey.getActiveUser();
				console.log(user);
				var txtBienv = "Bienvenido: " + user.first_name + " " + user.last_name;
				$('#bienvenidaText').text(txtBienv);
				console.log(txtBienv);
			});
			
			//Busqueda de requerimientos
			$(document).on("pageinit", "#requerimientosBusqueda", function () {
				var promise = Kinvey.DataStore.find('EstadosRequerimiento', null, {
					success: function(items) {
					   var list = $("#RevStatus");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				  });
                  var promise2 = Kinvey.DataStore.find('TiposRequerimiento', null, {
    				success: function(items) {
					   var list = $("#ReqType");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				  });
            });
            
            //Busqueda de Fronteras
    		$(document).on("pageinit", "#fronterasBusqueda", function () {
				var promise = Kinvey.DataStore.find('TiposFrontera', null, {
					success: function(items) {
					   var list = $("#FronteraType");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Nombre, item.Id));
					   });
					}
				});
				var promise2 = Kinvey.DataStore.find('NivelesTension', null, {
    				success: function(items) {
					   var list = $("#nivelTension");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.Descripcion, item.Id));
					   });
					}
				});
                var queryDpto = new Kinvey.Query();
                queryDpto.ascending('NombreDepartamento');
                var promiseDepto = Kinvey.DataStore.find('Departamentos', queryDpto, {
    				success: function(items) {
					   var list = $("#departamento");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.NombreDepartamento, item.IdDepartamento));
					   });
					}
				});
			});
            
            $('#departamento').change(function() {
			  var query = new Kinvey.Query();
              query.ascending('NombreCiudad');
			  query.equalTo('IdDepartamento', this.value);
              $("#ciudad").empty();
              $("#ciudad").append(new Option("Seleccione...", ''));
              $("#ciudad").selectmenu('refresh');
              $("#ciudad").prop('selectedIndex', 0);
              var promiseCiudad = Kinvey.DataStore.find('Ciudades', query, {
    				success: function(items) {
					   var list = $("#ciudad");
					   $.each(items, function(index, item) {
						  list.append(new Option(item.NombreCiudad, item.IdCiudad));
					   });
					}
				});
			});
            
});		
