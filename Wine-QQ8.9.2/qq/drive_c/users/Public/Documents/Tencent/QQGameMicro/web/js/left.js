//___________________myGame Relative Begin________________________________
var MyGameRequestInterval;  // 超时定时器
var RequestAppFailedReason = 0;  // 0拉取详情超时，1客户端拉取AppId list超时
var timeoutMillSeconds     = 10000;
var myAppList = new Array();
var haveGotMyAppList = false;
// on get my applist
function OnGetMyAppList(data)
{
	if(haveGotMyAppList)
	{
		return;
	}
	
	haveGotMyAppList = true;
    if(data == "")
    {
		clearTimeout(MyGameRequestInterval);
        $(".no_game").attr("style", "");
		$(".pp_lst").attr("style", "display:none");
        $(".loading").attr("style","display:none");
		$(".NetDisconnect").attr("style","display:none");
    }
    else
    {
		$listWrapper = $('<ul class="pp_lst" style="display:none"></ul>');
		$addItem = $(".add").clone();
		$listWrapper.append($addItem);
		$(".my_list").append($listWrapper);
		myAppList = data.split(",");
		//alert(myAppList);
		RequestAppDetails(data, "DetailsForMyGame");
    }	
}

// request app details
function RequestAppDetails(appids, source)
{
	var param = appids + '|' + source;
	window.external.CallClient("RequestAppDetails", param);
}

// 拉取mygame超时
function OnMyGameRequestTimeout()
{
	clearTimeout(MyGameRequestInterval);
    $(".no_game").attr("style", "display:none");
	$(".pp_lst").attr("style", "display:none");
    $(".loading").attr("style","display:none");
	$(".NetDisconnect").attr("style","");
}

// 重试拉取myApp数据
function RetryRequestMyApp()
{
	$(".no_game").attr("style", "display:none");
	$(".pp_lst").attr("style", "display:none");
	$(".NetDisconnect").attr("style","display:none");
	$(".loading").attr("style","");
	MyGameRequestInterval = setInterval(OnMyGameRequestTimeout, timeoutMillSeconds); 
	window.external.CallClient("RetryRequestMyApp");
}

// total online
function OnGetTotalOnline(online)
{
	$(".jQ_onlineNow").text(online);
}

// app online
function RequestOnline(appIds)
{
	window.external.CallClient("RequestOnline", appIds);
}

// delete app
function DeleteApp(appid)
{
	if ($('.MyGameExistFlag_' + appid).length <= 0)
	{
		return;
	}
	
	if($('.MyGameItem').length == 1){
		$(".no_game").attr("style", "");
		$(".pp_lst").attr("style", "display:none");
	}

	var count =  $(".myGameCount").text();
	$(".myGameCount").text(parseInt(count) -1);
	$('.MyGameExistFlag_' + appid).remove();
}

function getTheIndexOfAppID(appId)
{
	//alert(myAppList.length);
	for(var i = 1; i <= myAppList.length; i++)
	{
		if(appId == myAppList[i-1])
		{
			return i;
		}
	}
	return -1;
}


// add a item
function AddMyGameItemOnWeb(ID, Url, Name, AppType)
{
	if($(".pp_lst").length <= 0)
    {
       	$listWrapper = $('<ul class="pp_lst" style=""></ul>');
	    $addItem = $(".add").clone();
	    $listWrapper.append($addItem);
	    $(".my_list").append($listWrapper);
    }
	
	clearTimeout(MyGameRequestInterval);
	$(".loading").attr("style","display:none");
	$(".NetDisconnect").attr("style","display:none");
    $(".no_game").attr("style", "display:none");   
	$(".pp_lst").attr("style", "");
	
	var item = $(".gameItem").clone(true);
	var imgUrl = "http://qqgameplatcdn.qq.com/appdirgame/images/app_ico/AppID{appID}.png";
	imgUrl = imgUrl.replace(/{appID}/, ID);
        
    item.find(".appIcon").attr("src", imgUrl);
	item.find(".g_tit").text(Name);
	item.find(".g_online em").addClass("id_appOnline_" + ID);
	
	var itemClass = 'MyGameItem' + ' ' + ID + ' ' + Url + ' ' + Name + ' ' + AppType;
	itemClass = itemClass + ' ' + 'MyGameExistFlag_' + ID;
	item.attr('class', itemClass);
	
	var gameItems  = $(".pp_lst").children();

	if(gameItems.length == 1)
	{
		$(".pp_lst").prepend(item);
	}
	else 
	{
		//alert(Name);
		var idx = getTheIndexOfAppID(ID);
		
		//if(idx < myAppList.length)
		{
			var len = gameItems.length;
			var curItem = $(".pp_lst").find(".MyGameItem:first");
			var curAppID = curItem.attr("class").split(" ")[1];
			var curIdx = getTheIndexOfAppID(curAppID);
			var bContinue = true;
			var bFound    = false;
						
			if(curIdx >= idx)
			{
				curItem.before(item);
				bFound = true;
				bContinue = false;
			}
			//alert(curAppID);
			while(len-- > 0 && bContinue)
			{		
				curItem = curItem.next();
				curAppID = curItem.attr("class").split(" ")[1];
				curIdx = getTheIndexOfAppID(curAppID);
			
				if(curIdx >= idx)
				{	
					curItem.before(item);
					bFound = true;
					bContinue = false;
				}	
							
			    if(!bFound && len ==1)
				{	
					$(".add").before(item)
					bContinue = false;
				}
			}
		}
		
	}
	
	
	
	$('.add').click(function(){
		window.external.CallClient("OnClickAddMyGame");
	});
	
	$('.MyGameExistFlag_' + ID).click(function(){
		window.external.CallClient("OnClickMyGameItem", $(this).attr('class'));
	})
	.mouseup(function(e){
	if(e.which == 3){	
		var param = e.screenX + ',' + e.screenY + ',' + $(this).attr('class');
		window.external.CallClient("OnRClickMyGameItem", param);
	}});
	
	var count =  $(".myGameCount").text();
	$(".myGameCount").text(parseInt(count) + 1);
	
	RequestOnline(ID);
}

// --
function UpdateMyGameDetails(data)
{
	var arrayParam = data.split(",");
	AddMyGameItemOnWeb(arrayParam[0], arrayParam[1], arrayParam[2], arrayParam[3]);    
}

function AddToMyGame(appid)
{
	if($(".MyGameExistFlag_" + appid).length > 0)
	{
        // 1. exists in MyGame , make it to the first position	
		var item = $('.MyGameExistFlag_' + appid).clone(true);
		$(".MyGameExistFlag_" + appid +":first").prependTo(".pp_lst");
		return;
	}
	else
	{
        // 2.not in mygame ， request app details firstly
		RequestAppDetails(appid, "DetailsForMyGame");
	}
}

function UpdateRecommAppDetail(data)
{
	var paramArray = data.split(",");
	var appId = paramArray[0];
	var appName = paramArray[1];
	var starLv = paramArray[2];
	var GameType = paramArray[3];
	$(".g_tit_appID_" + appId).text(appName);
	if(starLv != 10)
	{
		starLv = '0' + starLv;
	}
	$(".ico_star_" + appId).attr("class", "st_" + starLv);
	var strGameType = GetAppCatalog(GameType);	
	$(".g_cate_appID_" + appId).text(strGameType);
}

function UpdateAppOnline(appId, appOnline)
{
	$(".id_appOnline_" + appId).parent(".g_online").children(".ico").attr("style", "");
	$(".id_appOnline_" + appId).text(appOnline);
}

function BuildRecommendedGames()
{
	if (g_RecommendGames == undefined)
	{
		return;
	}
	var nTabCount = g_RecommendGames.TabCount;
	
	// tab head
	$(".jQ_tabCate").html("");
	for(var i = 1; i <= nTabCount; i++)
	{
		var headerFmt = $('<li class="recom_header on"><a href="#" hidefocus="true"><span>fmtStr</span></a></li>');
		headerFmt.find('span').text(g_RecommendGames.Tables[i].Caption);	
		headerFmt.find('a').attr('href', g_RecommendGames.Tables[i].URL);
		$(".jQ_tabCate").append(headerFmt);
	}

	// tab body
	$("#tab_body").html("");
	var itemFmt = document.getElementById("id_li_bd_item").innerHTML;
	$(".pt_lst").html("");
	var showedAppIds = "";
	// 每个tabbody
	for (var j = 1; j <= nTabCount; j++)
	{	
		var ShowFiled = g_RecommendGames.Tables[j].ShowField;
		$tabBodyDiv = $('<div class="recom_list"></div>');
		$tabBody = $('<ul class="pt_lst" id="id_pt_lst"></ul>');
		// 为tabbody填充内容
		var AppIDArray = g_RecommendGames.Tables[j].AppIDs.split(",");
		var imgPath = 'http://qqgameplatcdn.qq.com/appdirgame/images/app_ico/AppID{gameid}.png';
		for(var k = 0;k < AppIDArray.length && k < 6;k++)
		{		
			$tabBodyItem = $('<li class="cls_li_bd_item" id="id_li_bd_item"></li>');
			
			var biCls = $tabBodyItem.attr('class');
			biCls = biCls + (' bi_item_appid_') + AppIDArray[k];
			$tabBodyItem.attr('class', biCls);
			
			$tabBodyItem.html(itemFmt);
			// 图片
			$tabBodyItem.find(".g_imgPath").attr("src", imgPath.replace(/{gameid}/, AppIDArray[k]));			
			if(ShowFiled.indexOf('1') != -1)
			{// 名称
				$tabBodyItem.find(".g_tit").addClass("g_tit_appID_" + AppIDArray[k]);
			}
			else
			{
				$tabBodyItem.find(".g_tit").attr("style", "display:none");
			}
			
			if(ShowFiled.indexOf('2') != -1)
			{// 类别
				$tabBodyItem.find(".g_cate").addClass("g_cate_appID_" + AppIDArray[k]);
			}
			else
			{
				$tabBodyItem.find(".g_cate").attr("style", "display:none");
			}
			
			if(ShowFiled.indexOf('3') != -1)
			{// 在线
				$tabBodyItem.find(".g_appOnline").addClass("id_appOnline_" + AppIDArray[k]);
			}
			else
			{
				$tabBodyItem.find(".g_online").attr("style", "display:none");
			}
			if(ShowFiled.indexOf('4') != -1)
			{// 星级
				$tabBodyItem.find(".ico_star i").addClass("ico_star_" + AppIDArray[k]);
			}
			else
			{
				$tabBodyItem.find(".ico_star").attr("style", "display:none");
			}
				
			$tabBody.append($tabBodyItem);
			if(k == 0 && j == 1)
			{
				showedAppIds = showedAppIds + AppIDArray[k];
			}
			else
			{
				showedAppIds = showedAppIds + "," +AppIDArray[k];
			}
		}
		$cnt=$('<div></div>'); 
		$cnt.attr("class", "cnt_tab jQ_cntTab");
		$cnt.append($tabBodyDiv.append($tabBody));	

		// subbar
		$subbar = $(".sub_bar").clone();
		$subbar.find(".sub_cate").html("");
		for (var h=0;h < g_RecommendGames.Tables[j].LinksCount; h++)
		{
			$subbaritem = $('<a href="#" hidefocus="true"></a>');
			var urlIndex = 'LinkURL' + h;
			$subbaritem.attr('href', g_RecommendGames.Tables[j][urlIndex]);
			$subbaritem.text(g_RecommendGames.Tables[j]["LinkCaption" + h]);
			$subbar.find(".sub_cate").append($subbaritem);
		}
		
		$subbar.find('.sub_more a').text(g_RecommendGames.Tables[j].GuideCaption);
		$subbar.find('.sub_more a').attr('href', g_RecommendGames.Tables[j].GuideURL);
		$cnt.append($subbar);
		$("#tab_body").append($cnt);	
	}
	
	$('.cls_li_bd_item').click(function(){
		window.external.CallClient('OnClickRecommGameItem', $(this).attr('class'));
	})
	.mouseup(function(e){
	if(e.which == 3){	
		var param = e.screenX + ',' + e.screenY + ',' + $(this).attr('class');
		window.external.CallClient("OnRClickRecommGameItem", param);
	}});
	
	$('.foot_bar a').attr('href', 'qqgame://jumptaburl:URL=http://qqgameappcdn.qq.com/appdirgame/inc/online/index.html,tab=1');
	RequestOnline(showedAppIds);
	RequestAppDetails(showedAppIds, "DetailsForRecom");
}

function GetAppCatalog(nCatlog)
{
	switch(nCatlog)
	{
		case 1:
			return "牌类";
		case 2:
			return "麻将";
		case 4:
			return "棋类";
		case 8:
			return "休闲竞技";
		case 16:
			return "桌游";
		case 32:
		    return "策略";
		case 64:
			return "模拟经营";
		case 128:
			return "养成";
		case 256:
			return "角色扮演";
		case 512:
			return "其他";
	}
}

$(document).ready(function()
{
	$(".NetDisconnect").attr("style","display:none");
	$(".loading").attr("style","");
	
	$('.NetDisconnect a').click(function(){
		RetryRequestMyApp();
	});
	
	InitSearchBar();
    BuildRecommendedGames();

	$('.ico_set').click(function(){
		window.external.CallClient('UpdateConfirm');
	});
	
	$('.ico_boy').click(function(){
		window.external.CallClient('UpdateConfirm');
	});
	
	$(".no_game").click(function(){
		window.location.href = "qqgame://jumptaburl:URL=http://qqgameappcdn.qq.com/appdirgame/app_lib_recommend.shtml,tab=1";
	});
	
	// mygame timeout
	MyGameRequestInterval = setInterval(OnMyGameRequestTimeout, timeoutMillSeconds);  
});
