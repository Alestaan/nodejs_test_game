function new_player(canvasElement, centertile, map)
{
	
	
	  /**********************************/
	 /*          PLAYER                     */
	/*********************************/
	
	// Fonction pour creer un personnage/joueur avec une tête, deux bras, deux jambes et un torse
      function defineCharacter(centerp) 
	  {
        // character definition for animation with sheet motion
        var body = new sheetengine.Sheet({x:0,y:0,z:15}, {alphaD:0,betaD:0,gammaD:0}, {w:11,h:14});
        var backhead = new sheetengine.Sheet({x:0,y:-1,z:19}, {alphaD:0,betaD:0,gammaD:0}, {w:8,h:6});
        backhead.context.fillStyle = '#550';
        backhead.context.fillRect(0,0,8,6);
		
        // bras
        var leg1 = new sheetengine.Sheet({x:-3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
        leg1.context.fillStyle = '#00F';
        leg1.context.fillRect(0,0,5,10);
        var leg2 = new sheetengine.Sheet({x:3,y:0,z:4}, {alphaD:0,betaD:0,gammaD:0}, {w:5,h:8});
        leg2.context.fillStyle = '#00F';
        leg2.context.fillRect(0,0,5,10);

        // définit un caractère objet
        var character = new sheetengine.SheetObject(centerp, {alphaD:0,betaD:0,gammaD:90}, [body,backhead,leg1,leg2], {w:70, h:110, relu:10, relv:25});
          
        character.leg1 = leg1;
        character.leg2 = leg2;
        
        var ctx = body.context;
        
        // tête
        ctx.fillStyle = '#FF0';
        ctx.fillRect(2,2,7,4);
        ctx.fillStyle = '#550';
        ctx.fillRect(2,0,7,2);
        ctx.fillRect(2,2,1,1);
        ctx.fillRect(8,2,1,1);

        // corps
        ctx.fillStyle = '#F0F';
        ctx.fillRect(0,6,11,7);
          
        // mains
        ctx.fillStyle = '#FF0';
        ctx.fillRect(0,11,1,2);
        ctx.fillRect(10,11,1,2);
        
        character.animationState = 0;
        return character;
      }
	  
	  /**********************************/
	 /*          CAMERA                    */
	/*********************************/
	 //fonction pour charger et enlever les tiles en fonction de l'avancée du personnage
	function loadAndRemoveSheets(oldcentertile, centertile) 
		{
			var boundary = { xmin: centertile.x * 150 - 450, xmax: centertile.x * 150 + 450, ymin: centertile.y * 150 - 450, ymax: centertile.y * 150 + 450 };
			
			// On enlève les tiles qui sont trop loin
			for (var i=0; i < map.length; i++) 
			{
			  var sheetinfo = map[i];
			  if (sheetinfo.centerp.x < boundary.xmin || sheetinfo.centerp.x > boundary.xmax || sheetinfo.centerp.y < boundary.ymin || sheetinfo.centerp.y > boundary.ymax) 
			  {
				if (sheetinfo.added) 
				{
				  sheetinfo.sheet.destroy();
				  sheetinfo.added = false;
				}
			  }
			}
			
			// On ajoute les nouveaux tiles
			for (var i=0; i < map.length; i++) 
			{
			  var sheetinfo = map[i];
			  if (sheetinfo.centerp.x < boundary.xmin || sheetinfo.centerp.x > boundary.xmax || sheetinfo.centerp.y < boundary.ymin || sheetinfo.centerp.y > boundary.ymax)
				continue;
				
			  if (!sheetinfo.added) 
			  {
				sheetinfo.sheet = sheetinfo.init();
				sheetinfo.added = true;
			  }
			}
			
			// Transition
			sheetengine.scene.translateBackground
			(
			  {x:oldcentertile.x*250,y:oldcentertile.y*250}, 
			  {x:centertile.x*250,y:centertile.y*250}
			);
		}
		
	  /**********************************/
	 /*          PLAYER                     */
	/*********************************/
      
      // generate a density map from the sheets
	  var densityMap = new sheetengine.DensityMap(5);
      densityMap.addSheets(sheetengine.sheets);
      
      // fonction d'animation du personnage
      function animateCharacter(character) 
	  {
        var state = Math.floor( (character.animationState % 8) / 2);
        var dir = (state == 0 || state == 3) ? 1 : -1;
        
        character.rotateSheet(character.leg1, {x:0,y:0,z:8}, {x:1,y:0,z:0}, dir * Math.PI/8);
        character.rotateSheet(character.leg2, {x:0,y:0,z:8}, {x:1,y:0,z:0}, -dir * Math.PI/8);
      }      
      
      // définit un caractère
      var character = defineCharacter({x:0,y:0,z:0});
	  loadAndRemoveSheets({x:0,y:0}, centertile);

      // draw initial scene
      sheetengine.calc.calculateAllSheets();
      sheetengine.drawing.drawScene(true);
      
      // keyboard events
      var keys = {u:0,d:0,l:0,r:0};
      var jumpspeed = 0;
      var jump = 0;
	  
      function setKeys(event, val) {
        var keyProcessed = 0;
          
        if (event.keyCode == '38' || event.keyCode == '87') {
          keys.u = val;
          keyProcessed = 1;
        }
        if (event.keyCode == '37' || event.keyCode == '65') {
          keys.l = val;
          keyProcessed = 1;
        }
        if (event.keyCode == '39' || event.keyCode == '68') {
          keys.r = val;
          keyProcessed = 1;
        }
        if (event.keyCode == '40' || event.keyCode == '83') {
          keys.d = val;
          keyProcessed = 1;
        }
        if (event.keyCode == '32') {
          if (jump == 0 && val == 1) {
            jump = 1;
            jumpspeed = 15;
          }
          keyProcessed = 1;
        }
        if (keyProcessed)
          event.preventDefault();
      }
      
      window.onkeydown = function(event) { setKeys(event, 1); };
      window.onkeyup = function(event) { setKeys(event, 0); };

      // main loop
      function mainloop()
	  {
        var dx = 0;
        var dy = 0;
        if (keys.u) {
          dy = -5;
          character.setOrientation({alphaD:0,betaD:0,gammaD:180});
        }
        if (keys.d) {
          dy = 5;
          character.setOrientation({alphaD:0,betaD:0,gammaD:0});
        }
        if (keys.l) {
          dx = -5;
          character.setOrientation({alphaD:0,betaD:0,gammaD:270});
        }
        if (keys.r) {
          dx = 5;
          character.setOrientation({alphaD:0,betaD:0,gammaD:90});
        }
        if (dx != 0)
          dy = 0;
        
        // character constantly falls
        jumpspeed -= 2;
        
        // get allowed target point. character's height is 20, and character can climb up to 10 pixels
        var targetInfo = densityMap.getTargetPoint(character.centerp, {x:dx, y:dy, z:jumpspeed}, 20, 10);
        var allowMove = targetInfo.allowMove;
        var targetp = targetInfo.targetp;
        var stopFall = targetInfo.stopFall;
        
        // if character stops falling, reset jump info
        if (stopFall) {
          jumpspeed = 0;
          jump = 0;
        }
        
        var moved = targetp.x != character.centerp.x || targetp.y != character.centerp.y || targetp.z != character.centerp.z;
        if (moved && allowMove) 
		{
          // move character to target point
          character.setPosition(targetp);

          animateCharacter(character);
          character.animationState++;
          
		 	 // Vérifie si le joueur a bougé loin du centre, dans ce cas la on chargera la nouvelle zone
			var oldcentertile = { x:centertile.x, y:centertile.y };
			centertile.x = Math.round(character.centerp.x / 300);
			centertile.y = Math.round(character.centerp.y / 300);
				
			if (centertile.x != oldcentertile.x || centertile.y != oldcentertile.y) 
			{
			  loadAndRemoveSheets(oldcentertile, centertile);
				  
			  // Calcul toutes les formes et redessine la scène entière
			  sheetengine.calc.calculateAllSheets();
			  sheetengine.drawing.drawScene(true);				
			} else 
			{
			  // calcul des formes qui ont changés et redessine les nouvelle régions
			  sheetengine.calc.calculateChangedSheets();
			  sheetengine.drawing.drawScene();
			}
		  
		  // Camera centré sur l'objet joueur crée
			sheetengine.scene.setCenter(character.centerp);
          
          // calculate sheets and draw scene
          sheetengine.calc.calculateChangedSheets();
          sheetengine.drawing.drawScene();
        }
      };
      setInterval(mainloop, 30);
      
}
	   