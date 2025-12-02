//récupération des élements html
 const board=document.querySelector("#game-board");
 const btnStop=document.querySelector("#btn-stop");
 const imgSnake=document.querySelector("#img-snake");
 const score=document.querySelector("#score");
 const plusHautScore=document.querySelector("#plushautscore");
 const textInstruction=document.querySelector("#text-instruction");

   // variable de jeu
   const tailleGrid=20;
 let tabDePositionDuSnake=[{x:10,y:10}];
 let tabDePositionDeFood=generatePositionFood();
 let highScore=0;
 let direction="up";
 let gameInterval;
 let delaiJeu=200;
 let gameStarted=false;

 function dessiner(){
    board.innerHTML="";
    dessinerSnake();
    dessinerFood();
    updateScore();
 }

 function dessinerSnake(){
    tabDePositionDuSnake.forEach( segment=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    })
 }

 function createGameElement(element,nomClassCss){
    const el=document.createElement(element);
   el.className=nomClassCss; // donne le nom de la classe css de l'élement
   return el;
 }

 function setPosition(element,position){
     element.style.gridColumn=position.x;
     element.style.gridRow=position.y;
 }
 function dessinerFood(){
   if(gameStarted){
    const foodElement=createGameElement("div","food");
    setPosition(foodElement,tabDePositionDeFood);
    board.appendChild(foodElement);     
   }
 }
function generatePositionFood(){
  const x= Math.floor(Math.random()*tailleGrid)+1;
  const y= Math.floor(Math.random()*tailleGrid)+1;
  return {x,y};
}
// fait bouger le snake
function move(){
   const head={...tabDePositionDuSnake[0]};
   switch(direction){
      case "up":
         head.y--;
         break;
      case "down":
         head.y++;
         break;
      case "right":
       head.x++;
       break;
      case "left":
         head.x--;
         break;
   }
   tabDePositionDuSnake.unshift(head);
   
   if(head.x===tabDePositionDeFood.x&&head.y===tabDePositionDeFood.y){
      tabDePositionDeFood=generatePositionFood();
      augmenterVitesse();
      clearInterval(gameInterval);
      gameInterval=setInterval(()=>{
         move();
         verifierColision();
         dessiner();

      },delaiJeu);
   }else{
      tabDePositionDuSnake.pop();
   }

}

function gameStart(){
   gameStarted=true; // verifie si le jeu est lancé déjà
   textInstruction.style.display="none";
   imgSnake.style.display="none";
   btnStop.style.display="block";
   gameInterval=setInterval(()=>{
     move();
    verifierColision();
     dessiner();
   },delaiJeu);
}

function ecouterLesBoutons(event){
   if((!gameStarted && event.code==='Space')||(!gameStarted&&event.key===' ')){
     gameStart();
   }
   else{
      switch(event.key){
         case "ArrowUp":
            direction="up";
            break;
            case "ArrowDown":
            direction="down";
            break;
            case "ArrowLeft":
            direction="left";
            break;
            case "ArrowRight":
            direction="right";
            break;
      }
   }
}

imgSnake.addEventListener("click",gameStart);
document.addEventListener('keydown',ecouterLesBoutons);

function augmenterVitesse(){
  if(delaiJeu>150){
   delaiJeu-=5;
  }else if(delaiJeu>100){
   delaiJeu-=3;
  }else if(delaiJeu>50){
   delaiJeu-=2;

  }else if(delaiJeu>25){
    delaiJeu-1;
  }
}
function verifierColision(){
   const head=tabDePositionDuSnake[0];
   if(head.x<1 || head.x>tailleGrid || head.y<1||head.y>tailleGrid){
      resetGame();
   }
   for(let i=1;i<tabDePositionDuSnake.length;i++){
      if(head.x===tabDePositionDuSnake[i].x && head.y===tabDePositionDuSnake[i].y){
         resetGame();
      }
   }
}

function resetGame(){
   updateHightScore();
   stopGame();
   tabDePositionDuSnake=[{x:10,y:10}];
   tabDePositionDeFood=generatePositionFood();
   direction='right';
   delaiJeu=200;
   updateScore();
}
 function updateScore(){
      const scoreActuel=tabDePositionDuSnake.length-1;
      score.textContent=scoreActuel.toString().padStart(3,'0');     
 }
 function stopGame(){
   clearInterval(gameInterval);
   gameStarted=false;
   textInstruction.style.display="block";
   imgSnake.style.display='block';
   btnStop.style.display='none';
 }
 function updateHightScore(){
   const scoreActuel=tabDePositionDuSnake.length-1;
   if(scoreActuel>highScore){
      highScore=scoreActuel;
      plusHautScore.textContent=highScore.toString().padStart(3,'0');

   }
   plusHautScore.style.display='block';
 }
 btnStop.addEventListener("click",stopGame);
// test moving
// setInterval(()=>{
//    move();
//    dessiner();
// },200)
// dessiner();