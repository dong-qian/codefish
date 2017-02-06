<script type="text/javascript">
    var myGameObject;
    var myPlanets = [];
    var imgArray = new Array();
    imgArray[0] = new Image();
    imgArray[0].src = "/static/images/Planet1.bmp";
    imgArray[1] = new Image();
    imgArray[1].src = "/static/images/Planet2.bmp";
    imgArray[2] = new Image();
    imgArray[2].src = "/static/images/Planet3.bmp";
    var restart = 0;

    function startGame() {
        myPlanets = [];
        myGameObject = new component(30, 30, "/static/images/ShipBase.bmp", 10, 120, "image");
        myScore = new component("30px", "Consolas", "white", 280, 40, "text");
        space.start();
        space.clear();
   }
    // create game area to contain components
    var space = {
        canvas: document.getElementById("myCanvas"),
        start: function(){
            this.canvas.width = 480;
            this.canvas.height = 270;
            this.frameNo = 0;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateSpace, 20); // 50 frames per sec
            window.addEventListener('keydown', function (e) {
                space.keys = (space.keys || []);
                space.keys[e.keyCode] = true;
            })
            window.addEventListener('keyup', function (e) {
                space.keys[e.keyCode] = false;
            })
        },
        clear: function(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function() {
            clearInterval(this.interval);
        }
    }
    // create component of the game (Game object)
    function component(width, height, color, x, y, type){
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.x = x;
        this.newX = 0;
        this.y = y;
        this.newY = 0;
        this.update = function(){
            ctx = space.context;
            if (type == "image") {
                ctx.drawImage(this.image, this.x, this.y,this.width, this.height);
            }else if (type == "text"){
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            }else{
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        this.newPos = function(){
            this.x += this.newX;
            this.y += this.newY;
        }

        this.gameOver = function(Planet){
            var shipleft = this.x;
            var shipright = this.x + (this.width);
            var shiptop = this.y;
            var shipbottom = this.y + (this.height);

            var Planetleft = Planet.x;
            var Planetright = Planet.x + (Planet.width);
            var Planettop = Planet.y;
            var Planetbottom = Planet.y + (Planet.height);

            var over = true;
            if ((shipbottom < Planettop) ||
                   (shiptop > Planetbottom) ||
                   (shipright < Planetleft) ||
                   (shipleft > Planetright)) {
               over = false;
            }
            return over;
        }
    }

    function everyinterval(n) {
        if ((space.frameNo / n) % 1 == 0) {return true;}
        return false;
    }


    function updateSpace(){
        var width, height, x, y, img;

        for (i = 0; i < myPlanets.length; i += 1) {
            if (myGameObject.gameOver(myPlanets[i])) {
                space.stop();
                ctx.font = "30px Arial";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", 240, 150);
                return;
            }
        }
        space.clear();
        space.frameNo += 1;

        if (space.frameNo == 1 || everyinterval(50)) {
            height = Math.floor((Math.random() * 20) + 20);
            width = Math.floor((Math.random() * 40) + 20);
            x = space.canvas.width - 40;
            y = Math.floor((Math.random() * 260) + 10);
            img = Math.floor((Math.random() * 3) + 0);
            myPlanets.push(new component(width, height, imgArray[img].src, x, y, "image"));
        }

        for (i = 0; i < myPlanets.length; i += 1) {
            myPlanets[i].x += -1;
            myPlanets[i].update();
        }



        myGameObject.newX = 0;
        myGameObject.newY = 0;
        if (space.keys && space.keys[37]) {myGameObject.newX = -1; }
        if (space.keys && space.keys[39]) {myGameObject.newX = 1; }
        if (space.keys && space.keys[38]) {myGameObject.newY = -1; }
        if (space.keys && space.keys[40]) {myGameObject.newY = 1; }

        myScore.text="SCORE: " + space.frameNo;
        myScore.update();
        myGameObject.newPos();
        myGameObject.update();
    }
</script>