var x=28,//Board width (cells)
    y=20,//Board height (cells)
    bc=112,//Bomb count (recommended density between 1/2.4 and 1/10)
    bombs=[],//initializing to empty
    flags=[],//initializing to empty
    colors = ['#1976d2','#3a8e3d','#d33433','#7b1fa2','#ff9100','darkturquoise','black','gray'];//colors for nums 1-8
var ix=28;iy=20;ib=112;//input values
var varbs = document.querySelector(":root");//Get CSS variables
var start = Date.now()
var started = 0;
$('body').mousedown(function(e){if(e.button==1)return false});
window.addEventListener("resize",rsz,true);//Resize listener
createBoard();//Start

//Controls Functions
function lc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "b1"||self.className == "b2") return // Already-Clicked Check
    if(bombs === undefined || bombs.length == 0){initialize(c1,c2); return} // Initialize Check
    if(self.hasChildNodes() && self.firstChild.className=="flag") return // Stop click on flag
    if(bombs[c1*y+c2]){self.style.backgroundColor = "red";lose(); return} // Click a Bomb Check    
    self.className = (self.className == 'one' ? 'b1' : 'b2') // Apply Click
    count = bombcheck(c1,c2)
    if(count==0){ // Clear nearby tiles if blank
        if(c1+1<x) lc(c1+1,c2)
        if(c2+1<y) lc(c1,c2+1)
        if(c1 > 0) lc(c1-1,c2)
        if(c2 > 0) lc(c1,c2-1)
        if(c1+1<x && c2+1<y) lc(c1+1,c2+1)
        if(c1+1<x && c2 > 0) lc(c1+1,c2-1)
        if(c1 > 0 && c2+1<y) lc(c1-1,c2+1)
        if(c1 > 0 && c2 > 0) lc(c1-1,c2-1)
    }
    else if (count>0){ // Apply number to self if needed
        self.innerHTML = count
        self.style = "color:"+colors[count-1]
    }
    if((document.getElementsByClassName("one").length+document.getElementsByClassName("two").length)==bc) win();
}//Applies left click (clear) to coordinates, includes most logic
function mc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "one"||self.className == "two") return // Must clear blanks
    if(self.innerHTML && flagcheck(c1,c2) == bombcheck(c1,c2)){ //Allow on numbered tiles with equal numbers flags and bombs
        if(c1+1<x) lc(c1+1,c2)
        if(c2+1<y) lc(c1,c2+1)
        if(c1 > 0) lc(c1-1,c2)
        if(c2 > 0) lc(c1,c2-1)
        if(c1+1<x && c2+1<y) lc(c1+1,c2+1)
        if(c1+1<x && c2 > 0) lc(c1+1,c2-1)
        if(c1 > 0 && c2+1<y) lc(c1-1,c2+1)
        if(c1 > 0 && c2 > 0) lc(c1-1,c2-1)
    }
}//Applies middle click (chord) to coordinates
function rc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "b1"||self.className == "b2") return // Can't flag blanks
    if(bombs === undefined || bombs.length == 0) return // Can't flag while pre-initialized
    if(!self.innerHTML) {
        self.innerHTML = "<img class=\"flag\" valign=\"middle\" align=\"center\" src=\"assets/flag.png\"></img>"
        flags[c1*y+c2] = true
    }
    else {
        self.innerHTML = ""
        flags[c1*y+c2] = false
        }
    document.getElementById("flags").innerHTML = bc-flags.reduce(function(a,b){return a+b},0);
}//Applies right click (flag) to coordinates

//Mechanics Functions
function createBoard(){
    if(document.getElementById("board")) document.getElementById("board").remove()//drop previous board
    var board = $("<table id=\"board\" border=0 cellspacing=0>")
    for(var i=0;i<y;i++){
        row = "<tr>"
        for(var j=0;j<x;j++){
            if((i+j)%2==0){
                row+="<td class=\"one\" id=\"x"+j+"y"+i+"\" data-x="+j+" data-y="+i+" oncontextmenu=\"return false;\"></td>"
            }
            else{
                row+="<td class=\"two\" id=\"x"+j+"y"+i+"\" data-x="+j+" data-y="+i+" oncontextmenu=\"return false;\"></td>"
            }
       }
        board.append($(row+"</tr>"))
   }
    board.append($("</table>"))
    $(document.getElementById("minesweeper") || document.body).append(board)
    
    for(var i=0;i<y;i++){
        for(var j=0;j<x;j++){
            document.getElementById("x"+j+"y"+i).addEventListener("mousedown",function(event){
                p1 = parseInt(this.getAttribute("data-x"))
                p2 = parseInt(this.getAttribute("data-y"))
                if(event.which===1){lc(p1,p2);console.log("("+p1+", "+p2+"): Left")}
                if(event.which===2){mc(p1,p2);console.log("("+p1+", "+p2+"): Middle")}
                if(event.which===3){rc(p1,p2);console.log("("+p1+", "+p2+"): Right")}
            }, false);
        }
    }
    rsz();bombs=[];flags=[];started=0;
    document.getElementById("flags").innerHTML = bc-flags.reduce(function(a,b){return a+b},0);
}//Generates table of y rows and x columns in a div of id="minesweeper" or appended to body
function initialize(a,b){
    b1 = [];
    SpaceReq = 20;
    if(bc/(x*y)>=(1./3.6)) SpaceReq = Math.min(15,(x*y)/10)
    else if(bc/(x*y)>=(1./5.0)) SpaceReq = Math.min(35,(x*y)/5)
    else SpaceReq = Math.min(50,(x*y)/2.5);
    console.log('Space Requirement: '+SpaceReq)
    while(b1.length < bc){
        var rand = Math.floor(Math.random()*x*y);
        if(b1.indexOf(rand) === -1) b1.push(rand);
    }
    for(i=0;i<x*y;i++){
        bombs.push(b1.includes(i)?true:false)
        flags.push(false)
    }
    if(!bombs[a*y+b]) lc(a,b);
    if((document.getElementsByClassName("b1").length+document.getElementsByClassName("b2").length)<SpaceReq) {createBoard();bombs=[];lc(a,b)}
    start = Date.now()
    started=1
}//Ran in lc() to ensure game has sufficient starting area
function bombcheck(a,b){
    c = 0;
    if(a+1<x && bombs[(a+1)*y+b]) c++;//right
    if(b+1<y && bombs[a*y+(b+1)]) c++;//down
    if(a > 0 && bombs[(a-1)*y+b]) c++;//left
    if(b > 0 && bombs[a*y+(b-1)]) c++;//up
    if(a+1<x && b+1<y && bombs[(a+1)*y+(b+1)]) c++;//down right
    if(a+1<x && b > 0 && bombs[(a+1)*y+(b-1)]) c++;//up right
    if(a > 0 && b+1<y && bombs[(a-1)*y+(b+1)]) c++;//down left
    if(a > 0 && b > 0 && bombs[(a-1)*y+(b-1)]) c++;//up left
    return c;
}//Returns number of bombs around coords (a,b)
function flagcheck(a,b){
    c = 0;
    if(a+1<x && flags[(a+1)*y+b]) c++;//right
    if(b+1<y && flags[a*y+(b+1)]) c++;//down
    if(a > 0 && flags[(a-1)*y+b]) c++;//left
    if(b > 0 && flags[a*y+(b-1)]) c++;//up
    if(a+1<x && b+1<y && flags[(a+1)*y+(b+1)]) c++;//down right
    if(a+1<x && b > 0 && flags[(a+1)*y+(b-1)]) c++;//up right
    if(a > 0 && b+1<y && flags[(a-1)*y+(b+1)]) c++;//down left
    if(a > 0 && b > 0 && flags[(a-1)*y+(b-1)]) c++;//up left
    return c; 
}//Returns number of flags around coords (a,b)
function lose(){
    alert('L you lost lol')
    for(i in bombs){//view bombs
        if(bombs[i] === true) document.getElementById("x"+Math.floor(i/y)+"y"+i%y).innerHTML = "<img class=\"mine\" valign=\"middle\" align=\"center\" src=\"assets/mine.png\"></img>";
    }
    createBoard()
}//Loss state function
function win(){
    alert('NO WAY YOU WON')
    createBoard()
}//Win state function
setInterval(function(){
    if (started) document.getElementById("timer").innerHTML = Math.floor((Date.now()-start)/1000)
    else document.getElementById("timer").innerHTML = 0
},500)

//Display Functions
function rsz(){
    height = $(window).height();
    width = $(window).width();
    cellsize = Math.floor(Math.min(Math.max(30,50*(8/Math.min(x,y))),0.7*width/x,0.75*height/y))
    margin = (height-(.17*height+y*(cellsize+2)))/2-1
    varbs.style.setProperty('--cell',cellsize+'px')
    varbs.style.setProperty('--font',Math.round(cellsize * .7)+'px')
    varbs.style.setProperty('--borders',border = Math.round(cellsize * .1)+'px')
    varbs.style.setProperty('--small',Math.round(cellsize * .8)+'px')
    varbs.style.setProperty('--navh',Math.floor(.1*height)+'px')
    varbs.style.setProperty('--footh',Math.floor(.07*height)+'px')
    varbs.style.setProperty('--umargin',Math.ceil(margin)+'px')
    varbs.style.setProperty('--dmargin',Math.floor(margin)+'px')
    document.querySelector('.scoreboard').style.setProperty("margin-left",Math.max((width/2-500),25)+"px")
    console.log("Page Resized: "+width+", "+height)
}//Change CSS size variables based on page and table size

//Admin Functions?
function easyChangeBoard(w,h,d) {
    if (w<8 || w>40) throw new Error('Width must be between 8 and 40 (default is 28)')
    if (h<8 || h>24) throw new Error('Height must be between 8 and 24 (default is 20')
    if (d<0.1 || d>0.4) throw new Error('Density must be between 0.1 and 0.4 (default is 0.2)')
    x = w;
    y = h;
    bc = Math.ceil(w*h*d);
    createBoard();
}

//Settings Functions
function change(){
    oldSize = ix*iy; oldBombs = ib;
    ix=parseInt(document.getElementById("width").value)
    iy=parseInt(document.getElementById("height").value)
    ib=parseInt(document.getElementById("mines").value)
    document.getElementById("bombleft").innerHTML = Math.ceil(ix*iy*0.1)
    document.getElementById("bombright").innerHTML = Math.floor(ix*iy*0.4)
    document.getElementById("mines").setAttribute("min",Math.ceil(ix*iy*0.1)) 
    document.getElementById("mines").setAttribute("max",Math.floor(ix*iy*0.4)) 
    if (oldBombs==ib) {ib=Math.floor(ix*iy*oldBombs/oldSize);document.getElementById("mines").value=ib}
    document.getElementById("wspan").innerHTML = ix
    document.getElementById("hspan").innerHTML = iy
    document.getElementById("bspan").innerHTML = ib
    document.getElementById("dspan").innerHTML = Math.round(ib*100/(ix*iy))/100
}
function regenerate(){
    if(!confirm("Reset the game board with new settings?")) return
    x = parseInt(document.getElementById("width").value)
    y = parseInt(document.getElementById("height").value)
    bc = parseInt(document.getElementById("mines").value)
    createBoard()
}
