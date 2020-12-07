'use strict';
const cardContentArray =
[
    { //0
        type: 'fa-bath',
        isShow: false,
        isWin:false,
    },
    { //1
        type: 'fa-camera-retro',
        isShow: false,
        isWin:false,
    },
    { //2
        type: 'fa-microchip',
        isShow: false,
        isWin:false,
    },
    { //3
        type: 'fa-shower',
        isShow: false,
        isWin:false,
    },
    { //4
        type: 'fa-car',
        isShow: false,
        isWin:false,
    },

    { //5
        type: 'fa-bath',
        isShow: false,
        isWin:false,
    },
    { //6
        type: 'fa-camera-retro',
        isShow: false,
        isWin:false,
    },
    { //7
        type: 'fa-microchip',
        isShow: false,
        isWin:false,
    },
    { //8
        type: 'fa-shower',
        isShow: false,
        isWin:false,
    },
    { //9
        type: 'fa-car',
        isShow: false,
        isWin:false,
    },

]


let isFirstClick = false;
let lastCardType = null;
let lastCardId = null;
let startTiemstamp = 0;
let isEnd = false;
let endTimestamp = 0;

const updateTimerDisplay = (time)=>{
    const timer = document.querySelector('.timer__display');
    timer.textContent = time;
}

const newGame = () =>{
    
    shuffle(cardContentArray);
    updateTimerDisplay('00.00');
    startTiemstamp = new Date().getTime();
    isFirstClick = false;
    lastCardId=null;
    isEnd=false;
    const cards = document.querySelectorAll('.card');
     //face-back leveszi a mintát
    for( let conentItem of cardContentArray)  {  
        cards.forEach(card=>card.classList.remove(conentItem.type))
        conentItem.isWin=false;
        conentItem.isShow = false;
    }
    //face-back leveszi a mintát
    cards.forEach((card, index)=>{
        const faceBack = card.querySelector('.card__face--back');
        faceBack.classList.add(cardContentArray[index].type);
    });

    //minden kártya kérdőjeles ez a default
    cards.forEach(item=>{
        if(item.classList.contains('is-flipped'))
            item.classList.remove('is-flipped');
    });
}

//by Cserko mester
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
 
const showCard = (cardId) =>{
    cardContentArray[cardId].isShow=true;
    const cards = document.querySelectorAll('.card');
    cards.forEach((card,index)=>{
        if(index===cardId){
            card.classList.add('is-flipped');
        }
    })
}
const hideCard = (cardId) =>{
    cardContentArray[cardId].isShow=false;
    const cards = document.querySelectorAll('.card');
    cards.forEach((card,index)=>{
        if(index===cardId){
            card.classList.remove('is-flipped');
        }
    })
}
/* feliratkozom a káryták click eseményére */
const openCardClickListener = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(item=>item.addEventListener('click', cardClickListener));
}
let isTimerRunning=false;
const cardClickListener = (e) =>{

    if(isTimerRunning) {
        console.log('animálás közben kattintottál')
        return;
    }

    const cardOnClick = e.target.parentNode;
    const cardId = parseInt(cardOnClick.getAttribute('index'));
    const cardType = cardContentArray[cardId].type;

    console.log('Erre kakttintottal', cardId);
    //ha gyöztes kártya akkor nincs mit tenni
    if(cardContentArray[cardId].isWin)
        return;

    // Ha még nem klikkelt akkor első indulás lesz
    if(!isFirstClick){
        isFirstClick = true;
        console.log('első indulás volt');
        startTiemstamp = new Date().getTime();
    }
    //ha nincs utolsó kártya akkor még lehet játék van
   if(lastCardType === null){
       if(!cardContentArray[cardId].isShow){
            showCard(cardId);
            lastCardType = cardType;
            lastCardId = cardId;
        }
    }else{
        showCard(cardId);
        //összehasonlitom az előzö és a mostani kártyával, 
        //ha tipus egyezik akkor a kártyák így maradnak
        if(lastCardType === cardType){
            cardContentArray[lastCardId].isWin = true;
            cardContentArray[cardId].isWin = true;
            lastCardId=null;
            lastCardType=null;

        }else{ 
            //nem találat, elrejtem a korábbi és a mostani kártyákat is
            isTimerRunning=true;
            setTimeout(function() {
                hideCard(lastCardId);
                hideCard(cardId);   
                lastCardId=null;
                lastCardType=null;
                isTimerRunning=false;
            }, 400);
        }
 
    }
   //ha vége a játéknak akkor megáll az óra és 
   //5sec után nullázódik a számláló
   if(cardContentArray.every( card=> card.isShow === true)){
     console.log('vége');
     isEnd = true;
     endTimestamp = new Date().getTime();
     isFirstClick = false;//ezzel megáll a timer
   }
}


openCardClickListener();

//ez itt mindig ketyeg
setInterval((function(){
    const elapsedStart = (new Date().getTime() - startTiemstamp) /1000;
    
        //szám formázása
        let formatted = elapsedStart.toLocaleString('en', {  minimumIntegerDigits:2,
                                                        maximumFractionDigits:2,
                                                        minimumFractionDigits:2,
                                                        useGrouping:false
                                                    });
        //Játék indul
        //az időbélyeg kezdetét az első klikkelés állítja be
        if(isFirstClick)
            updateTimerDisplay(formatted);
        //ha látszódik minden kártya akkor vége a játknak
        if(isEnd){
            const elapsedEnd = (new Date().getTime() - endTimestamp) /1000;
            if(elapsedEnd >= 5)
                    newGame();
        }
    }),
    100);

 newGame();