function setCalendar() {
    document.getElementById("two-days-ago").innerText = "<a href=\"javascript:fetchScores(today, -2)\"><div class=\"column card date\" id=\"two-days-ago\">Tue <p>2/6</p></div></a>";
}


function findHomePlayer(game, player){
	var IndexofPlayer = -1;
for (var i = 0; i < game.homeTeam.homePlayers.playerEntry.length; i++){
  	if(game.homeTeam.homePlayers.playerEntry[i].player.LastName == player){
  		IndexofPlayer = i;
    }
  }
  return IndexofPlayer;
}

function findAwayPlayer(game, player){
	var IndexofPlayer = -1;
for (var i = 0; i < game.awahTeam.awayPlayers.playerEntry.length; i++){
  	if(game.awayTeam.awayPlayers.playerEntry[i].player.LastName == player){
  		IndexofPlayer = i;
    }
  }
  return IndexofPlayer;
}


var API_CREDENTIALS = {
    username: 'radstlman',
    password: 'McRn4ever!'
}

function formatDateForApi(date, adjuster) {
    var today = date;
    today.setDate(today.getDate() + adjuster);
    console.log(today);
    var year = today.getFullYear().toString();
    var month = ((today.getMonth()) + 1);
    var formatedMonth;
    var day = today.getDate();
    var formatedDay;
    var dateForApi;

    if (month < 10)
    {
        formatedMonth = "0" + month.toString();
    }
    else {
        formatedMonth = month.toString();
    }

    if(day < 10)
    {
        formatedDay = "0" + day.toString();
    }
    else
    {
        formatedDay = day.toString();
    }

    dateForApi = year + formatedMonth + formatedDay;
    return dateForApi;
}

function FixTime(gameStatus){
  var fixedTime;
  if (gameStatus.length === 7){
    var play = gameStatus.substring(0,2);
    play = play -2;
    play = play + gameStatus.substr(2,7);
    fixedTime = play;
  }
  //Else subtract two from thr first time digit
  else if(gameStatus.length === 6){
    var play = gameStatus.substr(0,1);
    play = play -2;
    play = play + gameStatus.substr(1,6);
    fixedTime = play;
  }

  return fixedTime;
}

function getCurrentIntermission(game){
  var intermission = game.currentIntermission;
  if (intermission == 1){
    intermission = "End of 1st";
  }
  else if (intermission == 2){
    intermission = "Half";
  }
  else if (intermission == 3){
    intermission = "End of 3rd";
  }
  else {
    intermission = "Final";
  }
  return intermission;
}

function getInProgressInfo(game){
  var minLeft;
  var secLeft;
  var gameStatus;
  minLeft = Math.floor((game.currentQuarterSecondsRemaining)/60);
  secLeft = game.currentQuarterSecondsRemaining - (minLeft * 60);
  if (secLeft < 10) {
     secLeft = '0' + secLeft;
  }
  if (isNaN(minLeft) === true) {
      gameStatus = getCurrentIntermission(game)
  }
  else {
    gameStatus = minLeft + ":" + secLeft;
    if (game.quarterSummary.quarter.length === 1) {
        gameStatus += "-1st";
    }
    else if(game.quarterSummary.quarter.length === 2) {
        gameStatus += "-2nd";
    }
    else if(game.quarterSummary.quarter.length === 3)
    {
        gameStatus += "-3rd";
    }
    else if(game.quarterSummary.quarter.length === 4)
    {
        gameStatus += "-4th";
    }
    else if(game.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 5)
    {
        gameStatus += "-OT";
    }
  }

  return gameStatus;
}

function getGameStatus(game){
  var gameStatus = "";
  var gameTime = game.game.time;

  if (game.isUnplayed == "true"){
    gameStatus = FixTime(gameTime);
  }
  else if (game.isUnplayed == "false" && game.quarterSummary === null){
    gameStatus = "Tip-Off";
  }
  else if (game.isCompleted == "true"){
    gameStatus = "Final";
    if (game.quarterSummary.quarter.length > 4){
          gameStatus += " OT"
        }
  }
  else{
    gameStatus = getInProgressInfo(game);
  }


  return gameStatus;
}

function getAwayQuarters(game){

  var awayQuarterSummary = ["-","-","-","-"];
  if (game.quarterSummary != null){
    for (var iCount = 0; iCount < game.quarterSummary.quarter.length; iCount++){
      awayQuarterSummary[iCount] = game.quarterSummary.quarter[iCount].awayScore;
    }
  }

  return awayQuarterSummary;

}

function getHomeQuarters(game){

  var homeQuarterSummary = ["-","-","-","-"];
  if (game.quarterSummary != null){
    for (var iCount = 0; iCount < game.quarterSummary.quarter.length; iCount++){
      homeQuarterSummary[iCount] = game.quarterSummary.quarter[iCount].homeScore;
    }
  }

  return homeQuarterSummary;

}

function formatGameData(data) {
    // shape and format the data to make it easy to render
    console.log('formatGameData', data)
    var gameStatus = getGameStatus(data);
    var awayScore;
    var homeScore;

    if(data.isUnplayed == "false"){
      awayScore = data.awayScore;
      homeScore = data.homeScore;
    }
    else {
      awayScore ="-";
      homeScore = "-";
    }
    var awayTeam = {
      id: data.game.awayTeam.ID,
      logo: data.game.awayTeam.Abbreviation + ".png",
      name: data.game.awayTeam.Name,
      abbr: data.game.awayTeam.Abbreviation,
      total: awayScore,
      quarters: getAwayQuarters(data)

    }
    var homeTeam = {
      id: data.game.homeTeam.ID,
      logo: data.game.homeTeam.Abbreviation + ".png",
      name: data.game.homeTeam.Name,
      abbr: data.game.homeTeam.Abbreviation,
      total: homeScore,
      quarters: getHomeQuarters(data)

    }

    return {
        id: data.game.ID,
        isUnplayed: data.isUnplayed,
        status: gameStatus,
        awayTeam: {
            id: data.game.awayTeam.ID,
            logo: data.game.awayTeam.Abbreviation + ".png",
            name: data.game.awayTeam.Name,
            abbr: data.game.awayTeam.Abbreviation,
            total: awayScore,
            quarters: getAwayQuarters(data)
        },
        homeTeam: {
            id: data.game.homeTeam.ID,
            logo: data.game.homeTeam.Abbreviation + ".png",
            name: data.game.homeTeam.Name,
            abbr: data.game.homeTeam.Abbreviation,
            total: homeScore,
            quarters: getHomeQuarters(data)
        }
    }
}

function renderGame(content) {
    //put all the html stuff in here
    var home = content.homeTeam;
    var away = content.awayTeam;

    var gameStatus = content.isUnplayed;

    document.querySelector(".score-grid").innerHTML +=
        "<div label="+gameStatus+" class=\"score-child showModal\">" +
        "            <table id=" + content.id + " class=\"table is-narrow no-border box\">\n" +
        "                <thead class=\"no-border\">\n" +
        renderQuartersHeader(home.quarters.length, content.status) +
        "                </thead>\n" +
        "                <tbody>\n" +
        "                <tr>\n" +
        "                    <td class= 'awayAbr' label= '"+away.abbr +"'>\n" +
        "                        <img class=\"icon\" src='../IMG/"+ content.awayTeam.logo +"'>\n" +
        "                    </td>\n" +
        "                    <td class=\"is-bold\">\n" +
        "                        <strong class=\"is-bold team-name away-team-name\">"+ away.name + "</strong>\n" +
        "                        <!--<span class=\"is-italic\"><br>(40-10)</span>-->\n" +
        "                    </td>\n" +
        renderQuartersBody(away)+
        "                    <th>" + away.total + "</th>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                    <td class= 'homeAbr' label= '"+home.abbr +"'>\n" +
        "                        <img class=\"icon\" src='../IMG/" + content.homeTeam.logo + "'>\n" +
        "                    </td>\n" +
        "                    <td class=\"is-bold\">\n" +
        "                        <strong class=\"is-bold team-name home-team-name\">" + home.name + "</strong>\n" +
        "                        <!--<span class=\"is-italic\"><br>(40-10)</span>-->\n" +
        "                    </td>\n" +
        renderQuartersBody(home)+
        "                    <th>"+home.total + "</th>\n" +
        "                </tr>\n" +
        "                </tbody>\n" +
        "            </table>\n" +
        "        </div>";
}

function renderQuartersHeader(length, status) {

  var gameStatus = "<th class=\"gameStatus\">" + status + "</th>"
  var columns = "<th></th>"

  for (var i = 1; i < length + 1; i++) {

    var label
    if (i <= 4) {
      label = i
    } else {
      var OTCount = i - 4
      var OTLabel = OTCount > 1 ? OTCount : "";
      label = OTLabel + "OT"
    }

    columns += "<th>" + label + "</th>"
  }

  columns += "<th>T</th>"

  return "<tr>" + gameStatus + columns + "</tr>"
}

function renderQuartersBody(team) {
  var quartersHtml = ""
  team.quarters.forEach(function(quarterScore) {
    quartersHtml += "<td>" + quarterScore + "</td>"
  })

  return quartersHtml

}

function clearHtml() {
    document.querySelector(".score-grid").innerHTML = "";
}

function formatPlayerData(players){
  var aPlayers = [];
  var text = "#text";
  var Assists = 0;
  var Rebounds = 0;
  var Points = 0;
  var FgAttemps = 0;
  var FgMade = 0;
  var PlusMinus = 0;
  var Minutes = 0;

  for (var iCount = 0; iCount < players.length; iCount++){
    if(players[iCount].stats.Ast["#text"] != undefined){
      Assists = players[iCount].stats.Ast["#text"];
    }

    if (players[iCount].stats.Reb["#text"] != undefined){
      Rebounds = players[iCount].stats.Reb["#text"];
    }
    if (players[iCount].stats.Pts["#text"] != undefined){
      Points = players[iCount].stats.Pts["#text"];
    }
    if(players[iCount].stats.FgAtt["#text"] != undefined){
      FgAttemps = players[iCount].stats.FgAtt["#text"];
    }
    if (players[iCount].stats.FgMade["#text"] != undefined){
      FgMade = players[iCount].stats.FgMade["#text"];
    }
    if (players[iCount].stats.PlusMinus["#text"] != undefined){
      PlusMinus = players[iCount].stats.PlusMinus["#text"];
    }
    if (players[iCount].stats.MinSeconds["#text"] != undefined){
      Minutes = players[iCount].stats.MinSeconds["#text"];
      Minutes = Math.floor(Minutes / 60);
    }
    aPlayers.push({
      firstName: players[iCount].player.FirstName,
      lastName: players[iCount].player.LastName,
      playerID: players[iCount].player.ID,
      Position: players[iCount].player.Position,
      AST: Assists,
      REB: Rebounds,
      PTS: Points,
      FGA: FgAttemps,
      FGM: FgMade + "-",
      PlusMinus: PlusMinus,
      MIN: Minutes
    });
  }

  return aPlayers;
}

function setBoxScoreView(homePlayerData, awayPlayerData){
  document.getElementById('hPlayers').innerHTML = "";
  for(var iCount = 0; iCount < homePlayerData.length; iCount++){
    document.getElementById('hPlayers').innerHTML += "" +
        "<tr id='\" + homePlayerData[iCount].playerID+\"'>\n" +
        "        <td class='PlayerPostiong'>"+homePlayerData[iCount].Position +"</td>\n" +
        "        <td clas='PlayerName'>"+homePlayerData[iCount].lastName +"</td>\n" +
        "        <td class='PlayerMins'>"+ homePlayerData[iCount].MIN +"</td>\n" +
        "        <td class='FGM-FGA'>"+ homePlayerData[iCount].FGM + homePlayerData[iCount].FGA+"</td>" +
        "        <td class='PlayerReb'>"+ homePlayerData[iCount].REB +"</td>\n" +
        "        <td class= 'PlayerAST'>"+ homePlayerData[iCount].AST +"</td>" +
        "        <td class='PTS'>"+ homePlayerData[iCount].PTS +"</td>\n" +
         "</tr>";
  }

  document.getElementById('aPlayers').innerHTML = "";
  for(var iCount = 0; iCount < awayPlayerData.length; iCount++){
    document.getElementById('aPlayers').innerHTML += "" +
        "<tr id='\" + awayPlayerData[iCount].playerID+\"'>\n" +
        "        <td class='PlayerPostiong'>"+awayPlayerData[iCount].Position +"</td>\n" +
        "        <td clas='PlayerName'>"+ awayPlayerData[iCount].lastName +"</td>\n" +
        "        <td class='PlayerMins'>"+ awayPlayerData[iCount].MIN +"</td>\n" +
        "        <td class='FGM-FGA'>"+ awayPlayerData[iCount].FGM + awayPlayerData[iCount].FGA+"</td>\n" +
        "        <td class='PlayerReb'>"+ awayPlayerData[iCount].REB +"</td>\n" +
        "        <td class= 'PlayerAST'>"+ awayPlayerData[iCount].AST +"</td>\n" +
        "        <td class='PTS'>"+ awayPlayerData[iCount].PTS +"</td>\n" +
        "\n" +
        "    </tr>";
  }
}

function setGameHeaders(game){
  document.getElementById("home-abr").innerText = game.HomeTeamAbbr;
  document.getElementById("away-abr").innerText = game.AwayTeamAbbr;
  document.getElementById("home-team-image").innerHTML = "<img class='is-64x64' src='../IMG/"+game.HomeTeamAbbr+".png'>";
  document.getElementById("away-team-image").innerHTML = "<img class='is-64x64' src='../IMG/"+game.AwayTeamAbbr+".png'>";
  document.getElementById("HomeHeader").innerText = game.HomeTeamCity + " " + game.HomeTeamName;
  document.getElementById("AwayHeader").innerText = game.AwayTeamCity + " " + game.AwayTeamName;
  document.getElementById("home-game-score").innerText = game.HomeScore;
  document.getElementById("away-game-score").innerText = game.AwayScore;
  document.querySelector('.game-Status').innerText = game.gameStatus;
  document.querySelector('#away-record').innerText = game.awayTeamRecord;
  document.querySelector('#home-record').innerText = game.homeTeamRecord;

}

function RenderBoxScore(box,gameInfo, homeRecord, awayRecord){
  var awayTeam = box.awayTeam;
  var homeTeam = box.homeTeam;
  console.log('This is the box',box)
  var game = {
    homeTeamRecord: homeRecord,
    awayTeamRecord: awayRecord,
    gameStatus: gameInfo,
    HomeTeamName: box.game.homeTeam.Name,
    HomeTeamCity: box.game.homeTeam.City,
    HomeTeamAbbr: box.game.homeTeam.Abbreviation,
    HomeScore: homeTeam.homeTeamStats.Pts["#text"],
    AwayTeamName: box.game.awayTeam.Name,
    AwayTeamCity: box.game.awayTeam.City,
    AwayTeamAbbr: box.game.awayTeam.Abbreviation,
    AwayScore: awayTeam.awayTeamStats.Pts["#text"]
  }

  awayTeamInfo = {
    ID: box.game.awayTeam.ID,
    Name: box.game.awayTeam.Name,
    City: box.game.awayTeam.City,
    Record: box.game.homeTeam
  };
  homeTeamInfo = {
    ID: box.game.homeTeam.ID,
    Name: box.game.homeTeam.Name,
    City: box.game.homeTeam.City,
  };

  var awayPlayerData = formatPlayerData(awayTeam.awayPlayers.playerEntry);
  var homePlayerData = formatPlayerData(homeTeam.homePlayers.playerEntry);
  console.log('away Players', awayPlayerData);
  console.log('home Players', homePlayerData);

  setGameHeaders(game);

  setBoxScoreView(homePlayerData, awayPlayerData);

  }

  function getTeamPlayers(player, team){
    if(player.team.Name == team){
      return true;
    }
    else return false;
  }

  function formatPlayerDataPerGame(players){
    var aPlayers = [];
    var text = "#text";
    var Assists = 0;
    var Rebounds = 0;
    var Points = 0;
    var FgAttemps = 0;
    var FgMade = 0;
    var PlusMinus = 0;
    var Minutes = 0;

    for (var iCount = 0; iCount < players.length; iCount++){
      if(players[iCount].stats.AstPerGame["#text"] != undefined){
        Assists = players[iCount].stats.AstPerGame["#text"];
      }

      if (players[iCount].stats.RebPerGame["#text"] != undefined){
        Rebounds = players[iCount].stats.RebPerGame["#text"];
      }
      if (players[iCount].stats.PtsPerGame["#text"] != undefined){
        Points = players[iCount].stats.PtsPerGame["#text"];
      }
      if(players[iCount].stats.FgAttPerGame["#text"] != undefined){
        FgAttemps = players[iCount].stats.FgPct["#text"];
      }
      if (players[iCount].stats.FgMadePerGame["#text"] != undefined){
        FgMade = players[iCount].stats.FgMadePerGame["#text"];
      }
      if (players[iCount].stats.PlusMinusPerGame["#text"] != undefined){
        PlusMinus = players[iCount].stats.PlusMinusPerGame["#text"];
      }
      if (players[iCount].stats.MinSecondsPerGame["#text"] != undefined){
        Minutes = players[iCount].stats.MinSecondsPerGame["#text"];
        Minutes = Math.floor(Minutes / 60);
      }
      aPlayers.push({
        firstName: players[iCount].player.FirstName,
        lastName: players[iCount].player.LastName,
        playerID: players[iCount].player.ID,
        Position: players[iCount].player.Position,
        AST: Assists,
        REB: Rebounds,
        PTS: Points,
        FGA: FgAttemps + "%",
        FGM: "",
        PlusMinus: PlusMinus,
        MIN: Minutes
      });
    }

    return aPlayers;
  }

  function RenderPreGameBox(players, gameInfo, homeTeamName, awayTeamName, homeRecord, awayRecord){
    function getHomeTeamPlayers(player){
      if(player.team.Name == homeTeamName){
        return true;
      }
      else return false;
    }
    function getAwayTeamPlayers(player){
      if(player.team.Name == awayTeamName){
        return true;
      }
      else return false;
    }

    var homeTeam = players.filter(getHomeTeamPlayers);
    var awayTeam = players.filter(getAwayTeamPlayers);

    console.log('homeTeam', homeTeam)

    var game = {
      homeTeamRecord: homeRecord,
      awayTeamRecord: awayRecord,
      gameStatus: gameInfo,
      HomeTeamName: homeTeamName,
      HomeTeamCity: homeTeam[0].team.City,
      HomeTeamAbbr: homeTeam[0].team.Abbreviation,
      HomeScore: "",
      AwayTeamName: awayTeamName,
      AwayTeamCity: awayTeam[0].team.City,
      AwayTeamAbbr: awayTeam[0].team.Abbreviation,
      AwayScore: ""
    }
    setGameHeaders(game);

    var homeTeamData = formatPlayerDataPerGame(homeTeam);
    var awayTeamData = formatPlayerDataPerGame(awayTeam);

    setBoxScoreView(homeTeamData, awayTeamData);
  }

  function RenderExptectedStartingLineup(Game){
    function getStarters(player){
      if(player.position.includes("Starter")){
        return true;
      }
      else {
        return false;
      }
    }
    function getBench(player){
      if(player.position.includes("Bench")){
        return true;
      }
      else{
        return false;
      }
    }
    var awayTeam = Game.gamestartinglineup.teamLineup[0].expected.starter;
    var homeTeam = Game.gamestartinglineup.teamLineup[1].expected.starter;
    var homeStarters = homeTeam.filter(getStarters);
    var awayStarters = awayTeam.filter(getStarters);
    var homeBench  = homeTeam.filter(getBench);
    var awayBench  = awayTeam.filter(getBench);
    console.log('homeStarters', homeStarters);
  }

function fetchScores(date,adjuster){
    var dateForApi = formatDateForApi(date, adjuster);
    var standings;
    // makes an api call
    $.ajax({
        headers: {
            "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
        },
        url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/scoreboard.json?fordate="+dateForApi,
        method: "GET",
        success: function(data){

            clearHtml();

            var games = data.scoreboard.gameScore;
            games.forEach(function(game) {
                var gameData = formatGameData(game)
                renderGame(gameData)
            })
            var standings;
            $.ajax({
              headers:{
                "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
              },
              url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/overall_team_standings.json?teamstats=W,L,PTS,PTSA",
              method: "GET",
              success: function(teamStandings){
                standings = teamStandings.overallteamstandings.teamstandingsentry;
                console.log('standings',standings);
              }
            });


            $('.showModal').click(function(event) {
            event.preventDefault();

            var div = this;
            var isUnplayed = div.getAttribute("label");
            console.log(div);
            var table = div.querySelector('table');
            var gameID = table.getAttribute("id")
            var gameInfo = div.querySelector('.gameStatus').innerText;
            var homeAbr = div.querySelector('.homeAbr').getAttribute("label");
            var awayAbr = div.querySelector('.awayAbr').getAttribute("label");
            var awayTeamName = div.querySelector('.away-team-name').innerText;
            var homeTeamName = div.querySelector('.home-team-name').innerText;
            console.log(gameInfo);
            function GetHomeTeamStats(teams){
              if(teams.team.Abbreviation == homeAbr){
                return true;
              }
              else{
                return false;
              }
            }
            function GetAwayTeamStats(teams){
              if(teams.team.Abbreviation == awayAbr){
                return true;
              }
              else{
                return false;
              }
            }

            var homeTeamStats = standings.filter(GetHomeTeamStats);
            var awayTeamStats = standings.filter(GetAwayTeamStats);

            var homeTeamRecord = homeTeamStats[0].stats.Wins["#text"] + "-" + homeTeamStats[0].stats.Losses["#text"];
            var awayTeamRecord = awayTeamStats[0].stats.Wins["#text"] + "-" + awayTeamStats[0].stats.Losses["#text"];
            console.log('Home Record', homeTeamRecord);
            console.log('Away Record', awayTeamRecord);

            if (isUnplayed == "false"){
                  $.ajax({
                    headers: {
                        "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
                    },
                    url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/game_boxscore.json?gameid="+gameID,
                    method: "GET",
                  success : function(boxScore) {
                      console.log(boxScore);
                      //Pass data
                      //Render data
                      var box = boxScore.gameboxscore;

                      RenderBoxScore(box,gameInfo,homeTeamRecord, awayTeamRecord);

                  }
              });
            }
            else{
              $.ajax({
                headers: {
                    "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
                },
                url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/cumulative_player_stats.json?sort=stats.PTS/G.D&team="+awayAbr + "," + homeAbr,
                method: "GET",
              success : function(teamPlayerStats) {
                  console.log(teamPlayerStats);
                  RenderPreGameBox(teamPlayerStats.cumulativeplayerstats.playerstatsentry, gameInfo, homeTeamName, awayTeamName, homeTeamRecord, awayTeamRecord);
                  //RenderExptectedStartingLineup(teamPlayerStats);
                  //Pass data
                  //Render data

              }
          });
            }
            //For now I am commenting this out this api call gets the exptected starts the issue is that if it is not game daty the expected Starters arent' avaliable
          //   else{
          //     $.ajax({
          //       headers: {
          //           "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
          //       },
          //       url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/game_startinglineup.json?gameid="+gameID,
          //       method: "GET",
          //     success : function(teamPlayerStats) {
          //         //console.log(teamPlayerStats);
          //         RenderExptectedStartingLineup(teamPlayerStats);
          //         //Pass data
          //         //Render data
          //
          //     }
          // });
          //   }



            var modal = document.querySelector('.modal');
            var html = document.querySelector('html');
            modal.classList.add('is-active');
            html.classList.add('is-clipped');

            modal.querySelector('.modal-background').addEventListener('click', function(e) {
              e.preventDefault();
              modal.classList.remove('is-active');
              html.classList.remove('is-clipped');
              document.getElementById('hPlayers').innerHTML = "";
              document.getElementById('aPlayers').innerHTML = "";
              document.getElementById("home-abr").innerText = "";
              document.getElementById("away-abr").innerText = "";
              document.getElementById("home-team-image").innerHTML = "";
              document.getElementById("away-team-image").innerHTML = "";
              document.getElementById("HomeHeader").innerText = "";
              document.getElementById("AwayHeader").innerText = "";
              document.getElementById("home-game-score").innerText = "";
              document.getElementById("away-game-score").innerText = "";
              document.querySelector('.game-Status').innerText = "";
              document.querySelector('#away-record').innerText = "";
              document.querySelector('#home-record').innerText = "";

            });
              document.querySelector('.modal-close').addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.remove('is-active');
                html.classList.remove('is-clipped');
              });
          });

        }


    })



}


$(document).ready(function(){

});
