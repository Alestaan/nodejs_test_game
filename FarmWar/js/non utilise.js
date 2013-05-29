
      canvasElement.onmousemove = function(event) 
	  {
	  
		// On obtient les coordonnés au survole de l'objet
        var puv = {
          u:event.clientX - sheetengine.canvas.offsetLeft, 
          v:event.clientY - sheetengine.canvas.offsetTop
        };
        
		// vérifie si l'objet a été survolé ou pas
        var objhovered = isObjectHovered(puv);
        if (objhovered != hover)
          scenechanged = true;
        hover = objhovered;
      }
	 
      
      function isObjectHovered(puv) 
	  {
        var ouv = sheetengine.drawing.getPointuv(obj.centerp);
        if (puv.u > ouv.u - 20 &&
          puv.u < ouv.u - 20 + 40 &&
          puv.v > ouv.v - 30 &&
          puv.v < ouv.v - 30 + 40)
          return true;
        
        return false;
      }			
	  
	  
	  // dans l'evenement on click
	  // Vérifie si l'objet a été cliqué
			if (hover) 
			{
			  hover = false;
			  // Bouge l'objet a une position au hasard
			  obj.setPosition({x:Math.random() * 500 - 250, y:Math.random() * 500 - 250, z:0});
			  scenechanged = true;
			  return;
			}
	  
	  
	  
	  //main loop
	  // fonction qui dessine un carré blanc au hover de l'objet
	    if (hover) 
		  { 
            var ctx = sheetengine.context;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = '#FFF';
            var ouv = sheetengine.drawing.getPointuv(obj.centerp);
            ctx.strokeRect(Math.round(ouv.u) - 20, Math.round(ouv.v) - 30, 40, 40);
            ctx.restore();
          }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 //save
	  /**********************************/
	 /*          PLAYER                     */
	/*********************************/
      
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
	 
      // Déssine les objets rajouter
      sheetengine.calc.calculateAllSheets();
      sheetengine.drawing.drawScene(true);
      
	  
      function setKeys(event, val) 
	  {
	  
      var target = null;
      var hover = false;
      var scenechanged = false;

      // Fonctions qui gère les dépacements à la souris
      canvasElement.onclick = function(event) 
		{
			// Variables pour obtenir les coordonnés des cliques de souris
			var puv = {
			  u:event.clientX - sheetengine.canvas.offsetLeft, 
			  v:event.clientY - sheetengine.canvas.offsetTop
			};
			

			
			// transforme les coordonnés du monde en coordonnés système
			var pxy = sheetengine.transforms.inverseTransformPoint
			({
			  u:puv.u + sheetengine.scene.center.u, 
			  v:puv.v + sheetengine.scene.center.v
			});
			
			// Calcul l'angle de rotation
			var angle = -Math.atan2(pxy.y - character.centerp.y, pxy.x - character.centerp.x) + Math.PI/2;

			// définit la position cible d'un caractère
			target = pxy;
			scenechanged = true;

			// définit l'orientation absolue avec respect de la position initial de l'objet /*
		   character.setOrientation({alpha: 0, beta: 0, gamma: angle});
		}
	  

	  
	    // Boucle principale
      function mainloop() 
	  {
        var move = 0;
		
        if (target) 
		{
          if (Math.abs(target.x-character.centerp.x) > 5 || Math.abs(target.y-character.centerp.y) > 5)
            move = 5;
		}
		
		if (move) 
		{
			// Calcule afin de définir l'orinetation du personnage
			var angle = character.rot.gamma;
			var dx = Math.sin(angle) * move;
			var dy = Math.cos(angle) * move;
					
			// Déplacement du personnage au point ciblé
			character.move({x:dx,y:dy,z:0});

			animateCharacter(character);
			character.animationState++;

			scenechanged = true;
			  
			 // Vérifie si le joueur a bougé loin du centre, dans ce cas la on chargera la nouvelle zone
			var oldcentertile = { x:centertile.x, y:centertile.y };
			centertile.x = Math.round(character.centerp.x / 200);
			centertile.y = Math.round(character.centerp.y / 200);
				
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
		}
	    
		// Enlève la croix si le personnage a atteind sa destination
        if (target && !move) 
		{
          target = null;
          scenechanged = true;
        }
		    
        if (scenechanged) 
		{
          scenechanged = false;

			// Camera centré sur l'objet joueur crée
			sheetengine.scene.setCenter(character.centerp);
	 
			// Mise à jours et calcul des dessins afin de les redessiner
			sheetengine.calc.calculateChangedSheets();
			sheetengine.drawing.drawScene();
          
          if (target) 
		  {
            // Déssine un X à l'emplacement cliqué
            var ctx = sheetengine.context;
            ctx.save();
            ctx.scale(1, 0.5);
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#FFF';
            var puv = sheetengine.drawing.getPointuv(target);
            ctx.beginPath();
            ctx.moveTo(puv.u-5, puv.v*2-5);
            ctx.lineTo(puv.u+5, puv.v*2+5);
            ctx.moveTo(puv.u+5, puv.v*2-5);
            ctx.lineTo(puv.u-5, puv.v*2+5);
            ctx.stroke();
            ctx.restore();
          }
        }
      }; setInterval(mainloop, 30);