

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
    if(token == "closing" ){

        tokensString += "}";

    }
    if(token == "char" ){
      tokensString += ""+$token.html();
    }else    {
          tokensString += "\\"+token;
        }
  }


  console.log(tokensString);
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
  var template = document.getElementById("rtftemplate");
  var content = template.innerHTML;
  download("test.rtf",content);
}
function rtfUnicodeToString(unicode){
  unicode = unicode.replace("\\'","\\u0025");;
  return unescape(JSON.parse('"'+unicode+'"'));
}
//alert(rtfUnicodeToString("\\'dc"));


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


function parse(rtftext){

  function writeToken(className,addClass,content){
    if(content == undefined){
      content ="";
    }
    if(jQuery.type(className) === "string"){


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

  console.log($(writeToken("className","addClass")).data("class"));
//  console.log($(writeToken("className","addClass")).attr("data-content"));
//
  rtftext = rtftext.replace(/\\*\\generator([^\}]*)\}/g,writeToken("generator","$1")+"}");
  rtftext = rtftext.replace(/\\\*\\pn/g,writeToken("pn",""));
  rtftext = rtftext.replace(/\\pntxt(.)([^\}]*)\}/g,writeToken("pntxt$1","$2")+"}");
  rtftext = rtftext.replace(/([^\\]|^)({\\\*)/g,"$1"+writeToken({token:"opening",allowOmit:true}));
  rtftext = rtftext.replace(/([^\\]|^)({)/g,"$1"+writeToken({token:"opening",allowOmit:false}));
  rtftext = rtftext.replace(/([^\\]|^)}/g,"$1"+writeToken("closing",""));
  rtftext = rtftext.replace(/([^\\])}/g,writeToken("closing",""));

  rtftext = rtftext.replace(/\\}/g,writeToken("char","","}"));
  rtftext = rtftext.replace(/\\{/g,writeToken("char","","{"));

  rtftext = rtftext.replace(/\n/g,writeToken("newline",""));
  rtftext = rtftext.replace(/\\rtf1/g,writeToken("rtf1","")+"");
  rtftext = rtftext.replace(/\\ansicpg1252/g,writeToken("ansicpg1252","")+"");
  rtftext = rtftext.replace(/\\ansi/g,writeToken("ansi","")+"");
  rtftext = rtftext.replace(/\\nouicompat/g,writeToken("nouicompat","")+"");
  rtftext = rtftext.replace(/\\fonttbl/g,writeToken("fonttbl","")+"");
  rtftext = rtftext.replace(/\\cpg1252/g,writeToken("cpg1252","")+"");
  rtftext = rtftext.replace(/\\deff([0-9]+)/g,writeToken("deff$1","")+"");
  rtftext = rtftext.replace(/\\viewkind4/g,writeToken("viewkind4","")+"");
  rtftext = rtftext.replace(/\\uc1/g,writeToken("uc1","")+"");
  rtftext = rtftext.replace(/\\d/g,writeToken("d","")+"");
  rtftext = rtftext.replace(/\\sa200/g,writeToken("sa200","")+"");
  rtftext = rtftext.replace(/\\sl276/g,writeToken("sl276","")+"");
  rtftext = rtftext.replace(/\\slmult1/g,writeToken("slmult1","")+"");
  rtftext = rtftext.replace(/\\fs22/g,writeToken("fs22","")+"");
  rtftext = rtftext.replace(/\\lang7/g,writeToken("lang7","")+"");
  rtftext = rtftext.replace(/\\pard/g,writeToken("pard","")+"");

  rtftext = rtftext.replace(/\\tab/g,writeToken("tab","")+"");
  rtftext = rtftext.replace(/\\fi-360/g,writeToken("fi-360","")+"");
  rtftext = rtftext.replace(/\\li720/g,writeToken("li720","")+"");
  rtftext = rtftext.replace(/\\sl240/g,writeToken("sl240","")+"");





  //rtftext = rtftext.replace(/\\sl240/g,writeToken("sl240","")+"");


  rtftext = rtftext.replace(/\\pntext/g,writeToken("pntext","")+"");

  rtftext = rtftext.replace(/\\pnlvlblt/g,writeToken("pnlvlblt","")+"");
  rtftext = rtftext.replace(/\\pnlvlbody/g,writeToken("pnlvlbody","")+"");
  rtftext = rtftext.replace(/\\pnf([0-9]+)/g,writeToken("pnf$1","")+"");
  rtftext = rtftext.replace(/\\pndec/g,writeToken("pndec","")+"");
  //\pndec


  rtftext = rtftext.replace(/\\pnindent([0-9]+)/g,writeToken("pnindent$1","")+"");
  rtftext = rtftext.replace(/\\pnstart([0-9]+)/g,writeToken("pnstart$1","")+"");
  rtftext = rtftext.replace(/\\pndec/g,writeToken("pndec","")+"");
  //rtftext = rtftext.replace(/\\pntxta/g,writeToken("pntxta","")+"");
  rtftext = rtftext.replace(/\\pn/g,writeToken("pn","")+"");

//pn\pnlvlbody\pnf0\pnindent0\pnstart1\pndec\pntxta





  var colorClasses = [];

  rtftext = rtftext.replace(/\\colortbl ((\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+))?;)*/g,function(x){
    console.log("XX: "+x);
    //x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));/g,"color: rgb($2,$3,$4)");
    var i = 0;
      x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));|;/g,function(a0,a1,r,g,b){
        var res = "";
        if(a0 == ";"){
          res = "<style> .cf0{color: rgb(0,0,0)}</style>";
          colorClasses.push("cf0");
        }else{
          res = "<style> .cf"+i+"{color: rgb("+r+","+g+","+b+")}</style>";
          colorClasses.push("cf"+i);
        }

        i++;
        return res;
        console.log(arguments);
      });
  //  console.log(x);
    return x;
  //  console.log(arguments);
  });
  rtftext = rtftext.replace(/\\colortbl/g,""+writeToken("colortbl",""));
  rtftext = rtftext.replace(/\\cf([0-9]+)/g,writeToken("cf$1",""));

  rtftext = rtftext.replace(/\\b0/g,""+writeToken("b0",""));
  rtftext = rtftext.replace(/\\b/g,""+writeToken("b",""));

  rtftext = rtftext.replace(/\\i0/g,""+writeToken("i0",""));
  rtftext = rtftext.replace(/\\i/g,""+writeToken("i",""));

  rtftext = rtftext.replace(/\\ulnone/g,""+writeToken("ulnone",""));
  rtftext = rtftext.replace(/\\ul/g,""+writeToken("ul",""));

  rtftext = rtftext.replace(/\\par/g,""+writeToken("par","")+"<br></br>");
  rtftext = rtftext.replace(/(\\'[0-9a-fA-F]+)/g,function(x){
    //console.log(arguments);
    var cha = rtfUnicodeToString(x);
    //console.log(x+" => "+cha);
    return cha;
  });
  rtftext = rtftext.replace(/\\f([0-9]+)\\fnil\\fcharset([0-9]+) ([^;]*);/g,"<style> .f$1 ~ *{font-family: $3}</style>");
  rtftext = rtftext.replace(/\\f([0-9]+)/g,writeToken("f$1",""));
  rtftext = rtftext.replace(/\\fnil/g,writeToken("fnil",""));

  rtftext = rtftext.replace(/\\fs([0-9]+)/g,writeToken("fs$1","")+"<style> .fs$1 ~ *{font-size: $1px}</style>");
//rtftext = rtftext.replace(/>[^<]*([^<])[^<]*</g,function(){
//  console.log(arguments);
//});






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
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
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

    function parseArgument(){//gets next argument from token stream


    }
    function parseArgument(){//gets next argument from token stream


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
