var ScoreBoard = {
    "crateFromStorage"   :function(obj){
        var players = obj.player;
        var rounds = obj.rounds;
        var holder = $("#scoreboard");
        holder.html("");
        var table = $("<table>");
        table.addClass("table table-striped table-bordered table-condensed");
        table.attr("id","scoretable");
        this.addHeader(table, players);
        var tbody = $("<tbody>");
        table.append(tbody);
        holder.append($("<h2 class='scoreboeadhead'>").text("Scoreboard"));
        holder.append(table);
        this.appendRounds(tbody, players, rounds);
        ScoreBoard.setPlayerMessage();
    }, 
    "setPlayerMessage":function(){
        var name = ScoreBoard.getRoundMasterName();
        $("#playerMessage").html("<b>"+name+"</b> you are next");
    },
    "addHeader":function(table,players){
        var head = $("<thead>");
        var row= $("<tr>");
        var cell= $("<th class='firsthead'>").text("Round");
        //cell.addClass("countCell");
        row.append(cell);
        cell= $("<th class='firsthead'>").text("Video Score");
        row.append(cell);
        head.append(row);
        for(i = 0; i < players.length;i++){
            var celltext =players[i] +"<br />" +MyStorage.getScoreByPlayerId(i) +" Points";
            cell = $("<th>").html(celltext);
            cell.addClass("cellPlayerName");
            row.append(cell);
        }
        table.append(head);
    },
    "appendRounds":function(table,players,rounds){
        for(var i = 0 ; i < rounds.length;i++){
            var isCurrentRound = (rounds.length-1 == i);
            var akt = rounds[i];
            var row = $("<tr>");
            var countCell = $("<td>").text("#"+(i+1));
            countCell.addClass("countCell");
            var imageCell = $("<td>");
            if(isCurrentRound && !MyStorage.roundHasEnded(i)){
                var endroundButton = $("<button>");
                endroundButton.addClass("btn btn-danger");
                endroundButton.text("End This Round");
                endroundButton.attr("id","endRoundButton");
                endroundButton.click(function(){
                    MainApp.endRound(); 
                });
                imageCell.append(endroundButton);
            }else{
                imageCell.text(MyStorage.getVideoScoreFromRound(i));
                imageCell.addClass("scorecellvideo");
            }
            var image = $("<div>").text("no image");
            if(akt.thumbnail){
                image = $("<img>").attr("src",akt.thumbnail.sqDefault);
            }
            imageCell.append(image);
            row.append(countCell);
            row.append(imageCell);
            table.prepend(row);
            for(var j = 0; j < players.length; j++){
                var playerCell = $("<td>");
                if(j == ScoreBoard.getRoundMasterIdForRound(i)){
                    playerCell.addClass("roundmaster");
                    playerCell.append(image);
                }else{ 
                    if(isCurrentRound && !MyStorage.roundHasEnded(i)){
                        playerCell.append(ScoreBoard.getSelectBox());
                    }else{
                        playerCell.text(MyStorage.getPlayerScore(i, j)) ;
                        playerCell.addClass("scorecell");
                    }
                }
                row.append(playerCell);
            }
        }
    },
    "refresh":function(){
        ScoreBoard.crateFromStorage(MyStorage.getStorage());
    },
    "getRoundMasterIdForRound":function(roundNr){
        var players = MyStorage.getPlayers();
        return (roundNr %  players.length);
    },
    "getSelectBox":function(){
        var select = $("<select>");
        opt = $("<option>").text("--");
        select.append(opt);
        for( var i =0; i <=10 ; i++  ){
            opt = $("<option>");
            opt.text(i);
            select.append(opt);
        }
        return select;
    },
    "getCurrentRoundId":function(){
        var rounds = MyStorage.getRounds();
        return rounds.length;
    },
    "getCurrentRoundRow":function(){
        return $("#endRoundButton").parent().parent();
    },
    "getCurrendRoundSelects":function(){
        return ScoreBoard.getCurrentRoundRow().find("select");
    },
    "getRoundMasterName":function(){
        var roundId = ScoreBoard.getCurrentRoundId();
        var players = MyStorage.getPlayers();
        var masterId = ScoreBoard.getRoundMasterIdForRound(roundId);
        return players[masterId];

    },
    "allHaveAnswered":function(){
        var selects = ScoreBoard.getCurrendRoundSelects();
        for(var i = 0; i < selects.length; i++ ){
            if($(selects[i]).val() =="--"){
                return false;
            }
        }
        return true;
    },
    "pushScore":function(){
        $("#playerFrame").css("display","none");
        $("#endRoundButton").css("display","none");
        var allrounds = MyStorage.getRounds();
        var aktRound = allrounds[ScoreBoard.getCurrentRoundId()-1];
        var scoreHolder = aktRound.ytgamescore;
        var masterId = ScoreBoard.getRoundMasterIdForRound(ScoreBoard.getCurrentRoundId()-1);
        var players = MyStorage.getPlayers();
        var selects = ScoreBoard.getCurrendRoundSelects();
        var masterPushed = false;
        for(var i = 0; i < players.length; i++){
            if(i == masterId){
                scoreHolder.push("--");
                masterPushed= true;
            }else{
                var currentselect = $(selects[i]);
                if(masterPushed){
                    var playerid = i-1;
                    currentselect = $(selects[playerid]);
                }
                scoreHolder.push(currentselect.val());
                currentselect.replaceWith($('<div>').text(currentselect.val()));
            }
        }
        MyStorage.addScoreForRound(ScoreBoard.getCurrentRoundId()-1,scoreHolder);
    }
}