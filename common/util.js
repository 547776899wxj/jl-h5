function hideName(name) {
	if(!name){
		return '';
	}
	if (name.length == 2) {
		name = '*' + name.slice(1, name.length);
	} else if (name.length > 2) {
		name = name.slice(0, 1) + '*' + name.slice(2, name.length);
	}
	return name;
}
//两个数组的差集
function findDifferentElements(array1, array2) {
	return array1.filter(function(v){ return array2.indexOf(v) == -1 });
}
//转大写
function chineseNumeral(data){
	let tmpnewchar = "" ;
		for(let char of data){
			switch (char) {
	            case "0":   tmpnewchar =  tmpnewchar + "零" ;break;
	            case "1":  tmpnewchar =  tmpnewchar + "一" ; break;
	            case "2":  tmpnewchar =  tmpnewchar + "二" ; break;
	            case "3":  tmpnewchar =  tmpnewchar + "三" ; break;
	            case "4":  tmpnewchar =  tmpnewchar + "四" ; break;
	            case "5":  tmpnewchar =  tmpnewchar + "五" ; break;
	            case "6":  tmpnewchar =  tmpnewchar + "六" ; break;
	            case "7":  tmpnewchar =  tmpnewchar + "七" ; break;
	            case "8":  tmpnewchar =  tmpnewchar + "八" ; break;
	            case "9":  tmpnewchar =  tmpnewchar + "九" ; break;
				default: tmpnewchar = tmpnewchar + char;
	        }
	}
	return tmpnewchar;
}
//转数字
function chineseLowercase(data){
	let tmpnewchar = "" ;
		for(let char of data){
			switch (char) {
	            case "零":   tmpnewchar =  tmpnewchar + "0" ;break;
	            case "一":  tmpnewchar =  tmpnewchar + "1" ; break;
	            case "二":  tmpnewchar =  tmpnewchar + "2" ; break;
	            case "三":  tmpnewchar =  tmpnewchar + "3" ; break;
	            case "四":  tmpnewchar =  tmpnewchar + "4" ; break;
	            case "五":  tmpnewchar =  tmpnewchar + "5" ; break;
	            case "六":  tmpnewchar =  tmpnewchar + "6" ; break;
	            case "七":  tmpnewchar =  tmpnewchar + "7" ; break;
	            case "八":  tmpnewchar =  tmpnewchar + "8" ; break;
	            case "九":  tmpnewchar =  tmpnewchar + "9" ; break;
	            case ",":  tmpnewchar =  tmpnewchar + "" ; break;
				default: tmpnewchar = tmpnewchar + char;
	        }
	}
	return tmpnewchar;
}
function geteDateText(dataTime){
	let date = new Date(dataTime);
	let weekday = [ '星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
		day: weekday[date.getDay()],
		time: date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
}

module.exports = {
	hideName,
	findDifferentElements,
	chineseNumeral,
	geteDateText,
	chineseLowercase
}