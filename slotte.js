//ここからスロットエリア
var slotte_history = localStorage;
var timer = null;

function spin(number){
  var number_field = $("#number-field");
  var num = Math.ceil(Math.random() * number);
  if(slotte_history.getItem(num) == null){
  number_field.html(num);
  }
}

function slotte(){
  if(timer != null){
    clearInterval(timer);
    timer = null;
    var number = $("#number-field").html();
    slotte_history.setItem(number, "selected");
    //ストップ時のナンバーを送信
    receiveNumber(number);
    }
  else{//スロットを始める
    timer = setInterval("spin(75)", 60);
    //開始処理を送信
  }
}

$(function(){
  $("#start-button").on('click', function(){
    slotte();
  });
});

$(function(){
  $("#clear-button").on('click', function(){
    slotte_history.clear();
    alert("Local Storage was cleared");
  })
})

//ここまで

//ここからビンゴエリア

//ビンゴカード用配列の取得
//順番はバラバラ
//非推奨
function makeBingoArray(number){
  var array = []

  while(array.length != 25){
    var n = Math.ceil((Math.random() * number));
    if(array.indexOf(n) == -1){
      array.push(n);
    }
  }
  return array;
}

//ビンゴカード用配列の取得
//順番はビンゴのルールに則る
function makeBingoArray(){
  var array = []
  var  i = 0;
  while(i<5){
    var j = 0;
    while(j<5){
      var n = Math.ceil((Math.random() * 15)) + 15 * j;
      if(array.indexOf(n) == -1){
        array.push(n);
        j++;
      }
    }
    i++;
  }
  return array;
}

var icons = ["circle","square","circle-o","square-o","star-o"]

//ビンゴ用テーブルの作成メソッド
function makeTable(b_table,b_numbers){
  b_table.empty();
  //var b_numbers = makeBingoArray();
  for(var i = 0; i < 5; i++){
    var b_row = $("<tr></tr>");
    for(var j = 0; j < 5; j++){
      var b_column = $("<td></td>");
      b_column.addClass("bingo-panel");
      b_id = "b-" + b_numbers[5 * i + j];
      b_column.attr("id", b_id);
      if(localStorage.getItem(b_id)!=null){
        b_column.addClass("bingo-hit");
      }
      if(i == 2 && j == 2){
        b_column.html("<i class='fa fa-star'></i>")
        b_column.addClass("bingo-hit");
      }
      else{
      b_column.html( b_numbers[ 5 * i + j] + "<br><i class='fa fa-"+icons[Math.ceil(Math.random()*icons.length)-1]+"' aria-hidden='true'></i>");
      }
      b_row.append(b_column);
    }
    b_table.append(b_row);
  }
  //localStorage.setItem("table", b_table.html());
}

//ロード時の処理
$(function(){
  //以前のバージョンのストレージが残っていたら消去
  var version="v-1.2.4"
  if(localStorage.getItem(version)==null){
    localStorage.clear();
    localStorage.setItem(version,"set");
  }
  var b_table = $("#bingo-table");
  var card = localStorage.getItem("table");
  if(card != null){//すでにローカルストレージに登録されている場合
    makeTable(b_table, card.split(","));
  }
  else{
    var card = makeBingoArray();
    makeTable(b_table, card);
    localStorage.setItem("table",card);
  }
});
//$(document).on('load',function(){
function coloredTable(){
  for(var i = 0 ; i < localStorage.length; i++){
    $("#" + localStorage[i]).addClass("bingo-hit"); 
  };
}
//});


$(function(){
  $("#shuffle-button").on('click',function(){
    makeTable($("#bingo-table"));
  });
})


//受信処理をここに書く
function receiveNumber(number){
	var id = "#b-" + number;
	if($(id).length > 0){
		$(id).addClass("bingo-hit");
	}
}

$(function(){
	//ビンゴパネルが押された場合の処理
	$(".bingo-panel").on('click', function(){
		if($(this).hasClass("bingo-hit")){
			//押し間違い対策
			$(this).removeClass("bingo-hit");
      localStorage.removeItem($(this).attr("id"));
			return;	
		}
		$(this).addClass("bingo-hit");
    localStorage.setItem($(this).attr("id"), $(this).attr("id"));
	});
});


