$(function() {
            
            /********Init Connection with kinvey Back End********/
           var promise = Kinvey.init({
                appKey    : 'kid_PVvB5PRZEi',
                appSecret : '5ba92a5b5d7e40949f84a445b747eaf4'
            });
            promise.then(function(activeUser) {
                var promisePing = Kinvey.ping();
                promisePing.then(function(response) {
                  console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
                }, function(error) {
                  console.log('Kinvey Ping Failed. Response: ' + error.description);
                });
            }, function(error) {
               
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
                    Kinvey.User.logout({
                    });
                }       
                Kinvey.User.login(username, password, {
                    success: function() {
                        loginForm.removeClass('loading');
                        usernameField.val(''); //clear fields
                        passwordField.val('');
                        $.mobile.changePage('#menu'); //change to menu page
                        var user = Kinvey.getActiveUser();
                        console.log(user);
                        var txtBienv = "Bienvenido: " + user.first_name + " " + user.last_name;
                        $('#bienvenidaText').text(txtBienv);
                        console.log(txtBienv);
                    },
                    error: function(error){
                        console.log(error);
                        loginForm.removeClass('loading');
                        loginError.text('Por Favor ingrese un usuario y contraseña validos');
                    }
                });
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
        });