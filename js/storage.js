var MyStorage = {
    "init":function(){
        if(MyStorage.browserIsCool()){
            if(!MyStorage.thereIsAStorage()){
                MyStorage.createNewStorage();
            }
            return true;
        }else{
            return false;
        }
    },
    "browserIsCool":function(){
        return (typeof(Storage)!=="undefined");
    },
    "thereIsAStorage":function(){
        if(localStorage.getItem("scoreboard") != null && MyStorage.getRounds().length > 0){
            return true;
        }
        return false;
    },
    "getScoreByPlayerId":function(playerId){ 
        var rounds =   MyStorage.getRounds();
        var points = 0;
        for(var i = 0; i< rounds.length;i++ ){
            var roudnScoreArray =rounds[i].ytgamescore;
            if(roudnScoreArray[playerId] == "--"){
                for(var key = 0; key <roudnScoreArray.length; key++){
                    if(roudnScoreArray[key] != "--"){
                        points = points +(roudnScoreArray[key]*1);
                    }
                }
            }
        }
        return points;
    },
    "createNewStorage":function(){
        var newStorage = {
            'player': Array(), 
            'rounds':Array()
            };
        MyStorage.setStorage(newStorage);
    },
    "setStorage":function(obj){ 
        localStorage.setItem("scoreboard",JSON.stringify(obj)); 
    },
    "getStorage":function(){
        return JSON.parse(localStorage.getItem("scoreboard"));
    },
    "addPlayer":function(name){
        var store = MyStorage.getStorage();
        store.player.push(name);
        MyStorage.setStorage(store);
    },
    "getPlayers":function(){
        var store = MyStorage.getStorage();
        return store.player;
    },
    "delPlayer":function(i){
        var store = MyStorage.getStorage();
        store.player.splice(i,1);
        MyStorage.setStorage(store);
        MainApp.refreshPlayerList();
    },
    "addRound":function(ytVideoObject){
        var ytgamescore =Array();
        ytVideoObject.ytgamescore = ytgamescore;
        var store = MyStorage.getStorage();
        store.rounds.push(ytVideoObject);
        MyStorage.setStorage(store);
    },
    "getRounds":function(){
        var store = MyStorage.getStorage();
        return store.rounds;
    },
    "removelastRound":function(){
        var store = MyStorage.getStorage();
        store.rounds.pop();
        MyStorage.setStorage(store);
    },
    "clear":function(){
        localStorage.clear();
        MyStorage.createNewStorage();
    },
    "addScoreForRound":function(round, score){
        var store = MyStorage.getStorage();
        store.rounds[round].ytgamescore = score;
        MyStorage.setStorage(store);
    },
    "getPlayerScore":function(round,playerId){
        var store = MyStorage.getStorage();
        if(store.rounds[round].ytgamescore[playerId]){
            return store.rounds[round].ytgamescore[playerId];
        }
        return 0;
    },
    "getVideoScoreFromRound":function(round){
        var store = MyStorage.getStorage();
        var ret =0;
        for(var i = 0; i < store.rounds[round].ytgamescore.length;i++){
            if(store.rounds[round].ytgamescore[i] != "--"){
            ret+=     (store.rounds[round].ytgamescore[i])*1;
            }
        }
        return ret;
        
    },
    "roundHasEnded":function(roundId){
        var round = MyStorage.getRounds();
        var aktround = round[roundId];
        return (aktround.ytgamescore.length != 0);
    }
}