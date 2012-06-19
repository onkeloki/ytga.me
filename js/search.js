$(document).ready(function()
    {
        $("#search_input").keyup(function() 
        {
            var search_input = $(this).val();
            var keyword= encodeURIComponent(search_input);
            // Youtube API 
            
            var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=10&v=2&alt=jsonc'; 

            $.ajax
            ({
                type: "GET",
                url: yt_url,
                dataType:"jsonp",
                success: function(response)
                {
                   $("#resultlist").html("");
                   if(response.data.items)
                    {
                        $.each(response.data.items, function(i,data)
                        {
                            var video_id=data.id;
                            var video_title=data.title;
                            var thumb = data.thumbnail.sqDefault;
                            var video_frame="<iframe width='420' height='315'  src='http://www.youtube.com/embed/"+video_id+"' frameborder='0' type='text/html'></iframe>";
                            var img = $("<img>").attr("src",thumb);
                            var head = $("<span>").text(video_title);
                            var row = $("<div>");
                            row.click(function(){
                                $("#playerFrame").html(video_frame);
                                $("#iwantthis").removeClass("disabled"); 
                                $("#playerFrame").show("slow");
                                MainApp.selectedVideo = data; 
                            });
                            
                            row.append(img);
                            row.append(head );
                            row.append($("<br>").css("clear","both"));
                            $("#resultlist").append(row); // Result
                        });
                    }
                    else
                    {
                        $("#result").html("<div id='no'>No Video</div>");
                    }
                }
            });
        });
    });