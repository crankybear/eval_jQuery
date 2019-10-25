$('.hoverzoom').hover(function(){
	$(this).addClass('zoom');
            
    }, function() {
        $(this).removeClass('zoom');
 });

$('#connection').click(connection);
$('#registration').click(connection);

//Global variables for getting essential ids
var listId = 0;
var listItemId = 0;

function connection(){
	$('#welcome').css('display', 'inline-flex');
	$('#welcome').show();
	var wayOfConnection = $(this).attr('id');
	var login = $('[name="login"]').val();
	var password = $('[name="password"]').val();
	var newLogin = $('[name="new_login"]').val();
	var newPassword = $('[name="new_password"]').val();
	var allData;

	if(wayOfConnection === 'connection')
	{
		$.ajax({
			url: 'http://92.222.69.104/todo/listes',
			headers: {'login' : login, 'password' : password}
		}).done(function(data){
			$('#log_container').slideUp();
			allData = data;
			$('#welcome').prepend('<h2>Bienvenue ' + login + '!</h2>');
			getLists(data);
		});
	}
	else
	{
		$.ajax({
			url: 'http://92.222.69.104/todo/create/' + newLogin + '/' + newPassword
		}).done(function(data){
			allData = data;
			$('#welcome').prepend('<h2>Bienvenue ' + newLogin + '!</h2>');
			$.ajax({
				url: 'http://92.222.69.104/todo/listes',
				headers: {'login' : newLogin, 'password' : newPassword}
			}).done(function(data){
				$('#log_container').slideUp();
				getLists(data);
			});
		})
	}

	function getLists(data){
		var listContainer = $('#list_container');
		var allInOne = data.todoListes;

		//Display list name
		//Add lots of "data" attributes in order to catch them later out of loops
		for(let i = 0; i <allInOne.length; i++)
		{
			var listName =allInOne[i].name;
			$('#list_display').append('<ul class="post_it" id="list_' + i + '"><img class="pin" src="pin-wallpaper-tiny.jpg" ><h2 id="title_' + i + '">' + listName + '</h2></ul>');
			var item = allInOne[i]['elements'];
			var currentList = $('#list_' + i);
			var currentListH2 = $('#list_' + i + ' > h2');
			currentListH2.append('<button class="delete_list" data-listname="' + listName + '" data-h2title="title_' + i + '" id="kill_list_' + i + '">X</button>');
			//Display all items from current list
			for(let j = 0; j < item.length; j++)
			{
				currentList.append('<li id="list_' + i +'-item_' + j +'">' + item[j] + '</li>');
				$('#list_' + i +'-item_' +j).append('<button data-index="' + j + '" class="delete" id="item_btn_' + j + '_list_' + i + '" data-liname="' + listName + '">X</button>');
				$('#item_btn_' + j + '_list_' + i).click(killItem);
				listItemId++;
			}

			//Insert control buttons(add/delete)
			currentList.append('<div id="add_div_' + listId + '"></div>');
			$('#add_div_' + listId).after('<button class="insert" data-adding="' + i + '" id="add_item_' + i + '">+</button>');
			$('#kill_list_' + i).click(killList);
			$('#add_item_' + i).click(addItem);
			listId++;
		}

		$('#list_creation').click(addList);
	}

	function addList(){
		$('#list_container').prepend('<div class="post_it" id="new_list"></div>');
		$('#new_list').append('<div id="temp_list"></div>');
		$('#temp_list').append('<label>Nom de la liste</label>');
		$('#temp_list').append('<input type="text" id="new_list_name"/>');
		$('#temp_list').append('<button id="sendNewList">Valider</button>');
		$('#sendNewList').click(function(event){
			event.preventDefault();
			sendList();
		});
	}

	function addItem(){
		var addButtonId = $(this).data('adding');
		$('#add_item_' + addButtonId).before('<input type="text" id="new_item_' + addButtonId + '">');
		$('#add_item_' + addButtonId).fadeOut();
		$('#new_item_' + addButtonId).after('<button data-sending="' + addButtonId + '" id="send_item_' + addButtonId + '">Send</button>');
		$('#send_item_' + addButtonId).click(sendItem);
	}

	function sendList(){
		var newListName = $('#new_list_name').val();
		//Insert list & prepare object structure
		allData.todoListes.push({
			'name' : newListName, 
			'elements' : []
		});
		$('#list_display').append('<ul class="post_it" id="list_' + listId + '"><img class="pin" src="pin-wallpaper-tiny.jpg"><h2 id="title_' + listId + '">' + newListName + '</h2></ul>');
		saveChanges();
	}

	function sendItem(){
		var listId = $(this).data('sending');
		var newItem = $('#new_item_' + listId).val();
		console.log(newItem);
		allData.todoListes[listId].elements.push(newItem);
		$('#send_item_' + listId).before('<li>' + newItem + '</li>');
		var inputField = $('#new_item_' + listId);
		inputField.fadeOut();
		$(this).hide();
		saveChanges();
	}

	function killList(){
		var listToKillId = $(this).data('h2title');
		var listToKill = $('#' + listToKillId).html();
		var listToKillName = $(this).data('listname');

		for(i = 0; i < allData.todoListes.length; i++)
			if(allData.todoListes[i].name == listToKillName)
				allData.todoListes.splice([i], 1);

		$('#' + listToKillId).parent().slideUp();
		saveChanges();
	}

	function killItem(){
		var listItemToKill = $(this).data('liname');
		var index = $(this).data('index');
		for(j = 0; j < allData.todoListes.length; j++)
			if(allData.todoListes[j].name == listItemToKill)
				allData.todoListes[j].elements.splice([index], 1);

		var itemToKill = $(this).parent().attr('id');
		$('#' + itemToKill).slideUp();
		saveChanges();
	}

	 function saveChanges() {
        $.ajax({
            url: 'http://92.222.69.104/todo/listes',
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(allData),
            success: function(data){
            	console.log('Bravo');
            },
            error: function(){
            	console.log('Fail');
            }
        }).done(function(){
        	$('#new_list').remove();
        	$('#list_display').remove();
		 	$('#list_container').append('<div id="list_display"><div>');
		 	getLists(allData);
	 		});
    };
        
}