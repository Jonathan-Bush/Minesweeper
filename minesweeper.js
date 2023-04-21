var x=40,
    y=24;

function createBoard() {
    if(document.getElementById("board")){document.getElementById("board").remove()}
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
                if(event.which===1){lc(this.getAttribute("data-x"),this.getAttribute("data-y"))};
                if(event.which===2){mc(this.getAttribute("data-x"),this.getAttribute("data-y"))};
                if(event.which===3){rc(this.getAttribute("data-x"),this.getAttribute("data-y"))};
            }, false);
        }
    }
}

createBoard();

function lc(x,y){
    console.log("("+x+", "+y+"): Left")
    self = document.getElementById("x"+x+"y"+y)
    if(self.className == "one"){self.className = "b1"}
    if(self.className == "two"){self.className = "b2"}
}
function mc(x,y){
    console.log("("+x+", "+y+"): Middle")
    self = document.getElementById("x"+x+"y"+y)
}
function rc(x,y){
    console.log("("+x+", "+y+"): Right")
    self = document.getElementById("x"+x+"y"+y)
}