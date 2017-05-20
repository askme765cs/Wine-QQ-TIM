var gSchListIdx = -1;
var gLastSchKey = '';
var gPosInSchList = 0;

function GetSchGames(){
	return gSchBarGames;
}

function AutoComplete(key) {
	key = $.trim(key);
	var foundGames = new Array();
	SearchByKey(key, foundGames);
	var html = GetFullSchList(foundGames);
	$('.sch_for').html('');
	$('.sch_for').html(html);
	if (!html){
		$('.jQ_schLay').hide();
	}else{
		$('.jQ_schLay').show();
	}
}

function GetFullSchList(games){
	var n = games.length;
	var htmlLst = '';
	for (var i=0; i<n; i++){
		htmlLst += GetASchList(games[i]/*.name*/, /*games[i].appID*/0);		
	}
	return htmlLst;
}

function AdjustStringLen(str, lenMax, lenKeep){
	str = str.replace(/\s+$/, ''); // 去掉末尾的空白字符

    if (str.length > lenMax){
	    return str.substr(0, lenKeep) + '...';
	}
	return str;
}

function GetASchList(name, appID){
	name = AdjustStringLen(name, 10, 10);
	var fmtStr = '<dd><a href="#">{appName}</a></dd>';
	fmtStr = fmtStr.replace(/{appName}/, name);
	return fmtStr;
}

function SearchByKey(key, foundGames){
	var games = GetSchGames();
	var n = games.length;
	var htmlLst = '';
	for (var i=0; i<n; i++){
		if (IsKeyMatched(games[i], key)){
			foundGames.push(games[i].name/*{"name" : games[i].name, "appID" : games[i].appID}*/);
			if(foundGames.length >= 10){ // enough
				return;
			}
		}
	}
}

function IsKeyMatched(item, key){
	if (!key){
		return false;
	}
	key = key.toLowerCase();
	var name = item.name.toLowerCase();
	if (-1 != name.indexOf(key)){ // 普通匹配
		return true;
	}

	// For IE...
	var aKey = key.split('');
	var aFpy = item.fpy.split('');
	var aFpyB = item.fpb;
	var startPos = 0;
	for (var i=0; i<aFpyB.length; i++){
		startPos = aFpyB[i];
		if (aFpy[startPos] == aKey[0]){
			break;
		}
	}
	if (i == aFpyB.length){ // 首字母非边界
		return false;
	}	
	
	var fpyLen = aFpy.length;
	var runLen = aFpy.length-aKey.length+1;
	var keyLen = aKey.length;
	var offset = 0;
	for (var i=startPos; i<runLen; i++){
		offset = i;
		var oldOffset = 0;
		var isLastBorder = 0;
		for (var j=0; j<keyLen && offset<fpyLen; j++){
			if (aFpy[offset] == aKey[j]){
				oldOffset = offset;
				isLastBorder = 0;
				++offset;
				continue;
			}else if (j > 0){// 查看上一个字母是否边界
				var lastIdx = GetLastBorderPos(aFpyB, offset-1)
				if (aFpyB[lastIdx]==offset-1 && lastIdx<aFpyB.length-1){
					offset += aFpyB[lastIdx+1] - aFpyB[lastIdx] - 1;
					if (aKey[j] == aFpy[offset]){
						isLastBorder = 1;
						++offset;
						continue;
					}
				}
			}
			
			// 没匹配上，视情况回溯一下
			if (!isLastBorder && j>1)
			{
				offset = oldOffset;
				--j;

				var lastIdx = GetLastBorderPos(aFpyB, offset-1)
				if (aFpyB[lastIdx]==offset-1 && lastIdx<aFpyB.length-1){
					offset += aFpyB[lastIdx+1] - aFpyB[lastIdx] - 1;
					if (aKey[j] == aFpy[offset]){
						isLastBorder = 1;
						++offset;
						continue;
					}
				}
			}

			break;
		}
		if(j==aKey.length){
			break;
		}
	}
	return (i < runLen);
}
// pos 处于第几个词内
function GetLastBorderPos(fpb, pos){
	var len = fpb.length;
	for(var i=0; i<len; i++){
		if (pos <= fpb[i]){
			break;
		}
	}
	return i;
}


function SelectKey(){
	$('.sch_for dd').removeClass('on');
	$('.sch_for dd').eq(gSchListIdx).addClass('on');
	$('#jQ_schInput').val($('.sch_for dd').eq(gSchListIdx).text());
}

function SchUp(){
	var len = $('.sch_for dd').length;
	if (-1 == gSchListIdx && len <= 0){
		return;
	}else if (-1 == gSchListIdx || 0 == gSchListIdx){
		gSchListIdx = len;
	}
	if(--gSchListIdx < 0){
		gSchListIdx = len-1;
	}
	SelectKey();
}

function SchDown(){
	var len = $('.sch_for dd').length;
	if (-1 == gSchListIdx && len <= 0){
		return;
	}else if (-1 == gSchListIdx || len-1 == gSchListIdx){
		gSchListIdx = -1;
	}
	
	if(++gSchListIdx >= len){
		gSchListIdx = 0;
	}
	SelectKey();
}

function HandleSpecialKey(key) {
	var specialKeys = {"27王" : "二七王", "510k" : "五十K", "510K" : "五十K", "240" : "二百四"};
	if (specialKeys[key]) {
		return specialKeys[key];
	}
	return key;
}

function DoSearchFromBar(){
	var key = $('#jQ_schInput').val();
	key = $.trim(key);
	var hintStr = '查找游戏（例如“欢乐斗地主”）';
	if (key == hintStr){
	    key = '';
	}else{
		key = key.replace(/\.\.\.$/, '');
	}
	if (key == '' || key.match(/^\s+$/)){
		return;
	}
	key = HandleSpecialKey(key);
	window.external.CallClient("DoSearch", encodeURI(key));
	$('.jQ_schLay').hide();
}

// reg
mousedownHappened  = false;
function InitSearchBar(doSearch){
    if (!doSearch){
        doSearch = DoSearchFromBar;
    }
	var hintStr = '查找游戏（例如“欢乐斗地主”）';

	$('.jQ_schInput').click(function(){

		mousedownHappened  = true;
	    setTimeout(function() {mousedownHappened  = false;}, 100);
		
		if ($(this).val() == hintStr){		   
	       $(this).val('');
		   $(this).css('color', 'black');
		   return;
		}

		if ($(this).val() != "")
		{
			AutoComplete($(this).val());
		}
	})

	.keyup(function(e){
		var schKey = $('.jQ_schInput').val();

		var key = e.keyCode;
		if (key<20 && key!=13 && key!=8){
			return;
		}
	    if (key == 13) {
			if(gLastSchKey == schKey){//enter
				doSearch();
			}else{
				AutoComplete(schKey);
			}
	    }else if (key == 38){
	    	SchUp();
	    }else if (key == 40){
	    	SchDown();
	    }else{
			AutoComplete(schKey);
	    }
		gLastSchKey = $('.jQ_schInput').val();
	})
	.blur(function(){
	    if ($(this).val() == '' ){
			if(!mousedownHappened)
			{
				$(this).val(hintStr);
				$(this).css('color', 'grey');
			}
		}
		if (0 == gPosInSchList){
			$('.jQ_schLay').hide();
		}else{
			gPosInSchList = 0;
		}
	});

	$('#jQ_schButton').click(function(){
	    doSearch();
	});	
		
	$('.jQ_schLay').click(function(e){
		$('.jQ_schInput').val($(e.target).text());
	    // to do [ML]
		// to confim whether to jmp to detailed page
		doSearch();		
	})
	.mouseover(function(e){
		$(e.target).addClass('on');
		$('.sch_for dd').eq(gSchListIdx).removeClass('on');
		gSchListIdx = $('.sch_for dd').index($(e.target));
		gPosInSchList = 1;
	})
	.mouseout(function(){
		gPosInSchList = 0;
	});
}
/*  |xGv00|fa933254149e9903825a14d22429eb86 */