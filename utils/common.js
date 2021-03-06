var cityBank=[];
var homeIndex=0;
var bmap = require('bmap-wx.js');
function init(){
  try{
    var BMap = new bmap.BMapWX({
      ak: '8Xom7g2TrnPlLWAK5TaDujjRr3dfPfvf'
    });
    var fail = function(data){
      console.log(data)
    };
    var value = wx.getStorageSync('citys')
    var index = wx.getStorageSync('index')
    if(value){
      console.log("有缓存");
      cityBank = value;
      return cityBank[index].currentCity
    }else{
      console.log("没有缓存");
      var success=function(data){
        var weatherData = data.currentWeather[0];
        weatherData.fullData = data.originalData.results[0];
        weatherData.location=weatherData.currentCity;
        cityBank.push(weatherData);
        homeIndex=1;
        try{
          wx.setStorageSync('citys', cityBank);
          wx.setStorageSync('index', homeIndex);
          return weatherData.currentCity;
        }catch(e){

        }
      }
      BMap.weather({
        fail:fail,
        success:success
      });
    }
  }catch(e){
    console.log("缓存没有问题");
  }
}
function getToday(){
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth()+1;
  var day = myDate.getDate();
  return year+"年"+month+"月"+day+"日";
}
function windHelper(zhText){
  return zhText;
}
function pmText(index){
  if(index <= 35){
    return "空气质量优";
  }else if(index>35 && index <= 75){
    return "空气质量良好";
  }else if (index > 75 && index <= 115) {
    return "空气轻度污染";
  }else if (index > 115 && index <= 150) {
    return "空气中度污染";
  }else if (index > 150 && index <= 250) {
    return "空气重度污染";
  } else if (index > 250) {
    return "空气非常污染";
  }
}
function getHomeData(){
  return cityBank[homeIndex];
}
function getCityList(){
  var citys=[];
  for(var i = 0;i<cityBank.length;i++){
    var city={};
    city.name = cityBank[i].currentCity;
    city.index=i;
    if(homeIndex==i){
      city.icon = 0;
    }else{
      city.icon = 1;
    }
    citys.push(city);
  }
  return citys;
}
function getCity(){
  return cityBank;
}
function refreshCity(weatherData){
  homeIndex = wx.getStorageSync('index');
  var thatIndex = -1;
  for (var i = 0; i < cityBank.length; i++) {
    if(cityBank[i].currentCity==weatherData.currentCity){
      cityBank[i]=weatherData;
      thatIndex=i;
    }
  }
  if(thatIndex==-1){
    cityBank.push(weatherData);
    homeIndex=cityBank.length-1;
  }else{
    homeIndex = thatIndex;
  
  }
  wx.setStorageSync('index',homeIndex);
}
function addCity(weatherData){
  var thatIndex = -1;
  for (var i = 0; i < cityBank.length; i++) {
    if (cityBank[i].currentCity == weatherData.currentCity) {
      thatIndex= i;
    }
}
if(thatIndex==-1){
  cityBank.push(weatherData);
  wx.setStorageSync('citys', cityBank);
}
}
function readXJCitys(){
  var xjCitys=["北京市","天津市","上海市","重庆市","石家庄市","郑州市","武汉市","长沙市","南京市","南昌市","沈阳市","长春市","哈尔冰市","西安市","太原市","济南市","成都市","西宁市","合肥市","海口市","广州市","兰州市","昆明市","福州市","贵阳市"];
  return xjCitys;
}
function iconChanger(zhText){
  var status = zhText;
  var statusData = {};
  statusData.status = status;
  var wallPaper = "day";
  var thisMoment = new Date().getHours();
  if(thisMoment>18 || thisMoment<6){
    wallPaper = "night";
  }else{
    wallPaper = "day";
  }
  if(zhText.indexOf('沙')>=0){
    statusData.wall = "/images/sandday";
  } else if (zhText.indexOf('雪') >= 0) {
    statusData.wall = "/images/snow" + wallPaper;
  } else if (zhText.indexOf('雨') >= 0) {
    statusData.wall = "/images/rainy" +wallPaper;
  } else if (zhText.indexOf('云') >= 0) {
    statusData.wall = "/images/cloud" + wallPaper;
  }else{
    statusData.wall = "/images/clear" + wallPaper;
  }
  statusData.icon = zhText;
  return statusData;
}
module.exports = {
  readXJCitys : readXJCitys,
  init : init,
  getHomeData: getHomeData,
  getCityList: getCityList,
  addCity: addCity,
  refreshCity: refreshCity,
  getToday: getToday,
  getCity: getCity,
  iconChanger: iconChanger,
  windHelper: windHelper,
  pmText: pmText
}
