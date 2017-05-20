function dispVIPIcon(isDispVip, isDispYearVip, level, isSuperVip, isVipOn, isYearVipOn) 
{	
    if(!isDispVip) {
        $('.lvl_img').hide();
    } else {
        var img_lvl = "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/lz_on_0.png";
		if (isSuperVip) {
			img_lvl = "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/lz_"+(isVipOn?"on":"off")+"_"+level+".png";
			var newCls = 'vip_info_link blueIcon ' + 'superVip';
			$('.blueIcon').attr('class', newCls);
		}
		else {
			img_lvl = "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/lz_a_"+(isVipOn?"on":"off")+"_"+level+".png";
		}	
       	$($('.login_box .lz_info_box li i')[0]).attr("class",isVipOn?"up":"down").attr("style","display:;");  
		$($('.login_box .lz_info_box li i')[1]).attr("class",isVipOn?"up":"down").attr("style","display:;"); 		
        $('.lvl_img').attr('src',img_lvl).error(function(){
            $(this).attr('src', "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/lz_on_0.png");
            $(this).unbind("error");
        });
		$('.lz_gift_icon img').attr('src',img_lvl).error(function(){
            $(this).attr('src', "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/lz_on_0.png");
            $(this).unbind("error");
        });
        $('.lvl_img').show();
		$('.lz_gift_icon').show();
    }
	
	if(!isDispYearVip) {
		$('.nianicon').hide();
	} else {
		var img_year = "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/"+(isYearVipOn?"":"no_" )+"year_icon.png";
        $('.nianicon').attr('src',img_year).error(function(){
            $(this).attr('src', "http://ossweb-img.qq.com/images/qqgame/appdir/webhall/gamevip/lz_icon/no_year_icon.png");
            $(this).unbind("error");
        });
        $('.nianicon').show();
	}
}

function GetJson(cgi, succ_func, fail_func, param, cache, timeout){
		$.ajax({
	  url: cgi,
	  type: "get",
	  data: param || {},
	  dataType: "jsonp",
	  cache: typeof(cache)=='undefined' ? true : cache,
    timeout: timeout || 0,
	  callbackParameter: "callback",
	  success: function(data) {
	    succ_func && succ_func(data);
	  },
	  error: function(XMLHttpRequest, textStatus, errorThrown) {
	    fail_func && fail_func(XMLHttpRequest, textStatus, errorThrown);
	  }
	});
}



function updateBlueInfo(isVip, isYearVip, isSuperVip, lvl, vipValidDay, yearVipValidDay, superVipValidDay, growth_pnt){
	
	//var lvl = myInfo['baseinfo']['level'];	
	var imgUrl = 'http://ossweb-img.qq.com/images/qqgame/appdir/webhall/kt_lz.png';	
	var imgUrlPre = 'http://ossweb-img.qq.com/images/qqgame/appdir/webhall/';
	var actType = 0;	
	if (isVip)
	{						
		dispVIPIcon(true, true, lvl, isSuperVip, true, isYearVip);		
		if (isSuperVip) {		
			if (isYearVip) {				
				if (yearVipValidDay >= 31) {
					imgUrl = imgUrlPre + 'sj_lz.png';
					actType = 1;	
				}
				else {
					imgUrl = imgUrlPre + 'xf_nf.png';
					actType = 2;	
				}
			}
			else {
				if (superVipValidDay >= 31) {
					imgUrl = imgUrlPre + 'kt_nf.png';
					actType = 3;	
				}
				else {
					imgUrl = imgUrlPre + 'xf_lz.png';
					actType = 4;
				}
			}
		}else {
			if (isYearVip) {		
					if (yearVipValidDay) {					
						imgUrl = imgUrlPre + 'sj_lz.png';
						actType = 1;	
					}
					else {
						imgUrl = imgUrlPre + 'xf_nf.png';
						actType = 2;	
					}
			}
			else {				
					if (vipValidDay) {				
						imgUrl = imgUrlPre + 'sj_lz.png';
						actType = 1;	
					}
					else {
						imgUrl = imgUrlPre + 'xf_lz.png';
						actType = 4;
					}
			}
		}
	}
	else 
	{//·ÇÀ¶×êÓÃ»§
		imgUrl = imgUrlPre + 'kt_lz.png';
		actType = 0;
		if (growth_pnt) {				
			dispVIPIcon(true, true, lvl, false, false, false);			
		}else {
			dispVIPIcon(true, true, lvl, false, false, false);	
		}
	} 
	$('.u_ico_box').attr('style', '');
	$('.act_icon').attr('src',imgUrl);
	var newCls = 'vip_info_link actionIcon ' + actType;
	$('.actionIcon').attr('class', newCls);
	$('.u_ico_box').attr('style', '');
	
	$('.vip_info_link').click(function(){
		window.external.CallClient('OnClickBlueVipRegion', $(this).attr('class'));
                return false;
	});
}
function chSetCookie(name, value)
{
	document.cookie = name + "=" + value + "; path=/; domain=qq.com";
}
/*  |xGv00|4c153d49f2d69460f77a42b261fc6c67 */