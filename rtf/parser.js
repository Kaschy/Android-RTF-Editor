

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

  //parser
  var stack = [];
  stack.push([]);
  var global = [];
  var elements = $(".rtf div[data-role='token']").toArray();
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

  $("html").keydown(function(e) {
    console.log("key");

    if (e.keyCode == '38') {
        // up arrow
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
    }else if (e.keyCode == '8') {
      var cursor =  $('.cursor');
      cursor.prevAll(".char:first").remove();
      generateRtf();
    }else //if(isPrintable(e.keyCode))
    {
      var str = String.fromCharCode(e.keyCode);
      $('.cursor:first').clone().removeClass("cursor").html(str).data("token",str).insertBefore(".cursor");
      generateRtf();
      //$("<div data-role='token'>")83
    }

  });

  generateRtf();


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
function parse1(rtftext){


  $(".rtfin").html(rtftext);

  function writeToken(className,addClass,content){
    if(content == undefined){
      content ="";
    }
    if(addClass == undefined){
      addClass ="";
    }
    if(jQuery.type(className) === "string"){

    //  return $("<div data-role='token' data-token='"+className+"'>"+content+"</div>").data("content",addClass).html();
      return "<div data-role='token' data-token='"+className+"' data-content='"+addClass+"'>"+content+"</div>";
    }
    else{
      var str = "<div data-role='token' ";
      //console.log(className);
      for(var k in className){
        str += " data-"+k+"='"+className[k]+"' "

      }

      str += "'>"+content+"</div>";

      return str;
    }

  }
  function handleToken(regex,action){
    rtftext = rtftext.replace(regex,function(){
      alert(arguments[0]);
      if(action != undefined){
          action.apply(arguments);
      }
      return "";
    });
  }
  handleToken(/^(\\*\\generator([^\}]*))/);
  handleToken(/^(\\\*\\pn)/);
  handleToken(/^(\\pntxt(.)([^\}]*))/);
  handleToken(/^([^\\]|^)({\\\*)/,"$1"+writeToken({token:"opening",allowOmit:true}));
  handleToken(/^([^\\]|^)({)/,"$1"+writeToken({token:"opening",allowOmit:false}));
  handleToken(/^([^\\]|^)}/,"$1"+writeToken("closing",""));
  handleToken(/^([^\\])}/,writeToken("closing",""));
  handleToken(/^(\\})/,writeToken("char","","}"));
  handleToken(/^(\\{)/,writeToken("char","","{"));
  handleToken(/^(\n)/,writeToken("char","","\n"));
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
  var colorClasses = [];
  handleToken(/\\colortbl ((\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+))?;)*/,function(x){
    console.log("XX: "+x);
    var token ="colortbl";
    //x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));/,"color: rgb($2,$3,$4)");
    var i = 0;
      x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));|;/,function(a0,a1,r,g,b){
        var res = "";
        if(a0 == ";"){
          token += " \\red0\\green0\\blue0;";
          res = //writeToken("colortbl \\red0\\green0\\blue0;","")+
          " <style> .cf0{color: rgb(0,0,0)}</style>";
          colorClasses.push("cf0");
        }else{
          token += " \\red"+r+"\\green"+g+"\\blue"+b+";";
          res = // writeToken("colortbl \\red"+r+"\\green"+g+"\\blue"+b+";","")+
          " <style> .cf"+i+"{color: rgb("+r+","+g+","+b+")}</style>";
          colorClasses.push("cf"+i);
        }
        i++;
        return  res;
        console.log(arguments);
      });
    return writeToken(token,"") +x;
  });
  handleToken(/^(\\cf([0-9]+))/);
  handleToken(/\\i0/);
  handleToken(/\\i/);
  handleToken(/\\ulnone/);
  handleToken(/\\ul/);
  handleToken(/\\par/);
  handleToken(/^(\\'[0-9a-fA-F]+)/,rtfUnicodeToString);
  handleToken(/\\f([0-9]+)\\fnil\\fcharset([0-9]+) ([^;]*);/,writeToken("f$1","")+writeToken("fnil","")+writeToken("fcharset$2 $3;","")+"<style> .f$1 ~ *{font-family: $3}</style>");
  handleToken(/\\f([0-9]+)/,writeToken("f$1",""));
  handleToken(/\\fnil/,writeToken("fnil",""));
  handleToken(/\\fs([0-9]+)/,writeToken("fs$1","")+"<style> .fs$1 ~ *{font-size: $1px}</style>");






var html = "";
var instyle = false;
var outside = true;
for(var i = 0; i<rtftext.length;i++){

  if(rtftext.indexOf("<style>",i)==i){
    instyle = true;
  }
  if(rtftext.indexOf("</style>",i)==i){
    instyle = false;
  }

  if(rtftext[i] == '>'){
    outside = true;
    html+=rtftext[i];
    continue;
    //console.log(rtftext[i]);
  }
  if(rtftext[i]== '<'){
    outside = false;
    html+=rtftext[i];
    continue;
    //console.log(rtftext[i]);
  }
//console.log(inside);
//console.log(rtftext[i]);
  if(outside && !instyle){
    html+=writeToken("char","",rtftext[i]);
  }else{
    html+=rtftext[i];
  }
}
html+=`
<style>
div{float:left;white-space:pre;box-sizing: border-box;}
//.char{display:block}
.italic{font-style:italic;}
.underlined{ text-decoration:underline;}
.bold{font-weight: bold;}
.tab::before{content: "     ";}
</style

`;




$(".rtf").html(html);
//console.log(html)
//document.write("<div class='rtf'>"+html+"</div>");

var stack = [];
stack.push([]);
var global = [];
var elements = $(".rtf div[data-role='token']").toArray();
var depth = 0;
for(var x in elements){
  $token = $(elements[x]);



  var token = $token.data("token");


  console.log(token+" "+stack.length);

  if(depth>0 ){
    $token.hide();
    console.log("DEPTH !!!!!! "+depth);
    if(token == "opening"){
      depth++;
      continue;
    }else
    if(token == "closing"){
      depth--;
      continue;
    }else{
      continue;
    }

  }
  if(token == "opening"){

    if($token.data("allowomit") == true){
      //var nexttoken =

        depth = 1;
    }else{
      stack.push([]);
    }
  }
  if(token == "closing"){
    stack.pop();
  }
  if(token == "i"){
    stack.peek().push("italic");
  }
  if(token == "i0"){
    stack.peek().remove("italic");
  }
  if(token == "b"){
    stack.peek().push("bold");
  }
  if(token == "b0"){
    stack.peek().remove("bold");
  }
  if(token == "ul"){
    stack.peek().push("underlined");
  }
  if(token == "ulnone"){
    stack.peek().remove("underlined");
  }
  if(token == "char"){
    var classes = stack.peek();
    $token.addClass("char");
    for(var k in classes){
      $token.addClass(classes[k]);

    }
    /*for(var k in global){
      $token.addClass(global[k]);

    }*/
  }
  if(token == "tab"){
    $token.addClass("tab");
  }

  for (var k in colorClasses){
    //colorClasses
    if(token == colorClasses[k]){
      var classes = stack.peek();
      for(var k in classes){
        stack.peek().push(colorClasses[k]);

      }
    }
  }




}


var addclass ="";
  $(".rtf *").each(function(a,e){
    var firstClass = e.className.split(' ')[0];

    var match;
    match = /cf([0-9]+)/.exec(firstClass);
    if(match){
      //  console.log(match);
        addclass = firstClass;
    }else{
      //console.log(e.className);
      $(e).addClass(addclass);
    }
  });
  //console.log(html);
  //
  //
  //
  console.log(htmlToRtf(html));
return;

  /*
  rtftext = rtftext.replace(/\\fonttbl/,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/,"<div class="fonttbl"></div>");
*/


  console.log(rtftext);
  return;
  var html;

  var groupStateStack = [];
  var currentGroupState = null;


//  div replace


  for(var i=0;i<rtftext.length;i++){
    var nextToken;

    /*
    parse brace
      parse groupignore -> set flag for ignore
        parse action -> if ignore flag, perform brace skip
          parse arguments _> parse arguments depensing on action
            parse html -> take any token to }\{



     */

    function parseArgument(){//ets next argument from token stream


    }
    function parseArgument(){//ets next argument from token stream


    }



    var nextTokenEquals = function(str,cb){
      var equals;
      if(str instanceof RegExp){
        var match = str.exec(rtftext.substring(i));
        if (match != null) {
          console.log(match);
            //console.log("match found at " + match.index);
            //console.log(match);
            equals = (match.index == 0);
            if(equals){
              nextToken = match[0];
            }
        }

      }else{
        equals = (rtftext.indexOf(str,i) == i);
        if(equals){
          nextToken = str;
        }
      }
      if(equals){
        i+= nextToken.length;
        console.log(nextToken);
      }

      if(equals && cb){
        cb();
        //carry out action assigned to destination
      }

      return equals;
    }
    function write(str){
        html+=str;
    }



    if(false){}
    else if(nextTokenEquals('\\')){
      if(
        nextTokenEquals('i',function(){
          write("<i>");
        })
        ||nextTokenEquals('i0',function(){
          write("</i>");
        })
        ||nextTokenEquals('ul',function(){
          write("<ul>");
        })
        ||nextTokenEquals('ulnone',function(){
          write("</ul>");
        })
      ){

      }

    }
    else if(nextTokenEquals('{')){

      //section destinationchanges
      if((nextTokenEquals('\\*') || nextTokenEquals('\\')) &&
          nextTokenEquals('footnote')
          ||nextTokenEquals(/.*deff0\\/)
        ||nextTokenEquals('header')
        ||nextTokenEquals('rtf1')
        ||nextTokenEquals('footer')
        ||nextTokenEquals('pict')
        ||nextTokenEquals('info')
        ||nextTokenEquals('fonttbl')
        ||nextTokenEquals('stylesheet')
        ||nextTokenEquals('colortbl')
      )
      {
        groupStateStack.push(currentGroupState);
        currentGroupState = new GroupState(nextToken);
        console.log("push");
      }else{
        //if the first control word is not known skip the whole Group
        //stack braces to remove the right frame
        var depth = 1;
        for(;depth>0;i++){
          if(rtftext[i] == '{'){
            depth++;
          }
          if(rtftext[i] == '}'){
            depth--;
          }
        }




      }
        //endsection destinationchanges
      /*
      If the character is an opening brace (),
      the reader stores its current state on the stack
      */
    }
    else if(nextTokenEquals('}')){
      currentGroupState = groupStateStack.pop();
      console.log("pop");
      /*
       If the character is a closing brace (),
       the reader retrieves the current state from the stack.
      */
    }
    else {


      }


    }

}
$(window).on('load', function() {

  var template = document.getElementById("rtftemplate");
  parse(template.innerHTML);

});
