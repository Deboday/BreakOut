			var canvas;
            var canvasContext;
            var brickWall = [];
			
			var count = 0;
			var off = true;
			var inte;
			
            function brick( x , y , color )
            {
                this.height = 20;
                this.width = 50;
                this.x = x;
                this.y = y;
                this.color = color;
            }            
            var ball = {
                radius:10,
                x:390,
                y:480,
                vertical:'S',
                horizontal:'R',
            };
            var paddle = {
                width:90,
                height:10,
                x:355,
                y:490,  
            };
            setupBricksArray(brickWall);
			
			
			window.onload = start();
			
			function start() 
			{
				canvas = document.getElementById("game");
				canvasContext = canvas.getContext('2d');
				
				inte = setInterval( drawCanvas , 1 );
			};
				
			function drawCanvas()
			{
				
				//Game Finish Check
				if( down() )
				{
					off = false;
					clearInterval(inte);
					gameRestart();
				}

				//Game Complete Check

				if( count == brickWall.length * brickWall[0].length )
				{
					off = false;
					clearInterval(inte);
					gameRestart();
				}

				//Show Score
				canvasContext.font = "30px Comic Sans MS";
				canvasContext.fillStyle = "white";
				canvasContext.fillText("Score : " + count, canvas.width/2 - 60, canvas.height/2);
				canvasContext.fill();

				//Draw Canvas
				canvasContext.fillStyle = "rgba(0,0,0,0.1)";
				canvasContext.fillRect( 0 , 0 , canvas.width , canvas.height );
				
				//Draw BrickWall
				for( var i = 0 ; i < brickWall.length ; i++ )
					for( var j = 0 ; j < brickWall[i].length ; j++ )
					{
						canvasContext.fillStyle = brickWall[i][j].color;
						canvasContext.fillRect( brickWall[i][j].x , brickWall[i][j].y , 50 , 20 );
					}
					
				//Draw Paddle
				canvasContext.fillStyle = '#0099cc';
				canvasContext.fillRect( paddle.x , paddle.y , paddle.width , paddle.height );
				
				//Draw Ball
				canvasContext.fillStyle = '#0000ff';
				canvasContext.beginPath();
				canvasContext.arc( ball.x , ball.y , ball.radius , 0 , Math.PI * 2 , true );
				canvasContext.fill();
				
				move();
			}

			//Fill the Brick Array Initially
            function setupBricksArray( brickWall )
            {
                var startX = 15;
                var startY = 10;
                var padding = 5;
                var len = (800 - 20) / ( padding + 50 ) ;
                var i , j;
                for( i = 0 ; i < 5 ; i++ )
                {
                    var temp = [];
                    var x = startX;
                    for( j = 0 ; j < len - 1 ; j++ )
                    {
                        var b = new brick( x , startY , '#3366ff');
                        temp.push(b);
                        x = x + 50 + padding;
                    }
					brickWall.push(temp);
                    startY = startY + 20 + padding;
                }
            }
			
			function down()
			{
				if( ( ball.y - ball.radius ) > 500 )
					return true;
				return false;
			}
			
			function gameRestart()
			{
				canvasContext.fillStyle = 'black';
				canvasContext.fillRect( 0 , 0 , canvas.width , canvas.height );
				canvasContext.font = "30px Comic Sans MS";
				canvasContext.fillStyle = "white";
				canvasContext.fillText( "Click To Start Again" , canvas.width / 2 - 130 , 300 );
				brickWall = [];
				setupBricksArray(brickWall);
				count = 0;
				ball.x = 390;
				ball.y = 480;
				ball.horizontal = 'S';
				ball.vertical = 'R';
				paddle.x = 355;
				paddle.y = 490;
			}
			
			
			// Game Paused on Mouse Click
			
			document.addEventListener("click" , function() {
				if( off === true )
				{
					off = false;
					clearInterval(inte);
				}
				else
				{
					off = true;
					inte = setInterval( drawCanvas , 1 );
				}
			});
			
			//Paddle Movement Using Mouse Move Event
			
			canvas.addEventListener("mousemove" , function(e) {
				var x = e.pageX - canvas.getBoundingClientRect().left;
				paddle.x = x - ( paddle.width / 2 );
				if( (paddle.x + paddle.width) > 800 )
					paddle.x = 800 - paddle.width;
				if( paddle.x < 0 )
					paddle.x = 0;  
			});

			document.addEventListener("touchstart" , function(e) {
				var x = e.originalEvent.touches[0].pageX - canvas.getBoundingClientRect().left;
				paddle.x = x - ( paddle.width / 2 );
				if( (paddle.x + paddle.width) > 800 )
					paddle.x = 800 - paddle.width;
				if( paddle.x < 0 )
					paddle.x = 0;  
			});

			
				
			
			// Moving the Ball
			function move()
			{
				if( collisionWithPaddle() )
					return;
				if( collisionWithBrick() )
				{
					count++;
					return;
				}
				if( collisionWithWall() )
					return;
				normalMove();
			}
			
			function collisionWithBrick()
			{
				for( var i = 0 ; i < brickWall.length ; i++ )
					for( var j = 0 ; j < brickWall[i].length ; j++ )
					{
						var temp = brickWall[i][j];
						if( temp.color === 'black' )
							continue;
						if( topCollision(temp) )
						{
							brickWall[i][j].color = 'black';
							return true;
						}
						if( leftCollision(temp) )
						{
							brickWall[i][j].color = 'black';
							return true;
						}
						if( rightCollision(temp) )
						{
							brickWall[i][j].color = 'black';
							return true;
						}
						if( bottomCollision(temp) )
						{
							brickWall[i][j].color = 'black';
							return true;
						}
					}
				return false;
			}
			
			function topCollision( temp )
			{
				var x = temp.x;
				var y = temp.y;
				if( (ball.y + ball.radius) === y && (ball.x - 0) >= x && (ball.x - ball.radius) <= x + 50 ) // Top Left
				{
					ball.vertical = 'N';
					normalMove();
					return true;
				}
				if( (ball.y + ball.radius) === y && (ball.x + 0) >= x && (ball.x + ball.radius) <= x + 50)  // Top Right
				{
					ball.vertical = 'N';
					normalMove();
					return true;
				}
				return false;
			}
			
			function leftCollision( temp )
			{
				var x = temp.x;
				var y = temp.y;
				if( (ball.x + ball.radius) === x && (ball.y - 0) >= y && (ball.y - ball.radius) <= (y + 20) )
				{
					ball.horizontal = horizontal_change(ball.horizontal);
					normalMove();
					return true;
				}
				if( (ball.x + ball.radius) === x && (ball.y + 0) >= y && (ball.y + ball.radius) <= (y + 20) )
				{
					ball.horizontal = horizontal_change(ball.horizontal);
					normalMove();
					return true;
				}
				return false;
			}
			
			function rightCollision( temp )
			{
				var x = temp.x;
				var y = temp.y;
				if( (ball.x - ball.radius) === x + 50 && (ball.y - 0) >= y && (ball.y - ball.radius) <= (y + 20) )
				{
					ball.horizontal = horizontal_change(ball.horizontal);
					normalMove();
					return true;
				}
				if( (ball.x - ball.radius) === x + 50 && (ball.y + 0) >= y && (ball.y + ball.radius) <= (y + 20) )
				{
					ball.horizontal = horizontal_change(ball.horizontal);
					normalMove();
					return true;
				}
				return false;
			}
			
			function bottomCollision( temp )
			{
				var x = temp.x;
				var y = temp.y;
				if( (ball.y - ball.radius) === y + 20 && (ball.x - 0) >= x && (ball.x - ball.radius) <= (x + 50) ) 
				{
					ball.vertical = 'S';
					normalMove();
					return true;
				}
				if( (ball.y - ball.radius) === y + 20 && (ball.x +0) >= x && (ball.x + ball.radius) <= (x + 50) ) 
				{
					ball.vertical = 'S';
					normalMove();
					return true;
				}
				return false;
			}
				
			
			function collisionWithPaddle()
			{
				// Top Left Paddle Collision
				if( (ball.y + ball.radius) === paddle.y && (ball.x -0) >= paddle.x && (ball.x - ball.radius) <= (paddle.x + paddle.width) )
				{
					ball.vertical = 'N';
					normalMove();
					return true;
				}
				//Top Right Paddle Collision
				if( (ball.y + ball.radius) === paddle.y && (ball.x + 0) >= paddle.x && (ball.x + ball.radius) <= (paddle.x + paddle.width) )
				{
					ball.vertical = 'N';
					normalMove();
					return true;
				}
				if( (ball.x - ball.radius) === (paddle.x + paddle.width) && (ball.y + ball.radius) > paddle.y  ) // Right Paddle Wall Collision
				{
					ball.vertical = 'N';
					ball.horizontal = 'R';
					normalMove();
					return true;
				}
				if( (ball.x + ball.radius) === paddle.x && (ball.y + ball.radius)> paddle.y ) // Left Paddle Wall Collision
				{
					ball.vertical = 'N';
					ball.horizontal = 'L';
					normalMove();
					return true;
				}
				return false;
			}
			
			function horizontal_change( c )
			{
				if( c === 'R' )
					return 'L';
				else
					return 'R';
			}
			
			function vertical_change( c )
			{
				if( c === 'N' )
					return 'S';
				else
					return 'N';
			}
			
			function normalMove()
			{
				if( ball.vertical == 'S' )
					ball.y++;
				else
					ball.y--;
				if( ball.horizontal == 'R' )
					ball.x++;
				else
					ball.x--;
			}
			
			function collisionWithWall()
			{
				if( (ball.x + ball.radius) >= 800 ) //Right Wall
				{
					ball.horizontal = 'L';
					normalMove();
					return true;
				}
				if( (ball.x - ball.radius) <= 0 ) //Left Wall
				{
					ball.horizontal = 'R';
					normalMove();
					return true;
				}
				/*if( (ball.y + ball.radius) >= 600 ) //Bottom Wall
				{
					ball.vertical = 'N';
					normalMove();
					return true;
				}*/
				if( (ball.y - ball.radius) <= 0 ) //Top Wall
				{
					ball.vertical = 'S';
					normalMove();
					return true;
				}
				return false;
			}
				
				