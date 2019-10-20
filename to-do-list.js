{
	var allData;//Magic variable

	$('#registration').click(
		function(){
			signup();
			$('#log_container').slideUp();
			$('#list_container').css('visibility', 'visible');
		}
	);

	$('#connection').click(
		function(){
		login();
		$('#log_container').slideUp();
		$('#list_container').css('visibility', 'visible');
	});

	$('#list_creation').click(
	function(){
		$('#list_creation').hide();
	});
	


	function signup(){
		var newLogin = $('[name="new_login"]').val();
		var newPassword = $('[name="new_password"]').val();
		$.ajax({
			url: 'http://92.222.69.104/todo/create/' + newLogin + '/' + newPassword
		}).done(function(data){
			allData = data;
			$('#welcome').html('Bienvenue ' + newLogin);
			$.ajax({
				url: 'http://92.222.69.104/todo/listes',
				headers: {'login' : newLogin, 'password' : newPassword}
			}).done(function(data){
				getLists(data);
			});
		})
		
	}

	function login(){
		var login = $('[name="login"]').val();
		var password = $('[name="password"]').val();
		$.ajax({
			url: 'http://92.222.69.104/todo/listes',
			headers: {'login' : login, 'password' : password}
		}).done(function(data){
			allData = data;
			$('#welcome').html('Bienvenue ' + login);
			getLists(data);
		});	
	}

	function getLists(data){
		for(i = 0; i < data.todoListes.length; i++)
		{
			var name = data.todoListes[i].name;
			$('#list_display').append('<ul class="post_it" id="list_' + i + '">' + name + '</ul>');
			for(j = 0; j < data.todoListes[i].elements.length; j++)
			{
				var item = data.todoListes[i].elements[j];
				$('#list_' + i).append('<li>' + item + '</li>');
			}
			$('#list_' + i).append('<button class="add_input">Ajouter item</button>');
		}
		$('.add_input').click(function(event){
			$('<input type="text" id="add_item"/>').insertBefore(event.target, null);
			$('<button id="send_input">OK</button>').insertBefore(event.target, null);
			$('#send_input').click(function(event){
				event.preventDefault();
				addItem();
			});
		});
		
		
	}

	function addItem(){
		var newItem = $('#add_item').val();
		//Write newItem in JSON
		allData.todoListes[1].elements.push(newItem);
		//Insert newItem into DOM
		$('#list_1').append('<li>' + newItem + '</li>');
		//Send newItem to server
		$.ajax({
			method: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'http://92.222.69.104/todo/listes',
            data: JSON.stringify(allData)
        })
	}
}