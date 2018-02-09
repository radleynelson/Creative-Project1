function setCalendar() {
    document.getElementById("two-days-ago").innerText = "<a href=\"javascript:fetchScores(today, -2)\"><div class=\"column card date\" id=\"two-days-ago\">Tue <p>2/6</p></div></a>";
}

function fetchScores(date,adjuster){


    var USERNAME = "radstlman";
    var PASSWORD = "McRn4ever!";

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


    $.ajax({
        headers: {
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
        },
        url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/scoreboard.json?fordate="+dateForApi,
        method: "GET",
        success: function(data){
            //console.log(data.scoreboard.gameScore[0].game.awayTeam.Name);

            document.querySelector(".score-grid").innerHTML = "";

            for (var iCount = 0; iCount < data.scoreboard.gameScore.length; iCount++)
            {
                var awayTeamAbbr = data.scoreboard.gameScore[iCount].game.awayTeam.Abbreviation;
                var awayTeamScore = "-";
                var awayTeamName = data.scoreboard.gameScore[iCount].game.awayTeam.Name;
                var awayTeamQuarters = ["-","-","-","-"];
                var homeTeamAbbr = data.scoreboard.gameScore[iCount].game.homeTeam.Abbreviation;;
                var homeTeamScore = "-";
                var homeTeamName = data.scoreboard.gameScore[iCount].game.homeTeam.Name;
                var homeTeamQuarters = ["-","-","-","-"];
                var qLength;
                var gameStatus;

                if (data.scoreboard.gameScore[iCount].isUnplayed === "true")
                {
                    awayTeamScore = "-";
                    awayTeamQuarters = ["-","-","-","-"];
                    homeTeamQuarters = ["-","-","-","-"];
                    homeTeamScore = "-";
                    gameStatus = data.scoreboard.gameScore[iCount].game.time;
                    if (gameStatus.length === 7)
                    {

                        var play = gameStatus.substring(0,2);
                        play = play -2;
                        play = play + gameStatus.substr(2,7);
                        gameStatus = play;
                    }
                    else if(gameStatus.length === 6)
                    {
                        var play = gameStatus.substr(0,1);
                        play = play -2;
                        play = play + gameStatus.substr(1,6);
                    }
                }
                else
                {
                    if(data.scoreboard.gameScore[iCount].quarterSummary == null)
                    {
                        qLength = 0
                    }
                    else
                    {
                        qLength = data.scoreboard.gameScore[iCount].quarterSummary.quarter.length;
                    }
                    for (var i = 0; i < qLength; i++)
                    {
                        var AQScores;
                        if (data.scoreboard.gameScore[iCount].quarterSummary.quarter[i].awayScore === null)
                        {
                            AQScores = "-";
                        }
                        else
                        {
                            AQScores = data.scoreboard.gameScore[iCount].quarterSummary.quarter[i].awayScore;
                        }

                        awayTeamQuarters[i] = (AQScores);


                    }
                    if(data.scoreboard.gameScore[iCount].quarterSummary == null)
                    {
                        qLength = 0
                    }
                    else
                    {
                        qLength = data.scoreboard.gameScore[iCount].quarterSummary.quarter.length;
                    }

                    for (var i = 0; i < qLength; i++)
                    {
                        var HQScores;

                        if (data.scoreboard.gameScore[iCount].quarterSummary.quarter[i].homeScore === null)
                        {
                            HQScores = "-";
                        }
                        else
                        {
                            HQScores = data.scoreboard.gameScore[iCount].quarterSummary.quarter[i].homeScore;
                        }

                        homeTeamQuarters[i] = (HQScores);


                    }

                    homeTeamScore = data.scoreboard.gameScore[iCount].homeScore;
                    awayTeamScore = data.scoreboard.gameScore[iCount].awayScore;
                    if(data.scoreboard.gameScore[iCount].isCompleted === "true")
                    {
                        gameStatus = "Final";
                        if (data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 5)
                        {
                            gameStatus += " OT"
                        }
                    }
                    else if(data.scoreboard.gameScore[iCount].quarterSummary === null){
                        gameStatus = "Tip-Off";
                    }
                    else
                    {
                        var minLeft;
                        var secLeft ;
                        minLeft = Math.floor((data.scoreboard.gameScore[iCount].currentQuarterSecondsRemaining)/60);
                        secLeft = data.scoreboard.gameScore[iCount].currentQuarterSecondsRemaining - (minLeft * 60);

                        if (secLeft < 10)
                        {
                           secLeft = '0' + secLeft;
                        }

                        if (isNaN(minLeft) === true || data.scoreboard.gameScore[iCount].currentIntermission === 4)
                        {
                            gameStatus = "Final";

                            if (data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 5)
                            {
                                gameStatus += " OT"
                            }
                        }

                        else
                        {
                            gameStatus = minLeft + ":" + secLeft;
                            if (data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 1)
                            {
                                gameStatus += "-1st";
                            }
                            else if(data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 2)
                            {
                                gameStatus += "-2nd";
                            }
                            else if(data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 3)
                            {
                                gameStatus += "-3rd";
                            }
                            else if(data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 4)
                            {
                                gameStatus += "-4th";
                            }
                            else if(data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 5)
                            {
                                gameStatus += "-OT";
                            }

                        }
                        if(data.scoreboard.gameScore[iCount].currentIntermission === 1)
                        {
                            gameStatus = "End of First"
                        }
                        else if(data.scoreboard.gameScore[iCount].currentIntermission === 2)
                        {
                            gameStatus = "Half Time"
                        }
                        else if(data.scoreboard.gameScore[iCount].currentIntermission === 2)
                        {
                            gameStatus = "End of 3rd"
                        }

                    }


                }



                var side;
                if (iCount === 0 || (iCount % 2 === 0))
                {
                    side = "\"score-left score-child\""
                }
                else
                {
                    side = "\"score-right score-child\"";
                }
                document.querySelector(".score-grid").innerHTML +=
                    "<div class="+ side +">" +
                    "            <table id="+data.scoreboard.gameScore[iCount].game.ID +" class=\"table is-narrow no-border box\">\n" +
                    "                <thead class=\"no-border\">\n" +
                    "                <tr>\n" +
                    "                    <th class='gameStatus'>"+ gameStatus +"</th>\n" +
                    "                    <th></th>\n" +
                    "                    <th>1</th>\n" +
                    "                    <th>2</th>\n" +
                    "                    <th>3</th>\n" +
                    "                    <th>4</th>\n" +
                    "                    <th id="+ homeTeamAbbr + 'OT' +"></th>\n" +
                    "                    <th>T</th>\n" +
                    "\n" +
                    "                </tr>\n" +
                    "                </thead>\n" +
                    "                <tbody>\n" +
                    "                <tr>\n" +
                    "                    <td>\n" +
                    "                        <img class=\"icon\" src=\"../IMG/warriors_logo.png\">\n" +
                    "                    </td>\n" +
                    "                    <td class=\"is-bold\">\n" +
                    "                        <strong class=\"is-bold team-name\">"+ awayTeamName + "</strong>\n" +
                    "                        <!--<span class=\"is-italic\"><br>(40-10)</span>-->\n" +
                    "                    </td>\n" +
                    "                    <td>" + awayTeamQuarters[0] +"</td>\n" +
                    "                    <td>" +awayTeamQuarters[1] + "</td>\n" +
                    "                    <td>"+ awayTeamQuarters[2] +"</td>\n" +
                    "                    <td>" + awayTeamQuarters[3] + "</td>\n" +
                    "                    <td id= "+ awayTeamAbbr +"></td>\n" +
                    "                    <th>" + awayTeamScore + "</th>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td>\n" +
                    "                        <img class=\"icon\" src=\"../IMG/jazz_logo.png\">\n" +
                    "                    </td>\n" +
                    "                    <td class=\"is-bold\">\n" +
                    "                        <strong class=\"is-bold team-name\">" +homeTeamName + "</strong>\n" +
                    "                        <!--<span class=\"is-italic\"><br>(40-10)</span>-->\n" +
                    "                    </td>\n" +
                    "                    <td>"+homeTeamQuarters[0] + "</td>\n" +
                    "                    <td>"+homeTeamQuarters[1] + "</td>\n" +
                    "                    <td>"+homeTeamQuarters[2] + "</td>\n" +
                    "                    <td>"+homeTeamQuarters[3] + "</td>\n" +
                    "                    <td id="+ homeTeamAbbr +"></td>\n" +
                    "                    <th>"+homeTeamScore + "</th>\n" +
                    "                </tr>\n" +
                    "                </tbody>\n" +
                    "            </table>\n" +
                    "        </div>";


                if (data.scoreboard.gameScore[iCount].quarterSummary != null)
                {
                    if (data.scoreboard.gameScore[iCount].quarterSummary.quarter.length === 5)
                    {
                        document.getElementById(homeTeamAbbr + 'OT').innerText = "OT";
                        document.getElementById(awayTeamAbbr).innerText = data.scoreboard.gameScore[iCount].quarterSummary.quarter[4].awayScore;
                        document.getElementById(homeTeamAbbr).innerText = data.scoreboard.gameScore[iCount].quarterSummary.quarter[4].homeScore;
                    }
                }


            }




        }

    })

}


/*

 <div class="score-left score-child">
            <table class="table is-narrow no-border box">
                <thead class="no-border">
                <tr>
                    <th>Final</th>
                    <th></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th></th>
                    <th>T</th>

                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <img class="icon" src="../IMG/warriors_logo.png">
                    </td>
                    <td class="is-bold">
                        <strong class="is-bold">Warriors</strong>
                        <!--<span class="is-italic"><br>(40-10)</span>-->
                    </td>
                    <td>30</td>
                    <td>23</td>
                    <td>20</td>
                    <td>32</td>
                    <td></td>
                    <th>105</th>
                </tr>
                <tr>
                    <td>
                        <img class="icon" src="../IMG/jazz_logo.png">
                    </td>
                    <td class="is-bold">
                        <strong class="is-bold">Jazz</strong>
                        <!--<span class="is-italic"><br>(40-10)</span>-->
                    </td>
                    <td>25</td>
                    <td>15</td>
                    <td>30</td>
                    <td>37</td>
                    <td></td>
                    <th>107</th>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="score-right score-child">
            <table class="table is-narrow no-border box">
                <thead class="no-border">
                <tr>
                    <th>Final</th>
                    <th></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th></th>
                    <th>T</th>

                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <img class="icon" src="../IMG/milwaukee-bucks-logo-vector.png">
                    </td>
                    <td class="is-bold">
                        <strong class="is-bold">Bucks</strong>
                        <!--<span class="is-italic"><br>(40-10)</span>-->
                    </td>
                    <td>28</td>
                    <td>22</td>
                    <td>34</td>
                    <td>20</td>
                    <td></td>
                    <th>104</th>
                </tr>
                <tr>
                    <td>
                        <img class="icon" src="../IMG/portland-trail-blazers-logo-vector.png">
                    </td>
                    <td class="is-bold">
                        <strong class="is-bold">Blazers</strong>
                        <!--<span class="is-italic"><br>(40-10)</span>-->
                    </td>
                    <td>20</td>
                    <td>22</td>
                    <td>20</td>
                    <td>17</td>
                    <td></td>
                    <th>79</th>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
 */