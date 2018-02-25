var API_CREDENTIALS = {
    username: 'radstlman',
    password: 'McRn4ever!'
}

function RenderStandings(team, conference){
  document.getElementById(conference).innerHTML = "";
  for (var iCount = 0; iCount < team.length; iCount++){
    var rank = team[iCount].rank;
    var cutOff = "";
    if(rank > 8){
      rank = "";
    }
    if (rank == 8){
      cutOff = "playOff-CutOff";
    }
    document.getElementById(conference).innerHTML +=
    "<tr class='"+ cutOff +"'>"+
      "<th>" +rank+"</th>"+
      "<th><img class='icon static-icon' src='../IMG/"+team[iCount].team.Abbreviation+".png'></th>"+
      "<td>" +team[iCount].team.City + " " + team[iCount].team.Name +"</td>"+
      "<td>" + team[iCount].stats.GamesPlayed["#text"] + "</td>"+
      "<td>" + team[iCount].stats.Wins["#text"] + "</td>"+
      "<td>" + team[iCount].stats.Losses["#text"] + "</td>"+
      "<td>" + team[iCount].stats.WinPct["#text"] + "</td>"+
      "<td class='is-selected'>" + team[iCount].stats.GamesBack["#text"] + "</td>"+
      "<td>" + team[iCount].stats.PtsPerGame["#text"] + "</td>"+
      "<td>" + team[iCount].stats.PtsAgainstPerGame["#text"] + "</td>"+
      "<td>" + team[iCount].stats.PlusMinusPerGame["#text"] + "</td>"+
      "<td>" + team[iCount].stats.FgPct["#text"] + "</td>"+
    "</tr>";
  }
}

$.ajax({
  headers:{
    "Authorization": "Basic " + btoa(API_CREDENTIALS.username + ":" + API_CREDENTIALS.password)
  },
  url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/conference_team_standings.json?",
  method: "GET",
  success: function(teamStandings){
    westStandings = teamStandings.conferenceteamstandings.conference[1].teamentry;
    eastStandings = teamStandings.conferenceteamstandings.conference[0].teamentry;

    RenderStandings(westStandings,"westerConferenceStandings");
    RenderStandings(eastStandings,"easterConferenceStandings");
;
    console.log('standings',westStandings);
  }
});
