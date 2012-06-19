$(document).ready(function(){
    if(MyStorage.thereIsAStorage()){
        $("#continueGame").css("display","inline-block");
    }
    $("#infoButton").click(function(){
        $("#infoArea").slideToggle("fast",function(){
            if($("#infoButton").html() == '<i class="icon-info-sign icon-white"></i> About'){
                $("#infoButton").html('<i class="icon-info-sign icon-white"></i> Hide Info') ;
            }else{
                $("#infoButton").html('<i class="icon-info-sign icon-white"></i> About');
            } 
        });
    })
    $("#continueGame").click(function(){
        if(!MyStorage.roundHasEnded(MyStorage.getRounds().length-1)){
            MyStorage.removelastRound();
            ScoreBoard.refresh();
            return;
        }
        MainApp.continueGame();
    });
    $("#startGame").click(function(){
        if(MyStorage.getPlayers().length > 1){
            MainApp.startnewGame();
            ScoreBoard.crateFromStorage(MyStorage.getStorage());
            $("#playerarea").slideDown();
        }else{
            alert("You have to add minimum two players");
        }
    });
    $("#gotoAddplayer").click(function(){
        MyStorage.clear();
        MainApp.refreshPlayerList();
        MainApp.setModalHeader("Add Players");
        $("#startGame").css("display","inline-block");
        $("#gotoAddplayer").css("display","none");
        $("#continueGame").css("display","none");
        $("#myCarousel").carousel(1);
        $("#newPlayerName").val("");
    });
    
    $("#howtoplay").click(function(){
        MainApp.setModalHeader("How To Play");
        $("#myCarousel").carousel(2);
    });
    
    $(".form-search button").click(function(){
        $("#search_input").val("");
        $("#resultlist").html("");
    });
    /*$("#startGame").click(function(){
        
    });*/
    $("#iwantthis").click(function(){
        if(!$("#iwantthis").hasClass("disabled")){
            $("#search_input").val("");
            $("#resultlist").html("");
            $("#iwantthis").addClass("disabled");
            MyStorage.addRound(MainApp.selectedVideo);
            ScoreBoard.refresh();
            MainApp.hideSearch();
            MainApp.hidePlayerTurn();
        }
    });
    $("#addplayerButton").click(function(){
        var name = $("#newPlayerName").val();
        if(MainApp.playerAllowed(name)){
            $("#newPlayerName").val("");
            MyStorage.addPlayer(name);
            MainApp.refreshPlayerList();
        }else{
            
        }
        
    });
    
    $('#myModal').modal({
        keyboard: false,
        backdrop:"static"
    });
    MainApp.refreshPlayerList();
        $('#myCarousel').carousel({
    interval: 999999999999999999999999
    })
    
    $("#myCarousel").carousel("pause");
    if( MyStorage.init()){
}
});

var MainApp = {
    "selectedVideo":"",
    "continueGame":function(){
        $("#myModal").modal("hide");
        ScoreBoard.refresh();
        
    },
    "startnewGame":function(){
        ScoreBoard.refresh();
        $("#myModal").modal("hide");
        
    },
    "refreshPlayerList":function(){
        var allPlayers = MyStorage.getPlayers();
        $("#playerList").html("");
        for(var i = 0;  i< allPlayers.length;i++){
            var li =$("<li>").text(allPlayers[i]);
            var del = $("<a>")
            del.html("<i class='icon-remove-sign'></i> remove")
            del.addClass("removePlyer");
            del.data("user-id",i);
            del.click(function(){
                MyStorage.delPlayer($(this).data("user-id"));
            });
            li.append(del);
            $("#playerList").append(li);
        }
    },
    "hidePlayerTurn":function(){
        $("#playerTurn").css("display","none");
        $("#playerFrame").css("float","none");
        $("#playerFrame").css("width","auto");
    },
    "showPlayerTurn":function(){
        $("#playerTurn").css("display","block");
        $("#playerFrame").css("float","left");
        $("#playerFrame").css("width","50%");
    },
    "endRound":function(){
        if(ScoreBoard.allHaveAnswered()){
            ScoreBoard.pushScore();
            MainApp.showPlayerTurn();
            MainApp.showSearch();
            ScoreBoard.refresh();
        }else{
            alert("Some Votes Are Missing");
        }
    },
    "hideSearch":function(){
        $("#rightCol").animate({
            "margin-left":"0",
            "width":"100%"
        },'fast');
        $("#leftCol").hide("fast",function(){});
    },
    "showSearch":function(){
        $("#rightCol").animate({
            "margin-left":"2.5641%",
            "width":"74.359%"
        },'fast',function(){
            $("#leftCol").show("fast");
        });
    },
    "setModalHeader":function(str){
        $(".modal-header h3").text(str);
    },
    "playerAllowed":function(name){
        name = $.trim( name ) ;
        if(name == ""){ 
            alert("Playername can not be empty.");
            return false;
        }
        if($.inArray(name, MyStorage.getPlayers()) != -1){
            alert("Playername already taken.");
            return false;
        }
        return true;  
    }
 }