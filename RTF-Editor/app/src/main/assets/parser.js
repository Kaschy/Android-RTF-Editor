var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

function openFile(a){
  parse(atob(a));
}
function htmlToRtf(html){

  var tokens = $("div[data-role=token]").toArray();
  var tokensString = "";

  for(var k in tokens){
    $token = $(tokens[k]);
    var token = $token.data("token");
    if(token == "opening" ){
      if($token.data("allowomit") == true ){
        tokensString += "{\\*";
      }else{
        tokensString += "{";
      }
    }
    else if(token == "closing" ){
        tokensString += "}";
    }
    else if(token == "char" ){
      tokensString += ""+stringToRtfUnicode($token.html());
    }
    else if(token == "newline" ){
      tokensString += ""+stringToRtfUnicode($token.html());
    }
    else{
          tokensString += "\\"+token;
    }
  }

  $(".rtfout").html(tokensString);
  //console.log(tokensString);
}


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function downloadRTF(){
  generateRtf();
  var content = $(".rtfout").html();
  download("test.rtf",content);
}
function rtfUnicodeToString(unicode){
  for(var k in codePage){
    if(codePage[k][0] == unicode.toLowerCase() || codePage[k][0] == unicode){
      return codePage[k][1];
    }
  }
  return unicode;
//  console.log("not found: "+ unicode);
}
function stringToRtfUnicode(stri){
  for(var k in codePage){
    if(codePage[k][1] == stri){
      return codePage[k][0];
    }
  }
//  console.log("not found: "+ stri);
  return stri;
}

Array.prototype.peek = function() {
    return this[this.length-1];
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};





function parse(rtf){
  $(".rtf").html("");
  //parser
  var stack = [];
  stack.push([]);
  var global = [];
  //var elements = $(".rtf div[data-role='token']").toArray();
  var depth = 0;

  //tokenize
  $(".rtfin").html(rtf);
  //alert(1);
  //var tokensWritten ="";
  var colorClasses = [];
  while(rtf.length>0){
    var enableHandleToken = true;

    var calledWriteToken = false;
    var writeToken = function(className,content){

      calledWriteToken = true;
      if(content == undefined){
        content ="";
      }
      var $token = $("<div data-role='token' data-token='"+className+"' >"+content+"</div>");
      $(".rtf").append($token);
      return $token;
    }
    var writeTokenf = function(className,content){
      calledWriteToken = true;

      if(content == undefined){
        content ="";
      }
      return function(){writeToken(className,content)};
    }
    function pushf(str){
      return function(){stack.peek().push(str);};
    }
    function popf(str){
      return function(){stack.peek().remove(str);};
    }
    var handleToken = function(regex,action){
      if(!enableHandleToken)return;
      rtf = rtf.replace(regex,function(){
        enableHandleToken = false;
        console.log("handleToken: ",arguments[0]);
        if(action != undefined){
          console.log(action);
          calledWriteToken = false;
            var $token = writeToken(arguments[0],"");
            action.apply($token,arguments);
            //if(!calledWriteToken)

        }else{
            writeToken(arguments[0],"");
        }
        return "";
      });
    };
    handleToken(/^(\\*\\generator([^\}]*))/);
    handleToken(/^(\\\*\\pn)/);
    handleToken(/^(\\pntxt(.)([^\}]*))/);
    function opening(){
      if(depth>0 ){
        depth++;
      }else{
        stack.push([]);
      }
    }
    function closing(){
      if(depth>0 ){
        depth--;
      }else{
        stack.pop();
      }
    }
    handleToken(/^({\\\*)/,function(){
      depth = 1;
    });
    handleToken(/^({)/,opening);
    handleToken(/^(})/,closing);
    handleToken(/^(\\})/,writeTokenf("char","}"));
    handleToken(/^(\\{)/,writeTokenf("char","{"));
    handleToken(/^(\n)/,writeTokenf("char","\n"));
    handleToken(/^(\\rtf1)/);
    handleToken(/^(\\ansicpg1252)/);
    handleToken(/^(\\ansi)/);
    handleToken(/^(\\nouicompat)/);
    handleToken(/^(\\fonttbl)/);
    handleToken(/^(\\cpg1252)/);
    handleToken(/^(\\deff([0-9]+))/);
    handleToken(/^(\\viewkind4)/);
    handleToken(/^(\\uc1)/);
    handleToken(/^(\\d)/);
    handleToken(/^(\\sa200)/);
    handleToken(/^(\\sl276)/);
    handleToken(/^(\\slmult1)/);
    handleToken(/^(\\fs22)/);
    handleToken(/^(\\lang7)/);
    handleToken(/^(\\pard)/);
    handleToken(/^(\\tab)/);
    handleToken(/^(\\fi-360)/);
    handleToken(/^(\\li720)/);
    handleToken(/^(\\sl240)/);
    handleToken(/^(\\pntext)/);
    handleToken(/^(\\pnlvlblt)/);
    handleToken(/^(\\pnlvlbody)/);
    handleToken(/^(\\pnf([0-9]+))/);
    handleToken(/^(\\pndec)/);
    handleToken(/^(\\pnindent([0-9]+))/);
    handleToken(/^(\\pnstart([0-9]+))/);
    handleToken(/^(\\pndec)/);
    handleToken(/^(\\pn)/);
    handleToken(/^(\\b0)/);
    handleToken(/^(\\b)/);
    handleToken(/^(\\colortbl (((\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+))?;)*))/,function($1,a0,x){
      console.log("XX: ",x);
      var $token = this;
      var i = 0;
        x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));|;/g,function(a0,a1,r,g,b){
          console.log("XY: ",arguments);
          var res = "";
          if(a0 == ";"){
            $token.append(" <style> .cf0{color: rgb(0,0,0)}</style>");
            colorClasses.push("cf0");
          }else{
            $token.append(" <style> .cf"+i+"{color: rgb("+r+","+g+","+b+")}</style>");
            colorClasses.push("cf"+i);
          }
          i++;
        });
    });
    handleToken(/^(\\(cf[0-9]+))/,function($1,$2,$3){
      //console.log(arguments);
      stack.peek()['color'] = $3;
      //stack.peek().push($3);
    });
    handleToken(/^(\\i0)/,popf("italic"));
    handleToken(/^(\\i)/,pushf("italic"));
    handleToken(/^(\\ulnone)/,popf("underlined"));
    handleToken(/^(\\ul)/,pushf("underlined"));
    handleToken(/^(\\par)/,function(){
      $("</br>").insertAfter(this);
    });
    handleToken(/^(\\'[0-9a-fA-F]+)/,function($1){
      this.html(rtfUnicodeToString($1));
      this.data("token","char");
      this.addClass("escaped");
    });
    handleToken(/^(\\f([0-9]+)\\fnil\\fcharset([0-9]+) ([^;]*);)/,function($1,$2,$3,$4){
      this.data("token",$1);
      this.html("<style> .f"+$2+" ~ *{font-family: "+$4+"}</style>");
    });
    handleToken(/^(\\f([0-9]+))/);
    handleToken(/^(\\fnil)/);
    handleToken(/^(\\fs([0-9]+))/,function($1,$2){
      this.data("token",$1);
      this.html("<style> .fs"+$2+" ~ *{font-size: "+$2+"px}</style>");
    });
    handleToken(/^(.)/,function($1){
      var classes = stack.peek();
      this.addClass("char");
      for(var k in classes){
        this.removeClass(classes[k]);
        this.addClass(classes[k]);

      }

      this.data("token","char");
      this.html($1);
      //writeToken("char",$1);
    });


  }
//  console.log(tokensWritten);
  $(".rtf").append(`
  <style>
  div{float:left;white-space:pre;box-sizing: border-box;}
  //.char{display:block}
  .italic{font-style:italic;}
  .underlined{ text-decoration:underline;}
  .bold{font-weight: bold;}
  .tab::before{content: "     ";}
  </style>
  <style>
  .cursor{
    -webkit-box-shadow: inset 2px 0px 0px 0px rgba(50, 50, 50, 1);
    -moz-box-shadow:    inset 2px 0px 0px 0px rgba(50, 50, 50, 1);
    box-shadow:         inset 2px 0px 0px 0px rgba(50, 50, 50, 1);
  }
  </style>
  `);

  $(".rtf").append("<div class='cursor ' > </div>");


  function isPrintable(code){
    var valid =
    (keycode > 47 && keycode < 58)   || // number keys
    keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
    (keycode > 64 && keycode < 91)   || // letter keys
    (keycode > 95 && keycode < 112)  || // numpad keys
    (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    (keycode > 218 && keycode < 223);   // [\]' (in order)

return valid;
  }




  var getKeyCode = function (str) {
      return str.charCodeAt(str.length - 1);
  }


  function setCaretPosition(elemId, caretPos) {
      var elem = document.getElementById(elemId);

      if(elem != null) {
          if(elem.createTextRange) {
              var range = elem.createTextRange();
              range.move('character', caretPos);
              range.select();
          }
          else {
              if(elem.selectionStart) {
                  elem.focus();
                  elem.setSelectionRange(caretPos, caretPos);
              }
              else
                  elem.focus();
          }
      }
  }
  $("#theinput").change(function(){
    console.log("input: "+$("#theinput").val());
  });

  var before ="";

  $("#theinput").keydown(function(e) {
    before = this.value;
  });
  $("#theinput").keyup(function(e) {
    //e.preventDefault();

    setCaretPosition("#theinput",this.value.length);
    console.log("keycode "+ e.keyCode +" which "+ e.which);
    var kCd = e.keyCode || e.which;
    if (kCd != 8 && (kCd == 0 || kCd == 229)) { //for android chrome keycode fix

      kCd = getKeyCode(this.value);
      e.keyCode = kCd;
      e.which = kCd;
    }
    console.log("before: "+before+" after: "+this.value);


    console.log("key "+this.value+"  "+String.fromCharCode(e.keyCode));


    //this.value ="aaaa";
    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '13') {
        // enter
        var div = $('<div>');
        div.data("role","token");
        div.data("token","\\par");
        div.addClass("char");
        div.insertBefore(".cursor");
        $('</br>')
        .insertBefore(".cursor");
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
       //
       var cursor =  $('.cursor');
       var next = cursor.prevAll(".char:first");
       if(next.length>0){
         cursor.removeClass("cursor");
         next.addClass("cursor");
       }


       //$('.cursor').insertBefore($('.cursor').prevAll(".char:first"));

    }
    else if (e.keyCode == '39') {
       // right arrow
       var cursor =  $('.cursor');
       var next = cursor.nextAll(".char:first");
       if(next.length>0){

         cursor.removeClass("cursor");
         next.addClass("cursor");
       }
        //$('.cursor').insertAfter($('.cursor').nextAll(".char:first"));
    }else if ((before.length-this.value.length>0) || e.keyCode == '8') {
      var cursor =  $('.cursor');
      var next = cursor.prevAll(".char:first")
      console.log("tag "+next.next().prop("tagName"));
      if(next.next().prop("tagName") == "BR"){
        next.next().remove();

      }
      next.remove();


    //  generateRtf();
    }else{
      console.log("key:  " + e.which+"  "+e.keyCode+"  "+String.fromCharCode(e.keyCode));

      var str = String.fromCharCode(e.keyCode);
      $('.cursor:first').clone().removeClass("cursor").html(str).data("token",str).insertBefore(".cursor");
      //generateRtf();
    }
    this.value = "x";

    //$("<div data-role='token'>")83

  });
  //$("html")
//window.ANDROID.inflateKeyboard();
  $(".char").on("touchstart",function(e){
    //tou
  //  $("#theinput").focus();
    //prompt();
    var cursor =  $('.cursor');
    var next = $(e.target);
    if(next.length>0){
      cursor.removeClass("cursor");
      next.addClass("cursor");
    //  window.ANDROID.keyboard(true);
    }
    //$("#theinput").focus();
    $('#theinput').click(function(e){ $(this).focus(); });

   $('body').click(function(e)
   {
      if(!$('#theinput').is(":focus")){
        $('#theinput').trigger('click');
      }

   });
  });


  generateRtf();


}

function test(a){
  $(".rtf").html(atob(a));
  //$(".rtf").html(a+$(".rtf").html());
}

function focus()
{

  $('#theinput').trigger('click');
}

function generateRtf(){
  var tokens = $(".rtf div[data-role=token]").toArray();
  var tokensString = "";

  for(var k in tokens){
    $token = $(tokens[k]);
    var token = $token.data("token");

    if(token == "char" ){
      tokensString += ""+stringToRtfUnicode($token.html());
    }
    else{
      if(token != undefined)
          tokensString += token;
    }
  }
  $(".rtfout").html(tokensString);
}

$(window).on('load', function() {

  var template = document.getElementById("rtftemplate");
  parse(template.innerHTML);

  if(isAndroid) {

    $("html").append(`
<style>
.rtfin,
.rtfout{

  display:none;
}


</style>

      `);
  }

});
